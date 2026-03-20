import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Header from '../components/Header';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import LineItemCard from '../components/LineItemCard';
import SectionCard from '../components/SectionCard';
import { invoiceApi } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';

export default function InvoiceScreen({ navigation }) {
  const estimate = useAppStore((state) => state.currentEstimate);
  const invoice = useAppStore((state) => state.currentInvoice);
  const setCurrentInvoice = useAppStore((state) => state.setCurrentInvoice);
  const [advancePayment, setAdvancePayment] = useState('0');
  const [loading, setLoading] = useState(false);

  const handleGenerateInvoice = async () => {
    if (!estimate?.estimateId) {
      Alert.alert('Missing estimate', 'Calculate an estimate before generating an invoice.');
      return;
    }

    try {
      setLoading(true);
      const generatedInvoice = await invoiceApi.generate({
        estimateId: estimate.estimateId,
        advancePayment: Number(advancePayment || 0),
      });
      setCurrentInvoice(generatedInvoice);
    } catch (error) {
      Alert.alert('Invoice generation failed', 'Verify the backend server and PDF output directory.');
    } finally {
      setLoading(false);
    }
  };

  const ensureDownloadedInvoice = async () => {
    if (!invoice?.invoiceId) {
      throw new Error('Invoice is not ready');
    }

    const destination = `${FileSystem.documentDirectory}${invoice.invoiceNumber || `invoice-${invoice.invoiceId}`}.pdf`;
    const result = await FileSystem.downloadAsync(invoiceApi.downloadUrl(invoice.invoiceId), destination);
    return result.uri;
  };

  const handleDownload = async () => {
    if (!invoice?.invoiceId) {
      Alert.alert('Invoice not ready', 'Generate the invoice first.');
      return;
    }

    try {
      setLoading(true);
      const uri = await ensureDownloadedInvoice();
      Alert.alert('Invoice downloaded', uri);
    } catch (error) {
      Alert.alert('Download failed', 'Unable to download the invoice PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!invoice?.invoiceId) {
      Alert.alert('Invoice not ready', 'Generate the invoice first.');
      return;
    }

    try {
      setLoading(true);
      const uri = await ensureDownloadedInvoice();
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Share unavailable', uri);
        return;
      }
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Share failed', 'Unable to share the invoice PDF.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlatList
      data={estimate?.items || []}
      keyExtractor={(item) => String(item.measurementId)}
      renderItem={({ item }) => <LineItemCard item={item} />}
      ListHeaderComponent={
        <View>
          <Header eyebrow="Invoice ready" title="Invoice Preview" subtitle="Generate, download, or share the branded PDF." />
          <View style={styles.content}>
            <SectionCard>
              <Text style={styles.invoiceTitle}>{invoice?.invoiceNumber || 'Invoice preview pending'}</Text>
              <Text style={styles.invoiceMeta}>Company: {invoice?.companyName || estimate?.companyName || '-'}</Text>
              <Text style={styles.invoiceMeta}>
                GST: {invoice?.gstApplied ? `Applied (${invoice.companyGstinMasked || 'masked'})` : 'Not Applicable'}
              </Text>
              <Text style={styles.invoiceMeta}>Client: {invoice?.clientName || estimate?.clientName || '-'}</Text>
              <Text style={styles.invoiceMeta}>Subtotal: INR {invoice?.subtotal ?? estimate?.subtotal ?? '-'}</Text>
              <Text style={styles.invoiceMeta}>GST Amount: INR {invoice?.gstAmount ?? '-'}</Text>
              <Text style={styles.invoiceMeta}>Invoice Total: INR {invoice?.totalAmount ?? '-'}</Text>
              <Text style={styles.invoiceMeta}>Advance Paid: INR {invoice?.advancePayment ?? advancePayment}</Text>
              <Text style={styles.invoiceMeta}>Balance Due: INR {invoice?.balanceDue ?? '-'}</Text>
              <Text style={styles.invoicePath}>{invoice?.downloadUrl || 'Generate the invoice to enable download.'}</Text>
            </SectionCard>

            <SectionCard style={styles.advanceCard}>
              <Text style={styles.sectionTitle}>Payment settings</Text>
              <Text style={styles.invoiceMeta}>Advance payment is deducted from the invoice total to show balance due.</Text>
              <AppInput
                label="Advance Payment (INR)"
                value={advancePayment}
                onChangeText={setAdvancePayment}
                placeholder="0"
                keyboardType="numeric"
              />
            </SectionCard>

            <Text style={styles.sectionTitle}>Included line items</Text>
          </View>
        </View>
      }
      ListFooterComponent={
        <View style={styles.footer}>
          <AppButton
            title={invoice ? 'Refresh Invoice PDF' : 'Generate Invoice PDF'}
            onPress={handleGenerateInvoice}
            loading={loading}
          />
          <View style={styles.spacer} />
          <AppButton title="Download Invoice" variant="secondary" onPress={handleDownload} />
          <View style={styles.spacer} />
          <AppButton title="Share Invoice" variant="secondary" onPress={handleShare} />
          <View style={styles.spacer} />
          <AppButton title="Back to Dashboard" variant="secondary" onPress={() => navigation.navigate('Dashboard')} />
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
  listContent: {
    paddingBottom: 28,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
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
    marginTop: 16,
    marginBottom: 14,
  },
  footer: {
    paddingHorizontal: 20,
  },
  advanceCard: {
    marginTop: 16,
  },
  spacer: {
    height: 12,
  },
});
