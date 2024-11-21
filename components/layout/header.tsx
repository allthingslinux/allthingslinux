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
    <div className="container mx-auto px-4 py-12">
      <header className="px-4 lg:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center">
          <Link className="text-2xl font-bold" href="/">
            All Things Linux
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 justify-center gap-4 sm:gap-6 items-center">
          <Link
            className="text-lg font-medium hover:text-white text-gray-500"
            href="/">
            Home
          </Link>
          <Link
            className="text-lg font-medium hover:text-catppuccin-text text-gray-500"
            href="/about">
            About
          </Link>
          <Link
            className="text-lg font-medium hover:text-catppuccin-text text-gray-500"
            href="/code-of-conduct">
            CoC
          </Link>
          <Link
            className="text-lg font-medium hover:text-catppuccin-text text-gray-500"
            href="https://atl.tools">
            Tools
          </Link>
          <Link
            className="text-lg font-medium hover:text-catppuccin-text text-gray-500"
            href="https://blog.atl.tools">
            Blog
          </Link>
          <Link
            className="text-lg font-medium hover:text-catppuccin-text text-gray-500"
            href="https://atl.wiki">
            Wiki
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button className="hidden md:flex" variant="secondary">
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
      </header>
    </div>
  );
}
