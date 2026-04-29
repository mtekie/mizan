import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ActivityIndicator, View,
} from 'react-native';
import { MizanColors, MizanRadii } from '@mizan/ui-tokens';
import type { MizanButtonProps } from './MizanButton';

/**
 * MizanButton — Native implementation
 */
export const MizanButton: React.FC<MizanButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  onPress,
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        isDisabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#fff' : MizanColors.mintPrimary}
          size="small"
        />
      ) : (
        <View style={styles.inner}>
          {iconLeft && <View style={styles.iconL}>{iconLeft}</View>}
          <Text style={[styles.label, styles[`${variant}Label`], styles[`${size}Label`]]}>
            {label}
          </Text>
          {iconRight && <View style={styles.iconR}>{iconRight}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: MizanRadii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  inner: { flexDirection: 'row', alignItems: 'center' },
  iconL: { marginRight: 8 },
  iconR: { marginLeft: 8 },

  // Variants
  primary: { backgroundColor: MizanColors.mintPrimary },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: MizanColors.mintPrimary,
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: MizanColors.mintCoral },
  disabled: { opacity: 0.45 },

  // Sizes
  sm: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: MizanRadii.md },
  md: { paddingHorizontal: 24, paddingVertical: 12 },
  lg: { paddingHorizontal: 32, paddingVertical: 16 },

  // Labels
  label: { fontFamily: 'Inter_700Bold' },
  primaryLabel: { color: '#fff' },
  secondaryLabel: { color: MizanColors.mintPrimary },
  ghostLabel: { color: MizanColors.mintPrimary },
  dangerLabel: { color: '#fff' },

  smLabel: { fontSize: 13 },
  mdLabel: { fontSize: 15 },
  lgLabel: { fontSize: 17 },
});
