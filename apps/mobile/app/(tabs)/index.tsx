import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { MizanColors, MizanTypography, MizanSpacing, MizanRadii } from '@mizan/ui-tokens';
import { MizanCard } from '../../components/ui/MizanCard';
import { MintBudgetBar } from '../../components/ui/MintBudgetBar';
import { SmsPermissionCard } from '../../components/ui/SmsPermissionCard';
import { MintAccountSheet } from '../../components/forms/MintAccountSheet';
import { router } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import { Bell, ChevronRight, Plus } from 'lucide-react-native';
import { useStore } from '../../lib/store';

import { api } from '../../lib/api';

export default function DashboardScreen() {
  const [dashboardData, setDashboardData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const accountSheetRef = React.useRef<BottomSheet>(null);

  const loadData = React.useCallback(async () => {
    try {
      const data = await api.dashboard.get();
      setDashboardData(data);
    } catch (error: any) {
      console.error('Failed to load dashboard:', error);
      // If unauthorized, redirect to login
      if (error?.message?.includes('401') || error?.status === 401) {
        router.replace('/(auth)/login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const { profile, isGuest } = useStore();

  React.useEffect(() => {
    if (!profile.isComplete && !isGuest) {
      router.replace('/(onboarding)');
      return;
    }
    
    if (!isGuest) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [loadData, profile.isComplete, isGuest]);

  const summary = dashboardData || (isGuest ? {
    netWorth: 124500,
    monthlyIn: 45000,
    monthlyOut: 12300,
    budgets: [
      { id: '1', name: 'Housing', spent: 5000, allocated: 5000 },
      { id: '2', name: 'Food & Dining', spent: 2400, allocated: 3000 },
      { id: '3', name: 'Transport', spent: 1200, allocated: 1500 },
    ]
  } : {
    netWorth: 0,
    monthlyIn: 0,
    monthlyOut: 0,
    budgets: []
  });

  return (
    <View style={styles.container}>
      {/* Solid green header background acting like safe area */}
      <View style={styles.headerBackground}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>This Month</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/notifications')}>
              <Bell color="#fff" size={24} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SmsPermissionCard />
        
        {/* Net Worth Summary */}
        <MizanCard variant="primary" style={styles.card}>
          <View style={styles.netWorthHeader}>
            <View>
              <Text style={styles.netWorthLabel}>Net Worth</Text>
              <Text style={styles.netWorthValue}>ETB {summary.netWorth.toLocaleString()}</Text>
            </View>
            <TouchableOpacity 
              style={styles.addAccountBtn} 
              onPress={() => accountSheetRef.current?.expand()}
            >
              <Plus size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.addAccountBtnText}>Add Account</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.cashFlowRow}>
            <View style={styles.cashFlowItem}>
              <Text style={styles.cashFlowLabel}>Income</Text>
              <Text style={styles.cashFlowValue}>{summary.monthlyIn.toLocaleString()}</Text>
            </View>
            <View style={styles.cashFlowItem}>
              <Text style={styles.cashFlowLabel}>Expenses</Text>
              <Text style={styles.cashFlowValue}>{summary.monthlyOut.toLocaleString()}</Text>
            </View>
          </View>
        </MizanCard>
        
        {/* Spending Card (Fake Donut) */}
        <MizanCard variant="primary" style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>September spending</Text>
            <ChevronRight color={MizanColors.mintPrimary} size={16} />
          </View>
          <Text style={styles.spendingSubtitle}>You've spent {summary.monthlyOut.toLocaleString()} so far</Text>
          
          <View style={styles.donutPlaceholder}>
            <View style={styles.donutCenter}>
              <Text style={styles.donutLabel}>This month</Text>
              <Text style={styles.donutValue}>{summary.monthlyOut.toLocaleString()}</Text>
            </View>
          </View>
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: '#45BFA0'}]}/><Text style={styles.legendText}>Auto</Text></View>
            <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: '#F5A623'}]}/><Text style={styles.legendText}>Food</Text></View>
            <View style={styles.legendItem}><View style={[styles.dot, {backgroundColor: '#E8734A'}]}/><Text style={styles.legendText}>Fun</Text></View>
          </View>
        </MizanCard>

        {/* Budgets Card */}
        <MizanCard variant="primary" style={styles.card}>
           <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Monthly budgets</Text>
            <ChevronRight color={MizanColors.mintPrimary} size={16} />
          </View>
          <View style={styles.budgetList}>
            {summary.budgets.map((b: any) => (
              <MintBudgetBar key={b.id} spent={b.spent} total={b.allocated} title={b.name} />
            ))}
          </View>
        </MizanCard>

      </ScrollView>

      <MintAccountSheet 
        sheetRef={accountSheetRef}
        onClose={() => accountSheetRef.current?.close()}
        onSave={async (data) => {
          if (isGuest) {
            console.log("Guest mode: simulating account save", data);
            return;
          }
          try {
            await api.assets.create(data);
            loadData();
          } catch(e: any) {
            console.error("Failed to add account", e);
            if (e?.message?.includes('401') || e?.status === 401) {
              router.replace('/(auth)/login');
            }
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9', // Light gray standard background
  },
  headerBackground: {
    backgroundColor: '#17A697', // Mint Teal
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  netWorthLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  netWorthValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: '#fff',
    marginBottom: MizanSpacing.lg,
  },
  netWorthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addAccountBtn: {
    backgroundColor: MizanColors.mintPrimary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: MizanRadii.full,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addAccountBtnText: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  cashFlowRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: MizanSpacing.md,
  },
  cashFlowItem: {
    flex: 1,
  },
  cashFlowLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 2,
  },
  cashFlowValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  spendingSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    marginBottom: 24,
  },
  donutPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#E2E8F0', // Light gray ring
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  donutCenter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutLabel: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textMuted,
    textTransform: 'uppercase',
  },
  donutValue: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textPrimary,
  },
  budgetList: {
    marginTop: 16,
  }
});
