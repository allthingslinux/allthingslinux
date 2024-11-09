'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AnniversaryBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-500 ease-in-out ${
        isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
      role="banner"
      aria-label="Anniversary announcement">
      <div className="container mx-auto px-4 py-3 relative">
        <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left">
          <Sparkles className="h-5 w-5 animate-pulse mr-2 mb-2 sm:mb-0" />
          <span className="font-semibold text-sm sm:text-base">
            Celebrating our 1 Year Anniversary! 🎉
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
          onClick={() => setIsVisible(false)}
          aria-label="Close anniversary banner">
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
