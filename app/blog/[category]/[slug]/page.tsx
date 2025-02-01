import React from 'react';
import { getAllPosts } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { ChevronLeft } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { components } from '@/mdx-components';
import remarkGfm from 'remark-gfm';
import remarkGithub from 'remark-github';
import remarkFrontmatter from 'remark-frontmatter';
import { GitContributors } from '@/components/GitContributors';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string };
}): Promise<Metadata> {
  const { category, slug } = await params;
  const posts = await getAllPosts();
  const post = posts.find(
    (p) => p.slug === slug && p.categorySlug === category
  );

  if (!post) {
    return {
      title: 'Post Not Found - All Things Linux Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} - All Things Linux Blog`,
    description:
      post.description || `Read ${post.title} on All Things Linux Blog`,
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    category: post.categorySlug,
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: { category: string; slug: string };
}) {
  const { category, slug } = await params;
  const posts = await getAllPosts();

  const post = posts.find(
    (p) => p.slug === slug && p.categorySlug === category
  );

  if (!post) {
    notFound();
  }

  // Remove unused year extraction
  const content = post.content.replace(/^---[\s\S]*?---/, '').trim();

  return (
    <section className="py-20 min-h-[calc(100vh-4rem)]">
      <div className="container max-w-3xl">
        {/* Header */}
        <header className="mb-16">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
          >
            <ChevronLeft className="h-4 w-4" />
            Return to blog
          </Link>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Link
                  href={`/blog/${post.categorySlug}`}
                  className="inline-flex items-center rounded-md bg-catppuccin-mantle px-2 py-1 text-xs font-medium ring-1 ring-inset ring-muted-foreground/20 hover:bg-catppuccin-mantle/80"
                >
                  {post.category}
                </Link>
              </div>
              <h1 className="text-balance text-4xl font-bold">{post.title}</h1>
            </div>

            <div className="flex items-center gap-3 border-b pb-8">
              <Avatar className="size-10 rounded-full">
                <AvatarImage
                  src="https://i.imgur.com/hiskNWW.png"
                  alt={post.author}
                />
              </Avatar>
              <div>
                <h2 className="font-semibold text-lg">{post.author}</h2>
                <p className="text-sm text-muted-foreground">
                  {post.dateFormatted}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <article className="prose prose-gray dark:prose-invert prose-headings:scroll-mt-20 prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 prose-img:rounded-lg prose-pre:my-0 prose-pre:bg-transparent prose-pre:p-0">
          <MDXRemote
            source={content}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [
                  remarkGfm,
                  remarkFrontmatter,
                  [
                    remarkGithub,
                    { repository: 'allthingslinux/allthingslinux' },
                  ],
                ],
                format: 'mdx',
              },
            }}
          />
          <hr className="my-8" />
          <h2 className="text-2xl font-bold pb-4">Contributors</h2>
          <GitContributors
            filePath={`content/blog/${post.categorySlug}/${slug}.mdx`}
          />
        </article>
      </div>
    </section>
  );
}
