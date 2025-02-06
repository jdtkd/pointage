import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StatistiquesTravail from './components/StatistiquesTravail';
import { ClerkProvider } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import NavbarClient from './components/NavbarClient';

const inter = Inter({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Application de Pointage",
  description: "Application de pointage de présence moderne et intuitive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr" data-theme="emerald">
        <body className={`${inter.variable} font-sans antialiased min-h-screen bg-base-200`}>
          <div className="drawer lg:drawer-open">
            <input id="main-drawer" type="checkbox" className="drawer-toggle" />
            
            {/* Drawer content */}
            <div className="drawer-content flex flex-col">
              {/* Navbar */}
              <NavbarClient />
              
              {/* Main content */}
              <main className="flex-1 p-4">
                {children}
              </main>
            </div>
            
            {/* Sidebar */}
            <div className="drawer-side">
              <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
              <aside className="w-80 min-h-screen bg-base-100">
                <div className="p-4">
                  <h2 className="text-2xl font-bold text-center mb-6">Pointage App</h2>
                  
                  {/* Statistiques client */}
                  <StatistiquesTravail />
                  
                  <ul className="menu menu-vertical gap-2 text-base font-medium">
                    <li><a href="/" className="text-base">🏠 Accueil</a></li>
                    <li><a href="/pointer" className="text-base">⏰ Pointer</a></li>
                    <li><a href="/historique" className="text-base">📊 Historique</a></li>
                    <li><a href="/parametres" className="text-base">⚙️ Paramètres</a></li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
