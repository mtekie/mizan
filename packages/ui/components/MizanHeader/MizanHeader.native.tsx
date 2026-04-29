import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MizanColors, MizanSpacing } from '@mizan/ui-tokens';
import type { MizanHeaderProps } from './MizanHeader';

/**
 * MizanHeader — Native implementation
 */
export function MizanHeader({
  title,
  subtitle,
  variant = 'plain',
  showBack = false,
  leftAction,
  rightAction,
}: MizanHeaderProps) {
  const insets = useSafeAreaInsets();

  let router: { back: () => void } | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    router = require('expo-router').router;
  } catch { /* noop */ }

  const wrapperStyle: ViewStyle[] = [
    styles.wrapper,
    variant === 'hero' ? styles.heroWrapper : styles.plainWrapper,
    variant === 'compact' ? styles.compactWrapper : {},
    { paddingTop: Math.max(insets.top, 12) },
  ];

  const defaultBack = showBack && !leftAction ? (
    <TouchableOpacity
      onPress={() => router?.back()}
      style={[styles.iconBtn, variant === 'hero' ? styles.heroBtnBg : styles.plainBtnBg]}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <Text style={{ color: variant === 'hero' ? '#fff' : MizanColors.textPrimary, fontSize: 18 }}>←</Text>
    </TouchableOpacity>
  ) : null;

  return (
    <View style={wrapperStyle}>
      <View style={styles.inner}>
        <View style={styles.leading}>
          {leftAction ?? defaultBack}
          <View>
            <Text style={[styles.title, variant === 'hero' ? styles.heroTitle : styles.plainTitle]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.subtitle, variant === 'hero' ? styles.heroSubtitle : styles.plainSubtitle]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightAction && <View style={styles.trailing}>{rightAction}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingBottom: 16 },
  heroWrapper: { backgroundColor: '#17A697' },
  plainWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  compactWrapper: { paddingBottom: 12 },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: MizanSpacing.lg,
  },
  leading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  trailing: { flexDirection: 'row', gap: 12 },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  heroBtnBg: { backgroundColor: 'rgba(255,255,255,0.2)' },
  plainBtnBg: { backgroundColor: '#F1F5F9' },
  title: { fontSize: 20, fontFamily: 'Inter_900Black' },
  heroTitle: { color: '#fff' },
  plainTitle: { color: MizanColors.textPrimary },
  subtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  heroSubtitle: { color: 'rgba(255,255,255,0.8)' },
  plainSubtitle: { color: MizanColors.textMuted },
});
