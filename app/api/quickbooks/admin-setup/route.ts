import { randomBytes } from 'crypto';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/env';

// Simple admin-only OAuth setup
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Require admin key authentication in all environments
  const adminKey = request.nextUrl.searchParams.get('admin');

  if (adminKey !== env.QUICKBOOKS_ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clientId = env.QUICKBOOKS_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'Missing QUICKBOOKS_CLIENT_ID' },
      { status: 500 }
    );
  }

  // Build redirect URI from request headers (works for both localhost and deployed domains)
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol =
    request.headers.get('x-forwarded-proto') ||
    request.headers.get('x-forwarded-scheme') ||
    (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = `${protocol}://${host}`;
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
  const isSecure = protocol === 'https';
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
  console.log('[QuickBooks OAuth] Protocol:', protocol);
  console.log('[QuickBooks OAuth] Redirect URI:', redirectUri);
  console.log('[QuickBooks OAuth] State:', state.substring(0, 16) + '...');
  console.log('[QuickBooks OAuth] ⚠️  IMPORTANT: This redirect URI must be added to your QuickBooks app');
  console.log('[QuickBooks OAuth] ⚠️  Make sure it is in the "' + (environment === 'sandbox' ? 'Development' : 'Production') + '" environment tab');

  return response;
}
