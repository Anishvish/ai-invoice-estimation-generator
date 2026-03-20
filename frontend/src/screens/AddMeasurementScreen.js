import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import LineItemCard from '../components/LineItemCard';
import MaterialRateCard from '../components/MaterialRateCard';
import SectionCard from '../components/SectionCard';
import { aiApi, estimateApi, materialApi } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';

export default function AddMeasurementScreen({ navigation }) {
  const currentProject = useAppStore((state) => state.currentProject);
  const materials = useAppStore((state) => state.materials);
  const draftItems = useAppStore((state) => state.draftItems);
  const setMaterials = useAppStore((state) => state.setMaterials);
  const addDraftItem = useAppStore((state) => state.addDraftItem);
  const removeDraftItem = useAppStore((state) => state.removeDraftItem);
  const clearDraftItems = useAppStore((state) => state.clearDraftItems);
  const setCurrentEstimate = useAppStore((state) => state.setCurrentEstimate);
  const setCurrentInvoice = useAppStore((state) => state.setCurrentInvoice);

  const [type, setType] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [material, setMaterial] = useState('');
  const [ratePerSqft, setRatePerSqft] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [aiInput, setAiInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!materials.length) {
      loadMaterials();
    }
  }, []);

  const runningSubtotal = useMemo(
    () => draftItems.reduce((sum, item) => sum + Number(item.baseCost), 0).toFixed(2),
    [draftItems]
  );

  const resetItemForm = () => {
    setType('');
    setLength('');
    setWidth('');
    setMaterial('');
    setRatePerSqft('');
    setAiInput('');
  };

  const loadMaterials = async () => {
    try {
      const materialData = await materialApi.list();
      setMaterials(materialData);
    } catch (error) {
      Alert.alert('Unable to load materials', 'Saved material rates could not be fetched.');
    }
  };

  const handleAiParse = async () => {
    if (!aiInput.trim()) {
      Alert.alert('Missing input', 'Enter a natural language measurement description first.');
      return;
    }

    try {
      setAiLoading(true);
      const parsed = await aiApi.parse(aiInput);
      setType(parsed.type);
      setLength(String(parsed.length));
      setWidth(String(parsed.width));
      setMaterial(parsed.material);
      const matchedMaterial = materials.find((item) => item.material === parsed.material);
      if (matchedMaterial) {
        setRatePerSqft(String(matchedMaterial.defaultRatePerSqft));
      }
    } catch (error) {
      Alert.alert('AI parse failed', 'The text could not be parsed. Try a clearer format.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleMaterialPreset = (selectedMaterial) => {
    setMaterial(selectedMaterial.material);
    setRatePerSqft(String(selectedMaterial.defaultRatePerSqft));
    if (!type) {
      setType(selectedMaterial.category);
    }
  };

  const handleAddLineItem = () => {
    const numericLength = Number(length);
    const numericWidth = Number(width);
    const numericRate = Number(ratePerSqft);

    if (!type || !material || !numericLength || !numericWidth || !numericRate) {
      Alert.alert('Incomplete item', 'Fill all measurement details before adding the line item.');
      return;
    }

    const area = Number((numericLength * numericWidth).toFixed(2));
    const baseCost = Number((area * numericRate).toFixed(2));

    addDraftItem({
      type,
      material,
      length: numericLength,
      width: numericWidth,
      area,
      ratePerSqft: numericRate,
      baseCost,
    });
    resetItemForm();
  };

  const handleCalculate = async () => {
    if (!currentProject?.id) {
      Alert.alert('Project not selected', 'Create or choose a project before adding measurements.');
      navigation.navigate('Dashboard');
      return;
    }

    if (!draftItems.length) {
      Alert.alert('No line items', 'Add at least one line item before calculating the estimate.');
      return;
    }

    try {
      setLoading(true);
      setCurrentInvoice(null);
      const estimate = await estimateApi.calculate({
        projectId: currentProject.id,
        measurements: draftItems.map((item) => ({
          type: item.type,
          length: item.length,
          width: item.width,
          material: item.material,
          ratePerSqft: item.ratePerSqft,
        })),
        additionalCharges: Number(additionalCharges || 0),
        discount: Number(discount || 0),
      });
      setCurrentEstimate(estimate);
      clearDraftItems();
      navigation.navigate('Estimate');
    } catch (error) {
      Alert.alert('Calculation failed', 'Check all inputs and backend validation rules.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        eyebrow="Estimate builder"
        title="Add Line Items"
        subtitle={currentProject ? `${currentProject.name} - ${currentProject.clientName}` : 'Select a project first'}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionCard style={styles.aiCard}>
          <Text style={styles.sectionTitle}>AI line item input</Text>
          <Text style={styles.sectionText}>Describe a unit in plain language and use material presets to speed up pricing.</Text>
          <AppInput
            label="Describe the item"
            value={aiInput}
            onChangeText={setAiInput}
            placeholder="Wardrobe 6 by 7 feet laminate finish"
            multiline
          />
          <AppButton title="Parse with AI" onPress={handleAiParse} loading={aiLoading} variant="secondary" />
        </SectionCard>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Saved material rates</Text>
          <Text style={styles.sectionMeta}>{materials.length} presets</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.materialRow}>
          {materials.map((item) => (
            <MaterialRateCard key={item.id} material={item} onPress={() => handleMaterialPreset(item)} />
          ))}
        </ScrollView>

        <SectionCard style={styles.formCard}>
          <Text style={styles.sectionTitle}>Line item details</Text>
          <AppInput label="Type" value={type} onChangeText={setType} placeholder="Wardrobe" />
          <AppInput label="Length (ft)" value={length} onChangeText={setLength} placeholder="6" keyboardType="numeric" />
          <AppInput label="Width (ft)" value={width} onChangeText={setWidth} placeholder="7" keyboardType="numeric" />
          <AppInput label="Material" value={material} onChangeText={setMaterial} placeholder="Laminate" />
          <AppInput
            label="Rate Per Sqft (INR)"
            value={ratePerSqft}
            onChangeText={setRatePerSqft}
            placeholder="450"
            keyboardType="numeric"
          />
          <AppButton title="Add Line Item" onPress={handleAddLineItem} variant="secondary" />
        </SectionCard>

        <SectionCard style={styles.formCard}>
          <Text style={styles.sectionTitle}>Commercial adjustments</Text>
          <AppInput
            label="Additional Charges (INR)"
            value={additionalCharges}
            onChangeText={setAdditionalCharges}
            placeholder="0"
            keyboardType="numeric"
          />
          <AppInput label="Discount (INR)" value={discount} onChangeText={setDiscount} placeholder="0" keyboardType="numeric" />
        </SectionCard>

        <SectionCard>
          <View style={styles.sectionRowCompact}>
            <Text style={styles.sectionTitle}>Estimate items</Text>
            <Text style={styles.runningTotal}>Subtotal INR {runningSubtotal}</Text>
          </View>
          {draftItems.length === 0 ? (
            <Text style={styles.emptyText}>No line items added yet. Start with AI input or manual entry.</Text>
          ) : (
            draftItems.map((item) => <LineItemCard key={item.id} item={item} onRemove={() => removeDraftItem(item.id)} />)
          )}
          <AppButton title="Calculate Estimate" onPress={handleCalculate} loading={loading} />
        </SectionCard>
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
  aiCard: {
    backgroundColor: '#F6F2E8',
  },
  formCard: {
    marginTop: 16,
  },
  sectionRow: {
    marginTop: 22,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionRowCompact: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionText: {
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  sectionMeta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  materialRow: {
    paddingBottom: 4,
  },
  runningTotal: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 16,
  },
});
