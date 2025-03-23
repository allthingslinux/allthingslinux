import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPost } from '@/lib/blog';
import { BackToAllPostsButton } from '@/components/blog/back-to-posts-button';
import { Mdx } from '@/components/mdx-components';

// Enable ISR with revalidation every hour
export const revalidate = 3600;

// Configure Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

interface PostPageProps {
  params: {
    category: string;
    slug: string;
  };
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

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  // Properly await params
  const resolvedParams = await Promise.resolve(params);
  const { category, slug } = resolvedParams;

  const post = getPost(category, slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The post you are looking for does not exist.',
    };
  }

  return {
    title: `${post.title} | All Things Linux Blog`,
    description:
      post.description || `Read ${post.title} on All Things Linux Blog`,
    authors: [{ name: post.author }],
    openGraph: {
      type: 'article',
      title: post.title,
      description:
        post.description || `Read ${post.title} on All Things Linux Blog`,
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  // Properly await params
  const resolvedParams = await Promise.resolve(params);
  const { category, slug } = resolvedParams;

  const post = getPost(category, slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <div className="absolute left-[-200px] top-14 hidden xl:block">
        <BackToAllPostsButton />
      </div>

      <div>
        <h1 className="mt-2 scroll-m-20 text-4xl font-bold tracking-tight text-balance">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-2 text-xl text-muted-foreground text-balance">
            {post.description}
          </p>
        )}

        {/* Author and date with card aesthetic */}
        <div className="mt-6">
          <div className="flex items-center space-x-4 rounded-lg border border-gray-800 bg-gray-900/50 p-4 shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="font-medium text-neutral-200">{post.author}</div>
              <div className="text-xs text-neutral-400 flex items-center gap-2">
                <span>Published on</span>
                <time dateTime={post.date}>
                  {post.dateFormatted || formatDate(post.date)}
                </time>
                <span>•</span>
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/20">
                  {post.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="prose prose-quoteless prose-neutral dark:prose-invert mt-12 w-full">
        <Mdx code={post.body.code} />
      </div>

      <hr className="mt-12" />
      <div className="flex justify-center py-6 lg:py-10">
        <BackToAllPostsButton />
      </div>
    </article>
  );
}
