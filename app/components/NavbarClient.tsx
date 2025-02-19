"use client";

import Link from 'next/link';
import { Icons } from './icons';
import ThemeToggle from "./ThemeToggle";

export default function NavbarClient() {
  return (
    <div className="navbar bg-base-100 border-b">
      <div className="flex-1">
        <label htmlFor="main-drawer" className="btn btn-ghost drawer-button lg:hidden">
          <Icons.menu className="h-5 w-5" />
        </label>
      </div>
      
      <div className="navbar-end gap-2">
        <ThemeToggle />
      </div>
    </div>
  );
} 