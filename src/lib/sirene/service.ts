// Service SIRENE unifié - Combine le meilleur de sirene.ts et sirene-api.ts
// Documentation officielle : https://api.insee.fr/catalogue/
// Mode d'authentification : X-INSEE-Api-Key-Integration (mode public)

import {
  SireneApiConfig,
  SireneSearchParams,
  SireneApiResponse,
  SireneApiError,
  SireneQuotaError,
  SireneValidationError,
} from './types';
import { SearchCriteria, CompanySearchResponse } from '@/types/search-criteria';
import { transformSireneToCompanyResult } from './transformers';
import { buildSearchQuery, validateCriteria, ALL_FIELDS, isValidSiren, isValidSiret, isValidDate } from './utils';

const DEFAULT_CONFIG: SireneApiConfig = {
  baseUrl: 'https://api.insee.fr/api-sirene/3.11',
  apiKey: process.env.INSEE_API_KEY || process.env.NEXT_PUBLIC_INSEE_API_KEY,
};

/**
 * Service unifié pour l'API SIRENE de l'INSEE v3.11
 * Combine les bonnes pratiques et fonctionnalités des anciens services
 */
export class SireneService {
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
   * Effectue une requête vers l'API SIRENE avec gestion complète des erreurs
   */
  private async makeRequest(
    endpoint: string,
    params: SireneSearchParams
  ): Promise<SireneApiResponse> {
    // Construire l'URL complète en évitant les problèmes de construction
    const baseUrl = this.config.baseUrl.endsWith('/') ? this.config.baseUrl : this.config.baseUrl + '/';
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = new URL(cleanEndpoint, baseUrl);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    console.log('📡 Making SIRENE API request to:', url.toString());

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'bank-converter-ai/1.0.0',
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
        throw new SireneApiError(
          `Réponse INSEE invalide: ${responseText.substring(0, 200)}...`
        );
      }

