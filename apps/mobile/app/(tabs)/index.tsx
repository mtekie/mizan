import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MizanColors, MizanSpacing, MizanRadii } from '@mizan/ui-tokens';
import { MizanCard } from '../../components/ui/MizanCard';
import { MintBudgetBar } from '../../components/ui/MintBudgetBar';
import { SmsPermissionCard } from '../../components/ui/SmsPermissionCard';
import { MintAccountSheet } from '../../components/forms/MintAccountSheet';
import { router } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import { Bell, ChevronRight, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Smartphone, TrendingUp } from 'lucide-react-native';
import { useStore } from '../../lib/store';
import { SmartProfilePrompt } from '../../components/SmartProfilePrompt';
import { ProfileCompleteness } from '../../components/ProfileCompleteness';
import { formatMoney } from '@mizan/shared';

import { api } from '../../lib/api';

import { AppScreenShell } from '../../components/ui/AppScreenShell';

function QuickAction({ icon: Icon, label, color }: any) {
  return (
    <TouchableOpacity style={styles.quickActionItem}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '15' }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

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

  const summary = {
    netWorth: dashboardData?.netWorth ?? (isGuest ? 124500 : 0),
    monthlyIn: dashboardData?.monthlyIn ?? (isGuest ? 45000 : 0),
    monthlyOut: dashboardData?.monthlyOut ?? (isGuest ? 12300 : 0),
    budgets: dashboardData?.budgets ?? (isGuest ? [
      { id: '1', name: 'Housing', spent: 5000, allocated: 5000 },
      { id: '2', name: 'Food & Dining', spent: 2400, allocated: 3000 },
      { id: '3', name: 'Transport', spent: 1200, allocated: 1500 },
    ] : [])
  };

  const recentTransactions = dashboardData?.recentTransactions ?? (isGuest ? [
    { id: 'r1', title: 'Kaldi Coffee', category: 'Food', amount: -120, source: 'telebirr' },
    { id: 'r2', title: 'Salary Deposit', category: 'Income', amount: 35000, source: 'CBE' },
    { id: 'r3', title: 'Shoa Supermarket', category: 'Groceries', amount: -890, source: 'CBE Birr' },
  ] : []);

  const totalBudget = summary.budgets.reduce((s: number, b: any) => s + (b.allocated || 0), 0);
  const totalSpent = summary.budgets.reduce((s: number, b: any) => s + (b.spent || 0), 0);
  const budgetPct = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  return (
    <AppScreenShell
      title="Home"
      variant="hero"
      refreshing={refreshing}
      onRefresh={loadData}
      actions={
        <TouchableOpacity onPress={() => router.push('/notifications')}>
          <Bell color="#fff" size={24} />
        </TouchableOpacity>
      }
    >
      <ProfileCompleteness user={profile} />
      <SmartProfilePrompt />
      <SmsPermissionCard />

      {/* Mizan Score Preview */}
      <TouchableOpacity onPress={() => router.push('/score')}>
        <MizanCard variant="primary" style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: MizanColors.mintBg, justifyContent: 'center', alignItems: 'center' }}>
                <TrendingUp size={20} color={MizanColors.mintPrimary} />
              </View>
              <View>
                <Text style={styles.cardTitle}>Mizan Score</Text>
                <Text style={styles.scoreStatus}>Improving • Last updated today</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 24, fontFamily: 'Inter_900Black', color: MizanColors.mintDark }}>{dashboardData?.mizanScore ?? 720}</Text>
              <Text style={{ fontSize: 10, fontFamily: 'Inter_700Bold', color: MizanColors.mintPrimary, textTransform: 'uppercase' }}>Good</Text>
            </View>
          </View>
        </MizanCard>
      </TouchableOpacity>
      
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <QuickAction icon={ArrowUpRight} label="Send" color="#3B82F6" />
        <QuickAction icon={ArrowDownLeft} label="Request" color="#10B981" />
        <QuickAction icon={CreditCard} label="Pay" color="#8B5CF6" />
        <QuickAction icon={Smartphone} label="Airtime" color="#F59E0B" />
      </View>

      {/* Insight Card */}
      <MizanCard style={[styles.card, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: MizanColors.mintPrimary, justifyContent: 'center', alignItems: 'center' }}>
            <TrendingUp size={16} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontFamily: 'Inter_700Bold', color: MizanColors.mintDark, marginBottom: 4 }}>Mizan Insight</Text>
            <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: MizanColors.textPrimary, lineHeight: 18 }}>
              {summary.monthlyOut > 20000
                ? "Your spending is a bit high this month. Consider reviewing your Entertainment category."
                : "You're doing great! Your spending is well under control this month."}
            </Text>
          </View>
        </View>
      </MizanCard>

      {/* Mini Money Summary — links to Money tab */}
      <TouchableOpacity onPress={() => router.push('/(tabs)/ledger')}>
        <MizanCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Balance</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 12, fontFamily: 'Inter_700Bold', color: MizanColors.mintPrimary }}>Details</Text>
              <ChevronRight size={14} color={MizanColors.mintPrimary} />
            </View>
          </View>
          <Text style={{ fontSize: 22, fontFamily: 'Inter_900Black', color: MizanColors.textPrimary, marginTop: 4 }}>{formatMoney(summary.netWorth)}</Text>
        </MizanCard>
      </TouchableOpacity>

      {/* Mini Budget Summary — links to Goals tab */}
      <TouchableOpacity onPress={() => router.push('/(tabs)/goals')}>
        <MizanCard style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Budget</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={{ fontSize: 12, fontFamily: 'Inter_700Bold', color: MizanColors.mintPrimary }}>Details</Text>
              <ChevronRight size={14} color={MizanColors.mintPrimary} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
            <Text style={{ fontSize: 15, fontFamily: 'Inter_700Bold', color: MizanColors.textPrimary }}>{budgetPct}% used</Text>
            <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: MizanColors.textMuted }}>
              {formatMoney(totalSpent)} / {formatMoney(totalBudget)}
            </Text>
          </View>
          <View style={{ height: 6, backgroundColor: MizanColors.mintBg, borderRadius: 3, overflow: 'hidden', marginTop: 8 }}>
            <View style={{ height: '100%', width: `${budgetPct}%`, backgroundColor: budgetPct > 90 ? '#EF4444' : MizanColors.mintPrimary, borderRadius: 3 }} />
          </View>
        </MizanCard>
      </TouchableOpacity>

      {/* Recent Transactions */}
      <MizanCard style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/ledger')} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 12, fontFamily: 'Inter_700Bold', color: MizanColors.mintPrimary }}>See all</Text>
            <ChevronRight size={14} color={MizanColors.mintPrimary} />
          </TouchableOpacity>
        </View>
        {recentTransactions.length === 0 ? (
          <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: MizanColors.textMuted, marginTop: 8, textAlign: 'center', paddingVertical: 12 }}>No transactions yet.</Text>
        ) : (
          recentTransactions.slice(0, 3).map((tx: any, idx: number) => (
            <View key={tx.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: '#F1F5F9' }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: tx.amount > 0 ? MizanColors.mintBg : '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 16 }}>{tx.amount > 0 ? '💰' : '💳'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontFamily: 'Inter_700Bold', color: MizanColors.textPrimary }}>{tx.title}</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Inter_400Regular', color: MizanColors.textMuted }}>{tx.source || 'Manual'}</Text>
              </View>
              <Text style={{ fontSize: 14, fontFamily: 'Inter_700Bold', color: tx.amount > 0 ? MizanColors.mintDark : MizanColors.textPrimary }}>
                {tx.amount > 0 ? '+' : ''}{formatMoney(Math.abs(tx.amount))}
              </Text>
            </View>
          ))
        )}
      </MizanCard>

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
    </AppScreenShell>
  );
}

const styles = StyleSheet.create({
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  quickActionItem: {
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textPrimary,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  scoreStatus: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
    marginTop: 2,
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
});
