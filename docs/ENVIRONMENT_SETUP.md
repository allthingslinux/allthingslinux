# Environment Setup Guide

This guide covers environment variable configuration for all deployment scenarios.

## 📋 **Deployment Scenarios**

| Scenario | Description | Configuration Files |
|----------|-------------|-------------------|
| **Local Next.js** | `pnpm dev` | `.env.local` |
| **Local Wrangler** | `pnpm wrangler` | `.dev.vars` + `wrangler.jsonc` (local env) |
| **CF Workers Dev** | Preview deployments | `wrangler.jsonc` (dev env) + Secrets |
| **CF Workers Prod** | Production | `wrangler.jsonc` (prod env) + Secrets |

## 🔧 **Setup Instructions**

### 1. **Local Development Setup**

```bash
# Copy environment templates
cp .env.local.example .env.local                 # For Next.js dev server
cp .dev.vars.example .dev.vars                   # For Wrangler dev server  
cp .env.secrets.dev.example .env.secrets.dev     # For dev environment secrets
cp .env.secrets.prod.example .env.secrets.prod   # For prod environment secrets

# Edit each file with your actual values
# - .env.local & .dev.vars: Use sandbox QuickBooks credentials
# - .env.secrets.dev: Use sandbox QuickBooks credentials  
# - .env.secrets.prod: Use production QuickBooks credentials
```

### 2. **Cloudflare Workers Setup**

```bash
# Upload secrets to Cloudflare (automatically uses environment-specific files)
pnpm run secrets:dev   # Uses .env.secrets.dev (sandbox credentials)
pnpm run secrets:prod  # Uses .env.secrets.prod (production credentials)
```

## 📝 **Environment Variables Reference**

### **Public Variables** (Available in browser)
```bash
NEXT_PUBLIC_URL=https://allthingslinux.org
NEXT_PUBLIC_API_URL=https://allthingslinux.org/api
NEXT_PUBLIC_GITHUB_REPO_OWNER=allthingslinux
NEXT_PUBLIC_GITHUB_REPO_NAME=applications
```

### **Private Variables** (Server-side only)
```bash
# Core integrations
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
MONDAY_API_KEY=eyJhbGciOiJIUzI1NiJ9...
MONDAY_BOARD_ID=1234567890
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
TRIGGER_SECRET_KEY=tr_dev_xxxxxxxxxxxx

# QuickBooks integration (optional)
QUICKBOOKS_CLIENT_ID=Q0xxxxxxxxxxxx
QUICKBOOKS_CLIENT_SECRET=xxxxxxxxxxxx
QUICKBOOKS_REFRESH_TOKEN=Q011xxxxxxxxxxxx
QUICKBOOKS_REALM_ID=9130xxxxxxxxxxxx
QUICKBOOKS_ENVIRONMENT=sandbox  # or 'production'
QUICKBOOKS_ADMIN_KEY=secure_random_key_here
```

## 🌍 **Environment-Specific URLs**

### **Local Development**
- **Next.js Dev**: `http://localhost:3000`
- **Wrangler Dev**: `http://localhost:8788`

### **Cloudflare Workers**
- **Dev Environment**: `https://dev.allthingslinux.workers.dev`
- **Production**: `https://allthingslinux.org`

## 🔐 **Security Notes**

### **File Security**
- ✅ `.env.local` - Next.js local development (gitignored)
- ✅ `.dev.vars` - Wrangler local development (gitignored)  
- ✅ `.env.secrets.dev` - Dev environment secrets (gitignored)
- ✅ `.env.secrets.prod` - Production environment secrets (gitignored)
- ❌ `.env.local.example` - Next.js template, no real values
- ❌ `.dev.vars.example` - Wrangler template, no real values
- ❌ `.env.secrets.dev.example` - Dev secrets template, no real values
- ❌ `.env.secrets.prod.example` - Prod secrets template, no real values

### **Secrets Management**
- **Next.js Local**: Use `.env.local` (sandbox creds)
- **Wrangler Local**: Use `.dev.vars` (sandbox creds)
- **Dev Environment**: Use `.env.secrets.dev` (sandbox creds)
- **Prod Environment**: Use `.env.secrets.prod` (production creds)
- **Upload Command**: `pnpm run secrets:dev` or `pnpm run secrets:prod`
- **Never commit**: Real secrets to git

## 🚀 **Deployment Commands**

### **Local Development**
```bash
pnpm dev          # Next.js development server
pnpm wrangler     # Cloudflare Workers local development
pnpm dev:all      # Both + Trigger.dev
```

### **Cloudflare Deployment**
```bash
pnpm deploy:dev   # Deploy to dev environment
pnpm deploy:prod  # Deploy to production
pnpm deploy       # Alias for production deploy
```

### **Secrets Management**
```bash
pnpm secrets:dev  # Upload secrets to dev environment (uses .env.secrets.dev)
pnpm secrets:prod # Upload secrets to production (uses .env.secrets.prod)
```

## 🔍 **Troubleshooting**

### **Common Issues**

1. **"Invalid environment variables" error**
   - Check that required variables are set
   - Verify `.env.local` exists for local development
   - Ensure secrets are uploaded for Cloudflare deployments
   - For dev: Check `.env.secrets.dev` exists and run `pnpm secrets:dev`
   - For prod: Check `.env.secrets.prod` exists and run `pnpm secrets:prod`

2. **QuickBooks integration not working**
   - Verify all `QUICKBOOKS_*` variables are set
   - Check redirect URIs in QuickBooks app settings
   - Ensure `QUICKBOOKS_ENVIRONMENT` matches your setup

3. **API calls failing in production**
   - Verify secrets are uploaded: `pnpm secrets:prod` (uses `.env.secrets.prod`)
   - Check Cloudflare dashboard for secret values
   - Ensure environment-specific URLs are correct
   - Verify production QuickBooks credentials in `.env.secrets.prod`

### **Validation Commands**
```bash
pnpm check:ts     # TypeScript validation
pnpm check        # Full validation (TS + format + MDX)
```

## 📚 **Additional Resources**

- [Cloudflare Workers Environment Variables](https://developers.cloudflare.com/workers/configuration/environment-variables/)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [T3 Env Documentation](https://env.t3.gg/docs/nextjs)
