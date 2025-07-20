import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";
import 'flowbite';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/server/auth";

export const metadata: Metadata = {
  title: "Veloro ",
  description: "buy your next car easily",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),

};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 📥 récupère la session côté serveur (renvoie null si pas authentifié)
  const session = await getServerSession(authOptions);

  return (
    <html lang="fr" >
      <body className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
        {/* 🗝️ on passe la session initiale ici */}
        <Providers session={session}>
          <Navbar />
          <div className="pt-20 flex-1">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}


