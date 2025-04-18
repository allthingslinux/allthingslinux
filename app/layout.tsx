import { Inter, JetBrains_Mono } from 'next/font/google';

import './globals.css';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import {
  OrganizationSchema,
  WebsiteSchema,
} from '@/components/structured-data';

import { GoogleTagManager } from '@next/third-parties/google';
import { defaultMetadata, viewport } from './metadata';

// Initialize font with subset for better performance
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

// Add a monospace font for code blocks
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-mono',
});

export const metadata = defaultMetadata;
export { viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <GoogleTagManager gtmId="GTM-KK56FB5V" />
        <OrganizationSchema />
        <WebsiteSchema />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
