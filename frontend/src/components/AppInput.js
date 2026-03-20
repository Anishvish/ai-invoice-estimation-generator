import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';

export default function AppInput({ label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  input: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FCFBF8',
    paddingHorizontal: 16,
    fontSize: 15,
    color: colors.textPrimary,
  },
  multiline: {
    minHeight: 88,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
});
