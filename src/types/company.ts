// Types pour les services de données d'entreprises

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
  linkedInData?: LinkedInOrganization;
  enrichmentDate?: string;
  enrichmentSource?: 'linkedin' | 'manual';
  additionalInfo?: {
    estimatedRevenue?: number;
    employeeGrowthRate?: number;
    marketPosition?: string;
    keyProducts?: string[];
    competitorAnalysis?: {
      mainCompetitors?: string[];
      marketShare?: number;
      differentiatingFactors?: string[];
    };
    socialPresence?: {
      linkedInUrl?: string;
      twitterHandle?: string;
      facebookPage?: string;
    };
  };
  // Propriétés supplémentaires pour compatibilité
  linkedin?: any;
  website?: string;
  domain?: string;
  score?: number;
  tags?: string[];
}

export interface CompanySearchParams {
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
  nombre?: number;
  page?: number;
}

export interface CompanySearchResult {
  companies: INSEECompany[];
  total: number;
  page?: number;
  totalPages?: number;
}

export interface SearchFilters {
  sectors?: string[];
  regions?: string[];
  sizes?: string[];
  legalForms?: string[];
}
