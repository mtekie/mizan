import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MizanColors, MizanTypography, MizanSpacing, MizanRadii } from '@mizan/ui-tokens';
import { router } from 'expo-router';
import { useStore } from '../../lib/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MizanCard } from '../../components/ui/MizanCard';
import { Landmark, Sparkles, Target, User, ShieldCheck } from 'lucide-react-native';
import { requestSmsPermission, syncBankSmsMessages } from '../../lib/sms/parser';

const BANKS = [
  { id: 'CBE', name: 'CBE', color: '#7B1FA2' },
  { id: 'Awash', name: 'Awash', color: '#1A237E' },
  { id: 'Dashen', name: 'Dashen', color: '#D32F2F' },
  { id: 'telebirr', name: 'telebirr', color: '#00A86B' },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const { profile, setProfile, isGuest } = useStore();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setProfile({ isComplete: true });
      router.replace('/(tabs)');
    }
  };

  const startMagicScan = async () => {
    if (isGuest) {
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setScanResult('Found 12 recent bank messages! We are ready to categorize them.');
      }, 2000);
      return;
    }

    try {
      setIsScanning(true);
      const granted = await requestSmsPermission();
      if (!granted) {
        setIsScanning(false);
        setScanResult('SMS scan is optional. Manual entry is ready, and you can enable scanning later from settings.');
        return;
      }
      const messages = await syncBankSmsMessages();
      setIsScanning(false);
      if (messages.length > 0) {
        setScanResult(`Found ${messages.length} bank transactions! Your ledger will be automatically populated.`);
      } else {
        setScanResult('No recent bank messages found. You can still add transactions manually.');
      }
    } catch (e) {
      setIsScanning(false);
      setScanResult('Permission denied or error reading SMS. Manual entry is always available.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.iconCircle}>
              <User size={32} color={MizanColors.mintPrimary} />
            </View>
            <Text style={styles.title}>Welcome to Mizan</Text>
            <Text style={styles.subtitle}>Let's personalize your financial intelligence. What should we call you?</Text>
            <MizanCard style={styles.card}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Dawit Abraham"
                value={profile.fullName}
                onChangeText={(text) => setProfile({ fullName: text })}
              />
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. dawit_mizan"
                value={profile.username}
                onChangeText={(text) => setProfile({ username: text })}
                autoCapitalize="none"
              />
            </MizanCard>
          </View>
        );
      case 2:
        const goalPresets = [
          { id: '1', name: 'Emergency Fund', emoji: '🛡️', defaultTarget: '50000' },
          { id: '2', name: 'Education', emoji: '🎓', defaultTarget: '100000' },
          { id: '3', name: 'Travel', emoji: '✈️', defaultTarget: '150000' },
          { id: '4', name: 'Home', emoji: '🏠', defaultTarget: '2000000' },
        ];
        return (
          <View style={styles.stepContent}>
            <View style={styles.iconCircle}>
              <Target size={32} color={MizanColors.mintPrimary} />
            </View>
            <Text style={styles.title}>Your Goals</Text>
            <Text style={styles.subtitle}>Select what you're saving for. We'll help you track them.</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {goalPresets.map((preset) => {
                const isSelected = profile.goals.find(g => g.name === preset.name);
                return (
                  <View key={preset.id} style={{ marginBottom: 12 }}>
                    <TouchableOpacity
                      style={[
                        styles.bankButton,
                        { width: '100%' },
                        isSelected && { borderColor: MizanColors.mintPrimary, backgroundColor: MizanColors.mintPrimary + '10' }
                      ]}
                      onPress={() => {
                        if (isSelected) {
                          setProfile({ goals: profile.goals.filter(g => g.name !== preset.name) });
                        } else {
                          setProfile({ goals: [...profile.goals, { name: preset.name, target: preset.defaultTarget, emoji: preset.emoji }] });
                        }
                      }}
                    >
                      <Text style={{ fontSize: 24, marginRight: 12 }}>{preset.emoji}</Text>
                      <Text style={[styles.bankText, isSelected && { color: MizanColors.mintPrimary }]}>{preset.name}</Text>
                    </TouchableOpacity>
                    {isSelected && (
                      <MizanCard style={{ marginTop: 8, padding: 12 }}>
                        <Text style={styles.label}>Target Amount (ETB)</Text>
                        <TextInput
                          style={[styles.input, { padding: 10 }]}
                          keyboardType="numeric"
                          value={isSelected.target}
                          onChangeText={(text) => {
                            setProfile({
                              goals: profile.goals.map(g => g.name === preset.name ? { ...g, target: text } : g)
                            });
                          }}
                        />
                      </MizanCard>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.iconCircle}>
              <Landmark size={32} color={MizanColors.mintPrimary} />
            </View>
            <Text style={styles.title}>Accounts</Text>
            <Text style={styles.subtitle}>Select your primary banks and add details if you have them.</Text>
            <View style={styles.optionsGrid}>
              {BANKS.map((bank) => {
                const isSelected = profile.primaryBanks.find(b => b.bankId === bank.id);
                return (
                  <View key={bank.id} style={{ width: '100%', marginBottom: 12 }}>
                    <TouchableOpacity
                      style={[
                        styles.bankButton,
                        { width: '100%' },
                        isSelected && { borderColor: bank.color, backgroundColor: bank.color + '10' },
                      ]}
                      onPress={() => {
                        if (isSelected) {
                          setProfile({ primaryBanks: profile.primaryBanks.filter(b => b.bankId !== bank.id) });
                        } else {
                          setProfile({ primaryBanks: [...profile.primaryBanks, { bankId: bank.id, accountNumber: '', balance: '' }] });
                        }
                      }}
                    >
                      <View style={[styles.bankIndicator, { backgroundColor: bank.color }]} />
                      <Text style={[styles.bankText, isSelected && { color: bank.color }]}>{bank.name}</Text>
                    </TouchableOpacity>
                    {isSelected && (
                      <MizanCard style={{ marginTop: 8, padding: 12 }}>
                        <TextInput
                          style={[styles.input, { padding: 10, marginBottom: 8 }]}
                          placeholder="Account Number (Optional)"
                          value={isSelected.accountNumber}
                          onChangeText={(text) => {
                            setProfile({
                              primaryBanks: profile.primaryBanks.map(b => b.bankId === bank.id ? { ...b, accountNumber: text } : b)
                            });
                          }}
                        />
                        <TextInput
                          style={[styles.input, { padding: 10 }]}
                          placeholder="Current Balance (Optional)"
                          keyboardType="numeric"
                          value={isSelected.balance}
                          onChangeText={(text) => {
                            setProfile({
                              primaryBanks: profile.primaryBanks.map(b => b.bankId === bank.id ? { ...b, balance: text } : b)
                            });
                          }}
                        />
                      </MizanCard>
                    )}
                  </View>
                );
              })}
            </View>
            <TouchableOpacity style={[styles.scanBtn, { marginTop: 20 }]} onPress={startMagicScan}>
              <Sparkles size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.scanBtnText}>Scan SMS for Auto-Setup</Text>
            </TouchableOpacity>
            {scanResult && <Text style={[styles.scanResultText, { marginTop: 12 }]}>{scanResult}</Text>}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            {[1, 2, 3].map(i => (
              <View key={i} style={[styles.progressDot, i <= step && styles.progressActive]} />
            ))}
          </View>
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {renderStep()}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>{step === 3 ? 'Get Started' : 'Continue'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MizanColors.mintBg,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    height: 6,
    width: 40,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
  },
  progressActive: {
    backgroundColor: MizanColors.mintPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  stepContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    marginBottom: 32,
    lineHeight: 22,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textPrimary,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: MizanColors.mintBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: MizanColors.mintPrimary + '20',
  },
  bankButton: {
    width: '48%',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  bankIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  bankText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textSecondary,
  },
  magicCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: MizanColors.mintPrimary + '40',
  },
  scanBtn: {
    backgroundColor: MizanColors.mintPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: MizanRadii.full,
  },
  scanBtnText: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
  },
  scanningText: {
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textMuted,
    fontSize: 15,
  },
  scanResultBox: {
    alignItems: 'center',
    gap: 12,
  },
  scanResultText: {
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textPrimary,
    fontSize: 14,
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
  textArea: {
    height: 120,
    backgroundColor: '#FFF',
    textAlignVertical: 'top',
  },
  footer: {
    padding: 24,
    backgroundColor: MizanColors.mintBg,
  },
  button: {
    backgroundColor: MizanColors.mintPrimary,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: MizanColors.mintPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});
