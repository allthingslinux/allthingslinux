'use client';

import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';

export default function ClientScrollToTop() {
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ChevronUp className="h-4 w-4" />
      Back to top
    </Button>
  );
}
