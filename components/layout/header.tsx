'use client';

import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

// Define navigation items
const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'CoC', href: '/code-of-conduct' },
  { name: 'Blog', href: '/blog' },
  { name: 'Wiki', href: 'https://atl.wiki' },
  { name: 'Tools', href: 'https://atl.tools' },
  { name: 'Open', href: '/open' },
  { name: 'Apply', href: '/apply' },
];

// Logo component
const Logo = () => (
  <Link href="/" className="flex items-center mr-6">
    <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
      All Things Linux
    </span>
  </Link>
);

// Desktop NavLink component
const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== '/' && pathname?.startsWith(href));
  const isExternal = href.startsWith('http');

  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={cn(
        'px-4 py-2 rounded-full text-sm transition-all relative',
        isActive
          ? 'font-medium text-primary bg-primary/10'
          : 'font-normal text-foreground/90 hover:bg-background/80 hover:text-foreground'
      )}
    >
      {children}
    </Link>
  );
};

// Desktop navigation component
const DesktopNavigation = () => (
  <div className="hidden md:flex items-center bg-card/40 backdrop-blur-sm rounded-full px-1.5 py-1.5 border border-border/30">
    {navItems.map((item) => (
      <NavLink key={item.name} href={item.href}>
        {item.name}
      </NavLink>
    ))}
  </div>
);

// CTA button component
const CTAButton = ({ className }: { className?: string }) => (
  <Link href="/contribute">
    <Button
      variant="default"
      size="default"
      className={cn(
        'font-semibold px-5 py-2.5 rounded-full bg-primary text-primary-foreground',
        'hover:scale-105 hover:bg-primary/90 transition-all duration-300',
        className
      )}
    >
      Contribute & Donate
    </Button>
  </Link>
);

// Mobile navigation links
const MobileNavLinks = ({ onNavigate }: { onNavigate: () => void }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-2">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/' && pathname?.startsWith(item.href));

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'py-2.5 px-4 rounded-lg font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-foreground/90 hover:bg-card/60'
            )}
          >
            {item.name}
          </Link>
        );
      })}
    </div>
  );
};

// Mobile navigation component
const MobileNavigation = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button
          variant="outline"
          size="sm"
          className="ml-2 rounded-full border-border/50"
        >
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px]">
        <SheetHeader className="mb-8 pb-4 border-b">
          <SheetTitle className="text-left">
            <span className="font-bold text-foreground">All Things Linux</span>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-8">
          <MobileNavLinks onNavigate={handleClose} />
          <div onClick={handleClose}>
            <CTAButton className="w-full" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Main Header component
export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md py-3">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo />

          <div className="flex items-center gap-x-4">
            <DesktopNavigation />
            <div className="hidden md:block ml-4">
              <CTAButton />
            </div>
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  );
}
