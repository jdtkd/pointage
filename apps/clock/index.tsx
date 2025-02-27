'use client';

import { ClockDisplay } from './components/clock-display';
import { ThemeToggle } from '@/components/theme-toggle';

export function ClockModule() {
  return (
    <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
      <div className="container flex items-center justify-between h-16">
        <ClockDisplay />
        <ThemeToggle />
      </div>
    </div>
  );
} 