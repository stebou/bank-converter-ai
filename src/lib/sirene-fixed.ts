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
 * Recherche simplifiée d'entreprises via l'API SIRENE
 * Basé sur les exemples trouvés dans le répertoire GitHub etalab/sirene_as_api
 */
export async function searchCompanies(query: string, limit = 10): Promise<any[]> {
  try {
    // Nettoyer la requête
    const cleanQuery = query.trim();
    
    // Détecter si c'est potentiellement un entrepreneur individuel (prénom + nom)
    const words = cleanQuery.split(' ');
    let searchQuery: string;
    
    if (words.length === 2) {
      // Stratégie combinée pour entrepreneur individuel selon doc INSEE
      const [prenom, nom] = words;
      searchQuery = `nomUniteLegale:${nom} AND prenom1UniteLegale:${prenom}`;
    } else if (words.length > 2) {
      // Recherche exacte avec guillemets pour termes multiples
      searchQuery = `raisonSociale:"${cleanQuery}"`;
    } else {
      // Recherche simple avec raisonSociale (syntaxe officielle INSEE)
      searchQuery = `raisonSociale:${cleanQuery}`;
    }
    
    // Utiliser endpoint /siret pour avoir les adresses complètes
    const url = new URL(INSEE_API_URL_SIRET);
    url.searchParams.set('q', searchQuery);
    url.searchParams.set('nombre', limit.toString());
    // Champs corrects basés sur la doc INSEE et les exemples GitHub
    url.searchParams.set('champs', 'siren,siret,denominationUniteLegale,nomUniteLegale,prenom1UniteLegale,numeroVoieEtablissement,typeVoieEtablissement,libelleVoieEtablissement,codePostalEtablissement,libelleCommuneEtablissement,activitePrincipaleUniteLegale,etatAdministratifEtablissement');

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
 * Transforme un établissement SIRENE en objet compatible avec le popup
 */
function transformEtablissementToCompany(etablissement: any): any {
  // Nom de l'entreprise (priorité: dénomination > nom+prénom)
  const denomination = etablissement.denominationUniteLegale || 
                      (etablissement.nomUniteLegale && etablissement.prenom1UniteLegale ? 
                       `${etablissement.prenom1UniteLegale} ${etablissement.nomUniteLegale}` : 
                       etablissement.nomUniteLegale) || 
                      'Nom non disponible';

  // Adresse complète pour compatibilité
  const adresseComplete = [
    etablissement.numeroVoieEtablissement,
    etablissement.typeVoieEtablissement,
    etablissement.libelleVoieEtablissement
  ].filter(Boolean).join(' ');

  // Format compatible avec CompanySearchResult
  return {
    siren: etablissement.siren,
    siret: etablissement.siret,
    denomination,
    activitePrincipaleLibelle: etablissement.activitePrincipaleUniteLegale || '',
    adresse: {
      numeroVoie: etablissement.numeroVoieEtablissement,
      typeVoie: etablissement.typeVoieEtablissement,
      libelleVoie: etablissement.libelleVoieEtablissement,
      codePostal: etablissement.codePostalEtablissement,
      commune: etablissement.libelleCommuneEtablissement,
      departement: etablissement.codePostalEtablissement?.substring(0, 2)
    },
    etatAdministratif: etablissement.etatAdministratifEtablissement || 'A'
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
