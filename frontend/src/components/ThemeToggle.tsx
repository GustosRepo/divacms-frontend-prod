"use client";
import React from 'react';
import { useThemePrefs } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { dark, toggleDark } = useThemePrefs();
  return (
    <button
      aria-label="Toggle theme"
      onClick={toggleDark}
      className="fixed bottom-6 right-4 md:hidden z-50 w-12 h-12 rounded-full flex items-center justify-center bg-white/90 dark:bg-[#111]/90 shadow-lg border border-white/30 dark:border-white/10"
    >
  <span className="select-none">{dark ? '☀️' : '🌙'}</span>
    </button>
  );
}
