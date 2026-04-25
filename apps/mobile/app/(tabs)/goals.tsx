import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { MizanColors, MizanSpacing, MizanRadii } from '@mizan/ui-tokens';
import { Plus } from 'lucide-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { MintGoalSheet } from '../../components/forms/MintGoalSheet';
import { MizanCard } from '../../components/ui/MizanCard';
import { api } from '../../lib/api';
import { useStore } from '../../lib/store';

import { AppScreenShell } from '../../components/ui/AppScreenShell';

import { Calendar, AlertCircle, TrendingDown } from 'lucide-react-native';

export default function GoalsScreen() {
  const [goals, setGoals] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const sheetRef = useRef<BottomSheet>(null);
  const { isGuest } = useStore();
  
  const MOCK_GOALS = [
    { id: '1', name: 'New Car', target: 850000, saved: 150000, emoji: '🚗' },
    { id: '2', name: 'Vacation', target: 50000, saved: 45000, emoji: '🏖️' },
  ];

  const MOCK_BUDGETS = [
    { id: '1', category: 'Food', limit: 10000, spent: 7500 },
    { id: '2', category: 'Transport', limit: 5000, spent: 4800 },
  ];

  const MOCK_BILLS = [
    { id: '1', title: 'Internet', amount: 1000, dueDate: 'Tomorrow', paid: false },
    { id: '2', title: 'Rent', amount: 15000, dueDate: 'In 5 days', paid: false },
  ];

  const loadData = React.useCallback(async () => {
    setLoading(true);
    if (isGuest) {
      setGoals(MOCK_GOALS);
      setBudgets(MOCK_BUDGETS);
      setBills(MOCK_BILLS);
      setLoading(false);
      return;
    }
    try {
      const [goalData, budgetData, billData] = await Promise.all([
        api.goals.list().catch(() => []),
        api.budgets.list().catch(() => []),
        api.bills.list().catch(() => [])
      ]);
      setGoals(goalData);
      setBudgets(budgetData);
      setBills(billData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [isGuest]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveGoal = async (data: any) => {
    if (isGuest) {
      const newGoal = { ...data, id: Math.random().toString(), saved: 0 };
      setGoals([...goals, newGoal]);
      return;
    }
    try {
      await api.goals.create(data);
      loadData();
    } catch (e) {
      console.error("Failed to save goal", e);
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const budgetProgress = totalBudget > 0 ? Math.min(totalSpent / totalBudget, 1) : 0;

  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* Budget Overview */}
      <MizanCard style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <View>
            <Text style={styles.budgetLabel}>Monthly Budget</Text>
            <Text style={styles.budgetAmount}>{totalSpent.toLocaleString()} / {totalBudget.toLocaleString()} ETB</Text>
          </View>
          <TrendingDown size={24} color={budgetProgress > 0.9 ? '#EF4444' : MizanColors.mintPrimary} />
        </View>
        <View style={styles.budgetBarBg}>
          <View style={[styles.budgetBarFill, { width: `${budgetProgress * 100}%`, backgroundColor: budgetProgress > 0.9 ? '#EF4444' : MizanColors.mintPrimary }]} />
        </View>
        <Text style={styles.budgetMessage}>
          {budgetProgress > 0.9 ? 'Careful! You are close to your limit.' : 'You are on track this month.'}
        </Text>
      </MizanCard>

      {/* Bill Reminders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Bills</Text>
        </View>
        {bills.map(bill => (
          <MizanCard key={bill.id} style={styles.billCard}>
            <View style={styles.billIconBox}>
              <Calendar size={18} color={MizanColors.textSecondary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.billTitle}>{bill.title}</Text>
              <Text style={styles.billDue}>Due {bill.dueDate}</Text>
            </View>
            <Text style={styles.billAmount}>{bill.amount.toLocaleString()} ETB</Text>
          </MizanCard>
        ))}
      </View>

      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Savings Goals</Text>
      </View>
    </View>
  );

  return (
    <AppScreenShell
      title="Goals"
      onRefresh={loadData}
      refreshing={loading}
      actions={
        <TouchableOpacity style={styles.iconButton} onPress={() => sheetRef.current?.expand()}>
          <Plus color={MizanColors.mintPrimary} size={24} />
        </TouchableOpacity>
      }
    >
      <FlatList
        data={goals}
        keyExtractor={item => item.id || Math.random().toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Goals Yet</Text>
              <Text style={styles.emptySubtitle}>Tap the plus icon to start saving.</Text>
            </View>
          )
        }
        renderItem={({ item }) => {
          const progress = Math.min((item.saved / (item.target || 1)), 1);
          return (
            <MizanCard style={styles.goalCard}>
              <View style={styles.goalEmojiContainer}>
                <Text style={styles.goalEmoji}>{item.emoji || '🎯'}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={styles.goalName}>{item.name}</Text>
                  <Text style={styles.percentText}>{Math.round(progress * 100)}%</Text>
                </View>
                <Text style={styles.goalProgress}>
                  {(item.saved || 0).toLocaleString()} ETB / {(item.target || 0).toLocaleString()} ETB
                </Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                </View>
              </View>
            </MizanCard>
          );
        }}
      />

      <MintGoalSheet sheetRef={sheetRef} onClose={() => sheetRef.current?.close()} onSave={handleSaveGoal} />
    </AppScreenShell>
  );
}

const styles = StyleSheet.create({
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 100,
  },
  budgetCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: MizanColors.borderLight,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  budgetLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  budgetAmount: {
    fontSize: 20,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
    marginTop: 4,
  },
  budgetBarBg: {
    height: 10,
    backgroundColor: MizanColors.mintBg,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 12,
  },
  budgetBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  budgetMessage: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
  },
  section: {
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
  billCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  billIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: MizanColors.mintBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  billDue: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    marginTop: 2,
  },
  billAmount: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  iconButton: {
    padding: 8,
    backgroundColor: MizanColors.mintSurface,
    borderRadius: MizanRadii.full,
    borderWidth: 1,
    borderColor: MizanColors.borderLight,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: MizanSpacing.md,
    padding: 16,
  },
  goalEmojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: MizanColors.mintBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalEmoji: {
    fontSize: 28,
  },
  percentText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: MizanColors.mintDark,
  },
  goalName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: MizanColors.textPrimary,
    marginBottom: 4,
  },
  goalProgress: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: MizanColors.textSecondary,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: MizanColors.mintBg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: MizanColors.mintPrimary,
  },
  emptyState: {
    padding: MizanSpacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: MizanColors.textPrimary,
    marginTop: MizanSpacing.xl,
  },
  emptySubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: MizanColors.textSecondary,
    marginTop: MizanSpacing.xs,
  },
});
