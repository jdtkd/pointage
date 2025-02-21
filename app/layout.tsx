import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import MobileHeader from "./components/MobileHeader";
import MobileBottomNav from './components/MobileBottomNav';
import Sidebar from './components/Sidebar';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Pointage App",
  description: "Application de pointage avec géolocalisation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-theme="light" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="flex h-screen">
          {/* Sidebar desktop */}
          <Sidebar />
          
          {/* Contenu principal */}
          <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
            {/* Header mobile */}
            <MobileHeader />
            
            {/* Contenu */}
            <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
              <div className="container mx-auto px-4 py-6">
                {children}
              </div>
            </main>
            
            {/* Navigation mobile */}
            <MobileBottomNav />
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
