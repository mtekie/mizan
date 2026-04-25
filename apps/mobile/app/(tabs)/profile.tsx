import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';
import { Settings, LogOut, Shield, CircleUser, Target } from 'lucide-react-native';
import { MizanCard } from '../../components/ui/MizanCard';
import { useStore } from '../../lib/store';
import { supabase } from '../../lib/auth';
import { router } from 'expo-router';

import { AppScreenShell } from '../../components/ui/AppScreenShell';
import { TrendingUp } from 'lucide-react-native';

import { CheckCircle2, ChevronRight, Building2 } from 'lucide-react-native';
import { api } from '../../lib/api';

export default function ProfileScreen() {
  const { profile, isGuest, setGuest, setProfile } = useStore();
  const [accounts, setAccounts] = React.useState<any[]>([]);

  const fetchAccounts = React.useCallback(async () => {
    if (isGuest) {
      setAccounts([
        { id: '1', name: 'CBE Savings', bank: 'CBE' },
        { id: '2', name: 'Telebirr', bank: 'Ethio Telecom' },
      ]);
      return;
    }
    try {
      const data = await api.accounts.list();
      setAccounts(data);
    } catch (e) {
      console.error(e);
    }
  }, [isGuest]);

  React.useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleLogout = async () => {
    if (isGuest) {
      setGuest(false);
      setProfile({ isComplete: false });
    } else {
      await supabase.auth.signOut();
    }
    router.replace('/(auth)/login');
  };

  return (
    <AppScreenShell title="Me">
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <CircleUser color={MizanColors.mintDark} size={64} />
          <View style={styles.statusBadge}>
            <CheckCircle2 color={MizanColors.mintPrimary} size={18} fill="#fff" />
          </View>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{isGuest ? 'Guest User' : (profile.fullName || 'User')}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.email}>{isGuest ? 'Limited Preview Mode' : `@${profile.username || 'username'}`}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Verified</Text>
            </View>
          </View>
        </View>
      </View>

      {isGuest && (
        <MizanCard style={styles.guestNotice}>
          <Text style={styles.guestNoticeText}>You are currently in Guest Mode. Data will not be saved permanently.</Text>
          <TouchableOpacity style={styles.upgradeBtn} onPress={() => router.replace('/(auth)/signup' as any)}>
            <Text style={styles.upgradeBtnText}>Create Real Account</Text>
          </TouchableOpacity>
        </MizanCard>
      )}

      <Text style={styles.sectionTitle}>Connected Accounts</Text>
      <MizanCard style={styles.accountsCard}>
        {accounts.map((acc, idx) => (
          <View key={acc.id}>
            <TouchableOpacity style={styles.accountRow}>
              <View style={styles.accountIconBox}>
                <Building2 size={20} color={MizanColors.mintPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.accountName}>{acc.name}</Text>
                <Text style={styles.accountBank}>{acc.bank || 'CBE'}</Text>
              </View>
              <ChevronRight size={20} color={MizanColors.textMuted} />
            </TouchableOpacity>
            {idx < accounts.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
        {accounts.length === 0 && (
          <Text style={styles.emptyAccounts}>No accounts connected.</Text>
        )}
      </MizanCard>

      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Preferences</Text>
      <MizanCard style={styles.menuCard}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/score')}>
          <TrendingUp color={MizanColors.mintPrimary} size={20} />
          <Text style={styles.menuText}>Mizan Score</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings' as any)}>
          <Settings color={MizanColors.textPrimary} size={20} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <LogOut color={MizanColors.mintCoral} size={20} />
          <Text style={[styles.menuText, { color: MizanColors.mintCoral }]}>Log Out</Text>
        </TouchableOpacity>
      </MizanCard>
    </AppScreenShell>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
    marginTop: 8,
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
  avatarContainer: {
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  badge: {
    backgroundColor: MizanColors.mintBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintDark,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  accountsCard: {
    padding: 4,
    marginBottom: 8,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  accountIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: MizanColors.mintBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textPrimary,
  },
  accountBank: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
  },
  emptyAccounts: {
    padding: 16,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: MizanColors.textMuted,
    textAlign: 'center',
  },
  menuCard: {
    padding: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 52,
  },
  guestNotice: {
    backgroundColor: MizanColors.mintCoral + '10',
    borderColor: MizanColors.mintCoral,
    borderWidth: 1,
    padding: 16,
    marginBottom: 24,
  },
  guestNoticeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: MizanColors.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  upgradeBtn: {
    backgroundColor: MizanColors.mintPrimary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeBtnText: {
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    fontSize: 14,
  }
});
