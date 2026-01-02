import { defineCloudflareConfig } from '@opennextjs/cloudflare';
import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';
import { withRegionalCache } from '@opennextjs/cloudflare/overrides/incremental-cache/regional-cache';
import doQueue from '@opennextjs/cloudflare/overrides/queue/do-queue';
import doShardedTagCache from '@opennextjs/cloudflare/overrides/tag-cache/do-sharded-tag-cache';
import { purgeCache } from '@opennextjs/cloudflare/overrides/cache-purge/index';

export default defineCloudflareConfig({
  // Enhanced R2 incremental cache with regional caching for faster retrieval
  incrementalCache: withRegionalCache(r2IncrementalCache, {
    mode: 'long-lived',
    bypassTagCacheOnCacheHit: true,
  }),

  // Durable Object queue for ISR revalidation deduplication
  queue: doQueue,

  // Sharded Durable Object tag cache for on-demand revalidation
  tagCache: doShardedTagCache({ baseShardSize: 12 }),

  // Enable cache interception for better performance (not compatible with PPR)
  enableCacheInterception: true,

  // Automatic cache purge for on-demand revalidation
  cachePurge: purgeCache({ type: 'direct' }),
});
