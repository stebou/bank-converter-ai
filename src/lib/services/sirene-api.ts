// Service pour l'API SIRENE de l'INSEE v3.11
// Documentation officielle : https://api.insee.fr/catalogue/
// Variables disponibles : https://api.insee.fr/catalogue/
// Mode d'authentification : X-INSEE-Api-Key-Integration (mode public)

import { CompanySearchResult, SearchCriteria } from '@/types/search-criteria';
import { transformSireneToCompanyResult } from './sirene-transformer';

interface SireneApiConfig {
  baseUrl: string;
  apiKey?: string;
}

interface SireneSearchParams {
  q?: string;
  nombre?: number;
  debut?: number;
  champs?: string;
  tri?: string;
  facette?: string;
}

// Champs optimisés selon la documentation INSEE v3.11
const ESSENTIAL_UNITE_LEGALE_FIELDS = [
  'siren',
  'denominationUniteLegale',
  'denominationUsuelle1UniteLegale',
  'denominationUsuelle2UniteLegale',
  'denominationUsuelle3UniteLegale',
  'sigleUniteLegale',
  'pseudonymeUniteLegale',
  'nomUniteLegale', 
  'nomUsageUniteLegale',
  'prenom1UniteLegale',
  'prenom2UniteLegale',
  'prenom3UniteLegale',
  'prenom4UniteLegale',
  'prenomUsuelUniteLegale',
  'sexeUniteLegale',
  'categorieJuridiqueUniteLegale',
  'activitePrincipaleUniteLegale',
  'nomenclatureActivitePrincipaleUniteLegale',
  'etatAdministratifUniteLegale',
  'statutDiffusionUniteLegale',
  'dateCreationUniteLegale',
  'trancheEffectifsUniteLegale',
  'nicSiegeUniteLegale'
];

const ESSENTIAL_ETABLISSEMENT_FIELDS = [
  'siret',
  'etablissementSiege',
  'etatAdministratifEtablissement',
  'enseigne1Etablissement',
  'enseigne2Etablissement', 
  'enseigne3Etablissement',
  'denominationUsuelleEtablissement',
  'activitePrincipaleEtablissement',
  'dateCreationEtablissement',
  'numeroVoieEtablissement',
  'typeVoieEtablissement',
  'libelleVoieEtablissement',
  'complementAdresseEtablissement',
  'codePostalEtablissement',
  'libelleCommuneEtablissement',
  'codeCommuneEtablissement',
  'distributionSpecialeEtablissement'
];

const ALL_FIELDS = [
  ...ESSENTIAL_UNITE_LEGALE_FIELDS,
  ...ESSENTIAL_ETABLISSEMENT_FIELDS
].join(',');

// Interface pour la réponse brute SIRENE
interface SireneApiResponse {
  header: {
    statut: number;
    message: string;
    total: number;
    debut: number;
    nombre: number;
  };
  etablissements?: Array<{
    siren: string;
    siret: string;
    uniteLegale: {
      siren: string;
      denominationUniteLegale?: string;
      denominationUsuelle1UniteLegale?: string;
      denominationUsuelle2UniteLegale?: string;
      denominationUsuelle3UniteLegale?: string;
      sigleUniteLegale?: string;
      pseudonymeUniteLegale?: string;
      nomUniteLegale?: string;
      nomUsageUniteLegale?: string;
      prenom1UniteLegale?: string;
      prenom2UniteLegale?: string;
      prenom3UniteLegale?: string;
      prenom4UniteLegale?: string;
      prenomUsuelUniteLegale?: string;
      sexeUniteLegale?: string;
      categorieJuridiqueUniteLegale?: string;
      activitePrincipaleUniteLegale?: string;
      etatAdministratifUniteLegale?: string;
      dateCreationUniteLegale?: string;
      trancheEffectifsUniteLegale?: string;
      nicSiegeUniteLegale?: string;
      statutDiffusionUniteLegale?: string;
    };
    adresseEtablissement: {
      numeroVoieEtablissement?: string;
      typeVoieEtablissement?: string;
      libelleVoieEtablissement?: string;
      complementAdresseEtablissement?: string;
      codePostalEtablissement?: string;
      libelleCommuneEtablissement?: string;
      codeCommuneEtablissement?: string;
      distributionSpecialeEtablissement?: string;
    };
    periodesEtablissement: Array<{
      dateFin?: string;
      dateDebut: string;
      etatAdministratifEtablissement?: string;
      changementEtatAdministratifEtablissement?: boolean;
      enseigne1Etablissement?: string;
      enseigne2Etablissement?: string;
      enseigne3Etablissement?: string;
      denominationUsuelleEtablissement?: string;
      activitePrincipaleEtablissement?: string;
      nomenclatureActivitePrincipaleEtablissement?: string;
      etablissementSiege?: boolean;
      nombrePeriodesEtablissement?: number;
    }>;
  }>;
}

