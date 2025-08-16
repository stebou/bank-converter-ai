'use client';

import { CompanySearchResult, SearchCriteria } from '@/types/search-criteria';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Info,
  MapPin,
  Plus,
  Search,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface CompanySearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToList: (companies: CompanySearchResult[]) => void;
  listName?: string;
}

export function CompanySearchPopup({
  isOpen,
  onClose,
  onAddToList,
  listName,
}: CompanySearchPopupProps) {
  const [activeTab, setActiveTab] = useState<'companies' | 'people'>(
    'companies'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanies, setSelectedCompanies] = useState<
    CompanySearchResult[]
  >([]);
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<
    Record<string, boolean>
  >({
    sirene: true,
    contacts: false,
    signals: false,
    company: false,
  });

  // Critères de recherche
  const [filters, setFilters] = useState<SearchCriteria>({});

  const handleSearch = async () => {
    if (!searchQuery.trim() && Object.keys(filters).length === 0) return;

    setIsSearching(true);
    try {
      const searchParams = new URLSearchParams();

      // Envoyer la requête simple pour que la route API la traite
      if (searchQuery.trim()) {
        searchParams.append('q', searchQuery.trim());
      }

      // Ajouter les filtres spécifiques SIRENE avec les bons noms de paramètres
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          switch (key) {
            case 'activitePrincipale':
              if (value)
                searchParams.append('activitePrincipale', String(value));
              break;
            case 'codePostal':
              if (value) searchParams.append('codePostal', String(value));
              break;
            case 'commune':
              if (value) searchParams.append('commune', String(value));
              break;
            case 'departement':
              if (value) searchParams.append('departement', String(value));
              break;
            case 'trancheEffectifs':
              if (value) searchParams.append('trancheEffectifs', String(value));
              break;
            case 'etatAdministratif':
              if (value)
                searchParams.append('etatAdministratif', String(value));
              break;
            case 'categorieJuridique':
              if (value)
                searchParams.append('categorieJuridique', String(value));
              break;
            case 'dateCreationDebut':
              if (value)
                searchParams.append('dateCreationDebut', String(value));
              break;
            case 'dateCreationFin':
              if (value) searchParams.append('dateCreationFin', String(value));
              break;
            case 'siret':
              if (value) searchParams.append('siret', String(value));
              break;
            default:
              // Pour les autres filtres, les traiter comme des filtres génériques
              if (typeof value === 'object') {
                Object.entries(value).forEach(([subKey, subValue]) => {
                  if (
                    subValue !== undefined &&
                    subValue !== null &&
                    subValue !== ''
                  ) {
                    searchParams.append(`${key}.${subKey}`, String(subValue));
                  }
                });
              } else {
                searchParams.append(key, String(value));
              }
          }
        }
      });

      // Définir le nombre de résultats (max 1000 selon la doc SIRENE)
      searchParams.append('nombre', '20');

      const response = await fetch(
        `/api/company-search?${searchParams.toString()}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Réponse API reçue:', data);

        // Notre API retourne toujours un format { results: [...] }
        if (data.results && Array.isArray(data.results)) {
          setSearchResults(data.results);
          console.log(
            `📊 Nombre d'entreprises trouvées: ${data.results.length}`
          );
        } else {
          console.warn('⚠️ Format de réponse inattendu:', data);
          setSearchResults([]);
        }
      } else {
        console.error(
          '❌ Erreur API SIRENE:',
          response.status,
          response.statusText
        );
        const errorText = await response.text();
        console.error("Détails de l'erreur:", errorText);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche SIRENE:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const toggleFilter = (section: string) => {
    setExpandedFilters(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleCompanySelection = (company: CompanySearchResult) => {
    setSelectedCompanies(prev => {
      const isSelected = prev.some(c => c.siren === company.siren);
      if (isSelected) {
        return prev.filter(c => c.siren !== company.siren);
      } else {
        return [...prev, company];
      }
    });
  };

  const handleAddSelected = () => {
    onAddToList(selectedCompanies);
    setSelectedCompanies([]);
  };

  useEffect(() => {
    if (searchQuery || Object.keys(filters).length > 0) {
      const debounceTimer = setTimeout(handleSearch, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchQuery, filters]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-white">
        {/* Header */}
        <div className="bg-[#2563eb] p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="rounded-lg p-2 transition-colors hover:bg-[#1d4ed8]"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                <h1 className="text-xl font-semibold">
                  Recherche d'entreprises
                </h1>
                {listName && (
                  <span className="text-blue-200">→ {listName}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {selectedCompanies.length > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-blue-200">
                    {selectedCompanies.length} sélectionnée(s)
                  </span>
                  <button
                    onClick={handleAddSelected}
                    className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-[#2563eb] transition-colors hover:bg-blue-50"
                  >
                    <Plus className="h-4 w-4" />
                    Ajouter à la liste
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-1">
            <button
              onClick={() => setActiveTab('companies')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                activeTab === 'companies'
                  ? 'bg-white text-[#2563eb]'
                  : 'text-blue-200 hover:bg-[#1d4ed8]'
              }`}
            >
              <Building2 className="h-4 w-4" />
              Entreprises
            </button>
            <button
              onClick={() => setActiveTab('people')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
                activeTab === 'people'
                  ? 'bg-white text-[#2563eb]'
                  : 'text-blue-200 hover:bg-[#1d4ed8]'
              }`}
            >
              <Users className="h-4 w-4" />
              Contacts
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(100vh-140px)]">
          {/* Sidebar Filters */}
          <div className="w-80 overflow-y-auto border-r border-gray-200 bg-gray-50">
            <div className="p-4">
              <h2 className="mb-4 font-semibold text-gray-900">Filtres</h2>

              {/* Bouton de réinitialisation des filtres */}
              {Object.keys(filters).length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => setFilters({})}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-800"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              )}

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Filtres de recherche..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>

              {/* Filtres SIRENE */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter('sirene')}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#2563eb]" />
                    <span className="font-medium">Critères SIRENE</span>
                  </div>
                  {expandedFilters.sirene ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {expandedFilters.sirene && (
                  <div className="mt-2 space-y-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Code postal
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 75001"
                        value={filters.codePostal || ''}
                        onChange={e =>
                          setFilters(prev => ({
                            ...prev,
                            codePostal: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Commune
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: PARIS"
                        value={filters.commune || ''}
                        onChange={e =>
                          setFilters(prev => ({
                            ...prev,
                            commune: e.target.value.toUpperCase(),
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Activité principale (NAF)
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 62.01Z"
                        value={filters.activitePrincipale || ''}
                        onChange={e =>
                          setFilters(prev => ({
                            ...prev,
                            activitePrincipale: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Tranche d'effectifs
                      </label>
                      <select
                        value={filters.trancheEffectifs || ''}
                        onChange={e =>
                          setFilters(prev => ({
                            ...prev,
                            trancheEffectifs: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                      >
                        <option value="">Toutes les tranches</option>
                        <option value="00">0 salarié</option>
                        <option value="01">1 ou 2 salariés</option>
                        <option value="02">3 à 5 salariés</option>
                        <option value="03">6 à 9 salariés</option>
                        <option value="11">10 à 19 salariés</option>
                        <option value="12">20 à 49 salariés</option>
                        <option value="21">50 à 99 salariés</option>
                        <option value="22">100 à 199 salariés</option>
                        <option value="31">200 à 249 salariés</option>
                        <option value="32">250 à 499 salariés</option>
                        <option value="41">500 à 999 salariés</option>
                        <option value="42">1000 à 1999 salariés</option>
                        <option value="51">2000 à 4999 salariés</option>
                        <option value="52">5000 à 9999 salariés</option>
                        <option value="53">10000 salariés et plus</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        État administratif
                      </label>
                      <select
                        value={filters.etatAdministratif || ''}
                        onChange={e =>
                          setFilters(prev => ({
                            ...prev,
                            etatAdministratif: e.target.value as
                              | 'A'
                              | 'F'
                              | undefined,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                      >
                        <option value="">Tous les états</option>
                        <option value="A">Actif</option>
                        <option value="F">Fermé</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Catégorie juridique
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 5710 (SAS)"
                        value={filters.categorieJuridique || ''}
                        onChange={e =>
                          setFilters(prev => ({
                            ...prev,
                            categorieJuridique: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Date de création (début)
                      </label>
                      <input
                        type="date"
                        value={filters.dateCreationDebut || ''}
                        onChange={e =>
                          setFilters(prev => ({
                            ...prev,
                            dateCreationDebut: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Date de création (fin)
                      </label>
                      <input
                        type="date"
                        value={filters.dateCreationFin || ''}
                        onChange={e =>
                          setFilters(prev => ({
                            ...prev,
                            dateCreationFin: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Département
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 75 (Paris)"
                        value={filters.departement || ''}
                        onChange={e =>
                          setFilters(prev => ({
                            ...prev,
                            departement: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        SIRET
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: 12345678901234"
                        value={filters.siret || ''}
                        onChange={e =>
                          setFilters(prev => ({
                            ...prev,
                            siret: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Contacts limités */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter('contacts')}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#2563eb]" />
                    <span className="font-medium">Contacts limités</span>
                  </div>
                  {expandedFilters.contacts ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {expandedFilters.contacts && (
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center gap-2 rounded p-2 hover:bg-gray-50">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">
                        Pas encore dans toutes les entreprises
                      </span>
                    </label>
                    <label className="flex items-center gap-2 rounded p-2 hover:bg-gray-50">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Listes des entreprises</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Signaux & Intentions */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter('signals')}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[#2563eb]" />
                    <span className="font-medium">Signaux & Intentions</span>
                  </div>
                  {expandedFilters.signals ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {expandedFilters.signals && (
                  <div className="mt-2 space-y-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Croissance de la taille de l'entreprise (3 m).
                      </label>
                      <input
                        type="range"
                        className="w-full"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Date du dernier financement de l'entreprise
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Revenu de l'entreprise
                      </label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]">
                        <option>Sélectionner...</option>
                        <option>0-1M €</option>
                        <option>1-10M €</option>
                        <option>10-50M €</option>
                        <option>50M+ €</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Mot-clé dans l'entreprise
                      </label>
                      <input
                        type="text"
                        placeholder="fintech, intelligence artificielle..."
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Informations sur l'entreprise */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter('company')}
                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-[#2563eb]" />
                    <span className="font-medium">
                      Informations sur l'entreprise
                    </span>
                  </div>
                  {expandedFilters.company ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {expandedFilters.company && (
                  <div className="mt-2 space-y-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Taille de l'entreprise
                      </label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]">
                        <option>Toutes les tailles</option>
                        <option>1-10 employés</option>
                        <option>11-50 employés</option>
                        <option>51-200 employés</option>
                        <option>201-1000 employés</option>
                        <option>1000+ employés</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Secteur de l'entreprise
                      </label>
                      <input
                        type="text"
                        placeholder="Rechercher un secteur..."
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Marché de l'entreprise
                      </label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]">
                        <option>Tous les marchés</option>
                        <option>B2B</option>
                        <option>B2C</option>
                        <option>B2B2C</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Type d'entreprise
                      </label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]">
                        <option>Tous les types</option>
                        <option>Startup</option>
                        <option>PME</option>
                        <option>Grande entreprise</option>
                        <option>Association</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Nom de l'entreprise
                      </label>
                      <input
                        type="text"
                        placeholder="Nom exact ou partiel..."
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Année de fondation de l'entreprise
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Depuis"
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                        />
                        <input
                          type="number"
                          placeholder="Jusqu'à"
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Pays de l'entreprise
                      </label>
                      <select className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-[#2563eb]">
                        <option>France</option>
                        <option>Belgique</option>
                        <option>Suisse</option>
                        <option>Canada</option>
                        <option>Autre...</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {isSearching ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#2563eb]"></div>
                  <span className="ml-3 text-gray-600">
                    Recherche en cours...
                  </span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
                    <Building2 className="h-12 w-12 text-[#2563eb]" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    Base de données des entreprises
                  </h3>
                  <p className="mb-4 text-gray-500">
                    Pour commencer, appliquez un filtre à la base de données.
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>People</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#2563eb]">
                      <Building2 className="h-4 w-4" />
                      <span>Entreprises</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {searchResults.length} entreprise
                      {searchResults.length > 1 ? 's' : ''} trouvée
                      {searchResults.length > 1 ? 's' : ''}
                    </h3>
                    <button
                      onClick={() => setSelectedCompanies(searchResults)}
                      className="text-sm text-[#2563eb] hover:underline"
                    >
                      Tout sélectionner
                    </button>
                  </div>

                  <div className="grid gap-4">
                    {searchResults.map(company => (
                      <motion.div
                        key={company.siret || company.siren}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`cursor-pointer rounded-lg border p-4 transition-all ${
                          selectedCompanies.some(c => c.siren === company.siren)
                            ? 'border-[#2563eb] bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleCompanySelection(company)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {selectedCompanies.some(
                              c => c.siren === company.siren
                            ) ? (
                              <div className="flex h-5 w-5 items-center justify-center rounded bg-[#2563eb]">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            ) : (
                              <div className="h-5 w-5 rounded border-2 border-gray-300"></div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="mb-1 font-semibold text-gray-900">
                                  {company.denomination}
                                </h4>
                                <p className="mb-1 text-sm text-gray-600">
                                  {company.activitePrincipaleLibelle}
                                </p>
                                <p className="mb-2 text-xs text-gray-500">
                                  SIREN: {company.siren}{' '}
                                  {company.siret && `| SIRET: ${company.siret}`}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span>
                                      {company.adresse.commune}
                                      {company.adresse.departement &&
                                        `, ${company.adresse.departement}`}
                                      {company.adresse.codePostal &&
                                        ` (${company.adresse.codePostal})`}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <span>
                                      {company.trancheEffectifsLibelle ||
                                        'Non précisé'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {company.dateCreation
                                        ? new Date(
                                            company.dateCreation
                                          ).getFullYear()
                                        : 'N/A'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <div
                                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                                    company.etatAdministratif === 'A'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {company.etatAdministratif === 'A'
                                    ? 'Actif'
                                    : 'Fermé'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
