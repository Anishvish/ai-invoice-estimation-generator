import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import LineItemCard from '../components/LineItemCard';
import MaterialRateCard from '../components/MaterialRateCard';
import SectionCard from '../components/SectionCard';
import { aiApi, estimateApi, materialApi } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';

const UNIT_MODES = {
  FEET_INCHES: 'feet_inches',
  INCHES_ONLY: 'inches_only',
};

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
  const [lengthFeet, setLengthFeet] = useState('');
  const [lengthInches, setLengthInches] = useState('');
  const [widthFeet, setWidthFeet] = useState('');
  const [widthInches, setWidthInches] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [material, setMaterial] = useState('');
  const [ratePerSqft, setRatePerSqft] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState('0');
  const [discount, setDiscount] = useState('0');
  const [aiInput, setAiInput] = useState('');
  const [unitMode, setUnitMode] = useState(UNIT_MODES.FEET_INCHES);
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

  const loadMaterials = async () => {
    try {
      const materialData = await materialApi.list();
      setMaterials(materialData);
    } catch (error) {
      Alert.alert('Unable to load materials', 'Saved material rates could not be fetched.');
    }
  };

  const resetItemForm = () => {
    setType('');
    setLengthFeet('');
    setLengthInches('');
    setWidthFeet('');
    setWidthInches('');
    setQuantity('1');
    setMaterial('');
    setRatePerSqft('');
    setAiInput('');
    setUnitMode(UNIT_MODES.FEET_INCHES);
  };

  const numericValue = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const buildMeasurementPayload = () => {
    const parsedQuantity = Math.max(1, numericValue(quantity));
    const payload = {
      type,
      material,
      ratePerSqft: numericValue(ratePerSqft),
      quantity: parsedQuantity,
      lengthFeet: unitMode === UNIT_MODES.FEET_INCHES ? numericValue(lengthFeet) : 0,
      widthFeet: unitMode === UNIT_MODES.FEET_INCHES ? numericValue(widthFeet) : 0,
      lengthInches: numericValue(lengthInches),
      widthInches: numericValue(widthInches),
    };
    return payload;
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
      setLengthFeet(String(parsed.lengthFeet ?? 0));
      setLengthInches(String(parsed.lengthInches ?? 0));
      setWidthFeet(String(parsed.widthFeet ?? 0));
      setWidthInches(String(parsed.widthInches ?? 0));
      setMaterial(parsed.material);
      setUnitMode(UNIT_MODES.FEET_INCHES);
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
    const item = buildMeasurementPayload();
    const totalLengthInches = (item.lengthFeet * 12) + item.lengthInches;
    const totalWidthInches = (item.widthFeet * 12) + item.widthInches;

    if (!item.type || !item.material || !item.ratePerSqft || totalLengthInches <= 0 || totalWidthInches <= 0) {
      Alert.alert('Incomplete item', 'Fill all measurement details before adding the line item.');
      return;
    }

    const unitArea = Number(((totalLengthInches * totalWidthInches) / 144).toFixed(2));
    const area = Number((unitArea * item.quantity).toFixed(2));
    const baseCost = Number((area * item.ratePerSqft).toFixed(2));

    addDraftItem({
      ...item,
      unitArea,
      area,
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
          lengthFeet: item.lengthFeet,
          lengthInches: item.lengthInches,
          widthFeet: item.widthFeet,
          widthInches: item.widthInches,
          quantity: item.quantity,
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

  const renderHeader = () => (
    <View>
      <Header
        eyebrow="Estimate builder"
        title="Add Line Items"
        subtitle={currentProject ? `${currentProject.name} - ${currentProject.clientName}` : 'Select a project first'}
      />
      <View style={styles.content}>
        <SectionCard style={styles.aiCard}>
          <Text style={styles.sectionTitle}>AI line item input</Text>
          <Text style={styles.sectionText}>Describe a unit in plain language, then fine-tune quantity, units, and pricing.</Text>
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
        <FlatList
          horizontal
          data={materials}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <MaterialRateCard material={item} onPress={() => handleMaterialPreset(item)} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.materialRow}
        />

        <SectionCard style={styles.formCard}>
          <Text style={styles.sectionTitle}>Line item details</Text>
          <View style={styles.toggleRow}>
            <Pressable
              style={[styles.togglePill, unitMode === UNIT_MODES.FEET_INCHES && styles.togglePillActive]}
              onPress={() => setUnitMode(UNIT_MODES.FEET_INCHES)}
            >
              <Text style={[styles.toggleText, unitMode === UNIT_MODES.FEET_INCHES && styles.toggleTextActive]}>Feet + Inches</Text>
            </Pressable>
            <Pressable
              style={[styles.togglePill, unitMode === UNIT_MODES.INCHES_ONLY && styles.togglePillActive]}
              onPress={() => setUnitMode(UNIT_MODES.INCHES_ONLY)}
            >
              <Text style={[styles.toggleText, unitMode === UNIT_MODES.INCHES_ONLY && styles.toggleTextActive]}>Only Inches</Text>
            </Pressable>
          </View>
          <AppInput label="Type" value={type} onChangeText={setType} placeholder="Wardrobe" />
          {unitMode === UNIT_MODES.FEET_INCHES ? (
            <View style={styles.dimensionGrid}>
              <View style={styles.dimensionCell}>
                <AppInput label="Length Feet" value={lengthFeet} onChangeText={setLengthFeet} placeholder="6" keyboardType="numeric" />
              </View>
              <View style={styles.dimensionCell}>
                <AppInput label="Length Inches" value={lengthInches} onChangeText={setLengthInches} placeholder="0" keyboardType="numeric" />
              </View>
              <View style={styles.dimensionCell}>
                <AppInput label="Width Feet" value={widthFeet} onChangeText={setWidthFeet} placeholder="7" keyboardType="numeric" />
              </View>
              <View style={styles.dimensionCell}>
                <AppInput label="Width Inches" value={widthInches} onChangeText={setWidthInches} placeholder="0" keyboardType="numeric" />
              </View>
            </View>
          ) : (
            <View style={styles.dimensionGrid}>
              <View style={styles.dimensionCell}>
                <AppInput label="Length Inches" value={lengthInches} onChangeText={setLengthInches} placeholder="72" keyboardType="numeric" />
              </View>
              <View style={styles.dimensionCell}>
                <AppInput label="Width Inches" value={widthInches} onChangeText={setWidthInches} placeholder="24" keyboardType="numeric" />
              </View>
            </View>
          )}
          <AppInput label="Quantity" value={quantity} onChangeText={setQuantity} placeholder="1" keyboardType="numeric" />
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

        <View style={styles.sectionRowCompact}>
          <Text style={styles.sectionTitle}>Estimate items</Text>
          <Text style={styles.runningTotal}>Subtotal INR {runningSubtotal}</Text>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerWrap}>
      <AppButton title="Calculate Estimate" onPress={handleCalculate} loading={loading} />
    </View>
  );

  return (
    <FlatList
      data={draftItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <LineItemCard item={item} onRemove={() => removeDraftItem(item.id)} />}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={<Text style={styles.emptyText}>No line items added yet. Start with AI input or manual entry.</Text>}
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
    marginTop: 18,
    marginBottom: 12,
    marginHorizontal: 20,
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
    paddingHorizontal: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  togglePill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
    marginRight: 10,
  },
  togglePillActive: {
    backgroundColor: colors.primaryDark,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.surface,
  },
  dimensionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dimensionCell: {
    width: '48%',
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
    marginHorizontal: 20,
    marginBottom: 16,
  },
  footerWrap: {
    paddingHorizontal: 20,
  },
});
