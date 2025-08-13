import { CompanySearchResult } from '@/types/search-criteria';
import { SireneCompany } from './sirene-api';

// Fonction pour transformer les données SIRENE en format application
export function transformSireneToCompanyResult(sireneData: SireneCompany): CompanySearchResult {
  // Extraire les données de l'unité légale
  const uniteLegale = sireneData.uniteLegale || {};
  const adresse = sireneData.adresseEtablissement || {};
  
  // Récupérer la période courante (première période avec dateFin = null ou en direct)
  const periodeCourante = sireneData.periodesEtablissement?.find(p => p.dateFin === null) || 
                          sireneData.periodesEtablissement?.[0];

  // Construire l'adresse complète avec tous les éléments disponibles
  const numeroVoie = adresse.numeroVoieEtablissement || sireneData.numeroVoieEtablissement;
  const typeVoie = adresse.typeVoieEtablissement || sireneData.typeVoieEtablissement;
  const libelleVoie = adresse.libelleVoieEtablissement || sireneData.libelleVoieEtablissement;
  const complement = adresse.complementAdresseEtablissement || sireneData.complementAdresseEtablissement;
  const distribution = adresse.distributionSpecialeEtablissement || sireneData.distributionSpecialeEtablissement;
  
  const adresseElements = [numeroVoie, typeVoie, libelleVoie, complement, distribution].filter(Boolean);
  const adresseComplete = adresseElements.join(' ').trim();

  // Construire le nom complet selon la documentation SIRENE
  // Priorité : dénomination principale > dénominations usuelles > noms personnes physiques > enseignes
  const denomination = 
    // 1. Dénominations de l'unité légale (personnes morales)
    uniteLegale.denominationUniteLegale ||
    uniteLegale.denominationUsuelle1UniteLegale ||
    uniteLegale.denominationUsuelle2UniteLegale ||
    uniteLegale.denominationUsuelle3UniteLegale ||
    uniteLegale.sigleUniteLegale ||
    
    // 2. Noms des personnes physiques (entrepreneurs individuels)
    (function() {
      const prenom = uniteLegale.prenomUsuelUniteLegale || 
                    uniteLegale.prenom1UniteLegale ||
                    uniteLegale.prenom2UniteLegale ||
                    uniteLegale.prenom3UniteLegale ||
                    uniteLegale.prenom4UniteLegale;
      const nom = uniteLegale.nomUniteLegale || uniteLegale.nomUsageUniteLegale;
      
      if (prenom && nom) {
        return `${prenom} ${nom}`.trim();
      } else if (nom) {
        return nom;
      }
      return null;
    })() ||
    
    // 3. Pseudonyme
    uniteLegale.pseudonymeUniteLegale ||
    
    // 4. Enseignes d'établissement
    sireneData.denominationUsuelleEtablissement ||
    periodeCourante?.enseigne1Etablissement ||
    sireneData.enseigne1Etablissement ||
    sireneData.enseigne2Etablissement ||
    sireneData.enseigne3Etablissement ||
    
    // 5. Fallback
    'Nom non disponible';

  // État administratif (priorité : UL > établissement courant > établissement direct)
  const etatAdmin = uniteLegale.etatAdministratifUniteLegale || 
                   periodeCourante?.etatAdministratifEtablissement ||
                   sireneData.etatAdministratifEtablissement ||
                   'N/A';

  // Code postal et commune avec code géographique
  const codePostal = adresse.codePostalEtablissement || sireneData.codePostalEtablissement || '';
  const commune = adresse.libelleCommuneEtablissement || sireneData.libelleCommuneEtablissement || '';
  const codeCommune = adresse.codeCommuneEtablissement || sireneData.codeCommuneEtablissement || '';

  return {
    siren: sireneData.siren,
    siret: sireneData.siret || '',
    denomination: denomination,
    activitePrincipale: uniteLegale.activitePrincipaleUniteLegale || 
                       periodeCourante?.activitePrincipaleEtablissement ||
                       sireneData.activitePrincipaleEtablissement || '',
    activitePrincipaleLibelle: getActivityLabel(uniteLegale.activitePrincipaleUniteLegale),
    categorieJuridique: uniteLegale.categorieJuridiqueUniteLegale || '',
    categorieJuridiqueLibelle: getJuridicalCategoryLabel(uniteLegale.categorieJuridiqueUniteLegale),
    adresse: {
      numeroVoie: numeroVoie,
      typeVoie: typeVoie,
      libelleVoie: libelleVoie,
      codePostal: codePostal,
      commune: commune,
      departement: codeCommune.length >= 2 ? codeCommune.substring(0, 2) : '',
      region: ''
    },
    trancheEffectifs: uniteLegale.trancheEffectifsUniteLegale || 
                     periodeCourante?.trancheEffectifsEtablissement ||
                     sireneData.trancheEffectifsEtablissement,
    trancheEffectifsLibelle: getEffectiveRangeLabel(uniteLegale.trancheEffectifsUniteLegale || 
                                                   periodeCourante?.trancheEffectifsEtablissement),
    dateCreation: uniteLegale.dateCreationUniteLegale || 
                 periodeCourante?.dateCreationEtablissement ||
                 sireneData.dateCreationEtablissement || '',
    etatAdministratif: etatAdmin,
    statutDiffusion: uniteLegale.statutDiffusionUniteLegale || ''
  };
}

