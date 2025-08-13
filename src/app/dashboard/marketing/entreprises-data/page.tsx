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
  X
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

function CreateListModal({ isOpen, onClose, onListCreated }: CreateListModalProps) {
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
        color: color || undefined
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#2c3e50]">Créer une nouvelle liste</h2>
          <button onClick={onClose} className="text-[#7f8c8d] hover:text-[#2c3e50]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2c3e50] mb-2">
              Nom de la liste *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Prospects Fintech Paris"
              className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2c3e50] mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la liste et critères de ciblage"
              rows={3}
              className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2c3e50] mb-2">
              Couleur (optionnel)
            </label>
            <div className="flex gap-2 flex-wrap">
              {['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'].map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === colorOption ? 'border-gray-400 scale-110' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
              <button
                type="button"
                onClick={() => setColor('')}
                className={`w-8 h-8 rounded-full border-2 bg-gray-100 flex items-center justify-center transition-all ${
                  color === '' ? 'border-gray-400 scale-110' : 'border-gray-200 hover:border-gray-300'
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
              className="px-4 py-2 text-[#7f8c8d] hover:text-[#2c3e50] transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors"
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

function EditListModal({ isOpen, onClose, list, onListUpdated }: EditListModalProps) {
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
        color: color || undefined
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#2c3e50]">Modifier la liste</h2>
          <button onClick={onClose} className="text-[#7f8c8d] hover:text-[#2c3e50]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2c3e50] mb-2">
              Nom de la liste *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Prospects Fintech Paris"
              className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2c3e50] mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la liste et critères de ciblage"
              rows={3}
              className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2c3e50] mb-2">
              Couleur (optionnel)
            </label>
            <div className="flex gap-2 flex-wrap">
              {['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'].map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === colorOption ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
              <button
                type="button"
                onClick={() => setColor('')}
                className={`w-8 h-8 rounded-full border-2 bg-gray-100 ${
                  color === '' ? 'border-gray-400' : 'border-gray-200'
                }`}
              >
                <X className="h-4 w-4 text-gray-400 mx-auto" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[#7f8c8d] hover:text-[#2c3e50] transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors"
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
  const [importType, setImportType] = useState<'search' | 'csv' | 'siren' | 'linkedin'>('search');
  const [sirenList, setSirenList] = useState('');
  const [searchResults, setSearchResults] = useState<CompanySearchResult[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const { importCompanies } = useCompanyListsStore();

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

  const handleImport = async () => {
    if (!listId) return;

    try {
      if (importType === 'search' && selectedCompanies.length > 0) {
        // Import des entreprises sélectionnées depuis la base de données
        await importCompanies(listId, { companyIds: selectedCompanies });
      } else if (importType === 'siren' && sirenList.trim()) {
        const sirens = sirenList.split('\n').map(s => s.trim()).filter(s => s);
        await importCompanies(listId, { sirens });
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'importation:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#2c3e50]">Importer des entreprises</h2>
          <button onClick={onClose} className="text-[#7f8c8d] hover:text-[#2c3e50]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Choix du type d'import */}
          <div>
            <label className="block text-sm font-medium text-[#2c3e50] mb-3">Type d'importation</label>
            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => setImportType('search')}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  importType === 'search' 
                    ? 'border-[#3498db] bg-[#e8f4fd] text-[#3498db]' 
                    : 'border-[#bdc3c7] hover:border-[#95a5a6]'
                }`}
              >
                <Search className="h-5 w-5 mb-2" />
                <div className="font-medium">Recherche</div>
                <div className="text-xs text-[#7f8c8d]">Chercher dans la base</div>
              </button>

              <button
                onClick={() => setImportType('csv')}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  importType === 'csv' 
                    ? 'border-[#3498db] bg-[#e8f4fd] text-[#3498db]' 
                    : 'border-[#bdc3c7] hover:border-[#95a5a6]'
                }`}
              >
                <Upload className="h-5 w-5 mb-2" />
                <div className="font-medium">Fichier CSV</div>
                <div className="text-xs text-[#7f8c8d]">Importer depuis un fichier</div>
              </button>

              <button
                onClick={() => setImportType('siren')}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  importType === 'siren' 
                    ? 'border-[#3498db] bg-[#e8f4fd] text-[#3498db]' 
                    : 'border-[#bdc3c7] hover:border-[#95a5a6]'
                }`}
              >
                <Building2 className="h-5 w-5 mb-2" />
                <div className="font-medium">Liste SIREN</div>
                <div className="text-xs text-[#7f8c8d]">Coller une liste de SIREN</div>
              </button>

              <button
                onClick={() => setImportType('linkedin')}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  importType === 'linkedin' 
                    ? 'border-[#3498db] bg-[#e8f4fd] text-[#3498db]' 
                    : 'border-[#bdc3c7] hover:border-[#95a5a6]'
                }`}
              >
                <Globe className="h-5 w-5 mb-2" />
                <div className="font-medium">LinkedIn Sales</div>
                <div className="text-xs text-[#7f8c8d]">Importer depuis LinkedIn</div>
              </button>
            </div>
          </div>

          {/* Contenu selon le type */}
          {importType === 'search' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#ecf0f1] rounded-lg text-center text-[#7f8c8d]">
                Utilisez le bouton "Ajouter des entreprises" (icône +) sur les cartes de liste pour ouvrir la recherche avancée.
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
              <label className="block text-sm font-medium text-[#2c3e50] mb-2">
                Liste des SIREN/SIRET (un par ligne)
              </label>
              <textarea
                value={sirenList}
                onChange={(e) => setSirenList(e.target.value)}
                placeholder="123456789&#10;987654321&#10;..."
                rows={8}
                className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] font-mono text-sm"
              />
              <div className="text-xs text-[#7f8c8d] mt-1">
                {sirenList.split('\n').filter(s => s.trim()).length} identifiants détectés
              </div>
            </div>
          )}

          {importType === 'csv' && (
            <div>
              <div className="border-2 border-dashed border-[#bdc3c7] rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-[#7f8c8d] mx-auto mb-4" />
                <div className="text-lg font-medium text-[#2c3e50] mb-2">
                  Glissez votre fichier CSV ici
                </div>
                <div className="text-sm text-[#7f8c8d] mb-4">
                  ou cliquez pour sélectionner un fichier
                </div>
                <button className="px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors">
                  Choisir un fichier
                </button>
              </div>
              <div className="text-xs text-[#7f8c8d] mt-2">
                Formats acceptés: CSV avec colonnes SIREN, nom, adresse, etc.
              </div>
            </div>
          )}

          {importType === 'linkedin' && (
            <div className="bg-[#f8f9fa] p-4 rounded-lg">
              <div className="flex items-center gap-2 text-[#7f8c8d] mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Fonctionnalité en développement</span>
              </div>
              <div className="text-sm text-[#7f8c8d]">
                L'import depuis LinkedIn Sales Navigator sera bientôt disponible.
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[#7f8c8d] hover:text-[#2c3e50] transition-colors"
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
              className="px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importType === 'search' && selectedCompanies.length > 0 
                ? `Importer ${selectedCompanies.length} entreprise${selectedCompanies.length > 1 ? 's' : ''}`
                : 'Importer'
              }
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

function ListCard({ list, onSelect, onEdit, onDelete, onImport, onAddCompanies }: ListCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-white border border-[#bdc3c7] rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow relative ${
        list.color ? 'border-l-4' : ''
      }`}
      style={list.color ? { borderLeftColor: list.color } : {}}
      onClick={() => onSelect(list)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-[#3498db]" />
          <h3 className="font-medium text-[#2c3e50]">{list.name}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddCompanies(list.id);
            }}
            className="p-1 text-[#7f8c8d] hover:text-[#27ae60] transition-colors"
            title="Ajouter des entreprises"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onImport(list.id);
            }}
            className="p-1 text-[#7f8c8d] hover:text-[#3498db] transition-colors"
            title="Importer des entreprises"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(list);
            }}
            className="p-1 text-[#7f8c8d] hover:text-[#2c3e50] transition-colors"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(list.id);
            }}
            className="p-1 text-[#7f8c8d] hover:text-[#e74c3c] transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {list.description && (
        <p className="text-sm text-[#7f8c8d] mb-3 line-clamp-2">{list.description}</p>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-[#7f8c8d]">
            <Building2 className="h-4 w-4" />
            <span>{list._count?.companies || list.companies?.length || 0} entreprises</span>
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
              className="w-3 h-3 rounded-full border border-white shadow-sm flex-shrink-0"
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
    addCompaniesToList
  } = useCompanyListsStore();

  const [activeTab, setActiveTab] = useState<'all' | 'shared' | 'archived'>('all');
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
  const [newlyCreatedList, setNewlyCreatedList] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchLists();
    }
  }, [isLoaded, user, fetchLists]);

  const filteredLists = lists.filter(list => {
    const matchesSearch = list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (list.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
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
          statut: CompanyStatus.NEW
        }));

      await addCompaniesToList({
        listId: selectedList.id,
        companies: companiesData
      });
      setShowCompanySearchPopup(false);
      // Rediriger vers la liste
      selectList(selectedList.id);
      router.push(`/dashboard/marketing/entreprises-data/${selectedList.id}`);
    } catch (error) {
      console.error('Erreur lors de l\'ajout des entreprises:', error);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-[#ecf0f1] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3498db]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ecf0f1]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#bdc3c7] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2c3e50] font-montserrat">Listes d'entreprises</h1>
            <p className="text-[#7f8c8d] mt-1">
              Gérez vos listes d'entreprises pour vos campagnes marketing
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#7f8c8d]" />
              <input
                type="text"
                placeholder="Rechercher une liste..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-[#bdc3c7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] w-80"
              />
            </div>

            <Link
              href="/dashboard/marketing/entreprises-data/recherche"
              className="flex items-center gap-2 px-4 py-2 border border-[#3498db] text-[#3498db] rounded-lg hover:bg-[#3498db] hover:text-white transition-colors"
            >
              <Filter className="h-4 w-4" />
              Rechercher des entreprises
            </Link>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors"
            >
              <Plus className="h-4 w-4" />
              Créer une liste
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-[#bdc3c7] px-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'all'
                ? 'border-[#3498db] text-[#3498db]'
                : 'border-transparent text-[#7f8c8d] hover:text-[#2c3e50]'
            }`}
          >
            Toutes les listes ({lists.filter(l => !l.isArchived).length})
          </button>
          <button
            onClick={() => setActiveTab('shared')}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'shared'
                ? 'border-[#3498db] text-[#3498db]'
                : 'border-transparent text-[#7f8c8d] hover:text-[#2c3e50]'
            }`}
          >
            Partagées ({lists.filter(l => l.isShared && !l.isArchived).length})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3498db]"></div>
          </div>
        ) : filteredLists.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-[#ecf0f1] rounded-full flex items-center justify-center mb-6">
              <FolderOpen className="h-12 w-12 text-[#95a5a6]" />
            </div>
            <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">
              {searchQuery ? 'Aucune liste trouvée' : 'Aucune liste créée'}
            </h3>
            <p className="text-[#7f8c8d] mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'Essayez d\'ajuster votre recherche ou créez une nouvelle liste.'
                : 'Commencez par créer votre première liste d\'entreprises pour organiser vos campagnes marketing.'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors mx-auto"
            >
              <Plus className="h-5 w-5" />
              Créer ma première liste
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLists.map((list) => (
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
