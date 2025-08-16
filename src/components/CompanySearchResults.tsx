'use client';

import { CompanySearchResult } from '@/types/search-criteria';
import {
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MapPin,
  User,
  Users,
} from 'lucide-react';
import { useState } from 'react';

interface CompanySearchResultsProps {
  results: CompanySearchResult[];
  selectedCompanies: string[];
  onCompanySelect: (companyId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  isLoading?: boolean;
  totalResults?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export function CompanySearchResults({
  results,
  selectedCompanies,
  onCompanySelect,
  onSelectAll,
  onDeselectAll,
  isLoading = false,
  totalResults = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: CompanySearchResultsProps) {
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(
    new Set()
  );

  const toggleCompanyExpansion = (siren: string) => {
    setExpandedCompanies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(siren)) {
        newSet.delete(siren);
      } else {
        newSet.add(siren);
      }
      return newSet;
    });
  };

  const isAllSelected =
    results.length > 0 &&
    results.every(company => selectedCompanies.includes(company.siren));
  const isPartiallySelected =
    results.some(company => selectedCompanies.includes(company.siren)) &&
    !isAllSelected;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#3498db]"></div>
        <span className="ml-2 text-gray-600">Recherche en cours...</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-12 text-center">
        <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          Aucune entreprise trouvée
        </h3>
        <p className="text-gray-500">
          Essayez de modifier vos critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête avec sélection et pagination */}
      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={input => {
                if (input) input.indeterminate = isPartiallySelected;
              }}
              onChange={isAllSelected ? onDeselectAll : onSelectAll}
              className="h-4 w-4 rounded border-gray-300 text-[#3498db] focus:ring-[#3498db]"
            />
            <span className="ml-2 text-sm text-gray-700">
              {selectedCompanies.length > 0 ? (
                <>{selectedCompanies.length} sélectionnée(s)</>
              ) : (
                'Tout sélectionner'
              )}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {totalResults} entreprise(s) trouvée(s)
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() =>
                onPageChange?.(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      {/* Liste des résultats */}
      <div className="space-y-3">
        {results.map(company => {
          const isSelected = selectedCompanies.includes(company.siren);
          const isExpanded = expandedCompanies.has(company.siren);

          return (
            <div
              key={company.siren}
              className={`rounded-lg border p-4 transition-all ${
                isSelected
                  ? 'border-[#3498db] bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox de sélection */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onCompanySelect(company.siren)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#3498db] focus:ring-[#3498db]"
                />

                {/* Informations principales */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-[#2c3e50]">
                          {company.denomination}
                        </h3>
                        {/* Badge pour identifier le type d'entité */}
                        {company.entityType === 'entrepreneur_individuel' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
                            <User className="h-3 w-3" />
                            Entrepreneur individuel
                          </span>
                        )}
                        {company.entityType === 'personne_physique' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                            <User className="h-3 w-3" />
                            Personne physique
                          </span>
                        )}
                      </div>
                      {/* Affichage du nom de la personne si disponible */}
                      {company.nomPersonne && (
                        <div className="mb-2 text-sm text-gray-600">
                          <span className="font-medium">Nom complet:</span>{' '}
                          {company.nomPersonne.prenom} {company.nomPersonne.nom}
                        </div>
                      )}
                      <div className="mb-2 flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          SIREN: {company.siren}
                        </span>
                        {company.siret && <span>SIRET: {company.siret}</span>}
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            company.etatAdministratif === 'A'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {company.etatAdministratif === 'A'
                            ? 'Actif'
                            : 'Fermé'}
                        </span>
                      </div>
                    </div>

                    {/* Bouton d'expansion */}
                    <button
                      onClick={() => toggleCompanyExpansion(company.siren)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Informations condensées */}
                  <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>
                        {company.adresse.codePostal} {company.adresse.commune}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span>{company.activitePrincipaleLibelle}</span>
                    </div>
                    {company.trancheEffectifsLibelle && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{company.trancheEffectifsLibelle}</span>
                      </div>
                    )}
                  </div>

                  {/* Détails étendus */}
                  {isExpanded && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Adresse complète */}
                        <div>
                          <h4 className="mb-2 font-medium text-[#2c3e50]">
                            Adresse
                          </h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            {company.adresse.numeroVoie &&
                              company.adresse.typeVoie &&
                              company.adresse.libelleVoie && (
                                <div>
                                  {company.adresse.numeroVoie}{' '}
                                  {company.adresse.typeVoie}{' '}
                                  {company.adresse.libelleVoie}
                                </div>
                              )}
                            <div>
                              {company.adresse.codePostal}{' '}
                              {company.adresse.commune}
                            </div>
                            <div>
                              Département: {company.adresse.departement}
                            </div>
                            <div>Région: {company.adresse.region}</div>
                          </div>
                        </div>

                        {/* Informations juridiques et économiques */}
                        <div>
                          <h4 className="mb-2 font-medium text-[#2c3e50]">
                            Informations
                          </h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Activité:</span>{' '}
                              {company.activitePrincipale} -{' '}
                              {company.activitePrincipaleLibelle}
                            </div>
                            <div>
                              <span className="font-medium">
                                Catégorie juridique:
                              </span>{' '}
                              {company.categorieJuridique} -{' '}
                              {company.categorieJuridiqueLibelle}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">
                                Créée le:
                              </span>{' '}
                              {company.dateCreation
                                ? new Date(
                                    company.dateCreation
                                  ).toLocaleDateString('fr-FR')
                                : 'Non renseigné'}
                            </div>
                            <div>
                              <span className="font-medium">Diffusion:</span>
                              <span
                                className={`ml-1 rounded px-2 py-1 text-xs ${
                                  company.statutDiffusion === 'O'
                                    ? 'bg-green-100 text-green-800'
                                    : company.statutDiffusion === 'P'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {company.statutDiffusion === 'O'
                                  ? 'Autorisée'
                                  : company.statutDiffusion === 'P'
                                    ? 'Partielle'
                                    : 'Non autorisée'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex gap-2">
                        <a
                          href={`https://www.societe.com/siren/${company.siren}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-[#3498db] hover:text-[#2980b9]"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Voir sur Societe.com
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination en bas */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Précédent
          </button>

          {/* Numéros de pages */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page =
                Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    page === currentPage
                      ? 'bg-[#3498db] text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              onPageChange?.(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
