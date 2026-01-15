import { cpus } from 'node:os';

import type { NextConfig } from 'next';
import { withContentlayer } from 'next-contentlayer2';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

// Validate environment variables at build time
import './env';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  productionBrowserSourceMaps: false,

  // Performance optimizations
  compress: true,
  compiler: {
    // Remove console logs for better performance in production
    // removeConsole:
    //   process.env.NODE_ENV === 'production'
    //     ? true
    //     : {
    //         exclude: ['error', 'warn'],
    //       },
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
    // Optimize bundle analysis - disabled to prevent critters issues
    // optimizeCss: true,
    // Use SWC for faster compilation
    swcTraceProfiling: false,
    // Enable build worker threads
    cpus: Math.max(1, Math.floor(cpus().length / 2)),
    // Disable server minification for easier performance profiling
    serverMinification: false,
    // Disable server source maps to prevent esbuild errors in OpenNext/Cloudflare builds
    serverSourceMaps: false,
    // Optimize webpack memory usage (reduces max memory, may slightly increase build time)
    webpackMemoryOptimizations: true,
  },
  // Performance profiling - disable webpack minification for better debugging
  webpack: (config, { isServer }) => {
    // Only disable minification in development for easier profiling
    if (process.env.NODE_ENV === 'development') {
      config.optimization.minimize = false;
    }
    
    // Ignore .map files to prevent esbuild errors in OpenNext/Cloudflare builds
    // This prevents webpack from trying to process source map files
    if (isServer) {
      // Only apply to server-side builds (where OpenNext/esbuild processes files)
      config.module.rules.push({
        test: /\.map$/,
        type: 'asset/source',
        generator: {
          emit: false, // Don't emit .map files
        },
      });
      
      // Ignore .map files in module resolution
      config.resolve.extensions = config.resolve.extensions.filter(
        (ext: string) => ext !== '.map'
      );
      
      // Add ignore plugin to completely skip .map files
      const { IgnorePlugin } = require('webpack');
      config.plugins.push(
        new IgnorePlugin({
          resourceRegExp: /\.map$/,
        })
      );
    }
    
    return config;
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
      {
        protocol: 'https' as const,
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https' as const,
        hostname: 'sprut.ai',
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
    // Disable image optimization for Cloudflare Workers deployment
    // Cloudflare Workers don't support Sharp, which is required for Next.js image optimization
    unoptimized: true,
  },
};

export default withContentlayer(nextConfig);

initOpenNextCloudflareForDev();
