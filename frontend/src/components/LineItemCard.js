import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function LineItemCard({ item, onRemove }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{item.type}</Text>
        <Text style={styles.amount}>INR {item.baseCost}</Text>
      </View>
      <Text style={styles.meta}>
        {item.length} ft x {item.width} ft · {item.material}
      </Text>
      <Text style={styles.meta}>
        {item.area} sqft at INR {item.ratePerSqft}/sqft
      </Text>
      {onRemove ? (
        <Pressable onPress={onRemove} style={styles.removePill}>
          <Text style={styles.removeText}>Remove</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FCFBF8',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  removePill: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FEE4E2',
  },
  removeText: {
    color: colors.danger,
    fontWeight: '700',
    fontSize: 12,
  },
});
