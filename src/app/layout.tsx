import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL && !/yourdomain/i.test(process.env.NEXT_PUBLIC_SITE_URL)
      ? process.env.NEXT_PUBLIC_SITE_URL
      : 'https://hoodbarber.webnestiq.nl'
  ),
  title: 'Hood Barber | Herenkapsalon Vlissingen - Boek Direct Online',
  description:
    'Hood Barber is dé herenkapsalon van Vlissingen. Haar knippen, contouren en baardverzorging door Fikri. Boek je afspraak 24/7 online.',
  keywords: ['barber', 'herenkapper', 'herenkapsalon', 'herenknippen', 'baard', 'contouren', 'afspraak boeken', 'Vlissingen'],
  authors: [{ name: 'Hood Barber' }],
  openGraph: {
    title: 'Hood Barber | Herenkapsalon Vlissingen',
    description: 'Haar knippen, contouren en baardverzorging. Boek 24/7 online je afspraak.',
    type: 'website',
    locale: 'nl_NL',
    images: ['/images/hero-barber.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