const DEFAULT_CONFIG: SireneApiConfig = {
  baseUrl: 'https://api.insee.fr/api-sirene/3.11',
  apiKey: process.env.INSEE_API_KEY
};

export class SireneApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any
  ) {
    super(message);
    this.name = 'SireneApiError';
  }
}

export class SireneQuotaError extends SireneApiError {
  constructor(message: string) {
    super(message, 429);
    this.name = 'SireneQuotaError';
  }
}

export class SireneValidationError extends SireneApiError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'SireneValidationError';
  }
}

/**
 * Service pour interroger l'API SIRENE de l'INSEE
 * Implémente les bonnes pratiques selon la documentation officielle v3.11
 */
export class SireneApiService {
  private config: SireneApiConfig;

  constructor(config?: Partial<SireneApiConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    
    if (!this.config.apiKey) {
      console.warn('⚠️ Clé API INSEE manquante - utilisation du mode démonstration');
    } else {
      console.log('🔧 INSEE Service initialized (integration mode)');
      console.log(`  - Integration Key: ${this.config.apiKey.substring(0, 5)}****${this.config.apiKey.slice(-4)}`);
    }
  }

  /**
   * Nettoie et valide les paramètres de recherche
   */
  private sanitizeInput(input: string): string | null {
    if (!input || typeof input !== 'string') return null;
    
    return input
      .trim()
      .replace(/[^\w\s\-."']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
  }

  /**
   * Valide les critères selon les champs disponibles INSEE v3.11
   */
  private validateCriteria(criteria: SearchCriteria): SearchCriteria {
    const validatedCriteria: SearchCriteria = {};

    if (criteria.denomination) {
      const cleaned = this.sanitizeInput(criteria.denomination);
      if (cleaned) validatedCriteria.denomination = cleaned;
    }
    if (criteria.siren) {
      const siren = criteria.siren.replace(/\D/g, '');
      if (siren.length === 9) validatedCriteria.siren = siren;
    }
    if (criteria.siret) {
      const siret = criteria.siret.replace(/\D/g, '');
      if (siret.length === 14) validatedCriteria.siret = siret;
    }
    if (criteria.codePostal) {
      const cp = criteria.codePostal.replace(/\D/g, '');
      if (cp.length === 5) validatedCriteria.codePostal = cp;
    }
    if (criteria.ville) {
      const cleaned = this.sanitizeInput(criteria.ville);
      if (cleaned) validatedCriteria.ville = cleaned;
    }
    if (criteria.activitePrincipale) {
      const cleaned = this.sanitizeInput(criteria.activitePrincipale);
      if (cleaned) validatedCriteria.activitePrincipale = cleaned;
    }
    if (criteria.categorieJuridique) {
      const cleaned = this.sanitizeInput(criteria.categorieJuridique);
      if (cleaned) validatedCriteria.categorieJuridique = cleaned;
    }
    if (criteria.trancheEffectifs) {
      const cleaned = this.sanitizeInput(criteria.trancheEffectifs);
      if (cleaned) validatedCriteria.trancheEffectifs = cleaned;
    }
    if (criteria.etatAdministratif) {
      const cleaned = this.sanitizeInput(criteria.etatAdministratif);
      if (cleaned && (cleaned === 'A' || cleaned === 'F')) {
        validatedCriteria.etatAdministratif = cleaned as 'A' | 'F';
      }
    }

    return validatedCriteria;
  }

  /**
   * Construit la requête de recherche optimisée selon la documentation INSEE
   * CORRECTION: Utilise des parenthèses correctes pour la syntaxe raisonSociale
   */
  private buildSearchQuery(freeText?: string, criteria?: SearchCriteria): string {
    const parts: string[] = [];
    const clean = this.sanitizeInput.bind(this);

    /**
     * Stratégie de recherche optimisée pour entrepreneurs individuels
     * CORRECTION: Parenthèses correctes pour la priorité des opérateurs
     */
    const buildRaisonSocialeSearch = (term: string): string => {
      if (term.includes(' ') && term.split(/\s+/).length === 2) {
        // Pour "NADIA ARAMIS" : recherche exacte + recherche large avec raisonSociale
        // CORRECTION: Parenthèses ajoutées pour grouper correctement l'OR
        return `(raisonSociale:"${term}" OR raisonSociale:${term})`;
      } else if (term.includes(' ')) {
        // Plus de 2 mots : recherche exacte uniquement
        return `raisonSociale:"${term}"`;
      } else {
        // Terme simple : recherche avec wildcard
        return `raisonSociale:${term}*`;
      }
    };

    // Recherche libre optimisée avec raisonSociale
    if (freeText && freeText.trim()) {
      const term = clean(freeText);
      if (term) {
        parts.push(buildRaisonSocialeSearch(term));
      }
    }

    // Critères spécifiques validés
    const validatedCriteria = this.validateCriteria(criteria || {});

    if (validatedCriteria.denomination) {
      if (validatedCriteria.denomination.includes(' ')) {
        const wordQueries = validatedCriteria.denomination.split(/\s+/).map(w => `${w}*`).join(' AND ');
        parts.push(`denominationUniteLegale:(${wordQueries})`);
      } else {
        parts.push(`denominationUniteLegale:${validatedCriteria.denomination}*`);
      }
    }

    if (validatedCriteria.siren) {
      parts.push(`siren:${validatedCriteria.siren}`);
    }

    if (validatedCriteria.siret) {
      parts.push(`siret:${validatedCriteria.siret}`);
    }

    if (validatedCriteria.codePostal) {
      parts.push(`codePostalEtablissement:${validatedCriteria.codePostal}`);
    }

    if (validatedCriteria.ville) {
      parts.push(`libelleCommuneEtablissement:${validatedCriteria.ville}*`);
    }

    if (validatedCriteria.activitePrincipale) {
      parts.push(`activitePrincipaleUniteLegale:${validatedCriteria.activitePrincipale}*`);
    }

    if (validatedCriteria.categorieJuridique) {
      parts.push(`categorieJuridiqueUniteLegale:${validatedCriteria.categorieJuridique}`);
    }

    if (validatedCriteria.trancheEffectifs) {
      parts.push(`trancheEffectifsUniteLegale:${validatedCriteria.trancheEffectifs}`);
    }

    // État administratif : toujours actif par défaut
    const etatAdmin = validatedCriteria.etatAdministratif || 'A';
    parts.push(`etatAdministratifUniteLegale:${etatAdmin}`);

    // Assemblage final avec logique de parenthèses correcte
    // CORRECTION: Les parenthèses sont maintenant ajoutées correctement
    if (parts.length > 1) {
      const nameSearches = parts.slice(0, -1);
      const adminSearch = parts[parts.length - 1];

      if (nameSearches.length === 1) {
        return `${nameSearches[0]} AND ${adminSearch}`;
      } else {
        return `(${nameSearches.join(' AND ')}) AND ${adminSearch}`;
      }
    }

    return parts.join(' AND ') || 'etatAdministratifUniteLegale:A';
  }

  /**
   * Effectue une requête vers l'API SIRENE
   */
  private async makeRequest(endpoint: string, params: SireneSearchParams): Promise<SireneApiResponse> {
    const url = new URL(endpoint, this.config.baseUrl);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    console.log('📡 Making SIRENE API request to:', url.toString());

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'bank-converter-ai/1.0.0'
    };

    if (this.config.apiKey) {
      headers['X-INSEE-Api-Key-Integration'] = this.config.apiKey;
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
      });

      const responseText = await response.text();
      let responseData: SireneApiResponse;

      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        throw new SireneApiError(`Réponse INSEE invalide: ${responseText.substring(0, 200)}...`);
      }

