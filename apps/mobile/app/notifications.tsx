import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';
import { MizanCard } from '../components/ui/MizanCard';
import { Bell, AlertTriangle, Wallet, TrendingUp, Trophy } from 'lucide-react-native';
import { router } from 'expo-router';

import { api } from '../lib/api';
import { AppScreenShell } from '../components/ui/AppScreenShell';
import { useStore } from '../lib/store';
import type { NotificationFilterKey, NotificationsScreenDataContract, NotificationVM } from '@mizan/shared';

const iconMap: Record<string, any> = {
  'alert-triangle': AlertTriangle,
  AlertTriangle,
  bell: Bell,
  Bell,
  Wallet,
  wallet: Wallet,
  Trophy,
  trophy: Trophy,
  TrendingUp,
  'trending-up': TrendingUp,
};

function getToneClasses(item: NotificationVM) {
  if (item.isActionable) {
    return {
      borderColor: '#f97316', // orange-500
      iconBg: '#fff7ed', // orange-50
      iconColor: '#ea580c', // orange-600
    };
  }

  return {
    borderColor: '#3b82f6', // blue-500
    iconBg: '#eff6ff', // blue-50
    iconColor: '#2563eb', // blue-600
  };
}

export default function NotificationsScreen() {
  const [contract, setContract] = React.useState<NotificationsScreenDataContract | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [tab, setTab] = React.useState<NotificationFilterKey>('All');
  const { isGuest } = useStore();

  const loadContract = React.useCallback(async () => {
    setLoading(true);
    if (isGuest) {
      // Mock contract for guests
      setContract({
        notifications: [],
        groups: [],
        filters: [
          { key: 'All', label: 'All', count: 0 },
          { key: 'Actionable', label: 'Actionable', count: 0 },
          { key: 'Info', label: 'Info', count: 0 },
        ],
        unreadCount: 0,
        actionableCount: 0,
        states: {
          loading: { title: 'Loading notifications', description: 'Refreshing reminders, alerts, and updates.' },
          error: { title: 'Notifications could not load', description: 'Check your connection and try again.', actionLabel: 'Try again' },
          empty: { title: 'All caught up', description: "You don't have any notifications at the moment." },
        }
      });
      setLoading(false);
      return;
    }
    
    try {
      const data = await api.notifications.screen();
      setContract(data.notificationsScreen);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [isGuest]);

  React.useEffect(() => {
    loadContract();
  }, [loadContract]);

  const groups = React.useMemo(() => {
    if (!contract) return [];
    return contract.groups
      .map(group => ({
        ...group,
        items: group.items.filter(item => tab === 'All' || item.type === tab),
      }))
      .filter(group => group.items.length > 0);
  }, [contract, tab]);

  const isEmpty = groups.length === 0 && !loading;

  return (
    <AppScreenShell title="Notifications" showBack refreshing={loading} onRefresh={loadContract}>
      {contract && (
        <View style={styles.filterContainer}>
          {contract.filters.map(filter => {
            const isActive = tab === filter.key;
            return (
              <TouchableOpacity
                key={filter.key}
                onPress={() => setTab(filter.key)}
                style={[styles.filterButton, isActive && styles.filterButtonActive]}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filter.label} {filter.count > 0 ? `(${filter.count})` : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {isEmpty && contract ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>{contract.states.empty.title}</Text>
          <Text style={styles.emptyText}>{contract.states.empty.description}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {groups.map(group => (
            <View key={group.date} style={styles.groupContainer}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupDate}>{group.date}</Text>
                <View style={styles.groupLine} />
              </View>
              {group.items.map(item => {
                const tone = getToneClasses(item);
                const Icon = iconMap[item.icon] ?? Bell;

                return (
                  <View key={item.id} style={[styles.cardWrapper, item.isRead && styles.cardRead]}>
                    <View style={[styles.cardAccentLine, { backgroundColor: tone.borderColor }]} />
                    <MizanCard style={styles.card}>
                      <View style={styles.cardContent}>
                        <View style={[styles.iconContainer, { backgroundColor: tone.iconBg }]}>
                          <Icon color={tone.iconColor} size={24} />
                        </View>
                        <View style={styles.content}>
                          <View style={styles.titleRow}>
                            <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                            <Text style={styles.cardTime}>{item.time}</Text>
                          </View>
                          {item.titleAmh && <Text style={styles.cardAmh}>{item.titleAmh}</Text>}
                          <Text style={styles.cardDesc}>{item.subtitle}</Text>
                        </View>
                      </View>
                      
                      {item.isActionable && (
                        <View style={styles.actionRow}>
                          <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionButtonText}>Dismiss</Text>
                          </TouchableOpacity>
                          <View style={styles.actionDivider} />
                          <TouchableOpacity style={styles.actionButton}>
                            <Text style={[styles.actionButtonText, styles.actionButtonPrimary]}>Review</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </MizanCard>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </AppScreenShell>
  );
}

const styles = StyleSheet.create({
  filterContainer: { flexDirection: 'row', gap: 4, paddingHorizontal: 24, paddingVertical: 16, paddingBottom: 8 },
  filterButton: { flex: 1, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: MizanColors.borderLight, alignItems: 'center' },
  filterButtonActive: { backgroundColor: 'rgba(110, 208, 99, 0.1)', borderColor: 'rgba(110, 208, 99, 0.2)' },
  filterText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: MizanColors.textMuted },
  filterTextActive: { color: MizanColors.mintPrimary, fontFamily: 'Inter_600SemiBold' },
  
  list: { padding: 24, paddingBottom: 40 },
  groupContainer: { marginBottom: 24 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  groupDate: { fontFamily: 'Inter_700Bold', fontSize: 12, textTransform: 'uppercase', color: MizanColors.textMuted, letterSpacing: 0.5 },
  groupLine: { flex: 1, height: 1, backgroundColor: MizanColors.borderLight },
  
  cardWrapper: { position: 'relative', marginBottom: 12, borderRadius: 16, overflow: 'hidden' },
  cardRead: { opacity: 0.75 },
  cardAccentLine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, zIndex: 2 },
  card: { padding: 0, overflow: 'hidden' },
  cardContent: { flexDirection: 'row', gap: 16, padding: 16 },
  iconContainer: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: MizanColors.textPrimary, flex: 1, marginRight: 8 },
  cardTime: { fontSize: 12, fontFamily: 'Inter_400Regular', color: MizanColors.textMuted },
  cardAmh: { fontSize: 14, fontFamily: 'Inter_500Medium', color: MizanColors.textSecondary, marginTop: 2 },
  cardDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', color: MizanColors.textMuted, marginTop: 4 },
  
  actionRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: MizanColors.borderLight },
  actionButton: { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  actionDivider: { width: 1, backgroundColor: MizanColors.borderLight },
  actionButtonText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: MizanColors.textSecondary },
  actionButtonPrimary: { color: MizanColors.mintPrimary, fontFamily: 'Inter_700Bold' },
  
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: MizanColors.textSecondary, marginBottom: 8 },
  emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: MizanColors.textMuted, textAlign: 'center' },
});
