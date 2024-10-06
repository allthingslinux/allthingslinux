import { Book, Menu, Sunset, Trees, Zap } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';

const subMenuItemsOne = [
  {
    title: 'Blog',
    description: 'The latest industry news, updates, and info',
    icon: <Book className='size-5 shrink-0' />,
  },
  {
    title: 'Compnay',
    description: 'Our mission is to innovate and empower the world',
    icon: <Trees className='size-5 shrink-0' />,
  },
  {
    title: 'Careers',
    description: 'Browse job listing and discover our workspace',
    icon: <Sunset className='size-5 shrink-0' />,
  },
  {
    title: 'Support',
    description:
      'Get in touch with our support team or visit our community forums',
    icon: <Zap className='size-5 shrink-0' />,
  },
];

const subMenuItemsTwo = [
  {
    title: 'Help Center',
    description: 'Get all the answers you need right here',
    icon: <Zap className='size-5 shrink-0' />,
  },
  {
    title: 'Contact Us',
    description: 'We are here to help you with any questions you have',
    icon: <Sunset className='size-5 shrink-0' />,
  },
  {
    title: 'Status',
    description: 'Check the current status of our services and APIs',
    icon: <Trees className='size-5 shrink-0' />,
  },
  {
    title: 'Terms of Service',
    description: 'Our terms and conditions for using our services',
    icon: <Book className='size-5 shrink-0' />,
  },
];