      if (!response.ok) {
        const errorText = responseText;
        
        if (response.status === 429) {
          throw new SireneQuotaError('Quota API INSEE dépassé');
        }
        
        if (response.status === 400) {
          throw new SireneValidationError(`Erreur de syntaxe dans la requête: ${errorText}`);
        }

        console.log(`⚠️ SIRENE request failed (integration key): ${response.status}`);
        console.log(`Response body: ${errorText}`);
        console.log('Failed request details:', {
          url: url.toString(),
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });

        throw new SireneApiError(`INSEE API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      if (this.config.apiKey) {
        console.log('✅ SIRENE request success with integration key');
      } else {
        console.log('✅ SIRENE request success (demo mode)');
      }

      return responseData;
    } catch (error) {
      console.error('🚫 SIRENE request error:', error);
      throw error;
    }
  }

  /**
   * Recherche d'entreprises via l'API SIRENE
   */
  async searchCompanies(
    query?: string,
    criteria: SearchCriteria = {},
    page: number = 1,
    limit: number = 20
  ): Promise<CompanySearchResult> {
    try {
      console.log('🔍 Recherche d\'entreprises avec les critères:', {
        query,
        criteria,
        page,
        limit
      });

      const searchQuery = this.buildSearchQuery(query, criteria);
      console.log('📡 Requête SIRENE (centralisée):', searchQuery);

      const params: SireneSearchParams = {
        q: searchQuery,
        nombre: Math.min(limit, 1000),
        debut: (page - 1) * limit,
        champs: ALL_FIELDS,
        tri: 'score desc'
      };

      console.log('SIRENE API: Searching for companies with params:', params);

      const response = await this.makeRequest('/siret', params);

      console.log('✅ Réponse SIRENE reçue:', {
        totalHeader: response.header.total,
        returned: response.etablissements?.length || 0,
        debut: response.header.debut,
        nombre: response.header.nombre
      });

      const results = response.etablissements?.map(etablissement => 
        transformSireneToCompanyResult(etablissement as any)
      ) || [];

      return {
        companies: results,
        meta: {
          total: response.header.total,
          page,
          limit,
          totalPages: Math.ceil(response.header.total / limit)
        }
      };

    } catch (error) {
      console.error('SIRENE API search failed:', error);

      if (error instanceof SireneApiError) {
        throw error;
      }

      console.log('❌ Erreur API SIRENE:', error);
      console.log('⚠️  Utilisation des données de démonstration (fallback)');

      return {
        results: [
          {
            siren: '123456789',
            siret: '12345678901234',
            denomination: `Résultat de démonstration pour "${query || 'recherche'}"`,
            activitePrincipale: '6201Z',
            activitePrincipaleLibelle: 'Programmation informatique',
            categorieJuridique: '5710',
            etatAdministratif: 'A',
            adresseComplete: '123 RUE DE DEMO 75001 PARIS',
            ville: 'PARIS',
            codePostal: '75001',
            dateCreation: '2020-01-01',
            siege: true,
            trancheEffectifs: '01'
          }
        ],
        meta: {
          total: 1,
          page,
          limit,
          totalPages: 1
        }
      };
    }
  }

  async searchBySiren(siren: string): Promise<CompanySearchResult> {
    return this.searchCompanies(undefined, { siren }, 1, 10);
  }

  async searchBySiret(siret: string): Promise<CompanySearchResult> {
    return this.searchCompanies(undefined, { siret }, 1, 1);
  }

  async searchByDenomination(denomination: string, limit: number = 20): Promise<CompanySearchResult> {
    return this.searchCompanies(denomination, {}, 1, limit);
  }

  async searchEntrepreneursIndividuels(nom: string, prenom?: string, limit: number = 20): Promise<CompanySearchResult> {
    const query = prenom ? `${prenom} ${nom}` : nom;
    return this.searchCompanies(query, {}, 1, limit);
  }

  async searchByLocation(ville?: string, codePostal?: string, limit: number = 20): Promise<CompanySearchResult> {
    return this.searchCompanies(undefined, { ville, codePostal }, 1, limit);
  }

  async searchByActivity(activitePrincipale: string, limit: number = 20): Promise<CompanySearchResult> {
    return this.searchCompanies(undefined, { activitePrincipale }, 1, limit);
  }
}

export const sireneApi = new SireneApiService();
