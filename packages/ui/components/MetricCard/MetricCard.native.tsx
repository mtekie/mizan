import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MizanColors, MizanComponentTokens, MizanRadii } from '@mizan/ui-tokens';
import type { MetricCardProps } from './MetricCard';

const T = MizanComponentTokens.statCard;

export const MetricCard: React.FC<MetricCardProps> = ({
  label, value, icon, trend, trendTone = 'positive', color, onPress,
}) => {
  const trendColor = trendTone === 'positive' ? MizanColors.mintPrimary
    : trendTone === 'negative' ? MizanColors.mintCoral : MizanColors.textMuted;
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, color ? { backgroundColor: color } : {}]}
    >
      <View style={styles.labelRow}>
        {icon && <View style={styles.iconSlot}>{icon}</View>}
        <Text style={styles.label}>{label.toUpperCase()}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {trend && <Text style={[styles.trend, { color: trendColor }]}>{trend}</Text>}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: MizanColors.mintSurface,
    borderRadius: MizanRadii.lg,
    padding: T.padding,
    gap: T.gap,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flex: 1,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  iconSlot: { marginRight: 2 },
  label: {
    fontSize: T.labelSize,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textMuted,
    letterSpacing: T.labelLetterSpacing,
  },
  value: {
    fontSize: T.valueSize,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
  },
  trend: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
});
