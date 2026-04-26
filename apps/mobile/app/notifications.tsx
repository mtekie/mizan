import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';
import { MizanCard } from '../components/ui/MizanCard';
import { Bell, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

import { api } from '../lib/api';
import { AppScreenShell } from '../components/ui/AppScreenShell';
import { useStore } from '../lib/store';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { isGuest } = useStore();

  const loadNotifications = React.useCallback(async () => {
    setLoading(true);
    if (isGuest) {
      setNotifications([
        { id: '1', title: 'Salary Received', desc: 'You received 45,000 ETB from Google', time: '2m ago', unread: true },
        { id: '2', title: 'Bill Due', desc: 'Your EELPA bill is due tomorrow', time: '1h ago', unread: false },
      ]);
      setLoading(false);
      return;
    }
    try {
      const data = await api.notifications.list();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [isGuest]);

  React.useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  return (
    <AppScreenShell title="Notifications" showBack refreshing={loading} onRefresh={loadNotifications}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🔔</Text>
              <Text style={styles.emptyTitle}>All caught up!</Text>
              <Text style={styles.emptyText}>You don't have any notifications at the moment.</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <MizanCard style={[styles.card, item.unread && styles.unreadCard]}>
            <View style={[styles.iconContainer, { backgroundColor: item.unread ? MizanColors.mintBg : '#F1F5F9' }]}>
              <Bell color={item.unread ? MizanColors.mintPrimary : MizanColors.textMuted} size={20} />
            </View>
            <View style={styles.content}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc || item.subtitle}</Text>
              <Text style={styles.cardTime}>{item.time || 'Today'}</Text>
            </View>
            {item.unread && <View style={styles.unreadDot} />}
          </MizanCard>
        )}
      />
    </AppScreenShell>
  );
}

const styles = StyleSheet.create({
  list: { padding: 24, paddingBottom: 40 },
  card: { flexDirection: 'row', gap: 16, marginBottom: 12, padding: 16 },
  unreadCard: { borderColor: MizanColors.mintLight, borderWidth: 1 },
  iconContainer: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
  cardTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: MizanColors.textPrimary },
  cardDesc: { fontSize: 14, fontFamily: 'Inter_400Regular', color: MizanColors.textMuted, marginTop: 4 },
  cardTime: { fontSize: 12, fontFamily: 'Inter_400Regular', color: MizanColors.textMuted, marginTop: 8 },
  unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: MizanColors.mintPrimary, alignSelf: 'center' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: MizanColors.textPrimary, marginBottom: 8 },
  emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular', color: MizanColors.textMuted, textAlign: 'center', paddingHorizontal: 40 },
});
