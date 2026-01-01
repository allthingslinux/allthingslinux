import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple admin-only OAuth setup
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Only allow in development or with admin key
  const adminKey = request.nextUrl.searchParams.get('admin');
  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev && adminKey !== process.env.ADMIN_SETUP_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clientId = process.env.QUICKBOOKS_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'Missing QUICKBOOKS_CLIENT_ID' },
      { status: 500 }
    );
  }

  const redirectUri = `${request.nextUrl.origin}/api/quickbooks/callback`;
  const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'com.intuit.quickbooks.accounting');
  authUrl.searchParams.set('state', 'admin-setup');

  return NextResponse.redirect(authUrl.toString());
}
