import { Montserrat, McLaren } from 'next/font/google';
import '@/app/ui/global.css';
import Header from '@/app/ui/Header';
import Footer from '@/app/ui/Footer';

import { Providers } from './provider';

import { SpeedInsights } from '@vercel/speed-insights/next';
import { CookiesProvider } from 'next-client-cookies/server';

const monserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat'
});

const mclaren = McLaren({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-mclaren'
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${monserrat.variable} ${mclaren.variable}`}>
      <body>
        <Header />
        <Providers>
          <CookiesProvider>{children}</CookiesProvider>
          <SpeedInsights />
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
