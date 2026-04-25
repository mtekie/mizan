import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MizanColors, MizanRadii, MizanSpacing } from '@mizan/ui-tokens';
import { UserCircle, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface ProfileBridgeProps {
  completeness: number; // 0 to 1
}

export const ProfileBridge: React.FC<ProfileBridgeProps> = ({ completeness }) => {
  const router = useRouter();
  
  const isGuest = completeness === 0;

  if (completeness >= 0.8) return null;

  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.9}
      onPress={() => router.push(isGuest ? '/(auth)/login' : '/profile')}
    >
      <View style={styles.iconBox}>
        <UserCircle size={24} color={MizanColors.mintPrimary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>
          {isGuest ? 'Sign in for Personalization' : 'Improve Your Matches'}
        </Text>
        <Text style={styles.subtitle}>
          {isGuest 
            ? 'Sign in to see products matched to your income and sector.' 
            : `Your profile is ${Math.round(completeness * 100)}% complete. Finish it to unlock better rates.`}
        </Text>
        {!isGuest && (
          <View style={styles.progressBar}>
             <View style={[styles.progressFill, { width: `${completeness * 100}%` }]} />
          </View>
        )}
      </View>
      <ArrowRight size={20} color={MizanColors.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: MizanRadii.lg,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: MizanColors.mintPrimary + '30',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: MizanColors.mintBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: MizanColors.borderMuted,
    borderRadius: 2,
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: MizanColors.mintPrimary,
    borderRadius: 2,
  }
});
