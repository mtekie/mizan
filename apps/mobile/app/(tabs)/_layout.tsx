import React from 'react';
import { Tabs } from 'expo-router';
import { BottomTabBar } from '../../components/ui/BottomTabBar';
import { appSections } from '@mizan/shared';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {appSections.map((section) => (
        <Tabs.Screen
          key={section.key}
          name={section.nativeRoute}
          options={{
            tabBarLabel: section.label,
          }}
        />
      ))}
    </Tabs>
  );
}
