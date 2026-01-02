import { env } from '@/env';

// Cloudflare Workers environment interface
export interface QuickBooksCloudflareEnv {
  KV_QUICKBOOKS?: KVNamespace;
}

/**
 * QuickBooks API integration
 * Handles OAuth token management and data fetching from QuickBooks API
 *
 * ENVIRONMENT CONFIGURATION:
 * ==========================
 * This integration supports both sandbox (development) and production environments.
 *
 * Environment Variable: QUICKBOOKS_ENVIRONMENT
 * - Set to 'sandbox' for development/testing (default in development mode)
 * - Set to 'production' for live production data (default in production mode)
 *
 * Base URLs:
 * - Sandbox API: https://sandbox-quickbooks.api.intuit.com
 * - Production API: https://quickbooks.api.intuit.com
 * - OAuth (both): https://appcenter.intuit.com/connect/oauth2
 * - Token Exchange (both): https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer
 *
 * Required Environment Variables:
 * - QUICKBOOKS_CLIENT_ID: Your QuickBooks app client ID
 * - QUICKBOOKS_CLIENT_SECRET: Your QuickBooks app client secret
 * - QUICKBOOKS_REFRESH_TOKEN: OAuth refresh token (obtained via OAuth flow)
 * - QUICKBOOKS_REALM_ID: QuickBooks company/realm ID
 * - QUICKBOOKS_ENVIRONMENT: 'sandbox' or 'production' (optional, auto-detected)
 *
 * RATE LIMITING:
 * ==============
 * The integration handles rate limiting (429 errors) with automatic retries:
 * - Exponential backoff up to 3 retries
 * - Respects Retry-After headers when provided
 * - Logs warnings for rate limit events
 *
 * TOKEN CACHING:
 * ==============
 * Access tokens are cached in-memory to reduce API calls:
 * - Development: Cached for ~55 minutes (5 min safety margin before 1hr expiry)
 * - Cloudflare Production: No caching (stateless workers) - tokens refresh on each call
 * - Performance: Acceptable since QuickBooks API calls are infrequent
 * - Future: Consider Cloudflare KV for distributed token caching if needed
 *
 * LOCAL DEVELOPMENT SETUP:
 * ========================
 * 1. Create a QuickBooks app in the Intuit Developer Portal (sandbox mode)
 * 2. Set redirect URI: http://localhost:3000/api/quickbooks/callback
 * 3. Add to .env.local:
 *    QUICKBOOKS_CLIENT_ID=your_sandbox_client_id
 *    QUICKBOOKS_CLIENT_SECRET=your_sandbox_client_secret
 *    QUICKBOOKS_ENVIRONMENT=sandbox
 * 4. Visit /api/quickbooks/auth to initiate OAuth flow
 * 5. After authorization, add the refresh token and realm ID to .env.local
 *
 * PRODUCTION SETUP:
 * =================
 * 1. Create a production QuickBooks app in the Intuit Developer Portal
 * 2. Set redirect URI: https://yourdomain.com/api/quickbooks/callback
 * 3. Set environment variables in your deployment platform:
 *    QUICKBOOKS_CLIENT_ID=your_production_client_id
 *    QUICKBOOKS_CLIENT_SECRET=your_production_client_secret
 *    QUICKBOOKS_REFRESH_TOKEN=your_production_refresh_token
 *    QUICKBOOKS_REALM_ID=your_production_realm_id
 *    QUICKBOOKS_ENVIRONMENT=production
 * 4. Ensure all secrets are stored securely (never commit to git)
 */

// Type definitions for QuickBooks API responses
export interface QuickBooksTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  x_refresh_token_expires_in: number;
}

export interface QuickBooksQueryResponse<T> {
  QueryResponse?: {
    [key: string]: T[];
  };
  time?: string;
}

export interface QuickBooksEntity {
  Id: string;
  TxnDate: string;
  TotalAmt: number;
  EntityRef?: {
    name: string;
  };
  CustomerRef?: {
    name: string;
  };
  PrivateNote?: string;
  PaymentType?: string;
}

