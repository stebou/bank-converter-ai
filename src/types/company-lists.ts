// Types pour le système de listes d'entreprises

export interface CompanyList {
  id: string;
  name: string;
  description?: string;
  color?: string;
  isArchived: boolean;
  isShared: boolean;
  companyCount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  companies: Company[];
  tags: Tag[];
  _count?: {
    companies: number;
  };
}

export interface Company {
  id: string;
  siren: string;
  siret: string;
  denomination: string;
  website?: string;
  secteur?: string;
  industrie?: string;
  emplacement?: string;
  ville?: string;
  codePostal?: string;
  adresseComplete?: string;
  activitePrincipale?: string;
  activitePrincipaleLibelle?: string;
  categorieJuridique?: string;
  trancheEffectifs?: string;
  etatAdministratif?: string;
  siege: boolean;
  dateCreation?: Date;
  
  // Champs spécifiques au système de listes
  statut: CompanyStatus;
  notes?: string;
  linkedinUrl?: string;
  phoneNumber?: string;
  email?: string;
  contactPerson?: string;
  
  // Timestamps et propriétaire
  addedAt: Date;
  lastUpdatedFromINSEE: Date;
  
  // Relations
  ownerId: string;
  companyListId: string;
  dirigeants: Dirigeant[];
  tags: CompanyTag[];
}

export interface Dirigeant {
  id: string;
  prenom: string;
  nom: string;
  nomUsage?: string;
  pseudonyme?: string;
  qualite?: string;
  dateNaissance?: string;
  companyId: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  companyListId: string;
  companies: CompanyTag[];
}

export interface CompanyTag {
  id: string;
  companyId: string;
  tagId: string;
  tag: Tag;
}

export enum CompanyStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  INTERESTED = 'INTERESTED',
  NEGOTIATING = 'NEGOTIATING',
  CLOSED_WON = 'CLOSED_WON',
  CLOSED_LOST = 'CLOSED_LOST',
  NONPROFIT = 'NONPROFIT',
  INACTIVE = 'INACTIVE'
}

export const COMPANY_STATUS_LABELS: Record<CompanyStatus, string> = {
  [CompanyStatus.NEW]: 'Nouveau',
  [CompanyStatus.CONTACTED]: 'Contacté',
  [CompanyStatus.INTERESTED]: 'Intéressé',
  [CompanyStatus.NEGOTIATING]: 'En négociation',
  [CompanyStatus.CLOSED_WON]: 'Fermé gagné',
  [CompanyStatus.CLOSED_LOST]: 'Fermé perdu',
  [CompanyStatus.NONPROFIT]: 'Nonprofit',
  [CompanyStatus.INACTIVE]: 'Inactif'
};

export const COMPANY_STATUS_COLORS: Record<CompanyStatus, string> = {
  [CompanyStatus.NEW]: '#3b82f6',
  [CompanyStatus.CONTACTED]: '#8b5cf6',
  [CompanyStatus.INTERESTED]: '#10b981',
  [CompanyStatus.NEGOTIATING]: '#f59e0b',
  [CompanyStatus.CLOSED_WON]: '#059669',
  [CompanyStatus.CLOSED_LOST]: '#dc2626',
  [CompanyStatus.NONPROFIT]: '#6b7280',
  [CompanyStatus.INACTIVE]: '#9ca3af'
};

// Types pour les filtres d'import
export interface ImportFilters {
  // Liste de SIREN/SIRET pour import direct
  sirens?: string[];
  
  // Liste d'IDs d'entreprises existantes dans notre base
  companyIds?: string[];
  
  // Informations sur l'entreprise
  tailleEntreprise?: string[];
  secteurActivite?: string[];
  marcheEntreprise?: string[];
  typeEntreprise?: string[];
  nomEntreprise?: string;
  anneFondation?: { min?: number; max?: number };
  paysEntreprise?: string[];
  
  // Signaux & Intentions
  croissanceTaille?: { min?: number; max?: number };
  dateDernierFinancement?: { min?: Date; max?: Date };
  revenuEntreprise?: { min?: number; max?: number };
  motCleEntreprise?: string;
  
  // Contacts (pour future implémentation)
  contactsLimites?: { min?: number; max?: number };
}

// Interface pour la recherche d'entreprises avec filtres
export interface CompanySearchParams extends ImportFilters {
  query?: string;
  page?: number;
  limit?: number;
}

// Interface pour la création/modification de liste
export interface CreateCompanyListData {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateCompanyListData extends Partial<CreateCompanyListData> {
  id: string;
  isArchived?: boolean;
}

// Interface pour l'ajout d'entreprises à une liste
export interface AddCompaniesToListData {
  listId: string;
  companies: {
    siren: string;
    siret: string;
    statut?: CompanyStatus;
    notes?: string;
  }[];
}

// Interface pour les actions en lot
export interface BulkActionData {
  companyIds: string[];
  action: 'delete' | 'move' | 'tag' | 'status';
  targetListId?: string;
  targetStatus?: CompanyStatus;
  tagIds?: string[];
}

// Interface pour les statistiques de liste
export interface ListStats {
  totalCompanies: number;
  statusBreakdown: Record<CompanyStatus, number>;
  recentAdditions: number; // Ajouts des 7 derniers jours
  activeCompanies: number;
  averageScore?: number;
}
