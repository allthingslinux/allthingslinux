#!/bin/bash

# Environment to set secrets for (dev, prod, or local)
ENV=${1:-dev}

# Validate environment parameter
if [ "$ENV" != "dev" ] && [ "$ENV" != "prod" ] && [ "$ENV" != "local" ]; then
  echo "Error: Invalid environment specified. Use 'dev', 'prod', or 'local'."
  exit 1
fi

echo "Setting secrets for environment: $ENV (using wrangler.jsonc)"

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

# Set secrets using wrangler with environment targeting
# Delete existing secret first (ignore error if not found), then put the new value.
echo "Setting secrets for environment: $ENV (delete then put)..."

# GITHUB_TOKEN
(npx wrangler secret delete GITHUB_TOKEN --env $ENV || true) && \
npx wrangler secret put GITHUB_TOKEN --env $ENV <<< "$GITHUB_TOKEN"

# MONDAY_API_KEY
(npx wrangler secret delete MONDAY_API_KEY --env $ENV || true) && \
npx wrangler secret put MONDAY_API_KEY --env $ENV <<< "$MONDAY_API_KEY"

# MONDAY_BOARD_ID
(npx wrangler secret delete MONDAY_BOARD_ID --env $ENV || true) && \
npx wrangler secret put MONDAY_BOARD_ID --env $ENV <<< "$MONDAY_BOARD_ID"

# DISCORD_WEBHOOK_URL
(npx wrangler secret delete DISCORD_WEBHOOK_URL --env $ENV || true) && \
npx wrangler secret put DISCORD_WEBHOOK_URL --env $ENV <<< "$DISCORD_WEBHOOK_URL"

# TRIGGER_SECRET_KEY
(npx wrangler secret delete TRIGGER_SECRET_KEY --env $ENV || true) && \
npx wrangler secret put TRIGGER_SECRET_KEY --env $ENV <<< "$TRIGGER_SECRET_KEY"

# QuickBooks API credentials (optional - only set if provided)
if [ -n "$QUICKBOOKS_CLIENT_ID" ]; then
  echo "Setting QuickBooks secrets..."
  (npx wrangler secret delete QUICKBOOKS_CLIENT_ID --env $ENV || true) && \
  npx wrangler secret put QUICKBOOKS_CLIENT_ID --env $ENV <<< "$QUICKBOOKS_CLIENT_ID"
fi

if [ -n "$QUICKBOOKS_CLIENT_SECRET" ]; then
  (npx wrangler secret delete QUICKBOOKS_CLIENT_SECRET --env $ENV || true) && \
  npx wrangler secret put QUICKBOOKS_CLIENT_SECRET --env $ENV <<< "$QUICKBOOKS_CLIENT_SECRET"
fi

if [ -n "$QUICKBOOKS_REFRESH_TOKEN" ]; then
  (npx wrangler secret delete QUICKBOOKS_REFRESH_TOKEN --env $ENV || true) && \
  npx wrangler secret put QUICKBOOKS_REFRESH_TOKEN --env $ENV <<< "$QUICKBOOKS_REFRESH_TOKEN"
fi

if [ -n "$QUICKBOOKS_REALM_ID" ]; then
  (npx wrangler secret delete QUICKBOOKS_REALM_ID --env $ENV || true) && \
  npx wrangler secret put QUICKBOOKS_REALM_ID --env $ENV <<< "$QUICKBOOKS_REALM_ID"
fi

if [ -n "$QUICKBOOKS_ENVIRONMENT" ]; then
  (npx wrangler secret delete QUICKBOOKS_ENVIRONMENT --env $ENV || true) && \
  npx wrangler secret put QUICKBOOKS_ENVIRONMENT --env $ENV <<< "$QUICKBOOKS_ENVIRONMENT"
fi

if [ -n "$QUICKBOOKS_ADMIN_KEY" ]; then
  (npx wrangler secret delete QUICKBOOKS_ADMIN_KEY --env $ENV || true) && \
  npx wrangler secret put QUICKBOOKS_ADMIN_KEY --env $ENV <<< "$QUICKBOOKS_ADMIN_KEY"
fi

echo "Secrets operations completed for environment: $ENV."
echo "Check output above for any errors." 