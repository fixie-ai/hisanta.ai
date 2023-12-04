import Image from 'next/image';
import { Metadata } from 'next';
import config from '@/lib/config';
import './globals.css';

export const metadata: Metadata = {
  title: config.siteName,
  description: config.siteDescription
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="">
      <head />
      <body className="max-w-fit mx-auto w-80 md:w-9/12 lg:w-10/12 xl:w-9/12" >
        <div className="min-h-full">
          <header className="flex justify-between mt-4">
            <div className="text-2xl">hisanta.ai</div>
            <div>
            <Image src="/images/foxie-coal.svg" alt="Foxie" width={20} height={20} />
            </div>
          </header>
          <section>
            {children}
          </section>
          {/* <main className="flex min-h-screen flex-col items-start px-4 lg:px-24 py-6">{children}</main> */}
          <div className="flex flex-row justify-center">
            <div className="text-sm text-center text-black font-['Inter-SemiBold']">A Holiday Experiment by &nbsp;</div>
              <Image src="/images/FixieLogo.svg" alt="Fixie Logo" width={60} height={20} />
          </div>
        </div>
        
      </body>
      
    </html>
  );
}
