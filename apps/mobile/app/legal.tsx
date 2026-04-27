import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AppScreenShell } from '../components/ui/AppScreenShell';
import { MizanColors } from '@mizan/ui-tokens';

export default function LegalScreen() {
  const { type } = useLocalSearchParams();
  const isPrivacy = type === 'privacy';

  return (
    <AppScreenShell title={isPrivacy ? 'Privacy Policy' : 'Terms of Service'}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{isPrivacy ? 'Your Privacy at Mizan' : 'Terms of Beta Usage'}</Text>
        <Text style={styles.date}>Last updated: April 26, 2026</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isPrivacy ? '1. Data Collection' : '1. Beta Nature'}</Text>
          <Text style={styles.text}>
            {isPrivacy 
              ? 'We collect financial data from connected accounts and self-declared profile info to calculate your Mizan Score. This data is encrypted and used only for your benefit.' 
              : 'Mizan is currently in Private Beta. Features may change, and data persistence is not guaranteed during this phase.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{isPrivacy ? '2. Sharing Control' : '2. Educational Use'}</Text>
          <Text style={styles.text}>
            {isPrivacy 
              ? 'You have full control over who sees your Trust Card. Sharing is private by default, and links can be revoked instantly.' 
              : 'The Mizan Score is an educational trust indicator and does not constitute a formal financial or credit offer from any bank.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Contact</Text>
          <Text style={styles.text}>
            Questions? Contact us at support@mizan.et
          </Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </AppScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  spacer: {
    height: 60,
  }
});
