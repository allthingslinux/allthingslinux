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
            className="text-sm font-medium hover:text-slate-200 text-slate-400"
            href="/">
            Home
          </Link>
          <Link
            className="text-sm font-medium hover:text-slate-200 text-slate-400"
            href="/about">
            About
          </Link>
          <Link
            className="text-sm font-medium hover:text-slate-200 text-slate-400"
            href="#">
            Code of Conduct
          </Link>
          <Link
            className="text-sm font-medium hover:text-slate-200 text-slate-400"
            href="https://atl.tools">
            Resources
          </Link>
          <Link
            className="text-sm font-medium hover:text-slate-200 text-slate-400"
            href="https://blog.atl.tools">
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button className="hidden md:flex" variant="secondary">
            <Link href="/get-involved">Get Involved</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="bg-slate-950 text-slate-50 w-64">
              <SheetTitle className="text-xl font-bold mb-5">
                Explore
              </SheetTitle>
              <nav className="flex flex-col gap-8">
                <Link
                  className="text-sm font-medium hover:text-slate-200 text-slate-400"
                  href="/">
                  Home
                </Link>
                <Link
                  className="text-sm font-medium hover:text-slate-200 text-slate-400"
                  href="#">
                  About
                </Link>
                <Link
                  className="text-sm font-medium hover:text-slate-200 text-slate-400"
                  href="#">
                  Code of Conduct
                </Link>
                <Link
                  className="text-sm font-medium hover:text-slate-200 text-slate-400"
                  href="#">
                  Resources
                </Link>
                <Link
                  className="text-sm font-medium hover:text-slate-200 text-slate-400"
                  href="#">
                  Blog
                </Link>
                <Button variant="secondary">Get Involved</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </div>
  );
}
