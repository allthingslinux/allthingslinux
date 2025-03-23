import { MenuIcon } from 'lucide-react';

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';

// Define navigation items
const navItems = [
  { name: 'Home', href: '/', hasSubmenu: false },
  { name: 'About', href: '/about', hasSubmenu: false },
  { name: 'CoC', href: '/code-of-conduct', hasSubmenu: false },
  { name: 'Blog', href: '/blog', hasSubmenu: false },
  { name: 'Wiki', href: 'https://atl.wiki', hasSubmenu: false },
  { name: 'Tools', href: 'https://atl.tools', hasSubmenu: false },
  // { name: 'Features', href: '#features', hasSubmenu: true },
];

// Define features submenu items
const features = [
  {
    title: 'Dashboard',
    description: 'Overview of your activity',
    href: '/dashboard',
  },
  {
    title: 'Analytics',
    description: 'Track your performance',
    href: '/analytics',
  },
  {
    title: 'Settings',
    description: 'Configure your preferences',
    href: '/settings',
  },
  {
    title: 'Integrations',
    description: 'Connect with other tools',
    href: '/integrations',
  },
  {
    title: 'Storage',
    description: 'Manage your files',
    href: '/storage',
  },
  {
    title: 'Support',
    description: 'Get help when needed',
    href: '/support',
  },
];

// Logo component
const Logo = () => (
  <div className="flex items-center gap-1 sm:gap-2">
    <Link href="/">
      <span className="text-base sm:text-lg font-semibold">
        All Things Linux
      </span>
    </Link>
  </div>
);

// Feature item component for the dropdown
const FeatureItem = ({ feature }: { feature: (typeof features)[0] }) => (
  <NavigationMenuLink
    href={feature.href}
    key={feature.title}
    className="block rounded-md p-3 transition-colors hover:bg-muted"
  >
    <div>
      <p className="mb-1 font-medium">{feature.title}</p>
      <p className="text-sm text-muted-foreground">{feature.description}</p>
    </div>
  </NavigationMenuLink>
);

// Features submenu content
const FeaturesSubmenu = () => (
  <div className="grid w-[600px] grid-cols-2 gap-2 p-4">
    {features.map((feature) => (
      <FeatureItem key={feature.title} feature={feature} />
    ))}
  </div>
);

// Navigation item component
const NavItem = ({ item }: { item: (typeof navItems)[0] }) => (
  <NavigationMenuItem key={item.name}>
    {item.hasSubmenu ? (
      <>
        <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <FeaturesSubmenu />
        </NavigationMenuContent>
      </>
    ) : (
      <NavigationMenuLink
        href={item.href}
        className={navigationMenuTriggerStyle()}
      >
        {item.name}
      </NavigationMenuLink>
    )}
  </NavigationMenuItem>
);

// Desktop navigation component
const DesktopNavigation = () => (
  <NavigationMenu className="hidden lg:block">
    <NavigationMenuList>
      {navItems.map((item) => (
        <NavItem key={item.name} item={item} />
      ))}
    </NavigationMenuList>
  </NavigationMenu>
);

// CTA buttons component
const CTAButtons = () => (
  <div className="hidden items-center gap-4 lg:flex">
    <Link href="/get-involved">
      <Button size="sm" variant="default">
        Get Involved
      </Button>
    </Link>
  </div>
);

// // Mobile feature item component
// const MobileFeatureItem = ({ feature }: { feature: (typeof features)[0] }) => (
//   <a
//     href={feature.href}
//     key={feature.title}
//     className="rounded-md p-2 transition-colors hover:bg-muted"
//   >
//     <p className="font-medium">{feature.title}</p>
//     <p className="text-sm text-muted-foreground">{feature.description}</p>
//   </a>
// );

// Mobile features accordion
// const MobileFeaturesAccordion = () => (
//   <Accordion type="single" collapsible>
//     <AccordionItem value="features" className="border-b">
//       <AccordionTrigger className="py-3">Features</AccordionTrigger>
//       <AccordionContent>
//         <div className="flex flex-col space-y-2">
//           {features.map((feature) => (
//             <MobileFeatureItem key={feature.title} feature={feature} />
//           ))}
//         </div>
//       </AccordionContent>
//     </AccordionItem>
//   </Accordion>
// );

// Mobile navigation links
const MobileNavLinks = () => (
  <>
    {navItems
      .filter((item) => !item.hasSubmenu)
      .map((item) => (
        <a
          key={item.name}
          href={item.href}
          className="py-3 font-medium transition-colors hover:text-primary"
        >
          {item.name}
        </a>
      ))}
  </>
);

// Mobile CTA buttons
const MobileCTAButtons = () => (
  <div className="mt-4 sm:mt-6 flex flex-col gap-3">
    <Link href="/get-involved">
      <Button className="w-full">Get Involved</Button>
    </Link>
  </div>
);

// Mobile navigation sheet content
const MobileNavContent = () => (
  <div className="mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4">
    {/* <MobileFeaturesAccordion /> */}
    <MobileNavLinks />
    <MobileCTAButtons />
  </div>
);

// Mobile navigation component
const MobileNavigation = () => (
  <Sheet>
    <SheetTrigger asChild className="lg:hidden">
      <Button variant="ghost" size="icon" className="ml-1 sm:ml-2">
        <MenuIcon className="h-5 w-5" />
        <span className="sr-only">Open menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="right" className="w-[260px] sm:w-[300px] md:w-[400px]">
      <SheetHeader>
        <SheetTitle className="text-left">
          <span className="text-base sm:text-lg font-semibold">
            All Things Linux
          </span>
        </SheetTitle>
      </SheetHeader>
      <MobileNavContent />
    </SheetContent>
  </Sheet>
);

// Main Navbar component
function Navbar() {
  return (
    <div className="border-b">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3">
        <nav className="flex items-center justify-between">
          <Logo />
          <DesktopNavigation />
          <CTAButtons />
          <MobileNavigation />
        </nav>
      </div>
    </div>
  );
}

export default function Header() {
  return (
    <header>
      <Navbar />
    </header>
  );
}
