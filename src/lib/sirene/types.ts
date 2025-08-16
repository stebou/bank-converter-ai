// Types unifiés pour l'API SIRENE de l'INSEE v3.11
export interface SireneApiConfig {
  baseUrl: string;
  apiKey?: string;
}

// Types réutilisés depuis @/types/search-criteria
// SearchCriteria, CompanySearchResult, CompanySearchResponse

export interface SireneSearchParams {
  q?: string;
  nombre?: number;
  debut?: number;
  champs?: string;
  tri?: string;
  facette?: string;
}

// Interface pour la réponse brute SIRENE
export interface SireneApiResponse {
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
      trancheEffectifsEtablissement?: string;
      dateCreationEtablissement?: string;
    }>;
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

// Classes d'erreur spécialisées
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