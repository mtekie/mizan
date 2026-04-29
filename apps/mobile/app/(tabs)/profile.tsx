import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MizanColors } from '@mizan/ui-tokens';
import { MizanComponentTokens } from '@mizan/ui-tokens';
import { Settings, LogOut, Shield, CircleUser, HelpCircle, Info, ChevronRight, Building2, TrendingUp, ShieldCheck } from 'lucide-react-native';
import { MizanCard } from '../../components/ui/MizanCard';
import { useStore } from '../../lib/store';
import { supabase } from '../../lib/auth';
import { router } from 'expo-router';
import { AppScreenShell } from '../../components/ui/AppScreenShell';
import { api } from '../../lib/api';
import { buildProfileScreenDataContract, demoAccounts, demoUser, buildProfileVM, buildAccountsVM, type ProfileScreenDataContract } from '@mizan/shared';

const T = MizanComponentTokens;

export default function ProfileScreen() {
  const { profile, isGuest, setGuest, setProfile } = useStore();
  const [accounts, setAccounts] = React.useState<any[]>([]);
  const [profileScreen, setProfileScreen] = React.useState<ProfileScreenDataContract | null>(null);

  const fetchAccounts = React.useCallback(async () => {
    if (isGuest) {
      setAccounts(demoAccounts);
      setProfileScreen(buildProfileScreenDataContract({ user: demoUser, accounts: demoAccounts }));
      return;
    }
    try {
      const data = await api.profile.screen();
      setAccounts(data.accounts);
      setProfileScreen(data.profileScreen);
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

  const screenUser = isGuest
    ? demoUser
    : {
        name: profile.fullName || 'User',
        email: (profile as any).email || '',
        mizanScore: (profile as any).mizanScore ?? 690,
        isProfileComplete: profile.isComplete,
      };
  const profileVM = profileScreen?.profile ?? buildProfileVM(screenUser, accounts);
  const score = profileVM.score;
  const scoreLabel = score > 750 ? 'Excellent' : score > 600 ? 'Good' : 'Fair';
  const accountsVM = profileScreen?.accounts ?? buildAccountsVM(accounts);

  return (
    <AppScreenShell
      title="Me"
      subtitle="Manage your identity and connected accounts"
      variant="hero"
      actions={
        <TouchableOpacity
          onPress={() => router.push('/settings' as any)}
          style={styles.settingsBtn}
        >
          <Settings color="#fff" size={20} />
        </TouchableOpacity>
      }
    >
      {/* Profile Identity */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <CircleUser color={MizanColors.mintDark} size={64} />
          <View style={styles.statusBadge}>
            <ShieldCheck color={MizanColors.mintPrimary} size={18} />
          </View>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.name}>{profileVM.name}</Text>
          <Text style={styles.email}>{isGuest ? profileVM.email : `@${profile.username || 'username'}`}</Text>
        </View>
        <TouchableOpacity
          style={styles.editProfileBtn}
          onPress={() => router.push('/score?action=complete-profile')}
        >
          <Text style={styles.editProfileText}>{profile?.isComplete ? 'Edit Profile' : 'Complete Profile'}</Text>
        </TouchableOpacity>
      </View>

      {isGuest && (
        <MizanCard style={styles.guestNotice}>
          <Text style={styles.guestNoticeText}>You are currently in Guest Mode. Data will not be saved permanently.</Text>
          <TouchableOpacity style={styles.upgradeBtn} onPress={() => router.replace('/(auth)/signup' as any)}>
            <Text style={styles.upgradeBtnText}>Create Real Account</Text>
          </TouchableOpacity>
        </MizanCard>
      )}

      {/* Profile Verification */}
      {!isGuest && (
        <MizanCard style={styles.verificationCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={styles.verificationIcon}>
              <ShieldCheck color="#059669" size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.verificationTitle}>Verified Identity</Text>
              <Text style={styles.verificationSubtitle}>Your profile meets standard requirements for tier 2 banking.</Text>
            </View>
          </View>
        </MizanCard>
      )}

      {/* Mizan Score Card */}
      <TouchableOpacity onPress={() => router.push('/score')}>
        <MizanCard style={styles.scoreCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={styles.scoreIcon}>
              <TrendingUp color={MizanColors.mintPrimary} size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.scoreTitle}>Mizan Score</Text>
              <Text style={styles.scoreSubtitle}>{scoreLabel} • Last updated today</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.scoreValue}>{score}</Text>
              <Text style={styles.scoreLabel}>{scoreLabel}</Text>
            </View>
            <ChevronRight size={18} color={MizanColors.textMuted} />
          </View>
        </MizanCard>
      </TouchableOpacity>

      {/* Connected Accounts with Balances */}
      <Text style={styles.sectionTitle}>Connected Accounts</Text>
      <MizanCard style={styles.accountsCard}>
        {accountsVM.map((acc, idx) => (
          <View key={acc.id}>
            <TouchableOpacity style={styles.accountRow}>
              <View style={[styles.accountIconBox, { backgroundColor: acc.color + '18' }]}>
                <Building2 size={T.accountTile.iconSize} color={acc.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.accountName}>{acc.name}</Text>
                <Text style={styles.accountBank}>{acc.type} • {acc.number}</Text>
              </View>
              <Text style={styles.accountBalance}>{acc.balanceFormatted}</Text>
            </TouchableOpacity>
            {idx < accountsVM.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
        {accountsVM.length === 0 && (
          <Text style={styles.emptyAccounts}>{profileScreen?.states.accountsEmpty.title ?? 'No accounts connected.'}</Text>
        )}
      </MizanCard>

      {/* Security & Privacy */}
      {/* SECTION: security_privacy */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Security & Privacy</Text>
      <MizanCard style={styles.securityCard}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
          <View style={styles.securityIcon}>
            <Shield color="#fff" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.securityTitle}>Your data is encrypted</Text>
            <Text style={styles.securitySubtitle}>Bank-grade protocols. We never share your personal information without explicit consent.</Text>
            <TouchableOpacity style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 4 }} onPress={() => router.push('/settings' as any)}>
              <Text style={{ fontSize: 12, fontFamily: 'Inter_700Bold', color: MizanColors.mintPrimary }}>Review security settings</Text>
              <ChevronRight size={14} color={MizanColors.mintPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </MizanCard>

      {/* Settings & Support Links */}
      {/* SECTION: settings_links */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Settings & Support</Text>
      <MizanCard style={styles.menuCard}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings' as any)}>
          <Settings color={MizanColors.textPrimary} size={20} />
          <Text style={styles.menuText}>Settings</Text>
          <ChevronRight size={16} color={MizanColors.textMuted} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.menuItem}>
          <HelpCircle color={MizanColors.mintPrimary} size={20} />
          <Text style={styles.menuText}>Send Feedback</Text>
          <ChevronRight size={16} color={MizanColors.textMuted} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push({ pathname: '/legal', params: { type: 'privacy' } })}
        >
          <Info color={MizanColors.textMuted} size={20} />
          <Text style={styles.menuText}>Privacy Policy</Text>
          <ChevronRight size={16} color={MizanColors.textMuted} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => router.push({ pathname: '/legal', params: { type: 'terms' } })}
        >
          <Shield color={MizanColors.textMuted} size={20} />
          <Text style={styles.menuText}>Terms of Service</Text>
          <ChevronRight size={16} color={MizanColors.textMuted} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <LogOut color="#EF4444" size={20} />
          <Text style={[styles.menuText, { color: '#EF4444' }]}>Log Out</Text>
          <ChevronRight size={16} color={MizanColors.textMuted} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      </MizanCard>

      <View style={styles.footerInfo}>
        <Text style={styles.versionText}>Mizan v0.4.2 Beta</Text>
        <Text style={styles.eduDisclaimer}>This app is for educational purposes only.</Text>
      </View>
    </AppScreenShell>
  );
}

const styles = StyleSheet.create({
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  statusBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  headerText: {
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
  },
  email: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    marginTop: 2,
  },
  editProfileBtn: {
    backgroundColor: MizanColors.mintPrimary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  editProfileText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  guestNotice: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
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
  },
  verificationCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
  },
  verificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  verificationSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    marginTop: 2,
  },
  scoreCard: {
    padding: 16,
    marginBottom: 16,
  },
  scoreIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: MizanColors.mintBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  scoreSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    marginTop: 2,
  },
  scoreValue: {
    fontSize: 28,
    fontFamily: 'Inter_900Black',
    color: MizanColors.mintDark,
  },
  scoreLabel: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintPrimary,
    textTransform: 'uppercase',
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
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
    padding: 14,
    gap: 12,
  },
  accountIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  accountBank: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
  },
  accountBalance: {
    fontSize: 15,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
  },
  emptyAccounts: {
    padding: 16,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: MizanColors.textMuted,
    textAlign: 'center',
  },
  securityCard: {
    padding: 16,
    backgroundColor: '#0F172A',
    marginBottom: 8,
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  securitySubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#94A3B8',
    marginTop: 2,
    lineHeight: 18,
  },
  menuCard: {
    padding: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 52,
  },
  footerInfo: {
    padding: 40,
    alignItems: 'center',
    gap: 8,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textMuted,
  },
  eduDisclaimer: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    textAlign: 'center',
  },
});
