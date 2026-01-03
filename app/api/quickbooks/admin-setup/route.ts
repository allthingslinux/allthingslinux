import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { runtimeEnv as env } from '@/env';

// Simple admin-only OAuth setup
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Require admin key authentication in all environments
  const adminKey = request.nextUrl.searchParams.get('admin');

  // URL decode the admin key to handle special characters like +
  const decodedAdminKey = adminKey ? decodeURIComponent(adminKey) : null;

  if (decodedAdminKey !== env.QUICKBOOKS_ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clientId = env.QUICKBOOKS_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'Missing QUICKBOOKS_CLIENT_ID' },
      { status: 500 }
    );
  }

  // Build redirect URI from actual request URL to support different ports (3000, 8787, etc.)
  // This avoids issues with forwarded headers that might incorrectly set protocol to https
  const url = new URL(request.url);
  const host = url.hostname;
  const port = url.port;
  const protocol = url.protocol.replace(':', '');
  
  // Force http for localhost (Cloudflare Workers might set forwarded headers incorrectly)
  const finalProtocol = host.includes('localhost') ? 'http' : protocol;
  const baseUrl = port 
    ? `${finalProtocol}://${host}:${port}`
    : `${finalProtocol}://${host}`;
  const redirectUri = `${baseUrl}/api/quickbooks/callback`;
  // Generate CSRF state token
  const state = `admin-setup:${randomBytes(16).toString('hex')}`;

  const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'com.intuit.quickbooks.accounting');
  authUrl.searchParams.set('state', state);

  // Set the state cookie for CSRF validation
  const response = NextResponse.redirect(authUrl.toString());

  // Cookie settings: secure in production, work with both localhost and workers.dev
  const isSecure = finalProtocol === 'https';
  response.cookies.set('qb_oauth_state', state, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    path: '/', // Ensure cookie is available for callback route
  });

  // Debug logging (always log for troubleshooting)
  const environment = env.QUICKBOOKS_ENVIRONMENT || 'sandbox';
  console.log('[QuickBooks OAuth] Initiating OAuth flow');
  console.log('[QuickBooks OAuth] Environment:', environment);
  console.log('[QuickBooks OAuth] Host:', host);
  console.log('[QuickBooks OAuth] Port:', port || 'default');
  console.log('[QuickBooks OAuth] Protocol:', finalProtocol);
  console.log('[QuickBooks OAuth] Redirect URI:', redirectUri);
  console.log('[QuickBooks OAuth] State:', state.substring(0, 16) + '...');
  console.log(
    '[QuickBooks OAuth] ⚠️  IMPORTANT: This redirect URI must be added to your QuickBooks app'
  );
  console.log(
    '[QuickBooks OAuth] ⚠️  Make sure it is in the "' +
      (environment === 'sandbox' ? 'Development' : 'Production') +
      '" environment tab'
  );

  return response;
}
