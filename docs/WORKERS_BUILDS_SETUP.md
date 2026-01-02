# Workers Builds Setup Guide

This guide explains how to configure Cloudflare Workers Builds for automatic deployments with preview environments.

## Overview

Workers Builds automatically builds and deploys your Worker when you push to Git. It supports:
- **Production deployments** from your main branch
- **Preview deployments** from pull requests and feature branches
- **Environment-specific configuration** using Wrangler environments

## Setup Steps

### 1. Connect Your Repository

1. Go to [Cloudflare Dashboard → Workers → Builds](https://dash.cloudflare.com/workers-and-pages)
2. Click **"Connect to Git"**
3. Select your Git provider (GitHub, GitLab, etc.)
4. Authorize Cloudflare to access your repository
5. Select the repository: `allthingslinux/allthingslinux.com`

### 2. Configure Build Settings

In the Build Configuration section:

#### Production Branch Deploy Command

For your **main/production branch**:

```bash
pnpm install && pnpm run build:all && pnpm exec opennextjs-cloudflare deploy -- --env prod
```

Or if using npm/yarn:
```bash
npm install && npm run build:all && npx opennextjs-cloudflare deploy -- --env prod
```

**Settings:**
- **Root directory:** `/` (or leave empty if repo root)
- **Build command:** `pnpm run build:all`
- **Deploy command:** `pnpm exec opennextjs-cloudflare deploy -- --env prod`

#### Non-Production Branch Deploy Command

For **all other branches** (pull requests, feature branches):

```bash
pnpm install && pnpm run build:all && pnpm exec opennextjs-cloudflare deploy -- --env dev
```

Or if using npm/yarn:
```bash
npm install && npm run build:all && npx opennextjs-cloudflare deploy -- --env dev
```

**Settings:**
- **Root directory:** `/` (or leave empty if repo root)
- **Build command:** `pnpm run build:all`
- **Deploy command:** `pnpm exec opennextjs-cloudflare deploy -- --env dev`

### 3. Configure Environment Variables

#### Build Environment Variables

Set these in the Workers Builds configuration:

- `PNPM_VERSION=10.17.0` (or your pnpm version)
- `NODE_VERSION=22.14.0` (or your Node version)

#### Secrets

Secrets are **not** set via Workers Builds environment variables. Instead:

1. **Set secrets manually** using the secrets script:
   ```bash
   pnpm run secrets:dev   # For dev environment
   pnpm run secrets:prod  # For prod environment
   ```

2. Secrets are **per-worker** (environment-specific):
   - Dev environment → `allthingslinux-dev` worker
   - Prod environment → `allthingslinux-prod` worker (when using `--env prod`)

### 4. Branch Configuration

- **Production branch:** `main` (or your default branch)
- **Non-production branches:** All other branches (PRs, feature branches)

When a non-production branch is pushed:
- Workers Builds automatically builds and deploys to the `dev` environment
- Uses variables from `wrangler.jsonc` → `env.dev` section
- Uses secrets set on `allthingslinux-dev` worker

### 5. Verify Configuration

After setup:

1. **Push to main branch:**
   - Should deploy to production (`allthingslinux-prod` or `allthingslinux` depending on config)
   - Uses production secrets and variables

2. **Create a pull request:**
   - Should automatically deploy to dev environment
   - Preview URL will be generated (if Preview URLs are enabled)
   - Uses dev secrets and variables

## How It Works

### Deployment Flow

```
┌─────────────────────────────────────────────────────────┐
│                   Git Push Event                        │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
   Main Branch?      Other Branch?
        │                   │
        ▼                   ▼
┌──────────────┐   ┌──────────────────┐
│ Deploy Prod  │   │ Deploy Dev       │
│ --env prod   │   │ --env dev        │
└──────┬───────┘   └────────┬─────────┘
       │                    │
       ▼                    ▼
┌──────────────┐   ┌──────────────────┐
│ allthingslinux│   │ allthingslinux-dev│
│ -prod worker │   │ worker            │
│              │   │                   │
│ Prod vars    │   │ Dev vars          │
│ Prod secrets │   │ Dev secrets       │
└──────────────┘   └──────────────────┘
```

### Environment Configuration

Your `wrangler.jsonc` already has environment-specific config:

**Dev Environment** (`--env dev`):
- Worker name: `allthingslinux-dev` (auto-generated)
- Variables: `NEXT_PUBLIC_URL=https://allthingslinux-dev.allthingslinux.workers.dev`
- Secrets: Set via `pnpm run secrets:dev`
- KV namespaces: Dev-specific
- R2 buckets: `atl-cache-dev`

**Prod Environment** (`--env prod`):
- Worker name: `allthingslinux-prod` (auto-generated)
- Variables: `NEXT_PUBLIC_URL=https://allthingslinux.org`
- Secrets: Set via `pnpm run secrets:prod`
- KV namespaces: Prod-specific
- R2 buckets: `atl-cache-prod`

## Troubleshooting

### Preview URLs Not Working

**Issue:** Preview URLs don't generate for your deployments.

**Solution:** Preview URLs don't work with Durable Objects. Your worker uses Durable Objects, so Preview URLs won't be automatically generated. Instead:
- Dev deployments use the `workers_dev` subdomain: `https://allthingslinux-dev.<subdomain>.workers.dev`
- You can manually deploy preview branches with `pnpm run deploy:dev`

### Build Failures

**Issue:** Build fails in Workers Builds.

**Common causes:**
1. **Missing dependencies:** Ensure `pnpm install` runs before build
2. **Node version mismatch:** Set `NODE_VERSION` in build environment variables
3. **Missing secrets:** Set secrets using `pnpm run secrets:dev` or `secrets:prod`

### Wrong Environment Variables

**Issue:** Preview deployments use production variables.

**Solution:** Verify the deploy command uses `--env dev` for non-production branches:
```bash
pnpm exec opennextjs-cloudflare deploy -- --env dev
```

### Secrets Not Available

**Issue:** Worker can't access secrets in preview deployments.

**Solution:**
1. Secrets are worker-specific
2. Ensure secrets are set on the correct worker:
   - Dev previews → `allthingslinux-dev` worker
   - Production → `allthingslinux-prod` worker
3. Use `pnpm run secrets:dev` to set dev secrets

## Manual Testing

Test your setup manually:

```bash
# Test dev deployment (simulates preview branch)
pnpm run deploy:dev

# Test prod deployment (simulates main branch)
pnpm run deploy:prod
```

## Additional Resources

- [Workers Builds Documentation](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Wrangler Environments](https://developers.cloudflare.com/workers/wrangler/environments/)
- [Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
