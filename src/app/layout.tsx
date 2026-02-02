import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import '@/styles/globals.css';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'BottleBond | Bourbon & Whiskey Podcast',
    template: '%s | BottleBond',
  },
  description:
    'Premium bourbon and whiskey education podcast. Explore tasting notes, distillery stories, and the rich history of American whiskey.',
  keywords: ['bourbon', 'whiskey', 'podcast', 'tasting', 'education', 'distillery'],
  authors: [{ name: 'BottleBond' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bottlebond.github.io',
    siteName: 'BottleBond',
    title: 'BottleBond | Bourbon & Whiskey Podcast',
    description:
      'Premium bourbon and whiskey education podcast. Explore tasting notes, distillery stories, and the rich history of American whiskey.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BottleBond | Bourbon & Whiskey Podcast',
    description: 'Premium bourbon and whiskey education podcast.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorantGaramond.variable} ${inter.variable}`}>
      <body>
        <div className="site-wrapper">
          <Header />
          <main className="site-main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
