import { memo } from 'react';
import Image from 'next/image';
import DiscordSkeleton from './discord-skeleton';

const Hero = memo(() => {
  return (
    <section className="pb-32">
      <div className="container flex flex-col items-center text-center">
        <h1 className="mb-12 text-6xl font-bold lg:text-7xl  text-center">
          Let&apos;s build the future of Linux together
        </h1>
        <p className="max-w-4xl text-catppuccin-text/90 lg:text-2xl text-xl pb-4">
          All Things Linux is a 501(c)(3) non-profit organization with a mission
          to empower the Linux ecosystem through education, collaboration, and
          support.
        </p>
      </div>
      <div className="aspect-video text-clip sm:mt-16 md:aspect-auto md:h-[420px]">
        <div className="relative mx-auto flex max-w-3xl flex-col">
          {/* Left icons */}
          <div className="absolute right-[calc(100%+63px)] top-0 hidden size-[64px] rounded-2xl bg-[#4FAEC3] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <Image
              src="/images/hero/arch.png"
              alt="Arch Linux"
              width={64}
              height={64}
              className="size-full rounded-md object-cover object-center p-3"
              priority
            />
          </div>
          <div className="absolute right-[calc(100%+195px)] top-[52px] hidden size-[64px] rounded-2xl bg-[#605191] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <Image
              src="/images/hero/gentoo.png"
              alt="Gentoo Linux"
              width={64}
              height={64}
              className="size-full rounded-md object-cover object-center p-3"
              loading="lazy"
            />
          </div>
          <div className="absolute right-[calc(100%+34px)] top-[144px] hidden size-[64px] rounded-2xl bg-[#8862ab] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <Image
              src="/images/hero/bazzite.png"
              alt="Bazzite"
              width={64}
              height={64}
              className="size-full rounded-md object-cover object-center p-3"
              loading="lazy"
            />
          </div>
          <div className="absolute right-[calc(100%+268px)] top-[164px] hidden size-[64px] rounded-2xl bg-[#A82248] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <Image
              src="/images/hero/debian.png"
              alt="Debian"
              width={64}
              height={64}
              className="size-full rounded-md object-cover object-center p-3"
              loading="lazy"
            />
          </div>
          <div className="absolute right-[calc(100%+156px)] top-[240px] hidden size-[64px] rounded-2xl bg-[#2B816F] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <Image
              src="/images/hero/cachy.png"
              alt="Cachy"
              width={64}
              height={64}
              className="size-full rounded-md object-cover object-center p-3"
              loading="lazy"
            />
          </div>
          <div className="absolute right-[calc(100%+242px)] top-[340px] hidden size-[64px] rounded-2xl bg-[#2988CC] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <Image
              src="/images/hero/fedora.png"
              alt="Fedora"
              width={64}
              height={64}
              className="size-full rounded-md object-cover object-center p-3"
              loading="lazy"
            />
          </div>
          <div className="absolute right-[calc(100%+66px)] top-[366px] hidden size-[64px] rounded-2xl bg-[#82C73C] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <Image
              src="/images/hero/mint.png"
              alt="Mint"
              width={64}
              height={64}
              className="size-full rounded-md object-cover object-center p-3"
              loading="lazy"
            />
          </div>
          {/* Right icons */}
          <div className="absolute left-[calc(100%+53px)] top-0 hidden size-[64px] rounded-2xl bg-[#243742] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <Image
              src="/images/hero/bedrock.png"
              alt="Bedrock Linux"
              width={64}
              height={64}
              className="size-full rounded-md object-cover object-center p-3"
              priority
            />
          </div>
          <div className="absolute left-[calc(100%+202px)] top-[34px] hidden size-[64px] rounded-2xl bg-[#B27180] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <Image
              src="/images/hero/asahi.png"
              alt="Asahi Linux"
              width={64}
              height={64}
              className="size-full rounded-md object-cover object-center p-3"
              loading="lazy"
            />
          </div>
          <div className="absolute left-[calc(100%+97px)] top-[141px] hidden size-[64px] rounded-2xl bg-[#DD4814] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <Image
              src="/images/hero/ubuntu.png"
              alt="Ubuntu"
              width={64}
              height={64}
              className="size-full rounded-md object-cover object-center p-3"
              loading="lazy"
            />
          </div>
          <div className="absolute left-[calc(100%+282px)] top-[138px] hidden size-[64px] rounded-2xl bg-[#30BA78] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <Image
              src="/images/hero/opensuse.png"
              alt="openSUSE"
              width={64}
              height={64}
              className="size-full rounded-md object-cover object-center p-3"
              loading="lazy"
            />
          </div>
          <div className="absolute left-[calc(100%+42px)] top-[262px] hidden size-[64px] rounded-2xl bg-[#4F73BC] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <Image
              src="/images/hero/nixos.png"
              alt="NixOS"
              width={64}
              height={64}
              className="size-full rounded-md object-cover object-center p-3"
              loading="lazy"
            />
          </div>
          <div className="absolute left-[calc(100%+234px)] top-[282px] hidden size-[64px] rounded-2xl bg-[#E83341] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <Image
              src="/images/hero/redhat.png"
              alt="Red Hat"
              width={64}
              height={64}
              className="size-full rounded-md object-cover object-center p-3"
              loading="lazy"
            />
          </div>
          <div className="absolute left-[calc(100%+112px)] top-[365px] hidden size-[64px] rounded-2xl bg-[#4962AE] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <Image
              src="/images/hero/slackware.png"
              alt="Slackware"
              width={64}
              height={64}
              className="size-full rounded-md object-cover object-center p-3"
              loading="lazy"
            />
          </div>
          {/* Hero images */}
          <div className="container mx-auto mt-12">
            <DiscordSkeleton />
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
