import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Hash, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function DiscordSkeleton() {
  return (
    <>
      <Card className="w-full max-w-3xl mx-auto bg-[#36393f] text-catppuccin-text shadow-lg overflow-hidden">
        <div className="relative z-10 flex">
          {/* Mock channel list */}
          <div className="w-56 bg-[#2f3136] p-4 hidden sm:block">
            <div>
              <h3 className="text-[#8e9297] font-semibold mb-2 uppercase text-xs tracking-wide">
                Text Channels
              </h3>
              <div className="space-y-1">
                {[
                  'announcements',
                  'suggestions',
                  'general',
                  'support',
                  'random',
                  'programming',
                  'bsd/unix',
                  'showcase',
                ].map((channel) => (
                  <div
                    key={channel}
                    className="flex items-center text-[#8e9297] hover:text-catppuccin-text py-1">
                    <Hash className="w-4 h-4 mr-2 opacity-70" />
                    <span className="text-sm">{channel}</span>
                  </div>
                ))}
                <div className="flex items-center text-[#8e9297] hover:text-white cursor-pointer mt-3">
                  <ChevronRight className="w-4 h-4 mr-1" />
                  <span className="text-sm">plus many more!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Central content */}
          <div className="flex-grow p-4">
            <div className="relative">
              {/* Skeleton messages in the background */}
              <div className="absolute inset-0 space-y-4">
                {/* Section 1 - Short messages */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-10 h-10 rounded-full bg-[#2f3136]" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[120px] bg-[#2f3136]" />
                      <Skeleton className="h-4 w-[180px] bg-[#2f3136]" />
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-10 h-10 rounded-full bg-[#2f3136]" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[140px] bg-[#2f3136]" />
                      <Skeleton className="h-4 w-[160px] bg-[#2f3136]" />
                    </div>
                  </div>
                </div>

                {/* Section 2 - Code block-like message */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-10 h-10 rounded-full bg-[#2f3136]" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[160px] bg-[#2f3136]" />
                      <Skeleton className="h-24 w-full bg-[#2f3136]" />
                    </div>
                  </div>
                </div>

                {/* Section 3 - Long message */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-10 h-10 rounded-full bg-[#2f3136]" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[180px] bg-[#2f3136]" />
                      <Skeleton className="h-4 w-[320px] bg-[#2f3136]" />
                      <Skeleton className="h-4 w-[280px] bg-[#2f3136]" />
                    </div>
                  </div>
                </div>

                {/* Section 4 - Short message */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-10 h-10 rounded-full bg-[#2f3136]" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[140px] bg-[#2f3136]" />
                      <Skeleton className="h-4 w-[200px] bg-[#2f3136]" />
                    </div>
                  </div>
                </div>

                {/* Section 5 - Image-like message */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Skeleton className="w-10 h-10 rounded-full bg-[#2f3136]" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[160px] bg-[#2f3136]" />
                      <Skeleton className="h-32 w-48 bg-[#2f3136]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <CardContent className="text-center w-full max-w-xs mx-auto relative z-10">
                <div className="flex flex-col items-center space-y-4 mb-8">
                  <div className="bg-catppuccin-base rounded-full w-16 h-16 flex items-center justify-center">
                    <Image
                      src="/images/tux.gif"
                      alt="Tux the penguin"
                      width={40}
                      height={40}
                      className="w-10 h-10"
                    />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-catppuccin-text pb-4">
                      All Things Linux
                    </h2>
                    <p className="text-catppuccin-subtext0">discord.gg/linux</p>
                  </div>
                </div>

                <div className="mb-6 flex items-center justify-center space-x-2 text-catppuccin-text">
                  <Users className="w-5 h-5 text-catppuccin-text" />
                  <Badge
                    variant="outline"
                    className="bg-[#43b581]/60 text-catppuccin-text font-semibold px-4 py-1 rounded-full border-0 text-xs">
                    1,337+ online
                  </Badge>
                </div>
                <Link href="https://discord.gg/linux" passHref>
                  <Button className="w-full bg-[#5865F2] hover:bg-[#EB459E] text-white transition-colors font-semibold py-5 mt-3 rounded-2xl">
                    Join Server
                  </Button>
                </Link>
              </CardContent>
            </div>
          </div>
        </div>
      </Card>
      <p className=" text-center text-balance text-catppuccin-text/70 text-xl py-8">
        Make new friends, share your knowledge and learn from the biggest Linux
        community on Discord.
      </p>
    </>
  );
}
