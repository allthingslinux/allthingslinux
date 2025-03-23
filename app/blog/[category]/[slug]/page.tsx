import { Mdx } from '@/components/mdx-components';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { allBlogPosts } from 'contentlayer/generated';
import { ChevronLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogPostMeta } from '@/components/blog/blog-post-meta';
import { BackToAllPostsButton } from '@/components/blog/back-to-posts-button';

// Types
type BlogPostParams = {
  params: {
    category: string;
    slug: string;
  };
};

// Helper function to get post
async function getPostFromParams(params: BlogPostParams['params']) {
  const resolvedParams = await Promise.resolve(params);
  const { category, slug } = resolvedParams;

  if (!category || !slug) {
    return null;
  }

  const post = allBlogPosts.find(
    (post) => post.categorySlug === category && post.slug === slug
  );

  if (!post) {
    return null;
  }

  return post;
}

// Simple date formatter function for server components
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
}

// Metadata generation
export async function generateMetadata({
  params,
}: BlogPostParams): Promise<Metadata> {
  const post = await getPostFromParams(params);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} - All Things Linux Blog`,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export async function generateStaticParams() {
  return allBlogPosts.map((post) => ({
    category: post.categorySlug,
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: BlogPostParams) {
  const post = await getPostFromParams(params);

  if (!post) {
    notFound();
  }

  // Format the date at the component level for safety
  const formattedDate = post.dateFormatted || formatDate(post.date);

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <div className="absolute left-[-200px] top-14 hidden xl:block">
        <BackToAllPostsButton />
      </div>

      <h1 className="mb-2 font-heading text-4xl leading-tight lg:text-5xl">
        {post.title}
      </h1>

      {post.description && (
        <p className="mb-6 text-lg text-muted-foreground">{post.description}</p>
      )}

      <BlogPostMeta
        author={post.author}
        date={post.date}
        formattedDate={formattedDate}
        category={post.category}
        categorySlug={post.categorySlug}
      />

      <Mdx code={post.body.code} />

      <hr className="mt-12" />
      <div className="flex justify-center py-6 lg:py-10">
        <BackToAllPostsButton />
      </div>
    </article>
  );
}
