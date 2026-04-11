'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store';

/**
 * ModeProvider
 * 
 * Handles hydration-safe UI mode management:
 * 1. Applies `mode-simple` or `mode-pro` class to <body>
 * 2. Auto-promotes desktop users (>768px) to Pro mode IF they haven't explicitly chosen
 * 3. Prevents flash of wrong mode during SSR hydration
 */
export function ModeProvider({ children }: { children: React.ReactNode }) {
  const uiMode = useStore((s) => s.uiMode);
  const modeExplicitlySet = useStore((s) => s.modeExplicitlySet);
  const setUiMode = useStore((s) => s.setUiMode);
  const [hydrated, setHydrated] = useState(false);

  // Wait for Zustand hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Auto-detect: desktop users who haven't chosen get Pro mode
  useEffect(() => {
    if (!hydrated) return;
    if (!modeExplicitlySet && typeof window !== 'undefined') {
      const isDesktop = window.innerWidth >= 768;
      if (isDesktop && uiMode === 'simple') {
        // Silently set to pro without marking as explicitly set
        // so mobile still defaults to simple
        useStore.setState({ uiMode: 'pro' });
      }
    }
  }, [hydrated, modeExplicitlySet, uiMode]);

  // Apply body class
  useEffect(() => {
    if (!hydrated) return;
    document.body.classList.remove('mode-simple', 'mode-pro');
    document.body.classList.add(`mode-${uiMode}`);
  }, [uiMode, hydrated]);

  // Prevent flash: hide content until hydrated
  if (!hydrated) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return <>{children}</>;
}
