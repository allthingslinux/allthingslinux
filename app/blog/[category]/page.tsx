import BlogPosts from '@/components/blog/blog-posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getPostsByCategory,
  getAllCategories,
  getPostsByCategoryAsPostType,
} from '@/lib/blog';

// Number of posts per page for pagination
const POSTS_PER_PAGE = 6;

// Add a dynamic export to support the soft navigation
export const dynamic = 'force-dynamic';

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
  searchParams,
}: {
  params: { category: string };
  searchParams: { page?: string };
}) {
  const paramsResolved = await Promise.resolve(params);
  const searchParamsResolved = await Promise.resolve(searchParams);
  const { category } = paramsResolved;

  // Parse page number from search params
  const page = searchParamsResolved.page
    ? parseInt(searchParamsResolved.page, 10)
    : 1;

  // Get all posts for this category
  const allCategoryPosts = getPostsByCategoryAsPostType(category);

  // Calculate pagination values
  const totalPosts = allCategoryPosts.length;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // Get paginated posts
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const paginatedPosts = allCategoryPosts.slice(
    startIndex,
    startIndex + POSTS_PER_PAGE
  );

  // Get category name for UI
  const categoryName =
    category === 'all-posts'
      ? 'All Posts'
      : allCategoryPosts.length > 0
        ? allCategoryPosts[0].category
        : 'Blog';

  const categories = ['All Posts', ...getAllCategories()];

  if (
    category !== 'all-posts' &&
    !allCategoryPosts.some((post) => post.categorySlug === category)
  ) {
    notFound();
  }

  return (
    <BlogPosts
      initialPosts={paginatedPosts}
      categories={categories}
      currentCategory={categoryName}
      page={page}
      totalPages={totalPages}
    />
  );
}
