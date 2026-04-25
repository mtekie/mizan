import React, { useRef, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { MizanColors, MizanSpacing, MizanTypography, MizanRadii } from '@mizan/ui-tokens';
import { ChevronDown, Calendar, Tag, Wallet, Check, Coffee, ShoppingBag, Car, Home, Smartphone, Plus } from 'lucide-react-native';

interface MintTransactionSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  onClose: () => void;
  onSave: (data: any) => void;
}

const CATEGORIES = [
  { id: 'Food', label: 'Food & Dining', icon: Coffee, color: '#FF9F43' },
  { id: 'Shopping', label: 'Shopping', icon: ShoppingBag, color: '#54A0FF' },
  { id: 'Transport', label: 'Transport', icon: Car, color: '#10AC84' },
  { id: 'Housing', label: 'Housing', icon: Home, color: '#5F27CD' },
  { id: 'Bills', label: 'Bills', icon: Smartphone, color: '#EE5253' },
];

const ACCOUNTS = [
  { id: 'CASH', label: 'Cash', balance: 1200 },
  { id: 'CBE', label: 'CBE Checking', balance: 45000 },
  { id: 'TELEBIRR', label: 'telebirr', balance: 5400 },
];

export function MintTransactionSheet({ sheetRef, onClose, onSave }: MintTransactionSheetProps) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [accountId, setAccountId] = useState(ACCOUNTS[0].id);
  const [notes, setNotes] = useState('');
  
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === 0) setIsExpanded(false);
    if (index === 1) setIsExpanded(true);
    if (index === -1) {
      Keyboard.dismiss();
      setIsExpanded(false);
    }
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    []
  );

  const handleSave = () => {
    onSave({
      amount: parseFloat(amount) || 0,
      type,
      title: title || (type === 'EXPENSE' ? 'Expense' : 'Income'),
      category,
      accountId,
      notes,
      date: new Date().toISOString(),
    });
    // Reset
    setAmount('');
    setTitle('');
    setNotes('');
    setIsExpanded(false);
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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Header: Expense / Income Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleBtn, type === 'EXPENSE' && styles.toggleBtnActive]}
              onPress={() => setType('EXPENSE')}
            >
              <Text style={[styles.toggleText, type === 'EXPENSE' && styles.toggleTextActive]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, type === 'INCOME' && styles.toggleBtnActiveIncome]}
              onPress={() => setType('INCOME')}
            >
              <Text style={[styles.toggleText, type === 'INCOME' && styles.toggleTextActiveIncome]}>Income</Text>
            </TouchableOpacity>
          </View>

          {/* Large Amount Input */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>ETB</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={MizanColors.textMuted}
            />
          </View>

          {/* Title Input */}
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder={type === 'EXPENSE' ? "What was this for?" : "Source of income?"}
            placeholderTextColor={MizanColors.textMuted}
          />

          {/* Account Selector (Horizontal) */}
          <Text style={styles.sectionLabel}>{type === 'EXPENSE' ? 'Paid From' : 'Received Into'}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {ACCOUNTS.map(acc => (
              <TouchableOpacity 
                key={acc.id} 
                style={[styles.accountChip, accountId === acc.id && styles.accountChipActive]}
                onPress={() => setAccountId(acc.id)}
              >
                <Text style={[styles.accountChipText, accountId === acc.id && styles.accountChipTextActive]}>{acc.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Category Grid (Simplified) */}
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = category === cat.id;
              return (
                <TouchableOpacity 
                  key={cat.id} 
                  style={[styles.categoryItem, isActive && { borderColor: cat.color, backgroundColor: cat.color + '10' }]}
                  onPress={() => setCategory(cat.id)}
                >
                  <View style={[styles.iconCircle, { backgroundColor: cat.color + '20' }]}>
                    <Icon size={20} color={cat.color} />
                  </View>
                  <Text style={[styles.categoryLabel, isActive && { color: cat.color, fontFamily: 'Inter_700Bold' }]}>{cat.label}</Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Notes Field */}
          <Text style={styles.sectionLabel}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add a memo..."
            placeholderTextColor={MizanColors.textMuted}
            multiline
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Transaction</Text>
          </TouchableOpacity>
        </ScrollView>
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
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: MizanColors.mintBg,
    borderRadius: MizanRadii.full,
    padding: 4,
    marginBottom: MizanSpacing.xl,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: MizanSpacing.sm,
    alignItems: 'center',
    borderRadius: MizanRadii.full,
  },
  toggleBtnActive: {
    backgroundColor: MizanColors.mintSurface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleBtnActiveIncome: {
    backgroundColor: MizanColors.mintSurface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: MizanColors.textMuted,
  },
  toggleTextActive: {
    color: MizanColors.textPrimary,
  },
  toggleTextActiveIncome: {
    color: MizanColors.mintPrimary,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: MizanSpacing.md,
  },
  currencySymbol: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    color: MizanColors.textSecondary,
    marginRight: 8,
    marginTop: 8,
  },
  amountInput: {
    fontFamily: 'Inter_900Black',
    fontSize: 48,
    color: MizanColors.textPrimary,
    minWidth: 100,
  },
  titleInput: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: MizanColors.textPrimary,
    textAlign: 'center',
    marginBottom: MizanSpacing.xl,
    padding: 8,
  },
  sectionLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: MizanColors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: MizanSpacing.sm,
    marginTop: MizanSpacing.md,
  },
  horizontalScroll: {
    marginBottom: MizanSpacing.lg,
  },
  accountChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: MizanRadii.full,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  accountChipActive: {
    backgroundColor: MizanColors.mintBg,
    borderColor: MizanColors.mintPrimary,
  },
  accountChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: MizanColors.textSecondary,
  },
  accountChipTextActive: {
    color: MizanColors.mintDark,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: MizanSpacing.lg,
  },
  categoryItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: MizanRadii.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  categoryLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: MizanColors.textPrimary,
  },
  notesInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: MizanRadii.md,
    padding: 16,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: MizanColors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: MizanSpacing.xl,
  },
  saveButton: {
    backgroundColor: MizanColors.mintPrimary,
    borderRadius: MizanRadii.md,
    padding: MizanSpacing.md,
    alignItems: 'center',
    marginTop: MizanSpacing.md,
  },
  saveButtonText: {
    fontFamily: 'Inter_700Bold',
    color: '#FFF',
    fontSize: 16,
  },
});
