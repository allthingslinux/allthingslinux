#!/bin/bash

# Script to manually set secrets in Cloudflare Worker environment
# Note: GitHub Actions automatically handles secrets in separate environment workers
# This script is for manual local secret management only

# Environment to set secrets for (dev or prod)
ENV=${1:-dev}

# Validate environment parameter
if [ "$ENV" != "dev" ] && [ "$ENV" != "prod" ]; then
  echo "Error: Invalid environment specified. Use 'dev' or 'prod'."
  exit 1
fi

WORKER_NAME="allthingslinux-${ENV}"

echo "Setting secrets for worker: $WORKER_NAME"
echo "Environment: $ENV"
echo ""

# Load secrets from .env.secrets files (same pattern as deploy scripts)
# These files are optional and may not exist, so we suppress shellcheck warnings
if [ -f .env.secrets.prod ]; then
  # shellcheck source=.env.secrets.prod
  # shellcheck disable=SC1091
  source .env.secrets.prod 2>/dev/null
elif [ -f .env.secrets.dev ]; then
  # shellcheck source=.env.secrets.dev
  # shellcheck disable=SC1091
  source .env.secrets.dev 2>/dev/null
fi
export CLOUDFLARE_API_TOKEN

# Verify wrangler authentication
echo "Verifying Wrangler authentication..."
if ! pnpm exec wrangler whoami >/dev/null 2>&1; then
  echo "Error: Wrangler authentication failed"
  echo ""
  echo "Troubleshooting steps:"
  echo "1. If using API token: Add CLOUDFLARE_API_TOKEN to .env.secrets.prod or .env.secrets.dev"
  echo "2. If token is invalid: Get a new token from https://developers.cloudflare.com/fundamentals/api/get-started/create-token/"
  echo "3. If OAuth is corrupted: Run 'wrangler logout' then 'wrangler login'"
  echo "4. Token permissions needed: Account:Cloudflare Workers:Edit, Account:Workers KV Storage:Edit, Account:Workers Scripts:Edit"
  exit 1
fi
echo "✓ Authentication verified"
echo ""

# Helper function to set a secret
set_secret() {
  local SECRET_NAME=$1
  local SECRET_VALUE=$2

  if [ -z "$SECRET_VALUE" ]; then
    echo "⚠ Skipping $SECRET_NAME (value not provided)"
    return 0
  fi

  echo "Setting $SECRET_NAME..."
  if echo "$SECRET_VALUE" | pnpm exec wrangler secret put "$SECRET_NAME" --env "$ENV"; then
    echo "✓ $SECRET_NAME set successfully"
    return 0
  else
    echo "✗ Failed to set $SECRET_NAME"
    return 1
  fi
}

ERRORS=0

# Set secrets (same pattern as GitHub Actions workflow)
echo "Setting secrets..."
echo ""

# Core secrets
set_secret "QUICKBOOKS_CLIENT_ID" "${QUICKBOOKS_CLIENT_ID}" || ((ERRORS++))
set_secret "QUICKBOOKS_CLIENT_SECRET" "${QUICKBOOKS_CLIENT_SECRET}" || ((ERRORS++))
set_secret "QUICKBOOKS_REFRESH_TOKEN" "${QUICKBOOKS_REFRESH_TOKEN}" || ((ERRORS++))
set_secret "QUICKBOOKS_REALM_ID" "${QUICKBOOKS_REALM_ID}" || ((ERRORS++))
set_secret "QUICKBOOKS_ADMIN_KEY" "${QUICKBOOKS_ADMIN_KEY}" || ((ERRORS++))
set_secret "GITHUB_TOKEN" "${GITHUB_TOKEN}" || ((ERRORS++))
set_secret "MONDAY_API_KEY" "${MONDAY_API_KEY}" || ((ERRORS++))
set_secret "TRIGGER_SECRET_KEY" "${TRIGGER_SECRET_KEY}" || ((ERRORS++))

# Variables (non-sensitive) - note: these are set as secrets for consistency
set_secret "MONDAY_BOARD_ID" "${MONDAY_BOARD_ID}" || ((ERRORS++))
set_secret "DISCORD_WEBHOOK_URL" "${DISCORD_WEBHOOK_URL}" || ((ERRORS++))

# QUICKBOOKS_ENVIRONMENT (optional, auto-detected if not set)
if [ -n "$QUICKBOOKS_ENVIRONMENT" ]; then
  set_secret "QUICKBOOKS_ENVIRONMENT" "${QUICKBOOKS_ENVIRONMENT}" || ((ERRORS++))
fi

echo ""
if [ $ERRORS -eq 0 ]; then
  echo "✓ All secrets set successfully"
  echo ""
  echo "Note: GitHub Actions automatically manages these secrets during CI/CD."
  echo "This manual script is mainly for local testing and initial setup."
  exit 0
else
  echo "✗ Secret operations completed with $ERRORS error(s)"
  echo "Check output above for details."
  exit 1
fi
