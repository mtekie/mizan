import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { MizanColors, MizanSpacing, MizanRadii } from '@mizan/ui-tokens';
import { Plus } from 'lucide-react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { MintGoalSheet } from '../../components/forms/MintGoalSheet';
import { MizanCard } from '../../components/ui/MizanCard';
import { api } from '../../lib/api';
import { useStore } from '../../lib/store';

export default function GoalsScreen() {
  const [goals, setGoals] = useState<any[]>([]);
  const sheetRef = useRef<BottomSheet>(null);
  const { isGuest } = useStore();
  
  const MOCK_GOALS = [
    { id: '1', name: 'New Car', target: 850000, saved: 150000, emoji: '🚗' },
    { id: '2', name: 'Vacation', target: 50000, saved: 45000, emoji: '🏖️' },
  ];

  useEffect(() => {
    loadGoals();
  }, [isGuest]);

  const loadGoals = async () => {
    if (isGuest) {
      setGoals(MOCK_GOALS);
      return;
    }
    try {
      const data = await api.goals.list();
      setGoals(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveGoal = async (data: any) => {
    if (isGuest) {
      console.log("Guest mode: simulating goal save", data);
      const newGoal = { ...data, id: Math.random().toString(), saved: 0 };
      setGoals([...goals, newGoal]);
      return;
    }
    try {
      await api.goals.create(data);
      loadGoals();
    } catch (e) {
      console.error("Failed to save goal", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Goals</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => sheetRef.current?.expand()}>
          <Plus color={MizanColors.mintPrimary} size={24} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={goals}
        keyExtractor={item => item.id || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Goals Yet</Text>
            <Text style={styles.emptySubtitle}>Tap the plus icon to start saving.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <MizanCard style={styles.goalCard}>
            <Text style={styles.goalEmoji}>{item.emoji}</Text>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.goalName}>{item.name}</Text>
              <Text style={styles.goalProgress}>
                {item.saved.toLocaleString()} ETB / {item.target.toLocaleString()} ETB
              </Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min((item.saved / item.target) * 100, 100)}%` }]} />
              </View>
            </View>
          </MizanCard>
        )}
      />

      <MintGoalSheet sheetRef={sheetRef} onClose={() => sheetRef.current?.close()} onSave={handleSaveGoal} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MizanColors.mintBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: MizanSpacing.lg,
    paddingTop: MizanSpacing.lg,
    paddingBottom: MizanSpacing.md,
  },
  title: {
    fontFamily: 'Inter_900Black',
    fontSize: 32,
    color: MizanColors.textPrimary,
  },
  iconButton: {
    padding: 8,
    backgroundColor: MizanColors.mintSurface,
    borderRadius: MizanRadii.full,
    borderWidth: 1,
    borderColor: MizanColors.borderLight,
  },
  listContent: {
    paddingHorizontal: MizanSpacing.lg,
    paddingBottom: 100,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: MizanSpacing.md,
  },
  goalEmoji: {
    fontSize: 32,
  },
  goalName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: MizanColors.textPrimary,
    marginBottom: 4,
  },
  goalProgress: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: MizanColors.textSecondary,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: MizanColors.mintBg,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: MizanColors.mintPrimary,
  },
  emptyState: {
    padding: MizanSpacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: MizanColors.textPrimary,
    marginTop: MizanSpacing.xl,
  },
  emptySubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: MizanColors.textSecondary,
    marginTop: MizanSpacing.xs,
  },
});
