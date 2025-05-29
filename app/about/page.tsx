import Values from '@/components/pages/about/values';
import { getPageMetadata } from '../metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = getPageMetadata('about');

export default function About() {
  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Hero Section with terminal-inspired design */}
      <section className="relative pb-8 sm:pb-12 md:pb-16 lg:pb-20 pt-10 sm:pt-12 md:pt-16 lg:pt-20">
        {/* Terminal window container */}
        <div className="relative max-w-5xl mx-auto mb-12 rounded-lg overflow-hidden border border-primary/20 shadow-lg bg-card/10">
          {/* Terminal header */}
          <div className="bg-muted/30 px-4 py-2 flex items-center">
            <div className="flex space-x-2 mr-auto">
              <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 text-xs font-mono opacity-70">
              tux@atl ~
            </div>
          </div>

          {/* Terminal content */}
          <div className="p-6 sm:p-8 md:p-10 font-mono">
            <div
              className="mb-8 overflow-hidden whitespace-nowrap border-r-4 border-primary/70 pr-1 text-sm sm:text-base text-primary/90 animate-type-once"
              style={{ width: '240px', maxWidth: '240px' }}
            >
              <span className="text-green-400">$</span>{' '}
              <span className="text-yellow-300">cat</span> allthingslinux.md
            </div>

            {/* Content blocks */}
            <div className="mx-auto max-w-3xl text-left mb-6 sm:mb-8 font-sans">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4 text-white">
                About Our Organization
              </h1>
              <p className="text-base sm:text-md md:text-lg lg:text-xl text-white/80">
                Fostering a vibrant community of Linux enthusiasts through
                education, collaboration, and support.
              </p>
            </div>
          </div>
        </div>

        {/* Content blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 max-w-5xl mx-auto">
          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
            <div className="bg-card/30 rounded-lg p-4 sm:p-5 md:p-6 border border-primary/5">
              <h3 className="text-base sm:text-lg font-medium mb-2 text-primary/90 font-mono flex items-center">
                <span className="text-green-500 mr-2">~/</span>Our Community
              </h3>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-balance">
                We are a diverse community of over 10,000 Linux enthusiasts,
                passionate about advancing technology and sharing knowledge. Our
                organization is dedicated to promoting the spirit and growth of
                Linux through collaboration and innovation.
              </p>
            </div>

            <div className="bg-card/30 rounded-lg p-4 sm:p-5 md:p-6 border border-primary/5">
              <h3 className="text-base sm:text-lg font-medium mb-2 text-primary/90 font-mono flex items-center">
                <span className="text-green-500 mr-2">~/</span>Our Mission
              </h3>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-balance">
                We develop tools, create self-hosted projects, and curate
                educational resources that enrich the Linux ecosystem. Through
                these efforts, we aim to enhance user experiences and make Linux
                more accessible to newcomers.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 mt-4 md:mt-0">
            <div className="bg-card/30 rounded-lg p-4 sm:p-5 md:p-6 border border-primary/5">
              <h3 className="text-base sm:text-lg font-medium mb-2 text-primary/90 font-mono flex items-center">
                <span className="text-green-500 mr-2">~/</span>Our Values
              </h3>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-balance">
                At the core of All Things Linux is our commitment to inclusivity
                and diversity. Our code of conduct ensures everyone feels
                welcome, regardless of background or skill level. We value
                different perspectives and foster a supportive environment for
                learning and growth.
              </p>
            </div>

            <div className="bg-card/30 rounded-lg p-4 sm:p-5 md:p-6 border border-primary/5">
              <h3 className="text-base sm:text-lg font-medium mb-2 text-primary/90 font-mono flex items-center">
                <span className="text-green-500 mr-2">~/</span>Our Future
              </h3>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-balance">
                As a 501(c)(3) nonprofit, we prioritize transparency and
                community-driven decisions. Our ongoing development includes
                Discord bots, wikis, and self-hosted tools. Join us as we
                explore possibilities and contribute to the future of
                open-source technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Values />
    </div>
  );
}
