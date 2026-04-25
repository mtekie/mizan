import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MizanColors } from '@mizan/ui-tokens';
import { Home, ReceiptText, Compass, Target, User } from 'lucide-react-native';

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {

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
        if (route.name === 'goals') Icon = Target;
        if (route.name === 'profile') Icon = User;

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            style={styles.tabButton}
          >
            {isFocused ? (
              <View style={styles.activePill}>
                <Icon size={20} color={MizanColors.mintPrimary} strokeWidth={2.5} />
              </View>
            ) : (
              <Icon 
                size={22} 
                color={MizanColors.textMuted} 
                strokeWidth={2}
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
