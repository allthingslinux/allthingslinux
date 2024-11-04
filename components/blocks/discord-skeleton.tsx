'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Hash, ChevronRight } from 'lucide-react';

export default function DiscordSkeleton() {
  return (
    <Card className="w-full max-w-3xl mx-auto bg-[#36393f] text-white shadow-lg overflow-hidden">
      <div className="relative">
        {/* Skeleton UI effect */}
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full flex flex-col justify-between p-6">
            
            {[ ...Array(8) ].map((_, i) => (
              <div key={`skeleton-${i}`} className="flex space-x-2">
                <div
                  className="h-4 bg-[#36393F] rounded-full"
                  style={{ width: `${Math.random() * 30 + 10}%` }}></div>
                <div
                  className="h-4 bg-[#120E1C]/10 rounded-full"
                  style={{ width: `${Math.random() * 40 + 20}%` }}></div>
                <div
                  className="h-4 bg-[#1A1B26]/10 rounded-full"
                  style={{ width: `${Math.random() * 20 + 5}%` }}></div>
              </div>
            ))}

          </div>
        </div>

        {/* Main content */}
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
                    className="flex items-center text-[#8e9297] hover:text-white py-1">
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
          <div className="flex-grow p-4 flex items-center justify-center">
            <CardContent className="text-center w-full max-w-xs">
              <div className="flex flex-col items-center space-y-4 mb-8">
                <div className="bg-[#2F3136] p-3 rounded-full w-16 h-16 flex items-center justify-center">
                  <img
                    src="images/tux.gif"
                    alt="Discord Logo"
                    className="w-10 h-10"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">All Things Linux</h2>
                  <p className="text-[#b9bbbe]">discord.gg/linux</p>
                </div>
              </div>
              <div className="mb-6 flex items-center justify-center space-x-2 text-[#b9bbbe]">
                <Users className="w-5 h-5" />
                <Badge
                  variant="outline"
                  className="bg-[#3ba55c] text-white px-2 py-1 rounded-full text-xs">
                  1,337+ online
                </Badge>
              </div>
              <Button className="w-full bg-[#5865F2] hover:bg-[#EB459E] text-white transition-colors text-sm font-semibold py-6 rounded">
                Join the Server
              </Button>
            </CardContent>
          </div>
        </div>
      </div>
    </Card>
  );
}