      if (!response.ok) {
        const errorText = responseText;

        if (response.status === 429) {
          throw new SireneQuotaError('Quota API INSEE dépassé');
        }

        if (response.status === 400) {
          throw new SireneValidationError(
            `Erreur de syntaxe dans la requête: ${errorText}`
          );
        }

        // 404 n'est pas une erreur, juste aucun résultat
        if (response.status === 404) {
          console.log('ℹ️ Aucun établissement trouvé (404)');
          return {
            header: {
              statut: 404,
              message: 'Aucun résultat trouvé',
              total: 0,
              debut: 0,
              nombre: 0,
            },
            etablissements: [],
          };
        }

        console.log(`⚠️ SIRENE request failed: ${response.status}`);
        console.log(`Response body: ${errorText}`);

        throw new SireneApiError(
          `INSEE API request failed: ${response.status} ${response.statusText} - ${errorText}`
        );
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
   * Recherche d'entreprises via l'API SIRENE (méthode principale)
   */
  async searchCompanies(
    query?: string,
    criteria: SearchCriteria = {},
    page: number = 1,
    limit: number = 20
  ): Promise<CompanySearchResponse> {
    try {
      console.log('🔍 Recherche d\'entreprises avec les critères:', {
        query,
        criteria,
        page,
        limit,
      });

      const searchQuery = buildSearchQuery(query, criteria);
      console.log('📡 Requête SIRENE (unifiée):', searchQuery);

      const params: SireneSearchParams = {
        q: searchQuery,
        nombre: Math.min(limit, 1000),
        debut: (page - 1) * limit,
        champs: ALL_FIELDS,
        tri: 'score desc',
      };

      console.log('SIRENE API: Searching for companies with params:', params);

      const response = await this.makeRequest('/siret', params);

      console.log('✅ Réponse SIRENE reçue:', {
        totalHeader: response.header.total,
        returned: response.etablissements?.length || 0,
        debut: response.header.debut,
        nombre: response.header.nombre,
      });

      const results =
        response.etablissements?.map(etablissement =>
          transformSireneToCompanyResult(etablissement as any)
        ) || [];

      return {
        companies: results,
        meta: {
          total: response.header.total,
          page,
          limit,
          totalPages: Math.ceil(response.header.total / limit),
        },
      };
    } catch (error) {
      console.error('SIRENE API search failed:', error);

      if (error instanceof SireneApiError) {
        throw error;
      }

      console.log('❌ Erreur API SIRENE:', error);
      console.log('⚠️  Utilisation des données de démonstration (fallback)');

      return {
        companies: [
          {
            siren: '123456789',
            siret: '12345678901234',
            denomination: `Résultat de démonstration pour "${query || 'recherche'}"`,
            activitePrincipale: '6201Z',
            activitePrincipaleLibelle: 'Programmation informatique',
            categorieJuridique: '5710',
            etatAdministratif: 'A',
            adresse: {
              numeroVoie: '123',
              typeVoie: 'RUE',
              libelleVoie: 'DE DEMO',
              codePostal: '75001',
              commune: 'PARIS',
              departement: '75',
              region: 'Île-de-France'
            },
            dateCreation: '2020-01-01',
            trancheEffectifs: '01',
          },
        ],
        meta: {
          total: 1,
          page,
          limit,
          totalPages: 1,
        },
      };
    }
  }

  /**
   * Recherche simplifiée par dénomination (compatibilité avec l'ancien sirene.ts)
   */
  async searchCompaniesByName(query: string, limit = 10): Promise<any[]> {
    const response = await this.searchCompanies(query, {}, 1, limit);
    return response.companies;
  }

  /**
   * Recherche avec filtres multicritères (compatibilité avec l'ancien sirene.ts)
   */
  async searchCompaniesWithFilters(
    query: string = '',
    filters: Record<string, string> = {},
    limit = 10
  ): Promise<any[]> {
    // Convertir les filtres au format SearchCriteria
    const criteria: SearchCriteria = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim()) {
        switch (key) {
          case 'codePostalEtablissement':
            criteria.codePostal = value;
            break;
          case 'libelleCommuneEtablissement':
            criteria.ville = value;
            break;
          case 'activitePrincipaleUniteLegale':
          case 'activitePrincipaleEtablissement':
            criteria.activitePrincipale = value;
            break;
          case 'trancheEffectifsUniteLegale':
            criteria.trancheEffectifs = value;
            break;
          case 'etatAdministratifEtablissement':
            criteria.etatAdministratif = value as 'A' | 'F';
            break;
          case 'categorieJuridiqueUniteLegale':
            criteria.categorieJuridique = value;
            break;
          case 'siren':
            criteria.siren = value;
            break;
          case 'siret':
            criteria.siret = value;
            break;
          case 'dateCreationUniteLegaleDebut':
            criteria.dateCreationDebut = value;
            break;
          case 'dateCreationUniteLegaleFin':
            criteria.dateCreationFin = value;
            break;
          case 'departement':
            criteria.departement = value;
            break;
        }
      }
    });

    const response = await this.searchCompanies(query, criteria, 1, limit);
    return response.companies;
  }

  /**
   * Recherche par SIREN
   */
  async searchBySiren(siren: string): Promise<CompanySearchResponse> {
    if (!isValidSiren(siren)) {
      throw new SireneValidationError('SIREN doit être un numéro à 9 chiffres');
    }
    return this.searchCompanies(undefined, { siren }, 1, 10);
  }

  /**
   * Recherche par SIRET
   */
  async searchBySiret(siret: string): Promise<CompanySearchResponse> {
    if (!isValidSiret(siret)) {
      throw new SireneValidationError('SIRET doit être un numéro à 14 chiffres');
    }
    return this.searchCompanies(undefined, { siret }, 1, 1);
  }

  /**
   * Recherche par dénomination
   */
  async searchByDenomination(
    denomination: string,
    limit: number = 20
  ): Promise<CompanySearchResponse> {
    return this.searchCompanies(denomination, {}, 1, limit);
  }

  /**
   * Recherche d'entrepreneurs individuels
   */
  async searchEntrepreneursIndividuels(
    nom: string,
    prenom?: string,
    limit: number = 20
  ): Promise<CompanySearchResponse> {
    const query = prenom ? `${prenom} ${nom}` : nom;
    return this.searchCompanies(query, {}, 1, limit);
  }

  /**
   * Recherche par localisation
   */
  async searchByLocation(
    ville?: string,
    codePostal?: string,
    limit: number = 20
  ): Promise<CompanySearchResponse> {
    return this.searchCompanies(undefined, { ville, codePostal }, 1, limit);
  }

  /**
   * Recherche par activité
   */
  async searchByActivity(
    activitePrincipale: string,
    limit: number = 20
  ): Promise<CompanySearchResponse> {
    return this.searchCompanies(undefined, { activitePrincipale }, 1, limit);
  }

  /**
   * Récupère une unité légale par SIREN
   */
  async getUniteLegale(siren: string, date?: string): Promise<any> {
    if (!isValidSiren(siren)) {
      throw new SireneValidationError('SIREN doit être un numéro à 9 chiffres');
    }

    if (date && !isValidDate(date)) {
      throw new SireneValidationError('Date doit être au format AAAA-MM-JJ');
    }

    try {
      const url = `${this.config.baseUrl}/siren/${siren}`;
      const params = new URLSearchParams();
      
      if (date) {
        params.append('date', date);
      }
      
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      
      if (this.config.apiKey) {
        headers['X-INSEE-Api-Key-Integration'] = this.config.apiKey;
      }

      const response = await fetch(`${url}?${params}`, { headers });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'unité légale:', error);
      throw error;
    }
  }

  /**
   * Récupère les informations complètes d'une entreprise par SIREN
   */
  async getCompanyBySiren(siren: string): Promise<any | null> {
    try {
      const response = await this.searchBySiren(siren);
      
      if (response.companies && response.companies.length > 0) {
        return response.companies[0];
      }

      return null;
    } catch (error) {
      console.error(
        `❌ Erreur lors de la récupération des données pour SIREN ${siren}:`,
        error
      );
      return null;
    }
  }

  /**
   * Extrait les données de la période courante d'une unité légale
   */
  static getCurrentPeriodData(uniteLegale: any): any {
    if (!uniteLegale?.periodesUniteLegale) {
      return null;
    }

    // Trouve la période courante (sans date de fin)
    const periodeCourante = uniteLegale.periodesUniteLegale.find(
      (p: any) => p.dateFin === null
    );

    return periodeCourante || uniteLegale.periodesUniteLegale[0];
  }
}

// Instance par défaut pour compatibilité avec l'ancien code
export const sireneService = new SireneService();