import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  // This component will only show for full page loads, not during soft navigation transitions
  return (
    <div className="opacity-0 animate-in fade-in duration-500 delay-300 fill-mode-forwards">
      <section className="py-32">
        <div className="container">
          <div className="flex flex-col items-center gap-6 text-center">
            <Badge variant="secondary">Blog</Badge>
            <Skeleton className="h-12 w-3/4 max-w-screen-md rounded-md" />
            <Skeleton className="h-20 w-4/5 max-w-screen-md rounded-md" />
          </div>

          <div className="mx-auto mt-20 grid max-w-screen-xl grid-cols-1 gap-20 lg:grid-cols-4">
            <div className="hidden flex-col gap-2 lg:flex">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
            </div>

            <div className="lg:col-span-3">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex flex-col gap-3 mb-8">
                    <Skeleton className="h-5 w-24 rounded-md" />
                    <Skeleton className="h-8 w-full rounded-md" />
                    <Skeleton className="h-20 w-full rounded-md" />
                    <div className="mt-3 flex items-center gap-2">
                      <Skeleton className="h-4 w-32 rounded-md" />
                      <Skeleton className="h-4 w-40 rounded-md" />
                    </div>
                    <Separator className="my-8" />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
