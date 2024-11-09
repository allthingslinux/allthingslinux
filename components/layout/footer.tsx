import { BsOpencollective } from 'react-icons/bs';
import { FaDiscord, FaGithub } from 'react-icons/fa';

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
    { name: 'Resources', href: 'https://atl.tools' },
    { name: 'Blog', href: 'https://blog.atl.tools' },
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
    <footer>
      <div className="border-t border-slate-800 max-w-5xl mx-auto px-6 lg:px-8"></div>

      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
        <nav
          aria-label="Footer"
          className="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm/6">
          {navigation.main.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-white">
              {item.name}
            </a>
          ))}
        </nav>
        <div className="mt-16 flex justify-center gap-x-10">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-300">
              <span className="sr-only">{item.name}</span>
              <item.icon aria-hidden="true" className="h-6 w-6" />
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-sm/6 text-gray-400">
          &copy; 2024 All Things Linux • Made with ❤️ • All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
