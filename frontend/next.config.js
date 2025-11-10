/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'wordpress'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    PYTHON_API_URL: process.env.PYTHON_API_URL || 'http://localhost:8000',
    WP_API_URL: process.env.WP_API_URL || 'http://localhost:8080/wp-json',
  },
}

module.exports = nextConfig
