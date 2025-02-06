import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import { GoogleTagManager } from '@next/third-parties/google';

// Initialize font with subset for better performance
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'All Things Linux',
  description:
    'All Things Linux is a 501(c)(3) non-profit organization with a mission to empower the Linux ecosystem through education, collaboration, and support.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <GoogleTagManager gtmId="GTM-KK56FB5V" />
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
