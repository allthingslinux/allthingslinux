import { Skeleton } from '@/components/ui/skeleton';

export default function BlogRootLoading() {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-center gap-6 text-center">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-16 w-[90%] sm:w-[70%] lg:w-[50%]" />
          <Skeleton className="h-12 w-[95%] sm:w-[80%] lg:w-[60%]" />
        </div>
      </div>
    </section>
  );
}
