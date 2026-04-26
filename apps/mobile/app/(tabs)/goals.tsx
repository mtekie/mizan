import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import { MizanColors, MizanSpacing, MizanRadii } from '@mizan/ui-tokens';
import { Check, Plus } from 'lucide-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { MintGoalSheet } from '../../components/forms/MintGoalSheet';
import { MizanCard } from '../../components/ui/MizanCard';
import { api } from '../../lib/api';
import { useStore } from '../../lib/store';
import { formatMoney, safePercent } from '@mizan/shared';

import { AppScreenShell } from '../../components/ui/AppScreenShell';

import { Calendar, TrendingDown } from 'lucide-react-native';

export default function GoalsScreen() {
  const [goals, setGoals] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBillModal, setShowBillModal] = useState(false);
  const [billForm, setBillForm] = useState({ name: '', amount: '', dueDay: '', category: 'Bills' });
  const [contributionGoal, setContributionGoal] = useState<any | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const sheetRef = useRef<BottomSheet>(null);
  const { isGuest } = useStore();

  const isSkippedThisMonth = React.useCallback((value?: string | Date | null) => {
    if (!value) return false;
    const date = new Date(value);
    const now = new Date();
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }, []);
  
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

  const handleCreateBill = async () => {
    const amount = Number(billForm.amount);
    const dueDay = Number(billForm.dueDay);

    if (!billForm.name.trim() || !Number.isFinite(amount) || amount <= 0 || !Number.isFinite(dueDay) || dueDay < 1 || dueDay > 31) {
      return;
    }

    if (isGuest) {
      setBills([...bills, { ...billForm, id: Math.random().toString(), amount, dueDay, isPaid: false }]);
      setShowBillModal(false);
      setBillForm({ name: '', amount: '', dueDay: '', category: 'Bills' });
      return;
    }

    try {
      const created = await api.bills.create({ name: billForm.name.trim(), amount, dueDay, category: billForm.category || 'Bills' });
      setBills([...bills, created]);
      setShowBillModal(false);
      setBillForm({ name: '', amount: '', dueDay: '', category: 'Bills' });
    } catch (e) {
      console.error("Failed to create bill", e);
    }
  };

  const handleMarkBillPaid = async (bill: any) => {
    if (isGuest) {
      setBills(bills.map(item => item.id === bill.id ? { ...item, isPaid: true, lastSkipped: null } : item));
      return;
    }

    try {
      const updated = await api.bills.update({
        id: bill.id,
        name: bill.name || bill.title,
        amount: Number(bill.amount) || 0,
        dueDay: Number(bill.dueDay) || 1,
        category: bill.category || 'Bills',
        isPaid: true,
      });
      setBills(bills.map(item => item.id === updated.id ? updated : item));
    } catch (e) {
      console.error("Failed to mark bill paid", e);
    }
  };

  const handleSkipBill = async (bill: any) => {
    const skippedAt = new Date().toISOString();
    if (isGuest) {
      setBills(bills.map(item => item.id === bill.id ? { ...item, isPaid: false, lastSkipped: skippedAt } : item));
      return;
    }

    try {
      const updated = await api.bills.update({
        id: bill.id,
        name: bill.name || bill.title,
        amount: Number(bill.amount) || 0,
        dueDay: Number(bill.dueDay) || 1,
        category: bill.category || 'Bills',
        isPaid: false,
        skipThisMonth: true,
      });
      setBills(bills.map(item => item.id === updated.id ? updated : item));
    } catch (e) {
      console.error("Failed to skip bill", e);
    }
  };

  const handleAddContribution = async () => {
    const amount = Number(contributionAmount);
    if (!contributionGoal || !Number.isFinite(amount) || amount <= 0) return;

    const nextSaved = (Number(contributionGoal.saved) || 0) + amount;
    if (isGuest) {
      setGoals(goals.map(goal => goal.id === contributionGoal.id ? { ...goal, saved: nextSaved } : goal));
      setContributionGoal(null);
      setContributionAmount('');
      return;
    }

    try {
      const updated = await api.goals.contribute(contributionGoal.id, nextSaved);
      setGoals(goals.map(goal => goal.id === updated.id ? updated : goal));
      setContributionGoal(null);
      setContributionAmount('');
    } catch (e) {
      console.error("Failed to add contribution", e);
    }
  };

  const budgetItems = budgets.flatMap((budget) => {
    if (Array.isArray(budget.categories)) {
      return budget.categories.map((category: any) => ({
        id: category.id,
        category: category.name,
        limit: category.allocated,
        spent: category.spent || 0,
      }));
    }

    return [{
      id: budget.id,
      category: budget.category || 'Budget',
      limit: budget.limit || budget.totalLimit || 0,
      spent: budget.spent || 0,
    }];
  });
  const totalBudget = budgetItems.reduce((sum, b) => sum + (Number(b.limit) || 0), 0);
  const totalSpent = budgetItems.reduce((sum, b) => sum + (Number(b.spent) || 0), 0);
  const budgetProgress = Math.min(safePercent(totalSpent, totalBudget) / 100, 1);

  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* Budget Overview */}
      <MizanCard style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <View>
            <Text style={styles.budgetLabel}>Monthly Budget</Text>
            <Text style={styles.budgetAmount}>{formatMoney(totalSpent)} / {formatMoney(totalBudget)}</Text>
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
          <TouchableOpacity style={styles.smallActionButton} onPress={() => setShowBillModal(true)}>
            <Plus size={14} color={MizanColors.mintDark} />
            <Text style={styles.smallActionText}>Bill</Text>
          </TouchableOpacity>
        </View>
        {bills.length === 0 && !loading ? (
          <MizanCard style={styles.billCard}>
            <View style={styles.billIconBox}>
              <Calendar size={18} color={MizanColors.textSecondary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.billTitle}>No bills yet</Text>
              <Text style={styles.billDue}>Tap Bill to add your first reminder.</Text>
            </View>
          </MizanCard>
        ) : bills.map(bill => {
          const isSkipped = !bill.isPaid && isSkippedThisMonth(bill.lastSkipped);
          return (
          <MizanCard key={bill.id} style={styles.billCard}>
            <View style={styles.billIconBox}>
              <Calendar size={18} color={MizanColors.textSecondary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.billTitle}>{bill.title || bill.name}</Text>
              <Text style={styles.billDue}>{isSkipped ? 'Skipped this month' : `Due day ${bill.dueDay || bill.dueDate}`}</Text>
            </View>
            <Text style={styles.billAmount}>{formatMoney(bill.amount)}</Text>
            {bill.isPaid ? (
              <Text style={styles.paidLabel}>Paid</Text>
            ) : isSkipped ? (
              <Text style={styles.paidLabel}>Skipped</Text>
            ) : (
              <View style={styles.billActions}>
                <TouchableOpacity style={styles.skipButton} onPress={() => handleSkipBill(bill)}>
                  <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.paidButton} onPress={() => handleMarkBillPaid(bill)}>
                  <Check size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </MizanCard>
        );
        })}
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
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No Goals Yet</Text>
              <Text style={styles.emptySubtitle}>Tap the plus icon to start saving.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          const progress = Math.min(safePercent(item.saved, item.target) / 100, 1);
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
                  {formatMoney(item.saved || 0)} / {formatMoney(item.target || 0)}
                </Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                </View>
                <TouchableOpacity style={styles.goalActionButton} onPress={() => setContributionGoal(item)}>
                  <Plus size={13} color={MizanColors.mintDark} />
                  <Text style={styles.goalActionText}>Add contribution</Text>
                </TouchableOpacity>
              </View>
            </MizanCard>
          );
        }}
      />

      <MintGoalSheet sheetRef={sheetRef} onClose={() => sheetRef.current?.close()} onSave={handleSaveGoal} />
      <Modal visible={showBillModal} transparent animationType="slide" onRequestClose={() => setShowBillModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Bill</Text>
            <TextInput
              value={billForm.name}
              onChangeText={(name) => setBillForm({ ...billForm, name })}
              placeholder="Bill name"
              style={styles.input}
            />
            <TextInput
              value={billForm.amount}
              onChangeText={(amount) => setBillForm({ ...billForm, amount })}
              placeholder="Amount"
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              value={billForm.dueDay}
              onChangeText={(dueDay) => setBillForm({ ...billForm, dueDay })}
              placeholder="Due day, 1-31"
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowBillModal(false)}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleCreateBill}>
                <Text style={styles.primaryButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={!!contributionGoal} transparent animationType="slide" onRequestClose={() => setContributionGoal(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Contribution</Text>
            <Text style={styles.modalSubtitle}>{contributionGoal?.name}</Text>
            <TextInput
              value={contributionAmount}
              onChangeText={setContributionAmount}
              placeholder="Amount"
              keyboardType="numeric"
              style={styles.input}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setContributionGoal(null)}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleAddContribution}>
                <Text style={styles.primaryButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  smallActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: MizanRadii.full,
    backgroundColor: MizanColors.mintSurface,
    borderWidth: 1,
    borderColor: MizanColors.borderLight,
  },
  smallActionText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintDark,
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
    marginLeft: 8,
  },
  billActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 10,
  },
  skipButton: {
    minHeight: 30,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MizanColors.borderMuted,
  },
  skipButtonText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textSecondary,
  },
  paidButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: MizanColors.mintPrimary,
  },
  paidLabel: {
    marginLeft: 10,
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintDark,
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
  goalActionButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: MizanRadii.full,
    backgroundColor: MizanColors.mintSurface,
  },
  goalActionText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintDark,
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
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  modalCard: {
    padding: 24,
    paddingBottom: 36,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#fff',
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textSecondary,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: MizanColors.borderLight,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textPrimary,
    backgroundColor: MizanColors.borderMuted,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: MizanColors.borderMuted,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textSecondary,
  },
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: MizanColors.mintPrimary,
  },
  primaryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
});
