import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

function Row({ label, value, highlight }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, highlight && styles.highlightLabel]}>{label}</Text>
      <Text style={[styles.value, highlight && styles.highlightValue]}>{value}</Text>
    </View>
  );
}

export default function CostBreakdownCard({ estimate }) {
  return (
    <View style={styles.card}>
      <Row label="Area" value={`${estimate.totalArea} sqft`} />
      <Row label="Subtotal" value={`INR ${estimate.subtotal}`} />
      <Row label="Additional Charges" value={`INR ${estimate.additionalCharges}`} />
      <Row label="Discount" value={`INR ${estimate.discount}`} />
      <Row label={`GST (${estimate.gstPercentage}%)`} value={`INR ${estimate.gstAmount}`} />
      <Row label="Final Amount" value={`INR ${estimate.finalAmount}`} highlight />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  label: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  highlightLabel: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  highlightValue: {
    color: colors.success,
    fontWeight: '800',
    fontSize: 18,
  },
});
