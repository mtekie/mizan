'use client';

import React from 'react';
import type { AccountCardProps } from './AccountCard';

export const AccountCard: React.FC<AccountCardProps> = ({
  name, balance, type, color, icon, onPress,
}) => {
  const base: React.CSSProperties = {
    width: 160, height: 100, borderRadius: 16,
    padding: 14, marginRight: 12, flexShrink: 0,
    background: color,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
    fontFamily: 'Inter, system-ui, sans-serif',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: onPress ? 'pointer' : 'default',
    border: 'none',
    textAlign: 'left',
  };

  const content = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.8 }}>
          {type.toUpperCase()}
        </span>
        {icon && <span style={{ color: 'rgba(255,255,255,0.8)' }}>{icon}</span>}
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{balance}</div>
      </div>
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
          (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(0,0,0,0.22)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transform = '';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }}
      >
        {content}
      </button>
    );
  }

  return <div style={base}>{content}</div>;
};
