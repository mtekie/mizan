import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
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
  ChevronRight,
  Smartphone
} from 'lucide-react-native';
import { AppScreenShell } from '../components/ui/AppScreenShell';
import { SettingsScreenDataContract } from '@mizan/shared';
import { api } from '../lib/api';

export default function SettingsScreen() {
  const [data, setData] = useState<SettingsScreenDataContract | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await api.settings.screen();
      setData(response);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <AppScreenShell title="Settings" showBack>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={MizanColors.primary} />
        </View>
      </AppScreenShell>
    );
  }

  if (!data) {
    return (
      <AppScreenShell title="Settings" showBack>
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load settings.</Text>
        </View>
      </AppScreenShell>
    );
  }

  return (
    <AppScreenShell title="Settings" showBack>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Account</Text>
        <MizanCard style={styles.sectionCard}>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleFeatureComingSoon('Personal Information')}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{data.user.initial}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuText}>{data.user.name}</Text>
              <Text style={styles.valueText}>{data.user.email}</Text>
            </View>
            <ChevronRight size={18} color={MizanColors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          {renderMenuItem(Bell, 'Notifications')}
        </MizanCard>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <MizanCard style={styles.sectionCard}>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleFeatureComingSoon('Currency')}>
            <DollarSign color={MizanColors.textPrimary} size={20} />
            <Text style={styles.menuText}>Currency</Text>
            <Text style={styles.valueText}>{data.preferences.currency}</Text>
            <ChevronRight size={18} color={MizanColors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem} onPress={() => handleFeatureComingSoon('Language')}>
            <Globe color={MizanColors.textPrimary} size={20} />
            <Text style={styles.menuText}>Language</Text>
            <Text style={styles.valueText}>{data.preferences.language}</Text>
            <ChevronRight size={18} color={MizanColors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem} onPress={() => handleFeatureComingSoon('Appearance')}>
            <Palette color={MizanColors.textPrimary} size={20} />
            <Text style={styles.menuText}>Appearance</Text>
            <Text style={styles.valueText} style={{ textTransform: 'capitalize', color: MizanColors.textMuted, marginRight: 4 }}>
              {data.preferences.theme}
            </Text>
            <ChevronRight size={18} color={MizanColors.textMuted} />
          </TouchableOpacity>
        </MizanCard>

        <Text style={styles.sectionTitle}>Security</Text>
        <MizanCard style={styles.sectionCard}>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleFeatureComingSoon('Active Sessions')}>
            <Smartphone color={MizanColors.textPrimary} size={20} />
            <Text style={styles.menuText}>Active Sessions</Text>
            <Text style={styles.valueText}>{data.security.activeSessions}</Text>
            <ChevronRight size={18} color={MizanColors.textMuted} />
          </TouchableOpacity>
          <View style={styles.divider} />
          {renderMenuItem(ShieldCheck, 'Two-Factor Auth')}
        </MizanCard>

        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        <MizanCard style={styles.sectionCard}>
          {renderMenuItem(Database, 'Export My Data')}
          <View style={styles.divider} />
          {renderMenuItem(Trash2, 'Delete Account', MizanColors.mintCoral)}
        </MizanCard>

        <View style={styles.footer}>
          <Text style={styles.versionText}>{data.appVersion}</Text>
        </View>
      </ScrollView>
    </AppScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  errorText: {
    color: MizanColors.mintCoral,
    fontFamily: 'Inter_500Medium',
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
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MizanColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: MizanColors.white,
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
});
