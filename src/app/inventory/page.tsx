'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  BarChart3,
  Settings,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Zap,
  Building2,
  ArrowLeft
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import type { Product, StockMovement, InventoryStats, StockMode, OdooConfig } from '@/types';
import { 
  generateMockProducts, 
  generateMockMovements, 
  generateInventoryStats,
  MockOdooAPI,
  DEFAULT_TEST_CONFIG 
} from '@/lib/inventory-test-data';
import '../../styles/fonts.css';

// Composant KPI pour le dashboard stock
const StockKPICard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'bg-[#2c3e50]',
  format = 'number' 
}: {
  title: string;
  value: number | string;
  icon: any;
  color?: string;
  format?: 'number' | 'currency' | 'percentage';
}) => {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val}%`;
      default:
        return val.toString();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6 hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium font-montserrat text-[#34495e] mb-2">{title}</p>
            <p className="text-2xl font-bold font-montserrat tracking-tight text-[#2c3e50] break-words">
              {formatValue(value)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Composant pour afficher un produit
const ProductCard = ({ product }: { product: Product }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK': return 'bg-green-100 text-green-800 border-green-200';
      case 'LOW_STOCK': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'OUT_OF_STOCK': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'IN_STOCK': return 'En stock';
      case 'LOW_STOCK': return 'Stock faible';
      case 'OUT_OF_STOCK': return 'Rupture';
      default: return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-4 border border-[#bdc3c7] hover:shadow-lg transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold font-montserrat text-[#2c3e50] text-sm truncate mb-1">
            {product.name}
          </h4>
          <p className="text-xs text-[#34495e] font-ibm-plex-mono">{product.sku}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getStatusColor(product.status)}`}>
          {getStatusText(product.status)}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#34495e] font-open-sans">Stock actuel</span>
          <span className="font-bold font-montserrat text-[#2c3e50]">{product.currentStock}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-[#34495e] font-open-sans">Prix unitaire</span>
          <span className="font-medium font-montserrat text-[#2c3e50]">
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(product.price)}
          </span>
        </div>
        
        <div className="pt-2 border-t border-[#bdc3c7]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#34495e] font-open-sans">Catégorie</span>
            <span className="text-[#2c3e50] font-medium font-open-sans">{product.category}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Configuration Odoo
