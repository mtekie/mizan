import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MizanColors, MizanTypography, MizanSpacing, MizanRadii } from '@mizan/ui-tokens';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

interface AppScreenShellProps {
  title: string;
  subtitle?: string;
  variant?: 'hero' | 'plain';
  showBack?: boolean;
  actions?: React.ReactNode;
  children: React.ReactNode;
  scrollable?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
}

/**
 * AppScreenShell
 * 
 * Standardized screen wrapper for Mizan Mobile.
 * Handles safe areas, headers, and consistent spacing.
 */
export function AppScreenShell({
  title,
  subtitle,
  variant = 'plain',
  showBack = false,
  actions,
  children,
  scrollable = true,
  refreshing = false,
  onRefresh,
}: AppScreenShellProps) {
  const ContentWrapper = scrollable ? ScrollView : View;
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, variant === 'plain' && { backgroundColor: '#F8FAFC' }]}>
      <View
        style={[
          styles.headerWrapper,
          variant === 'hero' ? styles.heroHeader : styles.plainHeader,
          { paddingTop: Math.max(insets.top, 12) },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            {showBack && (
              <TouchableOpacity 
                onPress={() => router.back()} 
                style={[styles.backBtn, variant === 'hero' ? styles.heroBackBtn : styles.plainBackBtn]}
              >
                <ArrowLeft size={20} color={variant === 'hero' ? '#fff' : MizanColors.textPrimary} />
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
          <View style={styles.headerActions}>
            {actions}
          </View>
        </View>
      </View>

      <ContentWrapper 
        style={styles.flex1}
        contentContainerStyle={scrollable ? styles.scrollContent : undefined}
        refreshControl={onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={variant === 'hero' ? '#fff' : MizanColors.mintPrimary} />
        ) : undefined}
      >
        {children}
      </ContentWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MizanColors.mintBg,
  },
  flex1: {
    flex: 1,
  },
  headerWrapper: {
    paddingBottom: 16,
  },
  heroHeader: {
    backgroundColor: '#17A697', // Mint Teal
  },
  plainHeader: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
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
  heroTitle: {
    color: '#fff',
  },
  plainTitle: {
    color: MizanColors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.8)',
  },
  plainSubtitle: {
    color: MizanColors.textMuted,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBackBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  plainBackBtn: {
    backgroundColor: '#F1F5F9',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
});
