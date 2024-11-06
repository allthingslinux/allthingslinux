import Hero from '@/components/blocks/hero';
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
        <Stats />
        <DonateCta />
      </main>
    </div>
  );
}
