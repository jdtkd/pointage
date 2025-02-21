/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  transpilePackages: ['react-leaflet'],
  output: 'standalone',
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@iconify/react']
  }
}

module.exports = nextConfig 