import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MizanColors, MizanRadii, MizanSpacing } from '@mizan/ui-tokens';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md';
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, size = 'md' }) => {
  const getScoreColor = () => {
    if (score >= 80) return '#00A86B'; // High Match
    if (score >= 50) return MizanColors.mintGold; // Medium Match
    return MizanColors.textMuted; // Low Match
  };

  const isHigh = score >= 80;

  return (
    <View style={[
      styles.container, 
      { backgroundColor: getScoreColor() + (isHigh ? '20' : '10') },
      size === 'sm' && styles.containerSm
    ]}>
      <Text style={[
        styles.text, 
        { color: getScoreColor() },
        size === 'sm' && styles.textSm
      ]}>
        {score}% Match
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: MizanRadii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  textSm: {
    fontSize: 10,
  }
});