const Navbar = () => {
  return (
    <section className='py-12'>
      <div className='container'>
        <nav className='hidden justify-between lg:flex'>
          <div className='flex items-center gap-6'>
            <div className='flex items-center gap-2'>
              <img
                src='https://raw.githubusercontent.com/garrett/Tux/ecd40de64250ea2b24c849e901c3297ad01e54f6/tux-bw.svg'
                className='w-8'
                alt='logo'
              />
              <span className='text-xl font-bold'>All Things Linux</span>
            </div>
            <div className='flex items-center'>
              <a
                className={cn(
                  'text-muted-foreground',
                  navigationMenuTriggerStyle,
                  buttonVariants({
                    variant: 'ghost',
                  })
                )}
                href='#'>
                Home
              </a>
              <NavigationMenu>
                <NavigationMenuList>
                  {/* <NavigationMenuItem className='text-muted-foreground'>
                    <NavigationMenuTrigger>
                      <span>Products</span>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className='w-80 p-3'>
                        <NavigationMenuLink>
                          {subMenuItemsOne.map((item, idx) => (
                            <li key={idx}>
                              <a
                                className={cn(
                                  'flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                                )}
                                href='#'>
                                {item.icon}
                                <div>
                                  <div className='text-sm font-semibold'>
                                    {item.title}
                                  </div>
                                  <p className='text-sm leading-snug text-muted-foreground'>
                                    {item.description}
                                  </p>
                                </div>
                              </a>
                            </li>
                          ))}
                        </NavigationMenuLink>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem> */}
                  <NavigationMenuItem className='text-muted-foreground'>
                    <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className='w-80 p-3'>
                        <NavigationMenuLink>
                          {subMenuItemsTwo.map((item, idx) => (
                            <li key={idx}>
                              <a
                                className={cn(
                                  'flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                                )}
                                href='#'>
                                {item.icon}
                                <div>
                                  <div className='text-sm font-semibold'>
                                    {item.title}
                                  </div>
                                  <p className='text-sm leading-snug text-muted-foreground'>
                                    {item.description}
                                  </p>
                                </div>
                              </a>
                            </li>
                          ))}
                        </NavigationMenuLink>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              <a
                className={cn(
                  'text-muted-foreground',
                  navigationMenuTriggerStyle,
                  buttonVariants({
                    variant: 'ghost',
                  })
                )}
                href='https://coc.allthingslinux.com'>
                Code of Conduct
              </a>
              <a
                className={cn(
                  'text-muted-foreground',
                  navigationMenuTriggerStyle,
                  buttonVariants({
                    variant: 'ghost',
                  })
                )}
                href='https://blog.atl.tools'>
                Blog
              </a>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button variant={'outline'}>Get Involved</Button>
            <Button>Join Discord</Button>
          </div>
        </nav>
        <div className='block lg:hidden'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <img
                src='https://www.shadcnblocks.com/images/block/block-1.svg'
                className='w-8'
                alt='logo'
              />
              <span className='text-xl font-bold'>Shadcn Blocks</span>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant={'outline'}
                  size={'icon'}>
                  <Menu className='size-4' />
                </Button>
              </SheetTrigger>
              <SheetContent className='overflow-y-auto'>
                <SheetHeader>
                  <SheetTitle>
                    <div className='flex items-center gap-2'>
                      <img
                        src='https://www.shadcnblocks.com/images/block/block-1.svg'
                        className='w-8'
                        alt='logo'
                      />
                      <span className='text-xl font-bold'>Shadcn Blocks</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className='my-8 flex flex-col gap-4'>
                  <a
                    href='#'
                    className='font-semibold'>
                    Home
                  </a>
                  <Accordion
                    type='single'
                    collapsible
                    className='w-full'>
                    <AccordionItem
                      value='products'
                      className='border-b-0'>
                      <AccordionTrigger className='mb-4 py-0 font-semibold hover:no-underline'>
                        Products
                      </AccordionTrigger>
                      <AccordionContent className='mt-2'>
                        {subMenuItemsOne.map((item, idx) => (
                          <a
                            key={idx}
                            className={cn(
                              'flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                            )}
                            href='#'>
                            {item.icon}
                            <div>
                              <div className='text-sm font-semibold'>
                                {item.title}
                              </div>
                              <p className='text-sm leading-snug text-muted-foreground'>
                                {item.description}
                              </p>
                            </div>
                          </a>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem
                      value='resources'
                      className='border-b-0'>
                      <AccordionTrigger className='py-0 font-semibold hover:no-underline'>
                        Resources
                      </AccordionTrigger>
                      <AccordionContent className='mt-2'>
                        {subMenuItemsTwo.map((item, idx) => (
                          <a
                            key={idx}
                            className={cn(
                              'flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground'
                            )}
                            href='#'>
                            {item.icon}
                            <div>
                              <div className='text-sm font-semibold'>
                                {item.title}
                              </div>
                              <p className='text-sm leading-snug text-muted-foreground'>
                                {item.description}
                              </p>
                            </div>
                          </a>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <a
                    href='#'
                    className='font-semibold'>
                    Pricing
                  </a>
                  <a
                    href='#'
                    className='font-semibold'>
                    Blog
                  </a>
                </div>
                <div className='border-t pt-4'>
                  <div className='grid grid-cols-2 justify-start'>
                    <a
                      className={cn(
                        buttonVariants({
                          variant: 'ghost',
                        }),
                        'justify-start text-muted-foreground'
                      )}
                      href='#'>
                      Press
                    </a>
                    <a
                      className={cn(
                        buttonVariants({
                          variant: 'ghost',
                        }),
                        'justify-start text-muted-foreground'
                      )}
                      href='#'>
                      Contact
                    </a>
                    <a
                      className={cn(
                        buttonVariants({
                          variant: 'ghost',
                        }),
                        'justify-start text-muted-foreground'
                      )}
                      href='#'>
                      Imprint
                    </a>
                    <a
                      className={cn(
                        buttonVariants({
                          variant: 'ghost',
                        }),
                        'justify-start text-muted-foreground'
                      )}
                      href='#'>
                      Sitemap
                    </a>
                    <a
                      className={cn(
                        buttonVariants({
                          variant: 'ghost',
                        }),
                        'justify-start text-muted-foreground'
                      )}
                      href='#'>
                      Legal
                    </a>
                    <a
                      className={cn(
                        buttonVariants({
                          variant: 'ghost',
                        }),
                        'justify-start text-muted-foreground'
                      )}
                      href='#'>
                      Cookie Settings
                    </a>
                  </div>
                  <div className='mt-2 flex flex-col gap-3'>
                    <Button variant={'outline'}>Log in</Button>
                    <Button>Sign up</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Navbar;
