import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function ProjectCard({ project, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.left}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{project.clientName.slice(0, 1).toUpperCase()}</Text>
        </View>
        <View>
          <Text style={styles.title}>{project.name}</Text>
          <Text style={styles.subtitle}>{project.clientName}</Text>
        </View>
      </View>
      <Text style={styles.action}>Open</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  action: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
});
