import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme/colors';

export default function AppButton({ title, onPress, loading, variant = 'primary' }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' ? styles.secondaryButton : styles.primaryButton,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? colors.primary : colors.surface} />
      ) : (
        <Text style={variant === 'secondary' ? styles.secondaryText : styles.primaryText}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primaryText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.9,
  },
});
