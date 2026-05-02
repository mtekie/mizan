import React, { useState, useEffect } from 'react';
import { Alert, View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Switch } from 'react-native';
import { MizanColors } from '@mizan/ui-tokens';
import { MizanCard } from '../components/ui/MizanCard';
import { 
  User, 
  Palette, 
  Globe, 
  DollarSign, 
  ShieldCheck, 
  Database, 
  Trash2, 
  ChevronRight,
  Smartphone,
  AlertTriangle,
  TrendingUp,
  Mail
} from 'lucide-react-native';
import { AppScreenShell } from '../components/ui/AppScreenShell';
import { buildSettingsScreenDataContract, SettingsScreenDataContract } from '@mizan/shared';
import { api } from '../lib/api';
import { useStore } from '../lib/store';

export default function SettingsScreen() {
  const [data, setData] = useState<SettingsScreenDataContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const { isGuest, profile } = useStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    if (isGuest) {
      setData(buildSettingsScreenDataContract({
        id: 'guest',
        name: profile.fullName || 'Guest User',
        email: profile.username || 'guest@mizan.local',
        currency: profile.currency || 'ETB',
      }));
      setLoading(false);
      return;
    }

    try {
      const response = await api.settings.screen();
      setData(response);
    } catch (err) {
      console.error('Failed to load settings:', err);
      setData(buildSettingsScreenDataContract({
        id: 'offline',
        name: profile.fullName || 'Guest User',
        email: profile.username || 'guest@mizan.local',
        currency: profile.currency || 'ETB',
      }));
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any) => {
    if (!data) return;
    const previous = data;
    const next = {
      ...data,
      preferences: ['currency', 'language', 'theme'].includes(key)
        ? { ...data.preferences, [key]: value }
        : data.preferences,
      notifications: key === 'notificationPreferences' ? { ...data.notifications, ...value } : data.notifications,
    };
    setData(next);
    if (isGuest) return;

    setSavingKey(key);
    try {
      const updated = await api.settings.update({ [key]: value } as any);
      setData(updated);
    } catch (err) {
      console.error('Failed to update setting:', err);
      setData(previous);
      Alert.alert('Setting not saved', 'Please try again in a moment.');
    } finally {
      setSavingKey(null);
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

  const renderSegment = (label: string, active: boolean, onPress: () => void) => (
    <TouchableOpacity style={[styles.segment, active && styles.segmentActive]} onPress={onPress}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderToggleRow = (Icon: any, label: string, desc: string, enabled: boolean, onToggle: () => void) => (
    <TouchableOpacity style={styles.menuItem} onPress={onToggle} activeOpacity={0.8}>
      <Icon color={MizanColors.textMuted} size={20} />
      <View style={{ flex: 1 }}>
        <Text style={styles.menuText}>{label}</Text>
        <Text style={styles.valueText}>{desc}</Text>
      </View>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        trackColor={{ false: '#CBD5E1', true: '#57AD50' }}
        thumbColor="#fff"
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <AppScreenShell title="Settings" showBack>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={MizanColors.mintPrimary} />
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
    <AppScreenShell title="Settings" subtitle="Preferences & Security" showBack scrollable={false}>
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
          <View style={styles.menuItem}>
            <View style={styles.googleIcon}>
              <Text style={styles.googleText}>G</Text>
            </View>
            <Text style={styles.menuText}>Google connected</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Active</Text>
            </View>
          </View>
        </MizanCard>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <MizanCard style={styles.sectionCard}>
          <View style={styles.menuItem}>
            <DollarSign color={MizanColors.textMuted} size={20} />
            <Text style={styles.menuText}>Default Currency</Text>
            <View style={styles.segmentGroup}>
              {['ETB', 'USD', 'EUR', 'GBP', 'AED'].map(currency => renderSegment(currency, data.preferences.currency === currency, () => updateSetting('currency', currency)))}
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.menuItem}>
            <Globe color={MizanColors.textMuted} size={20} />
            <Text style={styles.menuText}>Language</Text>
            <View style={styles.segmentGroup}>
              {renderSegment('English', data.preferences.language === 'en', () => updateSetting('language', 'en'))}
              {renderSegment('አማርኛ', data.preferences.language === 'am', () => updateSetting('language', 'am'))}
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.menuItem}>
            <Palette color={MizanColors.textMuted} size={20} />
            <Text style={styles.menuText}>Theme</Text>
            <View style={styles.segmentGroup}>
              {renderSegment('Light', data.preferences.theme === 'light', () => updateSetting('theme', 'light'))}
              {renderSegment('Dark', data.preferences.theme === 'dark', () => updateSetting('theme', 'dark'))}
            </View>
          </View>
        </MizanCard>

        <Text style={styles.sectionTitle}>Notification Preferences</Text>
        <MizanCard style={styles.sectionCard}>
          {renderToggleRow(AlertTriangle, 'Bill Reminders', 'Due dates and overdue alerts', data.notifications.bills, () => updateSetting('notificationPreferences', { bills: !data.notifications.bills }))}
          <View style={styles.divider} />
          {renderToggleRow(DollarSign, 'Spending Alerts', 'Budget limit warnings', data.notifications.spending, () => updateSetting('notificationPreferences', { spending: !data.notifications.spending }))}
          <View style={styles.divider} />
          {renderToggleRow(TrendingUp, 'AI Insights', 'Personalized financial tips', data.notifications.insights, () => updateSetting('notificationPreferences', { insights: !data.notifications.insights }))}
          <View style={styles.divider} />
          {renderToggleRow(ShieldCheck, 'Score Changes', 'Mizan Score updates', data.notifications.scores, () => updateSetting('notificationPreferences', { scores: !data.notifications.scores }))}
          <View style={styles.divider} />
          {renderToggleRow(Mail, 'Product News', 'New products and offers', data.notifications.marketing, () => updateSetting('notificationPreferences', { marketing: !data.notifications.marketing }))}
        </MizanCard>

        <Text style={styles.sectionTitle}>Security</Text>
        <MizanCard style={styles.sectionCard}>
          <TouchableOpacity style={styles.menuItem} onPress={() => handleFeatureComingSoon('Active Sessions')}>
            <Smartphone color={MizanColors.textMuted} size={20} />
            <Text style={styles.menuText}>Active Sessions</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{data.security.activeSessions === 1 ? 'Current' : `${data.security.activeSessions} devices`}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem} onPress={() => handleFeatureComingSoon('Two-Factor Auth')}>
            <ShieldCheck color={MizanColors.textMuted} size={20} />
            <Text style={styles.menuText}>Two-Factor Auth</Text>
            <View style={styles.warningPill}>
              <Text style={styles.warningPillText}>Coming Soon</Text>
            </View>
          </TouchableOpacity>
        </MizanCard>

        <Text style={styles.sectionTitle}>Data & Privacy</Text>
        <MizanCard style={styles.sectionCard}>
          {renderMenuItem(Database, 'Export My Data')}
          <View style={styles.divider} />
          {renderMenuItem(Trash2, 'Delete Account', MizanColors.mintCoral)}
        </MizanCard>

        <View style={styles.footer}>
          <Text style={styles.versionText}>{data.appVersion}</Text>
          {savingKey && <Text style={styles.savingText}>Saving...</Text>}
        </View>
      </ScrollView>
    </AppScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
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
    minHeight: 66,
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
  segmentGroup: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flexShrink: 0,
    maxWidth: 188,
  },
  segment: {
    minHeight: 30,
    minWidth: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  segmentActive: {
    backgroundColor: '#0F172A',
  },
  segmentText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textSecondary,
  },
  segmentTextActive: {
    color: '#fff',
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MizanColors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  googleText: {
    fontSize: 13,
    fontFamily: 'Inter_900Black',
    color: '#4285F4',
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#EAF7E8',
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#57AD50',
  },
  warningPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FEF3C7',
  },
  warningPillText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#D97706',
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
  savingText: {
    marginTop: 6,
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textMuted,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: MizanColors.mintPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
});
