// Service spécialisé pour l'enrichissement LinkedIn

import type {
    EnrichedCompany,
    INSEECompany,
    LinkedInOrganization
} from '../types/company';

export class LinkedInService {
  /**
   * Enrichit les données d'entreprise avec les informations LinkedIn
   * Note: Implémentation de démonstration - nécessite une API LinkedIn réelle
   */
  async enrichWithLinkedIn(
    companies: INSEECompany[]
  ): Promise<EnrichedCompany[]> {
    console.log('🔗 Enrichissement LinkedIn pour', companies.length, 'entreprises');

    const enrichedCompanies: EnrichedCompany[] = [];

    for (const company of companies) {
      try {
        // Simulation de l'enrichissement LinkedIn
        const linkedInData = await this.searchLinkedInOrganization(company.denomination);
        
        const enrichedCompany: EnrichedCompany = {
          ...company,
          linkedInData,
          enrichmentDate: new Date().toISOString(),
          enrichmentSource: 'linkedin',
          additionalInfo: this.generateAdditionalInfo(company, linkedInData),
        };

        enrichedCompanies.push(enrichedCompany);
        
        // Délai pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.warn(`⚠️ Erreur enrichissement pour ${company.denomination}:`, error);
        // En cas d'erreur, on ajoute l'entreprise sans enrichissement
        enrichedCompanies.push(company as EnrichedCompany);
      }
    }

    return enrichedCompanies;
  }

  /**
   * Recherche une organisation sur LinkedIn (simulation)
   */
  private async searchLinkedInOrganization(
    companyName: string
  ): Promise<LinkedInOrganization | undefined> {
    // Simulation d'une recherche LinkedIn
    // Dans une vraie implémentation, on ferait appel à l'API LinkedIn
    
    const isSimulation = true; // Passer à false avec une vraie API
    
    if (isSimulation) {
      return this.simulateLinkedInData(companyName);
    }

    // Exemple d'implémentation réelle (commenté)
    /*
    try {
      const response = await fetch(`https://api.linkedin.com/v2/organizations?q=name&name=${encodeURIComponent(companyName)}`, {
        headers: {
          'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.status}`);
      }

      const data = await response.json();
      return data.elements?.[0] ? this.mapLinkedInData(data.elements[0]) : undefined;
    } catch (error) {
      console.error('LinkedIn API error:', error);
      return undefined;
    }
    */
  }

