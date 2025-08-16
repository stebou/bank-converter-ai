// Point d'entrée unifié pour le service SIRENE
// Exporte toutes les fonctionnalités de la nouvelle architecture

// Service principal
export { SireneService, sireneService } from './service';

// Types SIRENE spécifiques
export type {
  SireneApiConfig,
  SireneSearchParams,
  SireneApiResponse,
} from './types';

// Types principaux depuis @/types/search-criteria
export type {
  SearchCriteria,
  CompanySearchResult,
  CompanySearchResponse,
} from '@/types/search-criteria';

// Erreurs
export {
  SireneApiError,
  SireneQuotaError,
  SireneValidationError,
} from './types';

// Transformateurs
export {
  transformSireneToCompanyResult,
  getActivityLabel,
  getJuridicalCategoryLabel,
  getEffectiveRangeLabel,
} from './transformers';

// Utilitaires
export {
  sanitizeInput,
  validateCriteria,
  buildSearchQuery,
  isValidSiren,
  isValidSiret,
  isValidDate,
  ALL_FIELDS,
  ESSENTIAL_UNITE_LEGALE_FIELDS,
  ESSENTIAL_ETABLISSEMENT_FIELDS,
} from './utils';

// Fonctions de compatibilité avec l'ancienne API (pour migration en douceur)
export const searchCompanies = sireneService.searchCompaniesByName.bind(sireneService);
export const searchCompaniesWithFilters = sireneService.searchCompaniesWithFilters.bind(sireneService);
export const searchBySiren = async (siren: string) => {
  const response = await sireneService.searchBySiren(siren);
  return response.companies;
};
export const getCompanyBySiren = sireneService.getCompanyBySiren.bind(sireneService);