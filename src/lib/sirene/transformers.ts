// Transformateurs de données SIRENE unifiés
import { CompanySearchResult } from '@/types/search-criteria';

/**
 * Transforme les données SIRENE en format application unifié
 * Adapté à la vraie structure API INSEE v3.11
 */
export function transformSireneToCompanyResult(sireneData: any): CompanySearchResult {
  // Validation de base des données reçues
  if (!sireneData.adresseEtablissement && !sireneData.codePostalEtablissement) {
    console.warn('⚠️ [TRANSFORMER] Aucune donnée d\'adresse trouvée dans la réponse INSEE');
  }

  // Extraire les données de l'unité légale et établissement selon la vraie structure INSEE
  const uniteLegale = sireneData.uniteLegale || {};
  const adresse = sireneData.adresseEtablissement || {};
  
  // Récupérer la période courante (première période avec dateFin = null)
  const periodeCourante =
    sireneData.periodesEtablissement?.find((p: any) => p.dateFin === null) ||
    sireneData.periodesEtablissement?.[0] || {};

  // Construire l'adresse complète selon la structure réelle INSEE - FIX: utiliser les bonnes sources
  // L'API INSEE peut retourner les champs d'adresse directement sur l'établissement OU dans un objet nested
  // Priorité aux champs directs (plus commun) puis fallback sur la structure nested
  const numeroVoie = sireneData.numeroVoieEtablissement || adresse.numeroVoieEtablissement;
  const typeVoie = sireneData.typeVoieEtablissement || adresse.typeVoieEtablissement;
  const libelleVoie = sireneData.libelleVoieEtablissement || adresse.libelleVoieEtablissement;
  const complement = sireneData.complementAdresseEtablissement || adresse.complementAdresseEtablissement;
  const distribution = sireneData.distributionSpecialeEtablissement || adresse.distributionSpecialeEtablissement;

  // Déterminer le type d'entité et construire la dénomination
  const isPersonnePhysique = uniteLegale.nomUniteLegale && uniteLegale.prenom1UniteLegale;
  const isEntrepreneurIndividuel = isPersonnePhysique && 
    (uniteLegale.categorieJuridiqueUniteLegale === '1000' || !uniteLegale.denominationUniteLegale);

  let denomination: string;
  let entityType: 'entreprise' | 'entrepreneur_individuel' | 'personne_physique' = 'entreprise';
  let nomPersonne = null;

  if (isEntrepreneurIndividuel) {
    denomination = `${uniteLegale.prenom1UniteLegale} ${uniteLegale.nomUniteLegale}`;
    entityType = 'entrepreneur_individuel';
    nomPersonne = {
      prenom: uniteLegale.prenom1UniteLegale,
      nom: uniteLegale.nomUniteLegale,
    };
  } else if (uniteLegale.denominationUniteLegale) {
    denomination = uniteLegale.denominationUniteLegale;
    entityType = 'entreprise';
  } else if (isPersonnePhysique) {
    denomination = `${uniteLegale.prenom1UniteLegale} ${uniteLegale.nomUniteLegale}`;
    entityType = 'personne_physique';
    nomPersonne = {
      prenom: uniteLegale.prenom1UniteLegale,
      nom: uniteLegale.nomUniteLegale,
    };
  } else {
    // Fallback avec priorité selon la documentation SIRENE
    denomination =
      uniteLegale.denominationUsuelle1UniteLegale ||
      uniteLegale.denominationUsuelle2UniteLegale ||
      uniteLegale.denominationUsuelle3UniteLegale ||
      uniteLegale.sigleUniteLegale ||
      uniteLegale.pseudonymeUniteLegale ||
      sireneData.denominationUsuelleEtablissement ||
      periodeCourante?.enseigne1Etablissement ||
      sireneData.enseigne1Etablissement ||
      sireneData.enseigne2Etablissement ||
      sireneData.enseigne3Etablissement ||
      'Nom non disponible';
  }

  // État administratif (priorité : UL > établissement courant > établissement direct)
  const etatAdmin =
    uniteLegale.etatAdministratifUniteLegale ||
    periodeCourante?.etatAdministratifEtablissement ||
    sireneData.etatAdministratifEtablissement ||
    'N/A';

  // Code postal et commune avec code géographique - FIX: utiliser les bonnes sources
  // Priorité aux champs directs puis fallback sur la structure nested
  const codePostal = sireneData.codePostalEtablissement || adresse.codePostalEtablissement || '';
  const commune = sireneData.libelleCommuneEtablissement || adresse.libelleCommuneEtablissement || '';
  const codeCommune = sireneData.codeCommuneEtablissement || adresse.codeCommuneEtablissement || '';
  
  // Validation des données d'adresse essentielles
  if (!codePostal || !commune) {
    console.warn('⚠️ [TRANSFORMER] Données d\'adresse incomplètes');
  }

  return {
    siren: sireneData.siren || uniteLegale.siren,
    siret: sireneData.siret || '',
    denomination: denomination,
    activitePrincipale: 
      uniteLegale.activitePrincipaleUniteLegale ||
      periodeCourante?.activitePrincipaleEtablissement ||
      sireneData.activitePrincipaleEtablissement ||
      '',
    activitePrincipaleLibelle: getActivityLabel(
      uniteLegale.activitePrincipaleUniteLegale ||
      periodeCourante?.activitePrincipaleEtablissement ||
      sireneData.activitePrincipaleEtablissement
    ),
    categorieJuridique: uniteLegale.categorieJuridiqueUniteLegale || '',
    categorieJuridiqueLibelle: getJuridicalCategoryLabel(
      uniteLegale.categorieJuridiqueUniteLegale
    ),
    adresse: {
      numeroVoie: numeroVoie,
      typeVoie: typeVoie,
      libelleVoie: libelleVoie,
      codePostal: codePostal,
      commune: commune,
      departement: codeCommune.length >= 2 ? codeCommune.substring(0, 2) : '',
      region: codeCommune.length >= 2 ? getRegionFromDepartment(codeCommune.substring(0, 2)) : '',
    },
    trancheEffectifs:
      uniteLegale.trancheEffectifsUniteLegale ||
      periodeCourante?.trancheEffectifsEtablissement ||
      sireneData.trancheEffectifsEtablissement,
    trancheEffectifsLibelle: getEffectiveRangeLabel(
      uniteLegale.trancheEffectifsUniteLegale ||
      periodeCourante?.trancheEffectifsEtablissement ||
      sireneData.trancheEffectifsEtablissement
    ),
    dateCreation:
      uniteLegale.dateCreationUniteLegale ||
      periodeCourante?.dateCreationEtablissement ||
      sireneData.dateCreationEtablissement ||
      '',
    etatAdministratif: etatAdmin,
    statutDiffusion: uniteLegale.statutDiffusionUniteLegale || '',
    entityType,
    nomPersonne,
  };
}

