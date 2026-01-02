# Current Setup Summary

## ✅ What We've Done

1. **Consolidated to Single Worker**
   - Worker name: `dev`
   - URL: `dev.allthingslinux.workers.dev`
   - Handles both dev and prod traffic

2. **GitHub Actions CI/CD**
   - Automatic deployments on push/PR
   - Uses GitHub Environments for secret isolation
   - No need to prefix secrets (GitHub handles it)

3. **Cleaned Up Secrets**
   - Removed Trigger.dev secrets (they're separate)
   - Only Cloudflare Worker secrets are set

## 🏗️ Current Architecture

```
GitHub Repository
    ├── Push to main → GitHub Environment: "prod"
    │   └── Sets prod secrets → Deploys to "dev" worker
    │
    └── Push to feature branch → GitHub Environment: "dev"
        └── Sets dev secrets → Deploys to "dev" worker (overwrites prod secrets)
```

## 📋 What You Need to Do Next

### 1. Set Up GitHub Environments

1. Go to your GitHub repo: **Settings → Environments**
2. Create two environments:
   - **`dev`** - For development/preview deployments
   - **`prod`** - For production deployments

### 2. Add Secrets and Variables to Each Environment

For **BOTH** environments, add these:

#### GitHub Secrets (Sensitive Data):

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `QUICKBOOKS_CLIENT_ID` - Different values for dev (sandbox) vs prod
- `QUICKBOOKS_CLIENT_SECRET` - Different values for dev vs prod
- `QUICKBOOKS_REFRESH_TOKEN` - Optional, different per env
- `QUICKBOOKS_REALM_ID` - Optional, different per env
- `QUICKBOOKS_ADMIN_KEY` - Optional, can be same or different
- `GITHUB_TOKEN` - GitHub API token (usually auto-provided, but can set manually)
- `MONDAY_API_KEY` - Monday.com API key

#### GitHub Variables (Non-Sensitive Configuration):

- `DISCORD_WEBHOOK_URL` - Discord webhook URL (non-sensitive config)
- `MONDAY_BOARD_ID` - Monday.com board ID (not sensitive, just an ID)
- `QUICKBOOKS_ENVIRONMENT` - `sandbox` for dev, `production` for prod (optional, auto-detected if not set)

**Note:**

- Keep secrets **unprefixed** in GitHub (e.g., `QUICKBOOKS_CLIENT_ID`)
- The workflow automatically adds the prefix (`DEV_` or `PROD_`) when setting them in Cloudflare
- `TRIGGER_SECRET_KEY` can stay in GitHub secrets but won't be uploaded to Cloudflare (Trigger.dev handles it separately)

**Note:** GitHub automatically isolates these per environment - you don't need to prefix them!

### 3. Configure Custom Domain Route

The `wrangler.jsonc` has routes configured, but you may need to verify in Cloudflare Dashboard:

- Go to **Workers & Pages → dev → Routes**
- Ensure `allthingslinux.org` and `*.allthingslinux.org` route to the `dev` worker

## ✅ Both Environments Work Simultaneously

**Prefixed Secrets Solution:**

We use prefixed secrets (DEV*\*, PROD*\*) so both environments can work at the same time:

- Secrets are stored as `DEV_QUICKBOOKS_CLIENT_ID` and `PROD_QUICKBOOKS_CLIENT_ID`
- Code detects environment at runtime based on request host
- Dev requests (dev.allthingslinux.workers.dev) → use `DEV_*` secrets
- Prod requests (allthingslinux.org) → use `PROD_*` secrets

**How it works:**

- Middleware sets `NEXT_PUBLIC_URL` dynamically based on request host
- `env.ts` detects environment from `NEXT_PUBLIC_URL`
- `getEnvVar()` selects the correct prefixed secret automatically

## 🔄 How It Works Now

1. **You push code** → GitHub Actions runs
2. **GitHub detects branch:**
   - `main` → uses `prod` environment secrets
   - Other branches → uses `dev` environment secrets
3. **Workflow sets secrets** in Cloudflare Worker from GitHub Environment
4. **Worker deploys** with those secrets
5. **Runtime detection** (in your code) determines dev vs prod based on request host

## 📝 Files Changed

- ✅ `.github/workflows/deploy.yml` - GitHub Actions workflow
- ✅ `wrangler.jsonc` - Single worker config, renamed to "dev"
- ✅ `docs/GITHUB_ENVIRONMENTS_SETUP.md` - Setup guide (created earlier)

## 🎯 Next Steps

1. Set up GitHub Environments and add secrets (see above)
2. Test by pushing to a feature branch (should deploy to dev)
3. Test by pushing to main (should deploy to prod)
4. Verify URLs work:
   - Dev: `dev.allthingslinux.workers.dev`
   - Prod: `allthingslinux.org`

That's it! You're ready to go.
