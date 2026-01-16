'use client';

import { memo, useState, useEffect, useRef } from 'react';

import Image from 'next/image';

const SUPPORTERS = [
  {
    name: 'Canva',
    logo: '/images/supporters/canva.svg',
  },
  {
    name: 'Cloudflare',
    logo: '/images/supporters/cloudflare.svg',
  },
  {
    name: 'TechSoup',
    logo: '/images/supporters/techsoup.svg',
  },
  {
    name: 'Fibery',
    logo: '/images/supporters/fibery.svg',
  },
  {
    name: 'Monday',
    logo: '/images/supporters/monday.png',
  },
  {
    name: 'Okta',
    logo: '/images/supporters/okta.svg',
  },
  {
    name: 'GitHub',
    logo: '/images/supporters/github.png',
  },
  {
    name: 'Sentry',
    logo: '/images/supporters/sentry.svg',
  },
] as const;

const SupporterLogo = memo(({ 
  name, 
  logo
}: { 
  name: string; 
  logo: string;
}) => {
  const isSvg = logo.endsWith('.svg');
  const isMonday = name === 'Monday';
  const isGitHub = name === 'GitHub';
  const isTechSoup = name === 'TechSoup';

  let logoClassName = 'h-12 w-auto object-contain transition-all duration-300 opacity-95 hover:opacity-100 hover:scale-105';
  const logoStyle: React.CSSProperties = {
    filter: isSvg && !isTechSoup ? 'brightness(0) saturate(100%) invert(1)' : 'none',
  };

  if (isMonday) {
    logoClassName = 'h-[48px] w-auto max-w-[180px] object-contain transition-all duration-300 opacity-95 hover:opacity-100 hover:scale-105';
  } else if (isGitHub) {
    logoClassName = 'h-[48px] w-auto max-w-[180px] object-contain transition-all duration-300 opacity-95 hover:opacity-100 hover:scale-105';
  } else if (isTechSoup) {
    logoClassName = 'h-[60px] w-auto max-w-[240px] object-contain transition-all duration-300 opacity-95 hover:opacity-100 hover:scale-105';
  }

  return (
    <div 
      className="flex items-center justify-center px-6 md:px-12 py-6"
      role="presentation"
    >
      <Image
        src={logo}
        alt={`${name} logo`}
        width={240}
        height={80}
        className={logoClassName}
        style={logoStyle}
        unoptimized={isSvg}
        onError={(e) => {
          console.error(`Failed to load logo: ${logo}`, e);
        }}
      />
    </div>
  );
});

SupporterLogo.displayName = 'SupporterLogo';

const Supporters = memo(() => {
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const positionRef = useRef(0);
  const speedRef = useRef(0.5); // pixels per frame
  const setWidthRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Calculate set width once
    const firstSet = container.firstElementChild as HTMLElement;
    if (firstSet) {
      setWidthRef.current = firstSet.offsetWidth;
    }

    const animate = () => {
      if (isVisible && !document.hidden) {
        positionRef.current -= speedRef.current;
        
        // Reset position when we've scrolled one full set (seamless loop)
        if (setWidthRef.current > 0 && Math.abs(positionRef.current) >= setWidthRef.current) {
          positionRef.current = 0;
        }
        
        container.style.transform = `translateX(${positionRef.current}px)`;
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    setIsVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <>
      <div className="mx-auto max-w-2xl text-center mb-12">
        <h2 className="mb-4 text-2xl font-semibold md:text-3xl">
          Thank you to our supporters
        </h2>
        <p className="text-base text-muted-foreground">
          We&apos;re grateful to these companies for their generous support through
          discounted rates, donations, and special plans that help us serve our
          community.
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div 
          ref={containerRef}
          className="flex gap-4 md:gap-8"
          style={{ willChange: 'transform' }}
        >
          {/* Render multiple sets for seamless loop */}
          {Array.from({ length: 3 }).map((_, setIndex) => (
            <div key={`set-${setIndex}`} className="flex shrink-0 gap-4 md:gap-8">
              {SUPPORTERS.map((supporter) => (
                <SupporterLogo 
                  key={`${setIndex}-${supporter.name}`}
                  {...supporter}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

Supporters.displayName = 'Supporters';

export default Supporters;
