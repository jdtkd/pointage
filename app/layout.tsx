import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "./providers";
import { Header } from "@/components/layout/header";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { OfflineHandler } from '@/components/offline-handler';

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Système de Pointage",
  description: "Application de gestion des pointages",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Système de Pointage"
  },
  icons: {
    apple: [
      { url: "/icons/icon-192x192.png" },
    ],
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Système de Pointage" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Système de Pointage" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={geist.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto p-4 sm:px-6 lg:px-8 max-w-7xl">
              <div className="py-4 sm:py-6 lg:py-8">
                {children}
              </div>
            </main>
            <footer className="border-t py-4 px-4 sm:px-6 lg:px-8">
              <div className="container mx-auto text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Système de Pointage
              </div>
            </footer>
          </div>
          <Toaster />
          <OfflineHandler />
        </Providers>
      </body>
    </html>
  );
}
