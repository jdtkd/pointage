"use client";

import { Icons } from './icons';
import ThemeToggle from "./ThemeToggle";

export default function NavbarClient() {
  return (
    <div className="navbar bg-base-100 border-b">
      <div className="flex-1">
        {/* Logo visible uniquement sur mobile */}
        <div className="lg:hidden flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Icons.clock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold">Pointage App</h1>
        </div>
      </div>
      
      <div className="navbar-end gap-2">
        <ThemeToggle />
      </div>
    </div>
  );
} 