import Image from 'next/image';
import { Metadata } from 'next';
import config from '@/lib/config';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: config.siteName,
  description: config.siteDescription
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="">
      <head />
      <body>
      <Header />
        <main className="mt-28 mx-2 w-[530px] sm:w-full">{children}</main>
        {/* max-w-fit mx-auto w-[390px] min-h-full md:w-9/12 lg:w-10/12 xl:w-9/12 */}
        <Footer />
      </body>
    </html>
  );
}
