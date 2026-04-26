import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';
import { formatMoney, safePercent } from '@mizan/shared';

interface MintBudgetBarProps {
  spent: number;
  total: number;
  title: string;
}

export function MintBudgetBar({ spent, total, title }: MintBudgetBarProps) {
  const percent = Math.min(100, Math.max(0, safePercent(spent, total)));
  const isOver = spent > total;
  const left = Math.max(0, total - spent);

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const pacePercent = (currentDay / daysInMonth) * 100;
  
  const statusColor = isOver 
    ? MizanColors.mintCoral 
    : (percent > pacePercent && percent > 80 ? MizanColors.mintGold : MizanColors.mintPrimary);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.headerRow}>
        <View style={styles.spentContainer}>
          <Text style={styles.spentValue}>{formatMoney(spent)}</Text>
          <Text style={styles.ofTotal}> of {formatMoney(total)}</Text>
        </View>
        {!isOver ? (
          <Text style={styles.leftValue}>{formatMoney(left)} left</Text>
        ) : (
          <Text style={styles.overValue}>Over budget</Text>
        )}
      </View>
      
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: statusColor }]} />
        <View style={[styles.paceMarker, { left: `${pacePercent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  spentContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  spentValue: {
    fontSize: 16,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
  },
  ofTotal: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textMuted,
  },
  leftValue: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textMuted,
  },
  overValue: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintCoral,
  },
  barBackground: {
    height: 10,
    backgroundColor: '#F1F5F9', // slate-100
    borderRadius: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  paceMarker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#CBD5E1', // slate-300
  }
});
