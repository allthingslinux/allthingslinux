import { getAllPosts, getAllCategories } from '@/lib/blog';

// Define type for context
type Env = Record<string, never>;

export interface RequestContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
  next: () => Promise<Response>;
}

export const onRequest = async (context: RequestContext) => {
  // Check if we're on the main blog page
  const url = new URL(context.request.url);
  if (url.pathname === '/blog' || url.pathname === '/blog/') {
    try {
      // Pre-load blog data here to ensure it happens within a handler
      await getAllPosts();
      await getAllCategories();

      // Continue to the Next.js page which will render the content
      return context.next();
    } catch (error) {
      console.error('Error in blog index function:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  // If not the main blog page, continue to next middleware/page
  return context.next();
};