const OdooConfigPanel = ({ 
  config, 
  onConfigChange, 
  onTestConnection 
}: { 
  config: OdooConfig;
  onConfigChange: (config: OdooConfig) => void;
  onTestConnection: () => void;
}) => {
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    await onTestConnection();
    setTesting(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-[#bdc3c7]">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#2c3e50] rounded-xl">
          <Building2 className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold font-montserrat text-[#2c3e50]">Configuration Odoo</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium font-open-sans text-[#2c3e50] mb-2">
            URL Odoo
          </label>
          <input
            type="url"
            value={config.url}
            onChange={(e) => onConfigChange({ ...config, url: e.target.value })}
            className="w-full px-3 py-2 border border-[#bdc3c7] rounded-xl focus:ring-2 focus:ring-[#2c3e50] focus:border-[#2c3e50] font-open-sans"
            placeholder="https://votre-odoo.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium font-open-sans text-[#2c3e50] mb-2">
            Base de données
          </label>
          <input
            type="text"
            value={config.database}
            onChange={(e) => onConfigChange({ ...config, database: e.target.value })}
            className="w-full px-3 py-2 border border-[#bdc3c7] rounded-xl focus:ring-2 focus:ring-[#2c3e50] focus:border-[#2c3e50] font-open-sans"
            placeholder="nom_base_donnees"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium font-open-sans text-[#2c3e50] mb-2">
              Utilisateur
            </label>
            <input
              type="text"
              value={config.username}
              onChange={(e) => onConfigChange({ ...config, username: e.target.value })}
              className="w-full px-3 py-2 border border-[#bdc3c7] rounded-xl focus:ring-2 focus:ring-[#2c3e50] focus:border-[#2c3e50] font-open-sans"
              placeholder="admin"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium font-open-sans text-[#2c3e50] mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={config.password}
              onChange={(e) => onConfigChange({ ...config, password: e.target.value })}
              className="w-full px-3 py-2 border border-[#bdc3c7] rounded-xl focus:ring-2 focus:ring-[#2c3e50] focus:border-[#2c3e50] font-open-sans"
              placeholder="••••••••"
            />
          </div>
        </div>
        
        <button
          onClick={handleTest}
          disabled={testing}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#2c3e50] text-white rounded-xl hover:bg-[#34495e] disabled:opacity-50 transition-all duration-300 font-medium font-open-sans"
        >
          {testing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {testing ? 'Test en cours...' : 'Tester la connexion'}
        </button>
      </div>
    </div>
  );
};

export default function InventoryPage() {
  const { user } = useUser();
  const [stockMode, setStockMode] = useState<StockMode>('internal');
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [odooConfig, setOdooConfig] = useState<OdooConfig>(DEFAULT_TEST_CONFIG.odooConfig);

  // Charger les données initiales
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        if (stockMode === 'internal') {
          // Mode interne - données simulées
          const mockProducts = generateMockProducts();
          const mockMovements = generateMockMovements(mockProducts);
          const mockStats = generateInventoryStats(mockProducts, mockMovements);
          
          setProducts(mockProducts);
          setMovements(mockMovements);
          setStats(mockStats);
        } else {
          // Mode Odoo - API simulée
          const odooAPI = MockOdooAPI.getInstance();
          const authResult = await odooAPI.authenticate(odooConfig);
          
          if (authResult.success) {
            const productsResult = await odooAPI.getProducts();
            if (productsResult.success && productsResult.data) {
              // Convertir les produits Odoo en format interne
              const convertedProducts: Product[] = productsResult.data.map(p => ({
                id: `odoo_${p.odooId}`,
                name: p.name,
                sku: p.sku,
                currentStock: p.currentStock,
                minStock: Math.floor(p.currentStock * 0.2),
                price: p.price,
                category: p.category,
                lastUpdated: p.lastSynced,
                status: p.currentStock === 0 ? 'OUT_OF_STOCK' : 
                        p.currentStock < Math.floor(p.currentStock * 0.2) ? 'LOW_STOCK' : 'IN_STOCK'
              }));
              
              setProducts(convertedProducts);
              const mockMovements = generateMockMovements(convertedProducts);
              const mockStats = generateInventoryStats(convertedProducts, mockMovements);
              setMovements(mockMovements);
              setStats(mockStats);
            }
          }
        }
      } catch (error) {
        console.error('Error loading inventory data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [stockMode, odooConfig]);

  const handleTestOdooConnection = async () => {
    try {
      const odooAPI = MockOdooAPI.getInstance();
      const result = await odooAPI.testConnection(odooConfig);
      
      if (result.success) {
        alert(`Connexion réussie! Latence: ${result.latency}ms`);
      } else {
        alert(`Erreur de connexion: ${result.error}`);
      }
    } catch (error) {
      alert('Erreur lors du test de connexion');
    }
  };

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtenir les catégories uniques
  const categories = Array.from(new Set(products.map(p => p.category)));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#bdc3c7] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#2c3e50]" />
          <span className="text-lg font-medium font-montserrat text-[#2c3e50]">
            Chargement des données d'inventaire...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#bdc3c7]">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          {/* Bouton retour au dashboard */}
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-[#2c3e50] text-white rounded-xl hover:bg-[#34495e] transition-all duration-300 shadow-lg hover:scale-105 font-medium font-open-sans"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au Dashboard</span>
            </Link>
            
            <div>
              <h1 className="text-3xl font-bold font-montserrat tracking-tight text-[#2c3e50] mb-2">
                Gestion des Stocks
              </h1>
              <p className="text-[#34495e] font-open-sans">
                Suivi et gestion de l'inventaire • {products.length} produit{products.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Sélecteur de mode */}
            <div className="flex bg-white rounded-xl p-1 border border-[#bdc3c7]">
              <button
                onClick={() => setStockMode('internal')}
                className={`px-4 py-2 rounded-lg font-medium font-open-sans text-sm transition-all duration-200 ${
                  stockMode === 'internal'
                    ? 'bg-[#2c3e50] text-white shadow-lg'
                    : 'text-[#34495e] hover:bg-[#ecf0f1]'
                }`}
              >
                Mode Interne
              </button>
              <button
                onClick={() => setStockMode('odoo')}
                className={`px-4 py-2 rounded-lg font-medium font-open-sans text-sm transition-all duration-200 ${
                  stockMode === 'odoo'
                    ? 'bg-[#2c3e50] text-white shadow-lg'
                    : 'text-[#34495e] hover:bg-[#ecf0f1]'
                }`}
              >
                Odoo
              </button>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-[#2c3e50] text-white rounded-xl hover:bg-[#34495e] transition-all duration-300 shadow-lg hover:scale-105 font-medium font-open-sans">
              <Plus className="w-4 h-4" />
              Nouveau produit
            </button>
          </div>
        </div>

        {/* KPIs */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StockKPICard
              title="Produits Total"
              value={stats.totalProducts}
              icon={Package}
            />
            <StockKPICard
              title="Valeur Stock"
              value={stats.totalValue}
              icon={TrendingUp}
              format="currency"
              color="bg-green-600"
            />
            <StockKPICard
              title="Alertes Stock"
              value={stats.lowStockItems + stats.outOfStockItems}
              icon={AlertTriangle}
              color="bg-red-600"
            />
            <StockKPICard
              title="Taux Rotation"
              value={stats.turnoverRate}
              icon={BarChart3}
              format="percentage"
              color="bg-blue-600"
            />
          </div>
        )}

        {/* Configuration Odoo si mode Odoo */}
        {stockMode === 'odoo' && (
          <OdooConfigPanel
            config={odooConfig}
            onConfigChange={setOdooConfig}
            onTestConnection={handleTestOdooConnection}
          />
        )}

        {/* Filtres et recherche */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-[#bdc3c7]">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#34495e]" />
              <input
                type="text"
                placeholder="Rechercher par nom ou SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#bdc3c7] rounded-xl focus:ring-2 focus:ring-[#2c3e50] focus:border-[#2c3e50] font-open-sans"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-[#bdc3c7] rounded-xl focus:ring-2 focus:ring-[#2c3e50] focus:border-[#2c3e50] font-open-sans bg-white"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <button className="flex items-center gap-2 px-4 py-3 border border-[#bdc3c7] rounded-xl hover:bg-[#ecf0f1] transition-colors font-medium font-open-sans">
                <Filter className="w-4 h-4" />
                Filtres
              </button>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-[#bdc3c7]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold font-montserrat text-[#2c3e50]">
              Inventaire des Produits
            </h3>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-sm border border-[#bdc3c7] rounded-xl hover:bg-[#ecf0f1] transition-colors font-medium font-open-sans">
                <Download className="w-4 h-4" />
                Exporter
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm border border-[#bdc3c7] rounded-xl hover:bg-[#ecf0f1] transition-colors font-medium font-open-sans">
                <Upload className="w-4 h-4" />
                Importer
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-[#bdc3c7] mx-auto mb-4" />
              <p className="text-[#34495e] font-open-sans">
                Aucun produit trouvé avec les critères actuels
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}