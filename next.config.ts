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
    removeConsole: true,
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

  // Add webpack configuration for non-Turbo builds
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'contentlayer/generated': './.contentlayer/generated',
    };
    return config;
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
