// Générateur de données de test pour le système d'agents IA

import type { 
  SalesRecord, 
  InventoryRecord, 
  SupplierRecord, 
  ExternalFactor,
  StockAnalysisState 
} from '@/types/ai-agents';

export class AIAgentsTestDataGenerator {
  private productIds: string[];
  private customerSegments: string[];
  private channels: string[];
  private suppliers: string[];

  constructor() {
    this.productIds = [
      'LAPTOP-001', 'PHONE-002', 'TABLET-003', 'MONITOR-004', 'KEYBOARD-005',
      'MOUSE-006', 'PRINTER-007', 'HEADSET-008', 'CAMERA-009', 'SPEAKER-010',
      'CABLE-011', 'BATTERY-012', 'CHARGER-013', 'CASE-014', 'STAND-015',
      'DESK-016', 'CHAIR-017', 'LAMP-018', 'PAPER-019', 'PEN-020'
    ];

    this.customerSegments = ['ENTERPRISE', 'SMB', 'CONSUMER', 'EDUCATION', 'GOVERNMENT'];
    this.channels = ['ONLINE', 'RETAIL', 'B2B', 'WHOLESALE', 'PARTNER'];
    this.suppliers = ['SUP-TECH', 'SUP-OFFICE', 'SUP-FURNITURE', 'SUP-ACCESSORIES'];
  }

