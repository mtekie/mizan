import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MizanColors, MizanSpacing, MizanTypography } from '@mizan/ui-tokens';
import { Lightbulb, CheckCircle2, TrendingUp, CheckCircle, RefreshCw } from 'lucide-react-native';
import { AppScreenShell } from '../components/ui/AppScreenShell';
import { MizanCard } from '../components/ui/MizanCard';
import { api } from '../lib/api';
import { useStore } from '../lib/store';
import Svg, { Circle } from 'react-native-svg';

export default function ScoreScreen() {
  const router = useRouter();
  const { isGuest } = useStore();
  const [score, setScore] = useState(isGuest ? 720 : 0);
  const [loading, setLoading] = useState(!isGuest);
  const [tip, setTip] = useState('Generating your financial recommendation...');
  const [tipLoading, setTipLoading] = useState(true);

  const loadScore = async () => {
    if (isGuest) return;
    setLoading(true);
    try {
      const data = await api.score.get();
      setScore(data.score);
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
  const progress = score / 1000;
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
            <Text style={styles.scoreLabel}>{score > 750 ? 'Excellent' : score > 600 ? 'Good' : 'Fair'}</Text>
          </View>
        </View>
        <Text style={styles.scoreDescription}>
          Your financial health is strong. Keep up the consistency with your Equb contributions.
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
        <TouchableOpacity>
          <Text style={styles.seeAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.factorsList}>
        <FactorItem 
          icon={CheckCircle2} 
          title="Equb Consistency" 
          subtitle="On time for 6 cycles" 
          points="+15 pts" 
          color="#3EA63B" 
        />
        <FactorItem 
          icon={TrendingUp} 
          title="Savings Growth" 
          subtitle="Growing, but below target" 
          points="Stable" 
          color="#F5A623" 
        />
        <FactorItem 
          icon={CheckCircle} 
          title="Utility Payments" 
          subtitle="All bills paid on time" 
          points="+5 pts" 
          color="#3EA63B" 
        />
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
    paddingVertical: 24,
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
});
