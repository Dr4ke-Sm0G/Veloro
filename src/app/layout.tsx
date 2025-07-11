import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";
import 'flowbite';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Veloro ",
  description: "buy your next car easily",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),

};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={` ${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
        <Providers>
          <Navbar />
          {/* PADDING top ici à cause du fixed */}
          <div className="pt-19">
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}



