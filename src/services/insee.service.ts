// Service spécialisé pour l'API INSEE SIRENE

import type {
    CompanySearchParams,
    CompanySearchResult,
    INSEECompany
} from '../types/company';

export class INSEEService {
  private baseUrl = 'https://api.insee.fr/entreprises/sirene/V3.11';
  private integrationKey = 'f67ad8b5-4a70-3bc7-8dd5-7d8e4d62c7a8';

  /**
   * Teste la connexion à l'API INSEE
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const testUrl = `${this.baseUrl}/siret?q=denomination:TEST&nombre=1`;
      const response = await fetch(testUrl, {
        headers: {
          'Authorization': `Bearer ${this.integrationKey}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Erreur HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        message: `Connexion réussie - API INSEE fonctionnelle (${data.header?.total || 0} résultats disponibles)`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      };
    }
  }

  /**
   * Recherche d'entreprises avec pagination
   */
  async searchCompanies(params: CompanySearchParams): Promise<CompanySearchResult> {
    console.log('🔍 Recherche INSEE avec paramètres:', params);

    const queryParts: string[] = [];

    // Construction de la requête
    if (params.q) {
      queryParts.push(params.q);
    } else {
      if (params.siren) {
        queryParts.push(`siren:${params.siren}`);
      }
      if (params.siret) {
        queryParts.push(`siret:${params.siret}`);
      }
      if (params.nom) {
        queryParts.push(`denomination:"${params.nom}"`);
      }
      if (params.ville) {
        queryParts.push(`libelleCommuneEtablissement:"${params.ville}"`);
      }
      if (params.departement) {
        queryParts.push(`codeCommuneEtablissement:${params.departement}*`);
      }
      if (params.activitePrincipale) {
        queryParts.push(`activitePrincipaleEtablissement:${params.activitePrincipale}`);
      }
      if (params.categorieJuridique) {
        queryParts.push(`categorieJuridiqueUniteLegale:${params.categorieJuridique}`);
      }
      if (params.etatAdministratif) {
        queryParts.push(`etatAdministratifEtablissement:${params.etatAdministratif}`);
      }
      if (typeof params.siege === 'boolean') {
        queryParts.push(`etablissementSiege:${params.siege}`);
      }
    }

    const query = queryParts.join(' AND ');
    const searchUrl = `${this.baseUrl}/siret`;
    const searchParams = new URLSearchParams({
      q: query,
      nombre: (params.nombre || 20).toString(),
      ...(params.page && { debut: ((params.page - 1) * (params.nombre || 20)).toString() }),
    });

    const url = `${searchUrl}?${searchParams}`;
    console.log('🌐 URL de recherche INSEE:', url);

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.integrationKey}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const companies = data.etablissements?.map(this.mapINSEEToCompany) || [];

      return {
        companies,
        total: data.header?.total || 0,
        page: params.page || 1,
        totalPages: Math.ceil((data.header?.total || 0) / (params.nombre || 20)),
      };
    } catch (error) {
      console.error('❌ Erreur recherche INSEE:', error);
      throw error;
    }
  }

  /**
   * Récupère tous les résultats d'une recherche (avec pagination automatique)
   */
  async getAllSearchResults(params: CompanySearchParams): Promise<CompanySearchResult> {
    console.log('🔍 Récupération de TOUS les résultats INSEE pour:', params);

    const allCompanies: INSEECompany[] = [];
    let currentPage = 1;
    let totalResults = 0;
    const resultsPerPage = 1000; // Maximum autorisé par l'API INSEE

    while (true) {
      const pageParams: CompanySearchParams = {
        ...params,
        nombre: resultsPerPage,
        page: currentPage,
      };

      try {
        const pageResult = await this.searchCompanies(pageParams);

        if (currentPage === 1) {
          totalResults = pageResult.total;
          console.log(`📊 Total de ${totalResults} résultats à récupérer`);
        }

        allCompanies.push(...pageResult.companies);
        console.log(`📄 Page ${currentPage}: ${pageResult.companies.length} entreprises récupérées (${allCompanies.length}/${totalResults})`);

        // Arrêter si on a récupéré tous les résultats ou si la page est vide
        if (pageResult.companies.length === 0 || allCompanies.length >= totalResults) {
          break;
        }

        currentPage++;

        // Protection contre les boucles infinies
        if (currentPage > 100) {
          console.warn('⚠️ Arrêt forcé après 100 pages pour éviter une boucle infinie');
          break;
        }

        // Délai pour respecter les limites de l'API
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`❌ Erreur lors de la récupération de la page ${currentPage}:`, error);
        break;
      }
    }

    return {
      companies: allCompanies,
      total: totalResults,
    };
  }

  /**
   * Mappe les données INSEE vers notre format interne
   */
  private mapINSEEToCompany(etablissement: any): INSEECompany {
    const uniteLegale = etablissement.uniteLegale || {};
    const adresseEtablissement = etablissement.adresseEtablissement || {};

    return {
      siren: uniteLegale.siren || '',
      siret: etablissement.siret || '',
      denomination: uniteLegale.denominationUniteLegale || 
                   uniteLegale.prenom1UniteLegale + ' ' + uniteLegale.nomUniteLegale || 
                   'Nom non disponible',
      categorieJuridique: uniteLegale.categorieJuridiqueUniteLegale || '',
      activitePrincipale: etablissement.activitePrincipaleEtablissement || '',
      activitePrincipaleLibelle: etablissement.activitePrincipaleEtablissement || '',
      adresse: {
        numeroVoie: adresseEtablissement.numeroVoieEtablissement,
        typeVoie: adresseEtablissement.typeVoieEtablissement,
        libelleVoie: adresseEtablissement.libelleVoieEtablissement,
        codePostal: adresseEtablissement.codePostalEtablissement || '',
        libelleCommuneEtablissement: adresseEtablissement.libelleCommuneEtablissement || '',
        codeCommuneEtablissement: adresseEtablissement.codeCommuneEtablissement || '',
        distributionSpeciale: adresseEtablissement.distributionSpecialeEtablissement,
        libellePaysEtranger: adresseEtablissement.libellePaysEtrangerEtablissement,
        codePaysEtranger: adresseEtablissement.codePaysEtrangerEtablissement,
      },
      etatAdministratif: etablissement.etatAdministratifEtablissement as 'A' | 'F' || 'A',
      dateCreation: etablissement.dateCreationEtablissement || '',
      dateDerniereMiseAJour: etablissement.dateDernierTraitementEtablissement || '',
      siege: etablissement.etablissementSiege === 'true',
      trancheEffectifs: etablissement.trancheEffectifsEtablissement,
    };
  }
}

export const inseeService = new INSEEService();
