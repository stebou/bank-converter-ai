// Service pour l'intégration avec les APIs publiques d'entreprises
// INSEE Sirene, LinkedIn Organization Lookup, etc.

export interface INSEECompany {
  siren: string;
  siret: string;
  denomination: string;
  categorieJuridique: string;
  activitePrincipale: string;
  activitePrincipaleLibelle: string;
  adresse: {
    numeroVoie?: string;
    typeVoie?: string;
    libelleVoie?: string;
    codePostal: string;
    libelleCommuneEtranger?: string;
    codeCommuneEtranger?: string;
    libelleCommuneEtablissement: string;
    codeCommuneEtablissement: string;
    distributionSpeciale?: string;
    libellePaysEtranger?: string;
    codePaysEtranger?: string;
  };
  etatAdministratif: 'A' | 'F'; // Actif ou Fermé
  dateCreation: string;
  dateDerniereMiseAJour: string;
  siege: boolean;
  trancheEffectifs?: string;
  // Nouvelles données dirigeants
  dirigeants?: {
    nom?: string;
    prenom?: string;
    nomUsage?: string;
    pseudonyme?: string;
    qualite?: string; // Gérant, Président, etc.
    dateNaissance?: string;
  }[];
}

export interface LinkedInOrganization {
  organizationUrn: string;
  name: string;
  vanityName?: string;
  description?: string;
  website?: string;
  followerCount?: number;
  industries?: string[];
  logoUrl?: string;
  coverImageUrl?: string;
  lastUpdated: string;
}

export interface EnrichedCompany extends INSEECompany {
  score: number;
  tags: string[];
  linkedin?: LinkedInOrganization;
  website?: string;
  domain?: string;
  phone?: string;
  email?: string;
}

class CompanyDataService {
  private readonly INSEE_API_BASE = 'https://api.insee.fr/api-sirene/3.11';
  private readonly INSEE_API_KEY = process.env.NEXT_PUBLIC_INSEE_API_KEY;
  private readonly LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';
  private readonly LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;

