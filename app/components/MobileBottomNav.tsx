"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from './icons';
import { cn } from '../lib/utils';

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t lg:hidden">
      <div className="grid grid-cols-3 h-full">
        <Link 
          href="/"
          className={cn(
            "flex flex-col items-center justify-center",
            pathname === '/' && "text-primary"
          )}
        >
          <Icons.home className="w-6 h-6" />
          <span className="text-xs mt-1">Accueil</span>
        </Link>
        
        <Link 
          href="/pointer"
          className="relative flex items-center justify-center"
        >
          <div className="absolute -top-6 bg-primary rounded-full p-4">
            <Icons.clock className="w-6 h-6 text-white" />
          </div>
        </Link>
        
        <Link 
          href="/historique"
          className={cn(
            "flex flex-col items-center justify-center",
            pathname === '/historique' && "text-primary"
          )}
        >
          <Icons.history className="w-6 h-6" />
          <span className="text-xs mt-1">Historique</span>
        </Link>
      </div>
    </div>
  );
} 