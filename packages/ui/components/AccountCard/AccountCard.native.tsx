import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MizanColors, MizanComponentTokens, MizanRadii } from '@mizan/ui-tokens';
import type { AccountCardProps } from './AccountCard';

const T = MizanComponentTokens.accountTile;

export const AccountCard: React.FC<AccountCardProps> = ({
  name, balance, type, color, icon, onPress,
}) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper onPress={onPress} activeOpacity={0.85} style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.topRow}>
        <Text style={styles.type}>{type.toUpperCase()}</Text>
        {icon && <View>{icon}</View>}
      </View>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <Text style={styles.balance} numberOfLines={1}>{balance}</Text>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    width: T.width, height: T.height, borderRadius: MizanRadii.lg,
    padding: 14, marginRight: 12, justifyContent: 'space-between',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 10, elevation: 5,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  type: { fontSize: T.typeSize, fontFamily: 'Inter_700Bold', color: 'rgba(255,255,255,0.75)', letterSpacing: 0.8 },
  name: { fontSize: T.nameSize, fontFamily: 'Inter_700Bold', color: '#fff', marginTop: 4 },
  balance: { fontSize: T.balanceSize, fontFamily: 'Inter_900Black', color: '#fff' },
});
