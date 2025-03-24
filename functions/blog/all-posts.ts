// Simple redirect function that sends users from /blog/all-posts to /blog

export const onRequest = async (context: {
  request: Request;
  next: () => Response;
}) => {
  const url = new URL(context.request.url);

  // If we're on the all-posts page, redirect to the main blog page
  if (url.pathname === '/blog/all-posts') {
    return Response.redirect(`${url.origin}/blog`, 301);
  }

  // Otherwise continue
  return context.next();
};
