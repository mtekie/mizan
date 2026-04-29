'use client';

import React from 'react';
import type { MizanHeaderProps } from './MizanHeader';

export function MizanHeader({
  title, subtitle, variant = 'plain', showBack = false, backHref = '/', leftAction, rightAction,
}: MizanHeaderProps) {
  const isHero = variant === 'hero';
  const defaultBack = showBack && !leftAction ? (
    <a
      href={backHref}
      aria-label="Go back"
      style={{
        width: 36, height: 36, borderRadius: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isHero ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
        color: isHero ? '#fff' : '#1E293B',
        textDecoration: 'none', fontSize: 18, flexShrink: 0,
      }}
    >←</a>
  ) : null;

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 20,
      padding: variant === 'compact' ? '12px 24px' : '16px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: isHero ? 'linear-gradient(135deg,#17A697,#45BFA0)' : '#fff',
      borderBottom: isHero ? 'none' : '1px solid #F1F5F9',
      boxShadow: isHero ? '0 2px 16px rgba(23,166,151,0.18)' : '0 1px 4px rgba(0,0,0,0.04)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {leftAction ?? defaultBack}
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: '-0.3px', color: isHero ? '#fff' : '#1E293B' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ margin: '2px 0 0', fontSize: 12, color: isHero ? 'rgba(255,255,255,0.8)' : '#94A3B8' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {rightAction && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{rightAction}</div>}
    </header>
  );
}
