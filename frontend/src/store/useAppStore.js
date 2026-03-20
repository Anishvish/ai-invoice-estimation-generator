import { create } from 'zustand';

export const useAppStore = create((set) => ({
  projects: [],
  companies: [],
  materials: [],
  currentProject: null,
  currentEstimate: null,
  currentInvoice: null,
  draftItems: [],
  setProjects: (projects) => set({ projects }),
  setCompanies: (companies) => set({ companies }),
  setMaterials: (materials) => set({ materials }),
  addCompany: (company) =>
    set((state) => ({
      companies: [company, ...state.companies],
    })),
  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
      currentProject: project,
    })),
  setCurrentProject: (project) => set({ currentProject: project }),
  setCurrentEstimate: (estimate) => set({ currentEstimate: estimate }),
  setCurrentInvoice: (invoice) => set({ currentInvoice: invoice }),
  addDraftItem: (item) =>
    set((state) => ({
      draftItems: [...state.draftItems, { ...item, id: `${Date.now()}-${state.draftItems.length}` }],
    })),
  removeDraftItem: (id) =>
    set((state) => ({
      draftItems: state.draftItems.filter((item) => item.id !== id),
    })),
  clearDraftItems: () => set({ draftItems: [] }),
}));
