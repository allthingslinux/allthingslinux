'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Post } from '@/types/blog';

interface BlogPostsProps {
  initialPosts: Post[];
  categories: string[];
}

export default function BlogPosts({
  initialPosts,
  categories,
}: BlogPostsProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Articles');

  const filteredPosts =
    selectedCategory === 'All Articles'
      ? initialPosts
      : initialPosts.filter((post) => post.category === selectedCategory);

  return (
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
        {filteredPosts.map((post) => (
          <React.Fragment key={post.slug}>
            <a href={`/blog/${post.slug}`} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-catppuccin-mantle px-2 py-1 text-xs font-medium ring-1 ring-inset ring-muted-foreground/20">
                  {post.category}
                </span>
              </div>
              <h3 className="text-balance text-2xl font-semibold lg:text-3xl">
                {post.title}
              </h3>
              <p className="text-muted-foreground">{post.description}</p>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <span className="font-medium">{post.author}</span>
                <span className="text-muted-foreground">
                  on {post.dateFormatted}
                </span>
              </div>
            </a>
            <Separator className="my-8" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
