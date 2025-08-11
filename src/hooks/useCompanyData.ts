'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { companyDataService, type INSEECompany, type EnrichedCompany } from '@/lib/companyDataService';

interface UseCompanyDataOptions {
  autoSearch?: boolean;
  defaultFilters?: CompanyFilters;
  enableRealTimeSearch?: boolean;
  searchDebounceMs?: number;
}

interface CompanyFilters {
  status?: ('A' | 'F')[];
  regions?: string[];
  departments?: string[];
  nafCodes?: string[];
  effectifs?: string[];
  headOfficeOnly?: boolean;
  hasLinkedin?: boolean;
  hasWebsite?: boolean;
  scoreRange?: { min?: number; max?: number };
}

interface SearchParams {
  query?: string;
  siren?: string;
  siret?: string;
  nom?: string;
  ville?: string;
  departement?: string;
  page?: number;
  limit?: number;
}

export function useCompanyData(options: UseCompanyDataOptions = {}) {
  const [companies, setCompanies] = useState<EnrichedCompany[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<EnrichedCompany[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<CompanyFilters>(options.defaultFilters || {});
  const [searchQuery, setSearchQuery] = useState('');
  const [lastSearchTime, setLastSearchTime] = useState<Date | null>(null);
  
  // Références pour le debouncing
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Options configurables
  const {
    enableRealTimeSearch = true,
    searchDebounceMs = 500
  } = options;

  // Logger pour suivre les opérations
  const logOperation = useCallback((operation: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString('fr-FR');
    console.log(`[CompanyData ${timestamp}] ${operation}`, data ? data : '');
  }, []);

  // Test de connectivité INSEE
  const testInseeConnection = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await companyDataService.testInseeConnection();
      if (!result.success) {
        setError(result.message);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du test de connexion';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Recherche d'entreprises via l'API INSEE avec logs
  const searchCompanies = useCallback(async (params: SearchParams) => {
    // Annuler la recherche précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      logOperation('Recherche précédente annulée');
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    setError(null);
    setLastSearchTime(new Date());

    logOperation('Début de recherche', {
      query: params.query,
      siren: params.siren,
      siret: params.siret,
      nom: params.nom,
      ville: params.ville,
      page: params.page || 1,
      limit: params.limit || 20
    });

    try {
      const startTime = performance.now();
      
      const result = await companyDataService.getAllSearchResults({
        q: params.query,
        siren: params.siren,
        siret: params.siret,
        nom: params.nom,
        ville: params.ville,
        departement: params.departement,
        etatAdministratif: 'A', // Par défaut, chercher les entreprises actives
        siege: filters.headOfficeOnly || undefined
      });

      const searchTime = performance.now() - startTime;
      
      logOperation('Résultats de recherche INSEE', {
        total: result.total,
        companiesCount: result.companies.length,
        searchTimeMs: Math.round(searchTime)
      });

      // Enrichissement des données
      const enrichedCompanies: EnrichedCompany[] = await Promise.all(
        result.companies.map(async (company) => {
          const score = companyDataService.calculateTargetingScore(company);
          const tags = companyDataService.generateTags(company);
          
          logOperation('Enrichissement entreprise', {
            siren: company.siren,
            nom: company.denomination,
            score: score,
            tags: tags.length
          });
          
          // Tentative d'enrichissement LinkedIn (optionnel)
          let linkedin: undefined = undefined;
          if (company.denomination) {
            const domain = extractPotentialDomain(company.denomination);
            if (domain) {
              try {
                const linkedinResult = await companyDataService.enrichWithLinkedIn(domain);
                if (linkedinResult) {
                  linkedin = linkedinResult as any;
                  logOperation('LinkedIn trouvé', { domain, siren: company.siren });
                }
              } catch (error) {
                logOperation('Échec LinkedIn', { domain, error: error instanceof Error ? error.message : 'Unknown' });
              }
            }
          }

          return {
            ...company,
            score,
            tags,
            linkedin,
            domain: extractPotentialDomain(company.denomination),
            website: undefined,
            phone: undefined,
            email: undefined
          } as EnrichedCompany;
        })
      );

      setCompanies(enrichedCompanies);
      setTotal(result.total);
      setCurrentPage(params.page || 1);
      
      logOperation('Recherche terminée avec succès', {
        total: result.total,
        enrichedCount: enrichedCompanies.length,
        currentPage: params.page || 1
      });
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        logOperation('Recherche annulée par l\'utilisateur');
        return;
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la recherche';
      setError(errorMessage);
      logOperation('Erreur de recherche', { error: errorMessage });
      console.error('Erreur recherche entreprises:', err);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [filters.headOfficeOnly, logOperation]);

  // Validation SIREN/SIRET
  const validateIdentifier = useCallback((identifier: string): boolean => {
    if (identifier.length === 9) {
      return companyDataService.isValidSiren(identifier);
    } else if (identifier.length === 14) {
      return companyDataService.isValidSiret(identifier);
    }
    return false;
  }, []);

  // Recherche en temps réel avec debouncing
  const searchInRealTime = useCallback((query: string) => {
    setSearchQuery(query);
    
    // Annuler le timeout précédent
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Si la query est vide, effacer les résultats
    if (!query.trim()) {
      logOperation('Query vide - effacement des résultats');
      setCompanies([]);
      setTotal(0);
      return;
    }

    // Si la query est trop courte, ne pas chercher
    if (query.trim().length < 2) {
      logOperation('Query trop courte', { length: query.trim().length });
      return;
    }

    logOperation('Recherche en temps réel programmée', { 
      query: query.trim(), 
      debounceMs: searchDebounceMs 
    });

    // Programmer la recherche après le délai de debounce
    searchTimeoutRef.current = setTimeout(() => {
      logOperation('Déclenchement recherche automatique', { query: query.trim() });
      
      // Déterminer le type de recherche
      const cleanQuery = query.replace(/\s/g, '');
      if (validateIdentifier(cleanQuery)) {
        if (cleanQuery.length === 9) {
          searchCompanies({ siren: cleanQuery });
        } else if (cleanQuery.length === 14) {
          searchCompanies({ siret: cleanQuery });
        }
      } else {
        // Recherche par nom d'entreprise
        searchCompanies({ nom: query.trim() });
      }
    }, searchDebounceMs);
  }, [searchDebounceMs, searchCompanies, validateIdentifier, logOperation]);

  // Fonction pour effacer les résultats
  const clearResults = useCallback(() => {
    logOperation('Effacement manuel des résultats');
    setCompanies([]);
    setTotal(0);
    setError(null);
    setSearchQuery('');
    
    // Annuler toute recherche en cours
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [logOperation]);

  // Application des filtres locaux
  const applyFilters = useCallback(() => {
    let filtered = [...companies];

    // Filtre par statut
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(company => 
        filters.status!.includes(company.etatAdministratif)
      );
    }

    // Filtre par effectifs
    if (filters.effectifs && filters.effectifs.length > 0) {
      filtered = filtered.filter(company => 
        company.trancheEffectifs && filters.effectifs!.includes(company.trancheEffectifs)
      );
    }

    // Filtre par codes NAF
    if (filters.nafCodes && filters.nafCodes.length > 0) {
      filtered = filtered.filter(company => 
        filters.nafCodes!.some(naf => company.activitePrincipale?.startsWith(naf))
      );
    }

    // Filtre par département
    if (filters.departments && filters.departments.length > 0) {
      filtered = filtered.filter(company => 
        filters.departments!.some(dept => 
          company.adresse.codeCommuneEtablissement?.startsWith(dept)
        )
      );
    }

    // Filtre siège uniquement
    if (filters.headOfficeOnly) {
      filtered = filtered.filter(company => company.siege);
    }

    // Filtre présence LinkedIn
    if (filters.hasLinkedin) {
      filtered = filtered.filter(company => company.linkedin?.organizationUrn);
    }

    // Filtre présence site web
    if (filters.hasWebsite) {
      filtered = filtered.filter(company => company.website || company.domain);
    }

    // Filtre par score
    if (filters.scoreRange?.min !== undefined) {
      filtered = filtered.filter(company => company.score >= filters.scoreRange!.min!);
    }
    if (filters.scoreRange?.max !== undefined) {
      filtered = filtered.filter(company => company.score <= filters.scoreRange!.max!);
    }

    setFilteredCompanies(filtered);
  }, [companies, filters]);

  // Enrichissement LinkedIn d'une entreprise spécifique
  const enrichCompanyWithLinkedIn = useCallback(async (companyIndex: number, domain: string) => {
    try {
      const linkedin = await companyDataService.enrichWithLinkedIn(domain);
      if (linkedin) {
        setCompanies(prev => {
          const updated = [...prev];
          updated[companyIndex] = {
            ...updated[companyIndex],
            linkedin,
            domain
          };
          return updated;
        });
      }
    } catch (error) {
      console.error('Erreur enrichissement LinkedIn:', error);
    }
  }, []);

  // Export des données
  const exportToCSV = useCallback((companiesToExport: EnrichedCompany[] = filteredCompanies) => {
    const headers = [
      'SIREN',
      'SIRET',
      'Dénomination',
      'NAF',
      'Activité',
      'Effectifs',
      'Statut',
      'Siège',
      'Adresse',
      'Ville',
      'Code Postal',
      'Département',
      'Date Création',
      'Score',
      'LinkedIn',
      'Site Web',
      'Tags'
    ];

    const csvContent = [
      headers.join(','),
      ...companiesToExport.map(company => [
        company.siren,
        company.siret,
        `"${company.denomination}"`,
        company.activitePrincipale || '',
        `"${company.activitePrincipaleLibelle}"`,
        company.trancheEffectifs || '',
        company.etatAdministratif === 'A' ? 'Actif' : 'Fermé',
        company.siege ? 'Oui' : 'Non',
        `"${[
          company.adresse.numeroVoie,
          company.adresse.typeVoie,
          company.adresse.libelleVoie
        ].filter(Boolean).join(' ')}"`,
        `"${company.adresse.libelleCommuneEtablissement}"`,
        company.adresse.codePostal,
        company.adresse.codeCommuneEtablissement?.substring(0, 2) || '',
        company.dateCreation,
        company.score,
        company.linkedin?.organizationUrn ? 'Oui' : 'Non',
        company.website || company.domain || '',
        `"${company.tags.join(', ')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `entreprises_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredCompanies]);

  // Statistiques
  const getStats = useCallback(() => {
    const active = filteredCompanies.filter(c => c.etatAdministratif === 'A').length;
    const withLinkedin = filteredCompanies.filter(c => c.linkedin?.organizationUrn).length;
    const averageScore = filteredCompanies.length > 0 
      ? filteredCompanies.reduce((sum, c) => sum + c.score, 0) / filteredCompanies.length 
      : 0;

    return {
      total: filteredCompanies.length,
      active,
      withLinkedin,
      averageScore: Math.round(averageScore * 10) / 10
    };
  }, [filteredCompanies]);

  // Application des filtres quand ils changent
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Recherche automatique au montage si activée
  useEffect(() => {
    if (options.autoSearch) {
      searchCompanies({ page: 1, limit: 20 });
    }
  }, [options.autoSearch, searchCompanies]);

  return {
    // Données
    companies: filteredCompanies,
    allCompanies: companies,
    total,
    currentPage,
    
    // État
    isLoading,
    error,
    searchQuery,
    lastSearchTime,
    
    // Filtres
    filters,
    setFilters,
    applyFilters,
    
    // Actions
    searchCompanies,
    searchInRealTime,
    clearResults,
    testInseeConnection,
    enrichCompanyWithLinkedIn,
    validateIdentifier,
    exportToCSV,
    
    // Pagination
    setCurrentPage,
    
    // Statistiques
    stats: getStats()
  };
}

// Fonction utilitaire pour extraire un domaine potentiel d'un nom d'entreprise
function extractPotentialDomain(companyName: string): string | null {
  if (!companyName) return null;
  
  // Nettoyer le nom de l'entreprise
  let cleanName = companyName
    .toLowerCase()
    .replace(/\s+(sa|sas|sarl|eurl|sasu|sci|scp|snc|scs|gie|association)$/i, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();

  // Vérifier si ça ressemble à un domaine valide
  if (cleanName.length < 3 || cleanName.length > 50) return null;
  
  return `${cleanName}.fr`;
}

export type { EnrichedCompany, CompanyFilters, SearchParams };
