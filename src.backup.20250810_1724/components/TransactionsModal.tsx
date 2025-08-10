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
  TrendingUp,
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
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>(
    'all'
  );
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
      console.log(
        '[TRANSACTIONS_MODAL] Fetching all transactions for user:',
        user?.id
      );
      const response = await fetch('/api/banking/transactions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log(
          '[TRANSACTIONS_MODAL] Received transactions:',
          data.transactions?.length || 0
        );
        setTransactions(data.transactions || []);
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Erreur inconnue' }));
        console.error(
          '[TRANSACTIONS_MODAL] API Error:',
          response.status,
          errorData
        );
        setError(
          `Erreur ${response.status}: ${errorData.error || 'Chargement impossible'}`
        );
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
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.account?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === 'all' ||
      (filterType === 'credit' && transaction.type === 'credit') ||
      (filterType === 'debit' && transaction.type === 'debit');

    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Export CSV
  const exportToCSV = () => {
    try {
      const csvContent = [
        [
          'Date',
          'Description',
          'Montant (€)',
          'Type',
          'Catégorie',
          'Compte',
          'Banque',
        ],
        ...filteredTransactions.map(transaction => [
          new Date(transaction.transactionDate).toLocaleDateString('fr-FR'),
          transaction.description,
          transaction.amount,
          transaction.type === 'credit' ? 'Crédit' : 'Débit',
          transaction.category || 'Non catégorisé',
          transaction.account?.name || 'N/A',
          transaction.account?.bankName || 'N/A',
        ]),
      ]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de l'export CSV:", error);
      alert("Erreur lors de l'export CSV");
    }
  };

  // Calculer les statistiques
  const totalAmount = filteredTransactions.reduce(
    (sum, t) => sum + (t.type === 'credit' ? t.amount : -t.amount),
    0
  );
  const creditTotal = filteredTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const debitTotal = filteredTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative flex max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-[#bdc3c7] bg-white shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-[#bdc3c7] bg-[#ecf0f1] p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#2c3e50] p-2">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-montserrat text-xl font-bold text-[#2c3e50]">
                    Mes Transactions
                  </h3>
                  <p className="font-open-sans text-sm text-[#34495e]">
                    {filteredTransactions.length} transaction
                    {filteredTransactions.length > 1 ? 's' : ''} trouvée
                    {filteredTransactions.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2 text-[#34495e] transition-colors hover:bg-white hover:text-[#2c3e50]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Statistiques */}
            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-[#bdc3c7] bg-white p-4">
                <div className="font-montserrat text-lg font-bold text-[#2c3e50]">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(totalAmount)}
                </div>
                <div className="font-open-sans text-sm text-[#34495e]">
                  Solde net
                </div>
              </div>
              <div className="rounded-xl border border-[#bdc3c7] bg-white p-4">
                <div className="font-montserrat text-lg font-bold text-green-600">
                  +
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(creditTotal)}
                </div>
                <div className="font-open-sans text-sm text-[#34495e]">
                  Total crédits
                </div>
              </div>
              <div className="rounded-xl border border-[#bdc3c7] bg-white p-4">
                <div className="font-montserrat text-lg font-bold text-red-600">
                  -
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(debitTotal)}
                </div>
                <div className="font-open-sans text-sm text-[#34495e]">
                  Total débits
                </div>
              </div>
            </div>

            {/* Filtres et recherche */}
            <div className="flex flex-col gap-3 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-[#34495e]" />
                  <input
                    type="text"
                    placeholder="Rechercher dans les transactions..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="font-open-sans w-full rounded-xl border border-[#bdc3c7] py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2c3e50]"
                  />
                </div>
              </div>

              <select
                value={filterType}
                onChange={e =>
                  setFilterType(e.target.value as 'all' | 'credit' | 'debit')
                }
                className="font-open-sans rounded-xl border border-[#bdc3c7] px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2c3e50]"
              >
                <option value="all">Tous types</option>
                <option value="credit">Crédits</option>
                <option value="debit">Débits</option>
              </select>

              <button
                onClick={exportToCSV}
                disabled={filteredTransactions.length === 0}
                className="font-open-sans flex items-center gap-2 rounded-xl bg-[#2c3e50] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#34495e] disabled:cursor-not-allowed disabled:bg-[#bdc3c7]"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Contenu */}
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-[#2c3e50]" />
                  <p className="font-open-sans text-[#34495e]">
                    Chargement des transactions...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
                  <p className="font-open-sans text-[#34495e]">{error}</p>
                  <button
                    onClick={fetchTransactions}
                    className="font-open-sans mt-3 rounded-xl bg-[#2c3e50] px-4 py-2 text-sm text-white transition-colors hover:bg-[#34495e]"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="mx-auto mb-4 h-12 w-12 text-[#bdc3c7]" />
                  <p className="font-open-sans text-[#34495e]">
                    Aucune transaction trouvée
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full overflow-y-auto">
                <div className="space-y-2 p-6">
                  {paginatedTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="flex items-center justify-between rounded-xl border border-transparent bg-[#ecf0f1] p-4 transition-all duration-200 hover:border-[#bdc3c7] hover:bg-white"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-4">
                        <div
                          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
                            transaction.type === 'credit'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {transaction.type === 'credit' ? (
                            <ArrowUpRight className="h-6 w-6" />
                          ) : (
                            <ArrowDownRight className="h-6 w-6" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-montserrat mb-1 truncate font-medium text-[#2c3e50]">
                            {transaction.description}
                          </p>
                          <div className="font-open-sans flex items-center gap-4 text-xs text-[#34495e]">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(
                                transaction.transactionDate
                              ).toLocaleDateString('fr-FR')}
                            </span>
                            {transaction.category && (
                              <span className="truncate capitalize">
                                {transaction.category}
                              </span>
                            )}
                            {transaction.account && (
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                {transaction.account.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <p
                          className={`font-montserrat text-lg font-bold ${
                            transaction.type === 'credit'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'credit' ? '+' : '-'}
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: transaction.currency,
                            minimumFractionDigits: 2,
                          }).format(Math.abs(transaction.amount))}
                        </p>
                        {transaction.account?.bankName && (
                          <p className="font-open-sans text-xs text-[#34495e]">
                            {transaction.account.bankName}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="border-t border-[#bdc3c7] bg-[#ecf0f1] p-6">
                    <div className="flex items-center justify-between">
                      <p className="font-open-sans text-sm text-[#34495e]">
                        Page {currentPage} sur {totalPages} •{' '}
                        {filteredTransactions.length} transaction
                        {filteredTransactions.length > 1 ? 's' : ''}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setCurrentPage(prev => Math.max(1, prev - 1))
                          }
                          disabled={currentPage === 1}
                          className="font-open-sans rounded-xl border border-[#bdc3c7] bg-white px-3 py-1 text-sm font-medium text-[#2c3e50] transition-colors hover:bg-[#ecf0f1] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Précédent
                        </button>
                        <button
                          onClick={() =>
                            setCurrentPage(prev =>
                              Math.min(totalPages, prev + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="font-open-sans rounded-xl border border-[#bdc3c7] bg-white px-3 py-1 text-sm font-medium text-[#2c3e50] transition-colors hover:bg-[#ecf0f1] disabled:cursor-not-allowed disabled:opacity-50"
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
