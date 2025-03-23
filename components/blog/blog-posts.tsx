'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Post } from '@/types/blog';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogPostsProps {
  initialPosts: Post[];
  categories: string[];
  currentCategory: string;
  page: number;
  totalPages: number;
}

// Memoized BlogPost item component
const BlogPostItem = React.memo(
  ({ post, onNavigate }: { post: Post; onNavigate: () => void }) => (
    <React.Fragment>
      <Link
        href={`/blog/${post.categorySlug}/${post.slug}`}
        className="flex flex-col gap-3 hover:opacity-90 transition-opacity"
        onClick={onNavigate}
      >
        <p className="text-sm font-semibold text-muted-foreground">
          {post.category}
        </p>
        <h3 className="text-balance text-2xl font-semibold lg:text-3xl">
          {post.title}
        </h3>
        {post.description && (
          <p className="text-muted-foreground">{post.description}</p>
        )}
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="font-medium">{post.author}</span>
          <span className="text-muted-foreground">on {post.dateFormatted}</span>
        </div>
      </Link>
      <Separator className="my-8" />
    </React.Fragment>
  )
);

BlogPostItem.displayName = 'BlogPostItem';

// Memoized category button component
const CategoryButton = React.memo(
  ({
    category,
    isActive,
    disabled,
    onClick,
  }: {
    category: string;
    isActive: boolean;
    disabled: boolean;
    onClick: () => void;
  }) => (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        'justify-start text-left',
        isActive &&
          'bg-secondary text-secondary-foreground hover:bg-secondary/80'
      )}
      disabled={disabled}
    >
      {category}
    </Button>
  )
);

CategoryButton.displayName = 'CategoryButton';

export default function BlogPosts({
  initialPosts,
  categories,
  currentCategory,
  page = 1,
  totalPages = 1,
}: BlogPostsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [shouldScrollTop, setShouldScrollTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const [currentContent, setCurrentContent] = useState({
    category: currentCategory,
    page: page,
    posts: initialPosts,
  });

  // Update current content when props change and scroll if needed
  useEffect(() => {
    if (!isNavigating && !loadingPosts) {
      // Update the current content first
      setCurrentContent({
        category: currentCategory,
        page: page,
        posts: initialPosts,
      });

      // If shouldScrollTop flag is set, scroll after content update
      if (shouldScrollTop && typeof window !== 'undefined') {
        // Use a slight delay to ensure content has updated in the DOM
        const scrollTimer = setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
          setShouldScrollTop(false);
        }, 100);

        return () => clearTimeout(scrollTimer);
      }
    }
  }, [
    initialPosts,
    currentCategory,
    page,
    isNavigating,
    loadingPosts,
    shouldScrollTop,
  ]);

  // Reset navigation state when posts or category changes
  useEffect(() => {
    if (isNavigating || loadingPosts) {
      // Use a longer delay to ensure content is loaded before transition ends
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setLoadingPosts(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [initialPosts, currentCategory, page, isNavigating, loadingPosts]);

  // Memoized category change handler
  const handleCategoryChange = useCallback(
    (category: string) => {
      if (category === currentCategory) return;

      // Start transition state
      setIsNavigating(true);
      setLoadingPosts(true);
      setShouldScrollTop(true); // Set flag to scroll on next content update

      const categorySlug =
        category === 'All Posts'
          ? 'all-posts'
          : category.toLowerCase().replace(/ /g, '-');

      // Use shallow routing to avoid full page reload
      router.prefetch(`/blog/${categorySlug}`);

      // Use a slight delay to ensure prefetching happens
      setTimeout(() => {
        router.push(`/blog/${categorySlug}`, { scroll: false });
      }, 50);
    },
    [currentCategory, router]
  );

  // Memoized page change handler
  const handlePageChange = useCallback(
    (newPage: number) => {
      setIsNavigating(true);
      setLoadingPosts(true);
      setShouldScrollTop(true); // Set flag to scroll on next content update

      // Prefetch the new page
      router.prefetch(`${pathname}?page=${newPage}`);

      // Use a slight delay to ensure prefetching happens
      setTimeout(() => {
        // Preserve the current URL path and only update the page parameter
        router.push(`${pathname}?page=${newPage}`, { scroll: false });
      }, 50);
    },
    [pathname, router]
  );

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
            {categories.map((category) => (
              <CategoryButton
                key={category}
                category={category}
                isActive={currentCategory === category}
                disabled={isNavigating}
                onClick={() => handleCategoryChange(category)}
              />
            ))}
          </div>

          <div
            className="lg:col-span-3 relative min-h-[300px]"
            ref={contentRef}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${currentContent.category}-${currentContent.page}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {currentContent.posts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">
                      No posts found in this category.
                    </p>
                  </div>
                ) : (
                  <>
                    {currentContent.posts.map((post) => (
                      <BlogPostItem
                        key={post.slug}
                        post={post}
                        onNavigate={() => setIsNavigating(true)}
                      />
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
              </motion.div>
            </AnimatePresence>

            {/* Fixed overlay that stays in position during loading */}
            {(isNavigating || loadingPosts) && (
              <div
                className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-center justify-center"
                style={{
                  opacity: isNavigating || loadingPosts ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <div className="bg-background/40 backdrop-blur-md rounded-lg p-8 shadow-lg">
                  <div className="flex flex-col items-center">
                    <svg
                      className="animate-spin h-10 w-10 text-blue-500 mb-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p className="text-neutral-200">Loading posts...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
