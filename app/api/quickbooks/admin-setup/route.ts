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

  // Use canonical URL from environment (security: prevents header injection)
  const baseUrl = env.NEXT_PUBLIC_URL;
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
  response.cookies.set('qb_oauth_state', state, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
  });

  return response;
}
