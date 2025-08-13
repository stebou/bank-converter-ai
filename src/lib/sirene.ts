// Configuration - Endpoint correct pour recherche par nom
const INSEE_API_URL_SIRET = 'https://api.insee.fr/api-sirene/3.11/siret';
const INSEE_API_URL_SIREN = 'https://api.insee.fr/api-sirene/3.11/siren';
const INSEE_API_KEY = process.env.NEXT_PUBLIC_INSEE_API_KEY;

// Types
export interface Company {
  siren: string;
  siret?: string;
  denomination: string;
  adresse: string;
  codePostal: string;
  ville: string;
  activite: string;
  etatAdministratif: string;
}

interface SireneResponse {
  header: {
    statut: number;
    message: string;
    total?: number;
    debut?: number;
    nombre?: number;
  };
  etablissements?: Array<{
    siren: string;
    siret: string;
    denominationUniteLegale?: string;
    nomUniteLegale?: string;
    prenom1UniteLegale?: string;
    numeroVoieEtablissement?: string;
    typeVoieEtablissement?: string;
    libelleVoieEtablissement?: string;
    codePostalEtablissement?: string;
    libelleCommuneEtablissement?: string;
    activitePrincipaleUniteLegale?: string;
    etatAdministratifEtablissement?: string;
  }>;
  unitesLegales?: Array<{
    siren: string;
    periodesUniteLegale?: Array<{
      denominationUniteLegale?: string;
      nomUniteLegale?: string;
      prenom1UniteLegale?: string;
      activitePrincipaleUniteLegale?: string;
      etatAdministratifUniteLegale?: string;
      dateFin?: string;
    }>;
  }>;
}

/**
 * Recherche d'entreprises avec filtres multicritères selon la documentation INSEE
 * Utilise la syntaxe officielle pour les recherches par localisation et autres critères
 */
