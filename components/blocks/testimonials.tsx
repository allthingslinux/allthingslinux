// import { Avatar, AvatarImage } from '@/components/ui/avatar';
// import Marquee from '@/components/ui/marquee';
// import { cn } from '@/lib/utils';

// import testimonalsData from '@/data/testimonials.json';

// const reviews = testimonalsData.testimonials;

// const shuffleArray = <T,>(array: T[]): T[] => {
//   for (let i = array.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [array[i], array[j]] = [array[j], array[i]];
//   }
//   return array;
// };

// // Generate a shuffled array of avatar numbers
// const avatars = shuffleArray(Array.from({ length: 15 }, (_, i) => i + 1));

// const ReviewCard = ({
//   avatar,
//   name,
//   content,
// }: {
//   avatar: string;
//   name: string;
//   content: string;
// }) => {
//   return (
//     <figure
//       className={cn(
//         'relative w-[32rem] cursor-pointer overflow-hidden rounded-2xl border p-4 bg-catppuccin-crust',
//       )}>
//       <div className="flex flex-row items-center gap-4 mb-4">
//         <Avatar className="size-9 rounded-full">
//           <AvatarImage src={avatar} alt={name} />
//         </Avatar>
//         <div className="flex flex-col">
//           <figcaption className="font-medium">{name}</figcaption>
//         </div>
//       </div>
//       <q className="text-sm text-balance tracking-tight">{content}</q>
//     </figure>
//   );
// };

// export default function Testimonials() {
//   return (
//     <div className="relative flex h-[500px] max-w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-catppuccin-mantle md:shadow-xl">
//       <h2 className="mb-10 text-center text-2xl md:text-4xl lg:text-5xl font-semibold">
//         See what our members are saying
//       </h2>
//       <Marquee pauseOnHover className="[--duration:100s]">
//         {reviews.map((review, index) => (
//           <ReviewCard
//             key={review.name}
//             avatar={`/images/penguins/${avatars[index]}.svg`}
//             {...review}
//           />
//         ))}
//       </Marquee>
//     </div>
//   );
// }


'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import Marquee from '@/components/ui/marquee'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

import testimonalsData from '@/data/testimonials.json'

const reviews = testimonalsData.testimonials

const shuffleArray = <T,>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// Generate a shuffled array of avatar numbers
const avatars = shuffleArray(Array.from({ length: 15 }, (_, i) => i + 1))

const ReviewCard = ({
  avatar,
  name,
  content,
}: {
  avatar: string
  name: string
  content: string
}) => {
  return (
    <figure className={cn(
      'relative w-full sm:w-[24rem] cursor-pointer overflow-hidden rounded-2xl border p-4 bg-catppuccin-crust'
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
  )
}

export default function Testimonials() {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth < 640)
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const handlePrevReview = () => {
    setCurrentReviewIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    )
  }

  const handleNextReview = () => {
    setCurrentReviewIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    )
  }

  return (
    <div className="relative flex min-h-[300px] md:min-h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-catppuccin-mantle p-4 md:shadow-xl">
      <h2 className="mb-6 text-center text-3xl md:text-4xl lg:text-4xl font-semibold">
        See what our members are saying
      </h2>
      {isMobile ? (
        <div className="w-full max-w-sm">
          <ReviewCard
            key={reviews[currentReviewIndex].name}
            avatar={`/images/penguins/${avatars[currentReviewIndex]}.svg`}
            {...reviews[currentReviewIndex]}
          />
          <div className="flex justify-between mt-4">
            <Button onClick={handlePrevReview} variant="outline" size="lg">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button onClick={handleNextReview} variant="outline" size="lg">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Marquee pauseOnHover className="[--duration:100s] [--gap:1rem]">
          {reviews.map((review, index) => (
            <ReviewCard
              key={review.name}
              avatar={`/images/penguins/${avatars[index]}.svg`}
              {...review}
            />
          ))}
        </Marquee>
      )}
    </div>
  )
}