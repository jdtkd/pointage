"use client";
import { useThemeStore } from '../stores/themeStore';
import { useEffect } from 'react';
import { Icons } from './icons';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'cupcake');
  }, [theme]);

  return (
    <button
      className="btn btn-ghost btn-circle"
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Icons.moon className="w-5 h-5" />
      ) : (
        <Icons.sun className="w-5 h-5" />
      )}
    </button>
  );
} 