export async function searchCompaniesWithFilters(
  query: string = '', 
  filters: Record<string, string> = {}, 
  limit = 10
): Promise<any[]> {
  try {
    // Construire la requête multicritères selon la documentation INSEE
    const queryParts: string[] = [];
    
    // Ajouter la recherche textuelle si fournie
    if (query.trim()) {
      const cleanQuery = query.trim();
      const words = cleanQuery.split(' ').filter(word => word.length > 0);
      
      if (words.length === 2) {
        // Stratégie optimisée pour recherche de personne (prénom + nom)
        const [prenom, nom] = words;
        // Recherche combinée : entrepreneurs individuels ET entreprises contenant le nom
        queryParts.push(`((nomUniteLegale:${nom.toUpperCase()} AND prenom1UniteLegale:${prenom.toUpperCase()}) OR denominationUniteLegale:*${prenom.toUpperCase()}*${nom.toUpperCase()}* OR denominationUniteLegale:*${nom.toUpperCase()}*${prenom.toUpperCase()}*)`);
      } else if (words.length > 2) {
        // Recherche exacte avec guillemets pour termes multiples
        queryParts.push(`denominationUniteLegale:"${cleanQuery}"`);
      } else {
        // Recherche simple avec denominationUniteLegale (plus précis que raisonSociale)
        queryParts.push(`denominationUniteLegale:*${cleanQuery.toUpperCase()}*`);
      }
    }
    
    // Ajouter les filtres selon la documentation INSEE
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.trim()) {
        switch (key) {
          case 'codePostalEtablissement':
            queryParts.push(`codePostalEtablissement:${value}`);
            break;
          case 'libelleCommuneEtablissement':
            // Pour la commune, recherche exacte si c'est un mot unique, sinon fuzzy
            if (value.includes(' ')) {
              queryParts.push(`libelleCommuneEtablissement:"${value.toUpperCase()}"`);
            } else {
              queryParts.push(`libelleCommuneEtablissement:${value.toUpperCase()}`);
            }
            break;
          case 'activitePrincipaleUniteLegale':
            queryParts.push(`activitePrincipaleUniteLegale:${value}`);
            break;
          case 'activitePrincipaleEtablissement':
            queryParts.push(`activitePrincipaleEtablissement:${value}`);
            break;
          case 'trancheEffectifsUniteLegale':
            queryParts.push(`trancheEffectifsUniteLegale:${value}`);
            break;
          case 'etatAdministratifEtablissement':
            queryParts.push(`etatAdministratifEtablissement:${value}`);
            break;
          case 'categorieJuridiqueUniteLegale':
            queryParts.push(`categorieJuridiqueUniteLegale:${value}`);
            break;
          case 'siren':
            queryParts.push(`siren:${value}`);
            break;
          case 'siret':
            queryParts.push(`siret:${value}`);
            break;
          case 'dateCreationUniteLegale':
            // Format YYYY-MM-DD pour la recherche par date
            queryParts.push(`dateCreationUniteLegale:${value}`);
            break;
          case 'dateCreationUniteLegaleDebut':
            // Recherche par plage de dates >= 
            queryParts.push(`dateCreationUniteLegale:[${value} TO *]`);
            break;
          case 'dateCreationUniteLegaleFin':
            // Recherche par plage de dates <=
            queryParts.push(`dateCreationUniteLegale:[* TO ${value}]`);
            break;
          case 'departement':
            // Recherche par département via code postal (2 premiers chiffres)
            queryParts.push(`codePostalEtablissement:${value}*`);
            break;
        }
      }
    });
    
    // Si aucun critère, retourner vide
    if (queryParts.length === 0) {
      return [];
    }
    
    // Construire la requête finale avec AND entre les critères
    const searchQuery = queryParts.join(' AND ');
    
    // Utiliser endpoint /siret pour avoir les adresses complètes
    const url = new URL(INSEE_API_URL_SIRET);
    url.searchParams.set('q', searchQuery);
    url.searchParams.set('nombre', Math.min(limit, 1000).toString()); // Max 1000 selon la doc
    url.searchParams.set('champs', 'siren,siret,denominationUniteLegale,nomUniteLegale,prenom1UniteLegale,numeroVoieEtablissement,typeVoieEtablissement,libelleVoieEtablissement,codePostalEtablissement,libelleCommuneEtablissement,activitePrincipaleUniteLegale,activitePrincipaleEtablissement,etatAdministratifEtablissement,trancheEffectifsUniteLegale,dateCreationUniteLegale,categorieJuridiqueUniteLegale');

    console.log('🔍 Requête SIRENE multicritères:', searchQuery);
    console.log('🔗 URL complète:', url.toString());

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (INSEE_API_KEY) {
      headers['X-INSEE-Api-Key-Integration'] = INSEE_API_KEY;
    }

    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur INSEE détaillée:', response.status, errorText);
      
      // 404 signifie simplement aucun résultat trouvé, pas une vraie erreur
      if (response.status === 404) {
        console.log('ℹ️ Aucun établissement trouvé (404)');
        return [];
      }
      
      throw new Error(`Erreur INSEE: ${response.status} - ${errorText}`);
    }

    const data: SireneResponse = await response.json();
    console.log('📊 Réponse INSEE multicritères:', data);

    if (!data.etablissements || data.etablissements.length === 0) {
      console.log('ℹ️ Aucun établissement trouvé');
      return [];
    }

    return data.etablissements.map(transformEtablissementToCompany);

  } catch (error) {
    console.error('❌ Erreur recherche SIRENE multicritères:', error);
    throw error;
  }
}

/**
 * Recherche simplifiée d'entreprises via l'API SIRENE
 * Optimisée pour détecter automatiquement les recherches de personnes
 */
export async function searchCompanies(query: string, limit = 10): Promise<any[]> {
  try {
    // Nettoyer la requête
    const cleanQuery = query.trim();
    const words = cleanQuery.split(' ').filter(word => word.length > 0);
    
    let searchQuery: string;
    
    if (words.length === 2) {
      // Stratégie optimisée pour recherche de personne (prénom + nom)
      const [prenom, nom] = words;
      // Recherche combinée : entrepreneurs individuels ET entreprises contenant le nom
      searchQuery = `((nomUniteLegale:${nom.toUpperCase()} AND prenom1UniteLegale:${prenom.toUpperCase()}) OR denominationUniteLegale:*${prenom.toUpperCase()}*${nom.toUpperCase()}* OR denominationUniteLegale:*${nom.toUpperCase()}*${prenom.toUpperCase()}*)`;
    } else if (words.length > 2) {
      // Recherche exacte avec guillemets pour termes multiples
      searchQuery = `denominationUniteLegale:"${cleanQuery}"`;
    } else {
      // Recherche simple avec joker pour plus de flexibilité
      searchQuery = `denominationUniteLegale:*${cleanQuery.toUpperCase()}*`;
    }
    
    // Utiliser endpoint /siret pour avoir les adresses complètes
    const url = new URL(INSEE_API_URL_SIRET);
    url.searchParams.set('q', searchQuery);
    url.searchParams.set('nombre', limit.toString());
    // Champs corrects basés sur la doc INSEE - ajout categorieJuridiqueUniteLegale pour détecter les personnes physiques
    url.searchParams.set('champs', 'siren,siret,denominationUniteLegale,nomUniteLegale,prenom1UniteLegale,numeroVoieEtablissement,typeVoieEtablissement,libelleVoieEtablissement,codePostalEtablissement,libelleCommuneEtablissement,activitePrincipaleUniteLegale,activitePrincipaleEtablissement,etatAdministratifEtablissement,trancheEffectifsUniteLegale,dateCreationUniteLegale,categorieJuridiqueUniteLegale');

    console.log('🔍 Requête SIRENE:', searchQuery);
    console.log('🔗 URL complète:', url.toString());

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (INSEE_API_KEY) {
      headers['X-INSEE-Api-Key-Integration'] = INSEE_API_KEY;
    }

    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur INSEE détaillée:', response.status, errorText);
      
      // 404 signifie simplement aucun résultat trouvé, pas une vraie erreur
      if (response.status === 404) {
        console.log('ℹ️ Aucun établissement trouvé (404)');
        return [];
      }
      
      throw new Error(`Erreur INSEE: ${response.status} - ${errorText}`);
    }

    const data: SireneResponse = await response.json();
    console.log('📊 Réponse INSEE:', data);

    if (!data.etablissements || data.etablissements.length === 0) {
      console.log('ℹ️ Aucun établissement trouvé');
      return [];
    }

    return data.etablissements.map(transformEtablissementToCompany);

  } catch (error) {
    console.error('❌ Erreur recherche SIRENE:', error);
    throw error;
  }
}

