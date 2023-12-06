import { Metadata } from "next";
import config from "@/lib/config";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: config.siteName,
  description: config.siteDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="">
      <head />
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
