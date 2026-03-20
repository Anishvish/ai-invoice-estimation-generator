import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function Header({ title, subtitle, eyebrow, rightSlot }) {
  return (
    <SafeAreaView style={styles.wrap}>
      <View style={styles.hero}>
        <View style={styles.row}>
          <View style={styles.copy}>
            {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {rightSlot ? <View>{rightSlot}</View> : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.night,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 22,
    backgroundColor: colors.night,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  copy: {
    flex: 1,
    paddingRight: 12,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.gold,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.surface,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#CBD5E1',
  },
});
