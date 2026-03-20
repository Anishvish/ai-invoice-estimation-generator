import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function StatCard({ label, value, tone = 'light' }) {
  return (
    <View style={[styles.card, tone === 'dark' ? styles.darkCard : styles.lightCard]}>
      <Text style={[styles.label, tone === 'dark' && styles.darkLabel]}>{label}</Text>
      <Text style={[styles.value, tone === 'dark' && styles.darkValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    minHeight: 96,
  },
  lightCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  darkCard: {
    backgroundColor: colors.primaryDark,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  value: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  darkLabel: {
    color: '#C7D2FE',
  },
  darkValue: {
    color: colors.surface,
  },
});
