// 'use client';

// import AutoScroll from 'embla-carousel-auto-scroll';
// import { useRef } from 'react';

// import { Avatar, AvatarImage } from '@/components/ui/avatar';
// import { Card } from '@/components/ui/card';
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
// } from '@/components/ui/carousel';

// import testimonialsData from '@/data/testimonials.json';

// const Testimonials = () => {
//   const plugin1 = useRef(
//     AutoScroll({
//       startDelay: 500,
//       speed: 0.7,
//     })
//   );

//   const plugin2 = useRef(
//     AutoScroll({
//       startDelay: 500,
//       speed: 0.7,
//       direction: 'backward',
//     })
//   );

//   const { testimonials1, testimonials2 } = testimonialsData;

//   return (
//     <section className="w-full py-32 bg-[#111827]">
//       <div className="flex flex-col items-center gap-8 px-4">
//         <h2 className="mb-2 text-center text-3xl font-semibold lg:text-5xl">
//           See what our members are saying
//         </h2>
//       </div>
//       <div className="w-full">
//         <div className="mt-16 space-y-8">
//           {[testimonials1, testimonials2].map((testimonials, rowIndex) => (
//             <div key={rowIndex} className="relative overflow-hidden">
//               <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#111827] via-[#111827] to-transparent z-10 pointer-events-none" />
//               <Carousel
//                 opts={{
//                   loop: true,
//                 }}
//                 plugins={[rowIndex === 0 ? plugin1.current : plugin2.current]}
//                 onMouseLeave={() => (rowIndex === 0 ? plugin1.current.play() : plugin2.current.play())}
//                 className="overflow-visible"
//               >
//                 <CarouselContent className="-ml-2 md:-ml-4">
//                   {testimonials.map((testimonial, index) => (
//                     <CarouselItem key={index} className="pl-2 md:pl-4 basis-auto">
//                       <Card className="relative z-20 max-w-96 select-none p-6 bg-[#111827] border border-white-700 shadow-md">
//                         <div className="mb-4 flex gap-4">
//                           <Avatar className="size-9 rounded-full ring-1 ring-input">
//                             <AvatarImage
//                               src={testimonial.avatar}
//                               alt={testimonial.name}
//                             />
//                           </Avatar>
//                           <div className="text-sm">
//                             <p className="font-medium text-primary-foreground">{testimonial.name}</p>
//                           </div>
//                         </div>
//                         <q className="text-muted-foreground">{testimonial.content}</q>
//                       </Card>
//                     </CarouselItem>
//                   ))}
//                 </CarouselContent>
//               </Carousel>
//               <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#111827] via-[#111827] to-transparent z-10 pointer-events-none" />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Testimonials;

import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";
import { DotPattern } from "@/components/ui/dot-pattern";
import GridPattern from "@/components/ui/grid-pattern";

import testimonalsData from "@/data/testimonials.json";

const reviews = testimonalsData.testimonials;


const ReviewCard = ({
  avatar,
  name,
  content,
}: {
  avatar: string;
  name: string;
  content: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-96 cursor-pointer overflow-hidden rounded-xl border p-4 bg-[#16161E]",
      )}
    >
      <div className="flex flex-row items-center gap-2 mb-3">
        <img width="32" height="32" alt="" src={avatar} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium">
            {name}
          </figcaption>
        </div>
      </div>
      <q className="mt-2 text-sm">{content}</q>
    </figure>
  );
};


export default function Testimonials() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-[#1A1B26] md:shadow-xl">
         <h2 className="mb-10 text-center text-4xl font-semibold">
           See what our members are saying
         </h2>
      <Marquee pauseOnHover className="[--duration:20s]">
        {reviews.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>

    </div>
  );
}