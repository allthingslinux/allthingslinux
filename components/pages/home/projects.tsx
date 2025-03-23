import { memo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import {
  TbBrandDiscord,
  TbCloud,
  TbMessage2,
  TbStack2,
  TbWritingSign,
} from 'react-icons/tb';

import { PiLinuxLogoBold } from 'react-icons/pi';

const projects = [
  {
    title: 'atl.wiki',
    description:
      'A wiki designed with beginners in mind, but useful for all. Come contribute!',
    icon: (
      <TbWritingSign className="size-8 sm:size-10 md:size-12 text-teal-600" />
    ),
    link: 'https://atl.wiki',
  },
  {
    title: '.gg/linux',
    description:
      'Our Discord server is the heart of our community and growing every day.',
    icon: (
      <TbBrandDiscord className="size-8 sm:size-10 md:size-12 text-purple-500" />
    ),
    link: 'https://discord.gg/linux',
  },
  {
    title: 'atl.tools',
    description:
      'Self-hosted applications, services and email, always free. More coming soon!',
    icon: <TbStack2 className="size-8 sm:size-10 md:size-12 text-rose-400" />,
    link: 'https://atl.tools',
  },
  {
    title: 'atl.chat',
    description:
      'Chat with the community via other platforms like IRC or Signal. XMPP coming soon.',
    icon: <TbMessage2 className="size-8 sm:size-10 md:size-12 text-sky-500" />,
    link: 'https://atl.chat',
  },
  {
    title: 'tux',
    description:
      'Tux is an all in one Discord bot that powers our community. Currently in beta.',
    icon: (
      <PiLinuxLogoBold className="size-8 sm:size-10 md:size-12 text-orange-300" />
    ),
    link: 'https://tux.atl.tools',
  },
  {
    title: 'atl.dev',
    description:
      'Our pubnix and hosting platform for developers. In development.',
    icon: <TbCloud className="size-8 sm:size-10 md:size-12 text-blue-200" />,
    link: '#',
  },
];

// Project card component
const ProjectCard = ({ project }: { project: (typeof projects)[0] }) => {
  const isExternalLink = project.link.startsWith('http');

  const cardContent = (
    <>
      <div className="flex items-center justify-center mb-3 sm:mb-4">
        {project.icon}
      </div>
      <div>
        <h3 className="mb-2 text-lg sm:text-xl font-semibold text-center">
          {project.title}
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-center">
          {project.description}
        </p>
      </div>
    </>
  );

  return project.link === '#' ? (
    <Card className="bg-card p-3 sm:p-4 md:p-6 h-full cursor-not-allowed opacity-80 border border-transparent">
      {cardContent}
    </Card>
  ) : (
    <Link
      href={project.link}
      target={isExternalLink ? '_blank' : undefined}
      rel={isExternalLink ? 'noopener noreferrer' : undefined}
      className="block transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
    >
      <Card className="bg-card p-3 sm:p-4 md:p-6 h-full hover:shadow-sm transition-all border border-transparent hover:border-primary/30">
        {cardContent}
      </Card>
    </Link>
  );
};

const Projects = memo(() => {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-7xl">
        <div className="text-center mx-auto max-w-2xl mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mb-3 sm:mb-4 md:mb-6">
            Explore our ecosystem
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            As our organization grows, we continue to develop new and exciting
            projects through community collaboration. We have many initiatives
            in progress and welcome your contributions!
          </p>
        </div>

        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
});

Projects.displayName = 'Projects';

export default Projects;
