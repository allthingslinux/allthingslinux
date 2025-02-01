import { ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPostLoading() {
  return (
    <section className="py-20 min-h-[calc(100vh-4rem)]">
      <div className="container max-w-3xl">
        {/* Header */}
        <header className="mb-16">
          <div className="mb-8 inline-flex items-center gap-1 text-sm text-blue-400">
            <ChevronLeft className="h-4 w-4" />
            Return to blog
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>

            <div className="flex items-center gap-3 border-b pb-8">
              <Skeleton className="size-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <article className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[85%]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-[88%]" />
          <Skeleton className="h-4 w-[95%]" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-full" />
        </article>
      </div>
    </section>
  );
}
