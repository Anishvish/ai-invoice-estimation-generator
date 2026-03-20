import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function MaterialRateCard({ material, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.material}>{material.material}</Text>
      <Text style={styles.category}>{material.category}</Text>
      <View style={styles.ratePill}>
        <Text style={styles.rateText}>INR {material.defaultRatePerSqft}/sqft</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    marginRight: 12,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 18,
    padding: 14,
  },
  material: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  category: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  ratePill: {
    marginTop: 12,
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rateText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
