import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MizanColors, MizanRadii, MizanComponentTokens } from '@mizan/ui-tokens';
import type { ProductCardProps } from './ProductCard';

const T = MizanComponentTokens.productCard;

export const ProductCard: React.FC<ProductCardProps> = ({
  product, variant = 'list', onPress, trustLabel, trustTone = 'good', facts = [], score,
}) => {
  const isFeatured = variant === 'featured';
  const providerName = product.provider?.name ?? 'Unknown';
  const logoUrl = product.provider?.logoUrl;
  const brandColor = product.provider?.brandColor ?? MizanColors.mintPrimary;
  const displayScore = score ?? product.personalizedScore ?? product.matchScore ?? 50;
  const title = (product.title ?? product.name ?? 'Product') as string;
  const typeLabel = (product.productType ?? product.productClass ?? product.category ?? '') as string;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, isFeatured && styles.cardFeatured]}
    >
      <View style={styles.header}>
        <View style={styles.providerRow}>
          {logoUrl ? (
            <Image source={{ uri: logoUrl }} style={styles.logo} resizeMode="contain" />
          ) : (
            <View style={[styles.logoBg, { backgroundColor: brandColor }]}>
              <Text style={styles.logoLetter}>{providerName.charAt(0)}</Text>
            </View>
          )}
          <View>
            <Text style={styles.providerName} numberOfLines={1}>{providerName}</Text>
            {typeLabel ? <Text style={styles.typeLabel}>{typeLabel.toUpperCase()}</Text> : null}
          </View>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: `${MizanColors.mintPrimary}18` }]}>
          <Text style={styles.scoreText}>{displayScore}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>{title}</Text>

      {trustLabel && (
        <View style={styles.trustRow}>
          <Text style={[styles.trustText, trustTone === 'warn' && styles.trustWarn]}>
            {trustTone === 'good' ? '✓ ' : '⚠ '}{trustLabel}
          </Text>
        </View>
      )}

      <View style={styles.facts}>
        {facts.slice(0, isFeatured ? 2 : 3).map(f => (
          <View key={f.label} style={styles.fact}>
            <Text style={styles.factLabel}>{f.label}</Text>
            <Text style={styles.factValue} numberOfLines={1}>{f.value}</Text>
          </View>
        ))}
        {product.isFeatured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>★ Featured</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: MizanRadii.lg, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: MizanColors.borderMuted,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cardFeatured: { width: 280, marginRight: 16, height: 180, justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  providerRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  logo: { width: 32, height: 32, borderRadius: 8, marginRight: 10 },
  logoBg: { width: 32, height: 32, borderRadius: 8, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  logoLetter: { color: '#fff', fontSize: 14, fontFamily: 'Inter_700Bold' },
  providerName: { fontSize: 12, fontFamily: 'Inter_400Regular', color: MizanColors.textSecondary },
  typeLabel: { fontSize: 9, fontFamily: 'Inter_700Bold', color: MizanColors.textMuted, letterSpacing: 0.5 },
  scoreBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' },
  scoreText: { fontSize: 13, fontFamily: 'Inter_900Black', color: MizanColors.mintPrimary },
  title: { fontSize: T.titleSize, fontFamily: 'Inter_700Bold', color: MizanColors.textPrimary, marginBottom: 10, lineHeight: 22 },
  trustRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  trustText: { fontSize: 10, fontFamily: 'Inter_600SemiBold', color: MizanColors.mintPrimary },
  trustWarn: { color: '#B45309' },
  facts: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' },
  fact: { flexDirection: 'column', maxWidth: 92 },
  factLabel: { fontSize: 9, fontFamily: 'Inter_700Bold', color: MizanColors.textMuted, textTransform: 'uppercase' },
  factValue: { fontSize: 13, fontFamily: 'Inter_700Bold', color: MizanColors.mintPrimary },
  featuredBadge: { backgroundColor: `${MizanColors.mintGold}18`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  featuredText: { fontSize: 9, fontFamily: 'Inter_700Bold', color: MizanColors.mintGold },
});
