// This module pre-loads contentlayer data to ensure it's only done within a handler context

// Define type for context
type Env = Record<string, never>;

export interface RequestContext {
  request: Request;
  env: Env;
  params: Record<string, string>;
  next: () => Promise<Response>;
}

// Define a utility function to load contentlayer data
export async function preloadContentlayer() {
  try {
    // Dynamically import contentlayer data to avoid global scope issues
    const { allBlogPosts } = await import('contentlayer/generated');

    // Return the count of blog posts to verify they loaded
    return allBlogPosts.length;
  } catch (error) {
    console.error('Error preloading contentlayer:', error);
    return 0;
  }
}

// Ensure middleware uses this function
export const onRequest = async (context: RequestContext) => {
  try {
    // Run preload before continuing
    await preloadContentlayer();
  } catch (error) {
    console.error('Contentlayer preload error:', error);
  }

  return context.next();
};
