import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import Header from '../components/Header';
import AppButton from '../components/AppButton';
import ProjectCard from '../components/ProjectCard';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import { companyApi, materialApi, projectApi } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';

export default function DashboardScreen({ navigation }) {
  const projects = useAppStore((state) => state.projects);
  const companies = useAppStore((state) => state.companies);
  const materials = useAppStore((state) => state.materials);
  const setProjects = useAppStore((state) => state.setProjects);
  const setCompanies = useAppStore((state) => state.setCompanies);
  const setMaterials = useAppStore((state) => state.setMaterials);
  const setCurrentProject = useAppStore((state) => state.setCurrentProject);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const projectCount = projects.length;
    const companyCount = companies.length;
    const materialCount = materials.length;
    const catalogStatus = materialCount ? 'Catalog ready' : 'No presets';
    return { projectCount, companyCount, materialCount, catalogStatus };
  }, [companies.length, materials.length, projects.length]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectData, materialData, companyData] = await Promise.all([projectApi.list(), materialApi.list(), companyApi.list()]);
      setProjects(projectData);
      setMaterials(materialData);
      setCompanies(companyData);
    } catch (error) {
      Alert.alert('Unable to load dashboard', 'Check backend connectivity and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        eyebrow="Business cockpit"
        title="AI Invoice Studio"
        subtitle="Create estimates fast, turn them into invoices, and reuse your best material rates."
      />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadData} tintColor={colors.primary} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <StatCard label="Projects" value={String(stats.projectCount)} />
          <View style={styles.gap} />
          <StatCard label="Companies" value={String(stats.companyCount)} tone="dark" />
        </View>

        <SectionCard style={styles.banner}>
          <Text style={styles.bannerEyebrow}>Today focus</Text>
          <Text style={styles.bannerTitle}>Build polished estimates in fewer taps.</Text>
          <Text style={styles.bannerText}>
            Use AI-assisted line items, saved rates, and one-tap invoice generation for interior and contracting work.
          </Text>
          <View style={styles.bannerButtons}>
            <View style={styles.bannerButtonMain}>
              <AppButton title="New Project" onPress={() => navigation.navigate('CreateProject')} />
            </View>
            <View style={styles.bannerButtonAlt}>
              <AppButton title="New Estimate" variant="secondary" onPress={() => navigation.navigate('AddMeasurement')} />
            </View>
          </View>
        </SectionCard>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Recent Projects</Text>
          <Text style={styles.sectionMeta}>{stats.catalogStatus}</Text>
        </View>

        {projects.length === 0 ? (
          <SectionCard>
            <Text style={styles.emptyTitle}>No projects yet</Text>
            <Text style={styles.emptyText}>Create a project to start building estimates and invoices.</Text>
          </SectionCard>
        ) : (
          <FlatList
            data={projects}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <ProjectCard
                project={item}
                onPress={() => {
                  setCurrentProject(item);
                  navigation.navigate('AddMeasurement');
                }}
              />
            )}
          />
        )}
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
  statsRow: {
    flexDirection: 'row',
  },
  gap: {
    width: 12,
  },
  banner: {
    marginTop: 16,
    backgroundColor: '#F9F6EF',
  },
  bannerEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bannerTitle: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  bannerText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textSecondary,
  },
  bannerButtons: {
    marginTop: 18,
  },
  bannerButtonMain: {
    marginBottom: 10,
  },
  bannerButtonAlt: {
    marginBottom: 2,
  },
  sectionRow: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sectionMeta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
});
