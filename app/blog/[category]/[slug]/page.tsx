import { notFound } from 'next/navigation';
import { Mdx } from '@/components/mdx-components';
import { getPost } from '@/lib/blog';
import { BackToAllPostsButton } from '@/components/blog/back-to-posts-button';
import ClientScrollToTop from '@/components/blog/client-scroll-to-top';
import { ArticleSchema } from '@/components/structured-data';
import { getDynamicMetadata } from '@/app/metadata';
import { getBaseUrl } from '@/lib/utils';
import type { Metadata } from 'next';

interface PostPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

// Generate metadata for the post
export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPost(category, slug);

  if (!post) {
    return getDynamicMetadata({
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    });
  }

  // Convert category slug to proper name for display
  // const categoryName =
  //   post.category ||
  //   category
  //     .split('-')
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(' ');

  // Build dynamic OG image URL with query parameters
  // const ogImageUrl = new URL(getApiUrl('/api/og'));
  // ogImageUrl.searchParams.append('title', post.title);
  // ogImageUrl.searchParams.append('category', categoryName);
  // ogImageUrl.searchParams.append('date', post.date);

  return {
    ...getDynamicMetadata({
      title: post.title,
      description: post.description || `Read our post about ${post.title}`,
    }),
    openGraph: {
      title: post.title,
      description: post.description || `Read our post about ${post.title}`,
      type: 'article',
      url: `${getBaseUrl()}/blog/${category}/${slug}`,
      // images: [
      //   {
      //     url: ogImageUrl.toString(),
      //     width: 1200,
      //     height: 630,
      //     alt: post.title,
      //   },
      // ],
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: [post.author || 'All Things Linux'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || `Read our post about ${post.title}`,
      // images: [ogImageUrl.toString()],
    },
  };
}

// Simple date formatter function
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

export default async function PostPage({ params }: PostPageProps) {
  const { category, slug } = await params;

  const post = await getPost(category, slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container relative max-w-4xl py-6 lg:py-10">
      <ArticleSchema
        title={post.title}
        description={post.description || `Read our post about ${post.title}`}
        imageUrl="https://allthingslinux.org/images/og.png"
        datePublished={post.date}
        dateModified={post.date}
        authorName={post.author || 'All Things Linux'}
      />
      <div className="absolute left-[-200px] top-14 hidden xl:block">
        <BackToAllPostsButton />
      </div>

      <div>
        <h1 className="mt-2 scroll-m-20 text-4xl font-bold tracking-tight text-balance">
          {post.title}
        </h1>
        {post.description && (
          <p className="my-4 text-md text-muted-foreground text-balance">
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
