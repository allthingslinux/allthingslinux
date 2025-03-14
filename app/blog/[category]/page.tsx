import BlogPosts from '@/components/blog/blog-posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getPostsByCategory,
  getAllCategories,
  getPostsByCategoryAsPostType,
} from '@/lib/blog';

export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const paramsResolved = await Promise.resolve(params);
  const { category } = paramsResolved;

  const posts = getPostsByCategory(category);
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
  const categories = getAllCategories();

  // Add 'all-posts' category
  return [
    { category: 'all-posts' },
    ...categories.map((category) => ({
      category: category.toLowerCase().replace(/ /g, '-'),
    })),
  ];
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const paramsResolved = await Promise.resolve(params);
  const { category } = paramsResolved;

  const blogPosts = getPostsByCategory(category);
  const posts = getPostsByCategoryAsPostType(category);
  const categories = ['All Posts', ...getAllCategories()];

  if (
    category !== 'all-posts' &&
    !blogPosts.some((post) => post.categorySlug === category)
  ) {
    notFound();
  }

  return <BlogPosts initialPosts={posts} categories={categories} />;
}
