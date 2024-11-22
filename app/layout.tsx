import type { Metadata } from 'next';

import './globals.css';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'All Things Linux',
  description: 'All Things Linux is a 501(c)(3) non-profit organization with a mission to empower the Linux ecosystem through education, collaboration, and support.'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
