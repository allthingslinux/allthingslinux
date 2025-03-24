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
  try {
    // Pre-load all blog posts within the handler context
    await getAllPosts();
    await getAllCategories();

    // Continue to the Next.js page that will render the content
    return context.next();
  } catch (error) {
    console.error('Error in blog all-posts function:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
