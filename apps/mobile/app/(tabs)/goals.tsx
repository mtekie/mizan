import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { MizanColors, MizanSpacing, MizanRadii } from '@mizan/ui-tokens';
import { Check, Plus, Lightbulb, ReceiptText, ShoppingBasket, LayoutTemplate } from 'lucide-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { MintGoalSheet } from '../../components/forms/MintGoalSheet';
import { MizanCard } from '../../components/ui/MizanCard';
import { api } from '../../lib/api';
import { useStore } from '../../lib/store';
import {
  demoBills,
  demoBudgets,
  demoGoals,
  buildBudgetOverviewVM,
  buildGoalsScreenDataContract,
  buildForecastText,
  buildGoalsVM,
  buildQuickStatsVM,
  formatMoney,
  type GoalsScreenDataContract,
} from '@mizan/shared';

import { AppScreenShell } from '../../components/ui/AppScreenShell';

import { Calendar } from 'lucide-react-native';

export default function GoalsScreen() {
  const [goals, setGoals] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [goalsScreen, setGoalsScreen] = useState<GoalsScreenDataContract>(() => buildGoalsScreenDataContract({ budgets: demoBudgets, goals: demoGoals, bills: demoBills }));
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
  
  const loadData = React.useCallback(async () => {
    setLoading(true);
    if (isGuest) {
      setGoals(demoGoals);
      setBudgets(demoBudgets);
      setBills(demoBills);
      setGoalsScreen(buildGoalsScreenDataContract({ budgets: demoBudgets, goals: demoGoals, bills: demoBills }));
      setLoading(false);
      return;
    }
    try {
      const data = await api.goals.screen();
      setGoals(data.goals);
      setBudgets(data.budgets);
      setBills(data.bills);
      setGoalsScreen(data.goalsScreen);
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

  const budgetVM = buildBudgetOverviewVM(budgets);
  const budgetRing = 2 * Math.PI * 40;
  const budgetStroke = `${(budgetVM.percent / 100) * budgetRing} ${budgetRing}`;
  const goalsVMData = buildGoalsVM(goals);
  const quickStatsVM = buildQuickStatsVM(budgetVM, goalsVMData);
  const forecastText = goalsScreen.forecastText || buildForecastText(goalsVMData, budgetVM);

  const renderHeader = () => (
    <View style={styles.headerSection}>
      {/* SECTION: budget_overview */}
      <MizanCard style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <View>
            <Text style={styles.budgetKicker}>This Month</Text>
            <Text style={styles.budgetTitle}>{budgetVM.monthLabel} Budget</Text>
          </View>
          <View style={styles.budgetChips}>
            <TouchableOpacity style={styles.budgetChip}>
              <LayoutTemplate size={13} color={MizanColors.textSecondary} />
              <Text style={styles.budgetChipText}>Templates</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.budgetChip, styles.categoryChip]}>
              <Plus size={13} color="#3EA63B" />
              <Text style={[styles.budgetChipText, { color: '#3EA63B' }]}>Category</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.budgetSummaryRow}>
          <View style={styles.budgetRing}>
            <Svg width={92} height={92} viewBox="0 0 100 100">
              <Circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="8" />
              <Circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={budgetVM.isOverBudget ? '#EF4444' : '#3EA63B'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={budgetStroke}
                rotation="-90"
                origin="50,50"
              />
            </Svg>
            <View style={styles.budgetRingLabel}>
              <Text style={styles.budgetPercent}>{budgetVM.percent}%</Text>
              <Text style={styles.budgetUsed}>Used</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.budgetAmount}>{budgetVM.totalSpentFormatted}</Text>
            <Text style={styles.budgetSubAmount}>of {budgetVM.totalBudgetFormatted} budget</Text>
            <Text style={styles.budgetRemaining}>{budgetVM.remainingFormatted} remaining</Text>
          </View>
        </View>
        <View style={styles.budgetCategories}>
          {budgetVM.categories.map((category) => (
            <View key={category.id} style={styles.budgetCategoryRow}>
              <View style={styles.categoryIconBox}>
                <ShoppingBasket size={18} color={MizanColors.textSecondary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.categoryTextRow}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryAmount}>{category.spentFormatted} <Text style={styles.categoryAllocated}>/ {category.allocatedFormatted}</Text></Text>
                </View>
                <View style={styles.budgetBarBg}>
                  <View style={[styles.budgetBarFill, { width: `${category.percent}%`, backgroundColor: category.isOverBudget ? '#EF4444' : MizanColors.mintPrimary }]} />
                </View>
              </View>
            </View>
          ))}
        </View>
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
              <Text style={styles.billTitle}>{goalsScreen.states.billsEmpty.title}</Text>
              <Text style={styles.billDue}>{goalsScreen.states.billsEmpty.description}</Text>
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

      {/* Plan Insight / Budget Forecast */}
      <MizanCard style={[styles.billCard, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
          <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: MizanColors.mintPrimary, justifyContent: 'center', alignItems: 'center' }}>
            <Lightbulb size={16} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontFamily: 'Inter_700Bold', color: MizanColors.mintDark, marginBottom: 4 }}>Plan Insight</Text>
            <Text style={{ fontSize: 12, fontFamily: 'Inter_400Regular', color: MizanColors.textPrimary, lineHeight: 18 }}>
              {forecastText}
            </Text>
          </View>
        </View>
      </MizanCard>

      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Savings Goals</Text>
      </View>
    </View>
  );

  return (
    <AppScreenShell
      title="Goals"
      subtitle="Budgets, bills, and savings goals"
      variant="plain"
      scrollable={false}
      onRefresh={loadData}
      refreshing={loading}
      actions={
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={styles.iconButton}>
            <ReceiptText color={MizanColors.textPrimary} size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: MizanColors.mintPrimary }]} onPress={() => sheetRef.current?.expand()}>
            <Plus color="#fff" size={20} />
          </TouchableOpacity>
        </View>
      }
    >
      <FlatList
        data={goalsVMData.goals}
        keyExtractor={item => item.id || Math.random().toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          <View style={styles.quickStats}>
            <MizanCard style={styles.quickStatCard}>
              <Text style={styles.quickStatLabel}>Avg. Monthly Save</Text>
              <Text style={styles.quickStatPrimary}>{quickStatsVM.avgMonthlySaveFormatted}</Text>
            </MizanCard>
            <MizanCard style={styles.quickStatCard}>
              <Text style={styles.quickStatLabel}>Goals On Track</Text>
              <Text style={styles.quickStatValue}>{quickStatsVM.goalsOnTrack}</Text>
            </MizanCard>
          </View>
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>{goalsScreen.states.goalsEmpty.title}</Text>
              <Text style={styles.emptySubtitle}>{goalsScreen.states.goalsEmpty.description}</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => {
          return (
            <MizanCard style={styles.goalCard}>
              <View style={styles.goalEmojiContainer}>
                <Text style={styles.goalEmoji}>{item.emoji || '🎯'}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={styles.goalName}>{item.name}</Text>
                  <Text style={styles.percentText}>{item.percent}%</Text>
                </View>
                <Text style={styles.goalProgress}>
                  {item.savedFormatted} / {item.targetFormatted}
                </Text>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${item.percent}%` }]} />
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
  budgetKicker: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#3EA63B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  budgetTitle: {
    fontSize: 19,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  budgetChips: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: 1,
    marginLeft: 12,
  },
  budgetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    minHeight: 32,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  categoryChip: {
    backgroundColor: '#EAF7E8',
  },
  budgetChipText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textSecondary,
  },
  budgetSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginBottom: 18,
  },
  budgetRing: {
    width: 92,
    height: 92,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetRingLabel: {
    position: 'absolute',
    alignItems: 'center',
  },
  budgetPercent: {
    fontSize: 20,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
  },
  budgetUsed: {
    marginTop: 2,
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    color: MizanColors.textMuted,
  },
  budgetAmount: {
    fontSize: 26,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
  },
  budgetSubAmount: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textMuted,
    marginTop: 2,
  },
  budgetRemaining: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#3EA63B',
    marginTop: 4,
  },
  budgetCategories: {
    gap: 12,
  },
  budgetCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: MizanColors.borderLight,
    borderRadius: 16,
  },
  categoryIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryTextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  categoryAmount: {
    fontSize: 12,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
  },
  categoryAllocated: {
    color: MizanColors.textMuted,
    fontFamily: 'Inter_700Bold',
  },
  budgetBarBg: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    overflow: 'hidden',
  },
  budgetBarFill: {
    height: '100%',
    borderRadius: 5,
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
    marginHorizontal: 24,
    marginBottom: MizanSpacing.md,
    padding: 16,
  },
  quickStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingHorizontal: 24,
  },
  quickStatCard: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    minHeight: 76,
    justifyContent: 'center',
  },
  quickStatLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
    textAlign: 'center',
  },
  quickStatPrimary: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    color: MizanColors.mintPrimary,
    textAlign: 'center',
  },
  quickStatValue: {
    fontSize: 18,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
    textAlign: 'center',
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
