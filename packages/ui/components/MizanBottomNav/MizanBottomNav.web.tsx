'use client';

import React from 'react';
import type { MizanBottomNavProps } from './MizanBottomNav';

export const MizanBottomNav: React.FC<MizanBottomNavProps> = ({
  tabs, activeTab, onTabPress,
}) => (
  <nav
    role="navigation"
    aria-label="Bottom navigation"
    style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      height: 64,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderTop: '1px solid #F1F5F9',
      padding: '0 16px 4px',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}
  >
    {tabs.map(tab => {
      const isActive = activeTab === tab.name;
      return (
        <button
          key={tab.name}
          type="button"
          onClick={() => onTabPress(tab.name)}
          aria-current={isActive ? 'page' : undefined}
          aria-label={tab.label}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '6px 12px', border: 'none', background: 'transparent',
            cursor: 'pointer', minWidth: 56,
            color: isActive ? '#45BFA0' : '#94A3B8',
            transition: 'color 0.15s',
          }}
        >
          {isActive ? (
            <span style={{
              background: 'rgba(69,191,160,0.1)', borderRadius: 12,
              padding: '4px 12px', display: 'flex', alignItems: 'center',
            }}>
              {tab.icon}
            </span>
          ) : tab.icon}
          <span style={{
            fontSize: 10, fontWeight: isActive ? 700 : 400,
            color: isActive ? '#1E293B' : '#94A3B8',
          }}>
            {tab.label}
          </span>
        </button>
      );
    })}
  </nav>
);
