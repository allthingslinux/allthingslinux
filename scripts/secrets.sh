#!/bin/bash

# Environment to set secrets for (development or production)
ENV=${1:-development}
CONFIG_FILE=""

# Determine config file based on environment
if [ "$ENV" == "development" ]; then
  CONFIG_FILE="wrangler.dev.jsonc"
elif [ "$ENV" == "production" ]; then
  CONFIG_FILE="wrangler.production.jsonc"
else
  echo "Error: Invalid environment specified. Use 'development' or 'production'."
  exit 1
fi

echo "Using configuration file: $CONFIG_FILE (implicitly targets environment within the file)"

# Load secrets from .env.secrets (excluded from git)
if [ -f .env.secrets ]; then
  source .env.secrets
else
  echo "Error: .env.secrets file not found in project root."
  exit 1
fi

# Check if required variables exist
# Add or remove variables here as needed
REQUIRED_VARS=("GITHUB_TOKEN" "MONDAY_API_KEY" "MONDAY_BOARD_ID" "DISCORD_WEBHOOK_URL" "TRIGGER_SECRET_KEY")
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

# Set secrets using wrangler, targeting the specific config file
# Delete existing secret first (ignore error if not found, WILL prompt for confirmation), then put the new value.
echo "Setting secrets using config file: $CONFIG_FILE (delete then put)..."

# GITHUB_TOKEN
(npx wrangler secret delete GITHUB_TOKEN --config $CONFIG_FILE || true) && \
npx wrangler secret put GITHUB_TOKEN --config $CONFIG_FILE <<< "$GITHUB_TOKEN"

# MONDAY_API_KEY
(npx wrangler secret delete MONDAY_API_KEY --config $CONFIG_FILE || true) && \
npx wrangler secret put MONDAY_API_KEY --config $CONFIG_FILE <<< "$MONDAY_API_KEY"

# MONDAY_BOARD_ID
(npx wrangler secret delete MONDAY_BOARD_ID --config $CONFIG_FILE || true) && \
npx wrangler secret put MONDAY_BOARD_ID --config $CONFIG_FILE <<< "$MONDAY_BOARD_ID"

# DISCORD_WEBHOOK_URL
(npx wrangler secret delete DISCORD_WEBHOOK_URL --config $CONFIG_FILE || true) && \
npx wrangler secret put DISCORD_WEBHOOK_URL --config $CONFIG_FILE <<< "$DISCORD_WEBHOOK_URL"

# TRIGGER_SECRET_KEY
(npx wrangler secret delete TRIGGER_SECRET_KEY --config $CONFIG_FILE || true) && \
npx wrangler secret put TRIGGER_SECRET_KEY --config $CONFIG_FILE <<< "$TRIGGER_SECRET_KEY"

echo "Secrets PUT operations submitted using config file: $CONFIG_FILE."
echo "Check output above for any errors." 