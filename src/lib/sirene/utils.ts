// Utilitaires pour l'API SIRENE
import { SearchCriteria } from '@/types/search-criteria';

/**
 * Nettoie et valide les paramètres de recherche
 */
export function sanitizeInput(input: string): string | null {
  if (!input || typeof input !== 'string') return null;

  return input
    .trim()
    .replace(/[^\w\s\-.\"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

/**
 * Valide les critères selon les champs disponibles INSEE v3.11
 */
export function validateCriteria(criteria: SearchCriteria): SearchCriteria {
  const validatedCriteria: SearchCriteria = {};

  if (criteria.denomination) {
    const cleaned = sanitizeInput(criteria.denomination);
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
    const cleaned = sanitizeInput(criteria.ville);
    if (cleaned) validatedCriteria.ville = cleaned;
  }
  
  if (criteria.activitePrincipale) {
    const cleaned = sanitizeInput(criteria.activitePrincipale);
    if (cleaned) validatedCriteria.activitePrincipale = cleaned;
  }
  
  if (criteria.categorieJuridique) {
    const cleaned = sanitizeInput(criteria.categorieJuridique);
    if (cleaned) validatedCriteria.categorieJuridique = cleaned;
  }
  
  if (criteria.trancheEffectifs) {
    const cleaned = sanitizeInput(criteria.trancheEffectifs);
    if (cleaned) validatedCriteria.trancheEffectifs = cleaned;
  }
  
  if (criteria.etatAdministratif) {
    const cleaned = sanitizeInput(criteria.etatAdministratif);
    if (cleaned && (cleaned === 'A' || cleaned === 'F')) {
      validatedCriteria.etatAdministratif = cleaned as 'A' | 'F';
    }
  }

  return validatedCriteria;
}

/**
 * Construit la requête de recherche optimisée selon la documentation INSEE
 * Combine les meilleures pratiques des anciens services
 */
export function buildSearchQuery(
  freeText?: string,
  criteria?: SearchCriteria
): string {
  const parts: string[] = [];

  /**
   * Stratégie de recherche optimisée pour entrepreneurs individuels
   * Utilise à la fois denominationUniteLegale et la logique nom+prénom
   */
  const buildAdvancedSearch = (term: string): string => {
    if (term.includes(' ') && term.split(/\s+/).length === 2) {
      // Pour "NADIA ARAMIS" : recherche entrepreneurs individuels + entreprises
      const [prenom, nom] = term.split(/\s+/);
      return `((nomUniteLegale:${nom.toUpperCase()} AND prenom1UniteLegale:${prenom.toUpperCase()}) OR denominationUniteLegale:*${prenom.toUpperCase()}*${nom.toUpperCase()}* OR denominationUniteLegale:*${nom.toUpperCase()}*${prenom.toUpperCase()}*)`;
    } else if (term.includes(' ')) {
      // Plus de 2 mots : recherche exacte uniquement
      return `denominationUniteLegale:"${term}"`;
    } else {
      // Terme simple : recherche avec wildcard
      return `denominationUniteLegale:*${term}*`;
    }
  };

  // Recherche libre optimisée
  if (freeText && freeText.trim()) {
    const term = sanitizeInput(freeText);
    if (term) {
      parts.push(buildAdvancedSearch(term));
    }
  }

  // Critères spécifiques validés
  const validatedCriteria = validateCriteria(criteria || {});

  if (validatedCriteria.denomination) {
    if (validatedCriteria.denomination.includes(' ')) {
      const wordQueries = validatedCriteria.denomination
        .split(/\s+/)
        .map(w => `${w}*`)
        .join(' AND ');
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

  if (validatedCriteria.departement) {
    // Recherche par département via code postal (2 premiers chiffres)
    parts.push(`codePostalEtablissement:${validatedCriteria.departement}*`);
  }

  if (validatedCriteria.dateCreationDebut) {
    // Recherche par plage de dates >=
    parts.push(`dateCreationUniteLegale:[${validatedCriteria.dateCreationDebut} TO *]`);
  }

  if (validatedCriteria.dateCreationFin) {
    // Recherche par plage de dates <=
    parts.push(`dateCreationUniteLegale:[* TO ${validatedCriteria.dateCreationFin}]`);
  }

  // État administratif : toujours actif par défaut
  const etatAdmin = validatedCriteria.etatAdministratif || 'A';
  parts.push(`etatAdministratifUniteLegale:${etatAdmin}`);

  // Assemblage final avec logique correcte
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

// Champs optimisés selon la documentation INSEE v3.11
export const ESSENTIAL_UNITE_LEGALE_FIELDS = [
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
  'nicSiegeUniteLegale',
];

export const ESSENTIAL_ETABLISSEMENT_FIELDS = [
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
  'distributionSpecialeEtablissement',
  'trancheEffectifsEtablissement',
];

export const ALL_FIELDS = [
  ...ESSENTIAL_UNITE_LEGALE_FIELDS,
  ...ESSENTIAL_ETABLISSEMENT_FIELDS,
].join(',');

/**
 * Valide un SIREN (9 chiffres)
 */
export function isValidSiren(siren: string): boolean {
  const cleaned = siren.replace(/\D/g, '');
  return cleaned.length === 9;
}

/**
 * Valide un SIRET (14 chiffres)
 */
export function isValidSiret(siret: string): boolean {
  const cleaned = siret.replace(/\D/g, '');
  return cleaned.length === 14;
}

/**
 * Valide une date au format YYYY-MM-DD
 */
export function isValidDate(date: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}