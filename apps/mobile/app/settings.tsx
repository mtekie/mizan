import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';
import { MizanCard } from '../components/ui/MizanCard';
import { ArrowLeft, User, Bell, Palette } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={MizanColors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <MizanCard style={styles.sectionCard}>
          <TouchableOpacity style={styles.menuItem}>
            <User color={MizanColors.textPrimary} size={20} />
            <Text style={styles.menuText}>Account Details</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Bell color={MizanColors.textPrimary} size={20} />
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Palette color={MizanColors.textPrimary} size={20} />
            <Text style={styles.menuText}>Appearance</Text>
          </TouchableOpacity>
        </MizanCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MizanColors.mintBg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  placeholder: { width: 40 },
  title: { fontSize: 20, fontFamily: 'Inter_700Bold', color: MizanColors.textPrimary },
  content: { padding: 24 },
  sectionCard: { padding: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  menuText: { fontSize: 16, fontFamily: 'Inter_400Regular', color: MizanColors.textPrimary },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginLeft: 48 }
});
