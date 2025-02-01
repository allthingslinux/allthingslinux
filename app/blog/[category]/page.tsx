import { getAllPosts } from '@/lib/utils';
import BlogPosts from '@/components/blog/blog-posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const { category } = await params;
  const posts = await getAllPosts();
  const categoryName =
    category === 'all-posts'
      ? 'All Posts'
      : posts.find((post) => post.categorySlug === category)?.category ||
        'Blog';

  return {
    title: `${categoryName} - All Things Linux Blog`,
    description: `Browse our collection of ${categoryName.toLowerCase()} articles and tutorials about Linux and open source software.`,
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  return [
    { category: 'all-posts' },
    ...categories.map((category) => ({
      category:
        posts.find((p) => p.category === category)?.categorySlug ||
        category.toLowerCase().replace(/ /g, '-'),
    })),
  ];
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = await params;
  const posts = await getAllPosts();
  const categories = [
    'All Posts',
    ...Array.from(new Set(posts.map((post) => post.category))),
  ];

  // Filter posts by category if not "all-posts"
  const filteredPosts =
    category === 'all-posts'
      ? posts
      : posts.filter((post) => post.categorySlug === category);

  if (
    category !== 'all-posts' &&
    !posts.some((post) => post.categorySlug === category)
  ) {
    notFound();
  }

  return <BlogPosts initialPosts={filteredPosts} categories={categories} />;
}
