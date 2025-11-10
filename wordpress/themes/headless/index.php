<?php
/**
 * Headless WordPress Theme
 * 
 * This theme is designed for headless WordPress setups.
 * All content is delivered via REST API to the Next.js frontend.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Display message for anyone visiting WordPress directly
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php bloginfo('name'); ?> - Headless WordPress</title>
    <?php wp_head(); ?>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            padding: 2rem;
            max-width: 600px;
        }
        h1 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }
        p {
            font-size: 1.125rem;
            margin-bottom: 1.5rem;
            opacity: 0.9;
        }
        .links {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        a {
            background: white;
            color: #667eea;
            padding: 0.75rem 1.5rem;
            text-decoration: none;
            border-radius: 0.5rem;
            font-weight: 600;
            transition: transform 0.2s;
        }
        a:hover {
            transform: translateY(-2px);
        }
        .code {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 2rem 0;
            font-family: 'Courier New', monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Headless WordPress</h1>
        <p>
            This WordPress installation is configured as a headless CMS.
            Content is delivered via REST API to the Next.js frontend.
        </p>
        <div class="code">
            <strong>REST API:</strong><br>
            <?php echo esc_url(rest_url()); ?>
        </div>
        <div class="links">
            <a href="<?php echo admin_url(); ?>">WordPress Admin</a>
            <a href="<?php echo rest_url(); ?>">REST API</a>
            <a href="http://localhost:3000" target="_blank">Frontend</a>
        </div>
    </div>
    <?php wp_footer(); ?>
</body>
</html>
