#!/bin/bash

# Environment to set secrets for (dev, prod, or local)
ENV=${1:-dev}

# Validate environment parameter
if [ "$ENV" != "dev" ] && [ "$ENV" != "prod" ] && [ "$ENV" != "local" ]; then
  echo "Error: Invalid environment specified. Use 'dev', 'prod', or 'local'."
  exit 1
fi

echo "Setting secrets for environment: $ENV (using wrangler.jsonc)"

# Note: Wrangler auto-creates worker names as <top-level-name>-<env-name>
# - dev env → allthingslinux-dev
# - prod env → allthingslinux-prod (or use top-level for production)
# - top-level (no env) → allthingslinux

# Use --env flag for all environments (Wrangler auto-creates worker names)
# - dev → allthingslinux-dev
# - prod → allthingslinux-prod  
echo "Setting secrets for environment: $ENV"
USE_ENV_FLAG="--env"
WRANGLER_ENV="$ENV"

# Load secrets from .env.secrets (excluded from git)
# Try environment-specific file first, then fallback to generic
SECRETS_FILE=".env.secrets.$ENV"
if [ ! -f "$SECRETS_FILE" ]; then
  SECRETS_FILE=".env.secrets"
fi

if [ -f "$SECRETS_FILE" ]; then
  echo "Loading secrets from: $SECRETS_FILE"
  source "$SECRETS_FILE"
else
  echo "Error: No secrets file found. Expected $SECRETS_FILE or .env.secrets"
  exit 1
fi

# Handle Cloudflare authentication
# CLOUDFLARE_API_TOKEN can be in the secrets file or environment
# If not found, wrangler will try OAuth (interactive) or fail (non-interactive)
if [ -n "${CLOUDFLARE_API_TOKEN:-}" ]; then
  export CLOUDFLARE_API_TOKEN
  # Check if it was loaded from secrets file (sourced above) or environment
  if grep -q "^CLOUDFLARE_API_TOKEN=" "$SECRETS_FILE" 2>/dev/null; then
    echo "Using CLOUDFLARE_API_TOKEN from secrets file"
  else
    echo "Using CLOUDFLARE_API_TOKEN from environment"
  fi
else
  echo "Warning: CLOUDFLARE_API_TOKEN not found in secrets file or environment"
  echo "Wrangler will attempt OAuth authentication (requires interactive terminal)"
  echo "For non-interactive environments, add CLOUDFLARE_API_TOKEN to $SECRETS_FILE"
  echo "Get your token from: https://developers.cloudflare.com/fundamentals/api/get-started/create-token/"
fi

# Check if required variables exist
# Add or remove variables here as needed
REQUIRED_VARS=("GITHUB_TOKEN" "MONDAY_API_KEY" "MONDAY_BOARD_ID" "DISCORD_WEBHOOK_URL" "TRIGGER_SECRET_KEY")
OPTIONAL_VARS=("QUICKBOOKS_CLIENT_ID" "QUICKBOOKS_CLIENT_SECRET" "QUICKBOOKS_REFRESH_TOKEN" "QUICKBOOKS_REALM_ID" "QUICKBOOKS_ENVIRONMENT" "QUICKBOOKS_ADMIN_KEY")
MISSING_VARS=()
for VAR_NAME in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR_NAME}" ]; then
    MISSING_VARS+=("$VAR_NAME")
  fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
  echo "Error: Missing required environment variables in .env.secrets:"
  for MISSING_VAR in "${MISSING_VARS[@]}"; do
    echo "  - $MISSING_VAR"
  done
  exit 1
fi

# Verify wrangler authentication before proceeding
echo "Verifying Wrangler authentication..."
if ! npx wrangler whoami >/dev/null 2>&1; then
  echo "Error: Wrangler authentication failed"
  echo ""
  echo "Troubleshooting steps:"
  echo "1. If using API token: Add CLOUDFLARE_API_TOKEN to $SECRETS_FILE"
  echo "2. If token is invalid: Get a new token from https://developers.cloudflare.com/fundamentals/api/get-started/create-token/"
  echo "3. If OAuth is corrupted: Run 'wrangler logout' then 'wrangler login'"
  echo "4. Token permissions needed: Account:Cloudflare Workers:Edit, Account:Workers KV Storage:Edit, Account:Workers Scripts:Edit"
  exit 1
