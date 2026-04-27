import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MizanColors, MizanSpacing, MizanTypography } from '@mizan/ui-tokens';
import { Lightbulb, CheckCircle2, TrendingUp, CheckCircle, RefreshCw, User as UserIcon, Target, CreditCard, ShieldCheck } from 'lucide-react-native';
import { AppScreenShell } from '../components/ui/AppScreenShell';
import { MizanCard } from '../components/ui/MizanCard';
import { MizanTrustCard } from '../components/MizanTrustCard';
import { api } from '../lib/api';
import { useStore } from '../lib/store';
import { Analytics } from '../lib/monitoring';
import Svg, { Circle } from 'react-native-svg';
import { Eye, EyeOff, Share2, Globe, Lock } from 'lucide-react-native';

const getFactorIcon = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes('profile')) return UserIcon;
  if (lower.includes('savings')) return Target;
  if (lower.includes('budget')) return CreditCard;
  if (lower.includes('bill')) return CheckCircle;
  if (lower.includes('verification')) return ShieldCheck;
  return TrendingUp;
};

export default function ScoreScreen() {
  const router = useRouter();
  const { isGuest } = useStore();
  const [score, setScore] = useState(isGuest ? 75 : 0);
  const [factors, setFactors] = useState<any[]>([]);
  const [loading, setLoading] = useState(!isGuest);
  const [tip, setTip] = useState('Generating your financial recommendation...');
  const [tipLoading, setTipLoading] = useState(true);
  const [showCard, setShowCard] = useState(false);
  const [privacy, setPrivacy] = useState<'PRIVATE' | 'LINK_ONLY' | 'PUBLIC'>('PRIVATE');

  const loadScore = async () => {
    if (isGuest) {
      setFactors([
        { label: 'Profile Completeness', score: 85, impact: 'positive', message: 'Your profile is almost complete.' },
        { label: 'Savings Consistency', score: 60, impact: 'neutral', message: 'Regular contributions help your score.' },
        { label: 'Bill Payment', score: 95, impact: 'positive', message: 'Excellent on-time payments.' },
      ]);
      return;
    }
    setLoading(true);
    try {
      const data = await api.score.get();
      setScore(data.score);
      setFactors(data.factors);
      Analytics.track('score_viewed', { score: data.score });
    } catch (e) {
      console.error('Failed to load score:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScore();
    // Simulate AI tip
    setTimeout(() => {
      setTip('Your Equb consistency is excellent! Consider diversifying into a higher-interest savings account to optimize your idle cash.');
      setTipLoading(false);
    }, 1500);
  }, []);

  const radius = 80;
  const strokeWidth = 15;
  const circumference = 2 * Math.PI * radius;
  const progress = score / 100; // 0-100 scale
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <AppScreenShell
      title="Mizan Score"
      onRefresh={loadScore}
      refreshing={loading}
      actions={
        <TouchableOpacity onPress={loadScore} disabled={loading}>
          <RefreshCw size={24} color={MizanColors.mintPrimary} />
        </TouchableOpacity>
      }
    >
      {/* Trust Card Toggle */}
      <View style={styles.cardToggleHeader}>
        <Text style={styles.cardToggleLabel}>Your Trust Card</Text>
        <View style={styles.cardActionRow}>
          <TouchableOpacity 
            style={styles.privacyBadge}
            onPress={() => setPrivacy(privacy === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC')}
          >
            {privacy === 'PUBLIC' ? <Globe size={12} color={MizanColors.mintPrimary} /> : <Lock size={12} color="#64748B" />}
            <Text style={[styles.privacyText, privacy === 'PUBLIC' && { color: MizanColors.mintPrimary }]}>{privacy}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowCard(!showCard)}>
            {showCard ? <EyeOff size={24} color={MizanColors.mintPrimary} /> : <Eye size={24} color="#64748B" />}
          </TouchableOpacity>
        </View>
      </View>

      {showCard && (
        <View style={styles.trustCardWrapper}>
           <MizanTrustCard 
            score={score} 
            userName="Michael Tekie" 
            verifiedFacts={['National ID Verified', 'CBE Account Linked']} 
           />
           <View style={styles.shareActionRow}>
             <TouchableOpacity style={styles.shareIconBtn}>
               <Share2 size={18} color="#fff" />
               <Text style={styles.shareIconText}>Share</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.revokeBtn}>
               <X size={14} color="#EF4444" />
               <Text style={styles.revokeText}>Revoke Link</Text>
             </TouchableOpacity>
           </View>
        </View>
      )}

      {/* Score History */}
      <View style={styles.historySection}>
        <View style={styles.historyHeader}>
          <TrendingUp size={20} color={MizanColors.mintPrimary} />
          <Text style={styles.historyTitle}>Score History</Text>
        </View>
        <View style={styles.historyChart}>
           {/* Simple static sparkline prototype */}
           <View style={styles.chartLine} />
           <View style={styles.chartPoints}>
              {[62, 65, 64, 68, 72, 75].map((p, i) => (
                <View key={i} style={[styles.chartPoint, { bottom: (p-60)*4 }]} />
              ))}
           </View>
        </View>
        <View style={styles.historyLabels}>
          <Text style={styles.historyLabel}>Jul</Text>
          <Text style={styles.historyLabel}>Aug</Text>
          <Text style={styles.historyLabel}>Sep</Text>
        </View>
      </View>

      {/* Score Meter */}
      <View style={styles.meterContainer}>
        <View style={styles.svgWrapper}>
          <Svg width={200} height={200} viewBox="0 0 200 200">
            {/* Background Circle */}
            <Circle
              cx="100"
              cy="100"
              r={radius}
              stroke={MizanColors.mintBg}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Circle */}
            <Circle
              cx="100"
              cy="100"
              r={radius}
              stroke={MizanColors.mintPrimary}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              transform="rotate(-90 100 100)"
            />
          </Svg>
          <View style={styles.scoreTextContainer}>
            <Text style={styles.scoreValue}>{score}</Text>
            <Text style={styles.scoreLabel}>{score > 80 ? 'Excellent' : score > 60 ? 'Good' : 'Fair'}</Text>
          </View>
        </View>
        <Text style={styles.scoreDescription}>
          Your Mizan Score is a reflection of your financial trust and readiness in the Ethiopian ecosystem.
        </Text>
      </View>

      {/* AI Tip */}
      <MizanCard variant="primary" style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <View style={styles.tipIconBox}>
            <Lightbulb size={20} color="#FFF" />
          </View>
          <Text style={styles.tipTitle}>Mizan AI Tip</Text>
        </View>
        <Text style={styles.tipText}>
          {tipLoading ? 'Analyzing your patterns...' : tip}
        </Text>
      </MizanCard>

      {/* Impact Factors */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Impact Factors</Text>
      </View>

      <View style={styles.factorsList}>
        {factors.map((factor, idx) => (
          <FactorItem 
            key={idx}
            icon={getFactorIcon(factor.label)} 
            title={factor.label} 
            subtitle={factor.message} 
            points={`${factor.score}%`} 
            color={factor.impact === 'positive' ? '#3EA63B' : factor.impact === 'negative' ? MizanColors.mintCoral : '#F5A623'} 
          />
        ))}
        {factors.length === 0 && !loading && (
          <Text style={styles.scoreDescription}>No data available yet to calculate factors.</Text>
        )}
      </View>

      {/* Educational Section */}
      <View style={styles.eduSection}>
        <Text style={styles.eduTitle}>What this score is NOT</Text>
        <Text style={styles.eduText}>
          • This is not a CBE or Bank Credit Score.{"\n"}
          • It does not guarantee loan approval.{"\n"}
          • It is an AI-driven trust indicator based on your Mizan activity.
        </Text>
        
        <Text style={[styles.eduTitle, { marginTop: 16 }]}>How it works</Text>
        <Text style={styles.eduText}>
          We analyze your savings consistency, budget discipline, and verification status to generate a 0-100 score. Higher scores unlock better financial insights and potential product matches.
        </Text>
      </View>

      {/* Simulator Stub */}
      <View style={styles.simulatorBox}>
        <View style={styles.simulatorHeader}>
          <TrendingUp size={20} color={MizanColors.mintPrimary} />
          <Text style={styles.simulatorTitle}>Score Simulator (BETA)</Text>
        </View>
        <Text style={styles.simulatorDesc}>See how your score would change if you:</Text>
        <TouchableOpacity 
          style={styles.simulatorItem}
          onPress={() => setScore(Math.min(score + 12, 100))}
        >
          <Text style={styles.simulatorItemText}>Connect a new Bank Account</Text>
          <Text style={styles.simulatorImpact}>+12 pts</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.simulatorItem}
          onPress={() => {
            setScore(Math.min(score + 8, 100));
            router.push('/verify');
          }}
        >
          <Text style={styles.simulatorItemText}>Verify your ID</Text>
          <Text style={styles.simulatorImpact}>+8 pts</Text>
        </TouchableOpacity>
      </View>
    </AppScreenShell>
  );
}

