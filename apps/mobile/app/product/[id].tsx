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
  Dimensions,
  Share
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MizanColors, MizanRadii, MizanSpacing } from '@mizan/ui-tokens';
import { 
  ChevronLeft, 
  Bookmark, 
  Share2, 
  Star, 
  Info, 
  CheckCircle2,
  Building2,
  Calendar,
  Percent,
  Wallet
} from 'lucide-react-native';
import { api } from '../../lib/api';
import { ScoreBadge } from '../../components/marketplace/ScoreBadge';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching product detail for:', id);
        const data = await api.products.get(id as string);
        if (!data) throw new Error('No product data returned');
        setProduct(data);
        setIsBookmarked(data.isBookmarked);
      } catch (err: any) {
        console.error(`Failed to fetch product detail for ID ${id}:`, err);
        setError(err.message || `Failed to load product details for ${id}`);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const toggleBookmark = async () => {
    try {
      const method = isBookmarked ? 'DELETE' : 'POST';
      await api.products.bookmark(id as string, method);
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const handleApply = async () => {
    try {
      setSubmitting(true);
      await api.products.apply(id as string);
      alert('Application submitted successfully!');
    } catch (error) {
      console.error('Failed to apply:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.name} from ${product.provider?.name} on Mizan!`,
      });
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={MizanColors.mintPrimary} />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.loadingContainer}>
        <Info size={48} color={MizanColors.textMuted} />
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>{error || 'Product not found'}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => router.replace('/(tabs)/catalogue')}
        >
          <Text style={styles.retryText}>Back to Catalogue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.navButton}>
            <ChevronLeft size={24} color={MizanColors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.navActions}>
            <TouchableOpacity onPress={handleShare} style={styles.navButton}>
              <Share2 size={20} color={MizanColors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleBookmark} style={styles.navButton}>
              <Bookmark 
                size={20} 
                color={isBookmarked ? MizanColors.mintPrimary : MizanColors.textPrimary}
                fill={isBookmarked ? MizanColors.mintPrimary : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <TouchableOpacity 
            style={styles.providerRow}
            onPress={() => product.provider?.id && router.push(`/provider/${product.provider.id}`)}
          >
             {product.provider?.logoUrl && (
               <Image source={{ uri: product.provider.logoUrl }} style={styles.providerLogo} />
             )}
             <Text style={styles.providerName}>{product.provider?.name}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{product.name}</Text>
          
          <View style={styles.badgeRow}>
            <ScoreBadge score={product.personalizedScore} />
            {product.isVerified && (
               <View style={styles.verifiedBadge}>
                 <CheckCircle2 size={14} color={MizanColors.mintPrimary} />
                 <Text style={styles.verifiedText}>Verified</Text>
               </View>
            )}
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricIconBox}>
              <Percent size={18} color={MizanColors.mintPrimary} />
            </View>
            <Text style={styles.metricLabel}>Rate</Text>
            <Text style={styles.metricValue}>{product.interestRate ? `${product.interestRate}%` : 'Variable'}</Text>
          </View>
          <View style={styles.metricCard}>
            <View style={styles.metricIconBox}>
              <Calendar size={18} color={MizanColors.mintPrimary} />
            </View>
            <Text style={styles.metricLabel}>Term</Text>
            <Text style={styles.metricValue}>{product.attributes?.term || 'Flexible'}</Text>
          </View>
          <View style={styles.metricCard}>
            <View style={styles.metricIconBox}>
              <Wallet size={18} color={MizanColors.mintPrimary} />
            </View>
            <Text style={styles.metricLabel}>Amount</Text>
            <Text style={styles.metricValue}>{product.attributes?.maxAmount || 'Varies'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {product.eligibility?.map((item: string, idx: number) => (
            <View key={idx} style={styles.requirementRow}>
              <CheckCircle2 size={16} color={MizanColors.textMuted} />
              <Text style={styles.requirementText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.providerSection}>
           <Text style={styles.sectionTitle}>About {product.provider?.name}</Text>
           <View style={styles.providerCard}>
             <Building2 size={24} color={MizanColors.textMuted} />
             <View style={styles.providerInfo}>
               <Text style={styles.providerTier}>{product.provider?.tier || 'Tier 1'} Bank</Text>
               <Text style={styles.providerDesc}>{product.provider?.description || 'Leading financial institution in Ethiopia.'}</Text>
             </View>
           </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.applyButton}
          onPress={handleApply}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.applyButtonText}>Apply Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MizanColors.mintBg,
  },
  safeArea: {
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navActions: {
    flexDirection: 'row',
    gap: 8,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  hero: {
    padding: 24,
    backgroundColor: '#fff',
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerLogo: {
    width: 24,
    height: 24,
    borderRadius: 6,
    marginRight: 8,
  },
  providerName: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
    lineHeight: 34,
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: MizanColors.mintPrimary + '10',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: MizanRadii.full,
  },
  verifiedText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintPrimary,
  },
  metricsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  metricCard: {
    flex: 1,
    backgroundColor: MizanColors.mintBg,
    borderRadius: MizanRadii.lg,
    padding: 16,
    alignItems: 'center',
  },
  metricIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
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
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
    lineHeight: 20,
  },
  providerSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  providerCard: {
    flexDirection: 'row',
    backgroundColor: MizanColors.borderMuted,
    borderRadius: MizanRadii.lg,
    padding: 20,
    gap: 16,
  },
  providerInfo: {
    flex: 1,
  },
  providerTier: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
    marginBottom: 4,
  },
  providerDesc: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: MizanColors.borderMuted,
  },
  applyButton: {
    backgroundColor: MizanColors.mintPrimary,
    height: 56,
    borderRadius: MizanRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: MizanColors.mintPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
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