/**
 * Convertit un code de tranche d'effectifs en libellé
 */
function getTrancheEffectifsLibelle(code: string): string {
  const tranches: Record<string, string> = {
    'NN': 'Non précisé',
    '00': '0 salarié',
    '01': '1 ou 2 salariés',
    '02': '3 à 5 salariés',
    '03': '6 à 9 salariés',
    '11': '10 à 19 salariés',
    '12': '20 à 49 salariés',
    '21': '50 à 99 salariés',
    '22': '100 à 199 salariés',
    '31': '200 à 249 salariés',
    '32': '250 à 499 salariés',
    '41': '500 à 999 salariés',
    '42': '1 000 à 1 999 salariés',
    '51': '2 000 à 4 999 salariés',
    '52': '5 000 à 9 999 salariés',
    '53': '10 000 salariés et plus'
  };
  return tranches[code] || 'Non précisé';
}

/**
 * Convertit un code NAF en libellé d'activité simplifié
 */
function getActiviteLibelle(codeNaf: string): string {
  if (!codeNaf) return '';
  
  // Mapping simplifié des principaux codes NAF
  const activites: Record<string, string> = {
    // Agriculture, sylviculture et pêche
    '01': 'Agriculture',
    '02': 'Sylviculture et exploitation forestière',
    '03': 'Pêche et aquaculture',
    
    // Industries extractives
    '05': 'Extraction de charbon',
    '06': 'Extraction d\'hydrocarbures',
    '07': 'Extraction de minerais métalliques',
    '08': 'Autres industries extractives',
    '09': 'Services de soutien aux industries extractives',
    
    // Industries manufacturières
    '10': 'Industries alimentaires',
    '11': 'Fabrication de boissons',
    '12': 'Fabrication de produits à base de tabac',
    '13': 'Fabrication de textiles',
    '14': 'Industrie de l\'habillement',
    '15': 'Industrie du cuir et de la chaussure',
    '16': 'Travail du bois',
    '17': 'Industrie du papier et du carton',
    '18': 'Imprimerie et reproduction',
    '19': 'Cokéfaction et raffinage',
    '20': 'Industrie chimique',
    '21': 'Industrie pharmaceutique',
    '22': 'Fabrication de produits en caoutchouc et en plastique',
    '23': 'Fabrication d\'autres produits minéraux non métalliques',
    '24': 'Métallurgie',
    '25': 'Fabrication de produits métalliques',
    '26': 'Fabrication de produits informatiques, électroniques et optiques',
    '27': 'Fabrication d\'équipements électriques',
    '28': 'Fabrication de machines et équipements',
    '29': 'Industrie automobile',
    '30': 'Fabrication d\'autres matériels de transport',
    '31': 'Fabrication de meubles',
    '32': 'Autres industries manufacturières',
    '33': 'Réparation et installation de machines et d\'équipements',
    
    // Production et distribution d'électricité, de gaz, de vapeur et d'air conditionné
    '35': 'Production et distribution d\'électricité, de gaz, de vapeur et d\'air conditionné',
    
    // Production et distribution d'eau
    '36': 'Captage, traitement et distribution d\'eau',
    '37': 'Collecte et traitement des eaux usées',
    '38': 'Collecte, traitement et élimination des déchets',
    '39': 'Dépollution et autres services de gestion des déchets',
    
    // Construction
    '41': 'Construction de bâtiments',
    '42': 'Génie civil',
    '43': 'Travaux de construction spécialisés',
    
    // Commerce
    '45': 'Commerce et réparation d\'automobiles et de motocycles',
    '46': 'Commerce de gros',
    '47': 'Commerce de détail',
    
    // Transports et entreposage
    '49': 'Transports terrestres et transport par conduites',
    '50': 'Transports par eau',
    '51': 'Transports aériens',
    '52': 'Entreposage et services auxiliaires des transports',
    '53': 'Activités de poste et de courrier',
    
    // Hébergement et restauration
    '55': 'Hébergement',
    '56': 'Restauration',
    
    // Information et communication
    '58': 'Édition',
    '59': 'Production de films cinématographiques, de vidéo et de programmes de télévision',
    '60': 'Programmation et diffusion',
    '61': 'Télécommunications',
    '62': 'Programmation, conseil et autres activités informatiques',
    '63': 'Services d\'information',
    
    // Activités financières et d'assurance
    '64': 'Activités des services financiers',
    '65': 'Assurance',
    '66': 'Activités auxiliaires de services financiers et d\'assurance',
    
    // Activités immobilières
    '68': 'Activités immobilières',
    
    // Activités spécialisées, scientifiques et techniques
    '69': 'Activités juridiques et comptables',
    '70': 'Activités des sièges sociaux ; conseil de gestion',
    '71': 'Activités d\'architecture et d\'ingénierie',
    '72': 'Recherche-développement scientifique',
    '73': 'Publicité et études de marché',
    '74': 'Autres activités spécialisées, scientifiques et techniques',
    '75': 'Activités vétérinaires',
    
    // Activités de services administratifs et de soutien
    '77': 'Activités de location et location-bail',
    '78': 'Activités liées à l\'emploi',
    '79': 'Activités des agences de voyage',
    '80': 'Enquêtes et sécurité',
    '81': 'Services relatifs aux bâtiments et aménagement paysager',
    '82': 'Activités administratives et autres activités de soutien aux entreprises',
    
    // Administration publique
    '84': 'Administration publique et défense',
    
    // Enseignement
    '85': 'Enseignement',
    
    // Santé humaine et action sociale
    '86': 'Activités pour la santé humaine',
    '87': 'Hébergement médico-social et social',
    '88': 'Action sociale sans hébergement',
    
    // Arts, spectacles et activités récréatives
    '90': 'Activités créatives, artistiques et de spectacle',
    '91': 'Bibliothèques, archives, musées et autres activités culturelles',
    '92': 'Organisation de jeux de hasard et d\'argent',
    '93': 'Activités sportives, récréatives et de loisirs',
    
    // Autres activités de services
    '94': 'Activités des organisations associatives',
    '95': 'Réparation d\'ordinateurs et de biens personnels et domestiques',
    '96': 'Autres services personnels',
    
    // Activités des ménages
    '97': 'Activités des ménages en tant qu\'employeurs de personnel domestique',
    '98': 'Activités indifférenciées des ménages',
    
    // Activités extra-territoriales
    '99': 'Activités des organisations et organismes extraterritoriaux'
  };
  
  // Prendre les 2 premiers caractères du code NAF
  const codeSection = codeNaf.substring(0, 2);
  return activites[codeSection] || `Activité ${codeNaf}`;
}