export interface QuickBooksTransaction {
  id: string;
  txnDate: string;
  amount: number;
  type: string;
  customerName?: string;
  vendorName?: string;
  description?: string;
  status: 'pending' | 'cleared' | 'reconciled';
}

// Constants
const API_TIMEOUT_MS = 10000; // 10 seconds

// Token cache - uses KV storage for Cloudflare Workers, in-memory for development
interface CachedToken {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
  lastRefreshed: number;
}

let tokenCache: CachedToken | null = null;

// Check if we should use caching (KV for Cloudflare, in-memory for Node.js)
const shouldCacheTokens = () => {
  return true; // Always cache, but use KV when available
};

// KV cache key for tokens
const TOKEN_CACHE_KEY = 'quickbooks_tokens_cache';

/**
 * Gets the QuickBooks API base URL based on environment
 * @param environment - 'sandbox' or 'production'
 * @returns The base URL for QuickBooks API calls
 */
function getQuickBooksApiBaseUrl(
  environment: 'sandbox' | 'production'
): string {
  return environment === 'sandbox'
    ? 'https://sandbox-quickbooks.api.intuit.com'
    : 'https://quickbooks.api.intuit.com';
}

// Discovery document URLs
const DISCOVERY_URLS = {
  sandbox:
    'https://developer.api.intuit.com/.well-known/openid_sandbox_configuration',
  production:
    'https://developer.api.intuit.com/.well-known/openid_configuration',
} as const;

// Discovery document interface
interface DiscoveryDocument {
  authorization_endpoint?: string;
  token_endpoint?: string;
  [key: string]: unknown;
}

// Cache for discovery documents
const discoveryCache: Record<string, DiscoveryDocument> = {};

/**
 * Fetches discovery document for the given environment
 * Caches the result to avoid repeated requests
 */
