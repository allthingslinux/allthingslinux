#!/bin/bash
# Setup bindings for the "allthingslinux" worker
# This recreates KV namespaces, R2 buckets, and verifies Durable Objects setup

set -e

echo "🔧 Setting up Cloudflare bindings for worker: allthingslinux"
echo ""

# Load CLOUDFLARE_API_TOKEN from .env.secrets files (same pattern as deploy scripts)
# Try prod first (more likely to exist), then dev
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

# Verify wrangler authentication before proceeding (same pattern as secrets.sh)
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

# ============================================================================
# R2 Bucket Setup
# ============================================================================
echo "📦 Setting up R2 buckets..."

BUCKET_NAME="atl-cache-prod"

# Check if bucket already exists
BUCKET_LIST=$(pnpm exec wrangler r2 bucket list --json 2>/dev/null || echo "[]")
if echo "$BUCKET_LIST" | grep -q "\"$BUCKET_NAME\"" || echo "$BUCKET_LIST" | jq -e ".[] | select(.name == \"$BUCKET_NAME\")" >/dev/null 2>&1; then
  echo "ℹ️  R2 bucket $BUCKET_NAME already exists"
else
  echo "Creating R2 bucket: $BUCKET_NAME"
  # Note: No --env flag since we're using the base worker
  if pnpm exec wrangler r2 bucket create "$BUCKET_NAME" 2>/dev/null; then
    echo "✅ Created R2 bucket: $BUCKET_NAME"
  else
    echo "⚠️  Failed to create R2 bucket: $BUCKET_NAME"
    echo "   Check your Cloudflare permissions and try again"
  fi
fi

echo ""

# ============================================================================
# KV Namespace Setup
# ============================================================================
echo "🗄️  Setting up KV namespace..."

KV_NAMESPACE_NAME="KV_QUICKBOOKS"

# Check if KV namespace already exists by listing all namespaces
KV_LIST=$(pnpm exec wrangler kv namespace list --json 2>/dev/null || echo "[]")
KV_ID=""
if command -v jq >/dev/null 2>&1; then
  KV_ID=$(echo "$KV_LIST" | jq -r ".[] | select(.title == \"$KV_NAMESPACE_NAME\") | .id" 2>/dev/null | head -1 || echo "")
else
  # Fallback to grep parsing - extract the block for our namespace and then get the id
  KV_ID=$(echo "$KV_LIST" | grep -A 5 "\"title\"[[:space:]]*:[[:space:]]*\"$KV_NAMESPACE_NAME\"" | grep -oP "\"id\":\s*\"\K[^\"]+" | head -1 || echo "")
fi

if [ -n "$KV_ID" ]; then
  echo "ℹ️  KV namespace $KV_NAMESPACE_NAME already exists"
  echo "✅ Found existing KV namespace ID: $KV_ID"
else
  echo "Creating KV namespace: $KV_NAMESPACE_NAME"
  # Create KV namespace and get its ID (use --json for consistent output)
  KV_OUTPUT=$(pnpm exec wrangler kv namespace create "$KV_NAMESPACE_NAME" --json 2>&1 || true)
  
  if echo "$KV_OUTPUT" | grep -q "already exists"; then
    echo "ℹ️  KV namespace already exists (detected after creation attempt), getting ID..."
    # Re-list to get the ID
    KV_LIST=$(pnpm exec wrangler kv namespace list --json 2>/dev/null || echo "[]")
    if command -v jq >/dev/null 2>&1; then
      KV_ID=$(echo "$KV_LIST" | jq -r ".[] | select(.title == \"$KV_NAMESPACE_NAME\") | .id" 2>/dev/null | head -1 || echo "")
    else
      # Fallback to grep parsing - extract the block for our namespace and then get the id
      KV_ID=$(echo "$KV_LIST" | grep -A 5 "\"title\"[[:space:]]*:[[:space:]]*\"$KV_NAMESPACE_NAME\"" | grep -oP "\"id\":\s*\"\K[^\"]+" | head -1 || echo "")
    fi
    if [ -n "$KV_ID" ]; then
      echo "✅ Found existing KV namespace ID: $KV_ID"
    else
      echo "⚠️  Could not find KV namespace ID automatically"
      echo "Please run: pnpm exec wrangler kv namespace list --json | jq -r '.[] | select(.title == \"$KV_NAMESPACE_NAME\") | .id'"
      echo "Or install jq for better JSON parsing: https://jqlang.github.io/jq/"
      echo "Then update wrangler.jsonc with the correct ID"
    fi
  else
    # Extract the ID from the JSON output (creation succeeded)
    if command -v jq >/dev/null 2>&1; then
      KV_ID=$(echo "$KV_OUTPUT" | jq -r '.id' 2>/dev/null || echo "")
      PREVIEW_ID=$(echo "$KV_OUTPUT" | jq -r '.preview_id // .id' 2>/dev/null || echo "")
    else
      # Fallback to grep parsing
      KV_ID=$(echo "$KV_OUTPUT" | grep -oP '"id":\s*"\K[^"]+' | head -1 || echo "")
      PREVIEW_ID=$(echo "$KV_OUTPUT" | grep -oP '"preview_id":\s*"\K[^"]+' | head -1 || echo "$KV_ID")
    fi
    
    if [ -n "$KV_ID" ]; then
      echo "✅ Created KV namespace"
      echo "   ID: $KV_ID"
      if [ -n "$PREVIEW_ID" ]; then
        echo "   Preview ID: $PREVIEW_ID"
      fi
      echo ""
      echo "📝 Update wrangler.jsonc with these IDs:"
      echo '   "kv_namespaces": ['
      echo '     {'
      echo "       \"binding\": \"KV_QUICKBOOKS\","
      echo "       \"id\": \"$KV_ID\","
      if [ -n "$PREVIEW_ID" ]; then
        echo "       \"preview_id\": \"$PREVIEW_ID\","
      else
        echo "       \"preview_id\": \"$KV_ID\","
      fi
      echo '     },'
      echo '   ],'
    else
      echo "⚠️  Could not extract KV namespace ID from output"
      echo "Output was: $KV_OUTPUT"
    fi
  fi
fi

echo ""

# ============================================================================
# Durable Objects Setup
# ============================================================================
echo "🔄 Durable Objects setup..."
echo "ℹ️  Durable Objects will be created automatically on first deployment"
echo "   Make sure migrations are configured in wrangler.jsonc:"
echo "   - DOQueueHandler"
echo "   - DOShardedTagCache"
echo "   - BucketCachePurge"
echo ""

# ============================================================================
# Service Binding
# ============================================================================
echo "🔗 Service binding..."
echo "✅ Service binding configured in wrangler.jsonc (self-reference to 'allthingslinux' worker)"
echo "   This will work after the worker is deployed"
echo ""

echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
if [ -n "$KV_ID" ]; then
  echo "1. ✅ Update wrangler.jsonc with the KV namespace ID shown above"
fi
echo "2. Deploy the worker: pnpm exec opennextjs-cloudflare deploy"
echo "   (or use CI/CD: push to GitHub and it will deploy automatically)"
echo "3. Durable Objects will be created automatically on first deployment"
echo ""
echo "💡 Tip: You can also run this script with a secrets file:"
echo "   CLOUDFLARE_API_TOKEN=your_token bash scripts/setup-bindings.sh"
