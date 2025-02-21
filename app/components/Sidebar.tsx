"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from './icons';
import { cn } from '../lib/utils';
import { HeuresLayout } from './HeuresLayout';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: Icons.home, label: 'Accueil' },
    { href: '/pointer', icon: Icons.clock, label: 'Pointer' },
    { href: '/historique', icon: Icons.history, label: 'Historique' }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-base-200 border-r">
      {/* En-tête */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icons.clock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold">Pointage App</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link 
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  pathname === link.href 
                    ? "bg-primary text-white" 
                    : "hover:bg-base-300"
                )}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Heures en bas */}
      <div className="p-4 border-t">
        <HeuresLayout />
      </div>
    </aside>
  );
} 