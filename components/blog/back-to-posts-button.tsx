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

  // Effect to force scroll to top after each render when needed
  useEffect(() => {
    // This ensures the page is at the top after navigating to blog list
    const path = window.location.pathname;
    if (path === '/blog/all-posts') {
      window.scrollTo(0, 0);
    }
  }, []);

  const handleGoBack = () => {
    if (isNavigating) return;

    setIsNavigating(true);

    // Force immediate scroll to top before anything else
    window.scrollTo(0, 0);

    // Prefetch the destination first
    router.prefetch('/blog/all-posts');

    // Use a fixed overlay during transition
    const overlay = document.createElement('div');
    overlay.className =
      'fixed inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300';
    overlay.style.opacity = '0';

    // Add spinner directly to overlay without a container
    overlay.innerHTML = `
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-neutral-200">Loading posts...</p>
      </div>
    `;
    document.body.appendChild(overlay);

    // Fade in the overlay
    setTimeout(() => {
      overlay.style.opacity = '1';
    }, 10);

    // Navigate after a short delay with the overlay visible
    setTimeout(() => {
      // Navigate with scroll:true to start at the top
      router.push('/blog/all-posts', { scroll: true });

      // After navigation, ensure we're at the top again and clean up
      setTimeout(() => {
        // Force scroll to top again after navigation completes
        window.scrollTo(0, 0);

        // Begin fading out the overlay
        overlay.style.opacity = '0';

        // Remove overlay after fade completes
        setTimeout(() => {
          document.body.removeChild(overlay);
          setIsNavigating(false);
        }, 300);
      }, 300); // Increased timeout for navigation to complete
    }, 50);
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