async function getDiscoveryDocument(
  environment: 'sandbox' | 'production'
): Promise<DiscoveryDocument | null> {
  const cacheKey = environment;

  if (discoveryCache[cacheKey]) {
    return discoveryCache[cacheKey];
  }

  try {
    const response = await fetch(DISCOVERY_URLS[environment], {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Discovery document fetch failed: ${response.status}`);
    }

    const doc = (await response.json()) as DiscoveryDocument;
    discoveryCache[cacheKey] = doc;
    return doc;
  } catch (error) {
    console.warn(
      `Failed to fetch discovery document for ${environment}:`,
      error
    );
    // Fallback to hardcoded URLs
    return null;
  }
}

/**
 * Gets the QuickBooks OAuth authorization URL based on environment
 * Uses discovery document when available, falls back to hardcoded URL
 */
export async function getQuickBooksAuthUrl(
  environment: 'sandbox' | 'production'
): Promise<string> {
  const discovery = await getDiscoveryDocument(environment);

  if (discovery?.authorization_endpoint) {
    return discovery.authorization_endpoint;
  }

  // Fallback to hardcoded URL (same for both environments per discovery docs)
  return 'https://appcenter.intuit.com/connect/oauth2';
}

/**
 * Gets the QuickBooks OAuth token exchange URL
 * Uses discovery document when available, falls back to hardcoded URL
 */
async function getQuickBooksOAuthTokenUrl(
  environment: 'sandbox' | 'production' = 'production'
): Promise<string> {
  const discovery = await getDiscoveryDocument(environment);

  if (discovery?.token_endpoint) {
    return discovery.token_endpoint;
  }

  // Fallback to hardcoded URL (same for both environments per discovery docs)
  return 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer';
}

/**
 * Escapes HTML special characters to prevent XSS
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Fetches a new access token using the refresh token
 * Implements caching to avoid unnecessary refresh calls
 * Handles refresh token rotation (changes every 24 hours per QuickBooks FAQ)
 */
export async function getAccessToken(
  clientId: string,
  clientSecret: string,
  refreshToken: string,
  cfEnv?: QuickBooksCloudflareEnv,
  environment: 'sandbox' | 'production' = 'production'
): Promise<{ accessToken: string; newRefreshToken?: string } | null> {
  // Check KV cache first if available
  if (cfEnv?.KV_QUICKBOOKS) {
    try {
      const cached = await cfEnv.KV_QUICKBOOKS.get(TOKEN_CACHE_KEY);
      if (cached) {
        const parsedCache: CachedToken = JSON.parse(cached);
        if (parsedCache.expiresAt > Date.now()) {
          return { accessToken: parsedCache.accessToken };
        }
      }
    } catch (error) {
      console.warn('Failed to read token cache from KV:', error);
    }
  }
  // Check in-memory cache for Node.js environments
  else if (
    shouldCacheTokens() &&
    tokenCache &&
    tokenCache.expiresAt > Date.now()
  ) {
    return { accessToken: tokenCache.accessToken };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const oauthUrl = await getQuickBooksOAuthTokenUrl(environment);
    const response = await fetch(oauthUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token refresh failed:', errorText);

      // Handle rate limiting (429 Too Many Requests)
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        console.warn(
          `Rate limited by QuickBooks API. Retry after: ${retryAfter || 'unknown'} seconds`
        );
      }

      return null;
    }

    const tokens = (await response.json()) as QuickBooksTokenResponse;

    // Cache the token (subtract 5 minutes from expiry for safety margin)
    const expiresInMs = (tokens.expires_in - 300) * 1000; // Convert to ms, subtract 5 min
    const now = Date.now();

    const cacheData: CachedToken = {
      accessToken: tokens.access_token,
      expiresAt: now + expiresInMs,
      refreshToken: tokens.refresh_token,
      lastRefreshed: now,
    };

    // Cache in KV if available (Cloudflare Workers)
    if (cfEnv?.KV_QUICKBOOKS) {
      try {
        await cfEnv.KV_QUICKBOOKS.put(
          TOKEN_CACHE_KEY,
          JSON.stringify(cacheData),
          {
            expirationTtl: Math.floor(expiresInMs / 1000), // TTL in seconds
          }
        );
      } catch (error) {
        console.warn('Failed to cache tokens in KV:', error);
      }
    }
    // Cache in memory for Node.js environments
    else {
      tokenCache = cacheData;
    }

    // Check if refresh token changed (happens every 24 hours per QuickBooks FAQ)
    const refreshTokenChanged = tokens.refresh_token !== refreshToken;

    if (refreshTokenChanged) {
      console.log('🔄 QuickBooks refresh token rotated (24hr security update)');

      // Save new refresh token to storage
      if (cfEnv?.KV_QUICKBOOKS) {
        try {
          const existingTokens =
            await cfEnv.KV_QUICKBOOKS.get('quickbooks_tokens');
          if (existingTokens) {
            const tokenData = JSON.parse(existingTokens);
            tokenData.refreshToken = tokens.refresh_token;
            tokenData.lastUpdated = new Date().toISOString();
            await cfEnv.KV_QUICKBOOKS.put(
              'quickbooks_tokens',
              JSON.stringify(tokenData)
            );
            console.log('✅ New refresh token saved to KV storage');
          }
        } catch (error) {
          console.warn('Failed to update refresh token in KV:', error);
        }
      }

      return {
        accessToken: tokens.access_token,
        newRefreshToken: tokens.refresh_token,
      };
    }

    return { accessToken: tokens.access_token };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Token refresh request timed out');
    } else {
      console.error('Error getting access token:', error);
    }
    return null;
  }
}

/**
 * Fetches QuickBooks entities of a specific type
 * Handles rate limiting and retries with exponential backoff
 */
async function fetchQuickBooksEntities<T extends QuickBooksEntity>(
  baseUrl: string,
  realmId: string,
  accessToken: string,
  entityType: string,
  mapEntity: (raw: T) => QuickBooksTransaction,
  retryCount = 0
): Promise<QuickBooksTransaction[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${baseUrl}/v3/company/${realmId}/query?query=SELECT * FROM ${entityType} MAXRESULTS 100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    // Handle rate limiting (429 Too Many Requests)
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const retryDelay = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : Math.min(1000 * Math.pow(2, retryCount), 30000);

      console.warn(
        `Rate limited when fetching ${entityType}. Retrying after ${retryDelay}ms (attempt ${retryCount + 1}/3)`
      );

      if (retryCount < 3) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        return fetchQuickBooksEntities(
          baseUrl,
          realmId,
          accessToken,
          entityType,
          mapEntity,
          retryCount + 1
        );
      }

      console.error(
        `Max retries reached for ${entityType} due to rate limiting`
      );
      return [];
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        `Failed to fetch ${entityType}:`,
        response.status,
        errorText
      );
      return [];
    }

    const data = (await response.json()) as QuickBooksQueryResponse<T>;
    const items = data?.QueryResponse?.[entityType] || [];
    return items.map(mapEntity);
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error(`Request to fetch ${entityType} timed out`);
    } else {
      console.error(`Error fetching ${entityType}:`, error);
    }
    return [];
  }
}

/**
 * Fetches all QuickBooks transactions (Purchases, Invoices, Payments, Deposits)
 */
// Cloudflare Workers compatible token storage
async function getStoredTokens(cfEnv?: QuickBooksCloudflareEnv) {
  // Try Cloudflare KV first (production)
  if (cfEnv?.KV_QUICKBOOKS) {
    try {
      console.log('[QuickBooks] Attempting to read tokens from KV...');
      const tokens = await cfEnv.KV_QUICKBOOKS.get('quickbooks_tokens');
      console.log(
        '[QuickBooks] KV get() result:',
        tokens ? `Found (${tokens.length} chars)` : 'null/undefined'
      );
      if (tokens) {
        console.log('[QuickBooks] ✅ Tokens found in KV, parsing...');
        try {
          const parsed = JSON.parse(tokens);
          console.log('[QuickBooks] Parsed tokens:', {
            hasClientId: !!parsed.clientId,
            hasClientSecret: !!parsed.clientSecret,
            hasRefreshToken: !!parsed.refreshToken,
            hasRealmId: !!parsed.realmId,
            environment: parsed.environment,
          });
          // Verify required fields
          if (
            parsed.clientId &&
            parsed.clientSecret &&
            parsed.refreshToken &&
            parsed.realmId
          ) {
            console.log(
              '[QuickBooks] ✅ All required fields present, using KV tokens'
            );
            return parsed;
          } else {
            console.warn(
              '[QuickBooks] ⚠️ Tokens in KV missing required fields:',
              {
                hasClientId: !!parsed.clientId,
                hasClientSecret: !!parsed.clientSecret,
                hasRefreshToken: !!parsed.refreshToken,
                hasRealmId: !!parsed.realmId,
              }
            );
          }
        } catch (parseError) {
          console.error(
            '[QuickBooks] ❌ Failed to parse tokens from KV:',
            parseError
          );
          console.error(
            '[QuickBooks] Raw tokens value (first 200 chars):',
            tokens.substring(0, 200)
          );
        }
      } else {
        console.log(
          '[QuickBooks] ⚠️ No tokens found in KV (key "quickbooks_tokens" returned null), falling back to environment variables'
        );
        // Try listing keys to see what's actually in KV
        try {
          // Note: KV doesn't have a list() method, but we can try other known keys
          const cacheTokens = await cfEnv.KV_QUICKBOOKS.get(
            'quickbooks_tokens_cache'
          );
          if (cacheTokens) {
            console.log(
              '[QuickBooks] Found quickbooks_tokens_cache in KV, but not quickbooks_tokens'
            );
          }
        } catch {
          // Ignore
        }
      }
      // If KV exists but key is missing, fall through to environment variables
    } catch (error) {
      console.error('[QuickBooks] ❌ Failed to read from KV:', error);
      if (error instanceof Error) {
        console.error('[QuickBooks] Error message:', error.message);
        console.error('[QuickBooks] Error stack:', error.stack);
      }
      // Fall through to environment variables on error
    }
  } else {
    console.log(
      '[QuickBooks] KV namespace not available, using environment variables'
    );
  }

  // Fallback to environment variables (development or KV not available)
  const envTokens = {
    clientId: env.QUICKBOOKS_CLIENT_ID,
    clientSecret: env.QUICKBOOKS_CLIENT_SECRET,
    refreshToken: env.QUICKBOOKS_REFRESH_TOKEN,
    realmId: env.QUICKBOOKS_REALM_ID,
    environment: env.QUICKBOOKS_ENVIRONMENT || 'sandbox',
  };

  console.log('[QuickBooks] Using environment variables:', {
    hasClientId: !!envTokens.clientId,
    hasClientSecret: !!envTokens.clientSecret,
    hasRefreshToken: !!envTokens.refreshToken,
    hasRealmId: !!envTokens.realmId,
    environment: envTokens.environment,
  });

  return envTokens;
}

async function saveTokens(
  tokens: {
    refreshToken: string;
    realmId: string;
    clientId?: string;
    clientSecret?: string;
    environment?: string;
  },
  cfEnv?: QuickBooksCloudflareEnv
) {
  console.log('[QuickBooks saveTokens] Called with:', {
    hasKVNamespace: !!cfEnv?.KV_QUICKBOOKS,
    hasClientId: !!tokens.clientId,
    hasClientSecret: !!tokens.clientSecret,
    hasRefreshToken: !!tokens.refreshToken,
    hasRealmId: !!tokens.realmId,
  });

  // Try Cloudflare KV first (production)
  if (cfEnv?.KV_QUICKBOOKS) {
    try {
      console.log('[QuickBooks saveTokens] Attempting to save to KV...');
      await cfEnv.KV_QUICKBOOKS.put(
        'quickbooks_tokens',
        JSON.stringify(tokens)
      );
      console.log('[QuickBooks saveTokens] ✅ Tokens saved to Cloudflare KV');

      // Verify the save worked
      const verify = await cfEnv.KV_QUICKBOOKS.get('quickbooks_tokens');
      if (verify) {
        console.log(
          '[QuickBooks saveTokens] ✅ Verified: tokens can be read back from KV'
        );
      } else {
        console.warn(
          '[QuickBooks saveTokens] ⚠️ Warning: tokens saved but could not be read back'
        );
      }

      return true;
    } catch (error) {
      console.error('[QuickBooks saveTokens] ❌ Failed to save to KV:', error);
      if (error instanceof Error) {
        console.error('[QuickBooks saveTokens] Error message:', error.message);
        console.error('[QuickBooks saveTokens] Error stack:', error.stack);
      }
    }
  } else {
    console.log(
      '[QuickBooks saveTokens] ⚠️ KV namespace not available in cfEnv'
    );
  }

  // Fallback: Try to update Cloudflare Secrets via API
  // This allows automatic persistence of tokens when KV is not available
  // Update refresh token and realm ID (obtained from OAuth callback)
  let secretsUpdated = false;

  if (tokens.refreshToken) {
    console.log(
      '[QuickBooks saveTokens] Attempting to update QUICKBOOKS_REFRESH_TOKEN via Cloudflare API...'
    );
    const updated = await updateCloudflareSecret(
      'QUICKBOOKS_REFRESH_TOKEN',
      tokens.refreshToken,
      tokens.environment
    );
    if (updated) {
      console.log(
        '[QuickBooks saveTokens] ✅ QUICKBOOKS_REFRESH_TOKEN updated in Cloudflare Secrets via API'
      );
      secretsUpdated = true;
    }
  }

  if (tokens.realmId) {
    console.log(
      '[QuickBooks saveTokens] Attempting to update QUICKBOOKS_REALM_ID via Cloudflare API...'
    );
    const updated = await updateCloudflareSecret(
      'QUICKBOOKS_REALM_ID',
      tokens.realmId,
      tokens.environment
    );
    if (updated) {
      console.log(
        '[QuickBooks saveTokens] ✅ QUICKBOOKS_REALM_ID updated in Cloudflare Secrets via API'
      );
      secretsUpdated = true;
    }
  }

  if (secretsUpdated) {
    return true;
  }

  // Final fallback: log for manual setup (development)
  if (env.NODE_ENV === 'development') {
    console.log(
      '🔑 QuickBooks OAuth Setup - Copy these to your environment variables:'
    );
    console.log(
      `QUICKBOOKS_REFRESH_TOKEN=${tokens.refreshToken.substring(0, 10)}...${tokens.refreshToken.slice(-4)} (masked)`
    );
    console.log(
      '⚠️  Full token available in OAuth callback response - check browser network tab'
    );
    // Validate realmId format (typically numeric) before logging
    const safeRealmId = /^[0-9]+$/.test(tokens.realmId)
      ? tokens.realmId
      : '[INVALID_FORMAT]';
    console.log(`QUICKBOOKS_REALM_ID=${safeRealmId}`);
    if (tokens.clientId) console.log(`QUICKBOOKS_CLIENT_ID=${tokens.clientId}`);
    if (tokens.environment)
      console.log(`QUICKBOOKS_ENVIRONMENT=${tokens.environment}`);
  }
  return false;
}

/**
 * Updates a Cloudflare Worker secret via the Cloudflare API
 * Used to automatically persist refresh token rotations
 * Requires CLOUDFLARE_API_TOKEN and optionally CLOUDFLARE_ACCOUNT_ID
 */
async function updateCloudflareSecret(
  secretName: string,
  secretValue: string,
  qbEnvironment?: string
): Promise<boolean> {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  console.log(
    '[QuickBooks updateCloudflareSecret] Attempting to update secret:',
    {
      secretName,
      hasApiToken: !!apiToken,
      hasAccountId: !!accountId,
      qbEnvironment,
    }
  );

  if (!apiToken) {
    console.log(
      '[QuickBooks updateCloudflareSecret] ⚠️ CLOUDFLARE_API_TOKEN not available - skipping automatic secret update'
    );
    console.log(
      '[QuickBooks updateCloudflareSecret] 💡 To enable automatic secret updates, add CLOUDFLARE_API_TOKEN as a secret to your worker'
    );
    return false;
  }

  try {
    // Determine worker name and environment based on QuickBooks environment
    // Default to dev if not specified
    const envName =
      qbEnvironment === 'production' || process.env.NODE_ENV === 'production'
        ? 'prod'
        : 'dev';
    const workerName = `allthingslinux-${envName}`;

    // Cloudflare API endpoint for updating secrets
    // Use account-level API if accountId is available, otherwise use user-level
    const baseUrl = accountId
      ? `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}`
      : `https://api.cloudflare.com/client/v4/workers/scripts/${workerName}`;

    const response = await fetch(`${baseUrl}/secrets`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: secretName,
        text: secretValue,
        type: 'secret_text',
      }),
    });

    if (response.ok) {
      console.log(
        `[QuickBooks updateCloudflareSecret] ✅ Successfully updated ${secretName} in Cloudflare Secrets (worker: ${workerName})`
      );
      return true;
    } else {
      const errorText = await response.text();
      console.warn(
        `[QuickBooks updateCloudflareSecret] ⚠️ Failed to update ${secretName} (${response.status}): ${errorText.substring(0, 200)}`
      );
      return false;
    }
  } catch (error) {
    console.warn(
      `[QuickBooks updateCloudflareSecret] ⚠️ Error updating secret ${secretName}:`,
      error instanceof Error ? error.message : String(error)
    );
    return false;
  }
}

