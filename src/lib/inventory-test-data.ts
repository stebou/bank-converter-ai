// Données de test pour la gestion des stocks
// Similaire à banking-test-data.ts

export interface MockProduct {
  id: string;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock?: number;
  price: number;
  category: string;
  lastUpdated: Date;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface MockStockMovement {
  id: string;
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  timestamp: Date;
  userId: string;
  reference?: string;
}

export interface MockOdooProduct {
  odooId: number;
  name: string;
  sku: string;
  currentStock: number;
  price: number;
  category: string;
  lastSynced: Date;
}

// Générateur de données produits réalistes
export const generateMockProducts = (): MockProduct[] => {
  const categories = ['Informatique', 'Mobilier', 'Fournitures', 'Électronique', 'Consommables'];
  const products = [
    // Produits informatiques
    { name: 'MacBook Pro 14"', base: 'LAPTOP', category: 'Informatique', price: 2499 },
    { name: 'Dell XPS 13', base: 'LAPTOP', category: 'Informatique', price: 1899 },
    { name: 'iPhone 15 Pro', base: 'PHONE', category: 'Informatique', price: 1229 },
    { name: 'Samsung Galaxy S24', base: 'PHONE', category: 'Informatique', price: 899 },
    { name: 'iPad Air', base: 'TABLET', category: 'Informatique', price: 649 },
    
    // Périphériques
    { name: 'Souris Logitech MX Master', base: 'MOUSE', category: 'Informatique', price: 89 },
    { name: 'Clavier mécanique Corsair', base: 'KEYB', category: 'Informatique', price: 179 },
    { name: 'Écran Dell 27" 4K', base: 'MONITOR', category: 'Informatique', price: 399 },
    { name: 'Webcam Logitech C920', base: 'CAM', category: 'Informatique', price: 79 },
    
    // Mobilier
    { name: 'Chaise ergonomique Herman Miller', base: 'CHAIR', category: 'Mobilier', price: 1200 },
    { name: 'Bureau ajustable IKEA', base: 'DESK', category: 'Mobilier', price: 299 },
    { name: 'Armoire de rangement', base: 'STORAGE', category: 'Mobilier', price: 189 },
    
    // Fournitures
    { name: 'Ramettes papier A4', base: 'PAPER', category: 'Fournitures', price: 4.5 },
    { name: 'Stylos BIC (boîte 50)', base: 'PEN', category: 'Fournitures', price: 12 },
    { name: 'Classeurs A4', base: 'FOLDER', category: 'Fournitures', price: 3.2 },
    
    // Électronique
    { name: 'Imprimante HP LaserJet', base: 'PRINTER', category: 'Électronique', price: 249 },
    { name: 'Casque Bose QuietComfort', base: 'HEADSET', category: 'Électronique', price: 349 },
    { name: 'Enceinte Bluetooth JBL', base: 'SPEAKER', category: 'Électronique', price: 99 },
    
    // Consommables
    { name: 'Cartouche encre HP', base: 'INK', category: 'Consommables', price: 45 },
    { name: 'Piles AA (pack 8)', base: 'BATTERY', category: 'Consommables', price: 8.5 },
    { name: 'Câbles USB-C', base: 'CABLE', category: 'Consommables', price: 15 }
  ];

  return products.map((product, index) => {
    const stock = Math.floor(Math.random() * 50) + 1;
    const minStock = Math.floor(Math.random() * 10) + 3;
    const status = stock <= minStock ? 'LOW_STOCK' : stock === 0 ? 'OUT_OF_STOCK' : 'IN_STOCK';
    
    return {
      id: `prod_${index + 1}`,
      name: product.name,
      sku: `${product.base}-${String(index + 1).padStart(3, '0')}`,
      currentStock: stock,
      minStock,
      maxStock: minStock * 5,
      price: product.price,
      category: product.category,
      lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Derniers 30 jours
      status
    };
  });
};

// Générateur de mouvements de stock
export const generateMockMovements = (products: MockProduct[]): MockStockMovement[] => {
  const movements: MockStockMovement[] = [];
  const reasons = {
    IN: ['Réception commande', 'Retour client', 'Correction inventaire', 'Production interne'],
    OUT: ['Vente', 'Consommation interne', 'Perte/Vol', 'Expiration', 'Défaut qualité'],
    ADJUSTMENT: ['Correction inventaire', 'Recomptage', 'Erreur saisie']
  };

  products.forEach((product, prodIndex) => {
    // Générer 3-8 mouvements par produit
    const numMovements = Math.floor(Math.random() * 6) + 3;
    
    for (let i = 0; i < numMovements; i++) {
      const types: Array<'IN' | 'OUT' | 'ADJUSTMENT'> = ['IN', 'OUT', 'ADJUSTMENT'];
      const type = types[Math.floor(Math.random() * types.length)];
      const quantity = Math.floor(Math.random() * 20) + 1;
      const reasonList = reasons[type];
      
      movements.push({
        id: `mov_${prodIndex}_${i}`,
        productId: product.id,
        type,
        quantity: type === 'OUT' ? -quantity : quantity,
        reason: reasonList[Math.floor(Math.random() * reasonList.length)],
        timestamp: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Derniers 90 jours
        userId: 'user_1', // Simulé
        reference: `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      });
    }
  });

  return movements.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

// Données Odoo simulées
export const generateMockOdooProducts = (): MockOdooProduct[] => {
  const odooProducts = [
    { name: 'Produit Odoo A', sku: 'ODOO-A-001', category: 'Import/Export', price: 150 },
    { name: 'Produit Odoo B', sku: 'ODOO-B-002', category: 'Import/Export', price: 75 },
    { name: 'Article Odoo Premium', sku: 'ODOO-PREM-003', category: 'Premium', price: 299 },
    { name: 'Service Odoo Standard', sku: 'ODOO-STD-004', category: 'Services', price: 89 },
    { name: 'Composant Odoo Tech', sku: 'ODOO-TECH-005', category: 'Technique', price: 45 }
  ];

  return odooProducts.map((product, index) => ({
    odooId: index + 1000,
    name: product.name,
    sku: product.sku,
    currentStock: Math.floor(Math.random() * 100) + 10,
    price: product.price,
    category: product.category,
    lastSynced: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000) // Dernières 2h
  }));
};

// Simulateur d'API Odoo
export class MockOdooAPI {
  private static instance: MockOdooAPI;
  private products: MockOdooProduct[];
  private isConnected = false;
  private connectionDelay = 1000; // 1 seconde de délai simulé

  constructor() {
    this.products = generateMockOdooProducts();
  }

  static getInstance(): MockOdooAPI {
    if (!this.instance) {
      this.instance = new MockOdooAPI();
    }
    return this.instance;
  }

  // Simule l'authentification Odoo
  async authenticate(config: { url: string; database: string; username: string; password: string }): Promise<{ success: boolean; uid?: number; error?: string }> {
    await this.delay(this.connectionDelay);

    // Simule différents cas d'erreur
    if (!config.url || !config.database) {
      return { success: false, error: 'URL ou base de données manquante' };
    }

    if (config.username === 'error') {
      return { success: false, error: 'Nom d\'utilisateur invalide' };
    }

    if (config.password === 'wrong') {
      return { success: false, error: 'Mot de passe incorrect' };
    }

    // Simule une connexion réussie
    this.isConnected = true;
    return { success: true, uid: 12345 };
  }

  // Simule la récupération des produits
  async getProducts(): Promise<{ success: boolean; data?: MockOdooProduct[]; error?: string }> {
    await this.delay(800);

    if (!this.isConnected) {
      return { success: false, error: 'Non connecté à Odoo' };
    }

    // Simule parfois des erreurs réseau
    if (Math.random() < 0.1) { // 10% de chance d'erreur
      return { success: false, error: 'Erreur réseau - Réessayez' };
    }

    // Met à jour les timestamps de sync
    this.products = this.products.map(product => ({
      ...product,
      lastSynced: new Date(),
      currentStock: Math.max(0, product.currentStock + Math.floor(Math.random() * 10) - 5) // Variation aléatoire
    }));

    return { success: true, data: this.products };
  }

  // Test de connexion
  async testConnection(config: { url: string; database: string; username: string; password: string }): Promise<{ success: boolean; latency?: number; error?: string }> {
    const start = Date.now();
    const authResult = await this.authenticate(config);
    const latency = Date.now() - start;

    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    return { success: true, latency };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Configuration par défaut pour les tests
export const DEFAULT_TEST_CONFIG = {
  stockMode: 'internal' as const,
  odooConfig: {
    url: 'https://demo.odoo.com',
    database: 'demo_database',
    username: 'admin',
    password: 'admin'
  }
};

// Stats générées à partir des données
export const generateInventoryStats = (products: MockProduct[], movements: MockStockMovement[]) => {
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.price), 0);
  const lowStockItems = products.filter(p => p.status === 'LOW_STOCK').length;
  const outOfStockItems = products.filter(p => p.status === 'OUT_OF_STOCK').length;
  
  const recentMovements = movements.filter(m => 
    m.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  
  const weeklyIncoming = recentMovements
    .filter(m => m.type === 'IN')
    .reduce((sum, m) => sum + m.quantity, 0);
    
  const weeklyOutgoing = recentMovements
    .filter(m => m.type === 'OUT')
    .reduce((sum, m) => sum + Math.abs(m.quantity), 0);

  return {
    totalProducts,
    totalValue,
    lowStockItems,
    outOfStockItems,
    weeklyIncoming,
    weeklyOutgoing,
    turnoverRate: weeklyOutgoing > 0 ? (weeklyOutgoing / totalProducts * 100).toFixed(1) : '0'
  };
};