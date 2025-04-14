import r2IncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache';

// Correct structure expected by @opennextjs/cloudflare build
const config = {
  default: {
    override: {
      wrapper: 'cloudflare-node', // Specify the desired wrapper
      converter: 'edge', // Specify the desired converter
      proxyExternalRequest: 'fetch', // Specify request proxying
      incrementalCache: r2IncrementalCache, // Use the imported R2 cache handler
      tagCache: 'dummy', // Use dummy tag cache or implement one
      queue: 'direct', // Use direct queue or implement one
    },
  },
  // Add necessary edge externals if needed
  edgeExternals: [
    // e.g., "node:crypto"
  ],
};

export default config;
