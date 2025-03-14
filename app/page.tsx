import { getPageMetadata } from './metadata';
import { viewport } from './metadata';

import DonateCta from '@/components/pages/home/donate-cta';
import Hero from '@/components/pages/home/hero';
import Projects from '@/components/pages/home/projects';
import Stats from '@/components/pages/home/stats';
import Testimonials from '@/components/pages/home/testimonials';

export { viewport };
export const metadata = getPageMetadata('home');

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main>
        <div className="grow mx-auto px-4 py-8 flex flex-col gap-8 container">
          <Hero />
          <Testimonials />
          <Projects />
          <Stats />
          <DonateCta />
        </div>
      </main>
    </div>
  );
}
