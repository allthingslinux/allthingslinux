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
  // Get the current URL
  const url = new URL(context.request.url);
  const path = url.pathname;

  // Debug log information about the request
  console.log(`Processing request for path: ${path}`);

  // For blog routes, ensure we're in a proper handler context
  if (path.startsWith('/blog')) {
    try {
      // This ensures that any dynamic imports happen within a handler context
      // Import the blog module dynamically to prevent global scope issues
      const blogModule = await import('@/lib/blog');

      // Pre-warm data for blog routes to avoid global scope loading
      if (path === '/blog' || path === '/blog/') {
        await blogModule.getAllPosts();
        await blogModule.getAllCategories();
      } else if (path === '/blog/all-posts') {
        await blogModule.getAllPosts();
      }

      console.log(`Blog data preloaded for path: ${path}`);
    } catch (error) {
      console.error(`Error preloading data for ${path}:`, error);
      // Continue anyway, as the specific route handler might handle it better
    }
  }

  // Continue to the next handler - either a specific function or Next.js
  return context.next();
};
