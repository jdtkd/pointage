import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
    <html lang="fr" data-theme="emerald">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen bg-base-200`}
      >
        <div className="drawer lg:drawer-open">
          <input id="main-drawer" type="checkbox" className="drawer-toggle" />
          
          {/* Drawer content */}
          <div className="drawer-content flex flex-col">
            {/* Navbar */}
            <div className="navbar bg-base-100 lg:hidden">
              <div className="flex-none">
                <label htmlFor="main-drawer" className="btn btn-square btn-ghost drawer-button">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </label>
              </div>
              <div className="flex-1">
                <a className="text-xl font-bold">Pointage App</a>
              </div>
            </div>
            
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
  );
}
