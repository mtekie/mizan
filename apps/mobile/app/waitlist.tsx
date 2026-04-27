import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { MizanColors, MizanRadii } from '@mizan/ui-tokens';
import { ShieldCheck, ArrowRight, Mail } from 'lucide-react-native';
import { router } from 'expo-router';

export default function WaitlistScreen() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);

  const handleVerify = () => {
    if (code.toUpperCase() === 'MIZAN2026') {
      router.replace('/(tabs)');
    } else {
      setError('Invalid invite code. Try MIZAN2026 for beta access.');
    }
  };

  if (joined) {
    return (
      <View style={styles.container}>
        <ShieldCheck size={80} color={MizanColors.mintPrimary} />
        <Text style={styles.title}>You're on the list!</Text>
        <Text style={styles.subtitle}>We'll notify you when your spot is ready. Thank you for your interest in Mizan.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ShieldCheck size={48} color={MizanColors.mintPrimary} />
        <Text style={styles.title}>Mizan Private Beta</Text>
        <Text style={styles.subtitle}>Mizan is currently invite-only. Enter your code to get started.</Text>
      </View>

      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Enter Invite Code"
          placeholderTextColor="#94A3B8"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
          <Text style={styles.verifyBtnText}>Verify Code</Text>
          <ArrowRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.line} />
      </View>

      <TouchableOpacity style={styles.waitlistBtn} onPress={() => setJoined(true)}>
        <Mail size={20} color={MizanColors.mintPrimary} />
        <Text style={styles.waitlistBtnText}>Join the Waitlist</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>Version 0.4.2 (Ethiopia Pilot)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  inputBox: {
    width: '100%',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: '#0F172A',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  verifyBtn: {
    backgroundColor: MizanColors.mintPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    gap: 8,
  },
  verifyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    gap: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
  },
  waitlistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
  },
  waitlistBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: MizanColors.mintPrimary,
  },
  footerText: {
    position: 'absolute',
    bottom: 40,
    fontSize: 10,
    fontWeight: '800',
    color: '#CBD5E1',
    letterSpacing: 1,
  }
});
