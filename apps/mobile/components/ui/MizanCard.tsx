import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { MizanColors } from '@mizan/ui-tokens';

interface MizanCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'primary' | 'outline';
}

export const MizanCard: React.FC<MizanCardProps> = ({ children, style, variant = 'default' }) => {
  return (
    <View style={[styles.card, styles[variant], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    borderColor: '#E2E8F0',
  },
});
