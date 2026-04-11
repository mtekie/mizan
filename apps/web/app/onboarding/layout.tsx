import React from 'react';

/**
 * Onboarding Layout
 * 
 * Bypasses the root LayoutWrapper (TopNav/BottomNav) to provide
 * a focused experience during the initial setup flow.
 */
export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#0F172A] min-h-screen">
      {children}
    </div>
  );
}
