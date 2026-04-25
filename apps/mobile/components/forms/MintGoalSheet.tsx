import React, { useRef, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { MizanColors, MizanSpacing, MizanTypography, MizanRadii } from '@mizan/ui-tokens';

interface MintGoalSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  onClose: () => void;
  onSave: (data: any) => void;
}

const EMOJI_OPTIONS = ['🏠', '🚗', '✈️', '🎓', '💍', '💻', '👶', '🎉', '💰', '🆘'];

export function MintGoalSheet({ sheetRef, onClose, onSave }: MintGoalSheetProps) {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💰');
  
  const snapPoints = useMemo(() => ['75%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) Keyboard.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    []
  );

  const handleSave = () => {
    onSave({
      name: title || 'New Goal',
      target: parseFloat(target) || 0,
      emoji: selectedEmoji,
      saved: 0,
    });
    setTitle('');
    setTarget('');
    setSelectedEmoji('💰');
    onClose();
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.headerTitle}>Create a Goal</Text>
        <Text style={styles.headerSubtitle}>What are you saving for?</Text>

        <View style={styles.emojiPicker}>
          <Text style={styles.label}>Choose an icon</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiScroll}>
            {EMOJI_OPTIONS.map((emoji) => (
              <TouchableOpacity 
                key={emoji} 
                style={[styles.emojiBtn, selectedEmoji === emoji && styles.emojiBtnActive]}
                onPress={() => setSelectedEmoji(emoji)}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Goal Name</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Emergency Fund"
            placeholderTextColor={MizanColors.textMuted}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Target Amount (ETB)</Text>
          <View style={styles.amountInputWrapper}>
            <Text style={styles.currency}>ETB</Text>
            <TextInput
              style={styles.amountInput}
              value={target}
              onChangeText={setTarget}
              keyboardType="decimal-pad"
              placeholder="10,000"
              placeholderTextColor={MizanColors.textMuted}
            />
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Start Saving</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: MizanColors.mintSurface,
    borderRadius: MizanRadii.xl,
  },
  indicator: {
    backgroundColor: MizanColors.borderLight,
    width: 40,
  },
  contentContainer: {
    flex: 1,
    padding: MizanSpacing.lg,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: MizanColors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: MizanColors.textSecondary,
    marginBottom: MizanSpacing.xl,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: MizanColors.textPrimary,
    marginBottom: 8,
  },
  emojiPicker: {
    marginBottom: MizanSpacing.lg,
  },
  emojiScroll: {
    flexDirection: 'row',
  },
  emojiBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: MizanColors.mintBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emojiBtnActive: {
    backgroundColor: MizanColors.mintPrimary,
    borderWidth: 2,
    borderColor: MizanColors.mintDark,
  },
  emojiText: {
    fontSize: 24,
  },
  inputGroup: {
    marginBottom: MizanSpacing.lg,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: MizanColors.borderLight,
    borderRadius: MizanRadii.md,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textPrimary,
  },
  amountInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: MizanColors.borderLight,
    borderRadius: MizanRadii.md,
    paddingHorizontal: 16,
  },
  currency: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: MizanColors.textSecondary,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textPrimary,
  },
  saveButton: {
    backgroundColor: MizanColors.mintPrimary,
    borderRadius: MizanRadii.md,
    padding: MizanSpacing.md,
    alignItems: 'center',
    marginBottom: MizanSpacing.md,
  },
  saveButtonText: {
    fontFamily: 'Inter_700Bold',
    color: '#FFF',
    fontSize: 16,
  },
});
