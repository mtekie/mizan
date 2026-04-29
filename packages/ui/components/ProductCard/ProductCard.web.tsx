'use client';

import React from 'react';
import type { ProductCardProps } from './ProductCard';

export const ProductCard: React.FC<ProductCardProps> = ({
  product, variant = 'list', onPress, trustLabel, trustTone = 'good', facts = [], score,
}) => {
  const isFeatured = variant === 'featured';
  const providerName = product.provider?.name ?? 'Unknown';
  const logoUrl = product.provider?.logoUrl;
  const brandColor = product.provider?.brandColor ?? '#45BFA0';
  const displayScore = score ?? product.personalizedScore ?? product.matchScore ?? 50;
  const title = (product.title ?? product.name ?? 'Product') as string;
  const typeLabel = (product.productType ?? product.productClass ?? product.category ?? '') as string;

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    padding: 16,
    border: '1px solid #F1F5F9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    cursor: onPress ? 'pointer' : 'default',
    fontFamily: 'Inter, system-ui, sans-serif',
    transition: 'box-shadow 0.2s, transform 0.2s',
    ...(isFeatured ? { width: 280, height: 180, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } : { marginBottom: 12 }),
  };

  const inner = (
    <>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          {logoUrl ? (
            <img src={logoUrl} alt={providerName} style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'contain', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: 8, background: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{providerName.charAt(0)}</span>
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{providerName}</div>
            {typeLabel && <div style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', letterSpacing: 0.5, textTransform: 'uppercase' }}>{typeLabel}</div>}
          </div>
        </div>
        <div style={{ background: 'rgba(69,191,160,0.1)', borderRadius: 8, padding: '4px 10px', flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#45BFA0' }}>{displayScore}</span>
        </div>
      </div>

      {/* Title */}
      <div style={{ fontSize: 15, fontWeight: 700, color: '#1E293B', marginBottom: 10, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {title}
      </div>

      {/* Trust */}
      {trustLabel && (
        <div style={{ fontSize: 10, fontWeight: 600, color: trustTone === 'warn' ? '#B45309' : '#45BFA0', marginBottom: 10 }}>
          {trustTone === 'good' ? '✓ ' : '⚠ '}{trustLabel}
        </div>
      )}

      {/* Facts */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {facts.slice(0, isFeatured ? 2 : 3).map(f => (
          <div key={f.label}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 0.5 }}>{f.label}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#45BFA0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 92 }}>{f.value}</div>
          </div>
        ))}
        {product.isFeatured && (
          <span style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623', fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>★ Featured</span>
        )}
      </div>
    </>
  );

  if (onPress) {
    return (
      <button
        type="button"
        onClick={onPress}
        style={{ ...cardStyle, width: isFeatured ? 280 : '100%', border: '1px solid #F1F5F9', textAlign: 'left' }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
          (e.currentTarget as HTMLElement).style.transform = '';
        }}
      >
        {inner}
      </button>
    );
  }

  return <div style={cardStyle}>{inner}</div>;
};
