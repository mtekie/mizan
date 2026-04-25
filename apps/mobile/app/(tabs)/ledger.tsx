import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';
import { MizanCard } from '../../components/ui/MizanCard';
import { Plus, Filter, ArrowRightLeft, PieChart, TrendingDown } from 'lucide-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { MintTransactionSheet } from '../../components/forms/MintTransactionSheet';

import { api } from '../../lib/api';
import { Transaction } from '@mizan/shared';
import { useStore } from '../../lib/store';
import { Coffee, ShoppingBag, Car, Home, Smartphone, TrendingUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';

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
  const router = useRouter();

  const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', userId: 'guest', title: 'CBE Salary', amount: 35000, category: 'Income', source: 'CBE', date: new Date().toISOString(), accountId: 'CBE' },
    { id: '2', userId: 'guest', title: 'Grocery Shopping', amount: -2450, category: 'Food', source: 'Cash', date: new Date().toISOString(), accountId: 'CASH' },
    { id: '3', userId: 'guest', title: 'Fuel', amount: -1200, category: 'Transport', source: 'CBE', date: new Date().toISOString(), accountId: 'CBE' },
    { id: '4', userId: 'guest', title: 'Internet Bill', amount: -1000, category: 'Bills', source: 'telebirr', date: new Date().toISOString(), accountId: 'TELEBIRR' },
  ];

  const MOCK_ACCOUNTS = [
    { id: '1', name: 'CBE Savings', balance: 45800, bank: 'CBE' },
    { id: '2', name: 'Telebirr', balance: 12400, bank: 'Ethio Telecom' },
    { id: '3', name: 'Cash', balance: 3500, bank: 'Personal' },
  ];

  const sheetRef = React.useRef<BottomSheet>(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    if (isGuest) {
      setTransactions(MOCK_TRANSACTIONS);
      setAccounts(MOCK_ACCOUNTS);
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
        <Text style={styles.summaryAmount}>{totalBalance.toLocaleString()} ETB</Text>
        <View style={styles.summaryFooter}>
          <TrendingUp size={16} color={MizanColors.mintDark} />
          <Text style={styles.summaryFooterText}>+12.5% this month</Text>
        </View>
      </MizanCard>

      {/* Accounts Strip */}
      <View style={styles.accountsSection}>
        <Text style={styles.sectionTitle}>Accounts</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={accounts}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.accountsList}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.accountPill}
              onPress={() => router.push(`/accounts/${item.id}`)}
            >
              <View style={styles.accountIconBox}>
                <Home size={16} color={MizanColors.mintPrimary} />
              </View>
              <View>
                <Text style={styles.accountName}>{item.name}</Text>
                <Text style={styles.accountBalance}>{item.balance?.toLocaleString()} ETB</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Transactions</Text>
    </View>
  );

  const renderSpendingSummary = () => (
    <View style={styles.spendingSection}>
      <Text style={styles.sectionTitle}>Spending Summary</Text>
      <MizanCard style={styles.spendingCard}>
        <View style={styles.spendingHeader}>
          <View>
            <Text style={styles.spendingLabel}>This Month</Text>
            <Text style={styles.spendingValue}>12,300 ETB</Text>
          </View>
          <View style={styles.spendingChange}>
            <TrendingDown size={14} color={MizanColors.mintPrimary} />
            <Text style={styles.spendingChangeText}>-8%</Text>
          </View>
        </View>
        <View style={styles.spendingBarBg}>
          <View style={[styles.spendingBarFill, { width: '65%', backgroundColor: MizanColors.mintPrimary }]} />
        </View>
        <Text style={styles.spendingNote}>You have spent 65% of your food budget.</Text>
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
                  <Text style={styles.txDate}>{item.accountId || 'Cash'} • {item.category}</Text>
                </View>
              </View>
              <Text style={[styles.txAmount, { color: item.amount > 0 ? MizanColors.mintDark : MizanColors.textPrimary }]}>
                {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}
              </Text>
            </MizanCard>
          );
        }}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
          )
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
            await api.transactions.create(data);
            loadData();
          } catch (e: any) {
            console.error("Failed to save trans", e);
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
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
    marginBottom: 16,
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
