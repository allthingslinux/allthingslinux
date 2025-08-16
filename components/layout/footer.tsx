import {
  FaDiscord,
  FaFacebook,
  FaGitAlt,
  FaGithub,
  FaInstagram,
  FaRss,
} from 'react-icons/fa';
import { BsOpencollective } from 'react-icons/bs';
import { IoIosArrowUp } from 'react-icons/io';

import { Separator } from '@/components/ui/separator';
import { Privacy, Cookies, Terms, Security } from '@/components/consent';

// Define footer sections data
const sections = [
  {
    title: 'Information',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Code of Conduct', href: '/code-of-conduct' },
      { name: 'Blog', href: '/blog' },
      { name: 'Get Involved', href: '/get-involved' },
    ],
  },
  {
    title: 'Projects',
    links: [
      { name: 'tux', href: 'https://tux.atl.tools' },
      { name: 'atl.wiki', href: 'https://atl.wiki' },
      { name: 'atl.tools', href: 'https://atl.tools' },
      { name: 'atl.chat', href: 'https://atl.chat' },
    ],
  },
];

// Define social media links
const socialLinks = [
  {
    icon: FaDiscord,
    href: 'https://discord.gg/linux',
    label: 'Discord',
  },
  {
    icon: BsOpencollective,
    href: 'https://opencollective.com/allthingslinux',
    label: 'Open Collective',
  },
  {
    icon: FaGithub,
    href: 'https://github.com/allthingslinux',
    label: 'GitHub',
  },
  {
    icon: FaInstagram,
    href: 'https://instagram.com/allthingslinux',
    label: 'Instagram',
  },
  {
    icon: FaFacebook,
    href: 'https://facebook.com/allthingslinux.org',
    label: 'Facebook',
  },
  {
    icon: FaRss,
    href: 'https://allthingslinux.org/feed',
    label: 'Atom Feed',
  },
];

// Legal section component
const LegalSection = () => (
  <div>
    <h3 className="mb-4 font-bold">Legal</h3>
    <ul className="space-y-4 text-muted-foreground">
      <li className="font-medium hover:text-primary">
        <Privacy />
      </li>
      <li className="font-medium hover:text-primary">
        <Cookies />
      </li>
      <li className="font-medium hover:text-primary">
        <Terms />
      </li>
      <li className="font-medium hover:text-primary">
        <Security />
      </li>
      <li className="font-medium hover:text-primary">
        {/* <PrivacyChoices /> */}
      </li>
    </ul>
  </div>
);

// // Logo component
// const Logo = () => (
//   <span className="text-2xl font-medium">All Things Linux</span>
// );

// Footer link component
const FooterLink = ({ name, href }: { name: string; href: string }) => (
  <li className="font-medium hover:text-primary">
    <a href={href}>{name}</a>
  </li>
);

// Section component
const FooterSection = ({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) => (
  <div>
    <h3 className="mb-4 font-bold">{title}</h3>
    <ul className="space-y-4 text-muted-foreground">
      {links.map((link, linkIdx) => (
        <FooterLink key={linkIdx} name={link.name} href={link.href} />
      ))}
    </ul>
  </div>
);

// Social icon component
const SocialIcon = ({
  Icon,
  href,
  label,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  href: string;
  label: string;
}) => (
  <li className="font-medium hover:text-primary">
    <a href={href} aria-label={label}>
      <Icon className="size-6" />
    </a>
  </li>
);

// Social section component
const SocialSection = () => (
  <div>
    <h3 className="mb-4 font-bold md:block hidden">Social</h3>
    <ul className="flex items-center justify-center md:justify-start space-x-6 text-muted-foreground">
      {socialLinks.map((social, idx) => (
        <SocialIcon
          key={idx}
          Icon={social.icon}
          href={social.href}
          label={social.label}
        />
      ))}
    </ul>
    <div className="mt-6 text-center md:text-left">
      <h4 className="mb-2 font-bold text-sm md:block hidden">Support</h4>
      <a
        href="mailto:admin@allthingslinux.org"
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        admin@allthingslinux.org
      </a>
    </div>
  </div>
);

// Main sections grid
const FooterSections = () => (
  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
    {sections.map((section, sectionIdx) => (
      <FooterSection
        key={sectionIdx}
        title={section.title}
        links={section.links}
      />
    ))}
    <LegalSection />
    <div className="hidden md:block">
      <SocialSection />
    </div>
  </div>
);

// Mobile Footer
const MobileFooter = () => (
  <div className="flex flex-col items-center space-y-4 md:hidden">
    <SocialSection />
    <p className="text-sm text-center text-muted-foreground">
      © {new Date().getFullYear()} All Things Linux • Made with ❤️ • All Rights
      Reserved
    </p>
    <a
      href="https://github.com/allthingslinux/allthingslinux"
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
    >
      <IoIosArrowUp className="size-4 -rotate-45" />
      <span>View Source</span>
    </a>
  </div>
);

// Desktop Copyright
const DesktopCopyright = () => (
  <div className="hidden md:flex justify-between items-center">
    <p className="text-sm text-muted-foreground">
      © {new Date().getFullYear()} All Things Linux • Made with ❤️ • All Rights
      Reserved
    </p>
    <a
      href="https://github.com/allthingslinux/allthingslinux"
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors"
    >
      <FaGitAlt className="size-4" />
      <span>View Source</span>
    </a>
  </div>
);

export default function Footer() {
  return (
    <section className="py-12 md:py-20 lg:py-32">
      <div className="container">
        <footer className="w-full">
          <Separator className="my-8 md:my-14" />
          <FooterSections />
          <Separator className="my-8 md:my-14" />
          <DesktopCopyright />
          <MobileFooter />
        </footer>
      </div>
    </section>
  );
}
