import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Marquee from '@/components/ui/marquee';
import { cn } from '@/lib/utils';

import testimonalsData from '@/data/testimonials.json';

const reviews = testimonalsData.testimonials;

const shuffleArray = <T,>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Generate a shuffled array of avatar numbers
const avatars = shuffleArray(Array.from({ length: 15 }, (_, i) => i + 1));

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
        'relative w-[32rem] cursor-pointer overflow-hidden rounded-2xl border p-4 bg-catppuccin-crust',
      )}>
      <div className="flex flex-row items-center gap-4 mb-4">
        <Avatar className="size-9 rounded-full">
          <AvatarImage src={avatar} alt={name} />
        </Avatar>
        <div className="flex flex-col">
          <figcaption className="font-medium">{name}</figcaption>
        </div>
      </div>
      <q className="text-sm text-balance tracking-tight">{content}</q>
    </figure>
  );
};

export default function Testimonials() {
  return (
    <div className="relative flex h-[500px] max-w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-catppuccin-mantle md:shadow-xl">
      <h2 className="mb-10 text-center text-2xl md:text-4xl lg:text-5xl font-semibold">
        See what our members are saying
      </h2>
      <Marquee pauseOnHover className="[--duration:90s]">
        {reviews.map((review, index) => (
          <ReviewCard
            key={review.name}
            avatar={`/images/penguins/${avatars[index]}.svg`}
            {...review}
          />
        ))}
      </Marquee>
    </div>
  );
}
