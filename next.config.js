/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'tesseract.js'],
  },
};

module.exports = nextConfig;
