import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
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
    <FlatList
      data={estimate.items}
      keyExtractor={(item) => String(item.measurementId)}
      renderItem={({ item }) => <LineItemCard item={item} />}
      ListHeaderComponent={
        <View>
          <Header
            eyebrow="Estimate review"
            title={estimate.projectName}
            subtitle={`${estimate.clientName} - ${estimate.items.length} line items`}
          />
          <View style={styles.content}>
            <View style={styles.statsRow}>
              <StatCard label="Area" value={`${estimate.totalArea}`} />
              <View style={styles.gap} />
              <StatCard label="Final Amount" value={`INR ${estimate.finalAmount}`} tone="dark" />
            </View>

            <SectionCard style={styles.section}>
              <Text style={styles.sectionTitle}>Cost breakdown</Text>
              <CostBreakdownCard estimate={estimate} />
            </SectionCard>

            <Text style={styles.listTitle}>Line items</Text>
          </View>
        </View>
      }
      ListFooterComponent={
        <View style={styles.footer}>
          <AppButton title="Generate Invoice" onPress={() => navigation.navigate('Invoice')} />
          <View style={styles.spacer} />
          <AppButton title="Build Another Estimate" variant="secondary" onPress={() => navigation.navigate('AddMeasurement')} />
        </View>
      }
      contentContainerStyle={styles.listContent}
      removeClippedSubviews
      initialNumToRender={12}
      windowSize={8}
      maxToRenderPerBatch={12}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: 28,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
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
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  listTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 20,
  },
  spacer: {
    height: 12,
  },
});
