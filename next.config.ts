import type { NextConfig } from 'next';
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
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

if (process.env.NODE_ENV === 'development') {
  (async () => {
    await setupDevPlatform();
  })();
}

export default withContentlayer(nextConfig);
