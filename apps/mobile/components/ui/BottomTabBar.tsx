/**
 * BottomTabBar — Adapter that bridges React Navigation's BottomTabBarProps
 * to the cross-platform MizanBottomNav component from @mizan/ui.
 */
import React from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MizanBottomNav } from '@mizan/ui';
import type { MizanNavTab } from '@mizan/ui';
import { Home, ReceiptText, Compass, Target, User } from 'lucide-react-native';
import { MizanColors } from '@mizan/ui-tokens';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  index: Home,
  ledger: ReceiptText,
  catalogue: Compass,
  goals: Target,
  profile: User,
};

export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const tabs: MizanNavTab[] = state.routes.map((route, index) => {
    const { options } = descriptors[route.key];
    const label =
      options.tabBarLabel !== undefined
        ? (options.tabBarLabel as string)
        : options.title !== undefined
        ? options.title
        : route.name;

    const isFocused = state.index === index;
    const Icon = ICON_MAP[route.name] ?? Home;

    return {
      name: route.name,
      label,
      icon: (
        <Icon
          size={isFocused ? 20 : 22}
          color={isFocused ? MizanColors.mintPrimary : MizanColors.textMuted}
          strokeWidth={isFocused ? 2.5 : 2}
        />
      ),
    };
  });

  const activeTab = state.routes[state.index]?.name ?? '';

  return (
    <MizanBottomNav
      tabs={tabs}
      activeTab={activeTab}
      onTabPress={(name) => {
        const route = state.routes.find((r) => r.name === name);
        if (!route) return;

        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (activeTab !== name && !event.defaultPrevented) {
          navigation.navigate(name, route.params);
        }
      }}
    />
  );
}

// Also export the raw MizanBottomNav for consumers that want it
export { MizanBottomNav } from '@mizan/ui';
export type { MizanBottomNavProps, MizanNavTab } from '@mizan/ui';
