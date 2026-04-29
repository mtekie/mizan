import React from 'react';
import { View, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { MizanColors, MizanRadii } from '@mizan/ui-tokens';
import type { MizanCardProps } from './MizanCard';

/**
 * MizanCard — Native implementation
 * Uses RN StyleSheet with shadow props (iOS) and elevation (Android).
 */
export const MizanCard: React.FC<MizanCardProps> = ({
  children,
  style,
  variant = 'default',
  onPress,
}) => {
  const cardStyle: StyleProp<ViewStyle> = [styles.base, styles[variant], style as StyleProp<ViewStyle>];

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={cardStyle}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: MizanRadii.xl,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  default: {
    backgroundColor: MizanColors.mintSurface,
  },
  primary: {
    backgroundColor: MizanColors.mintPrimary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: MizanColors.borderLight,
  },
  glass: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
});
