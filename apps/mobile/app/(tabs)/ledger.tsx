import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';
import { MizanCard } from '../../components/ui/MizanCard';
import { Plus, Filter, ArrowRightLeft, PieChart, TrendingDown } from 'lucide-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { MintTransactionSheet } from '../../components/forms/MintTransactionSheet';
import { MintAccountSheet } from '../../components/forms/MintAccountSheet';

import { api } from '../../lib/api';
import { demoAccounts, demoTransactions, formatMoney, formatSignedMoney, Transaction } from '@mizan/shared';
import { useStore } from '../../lib/store';
import { Coffee, ShoppingBag, Car, Home, Smartphone, TrendingUp } from 'lucide-react-native';

const CATEGORY_ICONS: Record<string, any> = {
  Food: Coffee,
  Shopping: ShoppingBag,
  Transport: Car,
  Housing: Home,
  Bills: Smartphone,
  Income: TrendingUp,
};

import { AppScreenShell } from '../../components/ui/AppScreenShell';

export default function LedgerScreen() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { isGuest } = useStore();

  const sheetRef = React.useRef<BottomSheet>(null);
  const accountSheetRef = React.useRef<BottomSheet>(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    if (isGuest) {
      setTransactions(demoTransactions);
      setAccounts(demoAccounts);
      setLoading(false);
      return;
    }
    try {
      const [txData, accData] = await Promise.all([
        api.transactions.list(),
        api.accounts.list()
      ]);
      setTransactions(txData);
      setAccounts(accData);
    } catch (error) {
      console.error('Failed to load ledger data:', error);
    } finally {
      setLoading(false);
    }
  }, [isGuest]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* Balance Summary */}
      <MizanCard style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Total Balance</Text>
        <Text style={styles.summaryAmount}>{formatMoney(totalBalance)}</Text>
        <View style={styles.summaryFooter}>
          <TrendingUp size={16} color={MizanColors.mintDark} />
          <Text style={styles.summaryFooterText}>+12.5% this month</Text>
        </View>
      </MizanCard>

      {/* Accounts Strip */}
      <View style={styles.accountsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Accounts</Text>
          <TouchableOpacity onPress={() => accountSheetRef.current?.expand()}>
            <Text style={styles.sectionAction}>Add</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={accounts}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.accountsList}
          ListEmptyComponent={
            !loading ? (
              <TouchableOpacity style={styles.emptyAccountPill} onPress={() => accountSheetRef.current?.expand()}>
                <Plus size={18} color={MizanColors.mintPrimary} />
                <Text style={styles.emptyAccountText}>Add your first account</Text>
              </TouchableOpacity>
            ) : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.accountPill}
              onPress={() => {}}
            >
              <View style={styles.accountIconBox}>
                <Home size={16} color={MizanColors.mintPrimary} />
              </View>
              <View>
                <Text style={styles.accountName}>{item.name}</Text>
                <Text style={styles.accountBalance}>{formatMoney(item.balance)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Transactions</Text>
    </View>
  );

  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const spendingPercent = totalBalance > 0 ? Math.min(100, Math.round((totalExpenses / totalBalance) * 100)) : 0;

  const renderSpendingSummary = () => (
    <View style={styles.spendingSection}>
      <Text style={styles.sectionTitle}>Spending Summary</Text>
      <MizanCard style={styles.spendingCard}>
        <View style={styles.spendingHeader}>
          <View>
            <Text style={styles.spendingLabel}>This Month</Text>
            <Text style={styles.spendingValue}>{formatMoney(totalExpenses)}</Text>
          </View>
          <View style={styles.spendingChange}>
            <TrendingDown size={14} color={MizanColors.mintPrimary} />
            <Text style={styles.spendingChangeText}>{spendingPercent}% of balance</Text>
          </View>
        </View>
        <View style={styles.spendingBarBg}>
          <View style={[styles.spendingBarFill, { width: `${spendingPercent}%`, backgroundColor: spendingPercent > 80 ? '#EF4444' : MizanColors.mintPrimary }]} />
        </View>
        <Text style={styles.spendingNote}>
          {spendingPercent > 80 ? 'Spending is high relative to your balance.' : 'Your spending is on track this month.'}
        </Text>
      </MizanCard>
    </View>
  );

  const renderLedgerHeader = () => (
    <>
      {renderHeader()}
      {renderSpendingSummary()}
      <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12, paddingHorizontal: 24 }]}>Recent Transactions</Text>
    </>
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
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderLedgerHeader}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const Icon = CATEGORY_ICONS[item.category || ''] || ShoppingBag;
          return (
            <MizanCard style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <View style={[styles.iconBox, { backgroundColor: item.amount > 0 ? MizanColors.mintBg : '#F1F5F9' }]}>
                  <Icon size={20} color={item.amount > 0 ? MizanColors.mintPrimary : MizanColors.textSecondary} />
                </View>
                <View>
                  <Text style={styles.txTitle}>{item.title}</Text>
                  <Text style={styles.txDate}>{accounts.find(account => account.id === item.accountId)?.name || item.source || 'Manual'} • {item.category || 'Uncategorized'}</Text>
                </View>
              </View>
              <Text style={[styles.txAmount, { color: item.amount > 0 ? MizanColors.mintDark : MizanColors.textPrimary }]}>
                {formatSignedMoney(item.amount)}
              </Text>
            </MizanCard>
          );
        }}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No transactions yet</Text>
              <TouchableOpacity style={styles.emptyButton} onPress={() => sheetRef.current?.expand()}>
                <Text style={styles.emptyButtonText}>Log first transaction</Text>
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
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: MizanColors.mintDark,
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  summaryAmount: {
    fontSize: 32,
    fontFamily: 'Inter_900Black',
    color: '#fff',
    marginTop: 8,
    marginBottom: 16,
  },
  summaryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  summaryFooterText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  accountsSection: {
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
  },
  sectionAction: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintPrimary,
  },
  accountsList: {
    gap: 12,
  },
  accountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MizanColors.borderLight,
  },
  emptyAccountPill: {
    minWidth: 220,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: MizanColors.borderLight,
  },
  emptyAccountText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  accountIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: MizanColors.mintBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  accountBalance: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
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
  spendingSection: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  spendingCard: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
  },
  spendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  spendingLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textMuted,
    textTransform: 'uppercase',
  },
  spendingValue: {
    fontSize: 24,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
    marginTop: 4,
  },
  spendingChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: MizanColors.mintBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  spendingChangeText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintPrimary,
  },
  spendingBarBg: {
    height: 8,
    backgroundColor: MizanColors.mintBg,
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  spendingBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  spendingNote: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  txDate: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
  },
});
