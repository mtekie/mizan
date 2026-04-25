import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';
import { MizanCard } from '../../components/ui/MizanCard';
import { Plus, Filter } from 'lucide-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { MintTransactionSheet } from '../../components/forms/MintTransactionSheet';

import { api } from '../../lib/api';
import { Transaction } from '@mizan/shared';
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

export default function LedgerScreen() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { isGuest } = useStore();

  const MOCK_TRANSACTIONS: Transaction[] = [
    { id: '1', title: 'CBE Salary', amount: 35000, category: 'Income', date: new Date().toISOString(), accountId: 'CBE' },
    { id: '2', title: 'Grocery Shopping', amount: -2450, category: 'Food', date: new Date().toISOString(), accountId: 'CASH' },
    { id: '3', title: 'Fuel', amount: -1200, category: 'Transport', date: new Date().toISOString(), accountId: 'CBE' },
    { id: '4', title: 'Internet Bill', amount: -1000, category: 'Bills', date: new Date().toISOString(), accountId: 'TELEBIRR' },
  ];
  const sheetRef = React.useRef<BottomSheet>(null);

  React.useEffect(() => {
    async function loadTransactions() {
      if (isGuest) {
        setTransactions(MOCK_TRANSACTIONS);
        setLoading(false);
        return;
      }
      try {
        const data = await api.transactions.list();
        setTransactions(data);
      } catch (error) {
        console.error('Failed to load transactions:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, [isGuest]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ledger</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Filter color={MizanColors.textPrimary} size={24} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => sheetRef.current?.expand()}
          >
            <Plus color={MizanColors.mintPrimary} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const Icon = CATEGORY_ICONS[item.category] || ShoppingBag;
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
      />

      <MintTransactionSheet 
        sheetRef={sheetRef}
        onClose={() => sheetRef.current?.close()}
        onSave={async (data) => {
          if (isGuest) {
            console.log("Guest mode: simulating transaction save", data);
            // Optionally add to local state for feedback
            const mockTx = { ...data, id: Math.random().toString() };
            setTransactions([mockTx, ...transactions]);
            return;
          }
          try {
            await api.transactions.create(data);
            // Refresh list
            const updated = await api.transactions.list();
            setTransactions(updated);
          } catch (e: any) {
            console.error("Failed to save trans", e);
            if (e?.message?.includes('401') || e?.status === 401) {
              router.replace('/(auth)/login');
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MizanColors.mintBg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: MizanTypography.sizes.hero,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
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
    paddingHorizontal: 24,
    paddingBottom: 100,
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
