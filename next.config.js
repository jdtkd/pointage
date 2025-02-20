/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Suppression de appDir car c'est maintenant par défaut dans Next.js 14+
    // Suppression de turbo car nous n'utilisons plus turbopack
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  transpilePackages: ['react-leaflet'],
}

module.exports = nextConfig 