  /**
   * Test de connectivité à l'API INSEE
   */
  async testInseeConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.INSEE_API_KEY) {
      return { 
        success: false, 
        message: 'Clé API INSEE manquante. Veuillez créer une application sur https://api.insee.fr/catalogue/ et configurer la clé NEXT_PUBLIC_INSEE_API_KEY' 
      };
    }

    try {
      // Test simple avec une recherche limitée
      const response = await fetch(`${this.INSEE_API_BASE}/siret?q=siren:552100554&nombre=1`, {
        headers: {
          'X-INSEE-Api-Key-Integration': this.INSEE_API_KEY,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return { 
          success: false, 
          message: `Erreur API INSEE: ${response.status} - ${response.statusText}` 
        };
      }

      const data = await response.json();
      return { 
        success: true, 
        message: `Connexion réussie - API INSEE fonctionnelle (${data.header?.total || 0} résultats disponibles)` 
      };
    } catch (error) {
      return { 
        success: false, 
        message: `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
      };
    }
  }

  /**
   * Récupère TOUS les résultats d'une recherche automatiquement
   * Gère la pagination automatique jusqu'à récupérer tous les résultats disponibles
   * 
   * @param params Paramètres de recherche identiques à searchCompanies
   * @returns Tous les résultats de la recherche
   */
  async getAllSearchResults(params: {
    q?: string;
    siren?: string;
    siret?: string;
    nom?: string;
    ville?: string;
    departement?: string;
    region?: string;
    activitePrincipale?: string;
    categorieJuridique?: string;
    etatAdministratif?: 'A' | 'F';
    siege?: boolean;
  }): Promise<{ companies: INSEECompany[]; total: number }> {
    console.log('🔍 Récupération de TOUS les résultats INSEE pour:', params);
    
    let allCompanies: INSEECompany[] = [];
    let currentPage = 1;
    let totalResults = 0;
    const resultsPerPage = 1000; // Maximum autorisé par l'API INSEE
    
    while (true) {
      const pageParams = {
        ...params,
        nombre: resultsPerPage,
        page: currentPage
      };
      
      try {
        const pageResult = await this.searchCompanies(pageParams);
        
        if (currentPage === 1) {
          totalResults = pageResult.total;
          console.log(`📊 Total des résultats disponibles: ${totalResults}`);
          
          // Si aucun résultat, on retourne directement
          if (totalResults === 0) {
            return { companies: [], total: 0 };
          }
        }
        
        allCompanies.push(...pageResult.companies);
        console.log(`📄 Page ${currentPage}: ${pageResult.companies.length} résultats récupérés (Total: ${allCompanies.length}/${totalResults})`);
        
        // Si on a récupéré moins de résultats que demandé, on a atteint la fin
        if (pageResult.companies.length < resultsPerPage) {
          break;
        }
        
        // Si on a récupéré tous les résultats disponibles
        if (allCompanies.length >= totalResults) {
          break;
        }
        
        currentPage++;
        
        // Sécurité : éviter les boucles infinies (max 10 pages = 10 000 résultats)
        if (currentPage > 10) {
          console.warn('⚠️ Limite de sécurité atteinte: 10 pages maximum (10 000 résultats)');
          break;
        }
        
      } catch (error) {
        console.error(`❌ Erreur lors de la récupération de la page ${currentPage}:`, error);
        break;
      }
    }
    
    // Déduplication finale par SIRET
    const seenSirets = new Set<string>();
    const uniqueCompanies = allCompanies.filter(company => {
      if (seenSirets.has(company.siret)) {
        return false;
      }
      seenSirets.add(company.siret);
      return true;
    });
    
    console.log(`✅ Récupération terminée: ${allCompanies.length} résultats → ${uniqueCompanies.length} après déduplication`);
    
    return {
      companies: uniqueCompanies,
      total: uniqueCompanies.length // Le total réel après déduplication
    };
  }

  /**
   * Recherche d'entreprises dans la base Sirene de l'INSEE
   * 
   * Supporte plusieurs types de recherche :
   * - Dénomination sociale (ex: "RENAULT", "TOTAL ENERGIES")
   * - Nom propre pour entrepreneurs individuels (ex: "Jean Dupont", "Marie Martin")
   * - Recherche mixte avec fallback intelligent
   * 
   * Exemples d'utilisation :
   * - "Apple" → trouve les entreprises avec "Apple" dans la dénomination
   * - "Jean Dupont" → trouve les entreprises de Jean Dupont (prenom + nom)
   * - "Dupont Jean" → trouve aussi les entreprises (nom + prenom inversé)
   * - "Marie" → trouve les entreprises avec "Marie" dans prénom, nom ou dénomination
   * 
   * @param params Paramètres de recherche
   * @returns Résultats de recherche avec total et entreprises
   */
  async searchCompanies(params: {
    q?: string; // Recherche libre
    siren?: string;
    siret?: string;
    nom?: string; // Dénomination sociale OU nom propre (prenom nom)
    ville?: string;
    departement?: string;
    region?: string;
    activitePrincipale?: string;
    categorieJuridique?: string;
    etatAdministratif?: 'A' | 'F';
    siege?: boolean;
    page?: number;
    nombre?: number;
  }): Promise<{ companies: INSEECompany[]; total: number }> {
    if (!this.INSEE_API_KEY) {
      throw new Error('Clé API INSEE manquante');
    }

    const searchParams = new URLSearchParams();
    
    // Construction de la requête
    if (params.q) {
      searchParams.append('q', params.q);
    } else {
      const queryParts: string[] = [];
      
      if (params.siren) queryParts.push(`siren:${params.siren}`);
      if (params.siret) queryParts.push(`siret:${params.siret}`);
      
      // Construction de la requête pour le nom d'entreprise ou nom propre
      if (params.nom) {
        const nomQueries = [];
        
        // Recherche par dénomination sociale
        if (params.nom.includes(' ')) {
          nomQueries.push(`denominationUniteLegale:"${params.nom}"`);
        } else {
          nomQueries.push(`denominationUniteLegale:${params.nom}*`);
        }
        
        // Recherche par nom propre (prenom + nom) pour les entrepreneurs individuels
        const words = params.nom.trim().split(/\s+/);
        if (words.length >= 2) {
          // Si on a au moins 2 mots, on essaie prenom + nom
          const [prenom, ...nomParts] = words;
          const nom = nomParts.join(' ');
          nomQueries.push(`(prenom1UniteLegale:${prenom}* AND nomUniteLegale:${nom}*)`);
          
          // Essayer aussi dans l'autre sens (nom + prenom)
          const [nom2, ...prenomParts] = words;
          const prenom2 = prenomParts.join(' ');
          if (prenomParts.length > 0) {
            nomQueries.push(`(prenom1UniteLegale:${prenom2}* AND nomUniteLegale:${nom2}*)`);
          }
        } else {
          // Si un seul mot, chercher dans prenom OU nom
          nomQueries.push(`(prenom1UniteLegale:${params.nom}* OR nomUniteLegale:${params.nom}*)`);
        }
        
        // Combiner toutes les recherches nom avec OR
        queryParts.push(`(${nomQueries.join(' OR ')})`);
      }
      
      if (params.ville) {
        const villeQuery = params.ville.includes(' ')
          ? `libelleCommuneEtablissement:"${params.ville}"`
          : `libelleCommuneEtablissement:${params.ville}`;
        queryParts.push(villeQuery);
      }
      if (params.departement) queryParts.push(`codeCommuneEtablissement:${params.departement}*`);
      // Variables historisées doivent être dans periode() selon la documentation officielle
      if (params.activitePrincipale) queryParts.push(`periode(activitePrincipaleEtablissement:${params.activitePrincipale})`);
      if (params.etatAdministratif) queryParts.push(`periode(etatAdministratifEtablissement:${params.etatAdministratif})`);
      if (params.siege !== undefined) queryParts.push(`etablissementSiege:${params.siege}`);
      
      if (queryParts.length > 0) {
        searchParams.append('q', queryParts.join(' AND '));
      }
    }

    searchParams.append('nombre', (params.nombre || 20).toString());
    if (params.page && params.page > 1) {
      // Correction selon la doc officielle : debut commence à 0
      searchParams.append('debut', ((params.page - 1) * (params.nombre || 20)).toString());
    }

    try {
      const finalURL = `${this.INSEE_API_BASE}/siret?${searchParams.toString()}`;
      console.log('🔍 URL API INSEE:', finalURL);
      console.log('🔑 Clé API utilisée:', this.INSEE_API_KEY ? this.INSEE_API_KEY.substring(0, 8) + '...' : 'MANQUANTE');
      
      const response = await fetch(finalURL, {
        headers: {
          'X-INSEE-Api-Key-Integration': this.INSEE_API_KEY,
          'Accept': 'application/json'
        }
      });

      console.log('📊 Statut réponse INSEE:', response.status);
      
      // Si la recherche exacte avec guillemets retourne 404 et qu'on a un nom avec espaces,
      // on essaie une recherche avec les mots séparés ET recherche par nom propre
      if (!response.ok && response.status === 404 && params.nom && params.nom.includes(' ')) {
        console.log('🔄 Tentative de recherche alternative avec mots séparés et nom propre...');
        
        // Construire une nouvelle requête avec des mots séparés
        const fallbackQuery = new URLSearchParams();
        const words = params.nom.trim().split(/\s+/);
        
        // Différentes stratégies de recherche alternative
        const fallbackStrategies = [];
        
        // 1. Recherche par mots-clés dans dénomination
        const wordQueries = words.map(word => `denominationUniteLegale:${word}*`);
        fallbackStrategies.push(`(${wordQueries.join(' AND ')})`);
        
        // 2. Recherche par nom propre si on a au moins 2 mots
        if (words.length >= 2) {
          const [prenom, ...nomParts] = words;
          const nom = nomParts.join(' ');
          fallbackStrategies.push(`(prenom1UniteLegale:${prenom}* AND nomUniteLegale:${nom}*)`);
          
          // Essayer aussi dans l'autre sens
          const [nom2, ...prenomParts] = words;
          const prenom2 = prenomParts.join(' ');
          if (prenomParts.length > 0) {
            fallbackStrategies.push(`(prenom1UniteLegale:${prenom2}* AND nomUniteLegale:${nom2}*)`);
          }
        }
        
        // 3. Recherche floue : chaque mot dans dénomination OU nom/prénom
        const flexibleQueries = words.map(word => 
          `(denominationUniteLegale:${word}* OR prenom1UniteLegale:${word}* OR nomUniteLegale:${word}*)`
        );
        fallbackStrategies.push(`(${flexibleQueries.join(' AND ')})`);
        
        const queryParts = [`(${fallbackStrategies.join(' OR ')})`];
        
        // Ajouter les autres critères de recherche
        if (params.siren) {
          queryParts.push(`siren:${params.siren}`);
        }
        
        if (params.siret) {
          queryParts.push(`siret:${params.siret}`);
        }
        
        if (params.ville) {
          if (params.ville.includes(' ')) {
            queryParts.push(`libelleCommuneEtablissement:"${params.ville}"`);
          } else {
            queryParts.push(`libelleCommuneEtablissement:${params.ville}*`);
          }
        }
        
        // Ajouter le filtre pour les établissements actifs
        queryParts.push('periode(etatAdministratifEtablissement:A)');
        
        fallbackQuery.append('q', queryParts.join(' AND '));
        fallbackQuery.append('nombre', (params.nombre || 20).toString());
        if (params.page && params.page > 1) {
          fallbackQuery.append('debut', ((params.page - 1) * (params.nombre || 20)).toString());
        }
        
        const fallbackURL = `${this.INSEE_API_BASE}/siret?${fallbackQuery.toString()}`;
        console.log('🔄 URL alternative:', fallbackURL);
        
        const fallbackResponse = await fetch(fallbackURL, {
          headers: {
            'X-INSEE-Api-Key-Integration': this.INSEE_API_KEY,
            'Accept': 'application/json'
          }
        });
        
        console.log('📊 Statut réponse alternative:', fallbackResponse.status);
        
        if (fallbackResponse.ok) {
          console.log('✅ Recherche alternative réussie !');
          // Utiliser la réponse alternative
          const fallbackData = await fallbackResponse.json();
          
          const allCompanies: INSEECompany[] = fallbackData.etablissements?.map((etab: any) => ({
            siren: etab.siren,
            siret: etab.siret,
            denomination: etab.uniteLegale?.denominationUniteLegale || 
                         etab.uniteLegale?.prenom1UniteLegale + ' ' + etab.uniteLegale?.nomUniteLegale ||
                         'Dénomination inconnue',
            categorieJuridique: etab.uniteLegale?.categorieJuridiqueUniteLegale,
            activitePrincipale: etab.activitePrincipaleEtablissement,
            activitePrincipaleLibelle: etab.activitePrincipaleEtablissement ? 
              this.getNAFLabel(etab.activitePrincipaleEtablissement) : '',
            adresse: {
              numeroVoie: etab.adresseEtablissement?.numeroVoieEtablissement,
              typeVoie: etab.adresseEtablissement?.typeVoieEtablissement,
              libelleVoie: etab.adresseEtablissement?.libelleVoieEtablissement,
              codePostal: etab.adresseEtablissement?.codePostalEtablissement,
              libelleCommuneEtablissement: etab.adresseEtablissement?.libelleCommuneEtablissement,
              codeCommuneEtablissement: etab.adresseEtablissement?.codeCommuneEtablissement,
            },
            etatAdministratif: etab.etatAdministratifEtablissement,
            dateCreation: etab.dateCreationEtablissement,
            dateDerniereMiseAJour: etab.dateDernierTraitementEtablissement,
            siege: etab.etablissementSiege === 'true',
            trancheEffectifs: etab.trancheEffectifsEtablissement
          })) || [];

          // Déduplication par SIRET
          const seenSirets = new Set<string>();
          const uniqueCompanies = allCompanies.filter(company => {
            if (seenSirets.has(company.siret)) {
              return false;
            }
            seenSirets.add(company.siret);
            return true;
          });

          console.log('📊 Résultats INSEE:', 
            allCompanies.length, 'bruts →', 
            uniqueCompanies.length, 'après déduplication'
          );

          return {
            companies: uniqueCompanies,
            total: fallbackData.header?.total || 0
          };
        }
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur API INSEE:', response.status, errorText);
        console.error('🔍 URL qui a échoué:', finalURL);
        console.error('🔑 En-têtes utilisés:', {
          'X-INSEE-Api-Key-Integration': this.INSEE_API_KEY ? this.INSEE_API_KEY.substring(0, 8) + '...' : 'MANQUANTE',
          'Accept': 'application/json'
        });
        throw new Error(`Erreur API INSEE: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      const allCompanies: INSEECompany[] = data.etablissements?.map((etab: any) => ({
        siren: etab.siren,
        siret: etab.siret,
        denomination: etab.uniteLegale?.denominationUniteLegale || 
                     etab.uniteLegale?.prenom1UniteLegale + ' ' + etab.uniteLegale?.nomUniteLegale ||
                     'Dénomination inconnue',
        categorieJuridique: etab.uniteLegale?.categorieJuridiqueUniteLegale,
        activitePrincipale: etab.activitePrincipaleEtablissement,
        activitePrincipaleLibelle: etab.activitePrincipaleEtablissement ? 
          this.getNAFLabel(etab.activitePrincipaleEtablissement) : '',
        adresse: {
          numeroVoie: etab.adresseEtablissement?.numeroVoieEtablissement,
          typeVoie: etab.adresseEtablissement?.typeVoieEtablissement,
          libelleVoie: etab.adresseEtablissement?.libelleVoieEtablissement,
          codePostal: etab.adresseEtablissement?.codePostalEtablissement,
          libelleCommuneEtablissement: etab.adresseEtablissement?.libelleCommuneEtablissement,
          codeCommuneEtablissement: etab.adresseEtablissement?.codeCommuneEtablissement,
        },
        etatAdministratif: etab.etatAdministratifEtablissement,
        dateCreation: etab.dateCreationEtablissement,
        dateDerniereMiseAJour: etab.dateDernierTraitementEtablissement,
        siege: etab.etablissementSiege === 'true',
        trancheEffectifs: etab.trancheEffectifsEtablissement,
        // Extraction des dirigeants depuis l'unité légale
        dirigeants: this.extractDirigeants(etab.uniteLegale)
      })) || [];

      // Déduplication par SIRET pour éviter les doublons dus aux périodes multiples
      const seenSirets = new Set<string>();
      const companies = allCompanies.filter(company => {
        if (seenSirets.has(company.siret)) {
          console.log(`🔄 Doublon détecté et supprimé: SIRET ${company.siret}`);
          return false;
        }
        seenSirets.add(company.siret);
        return true;
      });

      console.log(`📊 Résultats INSEE: ${allCompanies.length} bruts → ${companies.length} après déduplication`);

      return {
        companies,
        total: data.header?.total || 0
      };
    } catch (error) {
      console.error('Erreur lors de la recherche INSEE:', error);
      throw error;
    }
  }

  /**
   * Extraction des informations dirigeants depuis l'unité légale INSEE
   */
  private extractDirigeants(uniteLegale: any): INSEECompany['dirigeants'] {
    if (!uniteLegale) return [];

    const dirigeants: INSEECompany['dirigeants'] = [];

    // Dirigeant principal (pour les entreprises individuelles)
    if (uniteLegale.prenom1UniteLegale && uniteLegale.nomUniteLegale) {
      dirigeants.push({
        prenom: uniteLegale.prenom1UniteLegale,
        nom: uniteLegale.nomUniteLegale,
        nomUsage: uniteLegale.nomUsageUniteLegale,
        pseudonyme: uniteLegale.pseudonymeUniteLegale,
        qualite: this.getDirigeantQualite(uniteLegale.categorieJuridiqueUniteLegale),
        dateNaissance: uniteLegale.dateNaissanceUniteLegale
      });
    }

    // Autres dirigeants (si disponibles dans les périodes)
    if (uniteLegale.periodesUniteLegale && Array.isArray(uniteLegale.periodesUniteLegale)) {
      uniteLegale.periodesUniteLegale.forEach((periode: any) => {
        if (periode.nomUniteLegale && periode.prenomUsuelUniteLegale) {
          const existeDeja = dirigeants.some(d => 
            d.nom === periode.nomUniteLegale && d.prenom === periode.prenomUsuelUniteLegale
          );
          
          if (!existeDeja) {
            dirigeants.push({
              prenom: periode.prenomUsuelUniteLegale,
              nom: periode.nomUniteLegale,
              nomUsage: periode.nomUsageUniteLegale,
              pseudonyme: periode.pseudonymeUniteLegale,
              qualite: this.getDirigeantQualite(periode.categorieJuridiqueUniteLegale),
              dateNaissance: periode.dateNaissanceUniteLegale
            });
          }
        }
      });
    }

    return dirigeants.filter(d => d.nom && d.prenom);
  }

  /**
   * Détermine la qualité du dirigeant selon la catégorie juridique
   */
  private getDirigeantQualite(categorieJuridique: string): string {
    if (!categorieJuridique) return 'Dirigeant';

    const qualites: { [key: string]: string } = {
      '1000': 'Entrepreneur individuel',
      '5510': 'Gérant de SARL',
      '5599': 'Président de SAS',
      '5710': 'Président de SA',
      '5720': 'Directeur général de SA',
      '5785': 'Gérant de société civile',
      '5499': 'Associé gérant'
    };

    return qualites[categorieJuridique] || 'Dirigeant';
  }

  /**
   * Recherche intelligente unifiée : entreprises + dirigeants
   */
  async searchCompaniesUnified(query: string): Promise<{companies: INSEECompany[], total: number}> {
    console.log('🔍 Recherche unifiée:', query);
    
    const words = query.trim().split(/\s+/);
    const hasPersonName = words.length >= 2;
    
    // Préparer les recherches
    const searchPromises: Promise<{companies: INSEECompany[], total: number}>[] = [];
    
    // 1. Recherche classique d'entreprises (toujours)
    searchPromises.push(this.getAllSearchResults({
      q: query,
      etatAdministratif: 'A'
    }));
    
    // 2. Recherche par dirigeant (si ≥2 mots)
    if (hasPersonName) {
      searchPromises.push(this.searchCompaniesByDirigeant(query));
    }
    
    try {
      // Exécuter toutes les recherches en parallèle
      const results = await Promise.allSettled(searchPromises);
      
      // Combiner tous les résultats réussis
      const allCompanies: INSEECompany[] = [];
      let totalResults = 0;
      
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allCompanies.push(...result.value.companies);
          totalResults += result.value.total;
          console.log(`✅ Recherche ${index === 0 ? 'entreprises' : 'dirigeants'}: ${result.value.companies.length} résultats`);
        } else {
          console.log(`❌ Recherche ${index === 0 ? 'entreprises' : 'dirigeants'} échouée:`, result.reason);
        }
      });
      
      // Déduplication par SIRET et tri par pertinence
      const uniqueCompanies = this.deduplicateAndSortByRelevance(allCompanies, query);
      
      console.log(`🎯 Recherche unifiée terminée: ${uniqueCompanies.length} entreprises uniques trouvées`);
      
      return {
        companies: uniqueCompanies,
        total: uniqueCompanies.length
      };
      
    } catch (error) {
      console.error('Erreur lors de la recherche unifiée:', error);
      throw error;
    }
  }

  /**
   * Fonction de recherche par nom de dirigeant (publique pour compatibilité)
   */
  async searchCompaniesByDirigeant(nomDirigeant: string): Promise<{companies: INSEECompany[], total: number}> {
    const words = nomDirigeant.trim().split(/\s+/);
    if (words.length < 2) {
      return { companies: [], total: 0 };
    }

    const [prenom, ...nomParts] = words;
    const nom = nomParts.join(' ');

    // Recherche avec prénom et nom
    const searchParams = new URLSearchParams();
    const query = `(prenom1UniteLegale:${prenom}* AND nomUniteLegale:${nom}*)`;
    searchParams.append('q', query);
    searchParams.append('nombre', '1000');

    try {
      const finalURL = `${this.INSEE_API_BASE}/siret?${searchParams.toString()}`;
      
      const response = await fetch(finalURL, {
        headers: {
          'X-INSEE-Api-Key-Integration': this.INSEE_API_KEY!,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        // Essayer dans l'autre sens (nom, prénom)
        const fallbackQuery = `(prenom1UniteLegale:${nom}* AND nomUniteLegale:${prenom}*)`;
        const fallbackParams = new URLSearchParams();
        fallbackParams.append('q', fallbackQuery);
        fallbackParams.append('nombre', '1000');
        
        const fallbackURL = `${this.INSEE_API_BASE}/siret?${fallbackParams.toString()}`;
        
        const fallbackResponse = await fetch(fallbackURL, {
          headers: {
            'X-INSEE-Api-Key-Integration': this.INSEE_API_KEY!,
            'Accept': 'application/json'
          }
        });

        if (!fallbackResponse.ok) {
          return { companies: [], total: 0 };
        }

        const fallbackData = await fallbackResponse.json();
        return this.processSearchResults(fallbackData);
      }

      const data = await response.json();
      return this.processSearchResults(data);
      
    } catch (error) {
      console.error('Erreur recherche dirigeant:', error);
      return { companies: [], total: 0 };
    }
  }

  /**
   * Déduplication et tri par pertinence
   */
  private deduplicateAndSortByRelevance(companies: INSEECompany[], query: string): INSEECompany[] {
    // Déduplication par SIRET
    const seenSirets = new Set<string>();
    const uniqueCompanies = companies.filter(company => {
      if (seenSirets.has(company.siret)) {
        return false;
      }
      seenSirets.add(company.siret);
      return true;
    });

    // Calcul de score de pertinence
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/);

    return uniqueCompanies.map(company => ({
      ...company,
      relevanceScore: this.calculateRelevanceScore(company, queryWords)
    })).sort((a, b) => (b as any).relevanceScore - (a as any).relevanceScore);
  }

  /**
   * Calcul du score de pertinence
   */
  private calculateRelevanceScore(company: INSEECompany, queryWords: string[]): number {
    let score = 0;
    const denomination = company.denomination.toLowerCase();
    
    // Score pour correspondance dans la dénomination
    queryWords.forEach(word => {
      if (denomination.includes(word)) {
        score += denomination === word ? 100 : 50; // Correspondance exacte vs partielle
      }
    });
    
    // Score pour correspondance dans les dirigeants
    if (company.dirigeants) {
      company.dirigeants.forEach(dirigeant => {
        const fullName = `${dirigeant.prenom} ${dirigeant.nom}`.toLowerCase();
        queryWords.forEach(word => {
          if (fullName.includes(word)) {
            score += 75; // Forte pertinence pour dirigeant
          }
        });
      });
    }
    
    // Bonus pour entrepreneur individuel si recherche ressemble à un nom
    if (queryWords.length >= 2 && company.dirigeants?.length === 1) {
      score += 25;
    }
    
    return score;
  }

  /**
   * Traitement commun des résultats de recherche
   */
  private processSearchResults(data: any): {companies: INSEECompany[], total: number} {
    const allCompanies: INSEECompany[] = data.etablissements?.map((etab: any) => ({
      siren: etab.siren,
      siret: etab.siret,
      denomination: etab.uniteLegale?.denominationUniteLegale || 
                   etab.uniteLegale?.prenom1UniteLegale + ' ' + etab.uniteLegale?.nomUniteLegale ||
                   'Dénomination inconnue',
      categorieJuridique: etab.uniteLegale?.categorieJuridiqueUniteLegale,
      activitePrincipale: etab.activitePrincipaleEtablissement,
      activitePrincipaleLibelle: etab.activitePrincipaleEtablissement ? 
        this.getNAFLabel(etab.activitePrincipaleEtablissement) : '',
      adresse: {
        numeroVoie: etab.adresseEtablissement?.numeroVoieEtablissement,
        typeVoie: etab.adresseEtablissement?.typeVoieEtablissement,
        libelleVoie: etab.adresseEtablissement?.libelleVoieEtablissement,
        codePostal: etab.adresseEtablissement?.codePostalEtablissement,
        libelleCommuneEtablissement: etab.adresseEtablissement?.libelleCommuneEtablissement,
        codeCommuneEtablissement: etab.adresseEtablissement?.codeCommuneEtablissement,
      },
      etatAdministratif: etab.etatAdministratifEtablissement,
      dateCreation: etab.dateCreationEtablissement,
      dateDerniereMiseAJour: etab.dateDernierTraitementEtablissement,
      siege: etab.etablissementSiege === 'true',
      trancheEffectifs: etab.trancheEffectifsEtablissement,
      dirigeants: this.extractDirigeants(etab.uniteLegale)
    })) || [];

    // Déduplication par SIRET
    const seenSirets = new Set<string>();
    const companies = allCompanies.filter(company => {
      if (seenSirets.has(company.siret)) {
        return false;
      }
      seenSirets.add(company.siret);
      return true;
    });

    console.log(`👥 Recherche dirigeant: ${companies.length} entreprises trouvées`);

    return {
      companies,
      total: companies.length
    };
  }

  /**
   * Enrichissement LinkedIn d'une entreprise
   */
  async enrichWithLinkedIn(domain: string): Promise<LinkedInOrganization | null> {
    if (!this.LINKEDIN_ACCESS_TOKEN) {
      console.warn('Token LinkedIn manquant');
      return null;
    }

    try {
      // Recherche d'organisation par domaine
      const searchParams = new URLSearchParams({
        q: 'universalName',
        projection: '(elements*(organizationalTarget~(localizedName,description,websiteUrl,followerCount,industries,logoV2)))'
      });

      const response = await fetch(`${this.LINKEDIN_API_BASE}/organizationsLookup?${searchParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${this.LINKEDIN_ACCESS_TOKEN}`,
          'Accept': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      if (!response.ok) {
        console.warn(`Erreur LinkedIn API: ${response.status}`);
        return null;
      }

      const data = await response.json();
      
      if (data.elements && data.elements.length > 0) {
        const org = data.elements[0];
        return {
          organizationUrn: org.organizationalTarget,
          name: org['organizationalTarget~']?.localizedName,
          description: org['organizationalTarget~']?.description,
          website: org['organizationalTarget~']?.websiteUrl,
          followerCount: org['organizationalTarget~']?.followerCount,
          industries: org['organizationalTarget~']?.industries || [],
          logoUrl: org['organizationalTarget~']?.logoV2?.original,
          lastUpdated: new Date().toISOString()
        };
      }

      return null;
    } catch (error) {
      console.error('Erreur enrichissement LinkedIn:', error);
      return null;
    }
  }

  /**
   * Calcul du score de ciblage d'une entreprise
   */
  calculateTargetingScore(company: INSEECompany, linkedin?: LinkedInOrganization): number {
    let score = 50; // Score de base

    // Critères positifs
    if (company.etatAdministratif === 'A') score += 20; // Entreprise active
    if (company.siege) score += 10; // Siège social
    if (linkedin?.organizationUrn) score += 15; // Présence LinkedIn
    if (linkedin?.followerCount && linkedin.followerCount > 1000) score += 10; // Bonne audience LinkedIn
    
    // Critères basés sur l'effectif
    if (company.trancheEffectifs) {
      const effectifScore = this.getEffectifScore(company.trancheEffectifs);
      score += effectifScore;
    }

    // Critères basés sur le secteur d'activité
    if (company.activitePrincipale) {
      const secteurScore = this.getSecteurScore(company.activitePrincipale);
      score += secteurScore;
    }

    // Normalisation (0-100)
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Génération automatique de tags pour une entreprise
   */
  generateTags(company: INSEECompany, linkedin?: LinkedInOrganization): string[] {
    const tags: string[] = [];

    // Tags basés sur la localisation
    if (company.adresse.codeCommuneEtablissement?.startsWith('75')) {
      tags.push('paris');
    } else if (company.adresse.codeCommuneEtablissement?.startsWith('69')) {
      tags.push('lyon');
    }

    // Tags basés sur le secteur
    if (company.activitePrincipale?.startsWith('62')) {
      tags.push('tech', 'informatique');
    } else if (company.activitePrincipale?.startsWith('73')) {
      tags.push('marketing', 'publicite');
    } else if (company.activitePrincipale?.startsWith('66')) {
      tags.push('finance', 'banque');
    }

    // Tags basés sur la taille
    if (company.trancheEffectifs) {
      if (['21', '22', '31', '32'].includes(company.trancheEffectifs)) {
        tags.push('pme');
      } else if (['41', '42', '51', '52', '53'].includes(company.trancheEffectifs)) {
        tags.push('grande-entreprise');
      }
    }

    // Tags LinkedIn
    if (linkedin?.industries) {
      linkedin.industries.forEach(industry => {
        if (industry.toLowerCase().includes('fintech')) tags.push('fintech');
        if (industry.toLowerCase().includes('startup')) tags.push('startup');
      });
    }

    return tags;
  }

  /**
   * Extraction du domaine depuis une URL ou email
   */
  extractDomain(url: string): string | null {
    try {
      if (url.includes('@')) {
        return url.split('@')[1];
      }
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return null;
    }
  }

  /**
   * Validation d'un SIREN
   */
  isValidSiren(siren: string): boolean {
    if (!/^\d{9}$/.test(siren)) return false;
    
    // Algorithme de Luhn pour la validation SIREN
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      let digit = parseInt(siren[i]);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(siren[8]);
  }

  /**
   * Validation d'un SIRET
   */
  isValidSiret(siret: string): boolean {
    if (!/^\d{14}$/.test(siret)) return false;
    
    const siren = siret.substring(0, 9);
    if (!this.isValidSiren(siren)) return false;
    
    // Validation du NIC (5 derniers chiffres)
    const nic = siret.substring(9, 14);
    let sum = 0;
    for (let i = 0; i < 4; i++) {
      let digit = parseInt(nic[i]);
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(nic[4]);
  }

  // Méthodes privées d'aide

  private getNAFLabel(code: string): string {
    const nafLabels: Record<string, string> = {
      '62.01Z': 'Programmation informatique',
      '62.02A': 'Conseil en systèmes et logiciels informatiques',
      '73.11Z': 'Activités des agences de publicité',
      '70.22Z': 'Conseil pour les affaires et autres conseils de gestion',
      '66.12Z': 'Courtage de valeurs mobilières et de marchandises',
      // Ajouter d'autres codes NAF selon les besoins
    };
    return nafLabels[code] || 'Activité non référencée';
  }

  private getEffectifScore(trancheEffectifs: string): number {
    const scores: Record<string, number> = {
      '00': 0,   // 0 salarié
      '01': 5,   // 1 ou 2 salariés
      '02': 5,   // 3 à 5 salariés
      '03': 10,  // 6 à 9 salariés
      '11': 15,  // 10 à 19 salariés
      '12': 15,  // 20 à 49 salariés
      '21': 20,  // 50 à 99 salariés
      '22': 20,  // 100 à 199 salariés
      '31': 15,  // 200 à 249 salariés
      '32': 15,  // 250 à 499 salariés
      '41': 10,  // 500 à 999 salariés
      '42': 10,  // 1000 à 1999 salariés
      '51': 5,   // 2000 à 4999 salariés
      '52': 5,   // 5000 à 9999 salariés
      '53': 0,   // 10000 salariés et plus
    };
    return scores[trancheEffectifs] || 0;
  }

  private getSecteurScore(naf: string): number {
    // Secteurs privilégiés pour le ciblage
    const secteursPrioritaires = [
      '62.01', // Programmation informatique
      '62.02', // Conseil en systèmes informatiques
      '73.11', // Publicité
      '70.22', // Conseil en gestion
      '66.12', // Courtage financier
    ];

    const prefix = naf.substring(0, 5);
    return secteursPrioritaires.includes(prefix) ? 10 : 0;
  }
}

export const companyDataService = new CompanyDataService();