// Labels pour les codes NAF (activités) - Version complète
export function getActivityLabel(code?: string): string {
  if (!code) return '';

  // Mapping complet des codes NAF selon la nomenclature INSEE
  const nafLabels: Record<string, string> = {
    // Informatique et services numériques
    '6201Z': 'Programmation informatique',
    '6202A': 'Conseil en systèmes et logiciels informatiques',
    '6202B': "Tierce maintenance de systèmes et d'applications informatiques",
    '6203Z': "Gestion d'installations informatiques",
    '6209Z': 'Autres activités informatiques',
    
    // Commerce
    '4711D': 'Supermarchés',
    '4711F': 'Hypermarchés',
    '4719B': 'Autres commerces de détail en magasin non spécialisé',
    
    // Restauration
    '5610A': 'Restauration traditionnelle',
    '5610C': 'Restauration de type rapide',
    
    // Immobilier
    '6820A': 'Location de logements',
    '6820B': "Location de terrains et d'autres biens immobiliers",
    
    // Conseil et services aux entreprises
    '7022Z': 'Conseil pour les affaires et autres conseils de gestion',
    '7111Z': "Activités d'architecture",
    '7112B': 'Ingénierie, études techniques',
    
    // Construction
    '4120A': 'Construction de maisons individuelles',
    '4120B': "Construction d'autres bâtiments",
    '4399C': 'Travaux de maçonnerie générale et gros œuvre de bâtiment',
    
    // Transport
    '4941A': 'Transports routiers de fret interurbains',
    '4941B': 'Transports routiers de fret de proximité',
    
    // Santé
    '8690A': 'Ambulances',
    '8690D': 'Activités des infirmiers et sages-femmes',
    '8690E': 'Activités des professionnels de la rééducation',
    
    // Services à la personne
    '9602A': 'Coiffure',
    '9602B': 'Soins de beauté',
    '9604Z': 'Entretien corporel',
  };

  return nafLabels[code] || getActivityLabelBySection(code);
}

