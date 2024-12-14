'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'CoC', href: '/code-of-conduct' },
  { name: 'Tools', href: 'https://atl.tools' },
  { name: 'Blog', href: '/blog' },
  { name: 'Wiki', href: 'https://atl.wiki' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="my-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-16 items-center px-4">
          {/* Left section - Logo */}
          <div className="w-[150px]">
            <Link href="/" className="text-lg font-semibold">
              All Things Linux
            </Link>
          </div>

          {/* Center section - Navigation */}
          <div className="flex flex-1 justify-center">
            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-base lg:text-lg font-medium text-catppuccin-text/60 transition-colors hover:text-catppuccin-text">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right section - CTA */}
          <div className="w-[150px] flex justify-end">
            <div className="hidden md:flex">
              <Link href="/get-involved" passHref>
                <Button variant="secondary">Get Involved</Button>
              </Link>
            </div>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="ml-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-catppuccin-crust/80 text-catppuccin-subtext w-64 border-l border-border">
                <SheetTitle className="text-xl font-bold mb-8 text-foreground">
                  Explore
                </SheetTitle>
                <div className="flex flex-col space-y-4 mt-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium text-catppuccin-subtext0 transition-colors hover:text-primary"
                      onClick={() => setIsOpen(false)}>
                      {item.name}
                    </Link>
                  ))}
                  <Link href="/get-involved" passHref>
                    <Button className="mt-2" variant="outline">
                      Get Involved
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

