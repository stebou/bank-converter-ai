'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Filter, Calendar, CreditCard, TrendingUp, TrendingDown, Banknote } from 'lucide-react';
import type { DocumentType } from '@/types';

interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  originalDesc: string;
  category: string | null;
  subcategory: string | null;
  aiConfidence: number | null;
  anomalyScore: number | null;
}

interface TransactionsListProps {
  documents: DocumentType[];
  className?: string;
  selectedDocumentId?: string;
  onDocumentSelect?: (documentId: string) => void;
}

export const TransactionsList: React.FC<TransactionsListProps> = ({ 
  documents, 
  className = "",
  selectedDocumentId = 'all',
  onDocumentSelect
}) => {
  const [selectedDocument, setSelectedDocument] = useState<string>(selectedDocumentId);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  // Synchroniser l'état local avec la prop
  useEffect(() => {
    setSelectedDocument(selectedDocumentId);
  }, [selectedDocumentId]);

  // Récupérer les transactions du document sélectionné
  useEffect(() => {
    const fetchTransactions = async () => {
      if (selectedDocument === 'all') {
        setTransactions([]);
        return;
      }

      setLoading(true);
      try {
        console.log('[TRANSACTIONS_LIST] Fetching transactions for document:', selectedDocument);
        const response = await fetch(`/api/documents/${selectedDocument}/transactions`);
        console.log('[TRANSACTIONS_LIST] Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('[TRANSACTIONS_LIST] Received data:', data);
          setTransactions(data.transactions || []);
        } else {
          console.error('[TRANSACTIONS_LIST] Failed to fetch transactions, status:', response.status);
          const errorData = await response.text();
          console.error('[TRANSACTIONS_LIST] Error response:', errorData);
          setTransactions([]);
        }
      } catch (error) {
        console.error('[TRANSACTIONS_LIST] Error fetching transactions:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedDocument]);

  // Filtrer les transactions selon le type
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'income') return transaction.amount > 0;
    if (filter === 'expense') return transaction.amount < 0;
    return true; // 'all'
  });

  // Statistiques
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const balance = totalIncome - totalExpense;

  // Fonction pour formater les montants
  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toFixed(2);
    return amount >= 0 ? `+${formatted} €` : `-${formatted} €`;
  };

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fonction pour obtenir l'icône de catégorie
  const getCategoryIcon = (category: string | null) => {
    const iconClass = "w-4 h-4";
    switch (category?.toLowerCase()) {
      case 'revenus': return <TrendingUp className={`${iconClass} text-green-600`} />;
      case 'dépenses': case 'alimentation': case 'logement': case 'restauration': return <TrendingDown className={`${iconClass} text-red-600`} />;
      case 'retraits': return <Banknote className={`${iconClass} text-purple-600`} />;
      case 'virements': case 'prélèvements': return <CreditCard className={`${iconClass} text-blue-600`} />;
      default: return <CreditCard className={`${iconClass} text-gray-600`} />;
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Mes Transactions
          </h3>
          <div className="flex items-center gap-2">
            {/* Filtre par type */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'income' | 'expense')}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes</option>
              <option value="income">Revenus</option>
              <option value="expense">Dépenses</option>
            </select>
          </div>
        </div>

        {/* Sélecteur de document */}
        <div className="relative">
          <select
            value={selectedDocument}
            onChange={(e) => {
              const newValue = e.target.value;
              setSelectedDocument(newValue);
              onDocumentSelect?.(newValue);
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="all">Sélectionner un document...</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.filename} - {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                {doc.bankDetected && ` (${doc.bankDetected})`}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        {/* Statistiques */}
        {selectedDocument !== 'all' && !loading && transactions.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-sm text-green-600 font-medium">Revenus</div>
              <div className="text-lg font-bold text-green-700">+{totalIncome.toFixed(2)} €</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <div className="text-sm text-red-600 font-medium">Dépenses</div>
              <div className="text-lg font-bold text-red-700">-{totalExpense.toFixed(2)} €</div>
            </div>
            <div className={`p-3 rounded-lg text-center ${balance >= 0 ? 'bg-blue-50' : 'bg-orange-50'}`}>
              <div className={`text-sm font-medium ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>Solde</div>
              <div className={`text-lg font-bold ${balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                {balance >= 0 ? '+' : ''}{balance.toFixed(2)} €
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Liste des transactions */}
      <div className="max-h-96 overflow-y-auto">
        {selectedDocument === 'all' ? (
          <div className="p-8 text-center text-gray-500">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-medium text-gray-600 mb-2">Sélectionnez un document</h4>
            <p className="text-sm">Choisissez un document pour voir ses transactions</p>
          </div>
        ) : loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Chargement des transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-medium text-gray-600 mb-2">Aucune transaction</h4>
            <p className="text-sm">Ce document ne contient pas de transactions{filter !== 'all' ? ` de type "${filter === 'income' ? 'revenus' : 'dépenses'}"` : ''}.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredTransactions.map((transaction, index) => (
              <div key={`${transaction.id}-${index}`} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(transaction.category)}
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {transaction.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(transaction.date)} • {transaction.category || 'Non catégorisé'}
                      </div>
                      {transaction.originalDesc !== transaction.description && (
                        <div className="text-xs text-gray-400 mt-1 italic">
                          {transaction.originalDesc}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-sm ${
                      transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatAmount(transaction.amount)}
                    </div>
                    {transaction.aiConfidence && (
                      <div className="text-xs text-gray-400">
                        {transaction.aiConfidence.toFixed(0)}% confiance
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};