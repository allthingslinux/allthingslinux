'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Post } from '@/types/blog';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface BlogPostsProps {
  initialPosts: Post[];
  categories: string[];
  currentCategory: string;
  page: number;
  totalPages: number;
}

export default function BlogPosts({
  initialPosts,
  categories,
  currentCategory,
  page = 1,
  totalPages = 1,
}: BlogPostsProps) {
  const router = useRouter();
  const pathname = usePathname();
  // const searchParams = useSearchParams();

  // Track if we're currently navigating between categories
  const [isNavigating, setIsNavigating] = useState(false);

  // Use a CSS transition class for smooth content changes
  const contentClass = cn(
    'transition-opacity duration-200',
    isNavigating ? 'opacity-60' : 'opacity-100'
  );

  // Reset navigation state when posts or category changes
  // This ensures the fade-in effect happens after new content arrives
  useEffect(() => {
    // Use a slight delay to ensure a smooth transition
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [initialPosts, currentCategory, page]);

  // Effect to scroll to top when page changes
  useEffect(() => {
    // Only scroll if not the initial render
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [page, currentCategory]);

  // Handler for category change - navigate to the category page
  const handleCategoryChange = (category: string) => {
    if (category === currentCategory) return;

    // Start transition state
    setIsNavigating(true);

    const categorySlug =
      category === 'All Posts'
        ? 'all-posts'
        : category.toLowerCase().replace(/ /g, '-');

    // Use shallow routing to avoid full page reload
    router.push(`/blog/${categorySlug}`, { scroll: false });

    // Manually scroll to top after navigation
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  // Handler for pagination
  const handlePageChange = (newPage: number) => {
    setIsNavigating(true);

    // Preserve the current URL path and only update the page parameter
    router.push(`${pathname}?page=${newPage}`, { scroll: false });

    // Manually scroll to top after navigation
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge variant="secondary">Blog</Badge>
          <h1 className="text-4xl font-bold lg:text-7xl">
            Latest Insights & Updates
          </h1>
          <p className="text-balance lg:text-xl">
            Stay up to date with the latest news, tutorials, and updates from
            the All Things Linux community. Our contributors share their
            knowledge to help you master Linux and open source.
          </p>
        </div>

        <div className="mx-auto mt-20 grid max-w-screen-xl grid-cols-1 gap-20 lg:grid-cols-4">
          <div className="hidden flex-col gap-2 lg:flex">
            {categories.map((category) => (
              <Button
                variant="ghost"
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  'justify-start text-left',
                  currentCategory === category &&
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
                disabled={isNavigating}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className={cn('lg:col-span-3', contentClass)}>
            {initialPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No posts found in this category.
                </p>
              </div>
            ) : (
              <>
                {initialPosts.map((post) => (
                  <React.Fragment key={post.slug}>
                    <Link
                      href={`/blog/${post.categorySlug}/${post.slug}`}
                      className="flex flex-col gap-3"
                      onClick={() => setIsNavigating(true)}
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
                  </React.Fragment>
                ))}

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      disabled={page <= 1 || isNavigating}
                      onClick={() => handlePageChange(page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={page >= totalPages || isNavigating}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
