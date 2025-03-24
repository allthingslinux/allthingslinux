import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import kvIncrementalCache from '@opennextjs/cloudflare/kv-cache';

export default defineCloudflareConfig({
  // Enable KV-based incremental cache for ISR/SSG
  incrementalCache: kvIncrementalCache,
});
