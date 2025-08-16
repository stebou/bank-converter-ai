// Fichier de compatibilité pour l'ancien companyDataService
// Redirige vers la nouvelle architecture modulaire

import { companyDataService } from '../services/company-data.service';

// Export de compatibilité
export { companyDataService };

// Re-export des types pour compatibilité
export type {
  INSEECompany,
  LinkedInOrganization,
  EnrichedCompany,
} from '../types/company';

// Note: Ce fichier peut être supprimé une fois que tous les imports
// ont été mis à jour pour utiliser les nouveaux services modulaires
