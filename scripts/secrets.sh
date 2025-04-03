#!/bin/bash

# Environment to set secrets for
ENV=${1:-development}

# Load secrets from .env.secrets (excluded from git)
if [ -f .env.secrets ]; then
  source .env.secrets
else
  echo "Error: .env.secrets file not found"
  exit 1
fi

# Check if required variables exist
if [ -z "$GITHUB_TOKEN" ] || [ -z "$MONDAY_API_KEY" ] || [ -z "$MONDAY_BOARD_ID" ] || [ -z "$DISCORD_WEBHOOK_URL" ]; then
  echo "Error: Missing required environment variables in .env.secrets"
  exit 1
fi

# Set secrets using wrangler
echo "Setting secrets for $ENV environment..."
wrangler secret put GITHUB_TOKEN --env $ENV <<< "$GITHUB_TOKEN"
wrangler secret put MONDAY_API_KEY --env $ENV <<< "$MONDAY_API_KEY"
wrangler secret put MONDAY_BOARD_ID --env $ENV <<< "$MONDAY_BOARD_ID"
wrangler secret put DISCORD_WEBHOOK_URL --env $ENV <<< "$DISCORD_WEBHOOK_URL"

echo "Secrets successfully set for $ENV environment" 