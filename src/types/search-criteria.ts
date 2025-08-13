export interface SearchCriteria {
  // Informations générales
  denomination?: string;
  siren?: string;
  siret?: string;
  
  // Localisation
  codePostal?: string;
  ville?: string;
  commune?: string; // Ajouté pour SIRENE
  departement?: string;
  region?: string;
  
  // Activité
  activitePrincipale?: string; // Code NAF
  categorieJuridique?: string;
  
  // Caractéristiques économiques
  trancheEffectifs?: string;
  chiffreAffaires?: {
    min?: number;
    max?: number;
  };
  
  // Dates
  dateCreation?: {
    debut?: string;
    fin?: string;
  };
  dateCreationDebut?: string; // Format YYYY-MM-DD
  dateCreationFin?: string; // Format YYYY-MM-DD
  dateDernierFinancement?: {
    debut?: string;
    fin?: string;
  };
  
  // État
  etatAdministratif?: 'A' | 'F'; // Actif ou Fermé
  statutDiffusion?: 'O' | 'P' | 'N'; // Oui, Partiel, Non
}

export interface SearchFilters {
  criteria: SearchCriteria;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CompanySearchResult {
  siren: string;
  siret?: string;
  denomination?: string;
  activitePrincipale?: string;
  activitePrincipaleLibelle?: string;
  categorieJuridique?: string;
  categorieJuridiqueLibelle?: string;
  adresse: {
    numeroVoie?: string;
    typeVoie?: string;
    libelleVoie?: string;
    codePostal?: string;
    commune?: string;
    departement?: string;
    region?: string;
  };
  trancheEffectifs?: string;
  trancheEffectifsLibelle?: string;
  dateCreation?: string;
  etatAdministratif?: string;
  statutDiffusion?: string;
  selected?: boolean;
  // Nouveaux champs pour identifier le type d'entité
  entityType?: 'entrepreneur_individuel' | 'personne_physique' | 'entreprise';
  nomPersonne?: {
    prenom?: string;
    nom?: string;
  };
}

// Constantes pour les options de filtres
export const TRANCHES_EFFECTIFS = [
  { value: 'NN', label: 'Non précisé' },
  { value: '00', label: '0 salarié' },
  { value: '01', label: '1 ou 2 salariés' },
  { value: '02', label: '3 à 5 salariés' },
  { value: '03', label: '6 à 9 salariés' },
  { value: '11', label: '10 à 19 salariés' },
  { value: '12', label: '20 à 49 salariés' },
  { value: '21', label: '50 à 99 salariés' },
  { value: '22', label: '100 à 199 salariés' },
  { value: '31', label: '200 à 249 salariés' },
  { value: '32', label: '250 à 499 salariés' },
  { value: '41', label: '500 à 999 salariés' },
  { value: '42', label: '1000 à 1999 salariés' },
  { value: '51', label: '2000 à 4999 salariés' },
  { value: '52', label: '5000 à 9999 salariés' },
  { value: '53', label: '10000 salariés et plus' }
];

export const CATEGORIES_JURIDIQUES = [
  { value: '1000', label: 'Entrepreneur individuel' },
  { value: '5499', label: 'SARL unipersonnelle' },
  { value: '5710', label: 'SAS, société par actions simplifiée' },
  { value: '5720', label: 'SASU, société par actions simplifiée unipersonnelle' },
  { value: '5505', label: 'SARL' },
  { value: '5599', label: 'Autre SARL' },
  { value: '5770', label: 'Société par actions simplifiée (s.a.s)' },
  // Ajouter d'autres catégories selon les besoins
];

export const CODES_NAF_PRINCIPAUX = [
  { value: '01', label: 'Agriculture, sylviculture et pêche' },
  { value: '05', label: 'Extraction de houille et de lignite' },
  { value: '10', label: 'Industries alimentaires' },
  { value: '20', label: 'Industrie chimique' },
  { value: '35', label: 'Production et distribution d\'électricité, de gaz, de vapeur et d\'air conditionné' },
  { value: '41', label: 'Construction de bâtiments' },
  { value: '45', label: 'Commerce et réparation d\'automobiles et de motocycles' },
  { value: '46', label: 'Commerce de gros, à l\'exception des automobiles et des motocycles' },
  { value: '47', label: 'Commerce de détail, à l\'exception des automobiles et des motocycles' },
  { value: '62', label: 'Programmation, conseil et autres activités informatiques' },
  { value: '68', label: 'Activités immobilières' },
  { value: '70', label: 'Activités des sièges sociaux ; conseil de gestion' },
  // Ajouter d'autres codes selon les besoins
];
