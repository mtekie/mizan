import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MizanColors, MizanSpacing, MizanRadii } from '@mizan/ui-tokens';
import { AppScreenShell } from '../components/ui/AppScreenShell';
import { Camera, ShieldCheck, Upload, ChevronRight, X, CheckCircle2 } from 'lucide-react-native';
import { router } from 'expo-router';

export default function VerifyScreen() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const verificationItems = [
    { id: 'id', title: 'National ID / Passport', icon: ShieldCheck, status: 'Not Started' },
    { id: 'bank', title: 'Bank Book / Statement', icon: Upload, status: 'Not Started' },
    { id: 'property', title: 'Property Deed', icon: Upload, status: 'Not Started' },
    { id: 'student', title: 'Student ID', icon: ShieldCheck, status: 'Not Started' },
  ];

  const handleUpload = () => {
    setLoading(true);
    // Simulate upload
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <AppScreenShell title="Success">
        <View style={styles.successContainer}>
          <CheckCircle2 size={80} color={MizanColors.mintPrimary} />
          <Text style={styles.successTitle}>Verification Submitted!</Text>
          <Text style={styles.successSubtitle}>
            Our team will review your document within 24 hours. Your Mizan Score will update once verified.
          </Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back to Score</Text>
          </TouchableOpacity>
        </View>
      </AppScreenShell>
    );
  }

  return (
    <AppScreenShell title="Boost Trust">
      <ScrollView style={styles.container}>
        <Text style={styles.description}>
          Verified profiles unlock 3x more financial products and higher trust scores. Upload evidence to upgrade your trust level.
        </Text>

        <View style={styles.itemList}>
          {verificationItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.item}
              onPress={() => setStep(2)}
            >
              <View style={styles.itemIcon}>
                <item.icon size={24} color={MizanColors.mintPrimary} />
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemStatus}>{item.status}</Text>
              </View>
              <ChevronRight size={20} color="#CBD5E1" />
            </TouchableOpacity>
          ))}
        </View>

        {step === 2 && (
          <View style={styles.uploadBox}>
            <Text style={styles.uploadTitle}>Snap a Photo</Text>
            <Text style={styles.uploadSubtitle}>Ensure all details are clearly visible in the frame.</Text>
            
            <View style={styles.cameraPlaceholder}>
              <Camera size={48} color="#94A3B8" />
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, loading && { opacity: 0.7 }]}
              onPress={handleUpload}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Uploading...' : 'Submit for Review'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setStep(1)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </AppScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 14,
    color: MizanColors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  itemList: {
    gap: 12,
    marginBottom: 32,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: MizanColors.mintBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemStatus: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  uploadBox: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  uploadSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  cameraPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: MizanColors.mintPrimary,
    width: '100%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 24,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 40,
  },
  backButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
