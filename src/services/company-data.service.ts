// Service orchestrateur pour les données d'entreprise
// Combine INSEE, LinkedIn et autres sources

import { inseeService } from './insee.service';
import { linkedInService } from './linkedin.service';

import type {
    CompanySearchParams,
    CompanySearchResult,
    EnrichedCompany,
    INSEECompany,
    SearchFilters
} from '../types/company';

export class CompanyDataService {
  /**
   * Teste la connexion aux services externes
   */
  async testConnections(): Promise<{
    insee: { success: boolean; message: string };
    linkedin: { success: boolean; message: string };
  }> {
    const [inseeResult] = await Promise.allSettled([
      inseeService.testConnection(),
    ]);

    return {
      insee: inseeResult.status === 'fulfilled' 
        ? inseeResult.value 
        : { success: false, message: 'Erreur de test INSEE' },
      linkedin: { success: true, message: 'Service LinkedIn disponible (simulation)' },
    };
  }

  /**
   * Alias pour compatibilité avec l'ancien service
   */
  async testInseeConnection(): Promise<{ success: boolean; message: string }> {
    const results = await this.testConnections();
    return results.insee;
  }

  /**
   * Récupère tous les résultats d'une recherche (pour compatibilité)
   */
  async getAllSearchResults(params: any): Promise<{ companies: INSEECompany[]; total: number }> {
    return await inseeService.getAllSearchResults(params);
  }

  /**
   * Recherche d'entreprises (pour compatibilité)
   */
  async searchCompanies(params: any): Promise<{ companies: INSEECompany[]; total: number }> {
    const result = await inseeService.searchCompanies(params);
    return {
      companies: result.companies,
      total: result.total,
    };
  }

  /**
   * Enrichissement LinkedIn (pour compatibilité)
   */
  async enrichWithLinkedIn(companies: INSEECompany[]): Promise<EnrichedCompany[]>;
  async enrichWithLinkedIn(domain: string): Promise<any>;
  async enrichWithLinkedIn(input: INSEECompany[] | string): Promise<EnrichedCompany[] | any> {
    if (typeof input === 'string') {
      // Enrichissement d'un domaine spécifique
      return await linkedInService.enrichWithLinkedIn([{ domain: input } as any]);
    } else {
      // Enrichissement d'un tableau d'entreprises
      return await linkedInService.enrichWithLinkedIn(input);
    }
  }

  /**
   * Calcule un score de ciblage pour une entreprise
   */
  calculateTargetingScore(company: any, criteria: any = {}): number {
    let score = 0;
    
    // Score basé sur la taille
    if (company.trancheEffectifs) {
      score += this.getEmployeeSizeScore(company.trancheEffectifs);
    }
    
    // Score basé sur l'activité
    if (criteria.targetSectors && company.activitePrincipale) {
      const isTargetSector = criteria.targetSectors.includes(company.activitePrincipale);
      score += isTargetSector ? 30 : 0;
    }
    
    // Score basé sur la localisation
    if (criteria.targetRegions && company.adresse?.codePostal) {
      const region = this.getRegionFromPostalCode(company.adresse.codePostal);
      const isTargetRegion = criteria.targetRegions.includes(region);
      score += isTargetRegion ? 20 : 0;
    }
    
    return Math.min(score, 100);
  }

  /**
   * Génère des tags pour une entreprise
   */
  generateTags(company: any): string[] {
    const tags: string[] = [];
    
    // Tags basés sur la taille
    if (company.trancheEffectifs) {
      tags.push(this.getSizeTag(company.trancheEffectifs));
    }
    
    // Tags basés sur l'activité
    if (company.activitePrincipaleLibelle) {
      tags.push(this.getActivityTag(company.activitePrincipaleLibelle));
    }
    
    // Tags basés sur la localisation
    if (company.adresse?.codePostal) {
      const region = this.getRegionFromPostalCode(company.adresse.codePostal);
      tags.push(region);
    }
    
    // Tag pour l'état
    if (company.etatAdministratif === 'A') {
      tags.push('Actif');
    }
    
    return tags;
  }

  /**
   * Valide un numéro SIREN
   */
  isValidSiren(siren: string): boolean {
    return /^\d{9}$/.test(siren);
  }

  /**
   * Valide un numéro SIRET
   */
  isValidSiret(siret: string): boolean {
    return /^\d{14}$/.test(siret);
  }

