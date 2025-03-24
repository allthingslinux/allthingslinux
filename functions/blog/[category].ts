import { getPostsByCategory, getAllPosts } from '@/lib/blog';

// Define type for context
type Env = Record<string, never>;

export interface RequestContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
  next: () => Promise<Response>;
}

export const onRequest = async (context: RequestContext) => {
  // Get the category from the URL parameters
  const url = new URL(context.request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);

  // Check if we're on a category page
  if (pathParts.length === 2 && pathParts[0] === 'blog') {
    const category = pathParts[1];

    // Redirect all-posts to the main blog page
    if (category === 'all-posts') {
      return Response.redirect(`${url.origin}/blog`, 301);
    }

    // Log the category we're trying to access
    console.log(`Accessing blog category: ${category}`);

    try {
      // Pre-load blog data here to ensure it happens within a handler
      const allPostsData = await getAllPosts();

      // Get posts for this category
      const posts = await getPostsByCategory(category);

      // Get all categories for the navigation
      const allCategories = Array.from(
        new Set(allPostsData.map((post) => post.category))
      );

      // If no posts found for this category and it's not a valid category, return 404
      if (posts.length === 0 || !allCategories.includes(category)) {
        return new Response('Category not found', { status: 404 });
      }

      // Continue to the Next.js page which will render the content
      // This delegates to the app/blog/[category]/page.tsx component
      return context.next();
    } catch (error) {
      console.error('Error in blog category function:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }

  // If not a category page, continue to next middleware/page
  return context.next();
};
