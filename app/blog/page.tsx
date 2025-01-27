import Link from 'next/link';
import { getAllPosts } from '@/lib/utils';

export default async function BlogListPage() {
  // Fetch all posts
  const posts = await getAllPosts();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-4xl font-bold mb-6">Blog Posts</h1>
      <div className="space-y-6">
        {posts.map((post) => {
          // Generate an excerpt 
          const excerpt = post.description.split(' ').length > 20
            ? `${post.description.split(' ').slice(0, 20).join(' ')}...`
            : post.description;

          return (
            <div key={post.slug} className="border-b pb-4">
              <h2 className="text-2xl font-semibold">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-blue-500 hover:underline"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-500 text-sm">{post.dateformatted}</p>
              <p className="text-gray-700 mt-2">{excerpt}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}