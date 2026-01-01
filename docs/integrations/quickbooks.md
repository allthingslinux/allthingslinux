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
2. Configure redirect URI: `http://localhost:3000/api/quickbooks/callback` (development)
3. Get your Client ID and Client Secret from the app settings

### Environment Setup

Add to your `.env.local` file:

```env
QUICKBOOKS_CLIENT_ID=your_client_id
QUICKBOOKS_CLIENT_SECRET=your_client_secret
QUICKBOOKS_ENVIRONMENT=sandbox  # or 'production'
```

### Admin OAuth Setup

1. **Visit**: `http://localhost:3000/api/quickbooks/admin-setup`
2. **Complete QuickBooks authorization** (one time only)
3. **Copy the tokens** to your `.env.local` file
4. **Restart your dev server**

That's it! Your public dashboard will now fetch QuickBooks data automatically.

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

**"Missing QuickBooks credentials"**
- Add `QUICKBOOKS_CLIENT_ID` and `QUICKBOOKS_CLIENT_SECRET` to environment

**"CSRF state validation failed"**
- Clear browser cookies and retry OAuth flow

**"Rate limit exceeded"**
- Integration automatically retries with exponential backoff

**"invalid_grant" error**
- Refresh token may have expired (100 days)
- Run admin setup again to re-authorize

**"HTTPS Required"**
- QuickBooks requires HTTPS for redirect URIs
- Use localhost for development or ensure HTTPS in production

## Security

- **Admin-only setup**: OAuth flow restricted to admin users
- **CSRF protection**: State validation prevents attacks
- **Secure token storage**: Environment variables (dev) / KV (production)
- **Automatic rotation**: Tokens rotate every 24 hours
- **Public read-only**: Dashboard displays data without exposing tokens
