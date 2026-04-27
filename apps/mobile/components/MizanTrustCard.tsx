import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MizanColors } from '@mizan/ui-tokens';
import { ShieldCheck, CheckCircle2, QrCode, Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface MizanTrustCardProps {
  score: number;
  userName: string;
  verifiedFacts: string[];
}

export function MizanTrustCard({ score, userName, verifiedFacts }: MizanTrustCardProps) {
  return (
    <View style={styles.cardContainer}>
      {/* Background patterns */}
      <View style={styles.flare} />
      <View style={[styles.flare, styles.flareAlt]} />

      <View style={styles.header}>
        <View style={styles.brand}>
          <ShieldCheck size={24} color="#fff" />
          <Text style={styles.brandText}>MIZAN TRUST</Text>
        </View>
        <View style={styles.verifiedBadge}>
          <CheckCircle2 size={12} color={MizanColors.mintPrimary} />
          <Text style={styles.verifiedText}>LEVEL 2</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        
        <View style={styles.userBox}>
          <Text style={styles.userName}>{userName.toUpperCase()}</Text>
          <Text style={styles.userSince}>MEMBER SINCE 2026</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.facts}>
          <Text style={styles.factSectionTitle}>VERIFIED FACTS</Text>
          {verifiedFacts.map((fact, idx) => (
            <View key={idx} style={styles.factRow}>
              <CheckCircle2 size={10} color={MizanColors.mintPrimary} />
              <Text style={styles.factText}>{fact}</Text>
            </View>
          ))}
          <Text style={[styles.factSectionTitle, { marginTop: 4 }]}>FRESHNESS</Text>
          <Text style={styles.freshnessText}>VALID UNTIL {new Date(Date.now() + 86400000).toLocaleDateString()}</Text>
        </View>
        <View style={styles.qrBox}>
          <QrCode size={40} color="#fff" opacity={0.4} />
        </View>
      </View>

      <View style={styles.sparkleBox}>
         <Sparkles size={16} color="#fff" opacity={0.2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: width - 40,
    height: 220,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  flare: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    backgroundColor: MizanColors.mintPrimary,
    opacity: 0.15,
    borderRadius: 75,
  },
  flareAlt: {
    top: undefined,
    bottom: -50,
    left: -50,
    backgroundColor: '#3B82F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  scoreBox: {
    gap: 2,
  },
  scoreLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  scoreValue: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 48,
  },
  userBox: {
    alignItems: 'flex-end',
    gap: 2,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  userSince: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
  },
  facts: {
    gap: 4,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  factSectionTitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 2,
  },
  factText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    fontWeight: '700',
  },
  freshnessText: {
    color: MizanColors.mintPrimary,
    fontSize: 8,
    fontWeight: '800',
  },
  qrBox: {
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
  },
  sparkleBox: {
    position: 'absolute',
    bottom: 24,
    right: 80,
  }
});
