import { notFound } from 'next/navigation';
import { getAllPosts, getPostsByCategory } from '@/lib/blog';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const revalidate = 3600;

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Properly await params
  const resolvedParams = await Promise.resolve(params);
  const { category } = resolvedParams;

  const allPostsData = await getAllPosts();
  const allCategories = Array.from(
    new Set(allPostsData.map((post) => post.category))
  ).filter((value, index, self) => self.indexOf(value) === index);

  const posts = await getPostsByCategory(category);

  if (!posts || posts.length === 0 || !allCategories.includes(category)) {
    notFound();
  }

  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="container py-6 lg:py-10">
      <div className="flex items-start gap-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all posts
          </Link>
        </Button>
      </div>

      <div className="my-8">
        <h1 className="scroll-m-20 text-3xl font-bold tracking-tight lg:text-4xl">
          {categoryTitle}
        </h1>
        <p className="text-muted-foreground mt-2">
          {posts.length} article{posts.length === 1 ? '' : 's'}
        </p>
      </div>

      <hr className="mt-8 mb-8" />

      <div className="flex flex-col">
        {posts.map((post) => (
          <div key={post.slug}>
            <Link
              href={`/blog/${post.categorySlug}/${post.slug}`}
              className="flex flex-col gap-3 hover:opacity-90 transition-opacity"
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
          </div>
        ))}
      </div>
    </div>
  );
}
