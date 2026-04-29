import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MizanColors, MizanComponentTokens } from '@mizan/ui-tokens';
import type { MizanChipProps } from './MizanChip';

const T = MizanComponentTokens.pillStrip;

/**
 * MizanChip — Native implementation
 */
export const MizanChip: React.FC<MizanChipProps> = ({
  label,
  emoji,
  active = false,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    style={[styles.chip, active ? styles.active : styles.inactive]}
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
  >
    <Text style={[styles.label, active ? styles.activeLabel : styles.inactiveLabel]}>
      {emoji ? `${emoji} ${label}` : label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    height: T.height,
    paddingHorizontal: 14,
    borderRadius: T.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: { backgroundColor: T.activeBg },
  inactive: { backgroundColor: T.inactiveBg },
  label: {
    fontSize: T.textSize,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.1,
  },
  activeLabel: { color: T.activeText },
  inactiveLabel: { color: T.inactiveText },
});
