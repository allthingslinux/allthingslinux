// import React, { type JSX } from 'react';

// import { BsOpencollective } from 'react-icons/bs';
// import { FaDiscord, FaGithub } from 'react-icons/fa';

// import { Privacy, Cookies, Terms, PrivacyChoices } from '@/components/consent';

// interface NavigationItem {
//   name: string;
//   href: string;
// }

// interface SocialItem extends NavigationItem {
//   icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
// }

// interface Navigation {
//   main: NavigationItem[];
//   social: SocialItem[];
// }

// const navigation: Navigation = {
//   main: [
//     { name: 'Home', href: '/' },
//     { name: 'About', href: '/about' },
//     { name: 'CoC', href: '/code-of-conduct' },
//     { name: 'Blog', href: '/blog' },
//     { name: 'Wiki', href: 'https://atl.wiki' },
//     { name: 'Tools', href: 'https://atl.tools' },
//     { name: 'Get Involved', href: '/get-involved' },
//   ],
//   social: [
//     {
//       name: 'Discord',
//       href: 'https://discord.gg/linux',
//       icon: (props) => <FaDiscord {...props} />,
//     },
//     {
//       name: 'Open Collective',
//       href: 'https://opencollective.com/allthingslinux',
//       icon: (props) => <BsOpencollective {...props} />,
//     },
//     {
//       name: 'GitHub',
//       href: 'https://github.com/allthingslinux',
//       icon: (props) => <FaGithub {...props} />,
//     },
//   ],
// };

// export default function Footer() {
//   return (
//     <footer className="bg-gray-900 py-8">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
//         <nav
//           aria-label="Footer"
//           className="flex flex-wrap justify-center gap-x-12 gap-y-3 text-center text-base"
//         >
//           {navigation.main.map((item) => (
//             <a
//               key={item.name}
//               href={item.href}
//               className="text-gray-400 hover:text-white transition-colors duration-200 ease-in-out"
//             >
//               {item.name}
//             </a>
//           ))}
//         </nav>
//         <div className="mt-8 flex justify-center gap-x-10">
//           {navigation.social.map((item) => (
//             <a
//               key={item.name}
//               href={item.href}
//               className="text-gray-400 hover:text-gray-300 transition-colors duration-200 ease-in-out group"
//             >
//               <span className="sr-only">{item.name}</span>
//               <item.icon
//                 aria-hidden="true"
//                 className="h-6 w-6 transform transition-transform duration-200 ease-in-out group-hover:scale-110"
//               />
//             </a>
//           ))}
//         </div>
//         <div className="mt-8 flex flex-col items-center space-y-4">
//           <div className="flex flex-wrap justify-center items-center gap-4">
//             <Privacy />
//             <Cookies />
//             <Terms />
//           </div>
//           <div className="flex flex-wrap justify-center items-center gap-4">
//             <PrivacyChoices />
//             {/* <NoticeAtCollection /> */}
//           </div>
//         </div>
//         <p className="mt-6 text-center text-sm text-gray-400 text-balance">
//           &copy; 2024 All Things Linux • Made with ❤️ • All Rights Reserved.
//         </p>
//       </div>
//     </footer>
//   );
// }

import {
  FaDiscord,
  FaRedditAlien,
  FaTelegramPlane,
  FaTwitter,
} from 'react-icons/fa';

import { Separator } from '@/components/ui/separator';

// Define footer sections data
const sections = [
  {
    title: 'Pages',
    links: [
      { name: 'atl.wiki', href: 'https://atl.wiki' },
      { name: 'atl.tools', href: 'https://atl.tools' },
      { name: 'atl.chat', href: 'https://webirc.atl.chat' },
      { name: 'Blog', href: '/blog' },
      { name: 'Get Involved', href: '/get-involved' },
      { name: 'Code of Conduct', href: '/code-of-conduct' },
    ],
  },
];

// Define social media links
const socialLinks = [
  { icon: FaDiscord, href: '#', label: 'Discord' },
  { icon: FaRedditAlien, href: '#', label: 'Reddit' },
  { icon: FaTwitter, href: '#', label: 'Twitter' },
  { icon: FaTelegramPlane, href: '#', label: 'Telegram' },
];

// Define legal links
const legalLinks = [
  { name: 'Term of Services', href: '#' },
  { name: 'Privacy Policy', href: '#' },
];

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

// Legal section component
const LegalSection = () => (
  <div>
    <h3 className="mb-4 font-bold">Legal</h3>
    <ul className="space-y-4 text-muted-foreground">
      {legalLinks.map((link, idx) => (
        <FooterLink key={idx} name={link.name} href={link.href} />
      ))}
    </ul>
  </div>
);

// Social section component
const SocialSection = () => (
  <div>
    <h3 className="mt-8 mb-4 font-bold">Social</h3>
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

// Combined legal and social section
const LegalAndSocialSection = () => (
  <div>
    <LegalSection />
    <SocialSection />
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
    <LegalAndSocialSection />
  </div>
);

// Copyright component
const Copyright = () => (
  <p className="text-sm text-muted-foreground">
    © 2024 All Things Linux. All rights reserved.
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
