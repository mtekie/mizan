import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MizanColors, MizanSpacing } from '@mizan/ui-tokens';
import type { MizanScreenProps } from './MizanScreen';

/**
 * MizanScreen — Native implementation
 * Provides safe-area aware header + scrollable content body.
 */
export function MizanScreen({
  title,
  subtitle,
  variant = 'plain',
  showBack = false,
  actions,
  primaryAction,
  secondaryActions,
  children,
  scrollable = true,
  refreshing = false,
  onRefresh,
}: MizanScreenProps) {
  const insets = useSafeAreaInsets();

  // Lazy-load expo-router so this file doesn't crash on web bundle
  let router: { back: () => void } | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    router = require('expo-router').router;
  } catch {
    // not available in tests / storybook
  }

  const headerActions = actions ?? (
    primaryAction || secondaryActions ? (
      <>
        {secondaryActions}
        {primaryAction}
      </>
    ) : null
  );

  const headerStyle: ViewStyle[] = [
    styles.headerWrapper,
    variant === 'hero' ? styles.heroHeader : styles.plainHeader,
    variant === 'compact' ? styles.compactHeader : {},
    { paddingTop: Math.max(insets.top, 12) },
  ];

  const Wrapper = scrollable ? ScrollView : View;

  return (
    <View style={[styles.root, variant !== 'hero' && { backgroundColor: '#F8FAFC' }]}>
      {/* ── Header ─────────────────────────────── */}
      <View style={headerStyle}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            {showBack && (
              <TouchableOpacity
                onPress={() => router?.back()}
                style={[styles.backBtn, variant === 'hero' ? styles.heroBtnBg : styles.plainBtnBg]}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                {/* Back arrow — caller may pass via actions if they want a custom icon */}
                <Text style={{ color: variant === 'hero' ? '#fff' : MizanColors.textPrimary, fontSize: 18 }}>←</Text>
              </TouchableOpacity>
            )}
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
          {headerActions && (
            <View style={styles.headerActions}>{headerActions}</View>
          )}
        </View>
      </View>

      {/* ── Content ───────────────────────────── */}
      <Wrapper
        style={styles.flex1}
        contentContainerStyle={scrollable ? styles.scrollContent : undefined}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={variant === 'hero' ? '#fff' : MizanColors.mintPrimary}
            />
          ) : undefined
        }
      >
        {children}
      </Wrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: MizanColors.mintBg,
  },
  flex1: { flex: 1 },
  headerWrapper: {
    paddingBottom: 16,
  },
  heroHeader: {
    backgroundColor: '#17A697',
  },
  plainHeader: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  compactHeader: {
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: MizanSpacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_900Black',
  },
  heroTitle: { color: '#fff' },
  plainTitle: { color: MizanColors.textPrimary },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  heroSubtitle: { color: 'rgba(255,255,255,0.8)' },
  plainSubtitle: { color: MizanColors.textMuted },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBtnBg: { backgroundColor: 'rgba(255,255,255,0.2)' },
  plainBtnBg: { backgroundColor: '#F1F5F9' },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  scrollContent: {
    padding: MizanSpacing.lg,
    paddingBottom: 100,
  },
});
