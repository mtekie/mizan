import React from 'react';
import { Alert, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MizanColors } from '@mizan/ui-tokens';
import { MizanCard } from '../components/ui/MizanCard';
import { 
  User, 
  Bell, 
  Palette, 
  Globe, 
  DollarSign, 
  ShieldCheck, 
  Database, 
  Trash2, 
  ChevronRight 
} from 'lucide-react-native';
import { AppScreenShell } from '../components/ui/AppScreenShell';

export default function SettingsScreen() {
  const handleFeatureComingSoon = (feature: string) => {
    Alert.alert('Coming Soon', `${feature} will be available in a future update.`);
  };

  const renderMenuItem = (Icon: any, label: string, color: string = MizanColors.textPrimary) => (
    <TouchableOpacity style={styles.menuItem} onPress={() => handleFeatureComingSoon(label)}>
      <Icon color={color} size={20} />
      <Text style={[styles.menuText, { color }]}>{label}</Text>
      <ChevronRight size={18} color={MizanColors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <AppScreenShell title="Settings" showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Account</Text>
        <MizanCard style={styles.sectionCard}>
          {renderMenuItem(User, 'Personal Information')}
          <View style={styles.divider} />
          {renderMenuItem(Bell, 'Notifications')}
        </MizanCard>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <MizanCard style={styles.sectionCard}>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleFeatureComingSoon('Currency')}>
            <DollarSign color={MizanColors.textPrimary} size={20} />
            <Text style={styles.menuText}>Currency</Text>
            <Text style={styles.valueText}>ETB</Text>
            <ChevronRight size={18} color={MizanColors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem} onPress={() => handleFeatureComingSoon('Language')}>
            <Globe color={MizanColors.textPrimary} size={20} />
            <Text style={styles.menuText}>Language</Text>
            <Text style={styles.valueText}>English</Text>
            <ChevronRight size={18} color={MizanColors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          {renderMenuItem(Palette, 'Appearance')}
        </MizanCard>

        <Text style={styles.sectionTitle}>Security</Text>
        <MizanCard style={styles.sectionCard}>
          {renderMenuItem(ShieldCheck, 'Password & Security')}
        </MizanCard>

        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        <MizanCard style={styles.sectionCard}>
          {renderMenuItem(Database, 'Export My Data')}
          <View style={styles.divider} />
          {renderMenuItem(Trash2, 'Delete Account', MizanColors.mintCoral)}
        </MizanCard>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Mizan v1.0.0</Text>
        </View>
      </ScrollView>
    </AppScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    padding: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textPrimary,
  },
  valueText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    marginRight: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 48,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
  },
});
