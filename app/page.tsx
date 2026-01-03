import DonateCta from '@/components/pages/home/donate-cta';
import Hero from '@/components/pages/home/hero';
import Projects from '@/components/pages/home/projects';
import Stats from '@/components/pages/home/stats';
import Testimonials from '@/components/pages/home/testimonials';
import { getPageMetadata } from './metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = getPageMetadata('home');

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="w-full">
        {/* Hero - regular background */}
        <section className="py-8 md:py-20">
          <div className="container mx-auto px-4">
            <Hero />
          </div>
        </section>

        {/* Testimonials - dot grid pattern */}
        <section className="py-16 md:py-20 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <Testimonials />
          </div>
        </section>

        {/* Projects - regular background */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <Projects />
          </div>
        </section>

        {/* Stats - grid line pattern */}
        <section className="py-16 md:py-20 relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] [background-size:40px_40px] opacity-10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <Stats />
          </div>
        </section>

        {/* Donate CTA - regular background */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <DonateCta />
          </div>
        </section>
      </main>
    </div>
  );
}
