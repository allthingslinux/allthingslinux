import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Hash, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Channel list component
const ChannelList = memo(() => {
  const channels = [
    'announcements',
    'suggestions',
    'general',
    'forum',
    'support',
    'random',
    'programming',
    'projects',
  ];

  return (
    <div className="w-56 bg-[#2f3136] p-4 hidden sm:block">
      <div>
        <h3 className="text-[#8e9297] font-semibold mb-2 uppercase text-xs tracking-wide">
          Text Channels
        </h3>
        <div className="space-y-1">
          {channels.map((channel) => (
            <ChannelItem key={channel} name={channel} />
          ))}
          <div className="flex items-center text-[#8e9297] hover:text-foreground cursor-pointer mt-3">
            <ChevronRight className="w-4 h-4 mr-1" />
            <span className="text-sm">plus many more!</span>
          </div>
        </div>
      </div>
    </div>
  );
});

// Individual channel item
const ChannelItem = memo(({ name }: { name: string }) => (
  <div className="flex items-center text-[#8e9297] hover:text-foreground py-1">
    <Hash className="w-4 h-4 mr-2 opacity-70" />
    <span className="text-sm">{name}</span>
  </div>
));

// Message skeleton component
const MessageSkeleton = memo(
  ({
    avatarSize = 10,
    contentConfig,
  }: {
    avatarSize?: number;
    contentConfig: Array<{ height: number; width: string }>;
  }) => (
    <div className="flex items-start space-x-4">
      <Skeleton
        className={`w-${avatarSize} h-${avatarSize} rounded-full bg-[#2f3136]`}
      />
      <div className="space-y-2 flex-1">
        {contentConfig.map((config, index) => (
          <Skeleton
            key={index}
            className={`h-${config.height} ${config.width} bg-[#2f3136]`}
          />
        ))}
      </div>
    </div>
  )
);

// Background messages component
const BackgroundMessages = memo(() => (
  <div className="absolute inset-0 space-y-4">
    {/* Section 1 - Short messages */}
    <div className="space-y-4">
      <MessageSkeleton
        contentConfig={[
          { height: 4, width: 'w-[120px]' },
          { height: 4, width: 'w-[180px]' },
        ]}
      />
      <MessageSkeleton
        contentConfig={[
          { height: 4, width: 'w-[140px]' },
          { height: 4, width: 'w-[160px]' },
        ]}
      />
    </div>

    {/* Section 2 - Code block-like message */}
    <div className="space-y-4">
      <MessageSkeleton
        contentConfig={[
          { height: 4, width: 'w-[160px]' },
          { height: 24, width: 'w-full' },
        ]}
      />
    </div>

    {/* Section 3 - Long message */}
    <div className="space-y-4">
      <MessageSkeleton
        contentConfig={[
          { height: 4, width: 'w-[180px]' },
          { height: 4, width: 'w-[320px]' },
          { height: 4, width: 'w-[280px]' },
        ]}
      />
    </div>

    {/* Section 4 - Short message */}
    <div className="space-y-4">
      <MessageSkeleton
        contentConfig={[
          { height: 4, width: 'w-[140px]' },
          { height: 4, width: 'w-[200px]' },
        ]}
      />
    </div>

    {/* Section 5 - Image-like message */}
    <div className="space-y-4">
      <MessageSkeleton
        contentConfig={[
          { height: 4, width: 'w-[160px]' },
          { height: 32, width: 'w-48' },
        ]}
      />
    </div>
  </div>
));

// Server info component
const ServerInfo = memo(() => (
  <div className="flex flex-col items-center space-y-4 mb-8">
    <div className="bg-accent rounded-full w-16 h-16 flex items-center justify-center">
      <Image
        src="/images/tux.gif"
        alt="Tux the penguin"
        width={40}
        height={40}
        className="w-10 h-10"
        priority
      />
    </div>

    <div>
      <h2 className="text-2xl font-bold text-foreground pb-4">
        All Things Linux
      </h2>
      <p className="text-foreground">discord.gg/linux</p>
    </div>
  </div>
));

// Online status component
const OnlineStatus = memo(() => (
  <div className="mb-6 flex items-center justify-center space-x-2 text-foreground">
    <Users className="w-6 h-6 text-foreground" />
    <Badge
      variant="outline"
      className="bg-[#43b581]/60 text-foreground font-semibold px-4 py-1.5 rounded-full border-0 text-xs"
    >
      1337+ online
    </Badge>
  </div>
));

// Join button component
const JoinButton = memo(() => (
  <Link href="https://discord.gg/linux" passHref>
    <Button className="w-full bg-[#5865F2] hover:bg-[#EB459E] hover:scale-105 text-foreground transition-all font-bold py-5 mt-3 rounded-2xl">
      Join Server
    </Button>
  </Link>
));

// Main content component
const MainContent = memo(() => (
  <CardContent className="text-center w-full max-w-xs mx-auto relative z-10">
    <ServerInfo />
    <OnlineStatus />
    <JoinButton />
  </CardContent>
));

// Central content area component
const CentralContent = memo(() => (
  <div className="grow p-4">
    <div className="relative">
      <BackgroundMessages />
      <MainContent />
    </div>
  </div>
));

// Description component
const Description = memo(() => (
  <p className="text-center text-balance text-muted-foreground text-xl py-8">
    Make new friends, share your knowledge and learn from the biggest Linux
    community on Discord.
  </p>
));

// Main Discord skeleton component
const DiscordSkeleton = memo(() => {
  return (
    <>
      <Card className="w-full max-w-3xl mx-auto bg-[#36393f] text-foreground shadow-lg overflow-hidden">
        <div className="relative z-10 flex">
          <ChannelList />
          <CentralContent />
        </div>
      </Card>
      <Description />
    </>
  );
});

// Add display names for all components
ChannelList.displayName = 'ChannelList';
ChannelItem.displayName = 'ChannelItem';
MessageSkeleton.displayName = 'MessageSkeleton';
BackgroundMessages.displayName = 'BackgroundMessages';
ServerInfo.displayName = 'ServerInfo';
OnlineStatus.displayName = 'OnlineStatus';
JoinButton.displayName = 'JoinButton';
MainContent.displayName = 'MainContent';
CentralContent.displayName = 'CentralContent';
Description.displayName = 'Description';
DiscordSkeleton.displayName = 'DiscordSkeleton';

export default DiscordSkeleton;
