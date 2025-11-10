# WordPress Configuration

This directory contains WordPress themes and plugins for the headless setup.

## Directory Structure

- `themes/` - Custom WordPress themes (typically minimal for headless)
- `plugins/` - Custom WordPress plugins for API extensions

## Headless WordPress Setup

For headless WordPress, you typically need:

1. **Minimal theme** - Just enough to satisfy WordPress requirements
2. **REST API customization** - Plugins to extend/customize the WordPress REST API
3. **Custom post types** - If using custom content types
4. **Authentication** - JWT or similar for secure API access

## Recommended Plugins

### Essential for Headless
- **WPGraphQL** - If you prefer GraphQL over REST
- **Advanced Custom Fields (ACF)** - For custom fields
- **ACF to REST API** - Expose ACF fields via REST API
- **JWT Authentication** - For secure API access

### Optional
- **Yoast SEO** - SEO management (data available via REST)
- **Custom Post Type UI** - Easy custom post type creation

## Sample Theme

A minimal headless theme is included in `themes/headless/`. This theme:
- Satisfies WordPress theme requirements
- Provides minimal templates (not used for rendering)
- Can be used to customize REST API responses

## Installation

1. Start WordPress with docker-compose:
   ```
   docker-compose up -d
   ```

2. Visit http://localhost:8080 and complete WordPress installation

3. Install recommended plugins via WordPress admin or WP-CLI

4. Activate the headless theme

## API Endpoints

WordPress REST API is available at:
- Base: http://localhost:8080/wp-json
- Posts: http://localhost:8080/wp-json/wp/v2/posts
- Pages: http://localhost:8080/wp-json/wp/v2/pages

See WordPress REST API documentation: https://developer.wordpress.org/rest-api/
