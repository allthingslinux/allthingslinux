import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  exchangeAuthorizationCode,
  saveTokens,
  escapeHtml,
  type QuickBooksCloudflareEnv,
} from '@/lib/integrations/quickbooks';
import { env } from '@/env';

// Extend NextRequest to include Cloudflare environment
interface CloudflareNextRequest extends NextRequest {
  env?: QuickBooksCloudflareEnv;
}

export const runtime = 'nodejs';

export async function GET(request: CloudflareNextRequest) {
  const { nextUrl, cookies } = request;
  const { searchParams } = nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const realmId = searchParams.get('realmId');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle error case
  if (error) {
    return NextResponse.json(
      {
        error,
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
      storedState: storedState ? '[REDACTED]' : 'missing',
      receivedState: state ? '[REDACTED]' : 'missing',
    });
    return NextResponse.json(
      { error: 'Invalid state parameter. Possible CSRF attack.' },
      { status: 403 }
    );
  }

  // Clear the state cookie after validation

  const clientId = env.QUICKBOOKS_CLIENT_ID;
  const clientSecret = env.QUICKBOOKS_CLIENT_SECRET;

  // Use canonical URL from environment (security: prevents header injection)
  const baseUrl = env.NEXT_PUBLIC_URL;
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
    const cfEnv = request.env;

    // Save tokens automatically
    const saved = await saveTokens(tokenData, cfEnv);

    if (saved) {
      console.log('✅ QuickBooks tokens automatically saved to Cloudflare KV');
    } else {
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
      ${saved ? '<p>Tokens have been securely saved to Cloudflare KV.</p>' : '<p>Check your server logs for token details.</p>'}
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
