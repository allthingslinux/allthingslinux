import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/env';

// Simple admin-only OAuth setup
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Only allow in development or with admin key
  const adminKey = request.nextUrl.searchParams.get('admin');
  const isDev = env.NODE_ENV === 'development';

  if (!isDev && adminKey !== env.QUICKBOOKS_ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clientId = env.QUICKBOOKS_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'Missing QUICKBOOKS_CLIENT_ID' },
      { status: 500 }
    );
  }

  // Get the actual host from headers (consistent with other routes)
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol =
    request.headers.get('x-forwarded-proto') ||
    (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = `${protocol}://${host}`;
  const redirectUri = `${baseUrl}/api/quickbooks/callback`;
  const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'com.intuit.quickbooks.accounting');
  authUrl.searchParams.set('state', 'admin-setup');

  // Set the state cookie for CSRF validation
  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set('qb_oauth_state', 'admin-setup', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
  });

  return response;
}
