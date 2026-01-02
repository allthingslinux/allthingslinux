#!/bin/bash
# Deploy script for Cloudflare Workers Builds
# Automatically selects dev or prod environment based on branch

set -e

# Get the current branch (try multiple environment variables that Workers Builds might set)
# Cloudflare Workers Builds typically sets branch info in env vars
if [ -n "$CF_PAGES_BRANCH" ]; then
  BRANCH="$CF_PAGES_BRANCH"
elif [ -n "$CUSTOM_BRANCH" ]; then
  BRANCH="$CUSTOM_BRANCH"
elif [ -n "$GITHUB_REF" ]; then
  # Extract branch from refs/heads/branch-name
  BRANCH="${GITHUB_REF#refs/heads/}"
elif [ -n "$GIT_BRANCH" ]; then
  BRANCH="$GIT_BRANCH"
else
  # Fallback to git command (may not work in all CI environments)
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
fi

# Debug: Log detected branch (helpful for troubleshooting)
echo "📍 Detected branch: $BRANCH"

# Determine environment based on branch
if [ "$BRANCH" = "main" ]; then
  ENV="prod"
  echo "🚀 Deploying to PRODUCTION (branch: $BRANCH)"
else
  ENV="dev"
  echo "🔧 Deploying to DEVELOPMENT (branch: $BRANCH)"
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build
echo "🔨 Building application..."
pnpm run build:all

# Deploy with appropriate environment
echo "🚀 Deploying to $ENV environment..."
pnpm exec opennextjs-cloudflare deploy -- --env "$ENV"

echo "✅ Deployment complete!"
