import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MizanColors, MizanRadii } from '@mizan/ui-tokens';

interface CategoryPillProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  icon?: string;
}

export const CategoryPill: React.FC<CategoryPillProps> = ({ label, isActive, onPress, icon }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.pill, 
        isActive ? styles.pillActive : styles.pillInactive
      ]}
    >
      <Text style={[
        styles.text, 
        isActive ? styles.textActive : styles.textInactive
      ]}>
        {icon ? `${icon} ` : ''}{label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: MizanRadii.full,
    marginRight: 8,
    borderWidth: 1,
  },
  pillActive: {
    backgroundColor: MizanColors.mintPrimary,
    borderColor: MizanColors.mintPrimary,
  },
  pillInactive: {
    backgroundColor: '#fff',
    borderColor: MizanColors.borderLight,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  textActive: {
    color: '#fff',
  },
  textInactive: {
    color: MizanColors.textSecondary,
  }
});
