// import { Analytics } from '@vercel/analytics/react';
import localFont from 'next/font/local';
import Image from 'next/image';

const LGFont = localFont({
  src: '/LuckiestGuy-Regular.ttf',
  display: 'swap',
});


export const metadata = {
  title: 'Fixie | Voice',
  description: 'Fixie Voice is a platform for building conversational voice AI experiences.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={LGFont.className}>
      <body className="body-bg">

        <main className="flex min-h-screen flex-col items-start px-4 lg:px-24 py-6">{children}</main>
        {/* <Analytics /> */}
        <div>A Holiday Experiment by Fixie</div>
      </body>
      
    </html>
  );
}
