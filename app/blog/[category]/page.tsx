import { notFound } from 'next/navigation';
import { getPostsByCategory, getAllCategories } from '@/lib/blog';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getDynamicMetadata } from '@/app/metadata';
import { getBaseUrl } from '@/lib/utils';
import type { Metadata } from 'next';

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const { category } = resolvedParams;

  // Format the category name for display (capitalize first letter of each word)
  const categoryTitle = category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Build dynamic OG image URL with query parameters
  // const ogImageUrl = new URL(getApiUrl('/api/og'));
  // ogImageUrl.searchParams.append('title', `${categoryTitle} Articles`);
  // ogImageUrl.searchParams.append('category', 'Blog');

  return {
    ...getDynamicMetadata({
      title: `${categoryTitle} Articles`,
      description: `Browse all our articles on ${categoryTitle}`,
    }),
    openGraph: {
      title: `${categoryTitle} Articles`,
      description: `Browse all our articles on ${categoryTitle}`,
      url: `${getBaseUrl()}/blog/${category}`,
      // images: [
      //   {
      //     url: ogImageUrl.toString(),
      //     width: 1200,
      //     height: 630,
      //     alt: `${categoryTitle} Articles`,
      //   },
      // ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryTitle} Articles`,
      description: `Browse all our articles on ${categoryTitle}`,
      // images: [ogImageUrl.toString()],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Get the category slug from the URL
  const resolvedParams = await Promise.resolve(params);
  const { category } = resolvedParams;

  // Get all posts and categories
  const allCategories = await getAllCategories();
  const posts = await getPostsByCategory(category);

  // Format the category name for display (capitalize first letter of each word)
  const categoryTitle = category
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  if (!posts || posts.length === 0) {
    notFound();
  }

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container">
        <div className="flex flex-col items-center gap-4 md:gap-6 text-center mb-12 md:mb-16">
          <Badge variant="secondary" className="px-3 py-1">
            {categoryTitle}
          </Badge>
          <h1 className="text-3xl font-bold md:text-5xl lg:text-6xl">
            {categoryTitle} Articles
          </h1>
          <p className="text-balance max-w-3xl md:text-lg lg:text-xl text-muted-foreground">
            Stay up to date with the latest news, tutorials, and updates from
            the All Things Linux community. Our contributors share their
            knowledge to help you master Linux and open source.
          </p>
        </div>

        {/* Categories navigation */}
        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            <Button variant="ghost" asChild className="rounded-full">
              <Link href="/blog">All</Link>
            </Button>
            {allCategories.map((cat) => {
              const catSlug = cat.toLowerCase().replace(/ /g, '-');
              return (
                <Button
                  key={catSlug}
                  variant={catSlug === category ? 'secondary' : 'ghost'}
                  asChild
                  className="rounded-full"
                >
                  <Link href={`/blog/${catSlug}`}>{cat}</Link>
                </Button>
              );
            })}
          </div>
        )}

        {/* Posts grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => {
              // Generate dynamic OG image URL for this post
              // const postImageUrl = new URL(getApiUrl('/api/og'));
              // postImageUrl.searchParams.append('title', post.title);
              // postImageUrl.searchParams.append('category', post.category);
              // postImageUrl.searchParams.append('date', post.date);

              return (
                <Link
                  key={post.slug}
                  href={`/blog/${post.categorySlug}/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md"
                >
                  {/* <div className="relative h-48 overflow-hidden bg-muted">
                    <Image
                      src={postImageUrl.toString()}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div> */}
                  <div className="flex flex-col flex-grow p-5">
                    <Badge variant="outline" className="w-fit mb-2">
                      {post.category}
                    </Badge>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.description && (
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                        {post.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center gap-2 text-sm pt-3 border-t">
                      <span className="font-medium">{post.author}</span>
                      <span className="text-muted-foreground">
                        • {post.dateFormatted}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
