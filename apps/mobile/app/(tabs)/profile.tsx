import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';
import { Settings, LogOut, Shield, CircleUser } from 'lucide-react-native';
import { MizanCard } from '../../components/ui/MizanCard';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>
        
        <View style={styles.header}>
          <CircleUser color={MizanColors.mintDark} size={64} />
          <View style={styles.headerText}>
            <Text style={styles.name}>Dawit</Text>
            <Text style={styles.email}>dawit@example.com</Text>
          </View>
        </View>

        <MizanCard style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <Shield color={MizanColors.textPrimary} size={20} />
            <Text style={styles.menuText}>Security & Privacy</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Settings color={MizanColors.textPrimary} size={20} />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <LogOut color={MizanColors.terracotta} size={20} />
            <Text style={[styles.menuText, { color: MizanColors.terracotta }]}>Log Out</Text>
          </TouchableOpacity>
        </MizanCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: MizanTypography.sizes.hero,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  email: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
  },
  menuCard: {
    padding: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 48,
  }
});
