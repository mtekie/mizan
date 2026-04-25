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
import { ProductCard } from '../../components/marketplace/ProductCard';

export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.providers.get(id as string);
        setProvider(data);
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

      <FlatList
        data={provider.products}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={(
          <View style={styles.header}>
            <View style={styles.heroCard}>
              <View style={styles.brandRow}>
                {provider.logoUrl ? (
                  <Image source={{ uri: provider.logoUrl }} style={styles.logo} />
                ) : (
                  <View style={[styles.logoPlaceholder, { backgroundColor: provider.brandColor || MizanColors.mintPrimary }]}>
                    <Building2 color="#fff" size={32} />
                  </View>
                )}
                <View style={styles.brandInfo}>
                  <Text style={styles.name}>{provider.name}</Text>
                  <Text style={styles.type}>{provider.type} • {provider.tier || 'Tier 1'}</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Trophy size={18} color={MizanColors.mintPrimary} />
                  <Text style={styles.statValue}>{provider._count?.products || 0}</Text>
                  <Text style={styles.statLabel}>Products</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Users size={18} color={MizanColors.mintPrimary} />
                  <Text style={styles.statValue}>4.8</Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>
                {provider.description || 'A leading financial institution dedicated to providing innovative solutions to the Ethiopian market.'}
              </Text>
            </View>

            <View style={styles.contactSection}>
               {provider.website && (
                 <View style={styles.contactItem}>
                   <Globe size={16} color={MizanColors.textMuted} />
                   <Text style={styles.contactText}>{provider.website}</Text>
                 </View>
               )}
               {provider.address && (
                 <View style={styles.contactItem}>
                   <MapPin size={16} color={MizanColors.textMuted} />
                   <Text style={styles.contactText}>{provider.address}</Text>
                 </View>
               )}
            </View>

            <View style={styles.productsHeader}>
              <Text style={styles.sectionTitle}>Offered Products</Text>
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <ProductCard 
              product={item} 
              onPress={() => router.push(`/product/${item.id}`)}
            />
          </View>
        )}
        contentContainerStyle={styles.scrollContent}
        ListEmptyComponent={(
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products listed for this institution yet.</Text>
          </View>
        )}
      />
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
  }
});
