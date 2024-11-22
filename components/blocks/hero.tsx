/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
'use client';

import DiscordSkeleton from './discord-skeleton';

const Hero = () => {
  return (
    <section className="pb-32">
      <div className="container flex flex-col items-center text-center">
        <h1 className="mb-12 text-6xl font-bold lg:text-7xl  text-center">
          Let&apos;s build the future of Linux together
        </h1>
        <p className="max-w-4xl text-catppuccin-text/90 lg:text-2xl text-xl pb-4">
          All Things Linux is a 501(c)(3) non-profit organization with a mission
          to empower the Linux community through education, collaboration, and
          support.
        </p>
      </div>
      <div className="aspect-video text-clip sm:mt-16 md:aspect-auto md:h-[420px]">
        <div className="relative mx-auto flex max-w-3xl flex-col">
          {/* Left icons */}
          <div className="absolute right-[calc(100%+63px)] top-0 hidden size-[64px] rounded-2xl bg-[#4FAEC3] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <img
              src="/images/hero/arch.png"
              className="size-full rounded-md object-cover object-center p-3"
            />
          </div>
          <div className="absolute right-[calc(100%+195px)] top-[52px] hidden size-[64px] rounded-2xl bg-[#605191] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <img
              src="/images/hero/gentoo.png"
              className="size-full rounded-md object-cover object-center p-3"
            />
          </div>
          <div className="absolute right-[calc(100%+34px)] top-[144px] hidden size-[64px] rounded-2xl bg-[#8862ab] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <img
              src="/images/hero/bazzite.png"
              className="size-full rounded-md object-cover object-center p-3"
            />
          </div>
          <div className="absolute right-[calc(100%+268px)] top-[164px] hidden size-[64px] rounded-2xl bg-[#A82248] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <img
              src="/images/hero/debian.png"
              className="size-full rounded-md object-cover object-center p-3"
            />
          </div>
          <div className="absolute right-[calc(100%+156px)] top-[240px] hidden size-[64px] rounded-2xl bg-[#2B816F] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <img
              src="/images/hero/cachy.png"
              className="size-full rounded-md object-cover object-center p-3"
            />
          </div>
          <div className="absolute right-[calc(100%+242px)] top-[340px] hidden size-[64px] rounded-2xl bg-[#2988CC] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <img
              src="/images/hero/fedora.png"
              className="size-full rounded-md object-cover object-center p-3"
            />
          </div>
          <div className="absolute right-[calc(100%+66px)] top-[366px] hidden size-[64px] rounded-2xl bg-[#82C73C] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <img
              src="/images/hero/mint.png"
              className="size-full rounded-md object-cover object-center p-3"
            />
          </div>
          {/* Right icons */}
          <div className="absolute left-[calc(100%+53px)] top-0 hidden size-[64px] rounded-2xl bg-[#243742] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <img
              src="/images/hero/bedrock.png"
              className="size-full rounded-md object-cover object-center p-3"
            />
          </div>
          <div className="absolute left-[calc(100%+202px)] top-[34px] hidden size-[64px] rounded-2xl bg-[#B27180] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <img
              src="/images/hero/asahi.png"
              className="size-full rounded-md object-cover object-center p-3"
            />
          </div>
          <div className="absolute left-[calc(100%+97px)] top-[141px] hidden size-[64px] rounded-2xl bg-[#DD4814] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <img
              src="/images/hero/ubuntu.png"
              className="size-full rounded-md object-cover object-center p-3"
            />
          </div>
          <div className="absolute left-[calc(100%+282px)] top-[138px] hidden size-[64px] rounded-2xl bg-[#30BA78] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <img
              src="/images/hero/opensuse.png"
              className="size-full rounded-md object-cover object-center p-3"
            />
          </div>
          <div className="absolute left-[calc(100%+42px)] top-[262px] hidden size-[64px] rounded-2xl bg-[#4F73BC] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <img
              src="/images/hero/nixos.png"
              className="size-full rounded-md object-cover object-center p-3"
            />
          </div>
          <div className="absolute left-[calc(100%+234px)] top-[282px] hidden size-[64px] rounded-2xl bg-[#E83341] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <img
              src="/images/hero/redhat.png"
              className="size-full rounded-md object-cover object-center p-3"
            />
          </div>
          <div className="absolute left-[calc(100%+112px)] top-[365px] hidden size-[64px] rounded-2xl bg-[#4962AE] ring-1 ring-inset ring-accent-foreground/10 md:block">
            <img
              src="/images/hero/slackware.png"
              className="size-full rounded-md object-cover object-center p-3"
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
};

export default Hero;
