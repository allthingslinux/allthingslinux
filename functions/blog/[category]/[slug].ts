import { getPost } from '@/lib/blog';

// Define type for context
type Env = Record<string, never>;

export interface RequestContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
  next: () => Promise<Response>;
}

export const onRequest = async (context: RequestContext) => {
  // Get the category and slug from the URL parameters
  const url = new URL(context.request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);

  // Check if we're on a blog post page
  if (pathParts.length === 3 && pathParts[0] === 'blog') {
    const category = pathParts[1];
    const slug = pathParts[2];

    try {
      // Get the post
      const post = await getPost(category, slug);

      // If post not found, return 404
      if (!post) {
        return new Response('Post not found', { status: 404 });
      }

      // Continue to the Next.js page which will render the content
      // This delegates to the app/blog/[category]/[slug]/page.tsx component
      return context.next();
    } catch (error) {
      console.error('Error in blog post function:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  // If not a blog post page, continue to next middleware/page
  return context.next();
};
