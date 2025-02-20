import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import NavbarClient from "./components/NavbarClient";
import MobileBottomNav from './components/MobileBottomNav';
import Link from 'next/link';
import { Icons } from './components/icons';
import { HeuresLayout } from './components/HeuresLayout';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Pointage App",
  description: "Application de pointage avec géolocalisation",
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/icon-192x192.png" }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-theme="light" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="drawer lg:drawer-open">
          <input id="main-drawer" type="checkbox" className="drawer-toggle" />
          
          {/* Drawer content */}
          <div className="drawer-content flex flex-col">
            {/* Navbar */}
            <NavbarClient />
            
            {/* Main content */}
            <main className="pb-20 lg:pb-0">
              <div className="max-w-7xl mx-auto px-4 py-6">
                {children}
              </div>
            </main>
            
            {/* Navigation mobile */}
            <MobileBottomNav />
          </div>
          
          {/* Sidebar */}
          <div className="drawer-side">
            <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
            <aside className="w-72 min-h-screen bg-white dark:bg-gray-800 border-r">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Icons.clock className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-lg font-semibold">Pointage App</h1>
                  </div>
                </div>
                
                <nav className="flex-1 p-4 space-y-1">
                  <Link 
                    href="/"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Icons.home className="w-5 h-5" />
                    <span>Accueil</span>
                  </Link>
                  
                  <Link 
                    href="/pointer"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Icons.clock className="w-5 h-5" />
                    <span>Pointer</span>
                  </Link>
                  
                  <Link 
                    href="/historique"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Icons.history className="w-5 h-5" />
                    <span>Historique</span>
                  </Link>
                </nav>

                <div className="p-4 border-t">
                  <HeuresLayout />
                </div>
              </div>
            </aside>
          </div>
        </div>
        <Toaster 
          position="top-center"
          expand={true}
          richColors
        />
      </body>
    </html>
  );
}
