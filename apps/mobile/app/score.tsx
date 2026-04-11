import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

export default function ScoreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={MizanColors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Mizan Score</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>785</Text>
          <Text style={styles.scoreLabel}>Excellent</Text>
        </View>
        <Text style={styles.subtitle}>Your financial health is looking strong. Keep building credit to unlock premium catalogue products.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MizanColors.mintBg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  placeholder: { width: 40 },
  title: { fontSize: 20, fontFamily: 'Inter_700Bold', color: MizanColors.textPrimary },
  content: { padding: 24, alignItems: 'center', justifyContent: 'center', flex: 1 },
  scoreCircle: { width: 240, height: 240, borderRadius: 120, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 32, borderWidth: 8, borderColor: MizanColors.mintPrimary },
  scoreValue: { fontSize: 64, fontFamily: 'Inter_900Black', color: MizanColors.textPrimary },
  scoreLabel: { fontSize: 20, fontFamily: 'Inter_700Bold', color: MizanColors.mintPrimary, marginTop: 4 },
  subtitle: { fontSize: 16, fontFamily: 'Inter_400Regular', color: MizanColors.textMuted, textAlign: 'center', lineHeight: 24 },
});
