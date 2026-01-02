import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { randomBytes } from 'crypto';
import { getQuickBooksAuthUrl } from '@/lib/integrations/quickbooks';
import { runtimeEnv as env } from '@/env';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const clientId = env.QUICKBOOKS_CLIENT_ID;
  const environment = env.QUICKBOOKS_ENVIRONMENT || 'sandbox';

  // Get the actual host from headers
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol =
    request.headers.get('x-forwarded-proto') ||
    (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = `${protocol}://${host}`;
  const redirectUri = `${baseUrl}/api/quickbooks/callback`;

  // QuickBooks requires HTTPS for redirect URIs (except localhost for development)
  if (!host.includes('localhost') && protocol !== 'https') {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
      <head><title>HTTPS Required</title></head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
        <h1>🔒 HTTPS Required</h1>
        <p>QuickBooks OAuth requires HTTPS for redirect URIs.</p>
        <p>Current URL: <code>${protocol}://${host}</code></p>
        <p>Please access this page via HTTPS or use localhost for development.</p>
      </body>
      </html>
    `,
      {
        headers: { 'Content-Type': 'text/html' },
        status: 400,
      }
    );
  }

  if (!clientId) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
      <head><title>QuickBooks Setup Required</title></head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
        <h1>🔧 QuickBooks Setup Required</h1>
        <p>QuickBooks integration is not configured. Please:</p>
        <ol>
          <li>Set up your QuickBooks app at <a href="https://developer.intuit.com/dashboard" target="_blank">Intuit Developer Portal</a></li>
          <li>Add your credentials to environment variables</li>
          <li>Use the admin setup route for initial OAuth</li>
        </ol>
        <p>Missing: <code>QUICKBOOKS_CLIENT_ID</code></p>
      </body>
      </html>
    `,
      {
        headers: { 'Content-Type': 'text/html' },
        status: 500,
      }
    );
  }

  // Generate CSRF state token
  const state = randomBytes(16).toString('hex');

  // Get the correct OAuth URL based on environment
  const authBaseUrl = await getQuickBooksAuthUrl(environment);
  const authUrl = new URL(authBaseUrl);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'com.intuit.quickbooks.accounting');
  authUrl.searchParams.set('state', state);

  // Check if already configured
  const isConfigured = env.QUICKBOOKS_REFRESH_TOKEN && env.QUICKBOOKS_REALM_ID;
  const setupMode = !isConfigured;

  // Render streamlined setup page
  const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>${setupMode ? 'QuickBooks Setup' : 'QuickBooks Re-authorization'}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
      }
      .container {
        max-width: 500px;
        width: 100%;
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        padding: 2rem;
        text-align: center;
      }
      h1 { font-size: 1.8rem; margin-bottom: 1rem; color: #1a1a1a; }
      p { color: #666; line-height: 1.6; margin: 1rem 0; }
      .btn {
        display: inline-block;
        background: #667eea;
        color: white;
        padding: 0.75rem 2rem;
        border-radius: 6px;
        text-decoration: none;
        font-weight: 600;
        margin-top: 1rem;
        transition: background 0.2s;
      }
      .btn:hover { background: #5568d3; }
      .info {
        background: #e7f3ff;
        border: 1px solid #b3d9ff;
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 0.9rem;
      }
      .status {
        background: ${setupMode ? '#fff3cd' : '#d4edda'};
        border: 1px solid ${setupMode ? '#ffc107' : '#28a745'};
        border-radius: 8px;
        padding: 1rem;
        margin: 1rem 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>${setupMode ? '🔐 QuickBooks Setup' : '🔄 Re-authorize QuickBooks'}</h1>
      
      <div class="status">
        <strong>${setupMode ? '⚠️ First-time setup' : '✅ Updating existing connection'}</strong><br>
        ${setupMode ? 'This will configure your QuickBooks integration' : 'This will refresh your QuickBooks connection'}
      </div>
      
      <p>${setupMode ? 'Click below to connect your QuickBooks account. After authorization, tokens will be automatically saved.' : 'Your existing QuickBooks connection will be updated with new tokens.'}</p>
      
      <div class="info">
        <strong>Environment:</strong> ${environment.toUpperCase()}<br>
        <strong>Redirect URI:</strong> ${redirectUri}
      </div>
      
      <a href="#" onclick="authorize()" class="btn">
        ${setupMode ? 'Connect QuickBooks' : 'Re-authorize QuickBooks'}
      </a>
    </div>
    
    <script>
      function authorize() {
        // Set cookie and redirect
        document.cookie = "qb_oauth_state=${state}; path=/; max-age=600; ${protocol === 'https' ? 'secure; ' : ''}samesite=lax";
        window.location.href = "${authUrl.toString().replace(/"/g, '\\"')}";
      }
    </script>
  </body>
  </html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