  // Méthodes privées pour les calculs
  private getEmployeeSizeScore(trancheEffectifs: string): number {
    const sizeScores: Record<string, number> = {
      '00': 5,   // Aucun salarié
      '01': 10,  // 1-2 salariés
      '02': 15,  // 3-5 salariés
      '03': 20,  // 6-9 salariés
      '11': 25,  // 10-19 salariés
      '12': 30,  // 20-49 salariés
      '21': 35,  // 50-99 salariés
      '22': 40,  // 100-199 salariés
      '31': 45,  // 200-249 salariés
      '32': 50,  // 250-499 salariés
    };
    return sizeScores[trancheEffectifs] || 25;
  }

  private getSizeTag(trancheEffectifs: string): string {
    const sizeTags: Record<string, string> = {
      '00': 'Indépendant',
      '01': 'Très Petite Entreprise',
      '02': 'Très Petite Entreprise',
      '03': 'Très Petite Entreprise',
      '11': 'Petite Entreprise',
      '12': 'Petite Entreprise',
      '21': 'Moyenne Entreprise',
      '22': 'Moyenne Entreprise',
      '31': 'Grande Entreprise',
      '32': 'Grande Entreprise',
    };
    return sizeTags[trancheEffectifs] || 'Taille inconnue';
  }

  private getActivityTag(activite: string): string {
    if (activite.toLowerCase().includes('commerce')) return 'Commerce';
    if (activite.toLowerCase().includes('conseil')) return 'Conseil';
    if (activite.toLowerCase().includes('informatique')) return 'Tech';
    if (activite.toLowerCase().includes('construction')) return 'BTP';
    if (activite.toLowerCase().includes('restauration')) return 'Restauration';
    return 'Autre secteur';
  }

  /**
   * Recherche unifiée d'entreprises avec enrichissement optionnel
   */
  async searchCompaniesUnified(
    params: CompanySearchParams & {
      enrichWithLinkedIn?: boolean;
      getAllResults?: boolean;
    }
  ): Promise<{
    companies: INSEECompany[] | EnrichedCompany[];
    total: number;
    page?: number;
    totalPages?: number;
  }> {
    console.log('🔍 Recherche unifiée avec paramètres:', params);

    // Recherche INSEE
    const searchResult = params.getAllResults
      ? await inseeService.getAllSearchResults(params)
      : await inseeService.searchCompanies(params);

    let companies: INSEECompany[] | EnrichedCompany[] = searchResult.companies;

    // Enrichissement LinkedIn optionnel
    if (params.enrichWithLinkedIn && companies.length > 0) {
      console.log('🔗 Enrichissement LinkedIn activé');
      companies = await linkedInService.enrichWithLinkedIn(companies);
    }

    return {
      companies,
      total: searchResult.total,
      page: searchResult.page,
      totalPages: searchResult.totalPages,
    };
  }

  /**
   * Recherche d'entreprises par dirigeant
   */
  async searchCompaniesByDirigeant(params: {
    nom?: string;
    prenom?: string;
    qualite?: string;
    enrichWithLinkedIn?: boolean;
  }): Promise<{
    companies: INSEECompany[] | EnrichedCompany[];
    total: number;
  }> {
    console.log('👤 Recherche par dirigeant:', params);

    // Construction de la requête pour rechercher par dirigeant
    // Note: L'API INSEE ne fournit pas directement les données dirigeants
    // Cette fonction est préparée pour une future intégration
    
    const queryParts: string[] = [];
    
    if (params.nom) {
      queryParts.push(`dirigeant:"${params.nom}"`);
    }
    
    if (params.prenom) {
      queryParts.push(`dirigeant:"${params.prenom}"`);
    }

    // Pour l'instant, on fait une recherche classique
    // En attendant une API dédiée aux dirigeants
    const searchParams: CompanySearchParams = {
      q: queryParts.join(' AND ') || params.nom || '',
    };

    const result = await this.searchCompaniesUnified({
      ...searchParams,
      enrichWithLinkedIn: params.enrichWithLinkedIn,
    });

    return result;
  }

