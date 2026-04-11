import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';

export default function DreamsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Dreams & Goals</Text>
        <Text style={styles.subtitle}>Set budgets and track your savings goals.</Text>
        
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Goals Loading...</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MizanColors.mintBg,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: MizanTypography.sizes.hero,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
  },
  subtitle: {
    fontSize: MizanTypography.sizes.body,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    marginTop: 8,
    marginBottom: 24,
  },
  placeholder: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  placeholderText: {
    color: MizanColors.textMuted,
    fontFamily: 'Inter_400Regular',
  }
});
