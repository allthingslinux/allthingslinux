# QuickBooks Integration

## Overview

The QuickBooks integration enables the All Things Linux website to fetch and display financial transactions from QuickBooks Online. This is designed as a **public dashboard** - admin sets up OAuth once, users view the data without authentication.

### Features

- **Admin-only OAuth Setup**: One-time configuration by admin
- **Public Dashboard**: Users view financial data without authentication
- **Automatic Token Management**: Handles refresh token rotation and expiry
- **Cloudflare Workers Compatible**: Uses KV storage in production
- **Environment Detection**: Switches between sandbox and production APIs
- **Rate Limiting**: Built-in retry logic with exponential backoff

## Quick Setup

### Prerequisites

1. Create a QuickBooks app at [Intuit Developer Portal](https://developer.intuit.com/dashboard)
2. **IMPORTANT - Environment Toggle**: QuickBooks has separate "Development" (Sandbox) and "Production" environments
   - Each environment has its own redirect URIs and Client ID/Secret
   - Toggle between "Development" and "Production" at the top of the app settings page
   - Make sure you're adding redirect URIs to the **correct environment tab**
3. Configure redirect URIs in your QuickBooks app settings (for the appropriate environment):
   - **Development (Sandbox) Environment**:
     - `http://localhost:3000/api/quickbooks/callback` (for local dev)
     - `https://allthingslinux.dev/api/quickbooks/callback` (for deployed dev environment)
   - **Production Environment**:
     - `https://allthingslinux.org/api/quickbooks/callback` (for production)
4. **Important**:
   - The redirect URI must match **exactly** (including protocol and path)
   - No trailing slashes
   - Must be in the same environment (Development/Production) as your Client ID
5. Get your Client ID and Client Secret from the app settings (make sure you're looking at the correct environment tab)

### Environment Setup

Add to your `.env.local` file:

```env
QUICKBOOKS_CLIENT_ID=your_client_id
QUICKBOOKS_CLIENT_SECRET=your_client_secret
QUICKBOOKS_ENVIRONMENT=sandbox  # or 'production'
QUICKBOOKS_ADMIN_KEY=your_secure_random_key  # For admin operations
```

### Admin OAuth Setup

**Local Development:**

1. **Visit**: `http://localhost:3000/api/quickbooks/admin-setup?admin=your_secure_random_key`
2. **Complete QuickBooks authorization** (one time only)
3. **Copy the tokens** to your `.env.local` file
4. **Restart your dev server**

**Cloudflare Worker (Dev/Prod):**

1. **Visit**: `https://your-worker-domain/api/quickbooks/admin-setup?admin=your_secure_random_key`
2. **Ensure** the redirect URI is configured in QuickBooks app settings (see Prerequisites)
3. **Complete QuickBooks authorization** - tokens will be automatically saved to Cloudflare KV

**Note**:

- The `admin` parameter must match your `QUICKBOOKS_ADMIN_KEY` for security
- The redirect URI in QuickBooks app settings **must match exactly** the deployed domain
- If you see an infinite loop, check that the redirect URI in QuickBooks matches your worker domain

That's it! Your public dashboard will now fetch QuickBooks data automatically.

## Token Storage & Refresh

### When Tokens Are Stored to KV

1. **Initial OAuth Setup** (First time only):
   - When you complete the OAuth flow at `/api/quickbooks/admin-setup`
   - Tokens are automatically saved to Cloudflare KV as `quickbooks_tokens`
   - Contains: `clientId`, `clientSecret`, `refreshToken`, `realmId`, `environment`

2. **Access Token Caching** (Automatic, every hour):
   - Access tokens expire after **1 hour**
   - When expired, the system automatically refreshes using the refresh token
   - New access tokens are cached in KV with a TTL matching expiration time
   - Stored as `quickbooks_token_cache` (separate from the main tokens)

3. **Refresh Token Rotation** (Automatic, every 24 hours):
   - QuickBooks rotates refresh tokens every **24 hours** for security
   - When a refresh happens and QuickBooks returns a new refresh token
   - **The system automatically updates Cloudflare Secrets via API** (if `CLOUDFLARE_API_TOKEN` is available)
   - **No manual updates needed** after initial OAuth setup - fully automated! ✅

### How Token Refresh Works

The system handles token expiration automatically:

1. **Every API Call**:
   - Checks if access token is cached and still valid (1 hour)
   - If valid → uses cached token (fast)
   - If expired → automatically refreshes from QuickBooks (seamless)

2. **Refresh Token Lifecycle**:
   - Refresh tokens are **long-lived** but rotate every 24 hours
   - When QuickBooks rotates the refresh token, it's automatically saved
   - The old refresh token stops working, but the new one is already saved
   - **No manual intervention needed** - the system handles everything

3. **Fallback Behavior**:
   - If KV is unavailable (e.g., in Next.js API routes where `request.env` isn't populated), falls back to environment variables
   - Tokens from environment variables still work perfectly for refresh
   - **Current Setup**: Your system is using environment variables (which is working!)
   - Token rotation still works - refresh tokens are automatically updated when rotated

**Important Note for Next.js on Cloudflare Workers**:

- According to [OpenNext documentation](https://opennext.js.org/cloudflare/howtos/env-vars), environment variables are the recommended approach
- In Next.js API routes, `request.env` is not automatically populated (unlike regular Cloudflare Workers where `env` is passed as a parameter)
- The system automatically falls back to **environment variables** for token storage, which is the correct approach per OpenNext guidance
- **This works perfectly** - environment variables provide the same functionality:
  - Tokens are stored as Cloudflare Secrets (uploaded via `pnpm run secrets:dev` / `pnpm run secrets:prod`)
  - Accessible via `process.env` in your code (through `env.ts`)
  - Token refresh works automatically
  - Refresh token rotation works automatically
- **Your current setup follows OpenNext best practices**: Using environment variables/secrets instead of KV bindings for Next.js routes

### Manual Token Refresh (Optional)

If you need to manually refresh tokens (e.g., troubleshooting):

```bash
# Using curl with admin key
curl -X POST https://your-domain.com/api/quickbooks \
  -H "Authorization: Bearer YOUR_QUICKBOOKS_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "refresh_tokens"}'
```

### Troubleshooting Token Issues

- **"Failed to get access token"**: Check that refresh token is valid and not revoked
- **"KV namespace not available"**:
  - ✅ **This is expected and normal** - Next.js API routes don't receive `request.env`
  - ✅ **Your system is working correctly** - it's using environment variables
  - ✅ **Tokens are stored as secrets** (via `pnpm run secrets:dev` / `secrets:prod`)
  - ✅ **Token refresh and rotation work automatically** with environment variables
- **Token rotation not working**:
  - Refresh tokens automatically rotate every 24 hours
  - **The system now automatically updates Cloudflare Secrets via API** when refresh tokens rotate
  - Requires `CLOUDFLARE_API_TOKEN` in your secrets file (already set up for deployments)
  - Optional: Add `CLOUDFLARE_ACCOUNT_ID` to your secrets file for account-level API access
  - If automatic update fails, check logs for the new refresh token and update manually
- **Tokens not persisting after deployment**:
  - Ensure secrets are uploaded: `pnpm run secrets:dev` or `pnpm run secrets:prod`
  - Check that `CLOUDFLARE_API_TOKEN` is set correctly
  - Verify secrets exist in Cloudflare: `wrangler secret list --env dev`

## Architecture

### API Routes

- `/api/quickbooks/admin-setup` - Admin-only OAuth initiation
- `/api/quickbooks/callback` - OAuth callback handler
- `/api/quickbooks` - Public API endpoint for fetching transactions

### Core Files

- `lib/integrations/quickbooks.ts` - Main integration logic
- `app/api/quickbooks/` - API routes
- Environment variables for configuration

### Token Management

- **Development**: Stored in `.env.local` file
- **Production**: Stored in Cloudflare KV
- **Automatic refresh**: Every hour with 55-minute cache
- **Token rotation**: Handled automatically every 24 hours
- **Expiry**: 100-day limit resets with each use

## Important Token Information

⚠️ **Token Expiry Rules (per QuickBooks FAQ):**

- **Access tokens**: Expire after 1 hour (3600 seconds)
- **Refresh tokens**: Expire after 100 days if not used
- **Refresh token rotation**: Values change every 24 hours for security
- **HTTPS required**: Redirect URIs must use HTTPS (except localhost)

✅ **Automated Handling:**

- Access token refresh is automatic
- Refresh token rotation is handled automatically
- New refresh tokens are saved to KV/environment
- HTTPS enforcement for production

## Production Deployment

### Cloudflare KV Setup

The integration automatically uses Cloudflare KV in production:

- Tokens stored securely in KV namespace
- Automatic token rotation updates KV
- No manual intervention required

### Environment Variables (Production)

Set these in your Cloudflare Workers environment:

- `QUICKBOOKS_CLIENT_ID` - Your QuickBooks app client ID
- `QUICKBOOKS_CLIENT_SECRET` - Your QuickBooks app client secret
- `QUICKBOOKS_ENVIRONMENT` - 'production' for live data
- `QUICKBOOKS_ADMIN_KEY` - Secure random key for admin operations (see Security section)

Initial tokens will be obtained via the admin setup route.

## API Usage

### Fetch Transactions

```typescript
// GET /api/quickbooks
{
  "success": true,
  "data": [
    {
      "id": "123",
      "txnDate": "2024-01-01",
      "amount": 1000.00,
      "type": "Invoice",
      "customerName": "Customer Name",
      "description": "Invoice description",
      "status": "pending"
    }
  ],
  "count": 1,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Transaction Types

- **Purchases** (expenses) - negative amounts
- **Invoices** (income) - positive amounts
- **Payments** (received) - positive amounts
- **Deposits** (bank deposits) - positive amounts

## Troubleshooting

### "Missing QuickBooks credentials"

- Add `QUICKBOOKS_CLIENT_ID` and `QUICKBOOKS_CLIENT_SECRET` to environment

### "CSRF state validation failed"

- Clear browser cookies and retry OAuth flow

### "Rate limit exceeded"

- Integration automatically retries with exponential backoff

### "invalid_grant" error

- Refresh token may have expired (100 days)
- Run admin setup again to re-authorize

### "HTTPS Required"

- QuickBooks requires HTTPS for redirect URIs
- Use localhost for development or ensure HTTPS in production

## Security

- **Admin-only setup**: OAuth flow restricted to admin users
- **Admin key protection**: `QUICKBOOKS_ADMIN_KEY` secures admin operations
- **CSRF protection**: State validation prevents attacks
- **Secure token storage**: Environment variables (dev) / KV (production)
- **Automatic rotation**: Tokens rotate every 24 hours
- **Public read-only**: Dashboard displays data without exposing tokens

### Admin Key Security

The `QUICKBOOKS_ADMIN_KEY` protects sensitive operations:

- **Admin Setup**: `/api/quickbooks/admin-setup?admin=YOUR_KEY`
- **Token Refresh**: POST `/api/quickbooks` with `Authorization: Bearer YOUR_KEY`
- **Generate securely**: Use a random UUID or secure string
- **Keep secret**: Never expose in client-side code
- **Different per environment**: Use separate keys for dev/prod

Example secure key generation:

```bash
# Generate a secure random key
openssl rand -hex 32
# Or use a UUID
uuidgen
```
