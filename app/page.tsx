import Image from 'next/image';

import Hero from '@/components/blocks/hero';
import Values from '@/components/blocks/values';
import Navbar from '@/components/blocks/navbar';
import Stats from '@/components/blocks/stats';
import Cards from '@/components/blocks/cards';
import DiscordCta from '@/components/blocks/discord-cta';
import DonateCta from '@/components/blocks/donate-cta';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col'>
      <header className=''>
        <div className='container mx-auto px-4 py-4'>
          <nav>
            <Navbar />
          </nav>
        </div>
      </header>

      <main className='flex-grow container mx-auto px-4 py-8 flex flex-col gap-8'>
        <Hero />
        <DiscordCta />
        <Cards />
        <Values />
        <Stats />
        <DonateCta />
      </main>

      <footer className='bg-gray-800 text-white py-4'>
        <div className='container mx-auto text-center'>
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
