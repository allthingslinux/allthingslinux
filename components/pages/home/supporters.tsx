'use client';

import { memo, useState, useEffect } from 'react';

import Image from 'next/image';

import Marquee from '@/components/ui/marquee';

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
  logo, 
  onHover 
}: { 
  name: string; 
  logo: string;
  onHover: (hovering: boolean) => void;
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
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
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
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [marqueeKey, setMarqueeKey] = useState(0);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsVisible(visible);
      
      // Reset marquee when tab becomes visible to prevent glitches
      if (visible) {
        // Clear any pending timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        // Small delay to ensure browser has processed the visibility change
        timeoutId = setTimeout(() => {
          setMarqueeKey((prev) => prev + 1);
        }, 100);
      }
    };

    const handleFocus = () => {
      setIsVisible(true);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        setMarqueeKey((prev) => prev + 1);
      }, 100);
    };

    const handleBlur = () => {
      setIsVisible(false);
    };

    // Set initial visibility state
    setIsVisible(!document.hidden);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
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
        
        <div className={isHovering || !isVisible ? '**:[animation-play-state:paused]' : ''}>
          <Marquee
            key={marqueeKey}
            className="[--duration:40s] gap-4 md:gap-8 p-0 [&>div]:gap-4 [&>div]:md:gap-8"
            repeat={3}
            aria-label="Supporters logos"
          >
            {SUPPORTERS.map((supporter) => (
              <SupporterLogo 
                key={supporter.name} 
                {...supporter}
                onHover={setIsHovering}
              />
            ))}
          </Marquee>
        </div>
      </div>
    </>
  );
});

Supporters.displayName = 'Supporters';

export default Supporters;