  /**
   * Simule des données LinkedIn pour la démonstration
   */
  private simulateLinkedInData(companyName: string): LinkedInOrganization | undefined {
    // Simulation simple basée sur le nom de l'entreprise
    const random = Math.random();
    
    if (random < 0.3) {
      // 30% de chance de ne pas trouver de données LinkedIn
      return undefined;
    }

    return {
      organizationUrn: `urn:li:organization:${Math.floor(Math.random() * 1000000)}`,
      name: companyName,
      vanityName: companyName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: `${companyName} est une entreprise leader dans son secteur d'activité.`,
      website: `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.fr`,
      followerCount: Math.floor(Math.random() * 10000) + 100,
      industries: this.getRandomIndustries(),
      logoUrl: `https://example.com/logos/${companyName.replace(/\s+/g, '-').toLowerCase()}.png`,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Génère des informations supplémentaires basées sur les données disponibles
   */
  private generateAdditionalInfo(
    company: INSEECompany, 
    linkedInData?: LinkedInOrganization
  ): EnrichedCompany['additionalInfo'] {
    const baseRevenue = this.estimateRevenueFromSize(company.trancheEffectifs);
    
    return {
      estimatedRevenue: baseRevenue,
      employeeGrowthRate: Math.random() * 0.2 - 0.1, // -10% à +10%
      marketPosition: this.determineMarketPosition(linkedInData?.followerCount),
      keyProducts: this.generateKeyProducts(company.activitePrincipaleLibelle),
      competitorAnalysis: {
        mainCompetitors: this.generateCompetitors(company.activitePrincipale),
        marketShare: Math.random() * 0.15, // 0-15%
        differentiatingFactors: this.generateDifferentiatingFactors(),
      },
      socialPresence: {
        linkedInUrl: linkedInData ? `https://linkedin.com/company/${linkedInData.vanityName}` : undefined,
        twitterHandle: linkedInData ? `@${linkedInData.vanityName}` : undefined,
        facebookPage: linkedInData ? `https://facebook.com/${linkedInData.vanityName}` : undefined,
      },
    };
  }

  /**
   * Estime le chiffre d'affaires basé sur la taille de l'entreprise
   */
  private estimateRevenueFromSize(trancheEffectifs?: string): number | undefined {
    if (!trancheEffectifs) return undefined;

    const revenueRanges: Record<string, number> = {
      '00': 50000,      // 0 salarié
      '01': 150000,     // 1 à 2 salariés
      '02': 300000,     // 3 à 5 salariés
      '03': 500000,     // 6 à 9 salariés
      '11': 1000000,    // 10 à 19 salariés
      '12': 2500000,    // 20 à 49 salariés
      '21': 7500000,    // 50 à 99 salariés
      '22': 15000000,   // 100 à 199 salariés
      '31': 35000000,   // 200 à 249 salariés
      '32': 75000000,   // 250 à 499 salariés
      '41': 150000000,  // 500 à 999 salariés
      '42': 500000000,  // 1000 à 1999 salariés
      '51': 1000000000, // 2000 à 4999 salariés
      '52': 5000000000, // 5000 à 9999 salariés
      '53': 10000000000, // 10000+ salariés
    };

    return revenueRanges[trancheEffectifs] || undefined;
  }

  /**
   * Détermine la position marché basée sur les followers LinkedIn
   */
  private determineMarketPosition(followerCount?: number): string {
    if (!followerCount) return 'Position inconnue';
    
    if (followerCount > 10000) return 'Leader du marché';
    if (followerCount > 5000) return 'Acteur majeur';
    if (followerCount > 1000) return 'Acteur établi';
    return 'Acteur émergent';
  }

  /**
   * Génère des industries aléatoirement
   */
  private getRandomIndustries(): string[] {
    const industries = [
      'Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing',
      'Education', 'Consulting', 'Real Estate', 'Transportation', 'Energy'
    ];
    
    const count = Math.floor(Math.random() * 3) + 1;
    return industries.sort(() => 0.5 - Math.random()).slice(0, count);
  }

  /**
   * Génère des produits clés basés sur l'activité
   */
  private generateKeyProducts(activite?: string): string[] {
    if (!activite) return [];
    
    // Mapping simple activité -> produits
    const productMap: Record<string, string[]> = {
      'commerce': ['Vente en ligne', 'Points de vente', 'Service client'],
      'conseil': ['Conseil stratégique', 'Formation', 'Audit'],
      'informatique': ['Logiciels', 'Solutions cloud', 'Support technique'],
      'construction': ['Bâtiment', 'Travaux publics', 'Rénovation'],
    };

    for (const [key, products] of Object.entries(productMap)) {
      if (activite.toLowerCase().includes(key)) {
        return products;
      }
    }

    return ['Produits et services spécialisés'];
  }

  /**
   * Génère une liste de concurrents potentiels
   */
  private generateCompetitors(activitePrincipale?: string): string[] {
    // Simulation - dans la réalité, on rechercherait des entreprises similaires
    return [
      'Concurrent A',
      'Concurrent B', 
      'Concurrent C'
    ].slice(0, Math.floor(Math.random() * 3) + 1);
  }

  /**
   * Génère des facteurs différenciants
   */
  private generateDifferentiatingFactors(): string[] {
    const factors = [
      'Innovation technologique',
      'Service client premium',
      'Prix compétitifs',
      'Expertise sectorielle',
      'Couverture géographique',
      'Partenariats stratégiques'
    ];

    const count = Math.floor(Math.random() * 3) + 1;
    return factors.sort(() => 0.5 - Math.random()).slice(0, count);
  }
}

export const linkedInService = new LinkedInService();
