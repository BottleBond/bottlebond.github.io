/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages
  output: 'export',

  // Trailing slashes for GitHub Pages compatibility
  trailingSlash: true,

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Enable strict mode for React
  reactStrictMode: true,
};

module.exports = nextConfig;
