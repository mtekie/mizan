import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MizanColors } from '@mizan/ui-tokens';
import { Home, ReceiptText, Compass, User } from 'lucide-react-native';
import { useStore } from '../../lib/store';

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const uiMode = useStore((s) => s.uiMode);

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        let Icon = Home;
        if (route.name === 'ledger') Icon = ReceiptText;
        if (route.name === 'catalogue') Icon = Compass;
        if (route.name === 'profile') Icon = User;

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabButton}
          >
            {uiMode === 'simple' && isFocused ? (
              <View style={styles.activePill}>
                <Icon size={20} color={MizanColors.mintPrimary} strokeWidth={2.5} />
              </View>
            ) : (
              <Icon 
                size={22} 
                color={isFocused ? MizanColors.mintPrimary : MizanColors.textMuted} 
                strokeWidth={isFocused ? 2.5 : 2}
              />
            )}
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? MizanColors.textPrimary : MizanColors.textMuted },
                isFocused && styles.tabLabelActive,
              ]}
            >
              {label as string}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

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
    backgroundColor: 'rgba(69, 191, 160, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  tabLabelActive: {
    fontFamily: 'Inter_700Bold',
  },
});
