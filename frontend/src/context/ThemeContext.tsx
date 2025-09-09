"use client";
import { createContext, useContext, useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';

export type BrandTheme = 'nails' | 'toys' | 'boutique' | 'system';

interface ThemeState {
  dark: boolean;
  reducedMotion: boolean;
  brand: BrandTheme | null;
  toggleDark: () => void;
  setDark: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setBrand: (b: BrandTheme | null) => void;
  resetToSystemPref: () => void;
}

const ThemeContext = createContext<ThemeState | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [dark, setDark] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [brand, setBrand] = useState<BrandTheme | null>(null);
  const mountedRef = useRef(false);

  // init from media + localStorage
  useEffect(() => {
    const stored = localStorage.getItem('ui_prefs');
    if (stored) {
      try {
          const parsed = JSON.parse(stored);
          setDark(!!parsed.dark);
          setReducedMotion(!!parsed.reducedMotion);
          setBrand(parsed.brand || null);
        } catch {
          // ignore parse errors
        }
    } else {
      setDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  // Apply brand class & CSS variable
  useEffect(() => {
    const root = document.documentElement;
    // remove previous brand-* classes
    root.classList.forEach(cls => { if (cls.startsWith('brand-')) root.classList.remove(cls); });
    if (brand) {
      root.classList.add(`brand-${brand}`);
      // Optionally map brand to accent color variable
      const accentMap: Record<string, string> = {
        nails: '255 105 180',
        toys: '13 148 136',
        boutique: '217 119 6',
      };
      const accent = accentMap[brand];
      if (accent) root.style.setProperty('--brand-accent', accent);
    } else {
      root.style.removeProperty('--brand-accent');
    }
  }, [brand]);

  useEffect(() => {
    const prefs = { dark, reducedMotion, brand };
    localStorage.setItem('ui_prefs', JSON.stringify(prefs));
  }, [dark, reducedMotion, brand]);

  // show a small toast when the user actively toggles theme (skip first mount)
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    toast(`Switched to ${dark ? 'dark' : 'light'} mode`);
  }, [dark]);

  const toggleDark = () => setDark(d => !d);

  const resetToSystemPref = () => {
    try { localStorage.removeItem('ui_prefs'); } catch (e) {}
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setDark(!!prefersDark);
    setReducedMotion(!!prefersReduced);
    setBrand(null);
    toast('Reset theme to system preference');
  };

  return (
    <ThemeContext.Provider value={{ dark, reducedMotion, brand, toggleDark, setDark, setReducedMotion, setBrand, resetToSystemPref }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemePrefs = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemePrefs must be used within ThemeProvider');
  return ctx;
};