fi

echo "✓ Authentication verified"

# Helper function to set a secret
# Use --env flag for environment-specific secrets (Wrangler auto-targets correct worker)
set_secret() {
  local SECRET_NAME=$1
  local SECRET_VALUE=$2
  
  echo "Setting $SECRET_NAME..."
  # Delete existing secret first (ignore error if not found)
  npx wrangler secret delete "$SECRET_NAME" $USE_ENV_FLAG "$WRANGLER_ENV" >/dev/null 2>&1 || true
  
  # Set the new secret value using --env flag (Wrangler auto-targets correct worker)
  if echo "$SECRET_VALUE" | npx wrangler secret put "$SECRET_NAME" $USE_ENV_FLAG "$WRANGLER_ENV"; then
    echo "✓ $SECRET_NAME set successfully"
    return 0
  else
    echo "✗ Failed to set $SECRET_NAME"
    return 1
  fi
}

# Set secrets using wrangler with environment targeting
# Delete existing secret first (ignore error if not found), then put the new value.
echo ""
echo "Setting secrets for environment: $ENV..."

ERRORS=0

# GITHUB_TOKEN
set_secret "GITHUB_TOKEN" "$GITHUB_TOKEN" || ((ERRORS++))

# MONDAY_API_KEY
set_secret "MONDAY_API_KEY" "$MONDAY_API_KEY" || ((ERRORS++))

# MONDAY_BOARD_ID
set_secret "MONDAY_BOARD_ID" "$MONDAY_BOARD_ID" || ((ERRORS++))

# DISCORD_WEBHOOK_URL
set_secret "DISCORD_WEBHOOK_URL" "$DISCORD_WEBHOOK_URL" || ((ERRORS++))

# TRIGGER_SECRET_KEY
set_secret "TRIGGER_SECRET_KEY" "$TRIGGER_SECRET_KEY" || ((ERRORS++))

# QuickBooks API credentials (optional - only set if provided)
if [ -n "$QUICKBOOKS_CLIENT_ID" ]; then
  echo ""
  echo "Setting QuickBooks secrets..."
  set_secret "QUICKBOOKS_CLIENT_ID" "$QUICKBOOKS_CLIENT_ID" || ((ERRORS++))
fi

if [ -n "$QUICKBOOKS_CLIENT_SECRET" ]; then
  set_secret "QUICKBOOKS_CLIENT_SECRET" "$QUICKBOOKS_CLIENT_SECRET" || ((ERRORS++))
fi

if [ -n "$QUICKBOOKS_REFRESH_TOKEN" ]; then
  set_secret "QUICKBOOKS_REFRESH_TOKEN" "$QUICKBOOKS_REFRESH_TOKEN" || ((ERRORS++))
fi

if [ -n "$QUICKBOOKS_REALM_ID" ]; then
  set_secret "QUICKBOOKS_REALM_ID" "$QUICKBOOKS_REALM_ID" || ((ERRORS++))
fi

if [ -n "$QUICKBOOKS_ENVIRONMENT" ]; then
  set_secret "QUICKBOOKS_ENVIRONMENT" "$QUICKBOOKS_ENVIRONMENT" || ((ERRORS++))
fi

if [ -n "$QUICKBOOKS_ADMIN_KEY" ]; then
  set_secret "QUICKBOOKS_ADMIN_KEY" "$QUICKBOOKS_ADMIN_KEY" || ((ERRORS++))
fi

echo ""
if [ $ERRORS -eq 0 ]; then
  echo "✓ All secrets set successfully for environment: $ENV"
  exit 0
else
  echo "✗ Secrets operations completed with $ERRORS error(s) for environment: $ENV"
  echo "Check output above for details."
  exit 1
fi 