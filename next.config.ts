import type { NextConfig } from 'next';
import { withContentlayer } from 'next-contentlayer2';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  productionBrowserSourceMaps: false,

  // Performance optimizations
  compress: true,
  compiler: {
    // Remove console logs for better performance in production
    removeConsole: process.env.NODE_ENV === 'production' ? true : {
      exclude: ['error', 'warn'],
    },
    // Enable emotion optimization if used
    emotion: true,
    // Remove React properties in production
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Build optimizations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },

  // Enable SWC minification for faster builds
  swcMinify: true,

  // Output configuration for better caching
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  // Turbopack configuration moved from experimental
  experimental: {
    // mdxRs: true,
    cssChunking: true,
    // Optimize bundle analysis
    optimizeCss: true,
    // Use SWC for faster compilation
    swcTraceProfiling: false,
    // Enable build worker threads
    cpus: Math.max(1, Math.floor(require('os').cpus().length / 2)),
  },
  // Add headers for API endpoints
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ];
  },

  // Image optimizations
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'contrib.rocks',
      },
      {
        protocol: 'https' as const,
        hostname: 'allthingslinux.org',
      },
      {
        protocol: 'https' as const,
        hostname: 'dcbadge.limes.pink',
      },
      {
        protocol: 'https' as const,
        hostname: 'discord.gg',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment' as const,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optimized image settings for better performance
    formats: ['image/avif', 'image/webp'] as const,
    // Reduced device sizes for faster processing
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // Disable image optimization in build for faster builds
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default withContentlayer(nextConfig);

import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
