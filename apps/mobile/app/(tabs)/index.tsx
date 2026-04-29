import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MizanColors } from '@mizan/ui-tokens';
import { MizanComponentTokens } from '@mizan/ui-tokens';
import { MizanCard } from '../../components/ui/MizanCard';
import { SmsPermissionCard } from '../../components/ui/SmsPermissionCard';
import { MintAccountSheet } from '../../components/forms/MintAccountSheet';
import { router } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import { Bell, ChevronRight, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Smartphone, TrendingUp } from 'lucide-react-native';
import { useStore } from '../../lib/store';
import { SmartProfilePrompt } from '../../components/SmartProfilePrompt';
import { ProfileCompleteness } from '../../components/ProfileCompleteness';
import {
  demoAccounts,
  demoBudgets,
  demoGoals,
  demoTransactions,
  demoUser,
  buildHomeScreenDataContract,
  type HomeScreenApiResponse,
} from '@mizan/shared';

import { api } from '../../lib/api';

import { AppScreenShell } from '../../components/ui/AppScreenShell';

const T = MizanComponentTokens;

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
  const [dashboardData, setDashboardData] = React.useState<HomeScreenApiResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadError, setLoadError] = React.useState(false);
  const accountSheetRef = React.useRef<BottomSheet>(null);

  const loadData = React.useCallback(async () => {
    setLoadError(false);
    if (!dashboardData) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    try {
      const data = await api.dashboard.get();
      setDashboardData(data);
    } catch (error: any) {
      console.error('Failed to load dashboard:', error);
      if (error?.message?.includes('401') || error?.status === 401) {
        router.replace('/(auth)/login');
      } else {
        setLoadError(true);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dashboardData]);

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

  // ═══ SHARED SCREEN CONTRACT ═══
  const screenProfile = isGuest ? demoUser : profile;
  const accounts = dashboardData?.accounts ?? (isGuest ? demoAccounts : []);
  const txList = dashboardData?.recentTransactions ?? (isGuest ? demoTransactions.slice(0, 5) : []);
  const budgetList = dashboardData?.budgets ?? (isGuest ? demoBudgets : []);
  const homeContract = dashboardData?.home ?? buildHomeScreenDataContract({
    user: screenProfile,
    accounts: accounts as any,
    transactions: isGuest ? demoTransactions : txList as any,
    budgets: budgetList as any,
    goals: isGuest ? demoGoals : [],
  });

  const moneyVM = homeContract.money;
  const budgetVM = homeContract.budget;
  const recentTransactions = homeContract.recentTransactions;
  const mizanScore = homeContract.score.value;

  if (loading && !isGuest && !dashboardData) {
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
        <MizanCard style={styles.stateCard}>
          <ActivityIndicator color={MizanColors.mintPrimary} />
          <Text style={styles.stateTitle}>{homeContract.states.loading.title}</Text>
          <Text style={styles.stateDescription}>{homeContract.states.loading.description}</Text>
        </MizanCard>
        {[1, 2, 3].map(item => (
          <MizanCard key={item} style={styles.skeletonCard}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonLine} />
            <View style={[styles.skeletonLine, { width: '55%' }]} />
          </MizanCard>
        ))}
      </AppScreenShell>
    );
  }

  if (loadError && !dashboardData) {
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
        <MizanCard style={styles.stateCard}>
          <Text style={styles.stateTitle}>{homeContract.states.error.title}</Text>
          <Text style={styles.stateDescription}>{homeContract.states.error.description}</Text>
          <TouchableOpacity style={styles.stateButton} onPress={loadData}>
            <Text style={styles.stateButtonText}>{homeContract.states.error.actionLabel}</Text>
          </TouchableOpacity>
        </MizanCard>
      </AppScreenShell>
    );
  }

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
      <ProfileCompleteness user={screenProfile} />
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
                <Text style={styles.scoreStatus}>{homeContract.score.status}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 24, fontFamily: 'Inter_900Black', color: MizanColors.mintDark }}>{mizanScore}</Text>
              <Text style={{ fontSize: 10, fontFamily: 'Inter_700Bold', color: MizanColors.mintPrimary, textTransform: 'uppercase' }}>{homeContract.score.label}</Text>
            </View>
          </View>
        </MizanCard>
      </TouchableOpacity>
      
      {/* Quick Actions */}
      <View style={styles.quickActions}>
        {homeContract.quickActions.map(action => {
          const iconMap = {
            'arrow-up-right': ArrowUpRight,
            'arrow-down-left': ArrowDownLeft,
            'credit-card': CreditCard,
            smartphone: Smartphone,
          };
          const Icon = iconMap[action.icon as keyof typeof iconMap] ?? ArrowUpRight;
          return <QuickAction key={action.key} icon={Icon} label={action.label} color={action.color} />;
        })}
      </View>

      {/* Insight Card */}
      <MizanCard style={[styles.card, { backgroundColor: T.insightCard.bgColor, borderColor: T.insightCard.borderColor, borderWidth: 1 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
          <View style={{ width: T.insightCard.iconSize, height: T.insightCard.iconSize, borderRadius: T.insightCard.iconRadius, backgroundColor: MizanColors.mintPrimary, justifyContent: 'center', alignItems: 'center' }}>
            <TrendingUp size={16} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: T.insightCard.titleSize, fontFamily: 'Inter_700Bold', color: MizanColors.mintDark, marginBottom: 4 }}>Mizan Insight</Text>
            <Text style={{ fontSize: T.insightCard.bodySize, fontFamily: 'Inter_400Regular', color: MizanColors.textPrimary, lineHeight: T.insightCard.bodyLineHeight }}>
              {homeContract.insights[1]?.text ?? homeContract.insights[0]?.text}
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
          <Text style={{ fontSize: T.statCard.valueSize, fontFamily: 'Inter_900Black', color: MizanColors.textPrimary, marginTop: 4 }}>{moneyVM.totalBalanceFormatted}</Text>
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
            <Text style={{ fontSize: 15, fontFamily: 'Inter_700Bold', color: MizanColors.textPrimary }}>{budgetVM.percent}% used</Text>
            <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: MizanColors.textMuted }}>
              {budgetVM.totalSpentFormatted} / {budgetVM.totalBudgetFormatted}
            </Text>
          </View>
          <View style={{ height: T.progressBar.height, backgroundColor: T.progressBar.trackColor, borderRadius: T.progressBar.borderRadius, overflow: 'hidden', marginTop: 8 }}>
            <View style={{ height: '100%', width: `${budgetVM.percent}%`, backgroundColor: budgetVM.percent > T.progressBar.dangerThreshold ? '#EF4444' : MizanColors.mintPrimary, borderRadius: T.progressBar.borderRadius }} />
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
          <View style={{ marginTop: 8, paddingVertical: 12 }}>
            <Text style={{ fontSize: 13, fontFamily: 'Inter_700Bold', color: MizanColors.textPrimary, textAlign: 'center' }}>{homeContract.states.transactionsEmpty.title}</Text>
            <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: MizanColors.textMuted, marginTop: 4, textAlign: 'center' }}>{homeContract.states.transactionsEmpty.description}</Text>
          </View>
        ) : (
          recentTransactions.map((tx, idx) => (
            <View key={tx.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: T.transactionRow.borderColor }}>
              <View style={{ width: T.transactionRow.iconSize, height: T.transactionRow.iconSize, borderRadius: T.transactionRow.iconRadius, backgroundColor: tx.isIncome ? MizanColors.mintBg : '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                <Text style={{ fontSize: 16 }}>{tx.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: T.transactionRow.titleSize, fontFamily: 'Inter_700Bold', color: MizanColors.textPrimary }}>{tx.title}</Text>
                <Text style={{ fontSize: T.transactionRow.subtitleSize, fontFamily: 'Inter_400Regular', color: MizanColors.textMuted }}>{tx.source}</Text>
              </View>
              <Text style={{ fontSize: T.transactionRow.amountSize, fontFamily: 'Inter_700Bold', color: tx.isIncome ? MizanColors.mintDark : MizanColors.textPrimary }}>
                {tx.isIncome ? '+' : ''}{tx.amountFormatted}
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
  stateCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  stateTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
    textAlign: 'center',
  },
  stateDescription: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
  },
  stateButton: {
    marginTop: 12,
    backgroundColor: MizanColors.mintPrimary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  stateButtonText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  skeletonCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 10,
    marginBottom: 12,
  },
  skeletonTitle: {
    width: '45%',
    height: 14,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
  skeletonLine: {
    width: '80%',
    height: 10,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
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
    marginBottom: 24,
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
    borderRadius: 9999,
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
    paddingTop: 16,
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
