import { useEffect, useRef } from 'react';

export function useFocusTrap(isActive: boolean, onClose?: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;
    
    // Slight delay to allow entrance animations to complete
    const timeout = setTimeout(() => {
      if (!ref.current) return;
      
      const focusableElements = ref.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }, 100);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!ref.current) return;

      if (e.key === 'Escape' && onClose) {
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const focusableElements = ref.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onClose]);

  return ref;
}
