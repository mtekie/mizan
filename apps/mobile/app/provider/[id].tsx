import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  ActivityIndicator,
  FlatList
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MizanColors, MizanRadii, MizanSpacing } from '@mizan/ui-tokens';
import { 
  ChevronLeft, 
  Globe, 
  MapPin, 
  Phone, 
  Info,
  Building2,
  Trophy,
  Users
} from 'lucide-react-native';
import { api } from '../../lib/api';
import { CatalogueProductCardVM, ProviderDetailDataContract } from '@mizan/shared';

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [provider, setProvider] = useState<ProviderDetailDataContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.providers.screen(id as string);
        setProvider(data.providerDetail);
      } catch (err: any) {
        console.error('Failed to fetch provider detail:', err);
        setError('Failed to load institution details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={MizanColors.mintPrimary} />
      </View>
    );
  }

  if (error || !provider) {
    return (
      <View style={styles.loadingContainer}>
        <Info size={48} color={MizanColors.textMuted} />
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>{error || 'Institution not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
          <ChevronLeft size={24} color={MizanColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Institution Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.heroCard}>
            <View style={styles.brandRow}>
              <View style={[styles.logoPlaceholder, { backgroundColor: provider.brandColor || MizanColors.mintPrimary }]}>
                <Building2 color="#fff" size={32} />
              </View>
              <View style={styles.brandInfo}>
                <Text style={styles.name}>{provider.name}</Text>
                {provider.nameAmh && <Text style={styles.nameAmh}>{provider.nameAmh}</Text>}
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Building2 size={18} color={MizanColors.mintPrimary} />
                <Text style={styles.statValue}>{provider.stats.productCount}</Text>
                <Text style={styles.statLabel}>Products</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Trophy size={18} color={MizanColors.mintPrimary} />
                <Text style={styles.statValue}>{provider.stats.interestRange}</Text>
                <Text style={styles.statLabel}>Interest Range</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Globe size={18} color={MizanColors.mintPrimary} />
                <Text style={styles.statValue}>{provider.stats.hasDigital ? 'Yes' : 'No'}</Text>
                <Text style={styles.statLabel}>Digital Access</Text>
              </View>
            </View>
          </View>

          <View style={styles.badgesRow}>
             {provider.badges.isEsxListed && <Text style={styles.badgeText}>ESX Listed</Text>}
             {provider.badges.hasInterestFree && <Text style={styles.badgeText}>Interest-Free Available</Text>}
             {provider.badges.isMfi && <Text style={styles.badgeText}>MFI</Text>}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{provider.description}</Text>
          </View>

          {provider.creditProducts.length > 0 && (
            <View style={styles.productsHeader}>
              <Text style={styles.sectionTitle}>Credit Products ({provider.creditProducts.length})</Text>
              {provider.creditProducts.map((item: CatalogueProductCardVM) => (
                <TouchableOpacity key={item.id} style={styles.simpleCard} onPress={() => router.push(`/product/${item.id}`)}>
                   <View style={styles.cardHeader}>
                     <Text style={styles.cardTitle}>{item.title}</Text>
                     {item.highlight && <Text style={styles.cardHighlight}>{item.highlight}</Text>}
                   </View>
                   <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                   <View style={styles.cardFooter}>
                     <Text style={styles.cardInterest}>Interest: {item.interestDisplay}</Text>
                     {item.maxAmountDisplay && <Text style={styles.cardMetric}>{item.maxAmountDisplay}</Text>}
                   </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {provider.savingsProducts.length > 0 && (
            <View style={styles.productsHeader}>
              <Text style={styles.sectionTitle}>Savings Products ({provider.savingsProducts.length})</Text>
              {provider.savingsProducts.map((item: CatalogueProductCardVM) => (
                <TouchableOpacity key={item.id} style={styles.simpleCard} onPress={() => router.push(`/product/${item.id}`)}>
                   <View style={styles.cardHeader}>
                     <Text style={styles.cardTitle}>{item.title}</Text>
                     {item.isInterestFree && <Text style={styles.cardHighlight}>Interest-Free</Text>}
                   </View>
                   <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                   <View style={styles.cardFooter}>
                     <Text style={styles.cardInterest}>Interest: {item.interestDisplay}</Text>
                     {item.minBalanceDisplay && <Text style={styles.cardMetric}>{item.minBalanceDisplay}</Text>}
                   </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MizanColors.mintBg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MizanColors.mintBg,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#fff',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 20,
  },
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: MizanRadii.xl,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: MizanRadii.lg,
    marginRight: 16,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: MizanRadii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  brandInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
    marginBottom: 4,
  },
  type: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MizanColors.mintBg,
    borderRadius: MizanRadii.lg,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: MizanColors.borderMuted,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
    marginVertical: 2,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textMuted,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
    lineHeight: 24,
  },
  contactSection: {
    marginBottom: 32,
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
  },
  productsHeader: {
    marginBottom: 16,
  },
  productItem: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: MizanColors.mintPrimary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: MizanRadii.md,
  },
  retryText: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  nameAmh: {
    fontSize: 14,
    color: MizanColors.textSecondary,
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  badgeText: {
    backgroundColor: MizanColors.mintBg,
    color: MizanColors.mintPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    overflow: 'hidden',
  },
  simpleCard: {
    backgroundColor: '#fff',
    borderRadius: MizanRadii.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: MizanColors.borderMuted,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
    flex: 1,
  },
  cardHighlight: {
    fontSize: 10,
    backgroundColor: MizanColors.mintPrimary + '20',
    color: MizanColors.mintPrimary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontFamily: 'Inter_700Bold',
    overflow: 'hidden',
  },
  cardDesc: {
    fontSize: 13,
    color: MizanColors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: MizanColors.borderMuted,
    paddingTop: 12,
  },
  cardInterest: {
    fontSize: 12,
    color: MizanColors.mintPrimary,
    fontFamily: 'Inter_700Bold',
  },
  cardMetric: {
    fontSize: 12,
    color: MizanColors.textPrimary,
    fontFamily: 'Inter_600SemiBold',
  }
});