export async function fetchQuickBooksTransactions(
  cfEnv?: QuickBooksCloudflareEnv
): Promise<QuickBooksTransaction[]> {
  console.log('[QuickBooks] Fetching transactions...');
  const tokens = await getStoredTokens(cfEnv);

  if (
    !tokens.clientId ||
    !tokens.clientSecret ||
    !tokens.refreshToken ||
    !tokens.realmId
  ) {
    console.error(
      '[QuickBooks] ❌ Credentials not configured - missing fields:',
      {
        hasClientId: !!tokens.clientId,
        hasClientSecret: !!tokens.clientSecret,
        hasRefreshToken: !!tokens.refreshToken,
        hasRealmId: !!tokens.realmId,
      }
    );
    return [];
  }

  console.log(
    '[QuickBooks] ✅ All credentials present, proceeding with API calls'
  );

  // Get access token (with caching and refresh token rotation handling)
  const tokenResult = await getAccessToken(
    tokens.clientId,
    tokens.clientSecret,
    tokens.refreshToken,
    cfEnv,
    tokens.environment
  );
  if (!tokenResult) {
    console.error('Failed to get access token');
    return [];
  }

  const { accessToken, newRefreshToken } = tokenResult;

  // If refresh token was rotated, we should update our stored tokens
  if (newRefreshToken && newRefreshToken !== tokens.refreshToken) {
    console.log('🔄 Updating stored refresh token due to rotation');
    await saveTokens(
      {
        ...tokens,
        refreshToken: newRefreshToken,
      },
      cfEnv
    );
  }

  // Get the correct base URL based on environment
  const baseUrl = getQuickBooksApiBaseUrl(tokens.environment);

  try {
    // Fetch all entity types in parallel
    const [purchases, invoices, payments, deposits] = await Promise.all([
      fetchQuickBooksEntities(
        baseUrl,
        tokens.realmId,
        accessToken,
        'Purchase',
        (purchase) => ({
          id: purchase.Id,
          txnDate: purchase.TxnDate,
          amount: -Math.abs(purchase.TotalAmt),
          type: 'Expense',
          vendorName: purchase.EntityRef?.name,
          description: purchase.PrivateNote || purchase.PaymentType || '',
          status: 'reconciled' as const,
        })
      ),
      fetchQuickBooksEntities(
        baseUrl,
        tokens.realmId,
        accessToken,
        'Invoice',
        (invoice) => ({
          id: invoice.Id,
          txnDate: invoice.TxnDate,
          amount: invoice.TotalAmt,
          type: 'Invoice',
          customerName: invoice.CustomerRef?.name,
          description: invoice.PrivateNote || '',
          status: 'pending' as const,
        })
      ),
      fetchQuickBooksEntities(
        baseUrl,
        tokens.realmId,
        accessToken,
        'Payment',
        (payment) => ({
          id: payment.Id,
          txnDate: payment.TxnDate,
          amount: payment.TotalAmt,
          type: 'Payment',
          customerName: payment.CustomerRef?.name,
          description: payment.PrivateNote || '',
          status: 'cleared' as const,
        })
      ),
      fetchQuickBooksEntities(
        baseUrl,
        tokens.realmId,
        accessToken,
        'Deposit',
        (deposit) => ({
          id: deposit.Id,
          txnDate: deposit.TxnDate,
          amount: deposit.TotalAmt,
          type: 'Deposit',
          customerName: deposit.PrivateNote || 'Bank Deposit',
          description: deposit.PrivateNote || '',
          status: 'cleared' as const,
        })
      ),
    ]);

    // Combine all transactions
    const transactions = [...purchases, ...invoices, ...payments, ...deposits];

    // Sort by date (newest first)
    transactions.sort(
      (a, b) => new Date(b.txnDate).getTime() - new Date(a.txnDate).getTime()
    );

    return transactions;
  } catch (error) {
    console.error('Error fetching QuickBooks transactions:', error);
    return [];
  }
}

/**
 * Exchanges authorization code for access and refresh tokens
 */
export async function exchangeAuthorizationCode(
  code: string,
  redirectUri: string,
  clientId: string,
  clientSecret: string,
  environment: 'sandbox' | 'production' = 'production'
): Promise<QuickBooksTokenResponse | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const oauthUrl = await getQuickBooksOAuthTokenUrl(environment);
    const response = await fetch(oauthUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token exchange failed:', errorText);

      // Handle rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After');
        console.warn(
          `Rate limited during token exchange. Retry after: ${retryAfter || 'unknown'} seconds`
        );
      }

      return null;
    }

    return (await response.json()) as QuickBooksTokenResponse;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Token exchange request timed out');
    } else {
      console.error('Error exchanging authorization code:', error);
    }
    return null;
  }
}

/**
 * Helper function to escape HTML in template strings
 */
export { saveTokens };