// Labels pour les codes NAF (activités)
function getActivityLabel(code?: string): string {
  if (!code) return '';
  
  // Mapping partiel des codes NAF les plus courants
  const nafLabels: Record<string, string> = {
    '6201Z': 'Programmation informatique',
    '6202A': 'Conseil en systèmes et logiciels informatiques',
    '6202B': 'Tierce maintenance de systèmes et d\'applications informatiques',
    '6203Z': 'Gestion d\'installations informatiques',
    '6209Z': 'Autres activités informatiques',
    '4711D': 'Supermarchés',
    '4711F': 'Hypermarchés',
    '5610A': 'Restauration traditionnelle',
    '5610C': 'Restauration de type rapide',
    '6820A': 'Location de logements',
    '6820B': 'Location de terrains et d\'autres biens immobiliers',
    '7022Z': 'Conseil pour les affaires et autres conseils de gestion',
    '7111Z': 'Activités d\'architecture',
    '7112B': 'Ingénierie, études techniques',
    '4120A': 'Construction de maisons individuelles',
    '4120B': 'Construction d\'autres bâtiments',
    '4399C': 'Travaux de maçonnerie générale et gros œuvre de bâtiment'
  };

  return nafLabels[code] || `Activité ${code}`;
}

// Labels pour les catégories juridiques
function getJuridicalCategoryLabel(code?: string): string {
  if (!code) return '';

  const juridicalLabels: Record<string, string> = {
    '5710': 'SAS, société par actions simplifiée',
    '5720': 'SASU, société par actions simplifiée unipersonnelle',
    '5499': 'SA à conseil d\'administration (s.a.i.)',
    '5505': 'SARL, société à responsabilité limitée',
    '5385': 'EURL, entreprise unipersonnelle à responsabilité limitée',
    '1000': 'Entrepreneur individuel',
    '9220': 'Association déclarée',
    '7344': 'Comité d\'entreprise',
    '3220': 'Exploitation agricole à responsabilité limitée',
    '5308': 'Société coopérative de production à responsabilité limitée'
  };

  return juridicalLabels[code] || `Catégorie ${code}`;
}

// Labels pour les tranches d'effectifs
function getEffectiveRangeLabel(code?: string): string {
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
    '53': '10 000 salariés et plus'
  };

  return effectiveLabels[code] || `${code} salariés`;
}

// Mapping départements vers régions (simplifié)
function getRegionFromDepartment(departmentCode: string): string {
  const regionMapping: Record<string, string> = {
    '75': 'Île-de-France',
    '77': 'Île-de-France',
    '78': 'Île-de-France',
    '91': 'Île-de-France',
    '92': 'Île-de-France',
    '93': 'Île-de-France',
    '94': 'Île-de-France',
    '95': 'Île-de-France',
    '13': 'Provence-Alpes-Côte d\'Azur',
    '06': 'Provence-Alpes-Côte d\'Azur',
    '83': 'Provence-Alpes-Côte d\'Azur',
    '84': 'Provence-Alpes-Côte d\'Azur',
    '69': 'Auvergne-Rhône-Alpes',
    '01': 'Auvergne-Rhône-Alpes',
    '07': 'Auvergne-Rhône-Alpes',
    '26': 'Auvergne-Rhône-Alpes',
    '38': 'Auvergne-Rhône-Alpes',
    '42': 'Auvergne-Rhône-Alpes',
    '73': 'Auvergne-Rhône-Alpes',
    '74': 'Auvergne-Rhône-Alpes',
    '59': 'Hauts-de-France',
    '62': 'Hauts-de-France',
    '02': 'Hauts-de-France',
    '60': 'Hauts-de-France',
    '80': 'Hauts-de-France'
  };

  return regionMapping[departmentCode] || 'Région inconnue';
}
