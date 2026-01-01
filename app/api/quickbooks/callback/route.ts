import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  exchangeAuthorizationCode,
  saveTokens,
} from '@/lib/integrations/quickbooks';
import { env } from '@/env';

// Import the type we need
type QuickBooksCloudflareEnv = {
  KV_QUICKBOOKS?: KVNamespace;
};

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { nextUrl, cookies, headers } = request;
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
  const isAdminSetup = state === 'admin-setup';

  if (!isAdminSetup && (!storedState || storedState !== state)) {
    console.error('CSRF state validation failed');
    return NextResponse.json(
      { error: 'Invalid state parameter. Possible CSRF attack.' },
      { status: 403 }
    );
  }

  // Clear the state cookie after validation
  const response = new NextResponse();
  response.cookies.delete('qb_oauth_state');

  const clientId = env.QUICKBOOKS_CLIENT_ID;
  const clientSecret = env.QUICKBOOKS_CLIENT_SECRET;

  // Get the actual host from headers
  const host = headers.get('host') || 'localhost:3000';
  const protocol =
    headers.get('x-forwarded-proto') ||
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
      refreshToken: tokens.refresh_token,
      realmId,
      environment: env.QUICKBOOKS_ENVIRONMENT || 'sandbox',
    };

    // Get Cloudflare environment if available
    const cfEnv = (request as { env?: QuickBooksCloudflareEnv }).env;

    if (isAdminSetup) {
      // Admin setup - show tokens directly
      const html = `<!DOCTYPE html>
      <html>
      <head><title>Admin Setup Complete</title></head>
      <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px;">
        <h1>🔧 Admin Setup Complete</h1>
        <p><strong>Add these to your .env.local:</strong></p>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;">
QUICKBOOKS_REFRESH_TOKEN=${tokens.refresh_token}
QUICKBOOKS_REALM_ID=${realmId}
        </pre>
        <p>Then restart your dev server.</p>
      </body>
      </html>`;

      return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const saved = await saveTokens(tokenData, cfEnv);

    if (saved) {
      console.log('✅ QuickBooks tokens automatically saved to Cloudflare KV');
    } else {
      // Fallback for development/local environments
      console.log('');
      console.log(
        '🔑 QuickBooks OAuth Setup - Copy these to your environment variables:'
      );
      console.log(`QUICKBOOKS_CLIENT_ID=${clientId}`);
      console.log(`QUICKBOOKS_REFRESH_TOKEN=${tokens.refresh_token}`);
      console.log(`QUICKBOOKS_REALM_ID=${realmId}`);
      console.log(
        `QUICKBOOKS_ENVIRONMENT=${env.QUICKBOOKS_ENVIRONMENT || 'sandbox'}`
      );
      console.log('');
      console.log(
        'Add these to your .env.local file and restart your dev server.'
      );
      console.log('');
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
      <p><strong>Realm ID:</strong> ${realmId}</p>
      <p><strong>Environment:</strong> ${env.QUICKBOOKS_ENVIRONMENT || 'sandbox'}</p>
      ${saved ? '<p>Tokens have been securely saved to Cloudflare KV.</p>' : '<p>Check your server logs for token details.</p>'}
      <p>You can close this window now.</p>
    </body>
    </html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        ...response.headers,
      },
    });
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