function FactorItem({ icon: Icon, title, subtitle, points, color }: any) {
  return (
    <MizanCard style={styles.factorItem}>
      <View style={[styles.factorIconBox, { backgroundColor: color + '15' }]}>
        <Icon size={24} color={color} />
      </View>
      <View style={styles.factorContent}>
        <Text style={styles.factorTitle}>{title}</Text>
        <Text style={styles.factorSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.pointsBadge, { backgroundColor: color + '15' }]}>
        <Text style={[styles.pointsText, { color }]}>{points}</Text>
      </View>
    </MizanCard>
  );
}

const styles = StyleSheet.create({
  meterContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  cardToggleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  cardToggleLabel: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  privacyText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: '#64748B',
  },
  trustCardWrapper: {
    marginBottom: 32,
    alignItems: 'center',
  },
  shareActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: -20,
    zIndex: 20,
  },
  shareIconBtn: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  revokeBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  revokeText: {
    color: '#EF4444',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  historySection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  historyChart: {
    height: 80,
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  chartLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  chartPoints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  chartPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: MizanColors.mintPrimary,
    position: 'relative',
  },
  historyLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    marginTop: 12,
  },
  historyLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },
  shareIconText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  svgWrapper: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontFamily: 'Inter_900Black',
    color: MizanColors.textPrimary,
    lineHeight: 48,
  },
  scoreLabel: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 4,
  },
  scoreDescription: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 16,
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: '#F0FDF4', // Very light mint
    borderColor: '#DCFCE7',
    borderWidth: 1,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: MizanColors.mintPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.textPrimary,
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.mintPrimary,
  },
  factorsList: {
    gap: 12,
    paddingBottom: 40,
  },
  factorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  factorIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  factorContent: {
    flex: 1,
  },
  factorTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: MizanColors.textPrimary,
  },
  factorSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
    marginTop: 2,
  },
  pointsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  pointsText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  eduSection: {
    marginTop: 24,
    padding: 20,
    backgroundColor: MizanColors.mintBg,
    borderRadius: 16,
    marginBottom: 40,
  },
  eduTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintDark,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  eduText: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: MizanColors.textSecondary,
    lineHeight: 20,
  },
  simulatorBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 60,
  },
  simulatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  simulatorTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  simulatorDesc: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#64748B',
    marginBottom: 16,
  },
  simulatorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  simulatorItemText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#334155',
  },
  simulatorImpact: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: MizanColors.mintPrimary,
  },
});
