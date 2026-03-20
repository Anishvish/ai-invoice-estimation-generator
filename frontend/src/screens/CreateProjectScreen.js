import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import SectionCard from '../components/SectionCard';
import { projectApi } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';

export default function CreateProjectScreen({ navigation }) {
  const addProject = useAppStore((state) => state.addProject);
  const clearDraftItems = useAppStore((state) => state.clearDraftItems);
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !clientName.trim()) {
      Alert.alert('Missing details', 'Project name and client name are required.');
      return;
    }

    try {
      setLoading(true);
      clearDraftItems();
      const project = await projectApi.create({ name, clientName });
      addProject(project);
      navigation.replace('AddMeasurement');
    } catch (error) {
      Alert.alert('Unable to create project', 'Please verify the backend server and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Header eyebrow="New client work" title="Create Project" subtitle="Set up the client profile before adding estimate line items." />
      <View style={styles.content}>
        <SectionCard>
          <Text style={styles.lead}>Keep the project name client-facing. It will appear on the invoice and project list.</Text>
          <AppInput label="Project Name" value={name} onChangeText={setName} placeholder="Villa Renovation Phase 1" />
          <AppInput label="Client Name" value={clientName} onChangeText={setClientName} placeholder="Riya Sharma" />
          <AppButton title="Save Project" onPress={handleCreate} loading={loading} />
        </SectionCard>
      </View>
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
  },
  lead: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
    marginBottom: 18,
  },
});
