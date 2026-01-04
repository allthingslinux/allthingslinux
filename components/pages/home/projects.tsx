import { memo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TbBrandDiscord,
  TbMessage2,
  TbStack2,
  TbFiles,
  TbCode,
  TbUserCircle,
  TbWritingSign,
} from 'react-icons/tb';


import { PiNetworkBold } from 'react-icons/pi';

import { PiLinuxLogoBold } from 'react-icons/pi';

type ProjectStatus = 'active' | 'beta' | 'development' | 'paused' | string | null;

const projects = [
  {
    title: 'atl.wiki',
    description:
      'Easy to use guides and references for the Linux and FOSS ecosystem.',
    icon: (
      <TbWritingSign className="size-8 sm:size-10 md:size-12 text-teal-600" />
    ),
    link: 'https://atl.wiki',
    status: 'v1.1' as ProjectStatus,
  },
  {
    title: '.gg/linux',
    description:
      'Our official Discord server, the heart of our community, growing by the day.',
    icon: (
      <TbBrandDiscord className="size-8 sm:size-10 md:size-12 text-purple-500" />
    ),
    link: 'https://discord.gg/linux',
    status: 'active' as ProjectStatus,
  },
  {
    title: 'atl.tools',
    description:
      'Self-hosted applications, services and mail, always free - more coming soon!',
    icon: <TbStack2 className="size-8 sm:size-10 md:size-12 text-rose-400" />,
    link: 'https://atl.tools',
    status: 'beta' as ProjectStatus,
  },
  {
    title: 'atl.chat',
    description:
      'Chat with the community via our bridged IRC and XMPP servers.',
    icon: <TbMessage2 className="size-8 sm:size-10 md:size-12 text-sky-500" />,
    link: 'https://github.com/allthingslinux/atl.chat',
    status: 'coming soon' as ProjectStatus,
  },
  {
    title: 'tux',
    description:
      'Tux is the all-in-one open source Discord bot that powers our community.',
    icon: (
      <PiLinuxLogoBold className="size-8 sm:size-10 md:size-12 text-orange-300" />
    ),
    link: 'https://github.com/allthingslinux/tux',
    status: 'v0.1.0-rc.5' as ProjectStatus,
  },
  {
    title: 'atl.sh',
    description:
      'Our pubnix/tilde services to facilitate free experimentation and learning.',
    icon: <PiNetworkBold className="size-8 sm:size-10 md:size-12 text-gray-400" />,
    link: '#',
    status: 'development' as ProjectStatus,
  },
  {
    title: 'portal',
    description:
      'Centralized hub and identity provider for all things, All Things Linux.',
    icon: <TbUserCircle className="size-8 sm:size-10 md:size-12 text-blue-400" />,
    link: 'https://github.com/allthingslinux/portal',
    status: 'coming soon' as ProjectStatus,
  },
    {
    title: 'atl.dev',
    description:
      'Hosting, version control, storage and more for developers and FOSS projects.',
    icon: <TbCode className="size-8 sm:size-10 md:size-12 text-green-300" />,
    link: '#',
    status: 'development' as ProjectStatus,
  },
  {
    title: 'iso archive',
    description:
      'An initiative to archive ISOs and their metadata for future generations.',
    icon: <TbFiles className="size-8 sm:size-10 md:size-12 text-sky-400" />,
    link: 'https://github.com/allthingslinux/iso.atl.dev',
    status: 'development' as ProjectStatus,
  }
];

// Status badge component
function StatusBadge({ status }: { status: ProjectStatus }) {
  if (!status) return null;

  // Check if status is a version string (starts with 'v' followed by numbers/dots)
  const isVersion = /^v\d+/.test(status);

  if (isVersion) {
    return (
      <Badge
        variant="outline"
        className="absolute top-3 right-3 text-xs font-medium bg-purple-500/20 text-white border-purple-500/30"
      >
        {status}
      </Badge>
    );
  }

  const statusConfig: Record<string, { label: string; className: string }> = {
    active: {
      label: 'Active',
      className: 'bg-green-500/20 text-white border-green-500/30',
    },
    beta: {
      label: 'Beta',
      className: 'bg-orange-500/20 text-white border-orange-500/30',
    },
    development: {
      label: 'In Development',
      className: 'bg-blue-500/20 text-white border-blue-500/30',
    },
    paused: {
      label: 'Paused',
      className: 'bg-gray-500/20 text-white border-gray-500/30',
    },
    'coming soon': {
      label: 'Coming Soon',
      className: 'bg-amber-500/20 text-white border-amber-500/30',
    },
  };

  const config = statusConfig[status];
  if (!config) return null;

  return (
    <Badge
      variant="outline"
      className={`absolute top-3 right-3 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}

// Project card component
const ProjectCard = ({ project }: { project: (typeof projects)[0] }) => {
  const isExternalLink = project.link.startsWith('http');

  const cardContent = (
    <>
      <StatusBadge status={project.status} />
      <div className="flex items-center justify-center mb-3 sm:mb-4">
        {project.icon}
      </div>
      <div>
        <h3 className="mb-2 text-lg sm:text-xl font-semibold text-center leading-tight">
          {project.title}
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground text-center text-balance leading-relaxed">
          {project.description}
        </p>
      </div>
    </>
  );

  return project.link === '#' ? (
    <Card className="relative bg-card p-3 sm:p-4 md:p-6 h-full cursor-not-allowed opacity-80 border border-transparent">
      {cardContent}
    </Card>
  ) : (
    <Link
      href={project.link}
      target={isExternalLink ? '_blank' : undefined}
      rel={isExternalLink ? 'noopener noreferrer' : undefined}
      className="block transition-transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
    >
      <Card className="relative bg-card p-3 sm:p-4 md:p-6 h-full hover:shadow-sm transition-all border border-transparent hover:border-primary/30">
        {cardContent}
      </Card>
    </Link>
  );
};

const Projects = memo(() => {
  const totalProjects = projects.length;
  const lastRowCount = totalProjects % 3;
  const regularRowsCount = totalProjects - lastRowCount;
  const shouldCenterLastRow = lastRowCount === 1 || lastRowCount === 2;

  const regularProjects = projects.slice(0, regularRowsCount);
  const lastRowProjects = projects.slice(regularRowsCount);

  return (
    <section className="py-4 md:py-6">
      <div className="w-full mx-auto px-3 sm:px-4 md:px-6 max-w-[1400px]">
        <div className="text-center mx-auto max-w-2xl mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-3 sm:mb-4 md:mb-6">
            Explore our ecosystem
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
            As our organization grows, we continue to develop new and exciting
            projects through community collaboration. We have many initiatives
            in progress and welcome your contributions!
          </p>
        </div>

        <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {regularProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>

        {lastRowProjects.length > 0 && (
          <div
            className={`mt-4 sm:mt-5 md:mt-6 ${
              shouldCenterLastRow && lastRowCount === 1
                ? 'grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6'
                : shouldCenterLastRow && lastRowCount === 2
                  ? 'flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:justify-center lg:flex-row gap-4 sm:gap-5 md:gap-6'
                  : 'grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6'
            }`}
          >
            {lastRowProjects.map((project, index) => (
              <div
                key={project.title}
                className={
                  shouldCenterLastRow && lastRowCount === 1
                    ? 'lg:col-start-2'
                    : shouldCenterLastRow && lastRowCount === 2
                      ? 'w-full sm:w-auto lg:w-[calc(33.333%-0.67rem)]'
                      : ''
                }
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

Projects.displayName = 'Projects';

export default Projects;
