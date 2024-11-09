import type { Metadata } from 'next';

import './globals.css';

import AnniversaryBanner from '@/components/blocks/anniversary-banner';
import { ConfettiLoader } from '@/components/confetti-loader';
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
        <ConfettiLoader />
        <Header />
        {children}
        <AnniversaryBanner />
        <Footer />
      </body>
    </html>
  );
}
