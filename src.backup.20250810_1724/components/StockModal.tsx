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
  Zap,
} from 'lucide-react';
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
    <div className="rounded-xl border border-[#bdc3c7] bg-[#ecf0f1] p-4">
      <div className="flex items-center gap-3">
        <div
          className={`h-10 w-10 ${color} flex flex-shrink-0 items-center justify-center rounded-xl shadow-lg`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-montserrat mb-1 text-xs font-medium text-[#34495e]">
            {title}
          </p>
          <p className="font-montserrat text-lg font-bold tracking-tight text-[#2c3e50]">
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
      case 'IN_STOCK':
        return 'bg-green-100 text-green-800';
      case 'LOW_STOCK':
        return 'bg-yellow-100 text-yellow-800';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="flex items-center justify-between rounded-xl border border-[#bdc3c7] bg-white p-3 transition-all duration-200 hover:shadow-md">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#2c3e50]">
          <Package className="h-4 w-4 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-montserrat truncate text-sm font-medium text-[#2c3e50]">
            {product.name}
          </p>
          <p className="font-ibm-plex-mono text-xs text-[#34495e]">
            {product.sku}
          </p>
        </div>
      </div>

      <div className="flex flex-shrink-0 items-center gap-3">
        <div className="text-right">
          <p className="font-montserrat text-sm font-bold text-[#2c3e50]">
            {product.currentStock}
          </p>
          <p className="font-open-sans text-xs text-[#34495e]">
            {product.category}
          </p>
        </div>
        <span
          className={`rounded-lg px-2 py-1 text-xs font-medium ${getStatusColor(product.status)}`}
        >
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
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Obtenir les catégories uniques
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Produits avec alertes (stock faible ou rupture)
  const alertProducts = products.filter(
    p => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK'
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="relative h-[80vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#bdc3c7] bg-[#bdc3c7]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#bdc3c7] bg-[#ecf0f1] p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2c3e50] shadow-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-montserrat text-2xl font-bold tracking-tight text-[#2c3e50]">
                    Aperçu des Stocks
                  </h2>
                  <p className="font-open-sans text-sm text-[#34495e]">
                    Vue d'ensemble de votre inventaire
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/inventory"
                  className="font-open-sans flex items-center gap-2 rounded-xl bg-[#2c3e50] px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#34495e]"
                  onClick={onClose}
                >
                  <ExternalLink className="h-4 w-4" />
                  Gestion complète
                </Link>

                <button
                  onClick={onClose}
                  className="rounded-xl p-2 text-[#34495e] transition-colors hover:bg-white hover:text-[#2c3e50]"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex items-center gap-3">
                  <div className="border-3 h-8 w-8 animate-spin rounded-full border-[#2c3e50] border-t-transparent"></div>
                  <span className="font-montserrat text-lg font-medium text-[#2c3e50]">
                    Chargement des données de stocks...
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-y-auto p-6">
                {/* KPIs */}
                {stats && (
                  <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
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
                  <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <h3 className="font-montserrat font-semibold text-red-800">
                        Alertes Stock ({alertProducts.length})
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {alertProducts.slice(0, 6).map(product => (
                        <CompactProductCard
                          key={product.id}
                          product={product}
                        />
                      ))}
                    </div>
                    {alertProducts.length > 6 && (
                      <p className="font-open-sans mt-2 text-sm text-red-600">
                        ... et {alertProducts.length - 6} autre
                        {alertProducts.length - 6 > 1 ? 's' : ''} produit
                        {alertProducts.length - 6 > 1 ? 's' : ''} en alerte
                      </p>
                    )}
                  </div>
                )}

                {/* Filtres */}
                <div className="mb-6 rounded-xl border border-[#bdc3c7] bg-white p-4">
                  <div className="flex flex-col gap-4 lg:flex-row">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#34495e]" />
                      <input
                        type="text"
                        placeholder="Rechercher par nom ou SKU..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="font-open-sans w-full rounded-xl border border-[#bdc3c7] py-2 pl-10 pr-4 text-sm focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
                      />
                    </div>

                    <select
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="font-open-sans rounded-xl border border-[#bdc3c7] bg-white px-3 py-2 text-sm focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
                    >
                      <option value="all">Toutes les catégories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Liste des produits */}
                <div className="rounded-xl border border-[#bdc3c7] bg-white p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-montserrat text-lg font-semibold text-[#2c3e50]">
                      Produits ({filteredProducts.length})
                    </h3>
                  </div>

                  <div className="max-h-80 space-y-2 overflow-y-auto">
                    {filteredProducts.slice(0, 20).map(product => (
                      <CompactProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {filteredProducts.length === 0 && (
                    <div className="py-8 text-center">
                      <Package className="mx-auto mb-4 h-12 w-12 text-[#bdc3c7]" />
                      <p className="font-open-sans text-[#34495e]">
                        Aucun produit trouvé avec les critères actuels
                      </p>
                    </div>
                  )}

                  {filteredProducts.length > 20 && (
                    <div className="mt-4 border-t border-[#bdc3c7] pt-4 text-center">
                      <Link
                        href="/inventory"
                        onClick={onClose}
                        className="font-open-sans inline-flex items-center gap-1 text-sm font-medium text-[#2c3e50] hover:text-[#34495e]"
                      >
                        Voir tous les {filteredProducts.length} produits
                        <ExternalLink className="h-4 w-4" />
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
