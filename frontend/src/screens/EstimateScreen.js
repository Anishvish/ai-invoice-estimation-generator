import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import AppButton from '../components/AppButton';
import CostBreakdownCard from '../components/CostBreakdownCard';
import LineItemCard from '../components/LineItemCard';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';

export default function EstimateScreen({ navigation }) {
  const estimate = useAppStore((state) => state.currentEstimate);

  if (!estimate) {
    return (
      <View style={styles.container}>
        <Header eyebrow="Estimate review" title="Estimate" subtitle="No estimate available." />
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>Calculate an estimate first.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        eyebrow="Estimate review"
        title={estimate.projectName}
        subtitle={`${estimate.clientName} - ${estimate.items.length} line items`}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <StatCard label="Area" value={`${estimate.totalArea}`} />
          <View style={styles.gap} />
          <StatCard label="Final Amount" value={`INR ${estimate.finalAmount}`} tone="dark" />
        </View>

        <SectionCard style={styles.section}>
          <Text style={styles.sectionTitle}>Line items</Text>
          {estimate.items.map((item) => (
            <LineItemCard key={item.measurementId} item={item} />
          ))}
        </SectionCard>

        <SectionCard style={styles.section}>
          <Text style={styles.sectionTitle}>Cost breakdown</Text>
          <CostBreakdownCard estimate={estimate} />
        </SectionCard>

        <AppButton title="Generate Invoice" onPress={() => navigation.navigate('Invoice')} />
        <View style={styles.spacer} />
        <AppButton title="Build Another Estimate" variant="secondary" onPress={() => navigation.navigate('AddMeasurement')} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 28,
  },
  emptyWrap: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
  },
  gap: {
    width: 12,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  spacer: {
    height: 12,
  },
});
