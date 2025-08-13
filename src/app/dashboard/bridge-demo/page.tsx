'use client';

import { useBridgeData } from '@/lib/bridge';
import { motion } from 'framer-motion';
import {
    ArrowDownRight,
    ArrowUpRight,
    Banknote,
    Building2,
    CreditCard,
    ExternalLink,
    Eye,
    Info,
    Plus,
    RefreshCw,
    Settings,
    Shield,
    TrendingUp,
    Wallet
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BridgeDemoPage() {
  const { accounts, transactions, isDemoMode, loading, error } = useBridgeData();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0].id);
    }
  }, [accounts, selectedAccount]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Test de synchronisation avec Bridge API
      const response = await fetch('/api/bridge/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('Synchronisation réussie:', result.data);
        // Ici on pourrait recharger les données ou afficher un message de succès
      } else {
        console.error('Erreur de synchronisation:', result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation:', error);
    } finally {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation
      setIsRefreshing(false);
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return <CreditCard className="h-6 w-6" />;
      case 'savings':
        return <Banknote className="h-6 w-6" />;
      case 'business':
        return <Building2 className="h-6 w-6" />;
      default:
        return <Wallet className="h-6 w-6" />;
    }
  };

  const getAccountTypeLabel = (type: string) => {
    switch (type) {
      case 'checking':
        return 'Compte Courant';
      case 'savings':
        return 'Compte Épargne';
      case 'business':
        return 'Compte Professionnel';
      default:
        return 'Compte Bancaire';
    }
  };

  const selectedAccountData = accounts.find(acc => acc.id === selectedAccount);
  const accountTransactions = transactions.filter(tx => tx.account_id === selectedAccount);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ecf0f1] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-[#2c3e50] mx-auto mb-4" />
          <p className="text-[#2c3e50] font-medium">Chargement des données bancaires...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#ecf0f1] flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Erreur lors du chargement des données</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ecf0f1]">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#2c3e50] mb-2">
                Bridge API - Agrégation Bancaire
              </h1>
              <p className="text-[#7f8c8d]">
                Synchronisation automatique des comptes bancaires professionnels
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isDemoMode && (
                <div className="flex items-center gap-2 bg-orange-100 border border-orange-200 rounded-lg px-3 py-2">
                  <Info className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Mode Démo</span>
                </div>
              )}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 bg-[#2c3e50] text-white px-4 py-2 rounded-lg hover:bg-[#34495e] transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Synchroniser
              </button>
              <button
                onClick={() => window.open('https://dashboard.bridgeapi.io/connect', '_blank')}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Connecter un compte
              </button>
            </div>
          </div>

          {/* Bridge API Status */}
          <div className="bg-white border border-[#bdc3c7] rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white">
                <Shield className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#2c3e50] mb-1">
                  Bridge API - Agrégation Bancaire
                </h3>
                <p className="text-sm text-[#7f8c8d]">
                  {isDemoMode 
                    ? "Mode démonstration - Configurez vos clés API Bridge pour connecter de vrais comptes bancaires"
                    : "Connecté à Bridge API - Synchronisation automatique des comptes professionnels"
                  }
                </p>
              </div>
              <a
                href="https://dashboard.bridgeapi.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Dashboard Bridge
              </a>
            </div>
          </div>
        </div>

        {/* Comptes bancaires */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des comptes */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-[#2c3e50] mb-4">Comptes professionnels</h2>
            <div className="space-y-3">
              {accounts.map((account) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedAccount === account.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-[#bdc3c7] bg-white hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedAccount(account.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      selectedAccount === account.id ? 'bg-blue-500 text-white' : 'bg-[#ecf0f1] text-[#2c3e50]'
                    }`}>
                      {getAccountIcon(account.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#2c3e50] truncate">{account.name}</p>
                      <p className="text-sm text-[#7f8c8d]">{getAccountTypeLabel(account.type)}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-lg text-[#2c3e50]">
                      {new Intl.NumberFormat('fr-FR', { 
                        style: 'currency', 
                        currency: account.currency 
                      }).format(account.balance)}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      account.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Ajouter un compte */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 border-2 border-dashed border-[#bdc3c7] rounded-xl cursor-pointer hover:border-blue-400 transition-colors"
            >
              <div className="flex items-center justify-center gap-2 text-[#7f8c8d] hover:text-blue-600">
                <Plus className="h-5 w-5" />
                <span className="font-medium">Ajouter un compte</span>
              </div>
            </motion.div>
          </div>

          {/* Détails du compte sélectionné */}
          <div className="lg:col-span-2">
            {selectedAccountData ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-[#2c3e50]">
                    {selectedAccountData.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 text-[#7f8c8d] hover:text-[#2c3e50] transition-colors">
                      <Eye className="h-4 w-4" />
                      Voir détails
                    </button>
                    <button className="flex items-center gap-2 text-[#7f8c8d] hover:text-[#2c3e50] transition-colors">
                      <Settings className="h-4 w-4" />
                      Paramètres
                    </button>
                  </div>
                </div>

                {/* Informations du compte */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white border border-[#bdc3c7] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-[#7f8c8d]">Solde actuel</p>
                        <p className="text-2xl font-bold text-[#2c3e50]">
                          {new Intl.NumberFormat('fr-FR', { 
                            style: 'currency', 
                            currency: selectedAccountData.currency 
                          }).format(selectedAccountData.balance)}
                        </p>
                      </div>
                    </div>
                    {selectedAccountData.iban && (
                      <p className="text-sm text-[#7f8c8d]">
                        IBAN: {selectedAccountData.iban}
                      </p>
                    )}
                  </div>

                  <div className="bg-white border border-[#bdc3c7] rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-[#7f8c8d]">Type de compte</p>
                        <p className="text-lg font-semibold text-[#2c3e50]">
                          {getAccountTypeLabel(selectedAccountData.type)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-[#7f8c8d]">
                      Dernière mise à jour: {new Date(selectedAccountData.updated_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                {/* Transactions récentes */}
                <div className="bg-white border border-[#bdc3c7] rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-[#2c3e50] mb-4">
                    Transactions récentes
                  </h3>
                  
                  {accountTransactions.length > 0 ? (
                    <div className="space-y-3">
                      {accountTransactions.slice(0, 10).map((transaction) => (
                        <motion.div
                          key={transaction.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              transaction.type === 'credit' 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-red-100 text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? (
                                <ArrowUpRight className="h-4 w-4" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-[#2c3e50]">{transaction.description}</p>
                              <p className="text-sm text-[#7f8c8d]">
                                {transaction.category} • {new Date(transaction.date).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'credit' ? '+' : ''}
                              {new Intl.NumberFormat('fr-FR', { 
                                style: 'currency', 
                                currency: transaction.currency 
                              }).format(transaction.amount)}
                            </p>
                            <p className="text-sm text-[#7f8c8d]">
                              Solde: {new Intl.NumberFormat('fr-FR', { 
                                style: 'currency', 
                                currency: transaction.currency 
                              }).format(transaction.balance)}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building2 className="h-12 w-12 text-[#bdc3c7] mx-auto mb-3" />
                      <p className="text-[#7f8c8d]">Aucune transaction trouvée</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-[#bdc3c7] rounded-xl p-8 text-center">
                <Wallet className="h-16 w-16 text-[#bdc3c7] mx-auto mb-4" />
                <p className="text-[#7f8c8d]">Sélectionnez un compte pour voir les détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
