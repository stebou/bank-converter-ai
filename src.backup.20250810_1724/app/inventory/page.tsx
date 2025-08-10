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
  ArrowLeft,
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import type {
  Product,
  StockMovement,
  InventoryStats,
  StockMode,
  OdooConfig,
} from '@/types';
import {
  generateMockProducts,
  generateMockMovements,
  generateInventoryStats,
  MockOdooAPI,
  DEFAULT_TEST_CONFIG,
} from '@/lib/inventory-test-data';
import '../../styles/fonts.css';

// Composant KPI pour le dashboard stock
const StockKPICard = ({
  title,
  value,
  icon: Icon,
  color = 'bg-[#2c3e50]',
  format = 'number',
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
      className="rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-1 items-start gap-4">
          <div
            className={`h-12 w-12 ${color} flex flex-shrink-0 items-center justify-center rounded-2xl shadow-lg`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-montserrat mb-2 text-sm font-medium text-[#34495e]">
              {title}
            </p>
            <p className="font-montserrat break-words text-2xl font-bold tracking-tight text-[#2c3e50]">
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
      case 'IN_STOCK':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'LOW_STOCK':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return 'En stock';
      case 'LOW_STOCK':
        return 'Stock faible';
      case 'OUT_OF_STOCK':
        return 'Rupture';
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-[#bdc3c7] bg-white p-4 transition-all duration-200 hover:shadow-lg"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="font-montserrat mb-1 truncate text-sm font-semibold text-[#2c3e50]">
            {product.name}
          </h4>
          <p className="font-ibm-plex-mono text-xs text-[#34495e]">
            {product.sku}
          </p>
        </div>
        <span
          className={`rounded-lg border px-2 py-1 text-xs font-medium ${getStatusColor(product.status)}`}
        >
          {getStatusText(product.status)}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-open-sans text-xs text-[#34495e]">
            Stock actuel
          </span>
          <span className="font-montserrat font-bold text-[#2c3e50]">
            {product.currentStock}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-open-sans text-xs text-[#34495e]">
            Prix unitaire
          </span>
          <span className="font-montserrat font-medium text-[#2c3e50]">
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            }).format(product.price)}
          </span>
        </div>

        <div className="border-t border-[#bdc3c7] pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-open-sans text-[#34495e]">Catégorie</span>
            <span className="font-open-sans font-medium text-[#2c3e50]">
              {product.category}
            </span>
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
  onTestConnection,
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
    <div className="rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-[#2c3e50] p-2">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-montserrat text-lg font-semibold text-[#2c3e50]">
          Configuration Odoo
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="font-open-sans mb-2 block text-sm font-medium text-[#2c3e50]">
            URL Odoo
          </label>
          <input
            type="url"
            value={config.url}
            onChange={e => onConfigChange({ ...config, url: e.target.value })}
            className="font-open-sans w-full rounded-xl border border-[#bdc3c7] px-3 py-2 focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
            placeholder="https://votre-odoo.com"
          />
        </div>

        <div>
          <label className="font-open-sans mb-2 block text-sm font-medium text-[#2c3e50]">
            Base de données
          </label>
          <input
            type="text"
            value={config.database}
            onChange={e =>
              onConfigChange({ ...config, database: e.target.value })
            }
            className="font-open-sans w-full rounded-xl border border-[#bdc3c7] px-3 py-2 focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
            placeholder="nom_base_donnees"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-open-sans mb-2 block text-sm font-medium text-[#2c3e50]">
              Utilisateur
            </label>
            <input
              type="text"
              value={config.username}
              onChange={e =>
                onConfigChange({ ...config, username: e.target.value })
              }
              className="font-open-sans w-full rounded-xl border border-[#bdc3c7] px-3 py-2 focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="font-open-sans mb-2 block text-sm font-medium text-[#2c3e50]">
              Mot de passe
            </label>
            <input
              type="password"
              value={config.password}
              onChange={e =>
                onConfigChange({ ...config, password: e.target.value })
              }
              className="font-open-sans w-full rounded-xl border border-[#bdc3c7] px-3 py-2 focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          onClick={handleTest}
          disabled={testing}
          className="font-open-sans flex w-full items-center justify-center gap-2 rounded-xl bg-[#2c3e50] px-4 py-2 font-medium text-white transition-all duration-300 hover:bg-[#34495e] disabled:opacity-50"
        >
          {testing ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Zap className="h-4 w-4" />
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
  const [odooConfig, setOdooConfig] = useState<OdooConfig>(
    DEFAULT_TEST_CONFIG.odooConfig
  );

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
              const convertedProducts: Product[] = productsResult.data.map(
                p => ({
                  id: `odoo_${p.odooId}`,
                  name: p.name,
                  sku: p.sku,
                  currentStock: p.currentStock,
                  minStock: Math.floor(p.currentStock * 0.2),
                  price: p.price,
                  category: p.category,
                  lastUpdated: p.lastSynced,
                  status:
                    p.currentStock === 0
                      ? 'OUT_OF_STOCK'
                      : p.currentStock < Math.floor(p.currentStock * 0.2)
                        ? 'LOW_STOCK'
                        : 'IN_STOCK',
                })
              );

              setProducts(convertedProducts);
              const mockMovements = generateMockMovements(convertedProducts);
              const mockStats = generateInventoryStats(
                convertedProducts,
                mockMovements
              );
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
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtenir les catégories uniques
  const categories = Array.from(new Set(products.map(p => p.category)));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#bdc3c7]">
        <div className="flex items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-[#2c3e50]" />
          <span className="font-montserrat text-lg font-medium text-[#2c3e50]">
            Chargement des données d'inventaire...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#bdc3c7]">
      <div className="space-y-8 p-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          {/* Bouton retour au dashboard */}
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="font-open-sans flex items-center gap-2 rounded-xl bg-[#2c3e50] px-4 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#34495e]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour au Dashboard</span>
            </Link>

            <div>
              <h1 className="font-montserrat mb-2 text-3xl font-bold tracking-tight text-[#2c3e50]">
                Gestion des Stocks
              </h1>
              <p className="font-open-sans text-[#34495e]">
                Suivi et gestion de l'inventaire • {products.length} produit
                {products.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sélecteur de mode */}
            <div className="flex rounded-xl border border-[#bdc3c7] bg-white p-1">
              <button
                onClick={() => setStockMode('internal')}
                className={`font-open-sans rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  stockMode === 'internal'
                    ? 'bg-[#2c3e50] text-white shadow-lg'
                    : 'text-[#34495e] hover:bg-[#ecf0f1]'
                }`}
              >
                Mode Interne
              </button>
              <button
                onClick={() => setStockMode('odoo')}
                className={`font-open-sans rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  stockMode === 'odoo'
                    ? 'bg-[#2c3e50] text-white shadow-lg'
                    : 'text-[#34495e] hover:bg-[#ecf0f1]'
                }`}
              >
                Odoo
              </button>
            </div>

            <button className="font-open-sans flex items-center gap-2 rounded-xl bg-[#2c3e50] px-4 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#34495e]">
              <Plus className="h-4 w-4" />
              Nouveau produit
            </button>
          </div>
        </div>

        {/* KPIs */}
        {stats && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
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
        <div className="rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-[#34495e]" />
              <input
                type="text"
                placeholder="Rechercher par nom ou SKU..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="font-open-sans w-full rounded-xl border border-[#bdc3c7] py-3 pl-10 pr-4 focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="font-open-sans rounded-xl border border-[#bdc3c7] bg-white px-4 py-3 focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <button className="font-open-sans flex items-center gap-2 rounded-xl border border-[#bdc3c7] px-4 py-3 font-medium transition-colors hover:bg-[#ecf0f1]">
                <Filter className="h-4 w-4" />
                Filtres
              </button>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        <div className="rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-montserrat text-xl font-semibold text-[#2c3e50]">
              Inventaire des Produits
            </h3>
            <div className="flex gap-2">
              <button className="font-open-sans flex items-center gap-2 rounded-xl border border-[#bdc3c7] px-3 py-2 text-sm font-medium transition-colors hover:bg-[#ecf0f1]">
                <Download className="h-4 w-4" />
                Exporter
              </button>
              <button className="font-open-sans flex items-center gap-2 rounded-xl border border-[#bdc3c7] px-3 py-2 text-sm font-medium transition-colors hover:bg-[#ecf0f1]">
                <Upload className="h-4 w-4" />
                Importer
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-12 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-[#bdc3c7]" />
              <p className="font-open-sans text-[#34495e]">
                Aucun produit trouvé avec les critères actuels
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
