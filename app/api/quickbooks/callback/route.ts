import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  exchangeAuthorizationCode,
  saveTokens,
  escapeHtml,
  type QuickBooksCloudflareEnv,
} from '@/lib/integrations/quickbooks';
import { env } from '@/env';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const runtime = 'nodejs';

/**
 * Helper to get Cloudflare env with KV access
 * Uses getCloudflareContext() which is the recommended way in OpenNext Cloudflare
 * Falls back gracefully if not available
 */
function getCloudflareEnv(): QuickBooksCloudflareEnv | undefined {
  try {
    const context = getCloudflareContext();
    if (context?.env?.KV_QUICKBOOKS) {
      return context.env as QuickBooksCloudflareEnv;
    }
  } catch {
    // getCloudflareContext() throws if not in a request context or during SSG
    // This is expected and fine - we'll fall back to environment variables
  }
  return undefined;
}

export async function GET(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const { searchParams } = nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const realmId = searchParams.get('realmId');
  const errorParam = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle error case
  if (errorParam) {
    return NextResponse.json(
      {
        error: errorParam,
        error_description: errorDescription,
      },
      { status: 400 }
    );
  }

  // Validate we have the required parameters
  if (!code || !realmId) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  // Validate CSRF state token
  const storedState = cookies.get('qb_oauth_state')?.value;

  // Validate CSRF state token
  const isValidState = storedState && storedState === state;

  if (!isValidState) {
    console.error('CSRF state validation failed', {
      storedState: storedState
        ? `[${storedState.substring(0, 8)}...]`
        : 'missing',
      receivedState: state ? `[${state.substring(0, 8)}...]` : 'missing',
      allCookies: Array.from(cookies.getAll()).map((c) => c.name),
    });

    // Return helpful error page instead of JSON for better debugging
    const errorHtml = `<!DOCTYPE html>
    <html>
    <head><title>OAuth Error</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
      <h1>⚠️ OAuth State Validation Failed</h1>
      <p>This could be due to:</p>
      <ul>
        <li>Cookie not being set (check browser DevTools → Application → Cookies)</li>
        <li>Cross-domain cookie issues</li>
        <li>Session expired (try the OAuth flow again)</li>
      </ul>
      <p><strong>State cookie found:</strong> ${storedState ? 'Yes' : 'No'}</p>
      <p><strong>State parameter:</strong> ${state ? 'Present' : 'Missing'}</p>
      <p><a href="/api/quickbooks/admin-setup?admin=${encodeURIComponent(env.QUICKBOOKS_ADMIN_KEY || '')}">Try again</a></p>
    </body>
    </html>`;

    return new NextResponse(errorHtml, {
      headers: { 'Content-Type': 'text/html' },
      status: 403,
    });
  }

  // Clear the state cookie after validation

  const clientId = env.QUICKBOOKS_CLIENT_ID;
  const clientSecret = env.QUICKBOOKS_CLIENT_SECRET;

  // Build redirect URI from request headers (matches what admin-setup used)
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol =
    request.headers.get('x-forwarded-proto') ||
    request.headers.get('x-forwarded-scheme') ||
    (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = `${protocol}://${host}`;
  const redirectUri = `${baseUrl}/api/quickbooks/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Missing QuickBooks credentials' },
      { status: 500 }
    );
  }

  try {
    // Exchange authorization code for tokens
    const tokens = await exchangeAuthorizationCode(
      code,
      redirectUri,
      clientId,
      clientSecret,
      env.QUICKBOOKS_ENVIRONMENT || 'sandbox'
    );

    if (!tokens) {
      return NextResponse.json(
        { error: 'Token exchange failed' },
        { status: 500 }
      );
    }

    // Automatically save tokens
    const tokenData = {
      clientId,
      clientSecret,
      refreshToken: tokens.refresh_token,
      realmId,
      environment: env.QUICKBOOKS_ENVIRONMENT || 'sandbox',
    };

    // Get Cloudflare environment if available
    // Uses getCloudflareContext() which is the recommended way in OpenNext Cloudflare
    const cfEnv = getCloudflareEnv();

    console.log(
      '[QuickBooks Callback] KV namespace available:',
      !!cfEnv?.KV_QUICKBOOKS
    );
    console.log('[QuickBooks Callback] Attempting to save tokens...', {
      hasClientId: !!tokenData.clientId,
      hasClientSecret: !!tokenData.clientSecret,
      hasRefreshToken: !!tokenData.refreshToken,
      hasRealmId: !!tokenData.realmId,
      environment: tokenData.environment,
    });

    // Save tokens automatically
    const saved = await saveTokens(tokenData, cfEnv);

    if (saved) {
      console.log(
        '[QuickBooks Callback] ✅ QuickBooks tokens saved (KV or Secrets API)'
      );
    } else {
      console.warn(
        '[QuickBooks Callback] ⚠️ Tokens NOT saved to KV/Secrets (using environment variables)'
      );
      console.log('[QuickBooks Callback] 💡 To enable automatic token saving:');
      console.log(
        '[QuickBooks Callback]    1. Ensure KV namespace is accessible, OR'
      );
      console.log(
        '[QuickBooks Callback]    2. Add CLOUDFLARE_API_TOKEN as a secret to enable automatic secret updates'
      );
      // Fallback for development/local environments - only log in development
      if (env.NODE_ENV === 'development') {
        console.log('');
        console.log(
          '🔑 QuickBooks OAuth Setup - Copy these to your environment variables:'
        );
        console.log(`QUICKBOOKS_CLIENT_ID=${clientId}`);
        console.log(
          `QUICKBOOKS_REFRESH_TOKEN=${tokens.refresh_token.substring(0, 10)}...${tokens.refresh_token.slice(-4)} (masked)`
        );
        // Validate realmId format (typically numeric) before logging
        const safeRealmId = /^[0-9]+$/.test(realmId)
          ? realmId
          : '[INVALID_FORMAT]';
        console.log(`QUICKBOOKS_REALM_ID=${safeRealmId}`);
        console.log(
          `QUICKBOOKS_ENVIRONMENT=${env.QUICKBOOKS_ENVIRONMENT || 'sandbox'}`
        );
        console.log('');
        console.log(
          '⚠️  Full refresh token available in browser network tab or server logs.'
        );
        console.log(
          'Add these to your .env.local file and restart your dev server.'
        );
        console.log('');
      }
    }

    // Determine if this is setup mode
    const isSetupMode = !env.QUICKBOOKS_REFRESH_TOKEN;

    // Render success page
    const html = `<!DOCTYPE html>
    <html>
    <head><title>QuickBooks Authorization Success</title></head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center;">
      <h1>✅ Authorization Successful!</h1>
      <p>Your QuickBooks integration is now ${isSetupMode ? 'configured' : 'updated'}.</p>
      <p><strong>Realm ID:</strong> ${escapeHtml(realmId)}</p>
      <p><strong>Environment:</strong> ${escapeHtml(env.QUICKBOOKS_ENVIRONMENT || 'sandbox')}</p>
      ${saved ? '<p>✅ Tokens have been automatically saved to Cloudflare (KV or Secrets).</p>' : '<p>⚠️ Tokens are being used from environment variables. Check server logs for details.</p>'}
      <p>You can close this window now.</p>
    </body>
    </html>`;

    // Clear the state cookie after validation
    const finalResponse = new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
    finalResponse.cookies.delete('qb_oauth_state');
    return finalResponse;
  } catch (error) {
    console.error('Error in QuickBooks callback:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
