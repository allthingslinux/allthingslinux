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
    icon: <TbWritingSign className="size-14 text-catppuccin-peach" />,
    link: 'https://atl.wiki',
  },
  {
    title: '.gg/linux',
    description:
      'Our Discord server is the heart of our community and growing every day.',
    icon: <TbBrandDiscord className="size-14 text-tokyonight-brightPurple" />,
    link: 'https://discord.gg/linux',
  },
  {
    title: 'atl.tools',
    description:
      'Self-hosted applications, services and email, always free. More coming soon!',
    icon: <TbStack2 className="size-14 text-tokyonight-red" />,
    link: 'https://atl.tools',
  },
  {
    title: 'atl.chat',
    description:
      'Chat with the community via other platforms like IRC or XMPP. Temporarily down.',
    icon: <TbMessage2 className="size-14 text-tokyonight-white" />,
    link: '#',
  },
  {
    title: 'tux',
    description:
      'Tux is an all in one Discord bot that powers our community. Currently in beta.',
    icon: <PiLinuxLogoBold className="size-14 text-tokyonight-brightYellow" />,
    link: 'https://tux.atl.tools',
  },
  {
    title: 'atl.dev',
    description:
      'Our pubnix and hosting platform for developers. In development.',
    icon: <TbCloud className="size-14 text-tokyonight-foreground" />,
    link: '#',
  },
];

const Projects = () => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-col lg:flex-row">
          <h2 className="text-2xl font-medium md:w-1/2">Explore our Network</h2>

          <p className="lg:text-lg">
            As our organization grows, we will continue to develop new and
            exciting projects via collaboration with our community. We have a
            lot of projects in the works and are always looking for help!
          </p>
        </div>

        <div className="mt-20 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Card key={index} className="bg-catppuccin-mantle p-8">
              <div className="flex items-center justify-center mb-4">
                {project.icon}
              </div>
              <div className="">
                <p className="mb-3 text-2xl text-catppuccin-text font-semibold text-center">
                  {project.title}
                </p>
                <p className="text-catppuccin-subtext0 text-center">
                  {project.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
