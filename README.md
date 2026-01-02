# All Things Linux

[![Deploy to Production](https://img.shields.io/badge/Production-Deployed-brightgreen)](https://allthingslinux.org)
[![Deploy to Dev](https://img.shields.io/badge/Dev-Deployed-blue)](https://allthingslinux.dev)

The official website for All Things Linux ([allthingslinux.org](https://allthingslinux.org)).

## 🚀 Quick Start

```bash
# Clone & setup
git clone https://github.com/allthingslinux/allthingslinux.git
cd allthingslinux
pnpm install

# Setup Cloudflare bindings (R2, KV) - IMPORTANT: Update wrangler.jsonc with KV ID from output
pnpm run setup:bindings

# Start development
pnpm run dev:all
```
```bash
# Development with all services
pnpm run dev:all  # Next.js + Wrangler + Trigger.dev
```
```bash
# Development with all services
pnpm run dev:all  # Next.js + Wrangler + Trigger.dev
```

Open [http://localhost:3000](http://localhost:3000) for Next.js dev, or [http://localhost:8788](http://localhost:8788) for Cloudflare Workers simulation.

## 📋 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Content:** Contentlayer (MDX blogs)
- **Deployment:** Cloudflare Workers + OpenNext (^1.14.7)
- **Background Jobs:** Trigger.dev
- **Package Manager:** pnpm

## 📋 Prerequisites

- **Node.js** (see `package.json` engines field)
- **pnpm** - `npm install -g pnpm`
- **Cloudflare Account** (for deployments & secrets)
- **Trigger.dev Account** (for background jobs)

## 🛠️ Setup & Development

### 1. Clone & Install

```bash
git clone https://github.com/allthingslinux/allthingslinux.git
```bash
cd allthingslinux
pnpm install
```

### 2. Setup Cloudflare Bindings

```bash
# Create R2 buckets and KV namespaces
pnpm run setup:bindings

# IMPORTANT: Update wrangler.jsonc with the KV namespace ID shown in the script output
```

### 3. Configure Secrets

**For local development**, create `.env.secrets.dev` and `.env.secrets.prod` files (these are gitignored):

```bash
# Create .env.secrets.dev for local development (sandbox credentials)
# Create .env.secrets.prod for production credentials
# Add your secrets following the format: KEY=value (one per line)
```

**For CI/CD**, secrets are managed via GitHub Environments (see Deployment section below).

**Upload secrets to Cloudflare manually** (when needed):

```bash
```bash
pnpm run secrets:dev   # Upload dev/sandbox secrets (sets DEV_* prefixed secrets)
pnpm run secrets:prod  # Upload production secrets (sets PROD_* prefixed secrets)
```

### 4. Start Development

```bash
pnpm run dev:all  # Next.js + Wrangler + Trigger.dev
```

**URLs:**

- **Next.js Dev:** [http://localhost:3000](http://localhost:3000) (with HMR)
- **Workers Sim:** [http://localhost:8788](http://localhost:8788) (Cloudflare environment)

## 🚀 Deployment

### Automatic Deployments (GitHub Actions CI/CD)

**GitHub Actions with GitHub Environments** - Automatic deployments on push/PR:

| Branch   | Environment | URL                                              |
| -------- | ----------- | ------------------------------------------------ |
| `main`   | Production  | [allthingslinux.org](https://allthingslinux.org) |
| PR/other | Development | [allthingslinux.dev](https://allthingslinux.dev) |

**Quick setup:**

1. Create GitHub Environments: `dev` and `prod` (Settings → Environments)
2. Add secrets and variables to each environment:
   - **Secrets** (sensitive): `QUICKBOOKS_CLIENT_ID`, `QUICKBOOKS_CLIENT_SECRET`, `QUICKBOOKS_REFRESH_TOKEN`, `QUICKBOOKS_REALM_ID`, `QUICKBOOKS_ADMIN_KEY`, `GITHUB_TOKEN`, `MONDAY_API_KEY`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `TRIGGER_SECRET_KEY`
   - **Variables** (non-sensitive): `MONDAY_BOARD_ID`, `DISCORD_WEBHOOK_URL`, `QUICKBOOKS_ENVIRONMENT`
3. Push to any branch → Auto-deploys to development environment
4. Merge to `main` → Auto-deploys to production environment

See [`docs/integrations/quickbooks.md`](docs/integrations/quickbooks.md) for detailed QuickBooks integration setup.

**Architecture:** Separate Cloudflare Workers for dev/prod with isolated R2/KV bindings. `.github/workflows/deploy.yml` automatically handles branch detection and deploys to appropriate worker.

### Manual Deployments

#### Quick Deploy (Immediate)

```bash
pnpm run deploy:dev     # Deploy immediately to dev
```bash
pnpm run deploy:prod    # Deploy immediately to prod
pnpm run deploy         # Quick production deploy
```

#### Version Management (Safer Production)

```bash
pnpm run version:upload # Upload version to production
```bash
pnpm run version:list   # List all versions
pnpm run version:deploy # Deploy latest version
```

**Benefits:**

- **Rollback capability**: Quickly revert to previous versions
- **Audit trail**: Track deployment history
- **Risk reduction**: Test versions before full deployment

### Build Process

```bash
# Full production build (Next.js + OpenNext for Cloudflare)
pnpm run build:all

# Next.js build only
pnpm run build

# Preview build locally (tests the Cloudflare Workers build)
pnpm run preview           # Standard preview
pnpm run preview:profile   # Preview with profiling settings
```
```bash
# Development commands
```bash
pnpm run dev:all       # Start all services
pnpm run trigger       # Start Trigger.dev CLI
```

## 📁 Project Structure

## 🔐 Secrets & Environment

### CI/CD (GitHub Actions) - Recommended

**For automatic deployments**, use GitHub Environments with secrets:

1. **Set up GitHub Environments**: Create `dev` and `prod` environments (Settings → Environments)
2. **Add secrets** to each environment (same secret names, different values per environment)
3. **Secrets are automatically available** in GitHub Actions workflows

**Separate Workers**: Development and production use separate Cloudflare Workers for complete isolation.

### Manual Secret Management (Local)

**Note:** GitHub Actions automatically manages secrets during CI/CD. Manual secret management is mainly for local testing.

**For manual secret setup from your local machine:**

```bash
# 1. Create .env.secrets.dev and .env.secrets.prod files (gitignored)
# Format: KEY=value (one per line)
# .env.secrets.dev: Sandbox QuickBooks + other dev secrets
# .env.secrets.prod: Production QuickBooks + other prod secrets

# 2. Upload to Cloudflare Worker (sets prefixed secrets: DEV_*, PROD_*)
```bash
pnpm run secrets:dev    # Sets DEV_* prefixed secrets
pnpm run secrets:prod   # Sets PROD_* prefixed secrets
```

### Security Notes

- **Never commit** `.env.secrets.*` (they're gitignored)
- **GitHub Environments** are the recommended way for CI/CD (secrets isolated per environment)
- **Secrets are encrypted** and managed via `wrangler secret put` or GitHub Environments
- **Use `.dev.vars`** only for non-sensitive local config
- **Environment variables** are defined in `wrangler.jsonc` per environment
- **Prefixed secrets**: Secrets are stored as `DEV_*` and `PROD_*` in the single worker, selected at runtime

## 📁 Project Structure

```text
├── app/                 # Next.js App Router pages
├── components/          # React components
├── content/            # MDX blog content
├── lib/                # Utilities & integrations
├── public/             # Static assets
├── scripts/            # Build & utility scripts
```text
├── trigger/            # Background job definitions
└── wrangler.jsonc      # Cloudflare Workers config
```

## 🛠️ Development Scripts

```bash
# Development
pnpm run dev:all        # Full stack (Next.js + Wrangler + Trigger)
pnpm run dev            # Next.js development server
pnpm run dev:turbo      # Next.js with TurboPack (faster)
pnpm run wrangler       # Cloudflare Workers dev server
pnpm run trigger        # Trigger.dev background jobs

# Building
pnpm run build:all             # Build Next.js + OpenNext
pnpm run build                 # Next.js build only
pnpm run build:opennext        # Cloudflare OpenNext build
pnpm run build:opennext:profile # Build with profiling (unminified)

# Testing
pnpm run preview        # Test built Cloudflare app locally
pnpm run check          # Run all code quality checks
pnpm run lint           # ESLint
pnpm run format         # Prettier
pnpm run check:ts       # TypeScript check

# Deployment
pnpm run deploy:dev     # Deploy to development
pnpm run deploy:prod    # Deploy to production
pnpm run deploy         # Quick production deploy

# Version Management
pnpm run version:upload # Upload version to production
pnpm run version:list   # List all versions
pnpm run version:deploy # Deploy latest version

# Secrets
pnpm run secrets:dev    # Upload dev secrets (sets DEV_* prefixed)
pnpm run secrets:prod   # Upload prod secrets (sets PROD_* prefixed)

# Infrastructure
pnpm run setup:bindings # Setup Cloudflare bindings (R2, KV)
```bash
pnpm run cf:typegen     # Generate Cloudflare types
pnpm run analyze:bundle # Bundle size analysis guidance
pnpm run coc:generate   # Generate Code of Conduct
```

### Troubleshooting

See [`PNPM_SCRIPTS.md`](PNPM_SCRIPTS.md) for detailed script explanations.

## 🐛 Troubleshooting

### Common Issues

#### Build fails with "Module not found"

```bash
# Clear caches and reinstall
```bash
rm -rf node_modules .next .open-next
pnpm install
```

#### Wrangler secrets not working

```bash
# Check secrets are uploaded
npx wrangler secret list --env local

```bash
# Re-upload if needed
# Local secrets are handled via .dev.vars
```

#### Trigger.dev not connecting

```bash
```bash
# Check Trigger.dev CLI is running
pnpm run trigger
```

#### Environment variables not loading

- Check `.dev.vars` syntax (KEY=value, one per line)
- Ensure `NODE_ENV` is set correctly (Next.js sets this automatically - use only `development`, `production`, or `test`)
- Restart development servers after changes

### Performance Profiling

For performance analysis and debugging:

```bash
# Build with profiling (unminified code)
pnpm run build:opennext:profile

# Preview with profiling settings
pnpm run preview:profile

# Analyze bundle size
pnpm run analyze:bundle
```

### Need Help?

- **Issues:** [GitHub Issues](https://github.com/allthingslinux/allthingslinux/issues)
- **Discussions:** [GitHub Discussions](https://github.com/allthingslinux/allthingslinux/discussions)
- **Documentation:** Check [`PNPM_SCRIPTS.md`](PNPM_SCRIPTS.md) for detailed script info

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test locally
4. Submit a pull request

See [CONTRIBUTING.md](https://github.com/allthingslinux/allthingslinux/blob/main/code-of-conduct/CONTRIBUTING.md) for detailed guidelines.

---

Built with ❤️ by the All Things Linux community.
