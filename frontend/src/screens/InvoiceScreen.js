import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Sharing from 'expo-sharing';
import Header from '../components/Header';
import AppButton from '../components/AppButton';
import LineItemCard from '../components/LineItemCard';
import SectionCard from '../components/SectionCard';
import { invoiceApi } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';

export default function InvoiceScreen({ navigation }) {
  const estimate = useAppStore((state) => state.currentEstimate);
  const invoice = useAppStore((state) => state.currentInvoice);
  const setCurrentInvoice = useAppStore((state) => state.setCurrentInvoice);
  const [loading, setLoading] = useState(false);

  const handleGenerateInvoice = async () => {
    if (!estimate?.estimateId) {
      Alert.alert('Missing estimate', 'Calculate an estimate before generating an invoice.');
      return;
    }

    try {
      setLoading(true);
      const generatedInvoice = await invoiceApi.generate({ estimateId: estimate.estimateId });
      setCurrentInvoice(generatedInvoice);
    } catch (error) {
      Alert.alert('Invoice generation failed', 'Verify the backend server and PDF output directory.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!invoice?.filePath) {
      Alert.alert('Invoice not ready', 'Generate the invoice first.');
      return;
    }

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable || !invoice.filePath.startsWith('file://')) {
      Alert.alert('Invoice ready', `Share this backend PDF path with your team:\n${invoice.filePath}`);
      return;
    }

    await Sharing.shareAsync(invoice.filePath);
  };

  return (
    <View style={styles.container}>
      <Header eyebrow="Invoice ready" title="Invoice Preview" subtitle="Generate the branded PDF and share it with the client." />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionCard>
          <Text style={styles.invoiceTitle}>{invoice?.invoiceNumber || 'Invoice preview pending'}</Text>
          <Text style={styles.invoiceMeta}>Company: {invoice?.companyName || 'DesignFlow India Pvt. Ltd.'}</Text>
          <Text style={styles.invoiceMeta}>Client: {invoice?.clientName || estimate?.clientName || '-'}</Text>
          <Text style={styles.invoiceMeta}>Amount: INR {invoice?.finalAmount || estimate?.finalAmount || '-'}</Text>
          <Text style={styles.invoicePath}>{invoice?.filePath || 'The PDF will be generated on the backend.'}</Text>
        </SectionCard>

        <SectionCard style={styles.section}>
          <Text style={styles.sectionTitle}>Included line items</Text>
          {(estimate?.items || []).map((item) => (
            <LineItemCard key={item.measurementId} item={item} />
          ))}
        </SectionCard>

        <AppButton
          title={invoice ? 'Regenerate PDF' : 'Generate Invoice PDF'}
          onPress={handleGenerateInvoice}
          loading={loading}
        />
        <View style={styles.spacer} />
        <AppButton title="Share Invoice" variant="secondary" onPress={handleShare} />
        <View style={styles.spacer} />
        <AppButton title="Back to Dashboard" variant="secondary" onPress={() => navigation.navigate('Dashboard')} />
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
  section: {
    marginTop: 16,
  },
  invoiceTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  invoiceMeta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  invoicePath: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
    color: colors.primaryDark,
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
