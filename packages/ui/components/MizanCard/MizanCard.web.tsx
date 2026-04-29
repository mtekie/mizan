'use client';

import React from 'react';
import type { MizanCardProps } from './MizanCard';

const variantStyles: Record<string, React.CSSProperties> = {
  default: {
    background: '#fff',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  primary: {
    background: '#45BFA0',
    boxShadow: '0 4px 16px rgba(69,191,160,0.25)',
    color: '#fff',
  },
  outline: {
    background: 'transparent',
    border: '1px solid #E2E8F0',
  },
  glass: {
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.8)',
    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  },
};

export const MizanCard: React.FC<MizanCardProps> = ({
  children, style, variant = 'default', onPress,
}) => {
  const base: React.CSSProperties = {
    borderRadius: 20,
    padding: 20,
    fontFamily: 'Inter, system-ui, sans-serif',
    transition: 'box-shadow 0.2s, transform 0.2s',
    ...variantStyles[variant],
    ...(style as React.CSSProperties),
  };

  if (onPress) {
    return (
      <button
        type="button"
        onClick={onPress}
        style={{ ...base, cursor: 'pointer', border: variantStyles[variant].border ?? 'none', width: '100%', textAlign: 'left' }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = '';
          (e.currentTarget as HTMLElement).style.boxShadow = variantStyles[variant].boxShadow as string ?? '';
        }}
      >
        {children}
      </button>
    );
  }

  return <div style={base}>{children}</div>;
};
