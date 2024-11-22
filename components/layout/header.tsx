'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const closeSheet = () => setIsSheetOpen(false);

  return (
    <header className="mt-4">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4 lg:px-8">
          <Link className="text-2xl font-bold shrink-0" href="/">
            All Things Linux
          </Link>

          <nav className="hidden md:flex gap-4 lg:gap-8 items-center">
            <Link
              className="text-base lg:text-lg font-medium hover:text-white text-gray-500 whitespace-nowrap"
              href="/">
              Home
            </Link>
            <Link
              className="text-base lg:text-lg font-medium hover:text-catppuccin-text text-gray-500 whitespace-nowrap"
              href="/about">
              About
            </Link>
            <Link
              className="text-base lg:text-lg font-medium hover:text-catppuccin-text text-gray-500 whitespace-nowrap"
              href="/code-of-conduct">
              CoC
            </Link>
            <Link
              className="text-base lg:text-lg font-medium hover:text-catppuccin-text text-gray-500 whitespace-nowrap"
              href="https://atl.tools">
              Tools
            </Link>
            <Link
              className="text-base lg:text-lg font-medium hover:text-catppuccin-text text-gray-500 whitespace-nowrap"
              href="https://blog.atl.tools">
              Blog
            </Link>
            <Link
              className="text-base lg:text-lg font-medium hover:text-catppuccin-text text-gray-500 whitespace-nowrap"
              href="https://atl.wiki">
              Wiki
            </Link>
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <Button className="hidden md:flex whitespace-nowrap" variant="secondary">
              <Link href="/get-involved">Get Involved</Link>
            </Button>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="bg-slate-950 text-slate-50 w-64">
                <SheetTitle className="text-xl font-bold mb-8">
                  Explore
                </SheetTitle>
                <nav className="flex flex-col gap-10">
                  <Link
                    className="text-sm font-medium hover:text-catppuccin-text text-gray-500"
                    href="/"
                    onClick={closeSheet}>
                    Home
                  </Link>
                  <Link
                    className="text-sm font-medium hover:text-catppuccin-text text-gray-500"
                    href="/about"
                    onClick={closeSheet}>
                    About
                  </Link>
                  <Link
                    className="text-sm font-medium hover:text-catppuccin-text text-gray-500"
                    href="/code-of-conduct"
                    onClick={closeSheet}>
                    CoC
                  </Link>
                  <Link
                    className="text-sm font-medium hover:text-catppuccin-text text-gray-500"
                    href="https://atl.tools"
                    onClick={closeSheet}>
                    Tools
                  </Link>
                  <Link
                    className="text-sm font-medium hover:text-catppuccin-text text-gray-500"
                    href="https://blog.atl.tools"
                    onClick={closeSheet}>
                    Blog
                  </Link>
                  <Link
                    className="text-sm font-medium hover:text-catppuccin-text text-gray-500"
                    href="https://atl.wiki"
                    onClick={closeSheet}>
                    Wiki
                  </Link>
                  <Button variant="outline">
                    <Link href="/get-involved" onClick={closeSheet}>
                      Get Involved
                    </Link>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

