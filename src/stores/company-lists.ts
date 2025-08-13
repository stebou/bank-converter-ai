import type {
    AddCompaniesToListData,
    BulkActionData,
    Company,
    CompanyList,
    CompanyStatus,
    CreateCompanyListData,
    ImportFilters,
    UpdateCompanyListData
} from '@/types/company-lists';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CompanyListsState {
  // État des données
  lists: CompanyList[];
  currentList: CompanyList | null;
  activeListId: string | null;
  selectedCompanies: string[];
  isLoading: boolean;
  error: string | null;
  
  // État de l'interface
  showImportModal: boolean;
  importFilters: ImportFilters;
  searchResults: Company[];
  searchLoading: boolean;
  
  // Actions pour les listes
  setLists: (lists: CompanyList[]) => void;
  fetchLists: () => Promise<void>;
  setActiveList: (listId: string | null) => void;
  selectList: (listId: string) => void;
  createList: (data: CreateCompanyListData) => Promise<CompanyList>;
  updateList: (data: UpdateCompanyListData) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  archiveList: (listId: string) => Promise<void>;
  
  // Actions pour les entreprises
  addCompaniesToList: (data: AddCompaniesToListData) => Promise<void>;
  removeCompanyFromList: (listId: string, companyId: string) => Promise<void>;
  importCompanies: (listId: string, filters: ImportFilters) => Promise<void>;
  updateCompanyStatus: (companyId: string, status: CompanyStatus) => Promise<void>;
  updateCompanyNotes: (companyId: string, notes: string) => Promise<void>;
  bulkAction: (data: BulkActionData) => Promise<void>;
  
  // Actions pour la sélection
  selectCompany: (companyId: string) => void;
  selectAllCompanies: (companyIds: string[]) => void;
  clearSelection: () => void;
  toggleCompanySelection: (companyId: string) => void;
  
  // Actions pour l'import
  setShowImportModal: (show: boolean) => void;
  setImportFilters: (filters: ImportFilters) => void;
  searchCompaniesForImport: (filters: ImportFilters) => Promise<Company[]>;
  
  // Actions utilitaires
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Getters calculés
  getActiveList: () => CompanyList | null;
  getListById: (listId: string) => CompanyList | null;
  getSelectedCompaniesCount: () => number;
  checkForDuplicates: (siren: string) => { listName: string; companyName: string }[];
}