/**
 * Transforme un établissement SIRENE en objet compatible avec le popup
 */
function transformEtablissementToCompany(etablissement: any): any {
  // Accès aux données dans la structure INSEE
  const uniteLegale = etablissement.uniteLegale || {};
  const adresse = etablissement.adresseEtablissement || {};
  const periodes = etablissement.periodesEtablissement?.[0] || {};

  // Déterminer le type d'entité
  const isPersonnePhysique = uniteLegale.nomUniteLegale && uniteLegale.prenom1UniteLegale;
  const isEntrepreneurIndividuel = isPersonnePhysique && 
    (uniteLegale.categorieJuridiqueUniteLegale === '1000' || !uniteLegale.denominationUniteLegale);

  // Nom de l'entreprise (priorité: dénomination > nom+prénom)
  let denomination;
  let entityType = 'entreprise';
  
  if (isEntrepreneurIndividuel) {
    denomination = `${uniteLegale.prenom1UniteLegale} ${uniteLegale.nomUniteLegale}`;
    entityType = 'entrepreneur_individuel';
  } else if (uniteLegale.denominationUniteLegale) {
    denomination = uniteLegale.denominationUniteLegale;
    entityType = 'entreprise';
  } else if (isPersonnePhysique) {
    denomination = `${uniteLegale.prenom1UniteLegale} ${uniteLegale.nomUniteLegale}`;
    entityType = 'personne_physique';
  } else {
    denomination = 'Nom non disponible';
  }

  // Code d'activité - priorité à l'établissement puis unité légale
  const codeActivite = periodes.activitePrincipaleEtablissement || uniteLegale.activitePrincipaleUniteLegale || '';
  
  // Format compatible avec CompanySearchResult + informations sur le type
  return {
    siren: etablissement.siren,
    siret: etablissement.siret,
    denomination,
    entityType, // Nouveau champ pour identifier le type
    nomPersonne: isPersonnePhysique ? {
      prenom: uniteLegale.prenom1UniteLegale,
      nom: uniteLegale.nomUniteLegale
    } : null,
    activitePrincipaleLibelle: getActiviteLibelle(codeActivite),
    trancheEffectifsLibelle: getTrancheEffectifsLibelle(uniteLegale.trancheEffectifsUniteLegale || 'NN'),
    dateCreation: uniteLegale.dateCreationUniteLegale || null,
    adresse: {
      numeroVoie: adresse.numeroVoieEtablissement,
      typeVoie: adresse.typeVoieEtablissement,
      libelleVoie: adresse.libelleVoieEtablissement,
      codePostal: adresse.codePostalEtablissement,
      commune: adresse.libelleCommuneEtablissement,
      departement: adresse.codePostalEtablissement?.substring(0, 2)
    },
    etatAdministratif: periodes.etatAdministratifEtablissement || 'A'
  };
}

