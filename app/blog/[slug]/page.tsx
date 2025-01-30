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

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const posts = await getAllPosts();
  // This should be awaited, despite the warning.

  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Remove frontmatter from content
  const content = post.content.replace(/^---[\s\S]*?---/, '').trim();

  return (
    <section className="py-20">
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
                <span className="inline-flex items-center rounded-md bg-catppuccin-mantle px-2 py-1 text-xs font-medium ring-1 ring-inset ring-muted-foreground/20">
                  {post.category}
                </span>
              </div>
              <h1 className="text-balance text-4xl font-bold">{post.title}</h1>
            </div>

            <div className="flex items-center gap-3 border-b pb-8">
              <Avatar className="size-10 rounded-full">
                <AvatarImage src="../../favicon.ico" alt={post.author} />
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
          <GitContributors filePath={`content/blog/${slug}.mdx`} />
        </article>
      </div>
    </section>
  );
}
