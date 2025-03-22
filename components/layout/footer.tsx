import { FaDiscord, FaFacebook, FaGithub, FaInstagram } from 'react-icons/fa';
import { BsOpencollective } from 'react-icons/bs';

import { Separator } from '@/components/ui/separator';
import { Privacy, Cookies, Terms } from '@/components/consent';

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
    href: 'https://www.instagram.com/allthingslinux',
    label: 'Instagram',
  },
  {
    icon: FaFacebook,
    href: 'https://www.facebook.com/allthingslinux.org',
    label: 'Facebook',
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
        {/* <PrivacyChoices /> */}
      </li>
    </ul>
  </div>
);

// Logo component
const Logo = () => (
  <span className="text-2xl font-medium">All Things Linux</span>
);

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
    <h3 className="mb-4 font-bold">Connect</h3>
    <ul className="flex items-center space-x-6 text-muted-foreground">
      {socialLinks.map((social, idx) => (
        <SocialIcon
          key={idx}
          Icon={social.icon}
          href={social.href}
          label={social.label}
        />
      ))}
    </ul>
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
    <SocialSection />
  </div>
);

// Copyright component
const Copyright = () => (
  <p className="text-sm text-muted-foreground">
    © 2024 All Things Linux • Made with ❤️ • All Rights Reserved.
  </p>
);

export default function Footer() {
  return (
    <section className="py-32">
      <div className="container">
        <footer>
          <Logo />
          <Separator className="my-14" />
          <FooterSections />
          <Separator className="my-14" />
          <Copyright />
        </footer>
      </div>
    </section>
  );
}
