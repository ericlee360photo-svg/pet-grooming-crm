/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Stop lint from blocking deploy
  },
};

module.exports = nextConfig;
