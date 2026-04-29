'use client';

import React from 'react';
import type { MizanButtonProps } from './MizanButton';

const sizeMap = {
  sm: { padding: '8px 16px', fontSize: 13, borderRadius: 10 },
  md: { padding: '12px 24px', fontSize: 15, borderRadius: 14 },
  lg: { padding: '15px 32px', fontSize: 17, borderRadius: 16 },
};

const variantMap: Record<string, React.CSSProperties> = {
  primary: { background: '#45BFA0', color: '#fff', border: 'none' },
  secondary: { background: 'transparent', color: '#45BFA0', border: '1.5px solid #45BFA0' },
  ghost: { background: 'transparent', color: '#45BFA0', border: 'none' },
  danger: { background: '#E8734A', color: '#fff', border: 'none' },
};

export const MizanButton: React.FC<MizanButtonProps> = ({
  label, variant = 'primary', size = 'md', onPress, loading = false,
  disabled = false, iconLeft, iconRight, type = 'button', className,
}) => {
  const isDisabled = disabled || loading;
  const s = sizeMap[size];
  const v = variantMap[variant];

  return (
    <button
      type={type}
      onClick={onPress}
      disabled={isDisabled}
      className={className}
      aria-label={label}
      aria-busy={loading}
      style={{
        ...v, ...s,
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontWeight: 700, fontFamily: 'Inter, system-ui, sans-serif',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.45 : 1,
        transition: 'transform 0.15s, opacity 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={e => !isDisabled && ((e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)')}
      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = '')}
    >
      {loading ? (
        <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
      ) : (
        <>
          {iconLeft}
          {label}
          {iconRight}
        </>
      )}
    </button>
  );
};
