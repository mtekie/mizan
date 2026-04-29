'use client';

import React from 'react';
import type { MetricCardProps } from './MetricCard';

const trendColors = {
  positive: '#45BFA0',
  negative: '#E8734A',
  neutral: '#94A3B8',
};

export const MetricCard: React.FC<MetricCardProps> = ({
  label, value, icon, trend, trendTone = 'positive', color, onPress,
}) => {
  const base: React.CSSProperties = {
    background: color ?? '#fff',
    borderRadius: 16,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    fontFamily: 'Inter, system-ui, sans-serif',
    flex: 1,
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: onPress ? 'pointer' : 'default',
    border: 'none',
    textAlign: 'left',
  };

  const inner = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon && <span style={{ flexShrink: 0, color: '#45BFA0' }}>{icon}</span>}
        <span style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</span>
      </div>
      <span style={{ fontSize: 24, fontWeight: 900, color: '#1E293B', letterSpacing: '-0.5px', lineHeight: 1 }}>{value}</span>
      {trend && (
        <span style={{ fontSize: 11, fontWeight: 600, color: trendColors[trendTone] }}>{trend}</span>
      )}
    </>
  );

  if (onPress) {
    return (
      <button
        type="button"
        onClick={onPress}
        style={base}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = '';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        }}
      >
        {inner}
      </button>
    );
  }

  return <div style={base}>{inner}</div>;
};
