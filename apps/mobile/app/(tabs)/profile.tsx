import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';
import { Settings, LogOut, Shield, CircleUser, Target } from 'lucide-react-native';
import { MizanCard } from '../../components/ui/MizanCard';
import { useStore } from '../../lib/store';
import { supabase } from '../../lib/auth';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { profile, isGuest, setGuest, setProfile } = useStore();

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>
        
        <View style={styles.header}>
          <CircleUser color={MizanColors.mintDark} size={64} />
          <View style={styles.headerText}>
            <Text style={styles.name}>{isGuest ? 'Guest User' : (profile.fullName || 'User')}</Text>
            <Text style={styles.email}>{isGuest ? 'Limited Preview Mode' : `@${profile.username || 'username'}`}</Text>
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
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <LogOut color={MizanColors.mintCoral} size={20} />
            <Text style={[styles.menuText, { color: MizanColors.mintCoral }]}>Log Out</Text>
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
  goalsCard: {
    marginBottom: 24,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: MizanColors.mintPrimary,
  },
  goalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  goalsTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  goalsText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textPrimary,
    lineHeight: 22,
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
