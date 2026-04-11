import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';
import { MizanCard } from '../../components/ui/MizanCard';
import { router } from 'expo-router';
import { ArrowUpRight, ArrowDownRight, Activity, Bell, Plus } from 'lucide-react-native';

export default function DashboardScreen() {
  // Static placeholders for now
  const netWorth = 125400;
  const income = 45000;
  const expenses = 12300;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.userName}>Dawit</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')}>
            <Bell color={MizanColors.textPrimary} size={24} />
          </TouchableOpacity>
        </View>

        {/* Net Worth Card */}
        <MizanCard variant="primary" style={styles.netWorthCard}>
          <Text style={styles.netWorthLabel}>Total Net Worth</Text>
          <Text style={styles.netWorthValue}>
            ETB {netWorth.toLocaleString()}
          </Text>
          
          <View style={styles.pillsContainer}>
            <View style={styles.pill}>
              <ArrowDownRight color="#fff" size={16} />
              <Text style={styles.pillText}>+ ETB {income.toLocaleString()}</Text>
            </View>
            <View style={[styles.pill, styles.expensePill]}>
              <ArrowUpRight color={MizanColors.mintDark} size={16} />
              <Text style={[styles.pillText, {color: MizanColors.mintDark}]}>- ETB {expenses.toLocaleString()}</Text>
            </View>
          </View>
        </MizanCard>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {['Add Money', 'Send', 'Pay Bill', 'More'].map((action, i) => (
            <TouchableOpacity key={i} style={styles.actionButton}>
              <View style={styles.actionIcon}>
                <Plus color={MizanColors.mintPrimary} size={24} />
              </View>
              <Text style={styles.actionText}>{action}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nudge / Insight */}
        <MizanCard style={styles.nudgeCard} variant="outline">
          <Activity color={MizanColors.mintPrimary} size={24} />
          <View style={styles.nudgeContent}>
            <Text style={styles.nudgeTitle}>Insight</Text>
            <Text style={styles.nudgeText}>You've spent 20% less on dining this month. Keep it up!</Text>
          </View>
        </MizanCard>

        {/* Recent Transactions Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {/* Will use FlashList here */}
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MizanColors.mintBg,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: MizanTypography.sizes.body,
    color: MizanColors.textMuted,
    fontFamily: 'Inter_400Regular',
  },
  userName: {
    fontSize: MizanTypography.sizes.title,
    color: MizanColors.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  netWorthCard: {
    marginBottom: 24,
  },
  netWorthLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: MizanTypography.sizes.caption,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
  },
  netWorthValue: {
    color: '#fff',
    fontSize: MizanTypography.sizes.hero,
    fontFamily: 'Inter_900Black',
    marginBottom: 16,
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  expensePill: {
    backgroundColor: '#fff',
  },
  pillText: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    fontSize: MizanTypography.sizes.caption,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 56,
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionText: {
    fontSize: MizanTypography.sizes.caption,
    color: MizanColors.textPrimary,
    fontFamily: 'Inter_400Regular',
  },
  nudgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  nudgeContent: {
    flex: 1,
  },
  nudgeTitle: {
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
    marginBottom: 2,
  },
  nudgeText: {
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    fontSize: 13,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
    marginBottom: 16,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
  },
});
