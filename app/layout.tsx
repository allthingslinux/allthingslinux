import type { Metadata } from 'next';

import './globals.css';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'All Things Linux',
  // description: ''
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
