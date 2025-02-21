"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from './icons';
import { cn } from '../lib/utils';

export default function MobileBottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: Icons.home, label: 'Accueil' },
    { href: '/pointer', icon: Icons.clock, label: 'Pointer', primary: true },
    { href: '/historique', icon: Icons.history, label: 'Historique' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-base-100 border-t lg:hidden">
      <div className="grid grid-cols-3 h-full">
        {links.map((link) => {
          if (link.primary) {
            return (
              <Link 
                key={link.href}
                href={link.href}
                className="relative flex items-center justify-center"
              >
                <div className={cn(
                  "absolute -top-6 rounded-full p-4 transition-colors",
                  pathname === link.href 
                    ? "bg-primary text-white"
                    : "bg-base-300 hover:bg-base-content/10"
                )}>
                  <link.icon className="w-6 h-6" />
                </div>
              </Link>
            );
          }

          return (
            <Link 
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center transition-colors",
                pathname === link.href && "text-primary"
              )}
            >
              <link.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
} 