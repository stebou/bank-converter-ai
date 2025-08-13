'use client';

import { CompanySearchResult } from '@/types/search-criteria';
import { Building2, Calendar, ChevronDown, ChevronUp, ExternalLink, MapPin, User, Users } from 'lucide-react';
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
  onPageChange
}: CompanySearchResultsProps) {
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());

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

  const isAllSelected = results.length > 0 && results.every(company => selectedCompanies.includes(company.siren));
  const isPartiallySelected = results.some(company => selectedCompanies.includes(company.siren)) && !isAllSelected;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3498db]"></div>
        <span className="ml-2 text-gray-600">Recherche en cours...</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune entreprise trouvée</h3>
        <p className="text-gray-500">Essayez de modifier vos critères de recherche.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête avec sélection et pagination */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(input) => {
                if (input) input.indeterminate = isPartiallySelected;
              }}
              onChange={isAllSelected ? onDeselectAll : onSelectAll}
              className="h-4 w-4 text-[#3498db] focus:ring-[#3498db] border-gray-300 rounded"
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
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        )}
      </div>

      {/* Liste des résultats */}
      <div className="space-y-3">
        {results.map((company) => {
          const isSelected = selectedCompanies.includes(company.siren);
          const isExpanded = expandedCompanies.has(company.siren);

          return (
            <div
              key={company.siren}
              className={`border rounded-lg p-4 transition-all ${
                isSelected ? 'border-[#3498db] bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox de sélection */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onCompanySelect(company.siren)}
                  className="h-4 w-4 text-[#3498db] focus:ring-[#3498db] border-gray-300 rounded mt-1"
                />

                {/* Informations principales */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-[#2c3e50]">
                          {company.denomination}
                        </h3>
                        {/* Badge pour identifier le type d'entité */}
                        {company.entityType === 'entrepreneur_individuel' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                            <User className="h-3 w-3" />
                            Entrepreneur individuel
                          </span>
                        )}
                        {company.entityType === 'personne_physique' && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            <User className="h-3 w-3" />
                            Personne physique
                          </span>
                        )}
                      </div>
                      {/* Affichage du nom de la personne si disponible */}
                      {company.nomPersonne && (
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Nom complet:</span> {company.nomPersonne.prenom} {company.nomPersonne.nom}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          SIREN: {company.siren}
                        </span>
                        {company.siret && (
                          <span>SIRET: {company.siret}</span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          company.etatAdministratif === 'A' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {company.etatAdministratif === 'A' ? 'Actif' : 'Fermé'}
                        </span>
                      </div>
                    </div>

                    {/* Bouton d'expansion */}
                    <button
                      onClick={() => toggleCompanyExpansion(company.siren)}
                      className="text-gray-400 hover:text-gray-600 p-1"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* Informations condensées */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
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
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Adresse complète */}
                        <div>
                          <h4 className="font-medium text-[#2c3e50] mb-2">Adresse</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            {company.adresse.numeroVoie && company.adresse.typeVoie && company.adresse.libelleVoie && (
                              <div>
                                {company.adresse.numeroVoie} {company.adresse.typeVoie} {company.adresse.libelleVoie}
                              </div>
                            )}
                            <div>{company.adresse.codePostal} {company.adresse.commune}</div>
                            <div>Département: {company.adresse.departement}</div>
                            <div>Région: {company.adresse.region}</div>
                          </div>
                        </div>

                        {/* Informations juridiques et économiques */}
                        <div>
                          <h4 className="font-medium text-[#2c3e50] mb-2">Informations</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>
                              <span className="font-medium">Activité:</span> {company.activitePrincipale} - {company.activitePrincipaleLibelle}
                            </div>
                            <div>
                              <span className="font-medium">Catégorie juridique:</span> {company.categorieJuridique} - {company.categorieJuridiqueLibelle}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span className="font-medium">Créée le:</span> {company.dateCreation ? new Date(company.dateCreation).toLocaleDateString('fr-FR') : 'Non renseigné'}
                            </div>
                            <div>
                              <span className="font-medium">Diffusion:</span> 
                              <span className={`ml-1 px-2 py-1 rounded text-xs ${
                                company.statutDiffusion === 'O' 
                                  ? 'bg-green-100 text-green-800'
                                  : company.statutDiffusion === 'P'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {company.statutDiffusion === 'O' ? 'Autorisée' 
                                  : company.statutDiffusion === 'P' ? 'Partielle' 
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
        <div className="flex justify-center items-center gap-2 pt-4">
          <button
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Précédent
          </button>
          
          {/* Numéros de pages */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange?.(page)}
                  className={`px-3 py-2 text-sm rounded-lg ${
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
            onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
