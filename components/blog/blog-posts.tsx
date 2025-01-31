'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Post } from '@/types/blog';
import Link from 'next/link';

interface BlogPostsProps {
  initialPosts: Post[];
  categories: string[];
}

export default function BlogPosts({
  initialPosts,
  categories,
}: BlogPostsProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Posts');
  const [posts, setPosts] = useState(initialPosts);

  // Filter posts when category changes
  useEffect(() => {
    if (selectedCategory === 'All Posts') {
      setPosts(initialPosts);
    } else {
      setPosts(
        initialPosts.filter((post) => post.category === selectedCategory)
      );
    }
  }, [selectedCategory, initialPosts]);

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
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'justify-start text-left',
                  selectedCategory === category &&
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                )}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="lg:col-span-3">
            {posts.map((post) => (
              <React.Fragment key={post.slug}>
                <Link
                  href={`/blog/${post.categorySlug}/${post.slug}`}
                  className="flex flex-col gap-3"
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
                    <span className="text-muted-foreground">
                      on {post.dateFormatted}
                    </span>
                  </div>
                </Link>
                <Separator className="my-8" />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
