import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MizanColors } from '@mizan/ui-tokens';
import type { MizanBottomNavProps } from './MizanBottomNav';

/**
 * MizanBottomNav — Native implementation
 * Port of apps/mobile/components/ui/BottomTabBar.tsx into the shared package.
 */
export const MizanBottomNav: React.FC<MizanBottomNavProps> = ({
  tabs,
  activeTab,
  onTabPress,
}) => (
  <View style={styles.container}>
    {tabs.map((tab) => {
      const isFocused = activeTab === tab.name;
      return (
        <TouchableOpacity
          key={tab.name}
          onPress={() => onTabPress(tab.name)}
          style={styles.tabButton}
          accessibilityRole="button"
          accessibilityState={isFocused ? { selected: true } : {}}
          accessibilityLabel={tab.label}
        >
          {isFocused ? (
            <View style={styles.activePill}>{tab.icon}</View>
          ) : (
            tab.icon
          )}
          <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    minWidth: 64,
  },
  activePill: {
    backgroundColor: `${MizanColors.mintPrimary}1A`,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
});
