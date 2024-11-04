import Image from 'next/image';

import Hero from '@/components/blocks/hero';
import Values from '@/components/blocks/values';
import Stats from '@/components/blocks/stats';
import Cards from '@/components/blocks/cards';
import DonateCta from '@/components/blocks/donate-cta';
import Testimonials from '@/components/blocks/testimonials';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow mx-auto px-4 py-8 flex flex-col gap-8 container">
        <Hero />
        <Testimonials />
        <Cards />
        {/* <Values /> */}
        <Stats />
        <DonateCta />
      </main>

      <footer className="bg-[#1a1b26] text-white py-4">
        <div className="container mx-auto text-center">
          {new Date().getFullYear()} | All Things Linux
        </div>
      </footer>
    </div>
  );
}
