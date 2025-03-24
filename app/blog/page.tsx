import { getAllPosts, getAllCategories } from '@/lib/blog';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog - All Things Linux',
    description:
      'Browse our collection of articles and tutorials about Linux and open source software.',
  };
}

export default async function BlogPage() {
  // Get all blog posts
  const posts = await getAllPosts();
  const categories = await getAllCategories();

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container">
        <div className="flex flex-col items-center gap-4 md:gap-6 text-center">
          <Badge variant="secondary">Blog</Badge>
          <h1 className="text-3xl font-bold md:text-5xl lg:text-7xl">
            Latest Insights & Updates
          </h1>
          <p className="text-balance md:text-lg lg:text-xl">
            Stay up to date with the latest news, tutorials, and updates from
            the All Things Linux community. Our contributors share their
            knowledge to help you master Linux and open source.
          </p>
        </div>

        <div className="mx-auto mt-12 md:mt-20 grid max-w-screen-xl grid-cols-1 gap-10 md:gap-20 lg:grid-cols-4">
          <div className="hidden flex-col gap-2 lg:flex">
            {/* Categories sidebar */}
            {categories.map((category) => (
              <Button
                key={category}
                variant="ghost"
                asChild
                className="justify-start text-left"
              >
                <Link
                  href={`/blog/${category.toLowerCase().replace(/ /g, '-')}`}
                >
                  {category}
                </Link>
              </Button>
            ))}
          </div>

          <div className="lg:col-span-3 relative min-h-[300px]">
            {/* Posts list */}
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No posts found.</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {posts.map((post) => (
                  <div key={post.slug}>
                    <Link
                      href={`/blog/${post.categorySlug}/${post.slug}`}
                      className="flex flex-col gap-3 hover:opacity-90 transition-opacity"
                    >
                      <p className="text-sm font-semibold text-muted-foreground">
                        {post.category}
                      </p>
                      <h3 className="text-balance text-2xl font-semibold lg:text-3xl">
                        {post.title}
                      </h3>
                      {post.description && (
                        <p className="text-muted-foreground">
                          {post.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2 text-sm">
                        <span className="font-medium">{post.author}</span>
                        <span className="text-muted-foreground">
                          on {post.dateFormatted}
                        </span>
                      </div>
                    </Link>
                    <Separator className="my-8" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
