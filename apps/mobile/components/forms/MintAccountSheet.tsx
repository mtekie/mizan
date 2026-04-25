import React, { useRef, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { MizanColors, MizanSpacing, MizanTypography, MizanRadii } from '@mizan/ui-tokens';
import { Building2, Landmark, Wallet, Plus } from 'lucide-react-native';

interface MintAccountSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  onClose: () => void;
  onSave: (data: any) => void;
}

const ACCOUNT_TYPES = [
  { id: 'CASH', label: 'Cash Wallet', icon: Wallet },
  { id: 'BANK', label: 'Bank Account', icon: Landmark },
  { id: 'ASSET', label: 'Property / Asset', icon: Building2 },
];

export function MintAccountSheet({ sheetRef, onClose, onSave }: MintAccountSheetProps) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [type, setType] = useState('BANK');
  
  const snapPoints = useMemo(() => ['70%'], []);

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
      name: name || 'New Account',
      balance: parseFloat(balance) || 0,
      type,
    });
    setName('');
    setBalance('');
    setType('BANK');
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
        <Text style={styles.headerTitle}>Add Account</Text>
        <Text style={styles.headerSubtitle}>Track a new bank, wallet, or asset.</Text>

        <View style={styles.typeSelector}>
          {ACCOUNT_TYPES.map((acc) => {
            const Icon = acc.icon;
            const isActive = type === acc.id;
            return (
              <TouchableOpacity
                key={acc.id}
                style={[styles.typeBtn, isActive && styles.typeBtnActive]}
                onPress={() => setType(acc.id)}
              >
                <Icon size={24} color={isActive ? MizanColors.mintPrimary : MizanColors.textMuted} />
                <Text style={[styles.typeLabel, isActive && styles.typeLabelActive]}>{acc.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Account Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g., CBE Checking, Car Value"
            placeholderTextColor={MizanColors.textMuted}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Current Balance (ETB)</Text>
          <View style={styles.amountInputWrapper}>
            <Text style={styles.currency}>ETB</Text>
            <TextInput
              style={styles.amountInput}
              value={balance}
              onChangeText={setBalance}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={MizanColors.textMuted}
            />
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Plus size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.saveButtonText}>Add Account</Text>
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
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: MizanSpacing.xl,
  },
  typeBtn: {
    flex: 1,
    alignItems: 'center',
    padding: MizanSpacing.md,
    backgroundColor: MizanColors.mintBg,
    borderRadius: MizanRadii.md,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeBtnActive: {
    backgroundColor: '#E6F8F3', // lighter mint
    borderColor: MizanColors.mintPrimary,
  },
  typeLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: MizanColors.textMuted,
    marginTop: 8,
    textAlign: 'center',
  },
  typeLabelActive: {
    color: MizanColors.mintDark,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: MizanColors.textPrimary,
    marginBottom: 8,
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
    flexDirection: 'row',
    justifyContent: 'center',
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
