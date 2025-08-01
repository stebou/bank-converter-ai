'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  BarChart3,
  Search,
  Filter,
  ExternalLink,
  Building2,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import type { Product, StockMovement, InventoryStats, StockMode, OdooConfig } from '@/types';
import { 
  generateMockProducts, 
  generateMockMovements, 
  generateInventoryStats,
  MockOdooAPI,
  DEFAULT_TEST_CONFIG 
} from '@/lib/inventory-test-data';
import '../styles/fonts.css';

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Composant KPI compact pour la modal
const CompactKPICard = ({ 
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
    <div className="bg-[#ecf0f1] rounded-xl p-4 border border-[#bdc3c7]">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium font-montserrat text-[#34495e] mb-1">{title}</p>
          <p className="text-lg font-bold font-montserrat tracking-tight text-[#2c3e50]">
            {formatValue(value)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Composant produit compact
const CompactProductCard = ({ product }: { product: Product }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK': return 'bg-green-100 text-green-800';
      case 'LOW_STOCK': return 'bg-yellow-100 text-yellow-800';
      case 'OUT_OF_STOCK': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#bdc3c7] hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 bg-[#2c3e50] rounded-lg flex items-center justify-center flex-shrink-0">
          <Package className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium font-montserrat text-[#2c3e50] text-sm truncate">
            {product.name}
          </p>
          <p className="text-xs text-[#34495e] font-ibm-plex-mono">{product.sku}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right">
          <p className="font-bold font-montserrat text-[#2c3e50] text-sm">{product.currentStock}</p>
          <p className="text-xs text-[#34495e] font-open-sans">{product.category}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(product.status)}`}>
          {getStatusText(product.status)}
        </span>
      </div>
    </div>
  );
};

export default function StockModal({ isOpen, onClose }: StockModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Charger les données de stocks
  useEffect(() => {
    if (isOpen) {
      const loadStockData = async () => {
        setLoading(true);
        
        try {
          // Simuler un délai de chargement
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const mockProducts = generateMockProducts();
          const mockMovements = generateMockMovements(mockProducts);
          const mockStats = generateInventoryStats(mockProducts, mockMovements);
          
          setProducts(mockProducts);
          setStats(mockStats);
        } catch (error) {
          console.error('Error loading stock data:', error);
        } finally {
          setLoading(false);
        }
      };

      loadStockData();
    }
  }, [isOpen]);

  // Filtrer les produits
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtenir les catégories uniques
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Produits avec alertes (stock faible ou rupture)
  const alertProducts = products.filter(p => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#bdc3c7] rounded-2xl w-full max-w-6xl h-[80vh] relative overflow-hidden border border-[#bdc3c7]"
          >
            {/* Header */}
            <div className="bg-[#ecf0f1] border-b border-[#bdc3c7] p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2c3e50] rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-montserrat tracking-tight text-[#2c3e50]">
                    Aperçu des Stocks
                  </h2>
                  <p className="text-sm text-[#34495e] font-open-sans">
                    Vue d'ensemble de votre inventaire
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Link
                  href="/inventory"
                  className="flex items-center gap-2 px-4 py-2 bg-[#2c3e50] text-white rounded-xl hover:bg-[#34495e] transition-all duration-300 shadow-lg hover:scale-105 font-medium font-open-sans text-sm"
                  onClick={onClose}
                >
                  <ExternalLink className="w-4 h-4" />
                  Gestion complète
                </Link>
                
                <button
                  onClick={onClose}
                  className="p-2 text-[#34495e] hover:text-[#2c3e50] hover:bg-white rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border-3 border-[#2c3e50] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg font-medium font-montserrat text-[#2c3e50]">
                    Chargement des données de stocks...
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 h-full overflow-y-auto">
                {/* KPIs */}
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <CompactKPICard
                      title="Produits Total"
                      value={stats.totalProducts}
                      icon={Package}
                    />
                    <CompactKPICard
                      title="Valeur Stock"
                      value={stats.totalValue}
                      icon={TrendingUp}
                      format="currency"
                      color="bg-green-600"
                    />
                    <CompactKPICard
                      title="Alertes Stock"
                      value={stats.lowStockItems + stats.outOfStockItems}
                      icon={AlertTriangle}
                      color="bg-red-600"
                    />
                    <CompactKPICard
                      title="Taux Rotation"
                      value={stats.turnoverRate}
                      icon={BarChart3}
                      format="percentage"
                      color="bg-blue-600"
                    />
                  </div>
                )}

                {/* Alertes stocks si il y en a */}
                {alertProducts.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold font-montserrat text-red-800">
                        Alertes Stock ({alertProducts.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {alertProducts.slice(0, 6).map((product) => (
                        <CompactProductCard key={product.id} product={product} />
                      ))}
                    </div>
                    {alertProducts.length > 6 && (
                      <p className="text-sm text-red-600 font-open-sans mt-2">
                        ... et {alertProducts.length - 6} autre{alertProducts.length - 6 > 1 ? 's' : ''} produit{alertProducts.length - 6 > 1 ? 's' : ''} en alerte
                      </p>
                    )}
                  </div>
                )}

                {/* Filtres */}
                <div className="bg-white rounded-xl p-4 mb-6 border border-[#bdc3c7]">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#34495e]" />
                      <input
                        type="text"
                        placeholder="Rechercher par nom ou SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#bdc3c7] rounded-xl focus:ring-2 focus:ring-[#2c3e50] focus:border-[#2c3e50] font-open-sans text-sm"
                      />
                    </div>
                    
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-[#bdc3c7] rounded-xl focus:ring-2 focus:ring-[#2c3e50] focus:border-[#2c3e50] font-open-sans bg-white text-sm"
                    >
                      <option value="all">Toutes les catégories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Liste des produits */}
                <div className="bg-white rounded-xl p-4 border border-[#bdc3c7]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold font-montserrat text-[#2c3e50]">
                      Produits ({filteredProducts.length})
                    </h3>
                  </div>
                  
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {filteredProducts.slice(0, 20).map((product) => (
                      <CompactProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  
                  {filteredProducts.length === 0 && (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-[#bdc3c7] mx-auto mb-4" />
                      <p className="text-[#34495e] font-open-sans">
                        Aucun produit trouvé avec les critères actuels
                      </p>
                    </div>
                  )}
                  
                  {filteredProducts.length > 20 && (
                    <div className="text-center pt-4 border-t border-[#bdc3c7] mt-4">
                      <Link
                        href="/inventory"
                        onClick={onClose}
                        className="text-[#2c3e50] hover:text-[#34495e] font-medium font-open-sans text-sm inline-flex items-center gap-1"
                      >
                        Voir tous les {filteredProducts.length} produits
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}