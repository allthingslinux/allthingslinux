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
    icon: <TbWritingSign className="size-14 text-teal-600" />,
    link: 'https://atl.wiki',
  },
  {
    title: '.gg/linux',
    description:
      'Our Discord server is the heart of our community and growing every day.',
    icon: <TbBrandDiscord className="size-14 text-purple-500" />,
    link: 'https://discord.gg/linux',
  },
  {
    title: 'atl.tools',
    description:
      'Self-hosted applications, services and email, always free. More coming soon!',
    icon: <TbStack2 className="size-14 text-rose-400" />,
    link: 'https://atl.tools',
  },
  {
    title: 'atl.chat',
    description:
      'Chat with the community via other platforms like IRC or Signal. XMPP coming soon.',
    icon: <TbMessage2 className="size-14 text-sky-500" />,
    link: 'https://atl.chat',
  },
  {
    title: 'tux',
    description:
      'Tux is an all in one Discord bot that powers our community. Currently in beta.',
    icon: <PiLinuxLogoBold className="size-14 text-orange-300" />,
    link: 'https://tux.atl.tools',
  },
  {
    title: 'atl.dev',
    description:
      'Our pubnix and hosting platform for developers. In development.',
    icon: <TbCloud className="size-14 text-blue-200" />,
    link: '#',
  },
];

// Project card component
const ProjectCard = ({ project }: { project: (typeof projects)[0] }) => {
  const isExternalLink = project.link.startsWith('http');

  const cardContent = (
    <>
      <div className="flex items-center justify-center mb-4">
        {project.icon}
      </div>
      <div>
        <p className="mb-3 text-2xl text-foreground font-semibold text-center">
          {project.title}
        </p>
        <p className="text-muted-foreground text-center">
          {project.description}
        </p>
      </div>
    </>
  );

  return project.link === '#' ? (
    <Card className="bg-card p-8 cursor-not-allowed opacity-80 border-2 border-transparent">
      {cardContent}
    </Card>
  ) : (
    <Link
      href={project.link}
      target={isExternalLink ? '_blank' : undefined}
      rel={isExternalLink ? 'noopener noreferrer' : undefined}
      className="block transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
    >
      <Card className="bg-card p-8 h-full hover:shadow-md transition-all border-2 border-transparent hover:border-primary/70">
        {cardContent}
      </Card>
    </Link>
  );
};

const Projects = memo(() => {
  return (
    <section className="py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mx-auto max-w-2xl mb-16">
          <h2 className="lg:text-4xl md:text-3xl text-2xl font-semibold mb-6">
            Explore our Ecosystem
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            As our organization grows, we continue to develop new and exciting
            projects through community collaboration. We have many initiatives
            in progress and welcome your contributions!
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
