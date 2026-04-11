import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';
import { router } from 'expo-router';

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);

  const steps = [
    { title: 'Identity', text: 'Who are you?' },
    { title: 'Accounts', text: 'Link your accounts' },
    { title: 'Profile', text: 'Financial Profile' },
    { title: 'Goal', text: 'Set your first goal' },
  ];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={[styles.progressDot, i <= step && styles.progressActive]} />
          ))}
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{steps[step - 1].title}</Text>
        <Text style={styles.subtitle}>{steps[step - 1].text}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{step === 4 ? 'Finish' : 'Continue'}</Text>
        </TouchableOpacity>
      </View>
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
    height: 8,
    width: 24,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  progressActive: {
    backgroundColor: MizanColors.mintPrimary,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: MizanTypography.sizes.hero,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: MizanTypography.sizes.body,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
  },
  footer: {
    padding: 24,
  },
  button: {
    backgroundColor: MizanColors.mintPrimary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
});
