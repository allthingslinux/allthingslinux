# All Things Linux

[![Deploy to Production](https://img.shields.io/badge/Production-Deployed-brightgreen)](https://allthingslinux.org)
[![Deploy to Dev](https://img.shields.io/badge/Dev-Deployed-blue)](https://allthingslinux-dev.allthingslinux.workers.dev)

The official website for All Things Linux ([allthingslinux.org](https://allthingslinux.org)).

## 🚀 Quick Start

```bash
# Clone & setup
git clone https://github.com/allthingslinux/allthingslinux.git
cd allthingslinux
pnpm install

# Set up secrets
cp .env.secrets.example .env.secrets
# Edit .env.secrets with your actual secrets

# Start development
pnpm run dev:all
```

Open [http://localhost:3000](http://localhost:3000) for Next.js dev, or [http://localhost:8788](http://localhost:8788) for Cloudflare Workers simulation.

## 📋 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Content:** Contentlayer (MDX blogs)
- **Deployment:** Cloudflare Workers + OpenNext
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
cd allthingslinux
pnpm install
```

### 2. Configure Secrets

```bash
# Copy templates for environment-specific secrets
cp .env.secrets.dev.example .env.secrets.dev    # Development (sandbox)
cp .env.secrets.prod.example .env.secrets.prod  # Production
# Edit each file with appropriate credentials (gitignored)

# Upload secrets to Cloudflare (when needed for deployment)
# pnpm run secrets:dev   # Upload dev/sandbox secrets
# pnpm run secrets:prod  # Upload production secrets
```

### 3. Start Development

```bash
pnpm run dev:all  # Next.js + Wrangler + Trigger.dev
```

**URLs:**

- **Next.js Dev:** [http://localhost:3000](http://localhost:3000) (with HMR)
- **Workers Sim:** [http://localhost:8788](http://localhost:8788) (Cloudflare environment)

## 🚀 Deployment

### Automatic Deployments (GitHub Actions CI/CD)

**GitHub Actions with GitHub Environments** - Automatic deployments on push/PR:

| Branch   | Environment | URL                                                                      |
| -------- | ----------- | ------------------------------------------------------------------------ |
| `main`   | Production  | [allthingslinux.org](https://allthingslinux.org)                         |
| PR/other | Development | [dev.allthingslinux.workers.dev](https://dev.allthingslinux.workers.dev) |

**Setup:** See [GitHub Environments Setup Guide](docs/GITHUB_ENVIRONMENTS_SETUP.md) for detailed configuration.

**Quick setup:**

1. Create GitHub Environments: `dev` and `prod` (Settings → Environments)
2. Add secrets to each environment (see guide for required secrets)
3. Push to any branch → Auto-deploys via GitHub Actions
4. Merge to `main` → Auto-deploys to production

**Workflow:** `.github/workflows/deploy.yml` automatically handles branch detection and environment selection.

### Manual Deployments

#### Quick Deploy (Immediate)

```bash
pnpm run deploy:dev     # Deploy immediately to dev
pnpm run deploy:prod    # Deploy immediately to prod
pnpm run deploy         # Quick production deploy
```

#### Version Management (Safer Production)

```bash
pnpm run version:upload # Upload version to production
pnpm run version:list   # List all versions
pnpm run version:deploy # Deploy latest version
```

**Benefits:**

- **Rollback capability**: Quickly revert to previous versions
- **Audit trail**: Track deployment history
- **Risk reduction**: Test versions before full deployment

### Build Process

```bash
# Full production build
pnpm run build

# Preview build locally
pnpm run preview
```

## 🔐 Secrets & Environment

### CI/CD (GitHub Actions) - Recommended

**For automatic deployments**, use GitHub Environments with secrets:

1. **Set up GitHub Environments**: Create `dev` and `prod` environments (Settings → Environments)
2. **Add secrets** to each environment (same secret names, different values per environment)
3. **Secrets are automatically available** in GitHub Actions workflows

See [GitHub Environments Setup Guide](docs/GITHUB_ENVIRONMENTS_SETUP.md) for complete setup instructions.

### Manual Deployment (Local)

**For manual deployments from your local machine:**

```bash
# 1. Copy templates for each environment
cp .env.secrets.dev.example .env.secrets.dev    # Sandbox credentials
cp .env.secrets.prod.example .env.secrets.prod  # Production credentials

# 2. Edit with real values
# .env.secrets.dev: Sandbox QuickBooks + other dev secrets
# .env.secrets.prod: Production QuickBooks + other prod secrets

# 3. Upload to Cloudflare (when needed)
pnpm run secrets:dev    # Dev environment (uses .env.secrets.dev)
pnpm run secrets:prod   # Production (uses .env.secrets.prod)
```

### Security Notes

- **Never commit** `.env.secrets.*` (they're gitignored)
- **GitHub Environments** are the recommended way for CI/CD (secrets isolated per environment)
- **Secrets are encrypted** and managed via `wrangler secret put` or GitHub Environments
- **Use `.dev.vars`** only for non-sensitive local config
- **Environment variables** are defined in `wrangler.jsonc` per environment
- **No prefixing needed**: GitHub Environments handle isolation automatically

## 📁 Project Structure

```
├── app/                 # Next.js App Router pages
├── components/          # React components
├── content/            # MDX blog content
├── lib/                # Utilities & integrations
├── public/             # Static assets
├── scripts/            # Build & utility scripts
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
pnpm run build:all      # Build Next.js + OpenNext
pnpm run build          # Next.js build only
pnpm run build:opennext # Cloudflare OpenNext build

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
pnpm run secrets:dev    # Upload to dev env
pnpm run secrets:prod   # Upload to prod env

# Infrastructure
pnpm run cf:typegen      # Generate Cloudflare types
pnpm run coc:generate    # Generate Code of Conduct
```

See [`PNPM_SCRIPTS.md`](PNPM_SCRIPTS.md) for detailed script explanations.

## 🐛 Troubleshooting

### Common Issues

**Build fails with "Module not found"**

```bash
# Clear caches and reinstall
rm -rf node_modules .next .open-next
pnpm install
```

**Wrangler secrets not working**

```bash
# Check secrets are uploaded
npx wrangler secret list --env local

# Re-upload if needed
# Local secrets are handled via .dev.vars
```

**Trigger.dev not connecting**

```bash
# Check Trigger.dev CLI is running
pnpm run trigger
```

**Environment variables not loading**

- Check `.dev.vars` syntax (KEY=value, one per line)
- Ensure `NODE_ENV` is set correctly (Next.js sets this automatically - use only `development`, `production`, or `test`)
- Restart development servers after changes

### Need Help?

- **Issues:** [GitHub Issues](https://github.com/allthingslinux/allthingslinux/issues)
- **Discussions:** [GitHub Discussions](https://github.com/allthingslinux/allthingslinux/discussions)
- **Documentation:** Check [`PNPM_SCRIPTS.md`](PNPM_SCRIPTS.md) for detailed script info

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test locally
4. Submit a pull request

See [CONTRIBUTING.md](https://github.com/allthingslinux/allthingslinux/blob/main/CONTRIBUTING.md) for detailed guidelines.

---

Built with ❤️ by the All Things Linux community.