  // Génération de données de ventes historiques
  generateSalesHistory(daysBack: number = 365, recordsPerDay: number = 50): SalesRecord[] {
    const salesRecords: SalesRecord[] = [];
    const now = new Date();

    for (let day = 0; day < daysBack; day++) {
      const currentDate = new Date(now);
      currentDate.setDate(now.getDate() - day);

      // Génération des ventes pour la journée
      const dailyRecords = this.generateDailySales(currentDate, recordsPerDay);
      salesRecords.push(...dailyRecords);
    }

    return salesRecords.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // Génération des ventes d'une journée
  private generateDailySales(date: Date, targetRecords: number): SalesRecord[] {
    const records: SalesRecord[] = [];
    const actualRecords = this.randomBetween(Math.floor(targetRecords * 0.7), Math.floor(targetRecords * 1.3));

    for (let i = 0; i < actualRecords; i++) {
      const productId = this.selectRandomProduct(date);
      const basePrice = this.getProductBasePrice(productId);
      
      // Facteurs influençant les ventes
      const seasonalMultiplier = this.getSeasonalMultiplier(date, productId);
      const weekdayMultiplier = this.getWeekdayMultiplier(date);
      const promotionalMultiplier = this.getPromotionalMultiplier(date, productId);
      
      const quantity = Math.max(1, Math.floor(
        this.randomBetween(1, 5) * seasonalMultiplier * weekdayMultiplier * promotionalMultiplier
      ));
      
      // Prix avec variations
      const priceVariation = this.randomBetween(0.85, 1.15);
      const unitPrice = basePrice * priceVariation * promotionalMultiplier;
      
      records.push({
        product_id: productId,
        date: new Date(date),
        quantity_sold: quantity,
        revenue: quantity * unitPrice,
        channel: this.selectRandomChannel(),
        customer_segment: this.selectRandomCustomerSegment()
      });
    }

    return records;
  }

  // Génération d'inventaire actuel
  generateCurrentInventory(): InventoryRecord[] {
    return this.productIds.map(productId => {
      const baseStock = this.getProductBaseStock(productId);
      const variation = this.randomBetween(0.3, 1.8);
      const currentQuantity = Math.floor(baseStock * variation);
      const reservedQuantity = Math.floor(currentQuantity * this.randomBetween(0, 0.2));
      
      return {
        product_id: productId,
        current_quantity: currentQuantity,
        reserved_quantity: reservedQuantity,
        available_quantity: currentQuantity - reservedQuantity,
        location: `WAREHOUSE-${this.randomBetween(1, 3)}`,
        last_updated: new Date(Date.now() - this.randomBetween(0, 7) * 24 * 60 * 60 * 1000)
      };
    });
  }

  // Génération de données fournisseurs
  generateSupplierData(): SupplierRecord[] {
    const supplierRecords: SupplierRecord[] = [];

    for (const productId of this.productIds) {
      const suppliersCount = this.randomBetween(1, 3);
      
      for (let i = 0; i < suppliersCount; i++) {
        const supplierId = this.suppliers[i % this.suppliers.length];
        const basePrice = this.getProductBasePrice(productId);
        
        supplierRecords.push({
          supplier_id: supplierId,
          product_id: productId,
          lead_time_days: this.randomBetween(7, 45),
          minimum_order_quantity: this.getProductMOQ(productId),
          cost_per_unit: basePrice * this.randomBetween(0.6, 0.8), // Coût fournisseur
          reliability_score: this.randomBetween(0.7, 0.98)
        });
      }
    }

    return supplierRecords;
  }

  // Génération de facteurs externes
  generateExternalFactors(daysAhead: number = 30): ExternalFactor[] {
    const factors: ExternalFactor[] = [];
    const now = new Date();

    // Événements calendaires
    const holidays = this.getUpcomingHolidays(now, daysAhead);
    for (const holiday of holidays) {
      factors.push({
        type: 'CALENDAR',
        date: holiday.date,
        value: holiday.impact,
        impact_score: holiday.impact,
        description: holiday.name
      });
    }

    // Événements météo (simulation)
    for (let day = 1; day <= daysAhead; day++) {
      const futureDate = new Date(now);
      futureDate.setDate(now.getDate() + day);
      
      if (Math.random() < 0.1) { // 10% de chance d'événement météo
        factors.push({
          type: 'WEATHER',
          date: futureDate,
          value: this.randomBetween(-0.3, 0.3),
          impact_score: Math.abs(this.randomBetween(0.1, 0.4)),
          description: this.randomBetween(0, 1) > 0.5 ? 'Temps favorable' : 'Conditions défavorables'
        });
      }
    }

    // Événements promotionnels
    const promotionDays = Math.floor(daysAhead / 10); // Une promotion tous les 10 jours
    for (let i = 0; i < promotionDays; i++) {
      const promoDate = new Date(now);
      promoDate.setDate(now.getDate() + (i + 1) * 10 + this.randomBetween(-2, 2));
      
      factors.push({
        type: 'PROMOTIONAL',
        date: promoDate,
        value: this.randomBetween(0.2, 0.8),
        impact_score: this.randomBetween(0.3, 0.7),
        description: 'Campagne promotionnelle'
      });
    }

    // Indicateurs économiques (simulation)
    const economicEvents = ['Taux d\'intérêt', 'Inflation', 'Confiance consommateur'];
    for (let i = 0; i < 3; i++) {
      const eventDate = new Date(now);
      eventDate.setDate(now.getDate() + this.randomBetween(5, 25));
      
      factors.push({
        type: 'ECONOMIC',
        date: eventDate,
        value: this.randomBetween(-0.2, 0.2),
        impact_score: this.randomBetween(0.1, 0.3),
        description: economicEvents[i]
      });
    }

    return factors.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // Génération d'un état complet pour tests
  generateCompleteTestState(daysBack: number = 180): StockAnalysisState {
    const salesHistory = this.generateSalesHistory(daysBack, 40);
    const currentInventory = this.generateCurrentInventory();
    const supplierData = this.generateSupplierData();

    return {
      raw_data: {
        sales_history: salesHistory,
        current_inventory: currentInventory,
        supplier_data: supplierData
      },
      processed_insights: {
        demand_patterns: [],
        seasonality: [],
        product_segments: []
      },
      forecasts: {
        short_term: [],
        medium_term: [],
        long_term: [],
        confidence_intervals: {}
      },
      optimization_results: {
        reorder_points: [],
        safety_stocks: [],
        order_quantities: []
      },
      alerts: [],
      recommendations: [],
      metrics: {
        forecast_accuracy: {
          overall_mape: 0,
          short_term_mape: 0,
          medium_term_mape: 0,
          bias_percentage: 0
        },
        service_metrics: {
          service_level: 0,
          fill_rate: 0,
          stockout_frequency: 0,
          average_stockout_duration: 0
        },
        financial_metrics: {
          inventory_turnover: 0,
          days_of_inventory: 0,
          holding_cost_percentage: 0,
          dead_stock_ratio: 0
        },
        ai_performance: {
          alert_precision: 0,
          recommendation_adoption: 0,
          proactive_prevention: 0,
          model_stability: 0
        }
      },
      real_time_metrics: {
        current_alerts: [],
        forecast_confidence_today: 0,
        inventory_status: {
          products_below_min: 0,
          products_above_max: 0,
          predicted_stockouts_7d: 0,
          total_inventory_value: 0
        },
        agent_health: {}
      }
    };
  }

  // Méthodes utilitaires

  private selectRandomProduct(date: Date): string {
    // Produits plus populaires selon la saison
    const month = date.getMonth();
    
    if (month >= 10 || month <= 1) { // Hiver - produits tech plus populaires
      const techProducts = this.productIds.filter(id => 
        id.includes('LAPTOP') || id.includes('PHONE') || id.includes('TABLET')
      );
      if (Math.random() < 0.4) {
        return techProducts[Math.floor(Math.random() * techProducts.length)];
      }
    }
    
    if (month >= 8 && month <= 9) { // Rentrée - produits bureau populaires
      const officeProducts = this.productIds.filter(id => 
        id.includes('DESK') || id.includes('CHAIR') || id.includes('PAPER') || id.includes('PEN')
      );
      if (Math.random() < 0.3) {
        return officeProducts[Math.floor(Math.random() * officeProducts.length)];
      }
    }

    return this.productIds[Math.floor(Math.random() * this.productIds.length)];
  }

  private getProductBasePrice(productId: string): number {
    const priceMap: { [key: string]: number } = {
      'LAPTOP': 1200,
      'PHONE': 800,
      'TABLET': 400,
      'MONITOR': 300,
      'PRINTER': 250,
      'DESK': 200,
      'CHAIR': 150,
      'KEYBOARD': 80,
      'MOUSE': 50,
      'HEADSET': 120,
      'CAMERA': 300,
      'SPEAKER': 100,
      'CABLE': 25,
      'BATTERY': 30,
      'CHARGER': 40,
      'CASE': 35,
      'STAND': 45,
      'LAMP': 60,
      'PAPER': 5,
      'PEN': 2
    };

    for (const [key, price] of Object.entries(priceMap)) {
      if (productId.includes(key)) {
        return price;
      }
    }

    return 100; // Prix par défaut
  }

  private getProductBaseStock(productId: string): number {
    const basePrice = this.getProductBasePrice(productId);
    
    // Stock inversement proportionnel au prix
    if (basePrice > 1000) return this.randomBetween(10, 30);
    if (basePrice > 500) return this.randomBetween(20, 60);
    if (basePrice > 100) return this.randomBetween(50, 150);
    return this.randomBetween(100, 500);
  }

  private getProductMOQ(productId: string): number {
    const basePrice = this.getProductBasePrice(productId);
    
    // MOQ inversement proportionnel au prix
    if (basePrice > 1000) return this.randomBetween(5, 10);
    if (basePrice > 500) return this.randomBetween(10, 25);
    if (basePrice > 100) return this.randomBetween(25, 50);
    return this.randomBetween(50, 100);
  }

  private getSeasonalMultiplier(date: Date, productId: string): number {
    const month = date.getMonth();
    
    // Saisonnalité pour produits tech (Q4 forte demande)
    if (productId.includes('LAPTOP') || productId.includes('PHONE') || productId.includes('TABLET')) {
      if (month >= 10 || month <= 1) return this.randomBetween(1.3, 1.8);
      if (month >= 2 && month <= 4) return this.randomBetween(0.7, 0.9);
      return 1.0;
    }
    
    // Saisonnalité pour fournitures bureau (rentrée)
    if (productId.includes('PAPER') || productId.includes('PEN') || productId.includes('DESK')) {
      if (month >= 8 && month <= 9) return this.randomBetween(1.4, 1.9);
      if (month >= 5 && month <= 7) return this.randomBetween(0.6, 0.8);
      return 1.0;
    }

    return this.randomBetween(0.9, 1.1);
  }

  private getWeekdayMultiplier(date: Date): number {
    const dayOfWeek = date.getDay();
    
    // Moins de ventes le weekend
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return this.randomBetween(0.4, 0.7);
    }
    
    // Pic en milieu de semaine
    if (dayOfWeek >= 2 && dayOfWeek <= 4) {
      return this.randomBetween(1.1, 1.3);
    }
    
    return 1.0;
  }

  private getPromotionalMultiplier(date: Date, productId: string): number {
    // Simulation de promotions aléatoires
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    // Black Friday simulation (jour 330 environ)
    if (dayOfYear >= 325 && dayOfYear <= 335) {
      return this.randomBetween(1.5, 2.5);
    }
    
    // Promotions aléatoires (5% de chance)
    if (Math.random() < 0.05) {
      return this.randomBetween(1.2, 1.8);
    }
    
    return this.randomBetween(0.95, 1.05);
  }

  private selectRandomChannel(): string {
    const weights = [0.4, 0.25, 0.2, 0.1, 0.05]; // Probabilités pour chaque canal
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < this.channels.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return this.channels[i];
      }
    }
    
