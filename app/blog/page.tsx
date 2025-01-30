import { getAllPosts } from '@/lib/utils';
import BlogPosts from '@/components/blog/blog-posts';

export default async function BlogPage() {
  const posts = await getAllPosts();

  // Get unique categories from posts
  const categories = [
    'All Articles',
    ...Array.from(new Set(posts.map((post) => post.category))),
  ];

  return <BlogPosts initialPosts={posts} categories={categories} />;
}
