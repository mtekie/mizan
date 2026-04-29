'use client';

import React from 'react';
import type { MizanScreenProps } from './MizanScreen';

/**
 * MizanScreen — Web implementation
 * Provides a sticky header + scrollable content area, visually matching
 * the native AppScreenShell. Works inside Next.js App Router.
 */
export function MizanScreen({
  title,
  subtitle,
  variant = 'plain',
  showBack = false,
  backHref = '/',
  actions,
  primaryAction,
  secondaryActions,
  children,
}: MizanScreenProps) {
  const headerActions = actions ?? (
    primaryAction || secondaryActions ? (
      <>
        {secondaryActions}
        {primaryAction}
      </>
    ) : null
  );

  const isHero = variant === 'hero';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: isHero ? 'var(--color-mint-bg,#F0FAF7)' : '#F8FAFC' }}>
      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 20,
        padding: variant === 'compact' ? '12px 24px' : '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: isHero ? 'linear-gradient(135deg,#17A697,#45BFA0)' : '#fff',
        borderBottom: isHero ? 'none' : '1px solid #F1F5F9',
        boxShadow: isHero ? '0 2px 16px rgba(23,166,151,0.18)' : '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {showBack && (
            <a
              href={backHref}
              aria-label="Go back"
              style={{
                width: 36, height: 36, borderRadius: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isHero ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                color: isHero ? '#fff' : '#1E293B',
                textDecoration: 'none', fontSize: 18,
              }}
            >←</a>
          )}
          <div>
            <h1 style={{
              margin: 0, fontSize: 20,
              fontWeight: 900, letterSpacing: '-0.3px',
              color: isHero ? '#fff' : '#1E293B',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}>{title}</h1>
            {subtitle && (
              <p style={{
                margin: '2px 0 0', fontSize: 12,
                color: isHero ? 'rgba(255,255,255,0.8)' : '#94A3B8',
                fontFamily: 'Inter, system-ui, sans-serif',
              }}>{subtitle}</p>
            )}
          </div>
        </div>
        {headerActions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{headerActions}</div>
        )}
      </header>

      {/* Content */}
      <main style={{ flex: 1, padding: '24px', paddingBottom: 96 }}>
        {children}
      </main>
    </div>
  );
}
