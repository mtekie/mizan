import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';
import { MizanCard } from '../../components/ui/MizanCard';
import { Plus, Filter } from 'lucide-react-native';

export default function LedgerScreen() {
  const transactions = [
    { id: '1', title: 'CBE ATM Withdrawal', amount: -2000, date: 'Today, 10:30 AM', category: 'Cash' },
    { id: '2', title: 'Salary Deposit', amount: 45000, date: 'Yesterday', category: 'Income' },
    { id: '3', title: 'Ethio Telecom', amount: -150, date: 'Mon, 2:15 PM', category: 'Utilities' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ledger</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Filter color={MizanColors.textPrimary} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Plus color={MizanColors.mintPrimary} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MizanCard style={styles.transactionCard}>
            <View style={styles.transactionLeft}>
              <View style={styles.iconPlaceholder} />
              <View>
                <Text style={styles.txTitle}>{item.title}</Text>
                <Text style={styles.txDate}>{item.date} • {item.category}</Text>
              </View>
            </View>
            <Text style={[styles.txAmount, { color: item.amount > 0 ? MizanColors.mintDark : MizanColors.textPrimary }]}>
              {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}
            </Text>
          </MizanCard>
        )}
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
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
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
