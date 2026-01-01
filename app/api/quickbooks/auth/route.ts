import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function GET(request: NextRequest) {
    const clientId = process.env.QUICKBOOKS_CLIENT_ID;

    // Get the actual host from headers (works with tunnels)
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;
    const redirectUri = `${baseUrl}/api/quickbooks/callback`;

    if (!clientId) {
        return NextResponse.json({ error: 'Missing QUICKBOOKS_CLIENT_ID' }, { status: 500 });
    }

    const state = randomBytes(16).toString('hex');

    const authUrl = new URL('https://appcenter.intuit.com/connect/oauth2');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'com.intuit.quickbooks.accounting');
    authUrl.searchParams.set('state', state);

    // Show a page with the redirect URI and auth link
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>QuickBooks OAuth</title>
    </head>
    <body>
      <h1>🔐 QuickBooks OAuth Setup</h1>

      <div class="warning">
        <strong>⚠️ Important:</strong> Make sure your QuickBooks app redirect URI is set to:<br>
        <code>${redirectUri}</code>
      </div>

      <p>Once you've added the redirect URI above to your QuickBooks app settings, click the button below:</p>

      <a href="${authUrl.toString()}" class="btn">Connect to QuickBooks</a>
    </body>
    </html>
  `;

    return new NextResponse(html, {
        headers: { 'Content-Type': 'text/html' },
    });
}
