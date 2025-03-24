import type { NextConfig } from 'next';
import { withContentlayer } from 'next-contentlayer2';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],

  // Performance optimizations
  compress: true,
  compiler: {
    // Don't remove console logs in production as they help with debugging
    // Cloudflare Workers need these for proper diagnostics
    removeConsole: {
      exclude: ['error', 'warn', 'log'],
    },
  },

  // Build optimizations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: true,
    },
  },
  // Turbopack configuration
  experimental: {
    // mdxRs: true,
    cssChunking: true,
    turbo: {
      resolveAlias: {
        'contentlayer/generated': './.contentlayer/generated',
      },
    },
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

  // Add webpack configuration for non-Turbo builds
  // webpack: (config) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     'contentlayer/generated': './.contentlayer/generated',
  //   };
  //   return config;
  // },

  // Image optimizations
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: 'contrib.rocks',
      },
      {
        protocol: 'https' as const,
        hostname: '**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment' as const,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Image optimization settings
    formats: ['image/avif', 'image/webp'] as const,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default withContentlayer(nextConfig);

import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
