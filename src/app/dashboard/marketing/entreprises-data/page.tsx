'use client';

import { CompanySearchPopup } from '@/components/CompanySearchPopup';
import { AddCompaniesDialog } from '@/components/ui/AddCompaniesDialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useCompanyListsStore } from '@/stores/company-lists';
import { CompanyList, CompanyStatus } from '@/types/company-lists';
import { CompanySearchResult, SearchCriteria } from '@/types/search-criteria';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  Building2,
  Calendar,
  Download,
  Edit3,
  Filter,
  FolderOpen,
  Globe,
  Plus,
  Search,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Composants pour les modales
interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListCreated?: (listId: string) => void;
}

function CreateListModal({
  isOpen,
  onClose,
  onListCreated,
}: CreateListModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const { createList } = useCompanyListsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const newList = await createList({
        name: name.trim(),
        description: description.trim() || undefined,
        color: color || undefined,
      });
      setName('');
      setDescription('');
      setColor('');
      onClose();

      // Proposer d'ajouter des entreprises avec popup personnalisée
      if (onListCreated && newList?.id) {
        setTimeout(() => {
          onListCreated(newList.id);
        }, 500);
      }
    } catch (error) {
      console.error('Erreur lors de la création de la liste:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-lg bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#2c3e50]">
            Créer une nouvelle liste
          </h2>
          <button
            onClick={onClose}
            className="text-[#7f8c8d] hover:text-[#2c3e50]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#2c3e50]">
              Nom de la liste *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Prospects Fintech Paris"
              className="w-full rounded-lg border border-[#bdc3c7] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3498db]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2c3e50]">
              Description (optionnel)
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description de la liste et critères de ciblage"
              rows={3}
              className="w-full rounded-lg border border-[#bdc3c7] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3498db]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2c3e50]">
              Couleur (optionnel)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                '#3498db',
                '#e74c3c',
                '#2ecc71',
                '#f39c12',
                '#9b59b6',
                '#1abc9c',
                '#e67e22',
                '#34495e',
              ].map(colorOption => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    color === colorOption
                      ? 'scale-110 border-gray-400'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
              <button
                type="button"
                onClick={() => setColor('')}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 bg-gray-100 transition-all ${
                  color === ''
                    ? 'scale-110 border-gray-400'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#7f8c8d] transition-colors hover:text-[#2c3e50]"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#3498db] px-4 py-2 text-white transition-colors hover:bg-[#2980b9]"
            >
              Créer la liste
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Modal d'édition de liste
interface EditListModalProps {
  isOpen: boolean;
  onClose: () => void;
  list: CompanyList | null;
  onListUpdated?: () => void;
}

function EditListModal({
  isOpen,
  onClose,
  list,
  onListUpdated,
}: EditListModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('');
  const { updateList } = useCompanyListsStore();

  // Pré-remplir les champs quand la liste change
  useEffect(() => {
    if (list) {
      setName(list.name || '');
      setDescription(list.description || '');
      setColor(list.color || '');
    }
  }, [list]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !list) return;

    try {
      await updateList({
        id: list.id,
        name: name.trim(),
        description: description.trim() || undefined,
        color: color || undefined,
      });
      onClose();

      if (onListUpdated) {
        onListUpdated();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la liste:', error);
    }
  };

  if (!isOpen || !list) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-lg bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#2c3e50]">
            Modifier la liste
          </h2>
          <button
            onClick={onClose}
            className="text-[#7f8c8d] hover:text-[#2c3e50]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#2c3e50]">
              Nom de la liste *
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Prospects Fintech Paris"
              className="w-full rounded-lg border border-[#bdc3c7] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3498db]"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2c3e50]">
              Description (optionnel)
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description de la liste et critères de ciblage"
              rows={3}
              className="w-full rounded-lg border border-[#bdc3c7] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3498db]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2c3e50]">
              Couleur (optionnel)
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                '#3498db',
                '#e74c3c',
                '#2ecc71',
                '#f39c12',
                '#9b59b6',
                '#1abc9c',
                '#e67e22',
                '#34495e',
              ].map(colorOption => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`h-8 w-8 rounded-full border-2 ${
                    color === colorOption
                      ? 'border-gray-400'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
              <button
                type="button"
                onClick={() => setColor('')}
                className={`h-8 w-8 rounded-full border-2 bg-gray-100 ${
                  color === '' ? 'border-gray-400' : 'border-gray-200'
                }`}
              >
                <X className="mx-auto h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#7f8c8d] transition-colors hover:text-[#2c3e50]"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#3498db] px-4 py-2 text-white transition-colors hover:bg-[#2980b9]"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId?: string;
}

function ImportModal({ isOpen, onClose, listId }: ImportModalProps) {
  const [importType, setImportType] = useState<
    'search' | 'csv' | 'siren' | 'linkedin'
  >('search');
  const [sirenList, setSirenList] = useState('');
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const { importCompanies } = useCompanyListsStore();

  const handleAdvancedSearch = async (
    criteria: SearchCriteria,
    page: number = 1
  ) => {
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
      });

      searchParams.append('page', page.toString());
      searchParams.append('limit', '20');

      const response = await fetch(
        `/api/company-search?${searchParams.toString()}`
      );
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

  const handleImport = async () => {
    if (!listId) return;

    try {
      if (importType === 'search' && selectedCompanies.length > 0) {
        // Import des entreprises sélectionnées depuis la base de données
        await importCompanies(listId, { companyIds: selectedCompanies });
      } else if (importType === 'siren' && sirenList.trim()) {
        const sirens = sirenList
          .split('\n')
          .map(s => s.trim())
          .filter(s => s);
        await importCompanies(listId, { sirens });
      }
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'importation:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl rounded-lg bg-white p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#2c3e50]">
            Importer des entreprises
          </h2>
          <button
            onClick={onClose}
            className="text-[#7f8c8d] hover:text-[#2c3e50]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Choix du type d'import */}
          <div>
            <label className="mb-3 block text-sm font-medium text-[#2c3e50]">
              Type d'importation
            </label>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => setImportType('search')}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  importType === 'search'
                    ? 'border-[#3498db] bg-[#e8f4fd] text-[#3498db]'
                    : 'border-[#bdc3c7] hover:border-[#95a5a6]'
                }`}
              >
                <Search className="mb-2 h-5 w-5" />
                <div className="font-medium">Recherche</div>
                <div className="text-xs text-[#7f8c8d]">
                  Chercher dans la base
                </div>
              </button>

              <button
                onClick={() => setImportType('csv')}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  importType === 'csv'
                    ? 'border-[#3498db] bg-[#e8f4fd] text-[#3498db]'
                    : 'border-[#bdc3c7] hover:border-[#95a5a6]'
                }`}
              >
                <Upload className="mb-2 h-5 w-5" />
                <div className="font-medium">Fichier CSV</div>
                <div className="text-xs text-[#7f8c8d]">
                  Importer depuis un fichier
                </div>
              </button>

              <button
                onClick={() => setImportType('siren')}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  importType === 'siren'
                    ? 'border-[#3498db] bg-[#e8f4fd] text-[#3498db]'
                    : 'border-[#bdc3c7] hover:border-[#95a5a6]'
                }`}
              >
                <Building2 className="mb-2 h-5 w-5" />
                <div className="font-medium">Liste SIREN</div>
                <div className="text-xs text-[#7f8c8d]">
                  Coller une liste de SIREN
                </div>
              </button>

              <button
                onClick={() => setImportType('linkedin')}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  importType === 'linkedin'
                    ? 'border-[#3498db] bg-[#e8f4fd] text-[#3498db]'
                    : 'border-[#bdc3c7] hover:border-[#95a5a6]'
                }`}
              >
                <Globe className="mb-2 h-5 w-5" />
                <div className="font-medium">LinkedIn Sales</div>
                <div className="text-xs text-[#7f8c8d]">
                  Importer depuis LinkedIn
                </div>
              </button>
            </div>
          </div>

          {/* Contenu selon le type */}
          {importType === 'search' && (
            <div className="space-y-6">
              <div className="rounded-lg bg-[#ecf0f1] p-4 text-center text-[#7f8c8d]">
                Utilisez le bouton "Ajouter des entreprises" (icône +) sur les
                cartes de liste pour ouvrir la recherche avancée.
              </div>
              {/* TODO: Réintégrer AdvancedSearch et CompanySearchResults si nécessaire */}
              {/* 
              <AdvancedSearch 
                onSearch={handleAdvancedSearch} 
                isSearching={isSearching} 
              />

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
              */}
            </div>
          )}

          {importType === 'siren' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2c3e50]">
                Liste des SIREN/SIRET (un par ligne)
              </label>
              <textarea
                value={sirenList}
                onChange={e => setSirenList(e.target.value)}
                placeholder="123456789&#10;987654321&#10;..."
                rows={8}
                className="w-full rounded-lg border border-[#bdc3c7] px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#3498db]"
              />
              <div className="mt-1 text-xs text-[#7f8c8d]">
                {sirenList.split('\n').filter(s => s.trim()).length}{' '}
                identifiants détectés
              </div>
            </div>
          )}

          {importType === 'csv' && (
            <div>
              <div className="rounded-lg border-2 border-dashed border-[#bdc3c7] p-8 text-center">
                <Upload className="mx-auto mb-4 h-12 w-12 text-[#7f8c8d]" />
                <div className="mb-2 text-lg font-medium text-[#2c3e50]">
                  Glissez votre fichier CSV ici
                </div>
                <div className="mb-4 text-sm text-[#7f8c8d]">
                  ou cliquez pour sélectionner un fichier
                </div>
                <button className="rounded-lg bg-[#3498db] px-4 py-2 text-white transition-colors hover:bg-[#2980b9]">
                  Choisir un fichier
                </button>
              </div>
              <div className="mt-2 text-xs text-[#7f8c8d]">
                Formats acceptés: CSV avec colonnes SIREN, nom, adresse, etc.
              </div>
            </div>
          )}

          {importType === 'linkedin' && (
            <div className="rounded-lg bg-[#f8f9fa] p-4">
              <div className="mb-2 flex items-center gap-2 text-[#7f8c8d]">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Fonctionnalité en développement</span>
              </div>
              <div className="text-sm text-[#7f8c8d]">
                L'import depuis LinkedIn Sales Navigator sera bientôt
                disponible.
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[#7f8c8d] transition-colors hover:text-[#2c3e50]"
            >
              Annuler
            </button>
            <button
              onClick={handleImport}
              disabled={
                importType === 'linkedin' ||
                (importType === 'siren' && !sirenList.trim()) ||
                (importType === 'search' && selectedCompanies.length === 0)
              }
              className="rounded-lg bg-[#3498db] px-4 py-2 text-white transition-colors hover:bg-[#2980b9] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {importType === 'search' && selectedCompanies.length > 0
                ? `Importer ${selectedCompanies.length} entreprise${selectedCompanies.length > 1 ? 's' : ''}`
                : 'Importer'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Composant pour une carte de liste
interface ListCardProps {
  list: CompanyList;
  onSelect: (list: CompanyList) => void;
  onEdit: (list: CompanyList) => void;
  onDelete: (listId: string) => void;
  onImport: (listId: string) => void;
  onAddCompanies: (listId: string) => void;
}

function ListCard({
  list,
  onSelect,
  onEdit,
  onDelete,
  onImport,
  onAddCompanies,
}: ListCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`relative cursor-pointer rounded-lg border border-[#bdc3c7] bg-white p-4 transition-shadow hover:shadow-md ${
        list.color ? 'border-l-4' : ''
      }`}
      style={list.color ? { borderLeftColor: list.color } : {}}
      onClick={() => onSelect(list)}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-[#3498db]" />
          <h3 className="font-medium text-[#2c3e50]">{list.name}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={e => {
              e.stopPropagation();
              onAddCompanies(list.id);
            }}
            className="p-1 text-[#7f8c8d] transition-colors hover:text-[#27ae60]"
            title="Ajouter des entreprises"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onImport(list.id);
            }}
            className="p-1 text-[#7f8c8d] transition-colors hover:text-[#3498db]"
            title="Importer des entreprises"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onEdit(list);
            }}
            className="p-1 text-[#7f8c8d] transition-colors hover:text-[#2c3e50]"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete(list.id);
            }}
            className="p-1 text-[#7f8c8d] transition-colors hover:text-[#e74c3c]"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {list.description && (
        <p className="mb-3 line-clamp-2 text-sm text-[#7f8c8d]">
          {list.description}
        </p>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-[#7f8c8d]">
            <Building2 className="h-4 w-4" />
            <span>
              {list._count?.companies || list.companies?.length || 0}{' '}
              entreprises
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#7f8c8d]">
            <Calendar className="h-4 w-4" />
            <span>{new Date(list.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {list.isShared && (
            <div className="flex items-center gap-1 text-[#27ae60]">
              <Users className="h-4 w-4" />
              <span>Partagée</span>
            </div>
          )}
          {list.color && (
            <div
              className="h-3 w-3 flex-shrink-0 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: list.color }}
              title="Couleur de la liste"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function CompanyListsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const {
    lists,
    currentList,
    isLoading,
    fetchLists,
    selectList,
    deleteList,
    createList,
    importCompanies,
    addCompaniesToList,
  } = useCompanyListsStore();

  const [activeTab, setActiveTab] = useState<'all' | 'shared' | 'archived'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [listToEdit, setListToEdit] = useState<CompanyList | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCompanySearchPopup, setShowCompanySearchPopup] = useState(false);
  const [selectedList, setSelectedList] = useState<CompanyList | null>(null);

  // États pour les popups personnalisées
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [showAddCompaniesDialog, setShowAddCompaniesDialog] = useState(false);
  const [newlyCreatedList, setNewlyCreatedList] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchLists();
    }
  }, [isLoaded, user, fetchLists]);

  const filteredLists = lists.filter(list => {
    const matchesSearch =
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (list.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false);

    switch (activeTab) {
      case 'shared':
        return matchesSearch && list.isShared;
      case 'archived':
        return matchesSearch && list.isArchived;
      default:
        return matchesSearch && !list.isArchived;
    }
  });

  const handleSelectList = (list: CompanyList) => {
    router.push(`/dashboard/marketing/entreprises-data/${list.id}`);
  };

  const handleEditList = (list: CompanyList) => {
    setListToEdit(list);
    setShowEditModal(true);
  };

  const handleDeleteList = async (listId: string) => {
    setListToDelete(listId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteList = async () => {
    if (listToDelete) {
      await deleteList(listToDelete);
      setListToDelete(null);
    }
  };

  const onListCreatedWithDialog = (listId: string) => {
    const createdList = lists.find(l => l.id === listId);
    if (createdList) {
      setNewlyCreatedList({ id: createdList.id, name: createdList.name });
      setShowAddCompaniesDialog(true);
    }
  };

  const handleAddCompaniesAfterCreate = () => {
    if (newlyCreatedList) {
      const list = lists.find(l => l.id === newlyCreatedList.id);
      if (list) {
        setSelectedList(list);
        setShowCompanySearchPopup(true);
        setNewlyCreatedList(null);
      }
    }
  };

  const handleImportToList = (listId: string) => {
    const list = lists.find(l => l.id === listId);
    if (list) {
      setSelectedList(list);
      setShowCompanySearchPopup(true);
    }
  };

  const handleCompanySearchForList = (list: CompanyList) => {
    setSelectedList(list);
    setShowCompanySearchPopup(true);
  };

  const handleAddCompaniesToList = async (companies: CompanySearchResult[]) => {
    if (!selectedList || companies.length === 0) return;

    try {
      // Convertir les CompanySearchResult en format attendu par l'API
      const companiesData = companies
        .filter(company => company.siret) // Filtrer les entreprises avec siret valide
        .map(company => ({
          siren: company.siren,
          siret: company.siret!,
          statut: CompanyStatus.NEW,
        }));

      await addCompaniesToList({
        listId: selectedList.id,
        companies: companiesData,
      });
      setShowCompanySearchPopup(false);
      // Rediriger vers la liste
      selectList(selectedList.id);
      router.push(`/dashboard/marketing/entreprises-data/${selectedList.id}`);
    } catch (error) {
      console.error("Erreur lors de l'ajout des entreprises:", error);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#ecf0f1]">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#3498db]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ecf0f1]">
      {/* Header */}
      <header className="border-b border-[#bdc3c7] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-montserrat text-2xl font-bold text-[#2c3e50]">
              Listes d'entreprises
            </h1>
            <p className="mt-1 text-[#7f8c8d]">
              Gérez vos listes d'entreprises pour vos campagnes marketing
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#7f8c8d]" />
              <input
                type="text"
                placeholder="Rechercher une liste..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-80 rounded-lg border border-[#bdc3c7] py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#3498db]"
              />
            </div>

            <Link
              href="/dashboard/marketing/entreprises-data/recherche"
              className="flex items-center gap-2 rounded-lg border border-[#3498db] px-4 py-2 text-[#3498db] transition-colors hover:bg-[#3498db] hover:text-white"
            >
              <Filter className="h-4 w-4" />
              Rechercher des entreprises
            </Link>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 rounded-lg bg-[#3498db] px-4 py-2 text-white transition-colors hover:bg-[#2980b9]"
            >
              <Plus className="h-4 w-4" />
              Créer une liste
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-[#bdc3c7] bg-white px-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`border-b-2 px-2 py-4 text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'border-[#3498db] text-[#3498db]'
                : 'border-transparent text-[#7f8c8d] hover:text-[#2c3e50]'
            }`}
          >
            Toutes les listes ({lists.filter(l => !l.isArchived).length})
          </button>
          <button
            onClick={() => setActiveTab('shared')}
            className={`border-b-2 px-2 py-4 text-sm font-medium transition-colors ${
              activeTab === 'shared'
                ? 'border-[#3498db] text-[#3498db]'
                : 'border-transparent text-[#7f8c8d] hover:text-[#2c3e50]'
            }`}
          >
            Partagées ({lists.filter(l => l.isShared && !l.isArchived).length})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`border-b-2 px-2 py-4 text-sm font-medium transition-colors ${
              activeTab === 'archived'
                ? 'border-[#3498db] text-[#3498db]'
                : 'border-transparent text-[#7f8c8d] hover:text-[#2c3e50]'
            }`}
          >
            Archivées ({lists.filter(l => l.isArchived).length})
          </button>
        </nav>
      </div>

      {/* Contenu principal */}
      <main className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#3498db]"></div>
          </div>
        ) : filteredLists.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#ecf0f1]">
              <FolderOpen className="h-12 w-12 text-[#95a5a6]" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[#2c3e50]">
              {searchQuery ? 'Aucune liste trouvée' : 'Aucune liste créée'}
            </h3>
            <p className="mx-auto mb-6 max-w-md text-[#7f8c8d]">
              {searchQuery
                ? "Essayez d'ajuster votre recherche ou créez une nouvelle liste."
                : "Commencez par créer votre première liste d'entreprises pour organiser vos campagnes marketing."}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mx-auto flex items-center gap-2 rounded-lg bg-[#3498db] px-6 py-3 text-white transition-colors hover:bg-[#2980b9]"
            >
              <Plus className="h-5 w-5" />
              Créer ma première liste
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredLists.map(list => (
              <ListCard
                key={list.id}
                list={list}
                onSelect={handleSelectList}
                onEdit={handleEditList}
                onDelete={handleDeleteList}
                onImport={handleImportToList}
                onAddCompanies={handleImportToList}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modales */}
      <CreateListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onListCreated={onListCreatedWithDialog}
      />

      <EditListModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setListToEdit(null);
        }}
        list={listToEdit}
        onListUpdated={() => {
          fetchLists(); // Rafraîchir la liste
        }}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        listId={selectedList?.id}
      />

      {/* Company Search Popup */}
      {showCompanySearchPopup && (
        <CompanySearchPopup
          isOpen={showCompanySearchPopup}
          onClose={() => setShowCompanySearchPopup(false)}
          onAddToList={handleAddCompaniesToList}
          listName={selectedList?.name}
        />
      )}

      {/* Popups personnalisées */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteList}
        title="Supprimer la liste"
        message="Êtes-vous sûr de vouloir supprimer cette liste ? Cette action est irréversible et supprimera également toutes les entreprises associées."
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />

      <AddCompaniesDialog
        isOpen={showAddCompaniesDialog}
        onClose={() => setShowAddCompaniesDialog(false)}
        onAddCompanies={handleAddCompaniesAfterCreate}
        listName={newlyCreatedList?.name || ''}
      />
    </div>
  );
}
