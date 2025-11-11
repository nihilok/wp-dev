<?php
/**
 * Headless WordPress Theme Functions
 * 
 * This file contains theme setup and REST API customizations
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme setup
 */
function headless_theme_setup() {
    // Enable featured images
    add_theme_support('post-thumbnails');
    
    // Enable title tag
    add_theme_support('title-tag');
    
    // Enable HTML5 support
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'headless'),
        'footer' => __('Footer Menu', 'headless'),
    ));
}
add_action('after_setup_theme', 'headless_theme_setup');

/**
 * Enable CORS for REST API
 */
function headless_add_cors_headers() {
    $origin = get_http_origin();
    
    // Get allowed origins from WordPress option or use defaults
    // For production, set this via wp-admin or wp-config.php:
    // define('HEADLESS_ALLOWED_ORIGINS', 'https://yourdomain.com,https://www.yourdomain.com');
    $allowed_origins = defined('HEADLESS_ALLOWED_ORIGINS') 
        ? explode(',', HEADLESS_ALLOWED_ORIGINS)
        : ['http://localhost:3000', 'http://localhost:8000'];
    
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type');
    }
    
    if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
        status_header(200);
        exit();
    }
}
add_action('rest_api_init', 'headless_add_cors_headers', 15);

/**
 * Add custom fields to REST API response
 */
function headless_register_rest_fields() {
    // Add featured image URL to posts
    register_rest_field('post', 'featured_image_url', array(
        'get_callback' => function($post) {
            if (has_post_thumbnail($post['id'])) {
                $image = wp_get_attachment_image_src(
                    get_post_thumbnail_id($post['id']),
                    'large'
                );
                return $image ? $image[0] : null;
            }
            return null;
        },
        'schema' => array(
            'description' => 'Featured image URL',
            'type' => 'string',
        ),
    ));
    
    // Add author name to posts
    register_rest_field('post', 'author_name', array(
        'get_callback' => function($post) {
            return get_the_author_meta('display_name', $post['author']);
        },
        'schema' => array(
            'description' => 'Author display name',
            'type' => 'string',
        ),
    ));
}
add_action('rest_api_init', 'headless_register_rest_fields');

/**
 * Remove unnecessary WordPress features for headless setup
 */
function headless_cleanup() {
    // Remove emoji scripts (not needed for headless)
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
    
    // Remove WordPress version (security)
    remove_action('wp_head', 'wp_generator');
    
    // Remove RSD link
    remove_action('wp_head', 'rsd_link');
    
    // Remove Windows Live Writer link
    remove_action('wp_head', 'wlwmanifest_link');
}
add_action('init', 'headless_cleanup');

/**
 * Customize excerpt length
 */
function headless_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'headless_excerpt_length');

/**
 * Customize excerpt more string
 */
function headless_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'headless_excerpt_more');

/**
 * Allow SVG uploads
 * 
 * WARNING: SVG files can contain JavaScript and pose XSS security risks.
 * Only enable this if you trust all users who can upload files.
 * Consider implementing SVG sanitization for production use.
 * See: https://github.com/darylldoyle/svg-sanitizer
 */
function headless_allow_svg($mimes) {
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}
add_filter('upload_mimes', 'headless_allow_svg');
