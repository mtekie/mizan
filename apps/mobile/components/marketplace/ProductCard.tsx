import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MizanColors, MizanRadii } from '@mizan/ui-tokens';
import { ScoreBadge } from './ScoreBadge';
import { CheckCircle2, Star, AlertTriangle } from 'lucide-react-native';
import { getProductFacts, getProductProviderName, getProductTitle, getProductTrustMeta, labelProductType } from '@mizan/shared';

interface ProductCardProps {
  product: any;
  onPress?: () => void;
  variant?: 'list' | 'featured';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, variant = 'list' }) => {
  const isFeatured = variant === 'featured';
  const facts = getProductFacts(product, 3);
  const providerName = getProductProviderName(product);
  const trust = getProductTrustMeta(product);

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={onPress}
      style={[styles.card, isFeatured && styles.cardFeatured]}
    >
      <View style={styles.header}>
        <View style={styles.providerInfo}>
          {product.provider?.logoUrl ? (
            <Image 
              source={{ uri: product.provider.logoUrl }} 
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.logoPlaceholder, { backgroundColor: product.provider?.brandColor || MizanColors.mintPrimary }]}>
              <Text style={styles.logoText}>{product.provider?.name?.charAt(0)}</Text>
            </View>
          )}
          <View>
            <Text style={styles.providerName} numberOfLines={1}>
              {providerName}
            </Text>
            <Text style={styles.productType}>
              {labelProductType(product.productType || product.productClass || product.category)}
            </Text>
          </View>
        </View>
        <ScoreBadge score={product.personalizedScore || product.matchScore || 50} size="sm" />
      </View>

      <Text style={styles.title} numberOfLines={2}>{getProductTitle(product)}</Text>

      <View style={styles.trustRow}>
        {trust.tone === 'good' ? (
          <CheckCircle2 size={12} color={MizanColors.mintPrimary} />
        ) : (
          <AlertTriangle size={12} color="#B45309" />
        )}
        <Text style={[styles.trustText, trust.tone === 'warn' && styles.trustTextWarn]} numberOfLines={1}>
          {trust.label} · {trust.freshness}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.metrics}>
          {facts.slice(0, isFeatured ? 2 : 3).map(fact => (
            <View key={`${fact.label}-${fact.value}`} style={styles.metric}>
              <Text style={styles.metricLabel}>{fact.label}</Text>
              <Text style={styles.metricValue} numberOfLines={1}>{fact.value}</Text>
            </View>
          ))}
        </View>
        
        {product.isFeatured && (
           <View style={styles.featuredBadge}>
              <Star size={10} color={MizanColors.mintGold} fill={MizanColors.mintGold} />
              <Text style={styles.featuredText}>Featured</Text>
           </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: MizanRadii.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: MizanColors.borderMuted,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardFeatured: {
    width: 280,
    marginRight: 16,
    height: 180,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 10,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  providerName: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
  },
  productType: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textMuted,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
    marginBottom: 12,
    lineHeight: 22,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  trustText: {
    flex: 1,
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.mintPrimary,
  },
  trustTextWarn: {
    color: '#B45309',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  metrics: {
    flexDirection: 'row',
    flex: 1,
    gap: 12,
  },
  metric: {
    flexDirection: 'column',
    maxWidth: 92,
  },
  metricLabel: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textMuted,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintPrimary,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: MizanColors.mintGold + '10',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  featuredText: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintGold,
    textTransform: 'uppercase',
  }
});
