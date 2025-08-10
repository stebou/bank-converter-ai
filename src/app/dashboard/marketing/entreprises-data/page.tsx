'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Suspense } from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Upload, 
  HelpCircle, 
  Filter,
  ChevronDown,
  MoreHorizontal,
  Building2,
  MapPin,
  Users,
  Calendar,
  Tag,
  Target,
  Folder,
  ExternalLink,
  Edit3,
  Trash2,
  Archive,
  X,
  ChevronUp,
  Settings,
  Save,
  Share2,
  Eye,
  EyeOff,
  Building,
  Globe,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  Linkedin,
  Link,
  FileText,
  BarChart3
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompanyData, type EnrichedCompany, type CompanyFilters } from '@/hooks/useCompanyData';

// Types pour les vues sauvegardées
interface SavedView {
  id: string;
  name: string;
  filters: CompanyFilters;
  isPublic: boolean;
  createdBy: string;
}

interface KPIData {
  totalCompanies: number;
  activeCompanies: number;
  withLinkedin: number;
  averageScore: number;
  topSectors: Array<{ naf: string; label: string; count: number }>;
}

// Mock KPIs pour la démonstration
const mockKPIs: KPIData = {
  totalCompanies: 31000000,
  activeCompanies: 28500000,
  withLinkedin: 2100000,
  averageScore: 74.2,
  topSectors: [
    { naf: '62.01Z', label: 'Programmation informatique', count: 485000 },
    { naf: '73.11Z', label: 'Activités des agences de publicité', count: 125000 },
    { naf: '66.12Z', label: 'Courtage de valeurs mobilières', count: 85000 }
  ]
};

const nafCodes = [
  { code: '62.01Z', label: 'Programmation informatique' },
  { code: '73.11Z', label: 'Activités des agences de publicité' },
  { code: '66.12Z', label: 'Courtage de valeurs mobilières et de marchandises' },
  { code: '70.22Z', label: 'Conseil pour les affaires et autres conseils de gestion' },
  { code: '82.99Z', label: 'Autres services de soutien aux entreprises' }
];

const regions = [
  'Île-de-France',
  'Auvergne-Rhône-Alpes',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Hauts-de-France',
  'Grand Est',
  'Provence-Alpes-Côte d\'Azur',
  'Pays de la Loire',
  'Normandie',
  'Bretagne'
];

function CompaniesSkeleton() {
  return (
    <div className="space-y-6 p-8">
      <div className="h-8 w-64 rounded bg-[#bdc3c7]"></div>
      <div className="h-12 w-full rounded bg-[#bdc3c7]"></div>
      <div className="h-32 w-full rounded bg-[#bdc3c7]"></div>
      <div className="h-96 w-full rounded bg-[#bdc3c7]"></div>
    </div>
  );
}

