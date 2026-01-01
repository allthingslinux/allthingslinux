import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
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
                error_description: errorDescription
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

    const clientId = process.env.QUICKBOOKS_CLIENT_ID;
    const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET;

    // Get the actual host from headers (works with tunnels)
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
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
        const tokenResponse = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
            }),
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Token exchange failed:', errorText);
            return NextResponse.json(
                { error: 'Token exchange failed', details: errorText },
                { status: 500 }
            );
        }

        const tokens: any = await tokenResponse.json();

        // Return HTML page with tokens
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>QuickBooks Authorization Success</title>
      </head>
      <body>
        <h1 class="success">✅ Authorization Successful!</h1>

        <div class="warning">
          <strong>⚠️ Important:</strong> Add these to your <code>.env.local</code> file:
        </div>

        <pre>
            QUICKBOOKS_CLIENT_ID=${clientId}
            QUICKBOOKS_CLIENT_SECRET=${clientSecret}
            QUICKBOOKS_REFRESH_TOKEN=${tokens.refresh_token}
            QUICKBOOKS_REALM_ID=${realmId}
        </pre>

        <p>You can close this window now and restart your dev server.</p>
      </body>
      </html>
    `;

        return new NextResponse(html, {
            headers: { 'Content-Type': 'text/html' },
        });
    } catch (error) {
        console.error('Error in QuickBooks callback:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
