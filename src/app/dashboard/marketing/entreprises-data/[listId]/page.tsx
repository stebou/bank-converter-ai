'use client';

import { CompanySearchPopup } from '@/components/CompanySearchPopup';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useCompanyListsStore } from '@/stores/company-lists';
import type { Company } from '@/types/company-lists';
import { CompanyStatus } from '@/types/company-lists';
import type { CompanySearchResult } from '@/types/search-criteria';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  Filter,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ListDetailPage() {
  const { listId } = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const {
    lists,
    currentList,
    isLoading,
    fetchLists,
    selectList,
    deleteList,
    addCompaniesToList,
    removeCompanyFromList,
  } = useCompanyListsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCompanySearchPopup, setShowCompanySearchPopup] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteCompanyConfirm, setShowDeleteCompanyConfirm] =
    useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  const list = lists.find(l => l.id === listId) || currentList;

  useEffect(() => {
    if (isLoaded && user && listId) {
      fetchLists();
      selectList(listId as string);
    }
  }, [isLoaded, user, listId, fetchLists, selectList]);

  if (!isLoaded || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-[#3498db]"></div>
          <p className="text-[#7f8c8d]">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-[#95a5a6]" />
          <h2 className="mb-2 text-xl font-semibold text-[#2c3e50]">
            Liste introuvable
          </h2>
          <p className="mb-4 text-[#7f8c8d]">
            Cette liste n'existe pas ou vous n'y avez pas accès.
          </p>
          <button
            onClick={() => router.push('/dashboard/marketing/entreprises-data')}
            className="rounded-lg bg-[#3498db] px-4 py-2 text-white transition-colors hover:bg-[#2980b9]"
          >
            Retour aux listes
          </button>
        </div>
      </div>
    );
  }

  const companies = list.companies || [];
  const filteredCompanies = companies.filter(
    company =>
      company.denomination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.siren?.includes(searchQuery) ||
      company.ville?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteList = async () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteList = async () => {
    try {
      await deleteList(list!.id);
      router.push('/dashboard/marketing/entreprises-data');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleAddCompanies = () => {
    setShowCompanySearchPopup(true);
  };

  const handleAddToList = async (companies: CompanySearchResult[]) => {
    try {
      console.log('Ajouter à la liste:', companies);

      // Convertir les CompanySearchResult en format attendu par l'API
      const companiesData = companies
        .filter(company => company.siret) // Filtrer les entreprises avec siret valide
        .map(company => ({
          siren: company.siren,
          siret: company.siret!,
          statut: CompanyStatus.NEW,
        }));

      // Utiliser la fonction du store pour ajouter les entreprises
      await addCompaniesToList({
        listId: listId as string,
        companies: companiesData,
      });

      setShowCompanySearchPopup(false);

      // Rafraîchir la liste
      await fetchLists();
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
    }
  };

  const handleDeleteCompany = (company: Company) => {
    setCompanyToDelete(company);
    setShowDeleteCompanyConfirm(true);
  };

  const confirmDeleteCompany = async () => {
    if (!companyToDelete || !list) return;

    try {
      await removeCompanyFromList(list.id, companyToDelete.id);
      setShowDeleteCompanyConfirm(false);
      setCompanyToDelete(null);

      // Rafraîchir la liste
      await fetchLists();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'entreprise:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-[#e9ecef] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  router.push('/dashboard/marketing/entreprises-data')
                }
                className="p-2 text-[#7f8c8d] transition-colors hover:text-[#2c3e50]"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[#2c3e50]">
                  {list.name}
                </h1>
                {list.description && (
                  <p className="mt-1 text-[#7f8c8d]">{list.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAddCompanies}
                className="flex items-center gap-2 rounded-lg bg-[#27ae60] px-4 py-2 text-white transition-colors hover:bg-[#229954]"
              >
                <Plus className="h-4 w-4" />
                Ajouter des entreprises
              </button>

              <button className="flex items-center gap-2 rounded-lg bg-[#3498db] px-4 py-2 text-white transition-colors hover:bg-[#2980b9]">
                <Download className="h-4 w-4" />
                Exporter
              </button>

              <div className="relative">
                <button className="p-2 text-[#7f8c8d] transition-colors hover:text-[#2c3e50]">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-6 border-t border-[#e9ecef] pt-4">
            <div className="flex items-center gap-2 text-[#7f8c8d]">
              <Building2 className="h-4 w-4" />
              <span>{companies.length} entreprises</span>
            </div>
            <div className="flex items-center gap-2 text-[#7f8c8d]">
              <Calendar className="h-4 w-4" />
              <span>
                Créée le {new Date(list.createdAt).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Search and filters */}
        <div className="mb-6 rounded-lg border border-[#e9ecef] bg-white p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#7f8c8d]" />
              <input
                type="text"
                placeholder="Rechercher dans la liste..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#bdc3c7] py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#3498db]"
              />
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-[#bdc3c7] px-4 py-2 transition-colors hover:bg-[#f8f9fa]">
              <Filter className="h-4 w-4" />
              Filtres
            </button>
          </div>
        </div>

        {/* Companies list */}
        {filteredCompanies.length === 0 ? (
          <div className="rounded-lg border border-[#e9ecef] bg-white p-12 text-center">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-[#95a5a6]" />
            <h3 className="mb-2 text-lg font-semibold text-[#2c3e50]">
              {companies.length === 0 ? 'Aucune entreprise' : 'Aucun résultat'}
            </h3>
            <p className="mb-6 text-[#7f8c8d]">
              {companies.length === 0
                ? 'Commencez par ajouter des entreprises à votre liste'
                : 'Aucune entreprise ne correspond à votre recherche'}
            </p>
            {companies.length === 0 && (
              <button
                onClick={handleAddCompanies}
                className="mx-auto flex items-center gap-2 rounded-lg bg-[#3498db] px-4 py-2 text-white transition-colors hover:bg-[#2980b9]"
              >
                <Plus className="h-4 w-4" />
                Ajouter des entreprises
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCompanies.map(company => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-[#e9ecef] bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h3 className="font-semibold text-[#2c3e50]">
                        {company.denomination}
                      </h3>
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#3498db] transition-colors hover:text-[#2980b9]"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-sm text-[#7f8c8d] md:grid-cols-2 lg:grid-cols-4">
                      {company.siren && (
                        <div>
                          <span className="font-medium">SIREN:</span>{' '}
                          {company.siren}
                        </div>
                      )}
                      {company.ville && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {company.ville}
                        </div>
                      )}
                      {company.activitePrincipaleLibelle && (
                        <div>
                          <span className="font-medium">Activité:</span>{' '}
                          {company.activitePrincipaleLibelle}
                        </div>
                      )}
                      {company.trancheEffectifs && (
                        <div>
                          <span className="font-medium">Effectifs:</span>{' '}
                          {company.trancheEffectifs}
                        </div>
                      )}
                    </div>

                    {company.contactPerson && (
                      <div className="mt-2 text-sm text-[#7f8c8d]">
                        <span className="font-medium">Contact:</span>{' '}
                        {company.contactPerson}
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex items-center gap-1">
                    <button className="p-1 text-[#7f8c8d] transition-colors hover:text-[#2c3e50]">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-[#7f8c8d] transition-colors hover:text-[#2c3e50]">
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(company)}
                      className="p-1 text-[#7f8c8d] transition-colors hover:text-[#e74c3c]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Company Search Popup */}
      {showCompanySearchPopup && (
        <CompanySearchPopup
          isOpen={showCompanySearchPopup}
          onClose={() => setShowCompanySearchPopup(false)}
          onAddToList={handleAddToList}
          listName={list.name}
        />
      )}

      {/* Popup de confirmation de suppression */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteList}
        title="Supprimer la liste"
        message={`Êtes-vous sûr de vouloir supprimer la liste "${list.name}" ? Cette action est irréversible et supprimera également toutes les entreprises associées.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />

      {/* Popup de confirmation de suppression d'entreprise */}
      <ConfirmDialog
        isOpen={showDeleteCompanyConfirm}
        onClose={() => {
          setShowDeleteCompanyConfirm(false);
          setCompanyToDelete(null);
        }}
        onConfirm={confirmDeleteCompany}
        title="Supprimer l'entreprise"
        message={`Êtes-vous sûr de vouloir supprimer "${companyToDelete?.denomination || 'cette entreprise'}" de la liste ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />
    </div>
  );
}
