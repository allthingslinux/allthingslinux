'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface BackToAllPostsButtonProps {
  className?: string;
}

export function BackToAllPostsButton({ className }: BackToAllPostsButtonProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(false);

  // Effect to scroll to top after navigation
  useEffect(() => {
    if (shouldScroll) {
      window.scrollTo(0, 0);
      setShouldScroll(false);
    }
  }, [shouldScroll]);

  const handleGoBack = () => {
    setIsNavigating(true);

    // Navigate first, then scroll to top
    router.push('/blog/all-posts', { scroll: false });

    // Trigger scroll effect after a short delay to ensure navigation completes
    setTimeout(() => {
      window.scrollTo(0, 0);
      setIsNavigating(false);
    }, 100);
  };

  return (
    <button
      onClick={handleGoBack}
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        isNavigating && 'opacity-70 pointer-events-none',
        className
      )}
      disabled={isNavigating}
    >
      <ChevronLeft className="mr-2 h-4 w-4" />
      See all posts
    </button>
  );
}
