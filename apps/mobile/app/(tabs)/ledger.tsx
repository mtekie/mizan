import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { MizanColors } from '@mizan/ui-tokens';
import { MizanComponentTokens } from '@mizan/ui-tokens';
import { MizanCard } from '../../components/ui/MizanCard';
import { Plus, Filter, ArrowRightLeft, TrendingDown, Building2, TrendingUp, CreditCard, Landmark, PiggyBank, Wallet } from 'lucide-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { MintTransactionSheet } from '../../components/forms/MintTransactionSheet';
import { MintAccountSheet } from '../../components/forms/MintAccountSheet';
import { api } from '../../lib/api';
import {
  demoAccounts,
  demoTransactions,
  Transaction,
  buildMoneyScreenDataContract,
} from '@mizan/shared';
import { useStore } from '../../lib/store';
import { AppScreenShell } from '../../components/ui/AppScreenShell';

const T = MizanComponentTokens;

const accountIconMap = {
  building: Building2,
  'credit-card': CreditCard,
  landmark: Landmark,
  'piggy-bank': PiggyBank,
  wallet: Wallet,
};

export default function LedgerScreen() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState(false);
  const { isGuest } = useStore();

  const sheetRef = React.useRef<BottomSheet>(null);
  const accountSheetRef = React.useRef<BottomSheet>(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    if (isGuest) {
      setTransactions(demoTransactions);
      setAccounts(demoAccounts);
      setLoading(false);
      return;
    }
    try {
      const ledgerData = await api.ledger.get();
      setTransactions(ledgerData.transactions);
      setAccounts(ledgerData.accounts);
    } catch (error) {
      console.error('Failed to load ledger data:', error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [isGuest]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // ═══ SHARED SCREEN CONTRACT ═══
  const moneyContract = buildMoneyScreenDataContract({
    accounts,
    transactions,
    recentTransactionLimit: 50,
  });
  const summaryVM = moneyContract.summary;
  const accountsVM = moneyContract.accounts;
  const spendingVM = moneyContract.spending;
  const recentTransactions = moneyContract.recentTransactions;
  const states = moneyContract.states;

  const renderHeader = () => (
    <View style={styles.headerSection}>

      {/* ── Stat Grid: matches web 2x2 layout ── */}
      {/* SECTION: money_summary */}
      <View style={styles.statGrid}>
        <MizanCard style={styles.statCard}>
          <Text style={styles.statLabel}>TOTAL BALANCE</Text>
          <Text style={styles.statValue}>{summaryVM.totalBalanceFormatted}</Text>
          <Text style={[styles.statBadge, { color: MizanColors.mintPrimary }]}>{summaryVM.changeFormatted}</Text>
        </MizanCard>
        <MizanCard style={styles.statCard}>
          <Text style={styles.statLabel}>MONTHLY IN</Text>
          <Text style={[styles.statValue, { color: MizanColors.mintDark }]}>{summaryVM.monthlyInFormatted}</Text>
        </MizanCard>
        <MizanCard style={styles.statCard}>
          <Text style={styles.statLabel}>MONTHLY OUT</Text>
          <Text style={[styles.statValue, { color: MizanColors.mintCoral }]}>{summaryVM.monthlyOutFormatted}</Text>
        </MizanCard>
        <MizanCard style={styles.statCard}>
          <Text style={styles.statLabel}>SAVINGS RATE</Text>
          <Text style={styles.statValue}>{summaryVM.savingsRateFormatted}</Text>
        </MizanCard>
      </View>

      {/* ── Action Row: Add Account / Add Transaction / Transfer ── */}
      <View style={styles.actionRow}>
        <Text style={styles.sectionLabel}>MY ACCOUNTS</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => accountSheetRef.current?.expand()}>
            <Plus size={14} color="#fff" />
            <Text style={styles.actionBtnText}>Add Account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: MizanColors.mintDark }]} onPress={() => sheetRef.current?.expand()}>
            <Plus size={14} color="#fff" />
            <Text style={styles.actionBtnText}>Add Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnOutline}>
            <ArrowRightLeft size={14} color={MizanColors.textPrimary} />
            <Text style={styles.actionBtnOutlineText}>Transfer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Account Tiles: colored cards matching web ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.accountsStrip}
      >
        {accountsVM.map((acc) => {
          const AccountIcon = accountIconMap[acc.icon as keyof typeof accountIconMap] ?? CreditCard;

          return (
            <TouchableOpacity
              key={acc.id}
              style={[styles.accountTile, { backgroundColor: acc.color }]}
            >
              <View style={styles.accountTileHeader}>
                <View>
                  <Text style={styles.accountTileType}>{acc.typeLabel}</Text>
                  <Text style={styles.accountTileName}>{acc.bank}</Text>
                </View>
                <View style={styles.accountTileActions}>
                  <AccountIcon size={T.accountTile.iconSize} color="rgba(255,255,255,0.6)" />
                </View>
              </View>
              <View style={styles.accountTileFooter}>
                <Text style={styles.accountTileBalance}>{acc.balanceFormatted}</Text>
                {acc.number !== 'N/A' && (
                  <Text style={styles.accountTileNumber}>Ending {acc.number.slice(-4)}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
        {accountsVM.length === 0 && !loading && (
          <TouchableOpacity
            style={[styles.accountTile, { backgroundColor: MizanColors.mintBg, borderWidth: 2, borderColor: MizanColors.mintPrimary, borderStyle: 'dashed' }]}
            onPress={() => accountSheetRef.current?.expand()}
          >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={24} color={MizanColors.mintPrimary} />
              <Text style={{ fontSize: 13, fontFamily: 'Inter_700Bold', color: MizanColors.mintPrimary, marginTop: 8 }}>{states.accountsEmpty.title}</Text>
              <Text style={styles.emptyDescription}>{states.accountsEmpty.actionLabel}</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* ── Spending Summary with categories ── */}
      <Text style={[styles.sectionLabel, { marginTop: 24 }]}>MONTHLY SPENDING</Text>
      <MizanCard style={styles.spendingCard}>
        <View style={styles.spendingRow}>
          {/* Mini donut placeholder */}
          <View style={styles.donutContainer}>
            <View style={styles.donutRing}>
              <View style={styles.donutCenter}>
                <Text style={styles.donutValue}>{spendingVM.totalSpentFormatted}</Text>
                <Text style={styles.donutLabel}>THIS MONTH</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Category breakdown */}
        {spendingVM.categories.map((cat) => (
          <View key={cat.name} style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
            <Text style={styles.categoryName}>{cat.name}</Text>
            <Text style={styles.categoryAmount}>{cat.amountFormatted}</Text>
            <Text style={styles.categoryPercent}>{cat.percent}%</Text>
          </View>
        ))}
      </MizanCard>

      {/* ── Section header for transactions ── */}
      <Text style={[styles.sectionLabel, { marginTop: 24 }]}>RECENT ACTIVITY</Text>
    </View>
  );

  return (
    <AppScreenShell
      title="Money"
      scrollable={false}
      refreshing={loading}
      onRefresh={loadData}
      actions={
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <ArrowRightLeft color={MizanColors.textPrimary} size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Filter color={MizanColors.textPrimary} size={22} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => sheetRef.current?.expand()}
          >
            <Plus color={MizanColors.mintPrimary} size={24} />
          </TouchableOpacity>
        </View>
      }
    >
      {/* SECTION: recent_transactions */}
      <FlatList
        data={recentTransactions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.txRow}>
            <View style={[styles.txIcon, { backgroundColor: item.isIncome ? MizanColors.mintBg : '#F1F5F9' }]}>
              <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.txTitle}>{item.title}</Text>
              <Text style={styles.txSubtitle}>{item.source} • {item.category}</Text>
            </View>
            <Text style={[styles.txAmount, { color: item.isIncome ? MizanColors.mintDark : MizanColors.textPrimary }]}>
              {item.isIncome ? '+' : ''}{item.amountFormatted}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>{loadError ? states.error.title : states.transactionsEmpty.title}</Text>
              <Text style={styles.emptyDescription}>{loadError ? states.error.description : states.transactionsEmpty.description}</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={loadError ? loadData : () => sheetRef.current?.expand()}>
                <Text style={styles.emptyButtonText}>{loadError ? states.error.actionLabel : states.transactionsEmpty.actionLabel}</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      <MintTransactionSheet
        sheetRef={sheetRef}
        onClose={() => sheetRef.current?.close()}
        onSave={async (data) => {
          if (isGuest) {
            const amount = Math.abs(Number(data.amount) || 0);
            const mockTx: Transaction = {
              id: Math.random().toString(),
              userId: 'guest',
              title: data.title,
              amount: data.type === 'EXPENSE' ? -amount : amount,
              category: data.category,
              source: data.accountId || 'Cash',
              accountId: data.accountId,
              date: data.date,
            };
            setTransactions([mockTx, ...transactions]);
            return;
          }
          try {
            const amount = Math.abs(Number(data.amount) || 0);
            const account = accounts.find(a => a.id === data.accountId);
            await api.transactions.create({
              title: data.title,
              amount: data.type === 'EXPENSE' ? -amount : amount,
              category: data.category,
              source: account?.name || 'Manual',
              accountId: account?.id,
              date: data.date,
            });
            loadData();
          } catch (e: any) {
            console.error("Failed to save trans", e);
          }
        }}
      />

      <MintAccountSheet
        sheetRef={accountSheetRef}
        onClose={() => accountSheetRef.current?.close()}
        onSave={async (data) => {
          if (isGuest) {
            setAccounts([...accounts, { ...data, id: Math.random().toString() }]);
            return;
          }
          try {
            await api.accounts.create({
              name: data.name,
              type: data.type,
              balance: Number(data.balance) || 0,
            });
            loadData();
          } catch (e: any) {
            console.error("Failed to save account", e);
          }
        }}
      />
    </AppScreenShell>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    marginBottom: 12,
  },

  // ── Stat Grid (2x2) ──
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: T.statCard.gap,
    marginBottom: 20,
  },
  statCard: {
    width: '48%' as any,
    padding: T.statCard.padding,
    flexGrow: 1,
  },
  statLabel: {
    fontSize: T.statCard.labelSize,
    fontFamily: 'Inter_700Bold',
    letterSpacing: T.statCard.labelLetterSpacing,
    color: MizanColors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  statValue: {
    fontSize: T.statCard.valueSize,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
  },
  statBadge: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    marginTop: 4,
  },

  // ── Actions ──
  actionRow: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: T.sectionHeader.titleSize,
    fontFamily: 'Inter_700Bold',
    letterSpacing: T.sectionHeader.letterSpacing,
    color: MizanColors.textMuted,
    textTransform: 'uppercase',
    marginBottom: T.sectionHeader.marginBottom,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: MizanColors.mintPrimary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: MizanColors.borderLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionBtnOutlineText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },

  // ── Account Tiles ──
  accountsStrip: {
    gap: 12,
    paddingVertical: 4,
  },
  accountTile: {
    width: T.accountTile.width,
    height: T.accountTile.height,
    borderRadius: T.accountTile.borderRadius,
    padding: 14,
    justifyContent: 'space-between',
  },
  accountTileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  accountTileType: {
    fontSize: T.accountTile.typeSize,
    fontFamily: 'Inter_700Bold',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  accountTileName: {
    fontSize: T.accountTile.nameSize,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    marginTop: 2,
  },
  accountTileActions: {
    flexDirection: 'row',
    gap: 6,
  },
  accountTileFooter: {},
  accountTileBalance: {
    fontSize: T.accountTile.balanceSize,
    fontFamily: 'Inter_900Black',
    color: '#fff',
  },
  accountTileNumber: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },

  // ── Spending ──
  spendingCard: {
    padding: 20,
  },
  spendingRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  donutContainer: {
    alignItems: 'center',
  },
  donutRing: {
    width: T.spendingChart.chartSize,
    height: T.spendingChart.chartSize,
    borderRadius: T.spendingChart.chartSize / 2,
    borderWidth: 12,
    borderColor: MizanColors.mintPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCenter: {
    alignItems: 'center',
  },
  donutValue: {
    fontSize: T.spendingChart.centerValueSize,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
  },
  donutLabel: {
    fontSize: T.spendingChart.centerLabelSize,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  categoryDot: {
    width: T.spendingChart.legendDotSize,
    height: T.spendingChart.legendDotSize,
    borderRadius: T.spendingChart.legendDotSize / 2,
    marginRight: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: T.spendingChart.legendTextSize,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textPrimary,
  },
  categoryAmount: {
    fontSize: T.spendingChart.legendAmountSize,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
    marginRight: 8,
  },
  categoryPercent: {
    fontSize: T.spendingChart.legendAmountSize,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    width: 30,
    textAlign: 'right',
  },

  // ── Transactions ──
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: T.transactionRow.borderColor,
    gap: 12,
    minHeight: T.transactionRow.height,
  },
  txIcon: {
    width: T.transactionRow.iconSize,
    height: T.transactionRow.iconSize,
    borderRadius: T.transactionRow.iconRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txTitle: {
    fontSize: T.transactionRow.titleSize,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  txSubtitle: {
    fontSize: T.transactionRow.subtitleSize,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    marginTop: 2,
  },
  txAmount: {
    fontSize: T.transactionRow.amountSize,
    fontFamily: 'Inter_700Bold',
  },

  // ── Misc ──
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
    textAlign: 'center',
  },
  emptyDescription: {
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyButton: {
    marginTop: 12,
    backgroundColor: MizanColors.mintPrimary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
  },
});
