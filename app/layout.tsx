import {Montserrat, McLaren} from 'next/font/google';
import '@/app/ui/global.css';
import Header from '@/app/ui/Header';
import Footer from '@/app/ui/Footer';

const monserrat = Montserrat({
  subsets: ['latin'],
  variable: "--font-montserrat",
});

const mclaren = McLaren({
  subsets: ['latin'],
  weight: "400",
  variable: "--font-mclaren",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${monserrat.variable} ${mclaren.variable}`}>
      <body>
        <Header />
        <div id="root">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
