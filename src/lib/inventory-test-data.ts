// Données de test pour l'inventaire et Odoo

import type {
  InventoryStats,
  OdooConfig,
  Product,
  StockMovement,
} from '@/types';

// Configuration Odoo par défaut pour les tests
export const DEFAULT_TEST_CONFIG: OdooConfig = {
  url: 'https://demo.odoo.com',
  database: 'demo',
  username: 'demo',
  password: 'demo',
};

// Générateur de données de test
export function generateMockProducts(count: number = 20): Product[] {
  const categories = [
    'Électronique',
    'Vêtements',
    'Alimentaire',
    'Maison',
    'Sport',
  ];
  const products: Product[] = [];

  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const currentStock = Math.floor(Math.random() * 100);
    const minStock = Math.floor(Math.random() * 20) + 5;

    let status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
    if (currentStock === 0) status = 'OUT_OF_STOCK';
    else if (currentStock <= minStock) status = 'LOW_STOCK';
    else status = 'IN_STOCK';

    products.push({
      id: `prod-${i}`,
      name: `Produit ${i}`,
      sku: `SKU-${i.toString().padStart(3, '0')}`,
      currentStock,
      minStock,
      maxStock: minStock + Math.floor(Math.random() * 80) + 20,
      price: Math.floor(Math.random() * 500) + 10,
      category,
      lastUpdated: new Date(),
      status,
    });
  }

  return products;
}

export function generateMockMovements(count: number = 50): StockMovement[] {
  const movements: StockMovement[] = [];
  const types: ('IN' | 'OUT' | 'ADJUSTMENT')[] = ['IN', 'OUT', 'ADJUSTMENT'];
  const reasons = [
    'Achat fournisseur',
    'Vente client',
    'Retour client',
    'Inventaire',
    'Ajustement',
    'Perte/Casse',
  ];

  for (let i = 1; i <= count; i++) {
    movements.push({
      id: `mov-${i}`,
      productId: `prod-${Math.floor(Math.random() * 20) + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      quantity: Math.floor(Math.random() * 50) + 1,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      timestamp: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ),
      userId: 'user-1',
      reference: `REF-${i}`,
    });
  }

  return movements.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
}

export function generateInventoryStats(): InventoryStats {
  const products = generateMockProducts();

  return {
    totalProducts: products.length,
    totalValue: products.reduce((sum, p) => sum + p.currentStock * p.price, 0),
    lowStockItems: products.filter(p => p.status === 'LOW_STOCK').length,
    outOfStockItems: products.filter(p => p.status === 'OUT_OF_STOCK').length,
    weeklyIncoming: Math.floor(Math.random() * 500) + 100,
    weeklyOutgoing: Math.floor(Math.random() * 400) + 80,
    turnoverRate: (Math.random() * 10 + 1).toFixed(1),
  };
}

// Simulation API Odoo
export class MockOdooAPI {
  private config: OdooConfig;

  constructor(config: OdooConfig) {
    this.config = config;
  }

  async testConnection(): Promise<boolean> {
    // Simulation d'une connexion
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.1; // 90% de chance de succès
  }

  async getProducts(limit: number = 100): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return generateMockProducts(limit).map(product => ({
      id: parseInt(product.id.replace('prod-', '')),
      name: product.name,
      default_code: product.sku,
      qty_available: product.currentStock,
      list_price: product.price,
      categ_id: [1, product.category],
      write_date: product.lastUpdated.toISOString(),
    }));
  }

  async updateStock(productId: number, quantity: number): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return Math.random() > 0.05; // 95% de chance de succès
  }

  async createStockMove(data: any): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return Math.floor(Math.random() * 1000) + 1;
  }
}
