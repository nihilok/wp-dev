<?php
/**
 * Plugin Name: WP-Dev API Extensions
 * Plugin URI: https://github.com/nihilok/wp-dev
 * Description: Custom REST API endpoints and extensions for headless WordPress
 * Version: 1.0.0
 * Author: WP-Dev Team
 * License: MIT
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register custom REST API routes
 */
add_action('rest_api_init', function () {
    
    // NOTE: All endpoints use '__return_true' for permission_callback,
    // allowing unauthenticated public access. This is intentional for a headless CMS
    // where content is meant to be publicly accessible. Consider implementing
    // rate limiting at the server/middleware level to prevent abuse.
    
    // Custom endpoint: Get site information
    register_rest_route('wp-dev/v1', '/site-info', array(
        'methods' => 'GET',
        'callback' => 'wpdev_get_site_info',
        'permission_callback' => '__return_true',
    ));
    
    // Custom endpoint: Get menu by location
    register_rest_route('wp-dev/v1', '/menu/(?P<location>[a-zA-Z0-9_-]+)', array(
        'methods' => 'GET',
        'callback' => 'wpdev_get_menu',
        'permission_callback' => '__return_true',
    ));
    
    // Custom endpoint: Search
    register_rest_route('wp-dev/v1', '/search', array(
        'methods' => 'GET',
        'callback' => 'wpdev_search',
        'permission_callback' => '__return_true',
    ));
    
});

/**
 * Get site information
 */
function wpdev_get_site_info($request) {
    return array(
        'name' => get_bloginfo('name'),
        'description' => get_bloginfo('description'),
        'url' => get_site_url(),
        'language' => get_bloginfo('language'),
        'timezone' => get_option('timezone_string'),
        'date_format' => get_option('date_format'),
        'time_format' => get_option('time_format'),
    );
}

/**
 * Get menu by location
 */
function wpdev_get_menu($request) {
    $location = $request['location'];
    
    $locations = get_nav_menu_locations();
    
    if (!isset($locations[$location])) {
        return new WP_Error('menu_not_found', 'Menu not found', array('status' => 404));
    }
    
    $menu_id = $locations[$location];
    $menu_items = wp_get_nav_menu_items($menu_id);
    
    if (!$menu_items) {
        return array();
    }
    
    // Format menu items
    $formatted_items = array();
    foreach ($menu_items as $item) {
        $formatted_items[] = array(
            'id' => $item->ID,
            'title' => $item->title,
            'url' => $item->url,
            'parent' => $item->menu_item_parent,
            'order' => $item->menu_order,
        );
    }
    
    return $formatted_items;
}

/**
 * Search content
 */
function wpdev_search($request) {
    $query = $request->get_param('q');
    
    if (!$query) {
        return new WP_Error('no_query', 'Search query required', array('status' => 400));
    }
    
    $args = array(
        's' => sanitize_text_field($query),
        'post_type' => 'post',
        'posts_per_page' => 10,
    );
    
    $search_query = new WP_Query($args);
    
    $results = array();
    
    if ($search_query->have_posts()) {
        while ($search_query->have_posts()) {
            $search_query->the_post();
            
            $results[] = array(
                'id' => get_the_ID(),
                'title' => get_the_title(),
                'slug' => get_post_field('post_name'),
                'excerpt' => get_the_excerpt(),
                'date' => get_the_date('c'),
                'url' => get_permalink(),
            );
        }
        wp_reset_postdata();
    }
    
    return array(
        'query' => $query,
        'total' => $search_query->found_posts,
        'results' => $results,
    );
}

/**
 * Add cache headers for REST API responses
 */
add_filter('rest_post_dispatch', function($result, $server, $request) {
    // Add cache headers for GET requests
    if ($request->get_method() === 'GET') {
        $server->send_header('Cache-Control', 'public, max-age=60');
    }
    return $result;
}, 10, 3);
