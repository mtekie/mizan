import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  FlatList,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { MizanColors, MizanTypography, MizanSpacing, MizanRadii } from '@mizan/ui-tokens';
import { Search, SlidersHorizontal, Bell } from 'lucide-react-native';
import { api } from '../../lib/api';

// Marketplace Components
import { CategoryPill } from '../../components/marketplace/CategoryPill';
import { ProductCard } from '../../components/marketplace/ProductCard';
import { ProfileBridge } from '../../components/marketplace/ProfileBridge';

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'SAVINGS', label: 'Savings', icon: '💰' },
  { id: 'CREDIT', label: 'Loans', icon: '🏦' },
  { id: 'INSURANCE', label: 'Insurance', icon: '🛡️' },
  { id: 'PAYMENT', label: 'Payments', icon: '📱' },
  { id: 'COMMUNITY', label: 'Community', icon: '🤝' },
];

export default function CatalogueScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [completeness, setCompleteness] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;
  const initialLoadDone = useRef(false);

  // Fetch profile + featured once on mount
  const fetchInitialData = useCallback(async () => {
    // 1. Profile (skip if guest)
    try {
      const user = await api.profile.get();
      if (user) {
        const fields = ['gender', 'employmentStatus', 'monthlyIncomeRange', 'financialPriority'];
        const filled = fields.filter(f => !!(user as any)[f]).length;
        setCompleteness(filled / fields.length);
      }
    } catch (e) {
      console.log('Guest mode - no personalization');
      setCompleteness(0);
    }

    // 2. Featured products (unfiltered)
    try {
      const featured = await api.products.list({ take: '10' });
      setFeaturedProducts(featured);
    } catch (e) {
      console.log('Failed to fetch featured products:', e);
      setFeaturedProducts([]);
    }
  }, []);

  // Fetch filtered products whenever category or search changes
  const fetchProducts = useCallback(async (category: string, searchTerm: string, currentSkip: number = 0) => {
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
      
      const all = await api.products.list(params);
      
      if (currentSkip === 0) {
        setProducts(all);
      } else {
        setProducts(prev => [...prev, ...all]);
      }
      
      setHasMore(all.length === PAGE_SIZE);
      setSkip(currentSkip);
    } catch (e: any) {
      console.error('Failed to fetch products:', e);
      setError('Could not load products. Make sure the server is running.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const init = async () => {
      await fetchInitialData();
      await fetchProducts('all', '', 0);
      initialLoadDone.current = true;
    };
    init();
  }, []);

  // Re-fetch products when category changes (after initial load)
  useEffect(() => {
    if (!initialLoadDone.current) return;
    fetchProducts(activeCategory, search, 0);
  }, [activeCategory]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchProducts(activeCategory, search, skip + PAGE_SIZE);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInitialData();
    await fetchProducts(activeCategory, search, 0);
    setRefreshing(false);
  };

  const handleSearch = () => {
    fetchProducts(activeCategory, search, 0);
  };

  const handleSeeAllFeatured = () => {
    // For now, just scroll to all products or we could implement a featured-only filter
    // Let's reset search and category to 'all' to show everything
    setActiveCategory('all');
    setSearch('');
    fetchProducts('all', '', 0);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>Marketplace</Text>
          <Text style={styles.subtitle}>Smart financial choices for you</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={24} color={MizanColors.textPrimary} />
        </TouchableOpacity>
      </View>

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
        <TouchableOpacity style={styles.filterButton} onPress={() => router.push('/filter')}>
          <SlidersHorizontal size={20} color={MizanColors.mintPrimary} />
        </TouchableOpacity>
      </View>

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
          {featuredProducts.slice(0, 5).map(p => (
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
        <Text style={styles.countText}>{products.length} found</Text>
      </View>
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={MizanColors.mintPrimary} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color={MizanColors.mintPrimary} style={{ paddingVertical: 20 }} />
          ) : null
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
                  : 'No products matching your criteria.'}
              </Text>
            </View>
          )
        }
        contentContainerStyle={styles.scrollContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MizanColors.mintBg,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 24,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
    marginTop: 2,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: MizanColors.borderMuted,
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
    borderColor: MizanColors.borderMuted,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: MizanColors.textPrimary,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: MizanRadii.md,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: MizanColors.borderMuted,
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
    color: MizanColors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintPrimary,
  },
  countText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
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
    color: MizanColors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    textAlign: 'center',
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
  }
});