    return this.channels[0];
  }

  private selectRandomCustomerSegment(): string {
    const weights = [0.3, 0.25, 0.25, 0.15, 0.05];
    const random = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < this.customerSegments.length; i++) {
      cumulative += weights[i];
      if (random <= cumulative) {
        return this.customerSegments[i];
      }
    }
    
    return this.customerSegments[0];
  }

  private getUpcomingHolidays(startDate: Date, daysAhead: number): { date: Date; name: string; impact: number }[] {
    const holidays = [];
    const year = startDate.getFullYear();
    
    // Définition des jours fériés et événements
    const holidayDates = [
      { month: 0, day: 1, name: 'Nouvel An', impact: 0.3 },
      { month: 1, day: 14, name: 'Saint-Valentin', impact: 0.4 },
      { month: 2, day: 21, name: 'Début Printemps', impact: 0.2 },
      { month: 4, day: 1, name: 'Fête du Travail', impact: 0.3 },
      { month: 5, day: 21, name: 'Début Été', impact: 0.2 },
      { month: 8, day: 1, name: 'Rentrée', impact: 0.6 },
      { month: 9, day: 31, name: 'Halloween', impact: 0.3 },
      { month: 10, day: 25, name: 'Black Friday', impact: 0.8 },
      { month: 11, day: 25, name: 'Noël', impact: 0.7 }
    ];

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + daysAhead);

    for (const holiday of holidayDates) {
      const holidayDate = new Date(year, holiday.month, holiday.day);
      
      // Vérifier aussi l'année suivante si nécessaire
      if (holidayDate < startDate) {
        holidayDate.setFullYear(year + 1);
      }
      
      if (holidayDate >= startDate && holidayDate <= endDate) {
        holidays.push({
          date: holidayDate,
          name: holiday.name,
          impact: holiday.impact
        });
      }
    }

    return holidays;
  }

  private randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  // Méthodes de génération ciblée pour tests spécifiques

  generateHighVolatilityProduct(): SalesRecord[] {
    const productId = 'VOLATILE-TEST';
    const records: SalesRecord[] = [];
    const now = new Date();

    for (let day = 0; day < 90; day++) {
      const date = new Date(now);
      date.setDate(now.getDate() - day);
      
      // Demande très volatile avec pics et creux aléatoires
      const baseQuantity = 10;
      const volatilityFactor = Math.random() < 0.2 ? this.randomBetween(3, 8) : this.randomBetween(0.1, 1.5);
      const quantity = Math.floor(baseQuantity * volatilityFactor);
      
      if (quantity > 0) {
        records.push({
          product_id: productId,
          date,
          quantity_sold: quantity,
          revenue: quantity * 100,
          channel: 'ONLINE',
          customer_segment: 'CONSUMER'
        });
      }
    }

    return records;
  }

  generateSeasonalProduct(): SalesRecord[] {
    const productId = 'SEASONAL-TEST';
    const records: SalesRecord[] = [];
    const now = new Date();

    for (let day = 0; day < 365; day++) {
      const date = new Date(now);
      date.setDate(now.getDate() - day);
      
      // Pattern saisonnier fort avec pic en hiver
      const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const seasonalMultiplier = 1 + 0.8 * Math.sin(2 * Math.PI * (dayOfYear - 90) / 365); // Pic en hiver
      
      const baseQuantity = 15;
      const quantity = Math.floor(baseQuantity * seasonalMultiplier * this.randomBetween(0.8, 1.2));
      
      records.push({
        product_id: productId,
        date,
        quantity_sold: Math.max(1, quantity),
        revenue: Math.max(1, quantity) * 75,
        channel: 'RETAIL',
        customer_segment: 'CONSUMER'
      });
    }

    return records;
  }

  generateTrendingProduct(trendDirection: 'UP' | 'DOWN' = 'UP'): SalesRecord[] {
    const productId = 'TRENDING-TEST';
    const records: SalesRecord[] = [];
    const now = new Date();

    for (let day = 0; day < 180; day++) {
      const date = new Date(now);
      date.setDate(now.getDate() - day);
      
      // Tendance linéaire forte
      const trendMultiplier = trendDirection === 'UP' 
        ? 1 + (180 - day) * 0.01 // Croissance de 1% par jour
        : 2 - (180 - day) * 0.005; // Décroissance de 0.5% par jour
      
      const baseQuantity = 20;
      const quantity = Math.floor(baseQuantity * trendMultiplier * this.randomBetween(0.9, 1.1));
      
      records.push({
        product_id: productId,
        date,
        quantity_sold: Math.max(1, quantity),
        revenue: Math.max(1, quantity) * 50,
        channel: 'B2B',
        customer_segment: 'ENTERPRISE'
      });
    }

    return records;
  }
}