// Fallback par section d'activité (2 premiers caractères)
function getActivityLabelBySection(code: string): string {
  if (!code || code.length < 2) return `Activité ${code}`;
  
  const section = code.substring(0, 2);
  const sectionLabels: Record<string, string> = {
    '01': 'Agriculture',
    '02': 'Sylviculture et exploitation forestière',
    '03': 'Pêche et aquaculture',
    '10': 'Industries alimentaires',
    '20': 'Industrie chimique',
    '26': 'Fabrication de produits informatiques, électroniques et optiques',
    '41': 'Construction de bâtiments',
    '42': 'Génie civil',
    '43': 'Travaux de construction spécialisés',
    '46': 'Commerce de gros',
    '47': 'Commerce de détail',
    '49': 'Transports terrestres',
    '55': 'Hébergement',
    '56': 'Restauration',
    '62': 'Programmation, conseil et autres activités informatiques',
    '68': 'Activités immobilières',
    '69': 'Activités juridiques et comptables',
    '70': 'Activités des sièges sociaux ; conseil de gestion',
    '71': "Activités d'architecture et d'ingénierie",
    '77': 'Activités de location et location-bail',
    '85': 'Enseignement',
    '86': 'Activités pour la santé humaine',
    '96': 'Autres services personnels',
  };
  
  return sectionLabels[section] || `Activité ${code}`;
}

// Labels pour les catégories juridiques
export function getJuridicalCategoryLabel(code?: string): string {
  if (!code) return '';

  const juridicalLabels: Record<string, string> = {
    '5710': 'SAS, société par actions simplifiée',
    '5720': 'SASU, société par actions simplifiée unipersonnelle',
    '5499': "SA à conseil d'administration (s.a.i.)",
    '5505': 'SARL, société à responsabilité limitée',
    '5385': 'EURL, entreprise unipersonnelle à responsabilité limitée',
    '1000': 'Entrepreneur individuel',
    '9220': 'Association déclarée',
    '7344': "Comité d'entreprise",
    '3220': 'Exploitation agricole à responsabilité limitée',
    '5308': 'Société coopérative de production à responsabilité limitée',
    '6100': 'Caisse de crédit municipal',
    '7364': 'Comité consultatif',
    '9260': 'Association reconnue d\'utilité publique',
  };

  return juridicalLabels[code] || `Catégorie ${code}`;
}

// Labels pour les tranches d'effectifs
export function getEffectiveRangeLabel(code?: string): string {
  if (!code) return '';

  const effectiveLabels: Record<string, string> = {
    'NN': 'Non déterminé',
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
    '53': '10 000 salariés et plus',
  };

  return effectiveLabels[code] || `${code} salariés`;
}

// Mapping départements vers régions
function getRegionFromDepartment(departmentCode: string): string {
  const regionMapping: Record<string, string> = {
    // Île-de-France
    '75': 'Île-de-France',
    '77': 'Île-de-France',
    '78': 'Île-de-France',
    '91': 'Île-de-France',
    '92': 'Île-de-France',
    '93': 'Île-de-France',
    '94': 'Île-de-France',
    '95': 'Île-de-France',
    
    // Provence-Alpes-Côte d'Azur
    '04': "Provence-Alpes-Côte d'Azur",
    '05': "Provence-Alpes-Côte d'Azur", 
    '06': "Provence-Alpes-Côte d'Azur",
    '13': "Provence-Alpes-Côte d'Azur",
    '83': "Provence-Alpes-Côte d'Azur",
    '84': "Provence-Alpes-Côte d'Azur",
    
    // Auvergne-Rhône-Alpes
    '01': 'Auvergne-Rhône-Alpes',
    '03': 'Auvergne-Rhône-Alpes',
    '07': 'Auvergne-Rhône-Alpes',
    '15': 'Auvergne-Rhône-Alpes',
    '26': 'Auvergne-Rhône-Alpes',
    '38': 'Auvergne-Rhône-Alpes',
    '42': 'Auvergne-Rhône-Alpes',
    '43': 'Auvergne-Rhône-Alpes',
    '63': 'Auvergne-Rhône-Alpes',
    '69': 'Auvergne-Rhône-Alpes',
    '73': 'Auvergne-Rhône-Alpes',
    '74': 'Auvergne-Rhône-Alpes',
    
    // Hauts-de-France
    '02': 'Hauts-de-France',
    '59': 'Hauts-de-France',
    '60': 'Hauts-de-France',
    '62': 'Hauts-de-France',
    '80': 'Hauts-de-France',
    
    // Occitanie
    '09': 'Occitanie',
    '11': 'Occitanie',
    '12': 'Occitanie',
    '30': 'Occitanie',
    '31': 'Occitanie',
    '32': 'Occitanie',
    '34': 'Occitanie',
    '46': 'Occitanie',
    '48': 'Occitanie',
    '65': 'Occitanie',
    '66': 'Occitanie',
    '81': 'Occitanie',
    '82': 'Occitanie',
  };

  return regionMapping[departmentCode] || 'Région inconnue';
}