export const useCompanyListsStore = create<CompanyListsState>()(
  devtools(
    persist(
      (set, get) => ({
        // État initial
        lists: [],
        currentList: null,
        activeListId: null,
        selectedCompanies: [],
        isLoading: false,
        error: null,
        showImportModal: false,
        importFilters: {},
        searchResults: [],
        searchLoading: false,

        // Actions pour les listes
        setLists: (lists) => set({ lists }),
        
        fetchLists: async () => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch('/api/company-lists');
            if (!response.ok) {
              throw new Error('Erreur lors de la récupération des listes');
            }
            const lists = await response.json();
            set({ lists, isLoading: false });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            set({ error: errorMessage, isLoading: false });
          }
        },
        
        setActiveList: (listId) => set({ activeListId: listId }),
        
        selectList: (listId) => {
          const { lists } = get();
          const list = lists.find(l => l.id === listId);
          set({ 
            activeListId: listId,
            currentList: list || null
          });
        },
        
        createList: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch('/api/company-lists', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            
            if (!response.ok) {
              throw new Error('Erreur lors de la création de la liste');
            }
            
            const newList = await response.json();
            const { lists } = get();
            
            set({ 
              lists: [...lists, newList],
              activeListId: newList.id,
              isLoading: false 
            });
            
            return newList;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },
        
        updateList: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`/api/company-lists/${data.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            
            if (!response.ok) {
              throw new Error('Erreur lors de la mise à jour de la liste');
            }
            
            const updatedList = await response.json();
            const { lists } = get();
            
            set({ 
              lists: lists.map(list => list.id === data.id ? updatedList : list),
              isLoading: false 
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },
        
        deleteList: async (listId) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`/api/company-lists/${listId}`, {
              method: 'DELETE',
            });
            
            if (!response.ok) {
              throw new Error('Erreur lors de la suppression de la liste');
            }
            
            const { lists, activeListId } = get();
            const newLists = lists.filter(list => list.id !== listId);
            const newActiveListId = activeListId === listId ? null : activeListId;
            
            set({ 
              lists: newLists,
              activeListId: newActiveListId,
              isLoading: false 
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },
        
        archiveList: async (listId) => {
          const { updateList } = get();
          await updateList({ id: listId, isArchived: true });
        },

        // Actions pour les entreprises
        addCompaniesToList: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch('/api/company-lists/add-companies', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            
            if (!response.ok) {
              throw new Error('Erreur lors de l\'ajout des entreprises');
            }
            
            // Recharger la liste mise à jour
            const updatedListResponse = await fetch(`/api/company-lists/${data.listId}`);
            const updatedList = await updatedListResponse.json();
            
            const { lists } = get();
            set({ 
              lists: lists.map(list => list.id === data.listId ? updatedList : list),
              isLoading: false 
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },
        
        removeCompanyFromList: async (listId, companyId) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`/api/company-lists/${listId}/companies/${companyId}`, {
              method: 'DELETE',
            });
            
            if (!response.ok) {
              throw new Error('Erreur lors de la suppression de l\'entreprise');
            }
            
            const { lists } = get();
            set({ 
              lists: lists.map(list => 
                list.id === listId 
                  ? { ...list, companies: list.companies.filter(c => c.id !== companyId) }
                  : list
              ),
              selectedCompanies: get().selectedCompanies.filter(id => id !== companyId),
              isLoading: false 
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },
        
        importCompanies: async (listId, filters) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch(`/api/company-lists/${listId}/import`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(filters),
            });
            
            if (!response.ok) {
              throw new Error('Erreur lors de l\'importation des entreprises');
            }
            
            const result = await response.json();
            
            // Recharger la liste mise à jour
            const { fetchLists } = get();
            await fetchLists();
            
            set({ isLoading: false });
            return result;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },
        
        updateCompanyStatus: async (companyId, status) => {
          try {
            const response = await fetch(`/api/companies/${companyId}/status`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status }),
            });
            
            if (!response.ok) {
              throw new Error('Erreur lors de la mise à jour du statut');
            }
            
            const { lists } = get();
            set({ 
              lists: lists.map(list => ({
                ...list,
                companies: list.companies.map(company => 
                  company.id === companyId ? { ...company, statut: status } : company
                )
              }))
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            set({ error: errorMessage });
            throw error;
          }
        },
        
        updateCompanyNotes: async (companyId, notes) => {
          try {
            const response = await fetch(`/api/companies/${companyId}/notes`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ notes }),
            });
            
            if (!response.ok) {
              throw new Error('Erreur lors de la mise à jour des notes');
            }
            
            const { lists } = get();
            set({ 
              lists: lists.map(list => ({
                ...list,
                companies: list.companies.map(company => 
                  company.id === companyId ? { ...company, notes } : company
                )
              }))
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            set({ error: errorMessage });
            throw error;
          }
        },
        
        bulkAction: async (data) => {
          set({ isLoading: true, error: null });
          try {
            const response = await fetch('/api/companies/bulk-action', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            
            if (!response.ok) {
              throw new Error('Erreur lors de l\'action en lot');
            }
            
            // Recharger les listes affectées
            const listsResponse = await fetch('/api/company-lists');
            const updatedLists = await listsResponse.json();
            
            set({ 
              lists: updatedLists,
              selectedCompanies: [],
              isLoading: false 
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            set({ error: errorMessage, isLoading: false });
            throw error;
          }
        },

        // Actions pour la sélection
        selectCompany: (companyId) => {
          set({ selectedCompanies: [companyId] });
        },
        
        selectAllCompanies: (companyIds) => {
          set({ selectedCompanies: companyIds });
        },
        
        clearSelection: () => {
          set({ selectedCompanies: [] });
        },
        
        toggleCompanySelection: (companyId) => {
          const { selectedCompanies } = get();
          const isSelected = selectedCompanies.includes(companyId);
          
          set({ 
            selectedCompanies: isSelected 
              ? selectedCompanies.filter(id => id !== companyId)
              : [...selectedCompanies, companyId]
          });
        },

        // Actions pour l'import
        setShowImportModal: (show) => set({ showImportModal: show }),
        
        setImportFilters: (filters) => set({ importFilters: filters }),
        
        searchCompaniesForImport: async (filters) => {
          set({ searchLoading: true, error: null });
          try {
            const response = await fetch('/api/companies/search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ filters }),
            });
            
            if (!response.ok) {
              throw new Error('Erreur lors de la recherche d\'entreprises');
            }
            
            const results = await response.json();
            set({ searchResults: results.companies, searchLoading: false });
            
            return results.companies;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
            set({ error: errorMessage, searchLoading: false });
            throw error;
          }
        },

        // Actions utilitaires
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),

        // Getters calculés
        getActiveList: () => {
          const { lists, activeListId } = get();
          return lists.find(list => list.id === activeListId) || null;
        },
        
        getListById: (listId) => {
          const { lists } = get();
          return lists.find(list => list.id === listId) || null;
        },
        
        getSelectedCompaniesCount: () => {
          return get().selectedCompanies.length;
        },
        
        checkForDuplicates: (siren) => {
          const { lists } = get();
          const duplicates: { listName: string; companyName: string }[] = [];
          
          lists.forEach(list => {
            list.companies.forEach(company => {
              if (company.siren === siren) {
                duplicates.push({
                  listName: list.name,
                  companyName: company.denomination
                });
              }
            });
          });
          
          return duplicates;
        },
      }),
      {
        name: 'company-lists-store',
        partialize: (state) => ({ 
          activeListId: state.activeListId,
          importFilters: state.importFilters 
        }),
      }
    )
  )
);
