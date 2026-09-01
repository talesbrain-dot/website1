/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Don't let lint warnings block a production deploy.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