export default function CompaniesDataPage() {
  const { user, isLoaded } = useUser();
  
  // Hook pour les données d'entreprises avec recherche en temps réel
  const {
    companies: filteredCompanies,
    allCompanies,
    isLoading,
    error,
    total,
    searchQuery,
    lastSearchTime,
    searchInRealTime,
    clearResults,
    exportToCSV,
    validateIdentifier,
    stats
  } = useCompanyData({
    enableRealTimeSearch: true,
    searchDebounceMs: 500
  });
  
  // États locaux
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<EnrichedCompany | null>(null);
  const [showKPIs, setShowKPIs] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [activeView, setActiveView] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<Array<{ time: string; message: string; type: 'info' | 'success' | 'error' }>>([]);

  // Ajouter un log à l'historique
  const addLog = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const newLog = {
      time: new Date().toLocaleTimeString('fr-FR'),
      message,
      type
    };
    setLogs(prev => [newLog, ...prev.slice(0, 9)]); // Garder les 10 derniers logs
  }, []);

  // Observer les changements pour ajouter des logs
  useEffect(() => {
    if (isLoading && searchQuery) {
      addLog(`Recherche en cours pour "${searchQuery}"`, 'info');
    }
  }, [isLoading, searchQuery, addLog]);

  useEffect(() => {
    if (!isLoading && searchQuery && filteredCompanies.length > 0) {
      addLog(`${filteredCompanies.length} résultat(s) trouvé(s)`, 'success');
    }
  }, [isLoading, searchQuery, filteredCompanies.length, addLog]);
  // Filtres
  const [filters, setFilters] = useState<CompanyFilters>({
    status: [],
    nafCodes: [],
    effectifs: [],
    regions: [],
    departments: [],
    headOfficeOnly: false,
    hasLinkedin: false,
    hasWebsite: false,
    scoreRange: {}
  });

  // Options de tri et groupement
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'score',
    direction: 'desc'
  });
  const [groupBy, setGroupBy] = useState<string>('');

  if (!isLoaded) {
    return <CompaniesSkeleton />;
  }

  if (!user) {
    redirect('/sign-in');
    return null;
  }

  // Fonctions API (supprimées car gérées par le hook useCompanyData)

  // Fonctions utilitaires
  const getStatusColor = (status: 'A' | 'F'): string => {
    const colors = {
      'A': 'bg-[#2ecc71] text-white',
      'F': 'bg-[#e74c3c] text-white'
    };
    return colors[status] || 'bg-[#95a5a6] text-white';
  };

  const getStatusLabel = (status: 'A' | 'F'): string => {
    const labels = {
      'A': 'Actif',
      'F': 'Fermé'
    };
    return labels[status] || status;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-[#2ecc71]';
    if (score >= 60) return 'text-[#f39c12]';
    return 'text-[#e74c3c]';
  };

  const formatHeadcount = (headcount?: string): string => {
    if (!headcount) return 'Non renseigné';
    const labels: Record<string, string> = {
      '00': 'Aucun salarié',
      '01': '1-2 salariés',
      '02': '3-5 salariés',
      '03': '6-9 salariés',
      '11': '10-19 salariés',
      '12': '20-49 salariés',
      '21': '50-99 salariés',
      '22': '100-199 salariés',
      '31': '200-249 salariés',
      '32': '250-499 salariés',
      '41': '500-999 salariés',
      '42': '1000-1999 salariés',
      '51': '2000-4999 salariés',
      '52': '5000-9999 salariés',
      '53': '10000+ salariés'
    };
    return labels[headcount] || headcount;
  };

  // Gestion des actions
  const handleCompanySelect = (siren: string) => {
    const company = filteredCompanies.find(c => c.siren === siren);
    if (company) {
      setSelectedCompany(company);
      setShowDetailsPanel(true);
    }
  };

  const addToCampaign = (companySirens: string[]) => {
    console.log('Ajouter à la campagne:', companySirens);
    // Logique pour ajouter les entreprises à une campagne
  };

  return (
    <div className="min-h-screen bg-[#ecf0f1]">
      <Suspense fallback={<CompaniesSkeleton />}>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-[#bdc3c7] p-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-[#2c3e50] font-montserrat">
                  Base entreprises · {filteredCompanies.length.toLocaleString()}
                </h1>
                {isLoading && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#3498db]"></div>
                )}
                {process.env.NEXT_PUBLIC_INSEE_API_KEY && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#e8f6f3] text-[#27ae60] rounded-full text-sm">
                    <CheckCircle className="h-4 w-4" />
                    API INSEE configurée
                  </div>
                )}
                {lastSearchTime && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#e3f2fd] text-[#1976d2] rounded-full text-sm">
                    <Clock className="h-4 w-4" />
                    Dernière recherche: {lastSearchTime.toLocaleTimeString()}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Recherche globale avec recherche en temps réel */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#7f8c8d]" />
                  <input
                    type="text"
                    placeholder="Nom, SIREN/SIRET..."
                    value={searchQuery}
                    onChange={(e) => searchInRealTime(e.target.value)}
                    className="pl-10 pr-12 py-2 border border-[#bdc3c7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] w-80"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearResults}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#7f8c8d] hover:text-[#e74c3c] transition-colors"
                      title="Effacer les résultats"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Actions rapides */}
                <motion.button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Filter className="h-4 w-4" />
                  Filtre avancé
                </motion.button>

                <button className="flex items-center gap-2 px-4 py-2 border border-[#bdc3c7] rounded-lg hover:bg-[#ecf0f1] transition-colors">
                  <Upload className="h-4 w-4" />
                  Importer SIREN
                </button>

                <button className="p-2 border border-[#bdc3c7] rounded-lg hover:bg-[#ecf0f1] transition-colors">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Filtres et vues */}
          <div className="bg-white border-b border-[#bdc3c7] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    showFilters ? 'bg-[#3498db] text-white' : 'border border-[#bdc3c7] hover:bg-[#ecf0f1]'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  Filtres
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="px-3 py-2 border border-[#bdc3c7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                >
                  <option value="">Aucun groupement</option>
                  <option value="naf">Grouper par NAF</option>
                  <option value="region">Grouper par région</option>
                  <option value="headcount">Grouper par effectif</option>
                  <option value="status">Grouper par statut</option>
                </select>

                <select
                  value={`${sortBy.field}-${sortBy.direction}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSortBy({ field, direction: direction as 'asc' | 'desc' });
                  }}
                  className="px-3 py-2 border border-[#bdc3c7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                >
                  <option value="score-desc">Score ↓</option>
                  <option value="score-asc">Score ↑</option>
                  <option value="name-asc">Nom A→Z</option>
                  <option value="name-desc">Nom Z→A</option>
                  <option value="creationDate-desc">Création ↓</option>
                  <option value="creationDate-asc">Création ↑</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-[#7f8c8d]">Vues sauvegardées:</span>
                <button className="px-3 py-1 text-sm bg-[#e8f4fd] text-[#3498db] rounded-lg hover:bg-[#d4e6f1]">
                  Fintech IDF
                </button>
                <button className="px-3 py-1 text-sm border border-[#bdc3c7] rounded-lg hover:bg-[#ecf0f1]">
                  PME Marketing
                </button>
                <button className="p-1 text-[#7f8c8d] hover:text-[#2c3e50]">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Panneau de filtres */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                >
                  {/* Filtre statut */}
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">Statut</label>
                    <select className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg text-sm">
                      <option>Tous les statuts</option>
                      <option>Actif</option>
                      <option>Fermé</option>
                      <option>Suspendu</option>
                    </select>
                  </div>

                  {/* Filtre forme juridique */}
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">Forme juridique</label>
                    <select className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg text-sm">
                      <option>Toutes formes</option>
                      <option>SA</option>
                      <option>SAS</option>
                      <option>SARL</option>
                      <option>SASU</option>
                    </select>
                  </div>

                  {/* Filtre NAF */}
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">Secteur (NAF)</label>
                    <select className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg text-sm">
                      <option>Tous secteurs</option>
                      {nafCodes.map(naf => (
                        <option key={naf.code} value={naf.code}>
                          {naf.code} - {naf.label.substring(0, 20)}...
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filtre effectif */}
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">Effectif</label>
                    <select className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg text-sm">
                      <option>Tous effectifs</option>
                      <option>1-9 salariés</option>
                      <option>10-49 salariés</option>
                      <option>50-99 salariés</option>
                      <option>100-249 salariés</option>
                      <option>250+ salariés</option>
                    </select>
                  </div>

                  {/* Filtre région */}
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">Région</label>
                    <select className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg text-sm">
                      <option>Toutes régions</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  {/* Options spéciales */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">Options</label>
                    <div className="space-y-2">
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={filters.headOfficeOnly}
                          onChange={(e) => setFilters(prev => ({ ...prev, headOfficeOnly: e.target.checked }))}
                          className="mr-2"
                        />
                        Siège uniquement
                      </label>
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={filters.hasLinkedin}
                          onChange={(e) => setFilters(prev => ({ ...prev, hasLinkedin: e.target.checked }))}
                          className="mr-2"
                        />
                        Avec LinkedIn
                      </label>
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={filters.hasWebsite}
                          onChange={(e) => setFilters(prev => ({ ...prev, hasWebsite: e.target.checked }))}
                          className="mr-2"
                        />
                        Avec site web
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* KPIs */}
          <AnimatePresence>
            {showKPIs && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white border-b border-[#bdc3c7] p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#2c3e50]">Vue d'ensemble</h3>
                  <button
                    onClick={() => setShowKPIs(false)}
                    className="p-1 text-[#7f8c8d] hover:text-[#2c3e50]"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="bg-[#e8f4fd] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-[#3498db]">{total.toLocaleString()}</div>
                    <div className="text-sm text-[#7f8c8d]">Total résultats</div>
                  </div>

                  <div className="bg-[#e8f6f3] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-[#27ae60]">{stats.active.toLocaleString()}</div>
                    <div className="text-sm text-[#7f8c8d]">Entreprises actives</div>
                  </div>

                  <div className="bg-[#f0f8ff] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-[#2980b9]">{stats.withLinkedin.toLocaleString()}</div>
                    <div className="text-sm text-[#7f8c8d]">Avec LinkedIn</div>
                  </div>

                  <div className="bg-[#faf7f0] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-[#f39c12]">{stats.averageScore}</div>
                    <div className="text-sm text-[#7f8c8d]">Score moyen</div>
                  </div>

                  <div className="bg-[#f8f9fa] p-4 rounded-lg">
                    <div className="text-lg font-bold text-[#2c3e50]">Top secteurs</div>
                    <div className="text-xs text-[#7f8c8d] space-y-1 mt-2">
                      {mockKPIs.topSectors.slice(0, 2).map(sector => (
                        <div key={sector.naf}>
                          {sector.label.substring(0, 15)}... ({sector.count.toLocaleString()})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showKPIs && (
            <div className="bg-white border-b border-[#bdc3c7] p-2">
              <button
                onClick={() => setShowKPIs(true)}
                className="text-sm text-[#3498db] hover:text-[#2980b9] flex items-center gap-1"
              >
                <ChevronDown className="h-4 w-4" />
                Afficher la vue d'ensemble
              </button>
            </div>
          )}

          {/* Contenu principal */}
          <div className="flex-1 flex overflow-hidden">
            {/* Table des entreprises */}
            <div className={`flex-1 overflow-auto ${showDetailsPanel ? 'mr-96' : ''} transition-all duration-300`}>
              <div className="bg-white">
                {/* Message d'aide pour la recherche en temps réel */}
                {!searchQuery && filteredCompanies.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-[#e3f2fd] to-[#f3e5f5] border border-[#bbdefb] rounded-lg p-6 m-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-[#2196f3] p-2 rounded-lg">
                        <Search className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#1565c0] mb-2">
                          Recherche en temps réel activée
                        </h3>
                        <p className="text-[#1976d2] mb-4">
                          Tapez simplement le nom d'une entreprise, un SIREN ou SIRET pour voir les résultats s'afficher automatiquement.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-[#1976d2]">
                            <Building2 className="h-4 w-4" />
                            <span>Recherche par nom d'entreprise</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#1976d2]">
                            <FileText className="h-4 w-4" />
                            <span>SIREN (9 chiffres) ou SIRET (14 chiffres)</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#1976d2]">
                            <BarChart3 className="h-4 w-4" />
                            <span>Résultats limités à 5 pour un aperçu rapide</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Indicateur de recherche en cours */}
                {isLoading && searchQuery && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border border-[#bbdefb] rounded-lg p-4 m-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2196f3]"></div>
                      <span className="text-[#1976d2]">
                        Recherche en cours pour "{searchQuery}"...
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Message d'état pour les résultats */}
                {searchQuery && !isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border border-[#c8e6c9] rounded-lg p-4 m-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-[#4caf50]" />
                        <span className="text-[#2e7d32]">
                          {filteredCompanies.length > 0 
                            ? `${filteredCompanies.length} résultat${filteredCompanies.length > 1 ? 's' : ''} trouvé${filteredCompanies.length > 1 ? 's' : ''} pour "${searchQuery}"`
                            : `Aucun résultat pour "${searchQuery}"`
                          }
                        </span>
                      </div>
                      {total > filteredCompanies.length && (
                        <span className="text-sm text-[#666] bg-[#f5f5f5] px-2 py-1 rounded">
                          {total - filteredCompanies.length} autres disponibles
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}

                {filteredCompanies.length === 0 ? (
                  /* État vide */
                  <div className="text-center py-16">
                    <div className="mx-auto w-24 h-24 bg-[#ecf0f1] rounded-full flex items-center justify-center mb-6">
                      <Building2 className="h-12 w-12 text-[#95a5a6]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">
                      {searchQuery || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : typeof f === 'boolean' ? f : f !== 'all' && f !== '' && Object.keys(f).length > 0)
                        ? 'Aucune entreprise trouvée'
                        : 'Base d\'entreprises vide'
                      }
                    </h3>
                    <p className="text-[#7f8c8d] mb-6 max-w-md mx-auto">
                      {searchQuery || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : typeof f === 'boolean' ? f : f !== 'all' && f !== '' && Object.keys(f).length > 0)
                        ? 'Essayez d\'ajuster vos critères de recherche ou de supprimer certains filtres.'
                        : 'Commencez par importer des entreprises ou connectez l\'API INSEE Sirene.'
                      }
                    </p>
                    <div className="flex justify-center gap-4">
                      <button className="flex items-center gap-2 px-6 py-3 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors">
                        <Upload className="h-5 w-5" />
                        Importer SIREN/SIRET
                      </button>
                      <button className="flex items-center gap-2 px-6 py-3 border border-[#bdc3c7] rounded-lg hover:bg-[#ecf0f1] transition-colors">
                        <Settings className="h-5 w-5" />
                        Connecter API INSEE
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Table des entreprises */
                  <div className="overflow-x-auto">
                    <table role="grid" className="w-full">
                      <thead className="bg-[#f8f9fa] border-b border-[#bdc3c7]">
                        <tr>
                          <th className="px-4 py-3 text-left">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCompanies(filteredCompanies.map(c => c.siren));
                                } else {
                                  setSelectedCompanies([]);
                                }
                              }}
                              checked={selectedCompanies.length === filteredCompanies.length && filteredCompanies.length > 0}
                            />
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Entreprise</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">SIREN</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Siège</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">NAF</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Effectif</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Localisation</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Statut</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">LinkedIn</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Score</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCompanies.map((company, index) => (
                          <tr
                            key={company.siret}
                            className={`border-b border-[#ecf0f1] hover:bg-[#f8f9fa] cursor-pointer transition-colors ${
                              selectedCompany?.siren === company.siren ? 'bg-[#e8f4fd]' : ''
                            }`}
                            onClick={() => handleCompanySelect(company.siren)}
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedCompanies.includes(company.siren)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (e.target.checked) {
                                    setSelectedCompanies([...selectedCompanies, company.siren]);
                                  } else {
                                    setSelectedCompanies(selectedCompanies.filter(siren => siren !== company.siren));
                                  }
                                }}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-[#7f8c8d]" />
                                <div>
                                  <div className="font-medium text-[#2c3e50]">{company.denomination}</div>
                                  {company.domain && (
                                    <div className="text-xs text-[#7f8c8d] flex items-center gap-1">
                                      <Globe className="h-3 w-3" />
                                      {company.domain}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-[#7f8c8d]">{company.siren}</td>
                            <td className="px-4 py-3">
                              {company.siege ? (
                                <span className="inline-flex items-center px-2 py-1 text-xs bg-[#e8f4fd] text-[#3498db] rounded-full">
                                  <Building2 className="h-3 w-3 mr-1" />
                                  Siège
                                </span>
                              ) : (
                                <span className="text-xs text-[#7f8c8d]">Établissement</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-[#2c3e50]">{company.activitePrincipale}</div>
                              <div className="text-xs text-[#7f8c8d]">{company.activitePrincipaleLibelle?.substring(0, 25)}...</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 text-sm text-[#7f8c8d]">
                                <Users className="h-4 w-4" />
                                {formatHeadcount(company.trancheEffectifs)}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 text-sm text-[#7f8c8d]">
                                <MapPin className="h-4 w-4" />
                                <div>
                                  <div>{company.adresse.libelleCommuneEtablissement}</div>
                                  <div className="text-xs">{company.adresse.codePostal}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(company.etatAdministratif)}`}>
                                {getStatusLabel(company.etatAdministratif)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {company.linkedin?.organizationUrn ? (
                                <div className="flex items-center gap-1">
                                  <Linkedin className="h-4 w-4 text-[#0077b5]" />
                                  <span className="text-xs text-[#7f8c8d]">
                                    {company.linkedin.followerCount?.toLocaleString()} followers
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-[#95a5a6]">Non trouvé</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className={`text-sm font-medium ${getScoreColor(company.score)}`}>
                                  {company.score}
                                </div>
                                <div className="w-12 bg-[#ecf0f1] rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${
                                      company.score >= 80 ? 'bg-[#2ecc71]' : 
                                      company.score >= 60 ? 'bg-[#f39c12]' : 'bg-[#e74c3c]'
                                    }`}
                                    style={{ width: `${company.score}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Menu d'actions
                                }}
                                className="p-1 hover:bg-[#ecf0f1] rounded"
                              >
                                <MoreHorizontal className="h-4 w-4 text-[#7f8c8d]" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Panneau de détail */}
            <AnimatePresence>
              {showDetailsPanel && selectedCompany && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="w-96 bg-white border-l border-[#bdc3c7] overflow-y-auto"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-[#2c3e50]">Fiche entreprise</h2>
                      <button
                        onClick={() => setShowDetailsPanel(false)}
                        className="p-1 hover:bg-[#ecf0f1] rounded"
                      >
                        <X className="h-5 w-5 text-[#7f8c8d]" />
                      </button>
                    </div>

                    {/* Identité INSEE/Sirene */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-[#2c3e50] mb-3 flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Identité
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-[#2c3e50]">Raison sociale</span>
                            <p className="text-sm text-[#7f8c8d]">{selectedCompany.denomination}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-sm font-medium text-[#2c3e50]">SIREN</span>
                              <p className="text-sm font-mono text-[#7f8c8d]">{selectedCompany.siren}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-[#2c3e50]">SIRET</span>
                              <p className="text-sm font-mono text-[#7f8c8d]">{selectedCompany.siret}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-[#2c3e50]">Catégorie juridique</span>
                            <p className="text-sm text-[#7f8c8d]">{selectedCompany.categorieJuridique}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-[#2c3e50]">NAF</span>
                            <p className="text-sm text-[#7f8c8d]">{selectedCompany.activitePrincipale} - {selectedCompany.activitePrincipaleLibelle}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-[#2c3e50]">Effectif</span>
                            <p className="text-sm text-[#7f8c8d]">{formatHeadcount(selectedCompany.trancheEffectifs)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Adresse */}
                      <div>
                        <h3 className="font-medium text-[#2c3e50] mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Localisation
                        </h3>
                        <div className="space-y-2">
                          {selectedCompany.adresse.numeroVoie && selectedCompany.adresse.libelleVoie && (
                            <p className="text-sm text-[#7f8c8d]">
                              {selectedCompany.adresse.numeroVoie} {selectedCompany.adresse.typeVoie} {selectedCompany.adresse.libelleVoie}
                            </p>
                          )}
                          <p className="text-sm text-[#7f8c8d]">
                            {selectedCompany.adresse.codePostal} {selectedCompany.adresse.libelleCommuneEtablissement}
                          </p>
                          <p className="text-sm text-[#7f8c8d]">Département: {selectedCompany.adresse.codeCommuneEtablissement?.substring(0, 2)}</p>
                        </div>
                      </div>

                      {/* Contact */}
                      <div>
                        <h3 className="font-medium text-[#2c3e50] mb-3 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Contact
                        </h3>
                        <div className="space-y-2">
                          {selectedCompany.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-3 w-3 text-[#7f8c8d]" />
                              <span className="text-sm text-[#7f8c8d]">{selectedCompany.phone}</span>
                            </div>
                          )}
                          {selectedCompany.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-[#7f8c8d]" />
                              <span className="text-sm text-[#7f8c8d]">{selectedCompany.email}</span>
                            </div>
                          )}
                          {selectedCompany.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-3 w-3 text-[#7f8c8d]" />
                              <a 
                                href={selectedCompany.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-[#3498db] hover:underline"
                              >
                                {selectedCompany.domain}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* LinkedIn */}
                      {selectedCompany.linkedin?.organizationUrn && (
                        <div>
                          <h3 className="font-medium text-[#2c3e50] mb-3 flex items-center gap-2">
                            <Linkedin className="h-4 w-4 text-[#0077b5]" />
                            LinkedIn
                          </h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[#7f8c8d]">Followers</span>
                              <span className="text-sm font-medium text-[#2c3e50]">
                                {selectedCompany.linkedin.followerCount?.toLocaleString()}
                              </span>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#0077b5] text-white rounded-lg hover:bg-[#005582] transition-colors">
                              <ExternalLink className="h-4 w-4" />
                              Ouvrir sur LinkedIn
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Score */}
                      <div>
                        <h3 className="font-medium text-[#2c3e50] mb-3 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Score de ciblage
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-[#7f8c8d]">Score global</span>
                            <span className={`text-lg font-bold ${getScoreColor(selectedCompany.score)}`}>
                              {selectedCompany.score}/100
                            </span>
                          </div>
                          <div className="w-full bg-[#ecf0f1] rounded-full h-3">
                            <div
                              className={`h-3 rounded-full ${
                                selectedCompany.score >= 80 ? 'bg-[#2ecc71]' : 
                                selectedCompany.score >= 60 ? 'bg-[#f39c12]' : 'bg-[#e74c3c]'
                              }`}
                              style={{ width: `${selectedCompany.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Étiquettes */}
                      {selectedCompany.tags.length > 0 && (
                        <div>
                          <h3 className="font-medium text-[#2c3e50] mb-3 flex items-center gap-2">
                            <Tag className="h-4 w-4" />
                            Étiquettes
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedCompany.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs bg-[#ecf0f1] text-[#7f8c8d] rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Conformité */}
                      <div>
                        <h3 className="font-medium text-[#2c3e50] mb-3 flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Conformité & provenance
                        </h3>
                        <div className="space-y-2 text-xs text-[#7f8c8d]">
                          <p>Source : INSEE Sirene V3 - {new Date(selectedCompany.dateDerniereMiseAJour).toLocaleDateString('fr-FR')}</p>
                          <p>Données conformes RGPD et Loi Lemaire</p>
                          <a 
                            href={`https://www.sirene.fr/sirene/public/recherche?sirene=${selectedCompany.siren}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#3498db] hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Voir sur sirene.fr
                          </a>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t border-[#ecf0f1]">
                        <button
                          onClick={() => addToCampaign([selectedCompany.siren])}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                          Ajouter à une campagne
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Barre d'actions bulk */}
          <AnimatePresence>
            {selectedCompanies.length > 0 && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="bg-[#2c3e50] text-white p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm">
                    {selectedCompanies.length} entreprise{selectedCompanies.length > 1 ? 's' : ''} sélectionnée{selectedCompanies.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToCampaign(selectedCompanies)}
                    className="px-4 py-2 bg-[#3498db] hover:bg-[#2980b9] rounded text-sm transition-colors"
                  >
                    Ajouter à une campagne
                  </button>

                  <button className="px-3 py-1 bg-[#34495e] hover:bg-[#4a5d70] rounded text-sm transition-colors">
                    Étiqueter
                  </button>

                  <button
                    onClick={() => exportToCSV()}
                    className="px-3 py-1 bg-[#27ae60] hover:bg-[#229954] rounded text-sm transition-colors"
                  >
                    Exporter CSV
                  </button>

                  <button
                    onClick={() => setSelectedCompanies([])}
                    className="p-1 hover:bg-[#34495e] rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Panneau de logs en temps réel */}
          <AnimatePresence>
            {showLogs && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 200, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-[#2c3e50] border-t border-[#34495e] text-white overflow-hidden"
              >
                <div className="p-3 border-b border-[#34495e] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-sm font-medium">Logs de recherche en temps réel</span>
                  </div>
                  <button
                    onClick={() => setShowLogs(false)}
                    className="text-[#95a5a6] hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-3 space-y-1 overflow-y-auto max-h-40">
                  {logs.length === 0 ? (
                    <p className="text-[#95a5a6] text-sm">Aucun log pour le moment. Essayez de faire une recherche...</p>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="text-xs flex items-start gap-2">
                        <span className="text-[#95a5a6] font-mono">{log.time}</span>
                        <span className={`flex-1 ${
                          log.type === 'success' ? 'text-[#2ecc71]' : 
                          log.type === 'error' ? 'text-[#e74c3c]' : 
                          'text-[#ecf0f1]'
                        }`}>
                          {log.message}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bouton flottant pour afficher les logs */}
          <motion.button
            onClick={() => setShowLogs(!showLogs)}
            className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-colors z-40 ${
              showLogs 
                ? 'bg-[#e74c3c] hover:bg-[#c0392b] text-white' 
                : 'bg-[#3498db] hover:bg-[#2980b9] text-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={showLogs ? 'Masquer les logs' : 'Afficher les logs'}
          >
            {showLogs ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            {logs.length > 0 && !showLogs && (
              <span className="absolute -top-1 -right-1 bg-[#e74c3c] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {logs.length}
              </span>
            )}
          </motion.button>
        </div>
      </Suspense>
    </div>
  );
}
