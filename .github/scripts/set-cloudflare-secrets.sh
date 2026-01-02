#!/bin/bash

# Script to set prefixed secrets in Cloudflare Worker from GitHub Environment secrets/variables
# This is used by GitHub Actions CI/CD workflow
# Mirrors the pattern used in scripts/secrets.sh for consistency

set -e

# Environment type (DEV or PROD) - passed as first argument
ENV_TYPE=${1:-DEV}

# Validate environment parameter
if [ "$ENV_TYPE" != "DEV" ] && [ "$ENV_TYPE" != "PROD" ]; then
  echo "Error: Invalid environment type. Use 'DEV' or 'PROD'."
  exit 1
fi

PREFIX="$ENV_TYPE"
WORKER_NAME="allthingslinux"

echo "🔐 Setting $ENV_TYPE prefixed secrets in Cloudflare Worker..."
echo "Worker: $WORKER_NAME"
echo "Prefix: $PREFIX"
echo ""

# Helper function to set a prefixed secret (same pattern as scripts/secrets.sh)
set_prefixed_secret() {
  local BASE_NAME=$1
  local SECRET_VALUE=$2
  local PREFIXED_NAME="${PREFIX}_${BASE_NAME}"
  
  if [ -z "$SECRET_VALUE" ]; then
    echo "⚠ Skipping $PREFIXED_NAME (value not provided)"
    return 0
  fi
  
  echo "Setting $PREFIXED_NAME..."
  if echo "$SECRET_VALUE" | pnpm exec wrangler secret put "$PREFIXED_NAME" --name "$WORKER_NAME"; then
    echo "✓ $PREFIXED_NAME set successfully"
    return 0
  else
    echo "✗ Failed to set $PREFIXED_NAME"
    return 1
  fi
}

ERRORS=0

# Sensitive secrets (from GitHub Environment Secrets)
# These are passed as environment variables from the workflow
set_prefixed_secret "QUICKBOOKS_CLIENT_ID" "${QUICKBOOKS_CLIENT_ID}" || ((ERRORS++))
set_prefixed_secret "QUICKBOOKS_CLIENT_SECRET" "${QUICKBOOKS_CLIENT_SECRET}" || ((ERRORS++))
set_prefixed_secret "QUICKBOOKS_REFRESH_TOKEN" "${QUICKBOOKS_REFRESH_TOKEN}" || true
set_prefixed_secret "QUICKBOOKS_REALM_ID" "${QUICKBOOKS_REALM_ID}" || true
set_prefixed_secret "QUICKBOOKS_ADMIN_KEY" "${QUICKBOOKS_ADMIN_KEY}" || ((ERRORS++))
set_prefixed_secret "GITHUB_TOKEN" "${GITHUB_TOKEN}" || true
set_prefixed_secret "MONDAY_API_KEY" "${MONDAY_API_KEY}" || ((ERRORS++))

# Non-sensitive variables (from GitHub Environment Variables)
# Note: Even though not sensitive, we set as Cloudflare secrets to maintain prefix structure for environment isolation
set_prefixed_secret "MONDAY_BOARD_ID" "${MONDAY_BOARD_ID}" || ((ERRORS++))
set_prefixed_secret "DISCORD_WEBHOOK_URL" "${DISCORD_WEBHOOK_URL}" || ((ERRORS++))

# QUICKBOOKS_ENVIRONMENT (optional, auto-detected if not set)
if [ -n "${QUICKBOOKS_ENVIRONMENT}" ]; then
  set_prefixed_secret "QUICKBOOKS_ENVIRONMENT" "${QUICKBOOKS_ENVIRONMENT}" || ((ERRORS++))
fi

echo ""
if [ $ERRORS -eq 0 ]; then
  echo "✓ All ${PREFIX}_* prefixed secrets set successfully"
  exit 0
else
  echo "✗ Secret operations completed with $ERRORS error(s)"
  echo "Check output above for details."
  exit 1
fi
