import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

export default function SectionCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
});