/**
 * Recherche par SIREN
 */
export async function searchBySiren(siren: string): Promise<any[]> {
  try {
    const url = new URL(INSEE_API_URL_SIREN);
    url.searchParams.set('q', `siren:${siren}`);
    url.searchParams.set('nombre', '10');
    url.searchParams.set('champs', 'siren,periodesUniteLegale');

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (INSEE_API_KEY) {
      headers['X-INSEE-Api-Key-Integration'] = INSEE_API_KEY;
    }

    const response = await fetch(url.toString(), { headers });
    
    if (!response.ok) {
      throw new Error(`Erreur INSEE: ${response.status}`);
    }

    const data: SireneResponse = await response.json();
    
    return (data.unitesLegales || []).map(transformUniteLegaleToCompany);
  } catch (error) {
    console.error('❌ Erreur recherche SIREN:', error);
    return [];
  }
}

/**
 * Transforme une unité légale en objet compatible
 */
function transformUniteLegaleToCompany(uniteLegale: any): any {
  const periodeCourante = uniteLegale.periodesUniteLegale?.find((p: any) => p.dateFin === null) || 
                          uniteLegale.periodesUniteLegale?.[0];
  
  if (!periodeCourante) {
    return {
      siren: uniteLegale.siren,
      siret: uniteLegale.siren + '00000',
      denomination: 'Données non disponibles',
      adresse: { commune: 'Non disponible' },
      etatAdministratif: 'A'
    };
  }

  const denomination = periodeCourante.denominationUniteLegale || 
                      (periodeCourante.nomUniteLegale && periodeCourante.prenom1UniteLegale ? 
                       `${periodeCourante.prenom1UniteLegale} ${periodeCourante.nomUniteLegale}` : 
                       periodeCourante.nomUniteLegale) || 
                      'Nom non disponible';

  return {
    siren: uniteLegale.siren,
    siret: uniteLegale.siren + '00000',
    denomination,
    activitePrincipaleLibelle: periodeCourante.activitePrincipaleUniteLegale || '',
    adresse: { commune: 'Adresse siège non disponible' },
    etatAdministratif: periodeCourante.etatAdministratifUniteLegale || 'A'
  };
}

/**
 * Récupère les informations complètes d'une entreprise par SIREN
 * Utilise l'endpoint SIRET pour avoir les données complètes incluant l'adresse
 */
export async function getCompanyBySiren(siren: string): Promise<any | null> {
  try {
    const results = await searchCompaniesWithFilters('', { siren }, 1);
    
    if (results && results.length > 0) {
      // Retourner la première entreprise trouvée (normalement il n'y en a qu'une par SIREN)
      return results[0];
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Erreur lors de la récupération des données pour SIREN ${siren}:`, error);
    return null;
  }
}
