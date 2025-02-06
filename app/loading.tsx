import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero section skeleton */}
      <section className="pb-32">
        <div className="container flex flex-col items-center text-center">
          <Skeleton className="mb-12 h-24 w-[80%] lg:w-[60%]" />
          <Skeleton className="h-16 w-[90%] lg:w-[50%]" />
        </div>
        <div className="mt-16 h-[420px] relative">
          <div className="mx-auto max-w-3xl">
            {/* Distribution logos skeleton */}
            <div className="flex justify-center gap-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="size-16 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 