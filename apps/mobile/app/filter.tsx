import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { MizanColors, MizanRadii, MizanSpacing } from '@mizan/ui-tokens';
import { api } from '../lib/api';
import { Check } from 'lucide-react-native';

export default function FilterModal() {
  const router = useRouter();
  const [providers, setProviders] = useState<any[]>([]);
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [digitalOnly, setDigitalOnly] = useState(false);
  const [interestFree, setInterestFree] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [p, t] = await Promise.all([
          api.providers.list({ take: '20' }),
          api.productTypes.list()
        ]);
        setProviders(p);
        setProductTypes(t);
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilters();
  }, []);

  const toggleProvider = (id: string) => {
    if (selectedProviders.includes(id)) {
      setSelectedProviders(selectedProviders.filter(p => p !== id));
    } else {
      setSelectedProviders([...selectedProviders, id]);
    }
  };

  const applyFilters = () => {
    // In a real app, we'd pass this back via a state manager or search params
    // For now, we'll just go back. In a real scenario, we'd use a global store.
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={MizanColors.mintPrimary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Filters</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Digital Only</Text>
            <Switch 
              value={digitalOnly} 
              onValueChange={setDigitalOnly}
              trackColor={{ false: MizanColors.borderLight, true: MizanColors.mintPrimary }}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Interest-Free / Sharia</Text>
            <Switch 
              value={interestFree} 
              onValueChange={setInterestFree}
              trackColor={{ false: MizanColors.borderLight, true: MizanColors.mintPrimary }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Banks & Providers</Text>
          {providers.map(p => (
            <TouchableOpacity 
              key={p.id} 
              style={styles.checkRow}
              onPress={() => toggleProvider(p.id)}
            >
              <Text style={styles.checkLabel}>{p.name}</Text>
              <View style={[
                styles.checkbox, 
                selectedProviders.includes(p.id) && styles.checkboxActive
              ]}>
                {selectedProviders.includes(p.id) && <Check size={14} color="#fff" />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={() => {
            setSelectedProviders([]);
            setDigitalOnly(false);
            setInterestFree(false);
          }}
        >
          <Text style={styles.resetText}>Reset All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyText}>Apply Filters</Text>
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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: MizanColors.borderMuted,
  },
  switchLabel: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textPrimary,
  },
  checkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: MizanColors.borderMuted,
  },
  checkLabel: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textPrimary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: MizanColors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: MizanColors.mintPrimary,
    borderColor: MizanColors.mintPrimary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: MizanColors.borderMuted,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    height: 52,
    borderRadius: MizanRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: MizanColors.borderLight,
  },
  resetText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textSecondary,
  },
  applyButton: {
    flex: 2,
    height: 52,
    borderRadius: MizanRadii.md,
    backgroundColor: MizanColors.mintPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  }
});
