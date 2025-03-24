import { notFound } from 'next/navigation';
import { Mdx } from '@/components/mdx-components';
import type { Metadata } from 'next';
import { getPost } from '@/lib/blog';
import { BackToAllPostsButton } from '@/components/blog/back-to-posts-button';
import ClientScrollToTop from '@/components/blog/client-scroll-to-top';

// Configure Edge Runtime for Cloudflare Pages
export const runtime = 'edge';

interface PostPageProps {
  params: {
    category: string;
    slug: string;
  };
}

export const revalidate = 3600;

// Simple date formatter function for edge runtime
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
        <div className="mt-4 items-center space-x-2 text-sm text-muted-foreground bg-card/50 px-3 py-1 rounded-md inline-flex">
          {post.author && (
            <>
              <div className="font-medium">{post.author}</div>
              <div>·</div>
            </>
          )}
          <div>
            <time dateTime={post.date}>
              {post.dateFormatted || formatDate(post.date)}
            </time>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Mdx code={post.body.code} />
      </div>

      <div className="flex justify-center items-center gap-4 py-6 lg:py-10">
        <BackToAllPostsButton />
        <ClientScrollToTop />
      </div>
    </article>
  );
}
