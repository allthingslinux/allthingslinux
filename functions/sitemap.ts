import { getAllPostsAsPostType } from '@/lib/blog';

// Define type for context
type Env = Record<string, never>;

export interface RequestContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
  next: () => Promise<Response>;
}

export const onRequest = async (context: RequestContext) => {
  // Check if we're on the sitemap page
  const url = new URL(context.request.url);
  if (url.pathname === '/sitemap.xml') {
    try {
      // Pre-load blog data here to ensure it happens within a handler
      await getAllPostsAsPostType();

      // Continue to the Next.js page which will generate the sitemap
      return context.next();
    } catch (error) {
      console.error('Error in sitemap function:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  // If not the sitemap page, continue to next middleware/page
  return context.next();
};
