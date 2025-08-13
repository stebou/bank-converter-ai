'use client';

import { AdvancedSearch } from '@/components/AdvancedSearch';
import { CompanySearchResults } from '@/components/CompanySearchResults';
import { useCompanyListsStore } from '@/stores/company-lists';
import { CompanySearchResult, SearchCriteria } from '@/types/search-criteria';
import { motion } from 'framer-motion';
import { ArrowLeft, Building2, Download, Filter, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CompanySearchPage() {
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  
  const { lists, createList, importCompanies } = useCompanyListsStore();

  const handleAdvancedSearch = async (criteria: SearchCriteria, page: number = 1) => {
    setIsSearching(true);
    setSearchCriteria(criteria);
    setCurrentPage(page);
    
    try {
      const searchParams = new URLSearchParams();
      
      // Ajouter les critères aux paramètres de recherche
      Object.entries(criteria).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'object') {
            // Pour les objets comme dateCreation, chiffreAffaires, etc.
            Object.entries(value).forEach(([subKey, subValue]) => {
              if (subValue !== undefined && subValue !== null && subValue !== '') {
                searchParams.append(`${key}.${subKey}`, String(subValue));
              }
            });
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
      
      searchParams.append('page', page.toString());
      searchParams.append('limit', '20');

      const response = await fetch(`/api/company-search?${searchParams.toString()}`);
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Réponse API reçue:', data);
        setSearchResults(data.results || []);
        setTotalResults(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
        setCurrentPage(data.pagination?.page || 1);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handlePageChange = (page: number) => {
    handleAdvancedSearch(searchCriteria, page);
  };

  const toggleCompanySelection = (companyId: string) => {
    setSelectedCompanies(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  const handleSelectAll = () => {
    const allIds = searchResults.map(company => company.siren);
    setSelectedCompanies(allIds);
  };

  const handleDeselectAll = () => {
    setSelectedCompanies([]);
  };

  const handleCreateNewList = async () => {
    if (!newListName.trim() || selectedCompanies.length === 0) return;

    try {
      const newList = await createList({
        name: newListName,
        description: newListDescription || `Liste créée depuis la recherche d'entreprises - ${selectedCompanies.length} entreprises sélectionnées`
      });

      // Importer les entreprises sélectionnées dans la nouvelle liste
      await importCompanies(newList.id, { companyIds: selectedCompanies });

      // Réinitialiser
      setShowCreateListModal(false);
      setNewListName('');
      setNewListDescription('');
      setSelectedCompanies([]);
      
      alert(`Liste "${newListName}" créée avec ${selectedCompanies.length} entreprises !`);
    } catch (error) {
      console.error('Erreur lors de la création de la liste:', error);
      alert('Erreur lors de la création de la liste');
    }
  };

  const handleAddToExistingList = async (listId: string) => {
    if (selectedCompanies.length === 0) return;

    try {
      await importCompanies(listId, { companyIds: selectedCompanies });
      setSelectedCompanies([]);
      
      const list = lists.find(l => l.id === listId);
      alert(`${selectedCompanies.length} entreprises ajoutées à la liste "${list?.name}" !`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout à la liste:', error);
      alert('Erreur lors de l\'ajout à la liste');
    }
  };

  const exportToCsv = () => {
    if (selectedCompanies.length === 0) {
      alert('Veuillez sélectionner au moins une entreprise à exporter');
      return;
    }

    const selectedResults = searchResults.filter(company => 
      selectedCompanies.includes(company.siren)
    );

    const csvContent = [
      // En-têtes
      ['SIREN', 'SIRET', 'Dénomination', 'Activité', 'Code Postal', 'Ville', 'Département', 'Région', 'Effectifs', 'Date de création', 'État'].join(','),
      // Données
      ...selectedResults.map(company => [
        company.siren,
        company.siret || '',
        `"${company.denomination}"`,
        `"${company.activitePrincipaleLibelle}"`,
        company.adresse.codePostal,
        `"${company.adresse.commune}"`,
        company.adresse.departement,
        `"${company.adresse.region}"`,
        `"${company.trancheEffectifsLibelle || ''}"`,
        company.dateCreation,
        company.etatAdministratif === 'A' ? 'Actif' : 'Fermé'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `entreprises_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/marketing/entreprises-data"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Retour aux listes</span>
              </Link>
              <div className="h-6 border-l border-gray-300"></div>
              <div className="flex items-center gap-2">
                <Search className="h-6 w-6 text-[#3498db]" />
                <h1 className="text-xl font-semibold text-[#2c3e50]">
                  Recherche d'entreprises
                </h1>
              </div>
            </div>

            {/* Actions pour les entreprises sélectionnées */}
            {selectedCompanies.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedCompanies.length} sélectionnée(s)
                </span>
                
                <button
                  onClick={exportToCsv}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Download className="h-4 w-4" />
                  Exporter CSV
                </button>

                {/* Menu déroulant pour ajouter à une liste existante */}
                {lists.length > 0 && (
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddToExistingList(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm hover:bg-gray-50"
                    >
                      <option value="">Ajouter à une liste</option>
                      {lists.map(list => (
                        <option key={list.id} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={() => setShowCreateListModal(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#3498db] text-white text-sm rounded-lg hover:bg-[#2980b9]"
                >
                  <Plus className="h-4 w-4" />
                  Créer une liste
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar avec les filtres */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-[#3498db]" />
                <h2 className="font-semibold text-[#2c3e50]">Filtres de recherche</h2>
              </div>
              <AdvancedSearch 
                onSearch={handleAdvancedSearch} 
                isSearching={isSearching} 
              />
            </div>
          </div>

          {/* Zone des résultats */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {searchResults.length === 0 && !isSearching ? (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Recherchez des entreprises
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Utilisez les filtres à gauche pour trouver des entreprises selon vos critères.
                  </p>
                  <div className="text-sm text-gray-400">
                    💡 Astuce : Commencez par une recherche simple avec le nom ou la ville, puis affinez avec les filtres avancés.
                  </div>
                </div>
              ) : (
                <CompanySearchResults
                  results={searchResults}
                  selectedCompanies={selectedCompanies}
                  onCompanySelect={toggleCompanySelection}
                  onSelectAll={handleSelectAll}
                  onDeselectAll={handleDeselectAll}
                  isLoading={isSearching}
                  totalResults={totalResults}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de création de liste */}
      {showCreateListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">
              Créer une nouvelle liste
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la liste
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Ex: Entreprises Tech Lyon"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optionnelle)
                </label>
                <textarea
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="Description des critères de sélection..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                />
              </div>
              <div className="text-sm text-gray-600">
                {selectedCompanies.length} entreprise(s) seront ajoutées à cette liste.
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowCreateListModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateNewList}
                disabled={!newListName.trim() || selectedCompanies.length === 0}
                className="px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer la liste
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
