import { cn } from '@/lib/utils';

type SectionDividerProps = {
  className?: string;
  variant?: 'dots' | 'line' | 'gradient' | 'pattern';
};

/**
 * A component to visually separate sections of content
 */
export function SectionDivider({
  className,
  variant = 'dots',
}: SectionDividerProps) {
  return (
    <div className={cn('w-full py-12 sm:py-16 md:py-20', className)}>
      {variant === 'dots' && (
        <div className="flex justify-center items-center gap-2">
          <span className="block h-1.5 w-1.5 rounded-full bg-primary/60" />
          <span className="block h-1.5 w-1.5 rounded-full bg-primary/30" />
          <span className="block h-1.5 w-1.5 rounded-full bg-primary/60" />
        </div>
      )}

      {variant === 'line' && (
        <div className="flex justify-center items-center">
          <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      )}

      {variant === 'gradient' && (
        <div className="relative h-24">
          <div className="absolute inset-x-0 h-px top-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 flex items-center justify-center">
            <div className="h-1 w-1 rounded-full bg-primary/40" />
          </div>
        </div>
      )}

      {variant === 'pattern' && (
        <div className="flex flex-col items-center">
          <div className="w-full h-px bg-border mb-8" />
          <div className="grid grid-cols-3 gap-2 mb-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'block h-1.5 w-1.5 rounded-full',
                  i % 2 === 0 ? 'bg-primary/30' : 'bg-primary/10'
                )}
              />
            ))}
          </div>
          <div className="w-full h-px bg-border" />
        </div>
      )}
    </div>
  );
}
