'use client';

import { useCompanyListsStore } from '@/stores/company-lists';
import { CompanyList } from '@/types/company-lists';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    Building2,
    Calendar,
    Edit3,
    FolderOpen,
    Globe,
    Plus,
    Search,
    Trash2,
    Upload,
    Users,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';

// Composants pour les modales
interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateListModal({ isOpen, onClose }: CreateListModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createList } = useCompanyListsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await createList({
        name: name.trim(),
        description: description.trim() || undefined
      });
      setName('');
      setDescription('');
      onClose();
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

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId?: string;
}

function ImportModal({ isOpen, onClose, listId }: ImportModalProps) {
  const [importType, setImportType] = useState<'csv' | 'siren' | 'linkedin'>('csv');
  const [sirenList, setSirenList] = useState('');
  const { importCompanies } = useCompanyListsStore();

  const handleImport = async () => {
    if (!listId) return;

    try {
      if (importType === 'siren' && sirenList.trim()) {
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
            <div className="grid grid-cols-3 gap-3">
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
              disabled={importType === 'linkedin' || (importType === 'siren' && !sirenList.trim())}
              className="px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Importer
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
}

function ListCard({ list, onSelect, onEdit, onDelete }: ListCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white border border-[#bdc3c7] rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
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
        
        {list.isShared && (
          <div className="flex items-center gap-1 text-[#27ae60]">
            <Users className="h-4 w-4" />
            <span>Partagée</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function CompanyListsPage() {
  const { user, isLoaded } = useUser();
  const {
    lists,
    currentList,
    isLoading,
    fetchLists,
    selectList,
    deleteList
  } = useCompanyListsStore();

  const [activeTab, setActiveTab] = useState<'all' | 'shared' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedList, setSelectedList] = useState<CompanyList | null>(null);

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
    selectList(list.id);
    setSelectedList(list);
  };

  const handleEditList = (list: CompanyList) => {
    // TODO: Ouvrir modal d'édition
    console.log('Éditer la liste:', list);
  };

  const handleDeleteList = async (listId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette liste ?')) {
      await deleteList(listId);
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
              />
            ))}
          </div>
        )}
      </main>

      {/* Modales */}
      <CreateListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        listId={selectedList?.id}
      />
    </div>
  );
}
