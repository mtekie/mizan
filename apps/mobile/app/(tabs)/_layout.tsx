import React from 'react';
import { Tabs } from 'expo-router';
import { BottomTabBar } from '../../components/ui/BottomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="ledger"
        options={{
          tabBarLabel: 'Money',
        }}
      />
      <Tabs.Screen
        name="catalogue"
        options={{
          tabBarLabel: 'Find',
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          tabBarLabel: 'Goals',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Me',
        }}
      />
    </Tabs>
  );
}
