'use client';

import React from 'react';
import type { MizanChipProps } from './MizanChip';

export const MizanChip: React.FC<MizanChipProps> = ({
  label, emoji, active = false, onPress, className,
}) => (
  <button
    type="button"
    onClick={onPress}
    className={className}
    aria-pressed={active}
    style={{
      height: 32,
      paddingInline: 14,
      borderRadius: 16,
      border: 'none',
      cursor: 'pointer',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 0.1,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      transition: 'background 0.15s, color 0.15s, transform 0.1s',
      background: active ? '#45BFA0' : '#F1F5F9',
      color: active ? '#fff' : '#64748B',
      transform: 'scale(1)',
    }}
    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1.04)')}
    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'scale(1)')}
  >
    {emoji && <span>{emoji}</span>}
    {label}
  </button>
);
