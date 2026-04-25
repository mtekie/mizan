'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';

/**
 * ThemeProvider
 * 
 * Handles hydration-safe theme management:
 * 1. Applies `data-theme="dark"` to <html> for dark mode
 * 2. Supports light / dark / system theme preferences
 * 3. Prevents flash of wrong theme during SSR hydration
 */
export function ModeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = useStore((s) => s.themeMode);
  const [hydrated, setHydrated] = useState(false);

  // Wait for Zustand hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Write cookie for SSR detection
  useEffect(() => {
    document.cookie = `mizan-themeMode=${themeMode}; path=/; max-age=31536000`;
  }, [themeMode]);

  // Apply dark mode to <html> element
  useEffect(() => {
    if (!hydrated) return;

    const applyTheme = (isDark: boolean) => {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    };

    if (themeMode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mq.matches);

      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      applyTheme(themeMode === 'dark');
    }
  }, [themeMode, hydrated]);

  return <>{children}</>;
}
