/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
'use client';

import Image from 'next/image';

import arch from '@/public/images/hero/arch.png';
import gentoo from '@/public/images/hero/gentoo.png';
import bazzite from '@/public/images/hero/bazzite.png';
import debian from '@/public/images/hero/debian.png';
import cachy from '@/public/images/hero/cachy.png';
import fedora from '@/public/images/hero/fedora.png';
import mint from '@/public/images/hero/mint.png';
import nixos from '@/public/images/hero/nixos.png';
import opensuse from '@/public/images/hero/opensuse.png';
import popos from '@/public/images/hero/popos.png';
import redhat from '@/public/images/hero/redhat.png';
import slackware from '@/public/images/hero/slackware.png';
import ubuntu from '@/public/images/hero/ubuntu.png';
import bedrock from '@/public/images/hero/bedrock.png';
import asahi from '@/public/images/hero/asahi.png';

import { Button } from '@/components/ui/button';
import DiscordSkeleton from './discord-skeleton';

// const integrations = [
//   [
//     {
//       id: 'arch-1',
//       icon: <Image src={arch} alt="arch" />,
//     },
//     {
//       id: 'gentoo-2',
//       icon: <Image src={gentoo} alt="gentoo" />,
//     },
//     {
//       id: 'bazzite-3',
//       icon: <Image src={bazzite} alt="bazzite" />,
//     },
//     {
//       id: 'debian-4',
//       icon: <Image src={debian} alt="debian" />,
//     },
//     {
//       id: 'cachy-5',
//       icon: <Image src={cachy} alt="cachy" />,
//     },
//   ],
//   [
//     {
//       id: 'fedora-6',
//       icon: <Image src={fedora} alt="fedora" />,
//     },
//     {
//       id: 'mint-7',
//       icon: <Image src={mint} alt="mint" />,
//     },
//     {
//       id: 'nixos-8',
//       icon: <Image src={nixos} alt="nixos" />,
//     },
//     {
//       id: 'opensuse-9',
//       icon: <Image src={opensuse} alt="opensuse" />,
//     },
//     {
//       id: 'popos-10',
//       icon: <Image src={popos} alt="popos" />,
//     },
//   ],
//   [
//     {
//       id: 'redhat-11',
//       icon: <Image src={redhat} alt="redhat" />,
//     },
//     {
//       id: 'slackware-12',
//       icon: <Image src={slackware} alt="slackware" />,
//     },
//     {
//       id: 'ubuntu-13',
//       icon: <Image src={ubuntu} alt="ubuntu" />,
//     },
//     {
//       id: 'bedrock-14',
//       icon: <Image src={bedrock} alt="bedrock" />,
//     },
//     {
//       id: 'asahi-15',
//       icon: <Image src={asahi} alt="asahi" />,
//     },
//   ],
// ];

// const Hero = () => {
//   return (
//     <section className="relative overflow-hidden">
//       <div className="absolute inset-0 overflow-hidden">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           viewBox="0 0 1400 600"
//           className="min-h-full min-w-full"
//         >
//           <defs>
//             <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
//               <path
//                 d="M 24 0 L 0 0 0 24"
//                 fill="none"
//                 stroke="hsl(var(--muted))"
//                 strokeWidth="1"
//                 strokeOpacity={0.2}
//               />
//             </pattern>
//           </defs>
//           <rect width="1400" height="600" fill="url(#grid)" />
//         </svg>
//       </div>
//       <div className="relative">
//         <div className="absolute left-0 z-10 hidden h-full w-1/2 bg-[linear-gradient(to_right,hsl(var(--background))_85%,transparent_100%)] md:block"></div>
//         <div className="md:-space-x-26 container relative flex flex-col items-start md:flex-row md:items-center">
//           <div className="z-20 -mx-[calc(theme(container.padding))] w-[calc(100%+2*theme(container.padding))] shrink-0 bg-background px-[calc(theme(container.padding))] pt-32 md:w-1/2 md:bg-transparent md:pb-32">
//             <div className="flex flex-col items-start text-left">
//               <div className="max-w-sm mx-8">
//                 <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
//                   Your Linux Journey Starts Here
//                 </h1>
//                 {/* <Button>Join our community</Button> */}
//               </div>
//             </div>
//           </div>
//           <div>
//             <div className="flex flex-col gap-16 pb-8 pt-12 md:py-32">
//               {integrations.map((line, i) => (
//                 <div key={i} className="flex gap-x-24 odd:-translate-x-24">
//                   {line.map((integration) => (
//                     <div
//                       key={integration.id}
//                       className="size-24 rounded-xl border border-background bg-[#1A1B26]/80"
//                     >
//                       <div className="size-full p-4">{integration.icon}</div>
//                     </div>
//                   ))}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;
import WidgetBot from '@widgetbot/react-embed';
import RetroGrid from '@/components/ui/retro-grid';

const Hero = () => {
  return (
    <section className="pb-32">
      <div className="container flex flex-col items-center text-center">
        <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
          Let's build the future of Linux together
        </h1>
        <p className="mb-2 max-w-3xl text-muted-foreground lg:text-2xl">
          Make new friends, share your knowledge and learn from the biggest
          Linux community on Discord.
        </p>
      </div>
      <div className="mt-12 aspect-video text-clip sm:mt-32 md:aspect-auto md:h-[420px]">
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
          <div className="container mx-auto">
            <DiscordSkeleton />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
