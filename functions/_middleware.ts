// Top-level middleware to ensure Cloudflare Functions are properly activated
// This intercepts all requests and then passes them through to the appropriate handler

// Define type for context
type Env = Record<string, never>;

export interface RequestContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
  next: () => Promise<Response>;
}

export const onRequest = async (context: RequestContext) => {
  // Log that we're running the middleware (only in development)
  if (context.request.headers.get('host')?.includes('localhost')) {
    console.log('Cloudflare Functions middleware activated');
  }

  // Continue to the next handler - either a specific function or Next.js
  return context.next();
};
