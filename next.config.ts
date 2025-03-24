import type { NextConfig } from 'next';
import { withContentlayer } from 'next-contentlayer2';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // Performance optimizations
  // compress: true,
  // compiler: {
  // removeConsole: process.env.NODE_ENV === 'production',
  // },

  // Build optimizations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Still catch errors in development, but don't block production builds
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },

  // Turbopack configuration
  experimental: {
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
