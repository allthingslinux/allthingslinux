# PNPM Scripts Reference

This document explains all available pnpm scripts in the project.

## Development

- `pnpm run dev`
  Starts Next.js development server with hot module replacement at `http://localhost:3000`.

- `pnpm run dev:turbo`
  Starts Next.js development server using TurboPack (experimental faster Rust-based engine).

- `pnpm run dev:all`
  Runs full-stack development: Next.js + Cloudflare Workers simulator + Trigger.dev background jobs.

- `pnpm run wrangler`
  Starts Cloudflare Workers development server with local environment simulation at `http://localhost:8788`.

- `pnpm run trigger`
  Starts Trigger.dev development server for background job management.

## Building

- `pnpm run build`
  Compiles Next.js application for production.

- `pnpm run build:all`
  Builds both Next.js and OpenNext.js Cloudflare adapter for complete deployment preparation.

- `pnpm run build:opennext`
  Compiles the application using OpenNext.js Cloudflare adapter for Cloudflare Workers deployment.

- `pnpm run build:opennext:profile`
  Compiles with --noMinify flag for performance profiling and debugging (unminified code).

## Testing & Preview

- `pnpm run preview`
  Builds and runs the Cloudflare application locally to test the production build.

- `pnpm run preview:profile`
  Builds with profiling settings and runs locally for performance analysis.

## Deployment

- `pnpm run deploy:dev`
  Builds and deploys to the development Cloudflare Worker (allthingslinux-dev) with separate R2/KV bindings.

- `pnpm run deploy:prod`
  Builds and deploys to the production Cloudflare Worker (allthingslinux-prod) with separate R2/KV bindings.

- `pnpm run deploy`
  Alias for production deployment - the default deploy command.

## Version Management

- `pnpm run version:upload`
  Creates a new version in the development Cloudflare Worker without deploying it immediately.

- `pnpm run version:deploy`
  Deploys the latest uploaded version to the development Cloudflare Worker.

- `pnpm run version:list`
  Lists all versions of the development Cloudflare Worker with metadata.

## Secrets Management

- `pnpm run secrets:dev`
  Uploads secrets from `.env.secrets.dev` to the development Cloudflare Worker (uses `.github/scripts/secrets.sh`).

- `pnpm run secrets:prod`
  Uploads secrets from `.env.secrets.prod` to the production Cloudflare Worker (uses `.github/scripts/secrets.sh`).

## Code Quality

- `pnpm run lint`
  Runs ESLint to check JavaScript/TypeScript code quality.

- `pnpm run format`
  Runs Prettier to format all code files.

- `pnpm run check`
  Runs all code quality checks: TypeScript, formatting, and MDX validation.

- `pnpm run check:ts`
  Runs TypeScript compiler to validate types.

- `pnpm run check:format`
  Checks if files are properly formatted with Prettier.

- `pnpm run check:mdx`
  Validates MDX files in the blog content directory.

## Infrastructure

- `pnpm run setup:bindings`
  Sets up Cloudflare bindings (R2 buckets, KV namespaces). IMPORTANT: Update wrangler.jsonc with the KV ID from the script output.

- `pnpm run cf:typegen`
  Generates TypeScript types for Cloudflare Workers bindings and environment variables.

- `pnpm run test`
  Runs the test suite using Vitest with Cloudflare Workers testing capabilities.

- `pnpm run analyze:bundle`
  Provides guidance for bundle size analysis using ESBuild Bundle Analyzer on the built worker code.

- `pnpm run coc:generate`
  Generates the Code of Conduct markdown file from TOML configuration.
