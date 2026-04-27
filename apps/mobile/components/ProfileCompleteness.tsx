import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MizanColors, MizanRadii } from '@mizan/ui-tokens';
import { ShieldCheck, ChevronRight, Trophy } from 'lucide-react-native';
import { router } from 'expo-router';
import { getProfileCompletion } from '@mizan/shared';

export function ProfileCompleteness({ user }: { user: any }) {
  const { percentage } = getProfileCompletion(user || {});
  
  if (percentage === 100) return null;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push('/(onboarding)')}
    >
      <View style={styles.content}>
        <View style={styles.info}>
          <View style={styles.badge}>
            <ShieldCheck size={12} color={MizanColors.mintPrimary} />
            <Text style={styles.badgeText}>PROFILE PROGRESS</Text>
          </View>
          <Text style={styles.title}>{percentage}% Complete</Text>
          <Text style={styles.subtitle}>Help Mizan understand you better.</Text>
        </View>

        <View style={styles.progressBox}>
           <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
           </View>
           <ChevronRight size={20} color="#CBD5E1" />
        </View>
      </View>
      <View style={styles.trophyIcon}>
        <Trophy size={48} color="#0F172A" opacity={0.05} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: MizanColors.mintPrimary,
    letterSpacing: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  progressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBg: {
    width: 60,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: MizanColors.mintPrimary,
  },
  trophyIcon: {
    position: 'absolute',
    right: -10,
    top: -10,
    transform: [{ rotate: '15deg' }],
  }
});
