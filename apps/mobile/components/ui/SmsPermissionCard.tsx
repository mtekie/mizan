import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MizanColors, MizanSpacing, MizanRadii } from '@mizan/ui-tokens';
import { Sparkles, CheckCircle2 } from 'lucide-react-native';
import { requestSmsPermission, syncBankSmsMessages } from '../../lib/sms/parser';

export function SmsPermissionCard() {
  const [step, setStep] = useState<'PROMPT' | 'SCANNING' | 'SUCCESS' | 'DENIED'>('PROMPT');
  const [foundBanks, setFoundBanks] = useState<string[]>([]);
  const [txCount, setTxCount] = useState(0);

  const handleMagicScan = async () => {
    setStep('SCANNING');
    
    try {
      const granted = await requestSmsPermission();
      if (!granted) {
        setStep('DENIED');
        return;
      }

      const transactions = await syncBankSmsMessages();
      
      // Extract unique banks found
      const uniqueBanks = Array.from(new Set(transactions.map(t => t.source)));
      
      setFoundBanks(uniqueBanks);
      setTxCount(transactions.length);
      setStep('SUCCESS');
    } catch (e) {
      console.error(e);
      setStep('DENIED');
    }
  };

  if (step === 'SUCCESS') {
    return (
      <View style={[styles.container, styles.successContainer]}>
        <View style={styles.header}>
          <CheckCircle2 color={MizanColors.mintPrimary} size={24} />
          <Text style={styles.title}>Magic Scan Complete!</Text>
        </View>
        <Text style={styles.subtitle}>
          We found {txCount} transactions from {foundBanks.length > 0 ? foundBanks.join(', ') : 'your banks'}. Your ledger is now up to date.
        </Text>
      </View>
    );
  }

  if (step === 'DENIED') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Sparkles color={MizanColors.mintGold} size={24} />
          <Text style={styles.title}>Manual tracking is ready</Text>
        </View>
        <Text style={styles.subtitle}>
          SMS scan is optional. You can add transactions manually now and enable bank SMS scanning later from settings.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Sparkles color={MizanColors.mintGold} size={24} />
        <Text style={styles.title}>Automate your tracking?</Text>
      </View>
      <Text style={styles.subtitle}>
        Enable Mizan to securely scan your incoming bank SMS messages and automatically log your expenses and income.
      </Text>

      {step === 'SCANNING' ? (
        <View style={styles.scanningContainer}>
          <ActivityIndicator color={MizanColors.mintPrimary} />
          <Text style={styles.scanningText}>Running Magic Scan...</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleMagicScan}>
          <Text style={styles.buttonText}>Enable Magic Scan</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: MizanColors.mintSurface,
    borderRadius: MizanRadii.lg,
    padding: MizanSpacing.lg,
    marginHorizontal: MizanSpacing.md,
    marginBottom: MizanSpacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: MizanColors.mintLight,
  },
  successContainer: {
    borderColor: MizanColors.mintPrimary,
    backgroundColor: '#F0FAF7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: MizanSpacing.sm,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: MizanColors.textPrimary,
    marginLeft: 8,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: MizanColors.textSecondary,
    marginBottom: MizanSpacing.md,
    lineHeight: 20,
  },
  button: {
    backgroundColor: MizanColors.mintPrimary,
    padding: MizanSpacing.md,
    borderRadius: MizanRadii.md,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#FFF',
    fontSize: 15,
  },
  scanningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: MizanSpacing.md,
    backgroundColor: '#F8FAFC',
    borderRadius: MizanRadii.md,
  },
  scanningText: {
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.mintPrimary,
    marginLeft: 8,
  },
});
