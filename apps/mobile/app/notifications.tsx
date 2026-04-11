import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { MizanColors, MizanTypography } from '@mizan/ui-tokens';
import { MizanCard } from '../components/ui/MizanCard';
import { Bell, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function NotificationsScreen() {
  const notifications = [
    { id: '1', title: 'Salary Received', desc: 'You received 45,000 ETB from Google', time: '2m ago', unread: true },
    { id: '2', title: 'Bill Due', desc: 'Your EELPA bill is due tomorrow', time: '1h ago', unread: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={MizanColors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MizanCard style={[styles.card, item.unread && styles.unreadCard]}>
            <View style={styles.iconContainer}>
              <Bell color={item.unread ? MizanColors.mintPrimary : MizanColors.textMuted} size={20} />
            </View>
            <View style={styles.content}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
              <Text style={styles.cardTime}>{item.time}</Text>
            </View>
            {item.unread && <View style={styles.unreadDot} />}
          </MizanCard>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MizanColors.mintBg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  placeholder: { width: 40 },
  title: { fontSize: 20, fontFamily: 'Inter_700Bold', color: MizanColors.textPrimary },
  list: { padding: 20 },
  card: { flexDirection: 'row', gap: 16, marginBottom: 12, padding: 16 },
  unreadCard: { backgroundColor: '#FFFFFF', borderColor: MizanColors.mintLight, borderWidth: 1 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1 },
  cardTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: MizanColors.textPrimary },
  cardDesc: { fontSize: 14, fontFamily: 'Inter_400Regular', color: MizanColors.textMuted, marginTop: 4 },
  cardTime: { fontSize: 12, fontFamily: 'Inter_400Regular', color: MizanColors.textMuted, marginTop: 8 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: MizanColors.mintPrimary, alignSelf: 'center' },
});
