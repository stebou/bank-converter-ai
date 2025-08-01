'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Building2,
  Search,
  Filter,
  Download,
  Loader2,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import type { BankTransactionType } from '@/types';
import '../styles/fonts.css';

interface TransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionsModal = ({ isOpen, onClose }: TransactionsModalProps) => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<BankTransactionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Charger les transactions à chaque ouverture de la modal
  useEffect(() => {
    if (isOpen && user?.id) {
      fetchTransactions();
    }
  }, [isOpen, user?.id]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('[TRANSACTIONS_MODAL] Fetching all transactions for user:', user?.id);
      const response = await fetch('/api/banking/transactions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[TRANSACTIONS_MODAL] Received transactions:', data.transactions?.length || 0);
        setTransactions(data.transactions || []);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }));
        console.error('[TRANSACTIONS_MODAL] API Error:', response.status, errorData);
        setError(`Erreur ${response.status}: ${errorData.error || 'Chargement impossible'}`);
      }
    } catch (err) {
      console.error('[TRANSACTIONS_MODAL] Fetch error:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.account?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || 
                       (filterType === 'credit' && transaction.type === 'credit') ||
                       (filterType === 'debit' && transaction.type === 'debit');
    
    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  // Export CSV
  const exportToCSV = () => {
    try {
      const csvContent = [
        ['Date', 'Description', 'Montant (€)', 'Type', 'Catégorie', 'Compte', 'Banque'],
        ...filteredTransactions.map(transaction => [
          new Date(transaction.transactionDate).toLocaleDateString('fr-FR'),
          transaction.description,
          transaction.amount,
          transaction.type === 'credit' ? 'Crédit' : 'Débit',
          transaction.category || 'Non catégorisé',
          transaction.account?.name || 'N/A',
          transaction.account?.bankName || 'N/A'
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
      alert('Erreur lors de l\'export CSV');
    }
  };

  // Calculer les statistiques
  const totalAmount = filteredTransactions.reduce((sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount), 0);
  const creditTotal = filteredTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const debitTotal = filteredTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] relative overflow-hidden max-w-7xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-[#bdc3c7] bg-[#ecf0f1]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2c3e50] rounded-xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-montserrat text-[#2c3e50]">
                    Mes Transactions
                  </h3>
                  <p className="text-sm text-[#34495e] font-open-sans">
                    {filteredTransactions.length} transaction{filteredTransactions.length > 1 ? 's' : ''} trouvée{filteredTransactions.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 text-[#34495e] hover:text-[#2c3e50] hover:bg-white rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-4 rounded-xl border border-[#bdc3c7]">
                <div className="text-lg font-bold font-montserrat text-[#2c3e50]">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(totalAmount)}
                </div>
                <div className="text-sm text-[#34495e] font-open-sans">Solde net</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#bdc3c7]">
                <div className="text-lg font-bold font-montserrat text-green-600">
                  +{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(creditTotal)}
                </div>
                <div className="text-sm text-[#34495e] font-open-sans">Total crédits</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#bdc3c7]">
                <div className="text-lg font-bold font-montserrat text-red-600">
                  -{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(debitTotal)}
                </div>
                <div className="text-sm text-[#34495e] font-open-sans">Total débits</div>
              </div>
            </div>

            {/* Filtres et recherche */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#34495e]" />
                  <input
                    type="text"
                    placeholder="Rechercher dans les transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-[#bdc3c7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent font-open-sans text-sm"
                  />
                </div>
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'credit' | 'debit')}
                className="px-3 py-2 border border-[#bdc3c7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2c3e50] focus:border-transparent font-open-sans text-sm"
              >
                <option value="all">Tous types</option>
                <option value="credit">Crédits</option>
                <option value="debit">Débits</option>
              </select>

              <button
                onClick={exportToCSV}
                disabled={filteredTransactions.length === 0}
                className="px-4 py-2 bg-[#2c3e50] text-white font-medium font-open-sans rounded-xl hover:bg-[#34495e] disabled:bg-[#bdc3c7] disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#2c3e50] mx-auto mb-3" />
                  <p className="text-[#34495e] font-open-sans">Chargement des transactions...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-[#34495e] font-open-sans">{error}</p>
                  <button
                    onClick={fetchTransactions}
                    className="mt-3 px-4 py-2 bg-[#2c3e50] text-white rounded-xl hover:bg-[#34495e] transition-colors font-open-sans text-sm"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-[#bdc3c7] mx-auto mb-4" />
                  <p className="text-[#34495e] font-open-sans">Aucune transaction trouvée</p>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-y-auto">
                <div className="p-6 space-y-2">
                  {paginatedTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="flex items-center justify-between p-4 bg-[#ecf0f1] rounded-xl hover:bg-white transition-all duration-200 border border-transparent hover:border-[#bdc3c7]"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          transaction.type === 'credit' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <ArrowUpRight className="w-6 h-6" />
                          ) : (
                            <ArrowDownRight className="w-6 h-6" />
                          )}
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <p className="font-medium font-montserrat text-[#2c3e50] truncate mb-1">
                            {transaction.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-[#34495e] font-open-sans">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(transaction.transactionDate).toLocaleDateString('fr-FR')}
                            </span>
                            {transaction.category && (
                              <span className="capitalize truncate">{transaction.category}</span>
                            )}
                            {transaction.account && (
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {transaction.account.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0">
                        <p className={`font-bold font-montserrat text-lg ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: transaction.currency,
                            minimumFractionDigits: 2,
                          }).format(Math.abs(transaction.amount))}
                        </p>
                        {transaction.account?.bankName && (
                          <p className="text-xs text-[#34495e] font-open-sans">
                            {transaction.account.bankName}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-6 border-t border-[#bdc3c7] bg-[#ecf0f1]">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#34495e] font-open-sans">
                        Page {currentPage} sur {totalPages} • {filteredTransactions.length} transaction{filteredTransactions.length > 1 ? 's' : ''}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm font-medium font-open-sans bg-white text-[#2c3e50] rounded-xl hover:bg-[#ecf0f1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-[#bdc3c7]"
                        >
                          Précédent
                        </button>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 text-sm font-medium font-open-sans bg-white text-[#2c3e50] rounded-xl hover:bg-[#ecf0f1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-[#bdc3c7]"
                        >
                          Suivant
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransactionsModal;