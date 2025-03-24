import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function BlogPostLoading() {
  return (
    <div className="opacity-0 animate-in fade-in duration-500 delay-300 fill-mode-forwards">
      <article className="container relative max-w-3xl py-6 lg:py-10">
        <Link
          href="/blog"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute left-[-200px] top-14 hidden xl:inline-flex'
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          See all posts
        </Link>

        <Skeleton className="h-12 w-3/4 mb-2 rounded-md" />
        <Skeleton className="h-6 w-4/5 mb-6 rounded-md" />

        <div className="flex items-center space-x-4 mb-8">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-4 w-40 rounded-md" />
          </div>
        </div>

        {/* Content loading skeleton */}
        <div className="space-y-6">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-3">
                {i % 3 === 0 && <Skeleton className="h-8 w-2/3 rounded-md" />}
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                {i % 2 === 0 && <Skeleton className="h-4 w-4/5 rounded-md" />}
              </div>
            ))}
        </div>

        <hr className="mt-12" />
        <div className="flex justify-center py-6 lg:py-10">
          <div className={cn(buttonVariants({ variant: 'ghost' }))}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            See all posts
          </div>
        </div>
      </article>
    </div>
  );
}
