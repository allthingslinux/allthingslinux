import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

/**
 * Environment variable configuration using T3 Env
 * @see https://env.t3.gg/docs/nextjs
 *
 * This configuration works with both Next.js and Cloudflare Workers.
 * - For local development, use .env.local file
 * - For Wrangler development, use .dev.vars file
 * - For Cloudflare deployment, secrets are uploaded via environment-specific files:
 *   - Dev environment: .env.secrets.dev (sandbox credentials)
 *   - Prod environment: .env.secrets.prod (production credentials)
 */
// Helper to detect deployment environment (now static per worker)
// Each worker environment is hardcoded since we use separate workers
function getDeploymentEnvironment(): 'dev' | 'prod' {
  // Since we now use separate workers for dev/prod, we can hardcode this
  // The build process will set the appropriate value based on the worker environment
  return process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
}

// Helper to get environment variable with prefixed fallback
// In Cloudflare Workers, secrets are prefixed (DEV_*, PROD_*) for isolation
function getEnvVar(baseName: string): string | undefined {
  const env = getDeploymentEnvironment();
  const prefix = env === 'prod' ? 'PROD' : 'DEV';

  // Try prefixed version first (Cloudflare Workers with prefixed secrets)
  const prefixedName = `${prefix}_${baseName}`;
  const prefixedValue = process.env[prefixedName];
  if (prefixedValue) {
    return prefixedValue;
  }

  // Fallback to non-prefixed (local development, legacy, or vars)
  return process.env[baseName];
}

// Helper to determine QuickBooks environment with auto-detection
const getQuickBooksEnvironment = (): 'sandbox' | 'production' | undefined => {
  const explicitEnv = process.env.QUICKBOOKS_ENVIRONMENT as
    | 'sandbox'
    | 'production'
    | undefined;
  if (explicitEnv) {
    return explicitEnv;
  }

  // Auto-detect: prod deployment → production QuickBooks, dev → sandbox
  const deploymentEnv = getDeploymentEnvironment();
  return deploymentEnv === 'prod' ? 'production' : 'sandbox';
};

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
    QUICKBOOKS_REFRESH_TOKEN: z.string().optional(),
    QUICKBOOKS_REALM_ID: z.string().optional(),
    // QuickBooks Environment: 'sandbox' for development/testing, 'production' for live data
    // Defaults to 'sandbox' in development, 'production' in production (handled in runtimeEnv)
    QUICKBOOKS_ENVIRONMENT: z.enum(['sandbox', 'production']).optional(),
    // Admin key for QuickBooks API operations (token refresh, etc.)
    QUICKBOOKS_ADMIN_KEY: z.string().optional(),

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
    QUICKBOOKS_REFRESH_TOKEN: process.env.QUICKBOOKS_REFRESH_TOKEN,
    QUICKBOOKS_REALM_ID: process.env.QUICKBOOKS_REALM_ID,
    QUICKBOOKS_ENVIRONMENT: getQuickBooksEnvironment(),
    QUICKBOOKS_ADMIN_KEY: process.env.QUICKBOOKS_ADMIN_KEY,
    // Client variables
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GITHUB_REPO_OWNER: process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER,
    NEXT_PUBLIC_GITHUB_REPO_NAME: process.env.NEXT_PUBLIC_GITHUB_REPO_NAME,
  },

  /**
   * Configuration options
   */
  skipValidation: process.env.SKIP_ENV_VALIDATION === 'true',
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
 *
 * Uses prefixed secrets (DEV_*, PROD_*) based on runtime environment detection
 * Falls back to non-prefixed for local development
 */
export const cloudflareEnv = {
  // Server variables (with prefixed secret support)
  NODE_ENV: process.env.NODE_ENV,
  GITHUB_TOKEN: getEnvVar('GITHUB_TOKEN'),
  MONDAY_API_KEY: getEnvVar('MONDAY_API_KEY'),
  MONDAY_BOARD_ID: getEnvVar('MONDAY_BOARD_ID'),
  DISCORD_WEBHOOK_URL: getEnvVar('DISCORD_WEBHOOK_URL') as string | undefined,
  TRIGGER_SECRET_KEY: process.env.TRIGGER_SECRET_KEY, // Not prefixed (Trigger.dev handles separately)
  QUICKBOOKS_CLIENT_ID: getEnvVar('QUICKBOOKS_CLIENT_ID'),
  QUICKBOOKS_CLIENT_SECRET: getEnvVar('QUICKBOOKS_CLIENT_SECRET'),
  QUICKBOOKS_REFRESH_TOKEN: getEnvVar('QUICKBOOKS_REFRESH_TOKEN'),
  QUICKBOOKS_REALM_ID: getEnvVar('QUICKBOOKS_REALM_ID'),
  QUICKBOOKS_ENVIRONMENT: getQuickBooksEnvironment(),
  QUICKBOOKS_ADMIN_KEY: getEnvVar('QUICKBOOKS_ADMIN_KEY'),

  // Client variables (not prefixed - these are public anyway)
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
