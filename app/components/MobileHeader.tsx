"use client";
import { usePathname } from 'next/navigation';
import { Icons } from './icons';
import ThemeToggle from './ThemeToggle';

export default function MobileHeader() {
  const pathname = usePathname();

  // Fonction pour obtenir le titre de la page
  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'Accueil';
      case '/pointer':
        return 'Pointer';
      case '/historique':
        return 'Historique';
      default:
        return 'Pointage App';
    }
  };

  return (
    <header className="lg:hidden navbar bg-base-100 border-b px-4">
      <div className="flex-1 flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Icons.clock className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
} 