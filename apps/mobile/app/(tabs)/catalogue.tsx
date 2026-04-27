import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MizanColors, MizanRadii } from '@mizan/ui-tokens';
import { Search, SlidersHorizontal, Bell, Info } from 'lucide-react-native';
import { api } from '../../lib/api';
import { AppScreenShell } from '../../components/ui/AppScreenShell';
import { productCategories } from '@mizan/shared';

// Marketplace Components
import { CategoryPill } from '../../components/marketplace/CategoryPill';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { ProfileBridge } from '../../components/marketplace/ProfileBridge';

const CATEGORY_ICONS: Record<string, string> = {
  all: '✨',
  SAVINGS: '💰',
  CREDIT: '🏦',
  INSURANCE: '🛡️',
  PAYMENT: '📱',
  CAPITAL_MARKET: '📈',
  COMMUNITY: '🤝',
};

const CATEGORIES = productCategories.map(category => ({
  id: category.key,
  label: category.label,
  icon: CATEGORY_ICONS[category.key] || '•',
}));

export default function CatalogueScreen() {
  const router = useRouter();
  const routeParams = useLocalSearchParams<{
    digital?: string;
    interestFree?: string;
    providerIds?: string;
    audience?: string;
  }>();
  const initialLoadDone = useRef(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [providers, setProviders] = useState<any[]>([]);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [completeness, setCompleteness] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [productTotal, setProductTotal] = useState(0);
  const PAGE_SIZE = 10;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchInitialData(), fetchProducts(activeCategory, search, activeProvider, 0)]);
    setRefreshing(false);
  }, [activeCategory, search, activeProvider]);

  // Fetch profile + featured + providers once on mount
  const fetchInitialData = useCallback(async () => {
    try {
      const [profile, featured, allProviders] = await Promise.all([
        api.profile.get().catch(() => null),
        api.products.list({ take: '10' }).catch(() => []),
        api.providers.list().catch(() => [])
      ]);

      if (profile) {
        const fields = ['gender', 'employmentStatus', 'monthlyIncomeRange', 'financialPriority'];
        const filled = fields.filter(f => !!(profile as any)[f]).length;
        setCompleteness(filled / fields.length);
      } else {
        setCompleteness(0);
      }

      setFeaturedProducts(featured);
      setProviders(allProviders);
    } catch (e) {
      console.error('Failed to fetch initial catalogue data:', e);
    }
  }, []);

  // Fetch filtered products whenever category, search, or provider changes
  const fetchProducts = useCallback(async (category: string, searchTerm: string, providerId: string | null, currentSkip: number = 0) => {
    try {
      if (currentSkip === 0) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const params: Record<string, string> = {
        skip: currentSkip.toString(),
        take: PAGE_SIZE.toString()
      };
      if (category !== 'all') params.class = category;
      if (searchTerm) params.search = searchTerm;
      if (providerId) params.providerId = providerId;
      if (routeParams.providerIds) params.providerIds = String(routeParams.providerIds);
      if (routeParams.digital === 'true') params.digital = 'true';
      if (routeParams.interestFree === 'true') params.interestFree = 'true';
      if (routeParams.audience) params.audience = String(routeParams.audience);
      
      const page = await api.products.listPage(params);
      const allArray = Array.isArray(page.data) ? page.data : [];
      
      if (currentSkip === 0) {
        setProducts(allArray);
      } else {
        setProducts(prev => [...(Array.isArray(prev) ? prev : []), ...allArray]);
      }
      
      setHasMore(Boolean(page.hasMore));
      setProductTotal(page.total ?? allArray.length);
      setSkip(currentSkip);
    } catch (e: any) {
      setError('Could not load products. Make sure the server is running.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [routeParams.audience, routeParams.digital, routeParams.interestFree, routeParams.providerIds]);

  // Initial load
  useEffect(() => {
    const init = async () => {
      await fetchInitialData();
      await fetchProducts('all', '', null, 0);
      initialLoadDone.current = true;
    };
    init();
  }, [fetchInitialData, fetchProducts]);

  // Re-fetch products when filters change (after initial load)
  useEffect(() => {
    if (!initialLoadDone.current) return;
    fetchProducts(activeCategory, search, activeProvider, 0);
  }, [activeCategory, activeProvider, fetchProducts, search]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchProducts(activeCategory, search, activeProvider, skip + PAGE_SIZE);
  };


  const handleSearch = () => {
    fetchProducts(activeCategory, search, activeProvider, 0);
  };

  const handleSeeAllFeatured = () => {
    setActiveCategory('all');
    setActiveProvider(null);
    setSearch('');
    fetchProducts('all', '', null, 0);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={MizanColors.textMuted} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search banks, loans, insurance..."
            placeholderTextColor={MizanColors.textMuted}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => router.push({
            pathname: '/filter',
            params: {
              digital: routeParams.digital,
              interestFree: routeParams.interestFree,
              providerIds: routeParams.providerIds,
              audience: routeParams.audience,
            },
          })}
        >
          <SlidersHorizontal size={20} color={MizanColors.mintPrimary} />
        </TouchableOpacity>
      </View>

      {(routeParams.digital === 'true' || routeParams.interestFree === 'true' || routeParams.audience || routeParams.providerIds) && (
        <View style={styles.activeFiltersRow}>
          {routeParams.digital === 'true' && <Text style={styles.activeFilter}>Digital</Text>}
          {routeParams.interestFree === 'true' && <Text style={styles.activeFilter}>Interest-free</Text>}
          {routeParams.audience === 'student' && <Text style={styles.activeFilter}>Student</Text>}
          {routeParams.audience === 'salaried' && <Text style={styles.activeFilter}>Salaried</Text>}
          {routeParams.providerIds && <Text style={styles.activeFilter}>Providers</Text>}
          <TouchableOpacity onPress={() => router.replace('/(tabs)/catalogue')}>
            <Text style={styles.clearFiltersInline}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {CATEGORIES.map(cat => (
          <CategoryPill 
            key={cat.id}
            label={cat.label}
            icon={cat.icon}
            isActive={activeCategory === cat.id}
            onPress={() => setActiveCategory(cat.id)}
          />
        ))}
      </ScrollView>

      {/* Institution Filter Strip */}
      <View style={styles.institutionSection}>
        <Text style={styles.institutionTitle}>Institutions</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.institutionScroll}
          contentContainerStyle={styles.institutionContent}
        >
          <TouchableOpacity 
            style={[styles.institutionCard, !activeProvider && styles.institutionCardActive]}
            onPress={() => setActiveProvider(null)}
          >
            <Text style={[styles.institutionLabel, !activeProvider && styles.institutionLabelActive]}>All Banks</Text>
          </TouchableOpacity>
          {providers.map(p => (
            <TouchableOpacity 
              key={p.id}
              style={[styles.institutionCard, activeProvider === p.id && styles.institutionCardActive]}
              onPress={() => setActiveProvider(p.id)}
            >
              <Text style={[styles.institutionLabel, activeProvider === p.id && styles.institutionLabelActive]}>{p.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const renderFeatured = () => {
    if (activeCategory !== 'all' || featuredProducts.length === 0) return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured for You</Text>
          <TouchableOpacity onPress={handleSeeAllFeatured}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredContent}
        >
          {(Array.isArray(featuredProducts) ? featuredProducts : []).slice(0, 5).map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              variant="featured"
              onPress={() => router.push(`/product/${p.id}`)}
            />
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderListHeader = () => (
    <>
      {renderHeader()}
      <ProfileBridge completeness={completeness} />
      {renderFeatured()}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {activeCategory === 'all' ? 'All Products' : CATEGORIES.find(c => c.id === activeCategory)?.label || 'Products'}
        </Text>
        <Text style={styles.countText}>{productTotal || products.length} found</Text>
      </View>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </>
  );

  return (
    <AppScreenShell
      title="Find"
      subtitle="Discover financial products tailored for your goals"
      variant="hero"
      scrollable={false}
      onRefresh={onRefresh}
      refreshing={refreshing}
      actions={
        <TouchableOpacity style={styles.iconButtonHeader} onPress={() => router.push('/notifications')}>
          <Bell size={24} color={MizanColors.textPrimary} />
        </TouchableOpacity>
      }
    >
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        renderItem={({ item }) => (
          <View style={styles.listItemContainer}>
             <ProductCard 
                product={item} 
                onPress={() => router.push(`/product/${item.id}`)}
              />
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <View style={{ paddingBottom: 40 }}>
            {loadingMore && <ActivityIndicator size="small" color={MizanColors.mintPrimary} style={{ paddingVertical: 20 }} />}
            {!loadingMore && products.length > 0 && (
              <View style={styles.catalogueFooter}>
                <Info size={14} color={MizanColors.textMuted} />
                <Text style={styles.catalogueDisclaimer}>
                  Product data is updated weekly. Specific terms and interest rates may vary by branch.
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={MizanColors.mintPrimary} style={{ marginTop: 40 }} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>No Products Found</Text>
              <Text style={styles.emptyText}>
                {activeCategory !== 'all' 
                  ? `No ${CATEGORIES.find(c => c.id === activeCategory)?.label || ''} products available yet.`
                  : 'No products matching your criteria. Try a provider name, product type, or a broader filter.'}
              </Text>
              {(activeCategory !== 'all' || activeProvider || search) && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => {
                    setActiveCategory('all');
                    setActiveProvider(null);
                    setSearch('');
                    fetchProducts('all', '', null, 0);
                  }}
                >
                  <Text style={styles.clearButtonText}>Clear filters</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        }
        contentContainerStyle={styles.scrollContent}
      />
    </AppScreenShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
    paddingBottom: 12,
  },
  iconButtonHeader: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchBarContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: MizanRadii.md,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#0F172A',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: MizanRadii.md,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeFiltersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: -10,
    marginBottom: 18,
  },
  activeFilter: {
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: MizanColors.mintPrimary + '12',
    color: MizanColors.mintPrimary,
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  clearFiltersInline: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textSecondary,
  },
  categoryScroll: {
    marginHorizontal: -24,
  },
  categoryContent: {
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintPrimary,
  },
  countText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
  },
  featuredContent: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  listItemContainer: {
    paddingHorizontal: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    textAlign: 'center',
  },
  clearButton: {
    marginTop: 18,
    backgroundColor: MizanColors.mintPrimary,
    borderRadius: MizanRadii.md,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  clearButtonText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  errorBanner: {
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: MizanRadii.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: '#DC2626',
    textAlign: 'center',
  },
  institutionSection: {
    marginTop: 20,
  },
  institutionTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  institutionScroll: {
    marginHorizontal: -24,
  },
  institutionContent: {
    paddingHorizontal: 24,
    gap: 8,
  },
  institutionCard: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  institutionCardActive: {
    backgroundColor: MizanColors.mintPrimary,
    borderColor: MizanColors.mintPrimary,
  },
  institutionLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
  institutionLabelActive: {
    color: '#fff',
  },
  catalogueFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 40,
    marginTop: 20,
    opacity: 0.6,
  },
  catalogueDisclaimer: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
