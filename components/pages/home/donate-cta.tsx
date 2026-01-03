import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { LinkIcon } from 'lucide-react';
import Link from 'next/link';

import { BsOpencollective } from 'react-icons/bs';

const DonateCta = memo(() => {
  return (
    <section className="py-4 md:py-6">
      <div
        className="container relative overflow-hidden rounded-lg bg-cover bg-center"
        style={{
          backgroundImage: 'url("/images/donatebg.png")',
        }}
      >
        <div className="absolute inset-0 bg-background opacity-40"></div>
        <div className="relative flex w-full flex-col py-8 sm:p-3 md:p-6 md:rounded-xl lg:flex-row lg:items-center lg:p-16">
          <div className="flex-1">
            <BsOpencollective className="size-12 mb-6" />
            <h3 className="mb-4 text-xl font-semibold text-foreground md:mb-4 md:text-3xl lg:mb-6">
              Support our Community
            </h3>
            <p className="text-card-foreground text-balance lg:text-base">
              All Things Linux is a community-driven project that relies on
              donations and out of pocket funds. Your donations help us keep the
              lights on and provide more services to the community.
            </p>
            <div className="mt-8">
              <Link href="https://opencollective.com/allthingslinux">
                <Button variant="secondary" size="lg" className="flex items-center gap-2">
                  <LinkIcon />
                  Donate Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

DonateCta.displayName = 'DonateCta';

export default DonateCta;
