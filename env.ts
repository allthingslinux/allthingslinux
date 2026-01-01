import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Environment variable configuration using T3 Env
 * @see https://env.t3.gg/docs/nextjs
 *
 * This configuration works with both Next.js and Cloudflare Workers.
 * - For local development, use .env.local file
 * - For Cloudflare deployment, variables are set in the Cloudflare dashboard
 *   and/or in wrangler.toml vars section
 */
export const env = createEnv({
  /**
   * Server-side environment variables (not exposed to browser)
   */
  server: {
    // Private API tokens and keys
    GITHUB_TOKEN: z.string().optional(),
    MONDAY_API_KEY: z.string().optional(),
    MONDAY_BOARD_ID: z.string().optional(),
    DISCORD_WEBHOOK_URL: z.string().url().optional(),
    TRIGGER_SECRET_KEY: z.string().optional(),

    // QuickBooks API
    QUICKBOOKS_CLIENT_ID: z.string().optional(),
    QUICKBOOKS_CLIENT_SECRET: z.string().optional(),
    QUICKBOOKS_ACCESS_TOKEN: z.string().optional(),
    QUICKBOOKS_REFRESH_TOKEN: z.string().optional(),
    QUICKBOOKS_REALM_ID: z.string().optional(),

    // Server configuration
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
  },

  /**
   * Client-side variables (accessible in browser)
   */
  client: {
    // Application URLs and public configuration
    NEXT_PUBLIC_URL: z.string().url().default('https://allthingslinux.org'),
    NEXT_PUBLIC_API_URL: z
      .string()
      .url()
      .default('https://allthingslinux.org/api'),

    // Public repository information (no tokens, just public identifiers)
    NEXT_PUBLIC_GITHUB_REPO_OWNER: z.string().default('allthingslinux'),
    NEXT_PUBLIC_GITHUB_REPO_NAME: z.string().default('applications'),
  },

  /**
   * Map environment variables to the schemas
   */
  runtimeEnv: {
    // Server variables
    NODE_ENV: process.env.NODE_ENV,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    MONDAY_API_KEY: process.env.MONDAY_API_KEY,
    MONDAY_BOARD_ID: process.env.MONDAY_BOARD_ID,
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
    TRIGGER_SECRET_KEY: process.env.TRIGGER_SECRET_KEY,
    QUICKBOOKS_CLIENT_ID: process.env.QUICKBOOKS_CLIENT_ID,
    QUICKBOOKS_CLIENT_SECRET: process.env.QUICKBOOKS_CLIENT_SECRET,
    QUICKBOOKS_ACCESS_TOKEN: process.env.QUICKBOOKS_ACCESS_TOKEN,
    QUICKBOOKS_REFRESH_TOKEN: process.env.QUICKBOOKS_REFRESH_TOKEN,
    QUICKBOOKS_REALM_ID: process.env.QUICKBOOKS_REALM_ID,
    // Client variables
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GITHUB_REPO_OWNER: process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER,
    NEXT_PUBLIC_GITHUB_REPO_NAME: process.env.NEXT_PUBLIC_GITHUB_REPO_NAME,
  },

  /**
   * Configuration options
   */
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === 'true' ||
    process.env.NODE_ENV !== 'production',
  emptyStringAsUndefined: true,
  onValidationError: (error) => {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment variables, check server logs');
  },
});

/**
 * Cloudflare Workers environment fallback
 * This provides direct access to environment variables when running in Cloudflare Workers
 * since the t3-env validation may not work correctly in that environment
 */
export const cloudflareEnv = {
  // Server variables
  NODE_ENV: process.env.NODE_ENV,
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  MONDAY_API_KEY: process.env.MONDAY_API_KEY,
  MONDAY_BOARD_ID: process.env.MONDAY_BOARD_ID,
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  TRIGGER_SECRET_KEY: process.env.TRIGGER_SECRET_KEY,
  QUICKBOOKS_CLIENT_ID: process.env.QUICKBOOKS_CLIENT_ID,
  QUICKBOOKS_CLIENT_SECRET: process.env.QUICKBOOKS_CLIENT_SECRET,
  QUICKBOOKS_ACCESS_TOKEN: process.env.QUICKBOOKS_ACCESS_TOKEN,
  QUICKBOOKS_REFRESH_TOKEN: process.env.QUICKBOOKS_REFRESH_TOKEN,
  QUICKBOOKS_REALM_ID: process.env.QUICKBOOKS_REALM_ID,

  // Client variables
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_GITHUB_REPO_OWNER: process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER,
  NEXT_PUBLIC_GITHUB_REPO_NAME: process.env.NEXT_PUBLIC_GITHUB_REPO_NAME,
};

// Helper function to detect if running in Cloudflare Workers environment
export const isCloudflareWorker = () =>
  typeof process !== 'undefined' &&
  typeof process.env !== 'undefined' &&
  (process.env.CLOUDFLARE_WORKER === 'true' ||
    typeof globalThis.caches !== 'undefined');

// Combined environment that automatically selects the right source
export const runtimeEnv = isCloudflareWorker() ? cloudflareEnv : env;
