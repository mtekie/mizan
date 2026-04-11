'use client';

import { useState, useEffect } from 'react';

/**
 * useIsMobile
 * 
 * Simple hook to detect if the current viewport is mobile-sized (< 768px).
 * Useful for structural layout switching that CSS media queries alone can't handle.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Initial check
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();

    // Listen for resize
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
}
