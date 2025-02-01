import React, { type JSX } from 'react';

import { BsOpencollective } from 'react-icons/bs';
import { FaDiscord, FaGithub } from 'react-icons/fa';

import {
  Privacy,
  Cookies,
  Terms,
  PrivacyChoices,
  NoticeAtCollection,
} from '@/components/consent';

interface NavigationItem {
  name: string;
  href: string;
}

interface SocialItem extends NavigationItem {
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
}

interface Navigation {
  main: NavigationItem[];
  social: SocialItem[];
}

const navigation: Navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'CoC', href: '/code-of-conduct' },
    { name: 'Blog', href: '/blog' },
    { name: 'Wiki', href: 'https://atl.wiki' },
    { name: 'Tools', href: 'https://atl.tools' },
    { name: 'Get Involved', href: '/get-involved' },
  ],
  social: [
    {
      name: 'Discord',
      href: 'https://discord.gg/linux',
      icon: (props) => <FaDiscord {...props} />,
    },
    {
      name: 'Open Collective',
      href: 'https://opencollective.com/allthingslinux',
      icon: (props) => <BsOpencollective {...props} />,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/allthingslinux',
      icon: (props) => <FaGithub {...props} />,
    },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Footer"
          className="flex flex-wrap justify-center gap-x-12 gap-y-3 text-center text-base"
        >
          {navigation.main.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {item.name}
            </a>
          ))}
        </nav>
        <div className="mt-8 flex justify-center gap-x-10">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="h-6 w-6" />
            </a>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex justify-center gap-x-4 text-gray-400 hover:text-gray-300 text-sm text-center flex-wrap gap-y-4">
            <Privacy />
            <Cookies />
            <Terms />
          </div>
          <div className="flex justify-center gap-x-4 text-gray-400 hover:text-gray-300 text-sm text-center flex-wrap gap-y-4">
            <PrivacyChoices />
            <NoticeAtCollection />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-gray-400 text-balance">
          &copy; 2024 All Things Linux • Made with ❤️ • All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
