import type { Metadata, Viewport } from 'next';

const siteConfig = {
  name: 'All Things Linux',
  description:
    'A 501(c)(3) non-profit organization empowering the Linux ecosystem through education, collaboration, and support.',
  url: 'https://allthingslinux.org',
  ogImage: 'https://allthingslinux.org/images/og.png',
  links: {
    github: 'https://github.com/allthingslinux',
    discord: 'https://discord.gg/linux',
  },
};

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: 'All Things Linux' }],
  creator: 'All Things Linux',
  publisher: 'All Things Linux',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@allthingslinux',
  },
  icons: {
    // icon: [
    //   { url: '/favicon.ico' },
    //   {
    //     url: '/favicon-16x16-light.png',
    //     sizes: '16x16',
    //     type: 'image/png',
    //     media: '(prefers-color-scheme: light)',
    //   },
    //   {
    //     url: '/favicon-16x16-dark.png',
    //     sizes: '16x16',
    //     type: 'image/png',
    //     media: '(prefers-color-scheme: dark)',
    //   },
    //   {
    //     url: '/favicon-32x32-light.png',
    //     sizes: '32x32',
    //     type: 'image/png',
    //     media: '(prefers-color-scheme: light)',
    //   },
    //   {
    //     url: '/favicon-32x32-dark.png',
    //     sizes: '32x32',
    //     type: 'image/png',
    //     media: '(prefers-color-scheme: dark)',
    //   },
    //   {
    //     url: '/icon-light.png',
    //     sizes: '48x48',
    //     type: 'image/png',
    //     media: '(prefers-color-scheme: light)',
    //   },
    //   {
    //     url: '/icon-dark.png',
    //     sizes: '48x48',
    //     type: 'image/png',
    //     media: '(prefers-color-scheme: dark)',
    //   },
    // ],
    // apple: [
    //   {
    //     url: '/apple-touch-icon-light.png',
    //     media: '(prefers-color-scheme: light)',
    //   },
    //   {
    //     url: '/apple-touch-icon-dark.png',
    //     media: '(prefers-color-scheme: dark)',
    //   },
    // ],
    // other: [
    //   {
    //     rel: 'android-chrome',
    //     url: '/android-chrome-192x192-light.png',
    //     sizes: '192x192',
    //     type: 'image/png',
    //     media: '(prefers-color-scheme: light)',
    //   },
    //   {
    //     rel: 'android-chrome',
    //     url: '/android-chrome-192x192-dark.png',
    //     sizes: '192x192',
    //     type: 'image/png',
    //     media: '(prefers-color-scheme: dark)',
    //   },
    //   {
    //     rel: 'android-chrome',
    //     url: '/android-chrome-512x512-light.png',
    //     sizes: '512x512',
    //     type: 'image/png',
    //     media: '(prefers-color-scheme: light)',
    //   },
    //   {
    //     rel: 'android-chrome',
    //     url: '/android-chrome-512x512-dark.png',
    //     sizes: '512x512',
    //     type: 'image/png',
    //     media: '(prefers-color-scheme: dark)',
    //   },
    // ],
    icon: '/images/logo.png',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL(siteConfig.url),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: siteConfig.name,
  },
  applicationName: siteConfig.name,
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const getPageMetadata = (page: string): Metadata => {
  const pageMetadata: { [key: string]: Metadata } = {
    home: {
      title: siteConfig.name,
      description: siteConfig.description,
    },
    about: {
      title: 'About',
      description:
        'Learn about All Things Linux, our mission, values, and commitment to the Linux community.',
    },
    'code-of-conduct': {
      title: 'Code of Conduct',
      description:
        'Our community guidelines and code of conduct that ensures a welcoming and inclusive environment for all members.',
    },
    blog: {
      title: 'Blog',
      description:
        'Stay updated with the latest news, tutorials, and insights about Linux and open source software.',
    },
    'get-involved': {
      title: 'Get Involved',
      description:
        'Learn how to get involved with All Things Linux and contribute to our projects.',
    },
  };

  return {
    ...defaultMetadata,
    ...pageMetadata[page],
  };
};

export const getDynamicMetadata = (params: {
  title?: string;
  description?: string;
}): Metadata => {
  return {
    ...defaultMetadata,
    title: params.title,
    description: params.description,
    openGraph: {
      ...defaultMetadata.openGraph,
      title: params.title,
      description: params.description,
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: params.title,
      description: params.description,
    },
  };
};
