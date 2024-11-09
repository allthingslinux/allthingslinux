'use client';
import DonateCta from '@/components/blocks/donate-cta';
import Hero from '@/components/blocks/hero';
import Projects from '@/components/blocks/projects';
import Stats from '@/components/blocks/stats';
import Testimonials from '@/components/blocks/testimonials';

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <main>
          <div className="flex-grow mx-auto px-4 py-8 flex flex-col gap-8">
            <Hero />
            <Testimonials />
            <Projects />
            <Stats />
            <DonateCta />
          </div>
        </main>
      </div>
    </>
  );
}
