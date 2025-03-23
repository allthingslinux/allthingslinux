'use client';

import AutoScroll from 'embla-carousel-auto-scroll';
import { useRef, memo } from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import testimonalsData from '@/data/testimonials.json';

const reviews = testimonalsData.testimonials;
const avatars = Array.from({ length: 15 }, (_, i) => i + 1);

export const ReviewCard = memo(
  ({
    avatar,
    name,
    content,
    onMouseEnter,
    onMouseLeave,
  }: {
    avatar: string;
    name: string;
    content: string;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  }) => {
    return (
      <Card
        className="max-w-96 select-none bg-card p-6"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-14 rounded-full ring-1 ring-input">
              <AvatarImage loading="lazy" src={avatar} alt={name} />
            </Avatar>
            <div>
              <p className="font-large text-foreground">{name}</p>
            </div>
          </div>
        </div>
        <q className="text-card-foreground text-balance leading-7">{content}</q>
      </Card>
    );
  }
);

ReviewCard.displayName = 'ReviewCard';

export default function Testimonials() {
  const plugin = useRef(
    AutoScroll({
      startDelay: 0,
      speed: 1.0,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  return (
    <section className="py-32">
      <div className="container mb-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
            See what our members are saying
          </h2>
          <p className="text-lg text-muted-foreground">
            Join our growing community of Linux enthusiasts and discover why
            they love being part of our network.
          </p>
        </div>
      </div>

      <div className="w-full overflow-hidden">
        <Carousel
          opts={{
            loop: true,
            align: 'start',
            containScroll: false,
          }}
          plugins={[plugin.current]}
        >
          <CarouselContent className="-ml-4 px-4">
            {[...reviews, ...reviews].map((review, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-[400px]">
                <ReviewCard
                  avatar={`/images/penguins/${avatars[index % avatars.length]}.svg`}
                  {...review}
                  onMouseEnter={() => plugin.current.stop()}
                  onMouseLeave={() => plugin.current.play()}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