  /**
   * Recherche avancée avec filtres multiples
   */
  async searchWithFilters(
    searchQuery: string,
    filters: SearchFilters,
    options: {
      page?: number;
      limit?: number;
      enrichWithLinkedIn?: boolean;
    } = {}
  ): Promise<CompanySearchResult | { companies: EnrichedCompany[]; total: number; page?: number; totalPages?: number; }> {
    console.log('🔎 Recherche avec filtres:', { searchQuery, filters, options });

    // Construction des paramètres de recherche
    const searchParams: CompanySearchParams = {
      q: searchQuery,
      page: options.page || 1,
      nombre: options.limit || 20,
    };

    // Application des filtres
    if (filters.regions && filters.regions.length > 0) {
      // Les régions peuvent être converties en codes département
      // Pour simplifier, on prend la première région
      searchParams.region = filters.regions[0];
    }

    if (filters.legalForms && filters.legalForms.length > 0) {
      // Les formes juridiques ont des codes spécifiques
      searchParams.categorieJuridique = filters.legalForms[0];
    }

    if (filters.sectors && filters.sectors.length > 0) {
      // Les secteurs correspondent aux codes d'activité
      searchParams.activitePrincipale = filters.sectors[0];
    }

    return await this.searchCompaniesUnified({
      ...searchParams,
      enrichWithLinkedIn: options.enrichWithLinkedIn,
    });
  }

  /**
   * Obtient les statistiques d'une recherche
   */
  async getSearchStatistics(
    params: CompanySearchParams
  ): Promise<{
    total: number;
    byRegion: Record<string, number>;
    bySector: Record<string, number>;
    bySize: Record<string, number>;
    byLegalForm: Record<string, number>;
  }> {
    console.log('📊 Calcul des statistiques pour:', params);

    // Récupération d'un échantillon pour calculer les statistiques
    const sampleResult = await inseeService.searchCompanies({
      ...params,
      nombre: 1000, // Échantillon plus large
    });

    const companies = sampleResult.companies;
    
    // Calcul des statistiques
    const byRegion: Record<string, number> = {};
    const bySector: Record<string, number> = {};
    const bySize: Record<string, number> = {};
    const byLegalForm: Record<string, number> = {};

    companies.forEach(company => {
      // Par région (basé sur le code postal)
      const region = this.getRegionFromPostalCode(company.adresse.codePostal);
      byRegion[region] = (byRegion[region] || 0) + 1;

      // Par secteur
      const sector = company.activitePrincipaleLibelle || 'Non spécifié';
      bySector[sector] = (bySector[sector] || 0) + 1;

      // Par taille
      const size = this.getSizeLabel(company.trancheEffectifs);
      bySize[size] = (bySize[size] || 0) + 1;

      // Par forme juridique
      const legalForm = company.categorieJuridique || 'Non spécifié';
      byLegalForm[legalForm] = (byLegalForm[legalForm] || 0) + 1;
    });

    return {
      total: sampleResult.total,
      byRegion,
      bySector,
      bySize,
      byLegalForm,
    };
  }

  /**
   * Détermine la région à partir du code postal
   */
  private getRegionFromPostalCode(codePostal: string): string {
    if (!codePostal) return 'Non spécifié';
    
    const dept = codePostal.substring(0, 2);
    
    const regionMap: Record<string, string> = {
      '75': 'Île-de-France',
      '77': 'Île-de-France',
      '78': 'Île-de-France',
      '91': 'Île-de-France',
      '92': 'Île-de-France',
      '93': 'Île-de-France',
      '94': 'Île-de-France',
      '95': 'Île-de-France',
      '13': 'Provence-Alpes-Côte d\'Azur',
      '69': 'Auvergne-Rhône-Alpes',
      '59': 'Hauts-de-France',
      '33': 'Nouvelle-Aquitaine',
      '44': 'Pays de la Loire',
      '67': 'Grand Est',
      '31': 'Occitanie',
      '35': 'Bretagne',
      '76': 'Normandie',
      '21': 'Bourgogne-Franche-Comté',
      '34': 'Occitanie',
    };

    return regionMap[dept] || 'Autre région';
  }

  /**
   * Convertit le code de taille en libellé
   */
  private getSizeLabel(trancheEffectifs?: string): string {
    if (!trancheEffectifs) return 'Non spécifié';

    const sizeMap: Record<string, string> = {
      '00': 'Aucun salarié',
      '01': 'Très petite (1-2)',
      '02': 'Très petite (3-5)',
      '03': 'Très petite (6-9)',
      '11': 'Petite (10-19)',
      '12': 'Petite (20-49)',
      '21': 'Moyenne (50-99)',
      '22': 'Moyenne (100-199)',
      '31': 'Grande (200-249)',
      '32': 'Grande (250-499)',
      '41': 'Très grande (500-999)',
      '42': 'Très grande (1000-1999)',
      '51': 'Très grande (2000-4999)',
      '52': 'Très grande (5000-9999)',
      '53': 'Très grande (10000+)',
    };

    return sizeMap[trancheEffectifs] || 'Taille inconnue';
  }
}

export const companyDataService = new CompanyDataService();
