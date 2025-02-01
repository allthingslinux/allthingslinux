import { Skeleton } from '@/components/ui/skeleton';

export default function BlogCategoryLoading() {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center gap-6 text-center">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-16 w-[90%] sm:w-[70%] lg:w-[50%]" />
          <Skeleton className="h-12 w-[95%] sm:w-[80%] lg:w-[60%]" />
        </div>

        <div className="mx-auto mt-20 grid max-w-screen-xl grid-cols-1 gap-20 lg:grid-cols-4">
          {/* Categories sidebar */}
          <div className="hidden flex-col gap-2 lg:flex">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>

          {/* Posts grid */}
          <div className="lg:col-span-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 mb-8">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-[95%]" />
                <Skeleton className="h-16 w-[90%]" />
                <div className="mt-3 flex items-center gap-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                {i !== 4 && <Skeleton className="h-px w-full mt-8" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
