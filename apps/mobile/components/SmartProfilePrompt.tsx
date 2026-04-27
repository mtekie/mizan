import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, Animated } from 'react-native';
import { MizanColors, MizanRadii, MizanTypography } from '@mizan/ui-tokens';
import { useStore } from '../lib/store';
import { Sparkles, X, ArrowRight, Trophy } from 'lucide-react-native';

type ProfilePromptField = 'employmentStatus' | 'monthlyIncomeRange' | 'financialPriority' | 'riskAppetite' | 'housingStatus';

const QUESTIONS: {
  id: string;
  field: ProfilePromptField;
  label: string;
  labelAmh?: string;
  whyText: string;
  points: number;
  options: string[];
}[] = [
  { 
    id: '1', 
    field: 'employmentStatus', 
    label: 'What is your current employment status?', 
    labelAmh: 'የስራ ሁኔታዎ ምንድነው?',
    whyText: 'Helps institutions understand your income source stability.',
    points: 10,
    options: ['Employed', 'Self-Employed', 'Unemployed', 'Student']
  },
  { 
    id: '2', 
    field: 'monthlyIncomeRange', 
    label: 'What is your monthly income?', 
    labelAmh: 'የወር ገቢዎ ስንት ነው?',
    whyText: 'Used to calculate your debt-to-income ratio for better recommendations.',
    points: 15,
    options: ['Under 10k', '10k-50k', '50k-100k', 'Over 100k']
  },
  {
    id: '3',
    field: 'financialPriority',
    label: 'What is your top financial priority?',
    labelAmh: 'ዋናው የፋይናንስ ቅድሚያዎ ምንድነው?',
    whyText: 'We prioritize products that match your specific goals.',
    points: 20,
    options: ['Saving', 'Investing', 'Debt Reduction', 'Purchasing Home']
  },
  {
    id: '4',
    field: 'riskAppetite',
    label: 'How do you feel about investment risk?',
    labelAmh: 'ስለ ኢንቨስትመንት ስጋት ምን ይሰማዎታል?',
    whyText: 'Ensures we don\'t suggest high-risk products if you prefer safety.',
    points: 20,
    options: ['Conservative', 'Moderate', 'Aggressive']
  },
  {
    id: '5',
    field: 'housingStatus',
    label: 'What is your current housing status?',
    labelAmh: 'የቤት ሁኔታዎ ምንድነው?',
    whyText: 'Rent vs. Mortgage affects your monthly available cash flow.',
    points: 10,
    options: ['Renting', 'Own Home', 'Living with Family']
  }
];

import { api } from '../lib/api';

export function SmartProfilePrompt() {
  const { profile, setProfile, isGuest } = useStore();
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [value, setValue] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  useEffect(() => {
    const nextQ = QUESTIONS.find(q => !profile[q.field]);
    if (nextQ) {
      setCurrentQuestion(nextQ);
      setTimeout(() => setIsVisible(true), 5000);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!currentQuestion || !value) return;
    
    const updateData = { [currentQuestion.field]: value };
    setProfile(updateData);
    
    if (!isGuest) {
      try {
        await api.profile.update(updateData);
      } catch (e) {
        console.error('Failed to sync profile nudge:', e);
      }
    }

    setIsCompleted(true);
    setShowWhy(false);
    setTimeout(() => {
      setIsVisible(false);
      setIsCompleted(false);
      setValue('');
    }, 2000);
  };

  if (!currentQuestion || !isVisible) return null;

  return (
    <Modal transparent visible={isVisible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {isCompleted ? (
            <View style={styles.successContent}>
              <Trophy size={40} color={MizanColors.mintPrimary} />
              <Text style={styles.successTitle}>Profile Boosted!</Text>
              <Text style={styles.successSubtitle}>+{currentQuestion.points} points added.</Text>
            </View>
          ) : (
            <View style={styles.content}>
              <View style={styles.header}>
                <View style={styles.badge}>
                  <Sparkles size={14} color={MizanColors.mintPrimary} />
                  <Text style={styles.badgeText}>SMART NUDGE</Text>
                </View>
                <TouchableOpacity onPress={() => setIsVisible(false)}>
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.questionLabel}>{currentQuestion.label}</Text>
              {currentQuestion.labelAmh && (
                <Text style={styles.questionLabelAmh}>{currentQuestion.labelAmh}</Text>
              )}

              <TouchableOpacity onPress={() => setShowWhy(!showWhy)} style={styles.whyButton}>
                <Text style={styles.whyButtonText}>{showWhy ? 'Hide' : 'Why we ask?'}</Text>
              </TouchableOpacity>

              {showWhy && (
                <View style={styles.whyBox}>
                  <Text style={styles.whyText}>{currentQuestion.whyText}</Text>
                </View>
              )}

              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((opt: string) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.optionButton,
                      value === opt && styles.optionButtonActive
                    ]}
                    onPress={() => setValue(opt)}
                  >
                    <Text style={[
                      styles.optionText,
                      value === opt && styles.optionTextActive
                    ]}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.saveButton, !value && { opacity: 0.5 }]}
                onPress={handleSave}
                disabled={!value}
              >
                <Text style={styles.saveButtonText}>Boost Profile</Text>
                <ArrowRight size={18} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Text style={styles.skipText}>SKIP FOR NOW</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  content: {
    paddingBottom: 20,
  },
  successContent: {
    alignItems: 'center',
    padding: 40,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginTop: 16,
    color: '#0F172A',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: MizanColors.mintBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: MizanColors.mintPrimary,
    letterSpacing: 1,
  },
  questionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  questionLabelAmh: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
    marginBottom: 12,
  },
  whyButton: {
    marginBottom: 12,
  },
  whyButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: MizanColors.mintPrimary,
    textDecorationLine: 'underline',
  },
  whyBox: {
    backgroundColor: MizanColors.mintBg,
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: MizanColors.mintPrimary,
  },
  whyText: {
    fontSize: 13,
    color: MizanColors.mintDark,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  optionButtonActive: {
    backgroundColor: MizanColors.mintPrimary + '10',
    borderColor: MizanColors.mintPrimary,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  optionTextActive: {
    color: MizanColors.mintPrimary,
  },
  saveButton: {
    backgroundColor: MizanColors.mintPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  skipText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 1,
  },
});
