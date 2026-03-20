import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import SectionCard from '../components/SectionCard';
import { companyApi, projectApi } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';

export default function CreateProjectScreen({ navigation }) {
  const companies = useAppStore((state) => state.companies);
  const setCompanies = useAppStore((state) => state.setCompanies);
  const addCompany = useAppStore((state) => state.addCompany);
  const addProject = useAppStore((state) => state.addProject);
  const clearDraftItems = useAppStore((state) => state.clearDraftItems);

  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [createNewCompany, setCreateNewCompany] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [gstEnabled, setGstEnabled] = useState(true);
  const [gstin, setGstin] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await companyApi.list();
      setCompanies(data);
      if (data.length && !selectedCompanyId) {
        setSelectedCompanyId(data[0].id);
      }
    } catch (error) {
      Alert.alert('Unable to load companies', 'Check backend connectivity and try again.');
    }
  };

  const resolveCompanyId = async () => {
    if (!createNewCompany) {
      if (!selectedCompanyId) {
        throw new Error('Company selection is required');
      }
      return selectedCompanyId;
    }

    if (!companyName.trim()) {
      throw new Error('Company name is required');
    }

    const company = await companyApi.create({
      name: companyName,
      gstEnabled,
      gstin: gstEnabled ? gstin : null,
    });
    addCompany(company);
    return company.id;
  };

  const handleCreate = async () => {
    if (!name.trim() || !clientName.trim()) {
      Alert.alert('Missing details', 'Project name and client name are required.');
      return;
    }

    try {
      setLoading(true);
      clearDraftItems();
      const companyId = await resolveCompanyId();
      const project = await projectApi.create({ name, clientName, companyId });
      addProject(project);
      navigation.replace('AddMeasurement');
    } catch (error) {
      Alert.alert('Unable to create project', error?.message || 'Please verify the backend server and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Header eyebrow="New client work" title="Create Project" subtitle="Choose the billing company first so invoice tax rules follow the selected profile." />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
            <SectionCard>
              <Text style={styles.lead}>Project and client names remain visible on invoices, so keep them precise and client-safe.</Text>
              <AppInput label="Project Name" value={name} onChangeText={setName} placeholder="Villa Renovation Phase 1" />
              <AppInput label="Client Name" value={clientName} onChangeText={setClientName} placeholder="Client A" />
            </SectionCard>

            <SectionCard style={styles.companyCard}>
              <Text style={styles.sectionTitle}>Billing company</Text>
              <View style={styles.toggleRow}>
                <Pressable
                  style={[styles.togglePill, !createNewCompany && styles.togglePillActive]}
                  onPress={() => setCreateNewCompany(false)}
                >
                  <Text style={[styles.toggleText, !createNewCompany && styles.toggleTextActive]}>Use Existing</Text>
                </Pressable>
                <Pressable
                  style={[styles.togglePill, createNewCompany && styles.togglePillActive]}
                  onPress={() => setCreateNewCompany(true)}
                >
                  <Text style={[styles.toggleText, createNewCompany && styles.toggleTextActive]}>Create New</Text>
                </Pressable>
              </View>

              {!createNewCompany ? (
                companies.map((company) => (
                  <Pressable
                    key={company.id}
                    style={[styles.companyOption, selectedCompanyId === company.id && styles.companyOptionActive]}
                    onPress={() => setSelectedCompanyId(company.id)}
                  >
                    <Text style={styles.companyTitle}>{company.name}</Text>
                    <Text style={styles.companyMeta}>
                      {company.gstEnabled ? `GST Enabled · ${company.gstinMasked || 'GSTIN hidden'}` : 'No GST'}
                    </Text>
                  </Pressable>
                ))
              ) : (
                <View>
                  <AppInput label="Company Name" value={companyName} onChangeText={setCompanyName} placeholder="CraftNest Studio" />
                  <View style={styles.toggleRow}>
                    <Pressable
                      style={[styles.togglePill, gstEnabled && styles.togglePillActive]}
                      onPress={() => setGstEnabled(true)}
                    >
                      <Text style={[styles.toggleText, gstEnabled && styles.toggleTextActive]}>GST Enabled</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.togglePill, !gstEnabled && styles.togglePillActive]}
                      onPress={() => setGstEnabled(false)}
                    >
                      <Text style={[styles.toggleText, !gstEnabled && styles.toggleTextActive]}>No GST</Text>
                    </Pressable>
                  </View>
                  {gstEnabled ? (
                    <AppInput label="GSTIN" value={gstin} onChangeText={setGstin} placeholder="29ABCDE1234F1Z5" />
                  ) : null}
                </View>
              )}
            </SectionCard>

            <AppButton title="Save Project" onPress={handleCreate} loading={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  lead: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    marginBottom: 18,
  },
  companyCard: {
    marginTop: 16,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  togglePill: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
    marginRight: 10,
    marginBottom: 10,
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
  companyOption: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#FCFBF8',
  },
  companyOptionActive: {
    borderColor: colors.primaryDark,
    backgroundColor: colors.surfaceMuted,
  },
  companyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  companyMeta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
