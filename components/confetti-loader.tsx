'use client';

import type { ConfettiRef } from '@/components/ui/confetti';
import Confetti from '@/components/ui/confetti';
import { useEffect, useRef } from 'react';

export function ConfettiLoader() {
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    const handleLoad = () => {
      confettiRef.current?.fire({});
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <Confetti
      ref={confettiRef}
      className="absolute left-0 top-0 z-auto size-full"
      style={{ pointerEvents: 'none' }}
    />
  );
}
