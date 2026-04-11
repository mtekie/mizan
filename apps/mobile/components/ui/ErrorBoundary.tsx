import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';

interface Props {
  error: Error;
  retry: () => void;
}

export function ErrorBoundary({ error, retry }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.subtitle}>{error.message}</Text>
      
      <TouchableOpacity style={styles.button} onPress={retry}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MizanColors.mintBg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: MizanTypography.sizes.title,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: MizanTypography.sizes.body,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: MizanColors.mintPrimary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
  }
});
