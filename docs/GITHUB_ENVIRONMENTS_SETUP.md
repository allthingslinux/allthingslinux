# GitHub Environments & CI/CD Setup

This project uses GitHub Actions with **GitHub Environments** for automatic deployments to Cloudflare Workers. Each environment has its own isolated secrets, so you don't need to prefix them (e.g., `DEV_QUICKBOOKS_CLIENT_ID` vs `PROD_QUICKBOOKS_CLIENT_ID`).

## Overview

- **Production deployments** (`main` branch) → Uses `prod` GitHub Environment → Deploys to `allthingslinux-prod` worker
- **Development deployments** (PRs/other branches) → Uses `dev` GitHub Environment → Deploys to `allthingslinux-dev` worker

## Setup Steps

### 1. Create GitHub Environments

1. Go to your repository: **Settings → Environments**
2. Click **"New environment"**
3. Create two environments:
   - **`dev`** - For development/preview deployments
   - **`prod`** - For production deployments (main branch)

### 2. Add Secrets to Each Environment

For each environment (`dev` and `prod`), add the following secrets:

#### Required Secrets (both environments)

```
CLOUDFLARE_API_TOKEN          # Cloudflare API token for deployments
CLOUDFLARE_ACCOUNT_ID         # Your Cloudflare account ID
GITHUB_TOKEN                  # GitHub token (usually auto-provided)
MONDAY_API_KEY                # Monday.com API key
MONDAY_BOARD_ID               # Monday.com board ID
DISCORD_WEBHOOK_URL           # Discord webhook URL for notifications
TRIGGER_SECRET_KEY            # Trigger.dev secret key
```

#### QuickBooks Secrets (environment-specific values)

**For `dev` environment (sandbox):**

```
QUICKBOOKS_CLIENT_ID          # QuickBooks Sandbox Client ID
QUICKBOOKS_CLIENT_SECRET      # QuickBooks Sandbox Client Secret
QUICKBOOKS_REFRESH_TOKEN      # QuickBooks Sandbox Refresh Token (if available)
QUICKBOOKS_REALM_ID           # QuickBooks Sandbox Realm ID (if available)
QUICKBOOKS_ADMIN_KEY          # Admin key for QuickBooks operations
```

**For `prod` environment (production):**

```
QUICKBOOKS_CLIENT_ID          # QuickBooks Production Client ID
QUICKBOOKS_CLIENT_SECRET      # QuickBooks Production Client Secret
QUICKBOOKS_REFRESH_TOKEN      # QuickBooks Production Refresh Token
QUICKBOOKS_REALM_ID           # QuickBooks Production Realm ID
QUICKBOOKS_ADMIN_KEY          # Admin key for QuickBooks operations
```

**Note:** The same secret names are used in both environments, but with different values. GitHub Environments automatically isolates them.

### 3. Set Environment Protection Rules (Optional)

For the `prod` environment, you may want to add protection rules:

1. Go to **Settings → Environments → `prod`**
2. Enable **"Required reviewers"** (optional, but recommended for production)
3. Enable **"Wait timer"** (optional, adds delay before deployment)

### 4. Get Cloudflare Credentials

#### CLOUDFLARE_API_TOKEN

1. Go to [Cloudflare Dashboard → My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **"Create Token"**
3. Use **"Edit Cloudflare Workers"** template or create custom token with:
   - **Account**: `Cloudflare Workers:Edit`
   - **Account**: `Workers KV Storage:Edit`
   - **Account**: `Workers Scripts:Edit`
   - **Account**: `Account Settings:Read` (optional, for account info)
4. Copy the token and add it to both `dev` and `prod` GitHub Environments

#### CLOUDFLARE_ACCOUNT_ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your account (right sidebar)
3. Copy the **Account ID** from the URL or sidebar
4. Add it to both `dev` and `prod` GitHub Environments

### 5. Verify Setup

1. Push a commit to a feature branch
2. Create a Pull Request
3. Check the **Actions** tab → Should show a workflow run deploying to `dev` environment
4. Merge to `main` → Should deploy to `prod` environment

## How It Works

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. **Detects the branch**: `main` → `prod` environment, others → `dev` environment
2. **Loads environment-specific secrets**: GitHub automatically provides the correct secrets based on the environment
3. **Deploys to correct worker**: `--env prod` or `--env dev` flag selects the right Cloudflare Worker

## Manual Deployment

You can still deploy manually using the scripts:

```bash
# Deploy to dev (uses local .env.secrets.dev file)
pnpm run deploy:dev

# Deploy to prod (uses local .env.secrets.prod file)
pnpm run deploy:prod

# Set secrets manually (uses local .env.secrets.* files)
pnpm run secrets:dev
pnpm run secrets:prod
```

**Note:** Manual deployments use local `.env.secrets.*` files, while CI/CD uses GitHub Environments secrets.

## Troubleshooting

### Secrets not found

**Issue:** Workflow fails with "secrets not found" error.

**Solution:**

1. Verify secrets are added to the correct environment (`dev` or `prod`)
2. Check secret names match exactly (case-sensitive)
3. Ensure the environment is referenced correctly in the workflow

### Wrong environment secrets used

**Issue:** Production deployment uses dev secrets (or vice versa).

**Solution:**

1. Check the branch triggering the workflow (`main` → `prod`, others → `dev`)
2. Verify the `environment:` field in `.github/workflows/deploy.yml`
3. Ensure secrets are set in the correct GitHub Environment

### Deployment fails

**Issue:** Workflow runs but deployment fails.

**Common causes:**

1. **Invalid CLOUDFLARE_API_TOKEN**: Token may have expired or insufficient permissions
2. **Wrong CLOUDFLARE_ACCOUNT_ID**: Account ID doesn't match your account
3. **Missing secrets**: Required secrets not set in GitHub Environment
4. **Build errors**: Check build logs in the Actions tab

## Migration from Local Secrets

If you were using local `.env.secrets.*` files:

1. Copy secret values from your local files
2. Add them to the corresponding GitHub Environment
3. The CI/CD will now use GitHub secrets automatically
4. Local files are still used for manual deployments (optional)

## Benefits of GitHub Environments

✅ **Isolation**: Dev and prod secrets are completely separate  
✅ **No prefixing needed**: Same secret names in both environments  
✅ **Protection rules**: Require approvals for production deployments  
✅ **Audit trail**: Track who deployed what and when  
✅ **Rollback**: GitHub tracks deployment history  
✅ **Integration**: Secrets are available in PR comments and deployment status
