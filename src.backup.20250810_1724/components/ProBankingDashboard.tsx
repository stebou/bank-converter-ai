'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  Building2,
  CreditCard,
  RefreshCw,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Bot,
  Sparkles,
  Package,
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useBankingData } from '@/hooks/useBanking';
import type { BankAccountType, BankTransactionType } from '@/types';
import BankingDocumentsBox from './BankingDocumentsBox';
import BankingDocumentUpload from './BankingDocumentUpload';
import DocumentAnalysisModal from './DocumentAnalysisModal';
import TransactionsModal from './TransactionsModal';
import SubscriptionBadge from './SubscriptionBadge';
import AgentAnalysisModal from './AgentAnalysisModal';
import StockModal from './StockModal';
import AIAgentsModal from './AIAgentsModal';
import type { BusinessInsightReport } from '@/lib/agents/banking';
import '../styles/fonts.css';

// Composant pour les KPIs principaux (style 2025)
const KPICard = ({
  title,
  value,
  change,
  icon: Icon,
  trend = 'neutral',
  format = 'currency',
}: {
  title: string;
  value: number;
  change?: number;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'currency' | 'number' | 'percentage';
}) => {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toString();
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.3, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl"
    >
      <div className="flex min-h-[120px] items-start justify-between">
        <div className="flex flex-1 items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#2c3e50] shadow-lg">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-montserrat mb-2 text-sm font-medium text-[#34495e]">
              {title}
            </p>
            <p className="font-montserrat break-words text-xl font-bold tracking-tight text-[#2c3e50] lg:text-2xl">
              {formatValue(value)}
            </p>
          </div>
        </div>

        {change !== undefined && (
          <div
            className={`flex items-center gap-1 ${getTrendColor()} ml-2 flex-shrink-0`}
          >
            {getTrendIcon()}
            <span className="font-open-sans text-sm font-medium">
              {change > 0 ? '+' : ''}
              {change.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Graphique d'évolution des comptes (placeholder pour Chart.js)
const AccountEvolutionChart = ({
  accounts,
  transactions,
  onAgentAnalysis,
  agentAnalysisLoading,
  onShowTransactions,
  onShowStocks,
}: {
  accounts: BankAccountType[];
  transactions: BankTransactionType[];
  onAgentAnalysis?: () => void;
  agentAnalysisLoading?: boolean;
  onShowTransactions?: () => void;
  onShowStocks?: () => void;
}) => {
  // Simulation de données d'évolution sur 12 mois
  const generateEvolutionData = () => {
    const months = [];
    const now = new Date();

    // Calculer le solde de base
    const baseBalance =
      accounts.reduce((sum, acc) => sum + acc.balance, 0) || 10000; // Valeur par défaut si pas de comptes

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });

      // Simulation de l'évolution avec des valeurs garanties non-nulles
      const variation = Math.sin(i * 0.5) * 0.1 + (Math.random() - 0.5) * 0.05; // Variation plus prévisible
      const balance = baseBalance * (1 + variation);

      months.push({
        month: monthName,
        balance: Math.max(balance, 1000), // Minimum 1000€
        transactions: Math.floor(Math.random() * 20) + 10,
      });
    }

    return months;
  };

  const evolutionData = generateEvolutionData();
  const maxBalance = Math.max(...evolutionData.map(d => d.balance));
  const minBalance = Math.min(...evolutionData.map(d => d.balance));

  // S'assurer que maxBalance et minBalance sont valides
  const safeMaxBalance = maxBalance > 0 ? maxBalance : 10000;
  const safeMinBalance = Math.max(minBalance, 0);

  return (
    <div className="rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-montserrat text-xl font-bold tracking-tight text-[#2c3e50]">
            Évolution des Comptes Pro
          </h3>
          <p className="font-open-sans text-sm text-[#34495e]">
            Solde total sur 12 mois
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Bouton Mes transactions */}
          {onShowTransactions && (
            <button
              onClick={onShowTransactions}
              className="font-open-sans flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-700"
            >
              <TrendingUp className="h-4 w-4" />
              Mes transactions
            </button>
          )}

          {/* Bouton Mes stocks */}
          {onShowStocks && (
            <button
              onClick={onShowStocks}
              className="font-open-sans flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-green-700"
            >
              <Package className="h-4 w-4" />
              Mes stocks
            </button>
          )}

          {/* Bouton Analyse Agentique */}
          {onAgentAnalysis && (
            <button
              onClick={onAgentAnalysis}
              disabled={agentAnalysisLoading}
              className="font-open-sans flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles
                className={`h-4 w-4 ${agentAnalysisLoading ? 'animate-pulse' : ''}`}
              />
              {agentAnalysisLoading ? 'Analyse...' : 'Analyse agentique'}
            </button>
          )}

          {/* Boutons de période */}
          <div className="flex gap-2">
            <button className="font-open-sans rounded-xl bg-[#2c3e50] px-3 py-1 text-xs font-medium text-white">
              12M
            </button>
            <button className="font-open-sans rounded-xl px-3 py-1 text-xs font-medium text-[#34495e] transition-colors hover:bg-[#ecf0f1]">
              6M
            </button>
            <button className="font-open-sans rounded-xl px-3 py-1 text-xs font-medium text-[#34495e] transition-colors hover:bg-[#ecf0f1]">
              3M
            </button>
          </div>
        </div>
      </div>

      {/* Graphique simple SVG - remplacer par Chart.js en production */}
      <div className="relative h-64">
        <svg className="h-full w-full" viewBox="0 0 800 200">
          <defs>
            <linearGradient
              id="chartGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#2c3e50" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#2c3e50" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Grille */}
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1="0"
              y1={40 * i}
              x2="800"
              y2={40 * i}
              stroke="#bdc3c7"
              strokeWidth="1"
            />
          ))}

          {/* Courbe */}
          <path
            d={`M ${evolutionData
              .map((d, i) => {
                const x = (i * 800) / Math.max(evolutionData.length - 1, 1);
                const y =
                  200 -
                  ((d.balance - safeMinBalance) /
                    Math.max(safeMaxBalance - safeMinBalance, 1)) *
                    160;
                return `${x},${Math.max(20, Math.min(180, y))}`;
              })
              .join(' L ')}`}
            fill="none"
            stroke="#2c3e50"
            strokeWidth="3"
            className="drop-shadow-sm"
          />

          {/* Aire sous la courbe */}
          <path
            d={`M ${evolutionData
              .map((d, i) => {
                const x = (i * 800) / Math.max(evolutionData.length - 1, 1);
                const y =
                  200 -
                  ((d.balance - safeMinBalance) /
                    Math.max(safeMaxBalance - safeMinBalance, 1)) *
                    160;
                return `${x},${Math.max(20, Math.min(180, y))}`;
              })
              .join(' L ')} L 800,200 L 0,200 Z`}
            fill="url(#chartGradient)"
          />

          {/* Points */}
          {evolutionData.map((d, i) => {
            const x = (i * 800) / Math.max(evolutionData.length - 1, 1);
            const y =
              200 -
              ((d.balance - safeMinBalance) /
                Math.max(safeMaxBalance - safeMinBalance, 1)) *
                160;
            const safeX = Math.max(0, Math.min(800, x));
            const safeY = Math.max(20, Math.min(180, y));

            return (
              <circle
                key={i}
                cx={safeX}
                cy={safeY}
                r="4"
                fill="#2c3e50"
                className="hover:r-6 cursor-pointer transition-all"
                style={{ cursor: 'pointer' }}
              />
            );
          })}
        </svg>

        {/* Labels des mois */}
        <div className="font-open-sans absolute bottom-0 left-0 right-0 mt-2 flex justify-between text-xs text-[#34495e]">
          {evolutionData.map((d, i) => (
            <span key={i}>{d.month}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Composant pour les comptes professionnels
const ProAccountCard = ({ account }: { account: BankAccountType }) => {
  const getAccountTypeInfo = (type: string) => {
    switch (type.toLowerCase()) {
      case 'business':
      case 'professional':
        return {
          label: 'Compte Pro',
          color: 'bg-[#2c3e50] text-white',
          icon: '🏢',
        };
      case 'checking':
      case 'current':
        return {
          label: 'Compte Courant',
          color: 'bg-[#34495e] text-white',
          icon: '💳',
        };
      case 'savings':
        return {
          label: 'Épargne',
          color: 'bg-green-600 text-white',
          icon: '💰',
        };
      default:
        return {
          label: type,
          color: 'bg-[#bdc3c7] text-[#2c3e50]',
          icon: '🏦',
        };
    }
  };

  const accountInfo = getAccountTypeInfo(account.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl transition-all duration-300 hover:shadow-2xl"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-lg">{accountInfo.icon}</span>
            <h3 className="font-montserrat font-semibold text-[#2c3e50]">
              {account.name}
            </h3>
          </div>
          <span
            className={`font-open-sans rounded-xl px-3 py-1 text-xs font-medium ${accountInfo.color}`}
          >
            {accountInfo.label}
          </span>
        </div>

        <div
          className={`h-3 w-3 rounded-full ${account.isActive ? 'bg-green-500' : 'bg-[#bdc3c7]'}`}
        />
      </div>

      <div className="space-y-3">
        <div>
          <p className="font-montserrat text-3xl font-bold tracking-tight text-[#2c3e50]">
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: account.currency,
              minimumFractionDigits: 2,
            }).format(account.balance)}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="font-open-sans text-[#34495e]">
            {account.bankName}
          </span>
          {account.lastSyncAt && (
            <span className="font-open-sans text-[#34495e]">
              Sync: {new Date(account.lastSyncAt).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>

        {account.iban && (
          <div className="border-t border-[#bdc3c7] pt-2">
            <p className="font-mono text-xs text-[#34495e]">
              {account.iban.substring(0, 8)}****
              {account.iban.substring(account.iban.length - 4)}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Types pour les données d'abonnement
type SubscriptionData = {
  currentPlan: string;
  subscriptionStatus: string | null;
  documentsLimit: number;
  documentsUsed: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
};

interface ProBankingDashboardProps {
  userName?: string;
  subscriptionData?: SubscriptionData;
}

// Dashboard principal pour entreprises
export default function ProBankingDashboard({
  userName,
  subscriptionData,
}: ProBankingDashboardProps = {}) {
  const { user } = useUser();
  const {
    accounts,
    transactions,
    analytics,
    loading,
    error,
    syncing,
    syncData,
    refreshData,
  } = useBankingData(user?.id);

  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showAgentAnalysisModal, setShowAgentAnalysisModal] = useState(false);
  const [showAIAgentsModal, setShowAIAgentsModal] = useState(false);
  const [agentAnalysisReport, setAgentAnalysisReport] =
    useState<BusinessInsightReport | null>(null);
  const [agentAnalysisLoading, setAgentAnalysisLoading] = useState(false);

  const handleSync = async () => {
    try {
      await syncData();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const handleLoadTestData = async () => {
    try {
      console.log('Loading test data...');
      const response = await fetch('/api/banking/seed-test-data', {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Test data loaded successfully:', result);

        setTimeout(async () => {
          await refreshData();
          console.log('Data refreshed');
        }, 1000);
      } else {
        console.error('Failed to load test data:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to load test data:', error);
    }
  };

  const handleViewAnalysis = (document: any) => {
    setSelectedDocument(document);
    setShowAnalysisModal(true);
  };

  const handleDocumentUploaded = (document: any) => {
    // Refresh des données et affichage de l'analyse
    refreshData();
    setSelectedDocument(document);
    setShowAnalysisModal(true);
  };

  const handleAgentAnalysis = async () => {
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    setAgentAnalysisLoading(true);
    setShowAgentAnalysisModal(true);
    setAgentAnalysisReport(null);

    try {
      console.log('[DASHBOARD] Starting agent analysis for user:', user.id);

      const response = await fetch('/api/agents/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details || "Erreur lors de l'analyse agentique"
        );
      }

      const result = await response.json();
      console.log('[DASHBOARD] Agent analysis completed:', result);

      if (result.success && result.report) {
        setAgentAnalysisReport(result.report);
      } else {
        throw new Error('Aucun rapport généré par les agents');
      }
    } catch (error) {
      console.error('[DASHBOARD] Agent analysis failed:', error);
      // On garde la modal ouverte pour afficher l'erreur
      setAgentAnalysisReport(null);
    } finally {
      setAgentAnalysisLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center text-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-red-500" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">Erreur</h3>
        <p className="mb-4 text-gray-600">{error}</p>
        <button
          onClick={refreshData}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Calcul des KPIs pour entreprise - filtrer seulement les comptes pro
  const businessAccounts = accounts.filter(
    acc =>
      acc.type.toLowerCase().includes('business') ||
      acc.type.toLowerCase().includes('professional') ||
      acc.name.toLowerCase().includes('pro') ||
      acc.name.toLowerCase().includes('entreprise') ||
      acc.name.toLowerCase().includes('société')
  );
  const totalBalance = businessAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0
  );
  const monthlyIncome = analytics?.totalIncome || 0;
  const monthlyExpenses = Math.abs(analytics?.totalExpenses || 0);
  const cashFlow = monthlyIncome - monthlyExpenses;

  return (
    <div className="min-h-screen bg-[#bdc3c7]">
      <div className="space-y-8 p-8">
        {/* Header professionnel */}
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="font-montserrat text-3xl font-bold tracking-tight text-[#2c3e50]">
                Dashboard Financier Pro
              </h1>
              {subscriptionData && (
                <SubscriptionBadge
                  currentPlan={subscriptionData.currentPlan}
                  subscriptionStatus={subscriptionData.subscriptionStatus}
                />
              )}
            </div>
            <p className="font-open-sans text-[#34495e]">
              Gestion et suivi des comptes société • {businessAccounts.length}{' '}
              compte{businessAccounts.length > 1 ? 's' : ''} professionnel
              {businessAccounts.length > 1 ? 's' : ''}
              {userName && ` • Bienvenue ${userName}`}
            </p>
          </div>

          <div className="flex gap-3">
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={handleLoadTestData}
                className="font-open-sans flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-green-700"
              >
                <DollarSign className="h-4 w-4" />
                Données Test
              </button>
            )}

            <button
              onClick={() => setShowAIAgentsModal(true)}
              className="font-open-sans flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-blue-700"
            >
              <Bot className="h-4 w-4" />
              Analyse IA Prédictive
            </button>

            <button
              onClick={handleSync}
              disabled={syncing}
              className="font-open-sans flex items-center gap-2 rounded-xl bg-[#2c3e50] px-4 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#34495e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`}
              />
              {syncing ? 'Synchronisation...' : 'Synchroniser'}
            </button>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <KPICard
            title="Trésorerie Totale"
            value={totalBalance}
            change={5.2}
            icon={Building2}
            trend="up"
          />
          <KPICard
            title="Cash Flow Mensuel"
            value={cashFlow}
            change={cashFlow > 0 ? 12.3 : -8.1}
            icon={TrendingUp}
            trend={cashFlow > 0 ? 'up' : 'down'}
          />
          <KPICard
            title="Revenus du Mois"
            value={monthlyIncome}
            change={7.8}
            icon={DollarSign}
            trend="up"
          />
          <KPICard
            title="Charges Mensuelles"
            value={monthlyExpenses}
            change={-2.1}
            icon={CreditCard}
            trend="down"
          />
        </div>

        {/* Graphique d'évolution des comptes pro - 3 colonnes */}
        <div className="w-full">
          <AccountEvolutionChart
            accounts={businessAccounts}
            transactions={transactions}
            onAgentAnalysis={handleAgentAnalysis}
            agentAnalysisLoading={agentAnalysisLoading}
            onShowTransactions={() => setShowTransactionsModal(true)}
            onShowStocks={() => setShowStockModal(true)}
          />
        </div>

        {/* Comptes Pro + Documents + Upload - 3 colonnes de même taille */}
        <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-3">
          {/* Répartition des comptes pro - 1 colonne */}
          <div className="flex h-[400px] flex-col rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#2c3e50] p-2">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-montserrat text-lg font-semibold tracking-tight text-[#2c3e50]">
                  Répartition des Comptes Pro
                </h3>
                <p className="font-open-sans text-sm text-[#34495e]">
                  Distribution de la trésorerie
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto">
              {businessAccounts.map((account, index) => {
                const percentage =
                  totalBalance > 0 ? (account.balance / totalBalance) * 100 : 0;
                const safePercentage = Math.max(0, Math.min(100, percentage));

                return (
                  <div key={account.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-montserrat text-sm font-medium text-[#2c3e50]">
                        {account.name}
                      </span>
                      <span className="font-open-sans text-sm text-[#34495e]">
                        {safePercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#ecf0f1]">
                      <motion.div
                        className="h-2 rounded-full bg-gradient-to-r from-[#2c3e50] to-[#34495e]"
                        initial={{ width: 0 }}
                        animate={{ width: `${safePercentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-montserrat text-lg font-bold text-[#2c3e50]">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: account.currency,
                          minimumFractionDigits: 0,
                        }).format(account.balance)}
                      </p>
                      <p className="font-open-sans text-xs text-[#34495e]">
                        {account.bankName}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Comptes Pro - Colonne 2 */}
          <div className="flex h-[400px] flex-col rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-[#2c3e50] p-2">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-montserrat text-lg font-semibold tracking-tight text-[#2c3e50]">
                  Comptes Professionnels
                </h3>
                <p className="font-open-sans text-sm text-[#34495e]">
                  {businessAccounts.length} compte
                  {businessAccounts.length > 1 ? 's' : ''} actif
                  {businessAccounts.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto">
              {businessAccounts.map((account, index) => (
                <ProAccountCard key={account.id} account={account} />
              ))}
            </div>
          </div>

          {/* Upload de documents - Colonne 3 */}
          <div className="h-[400px]">
            <BankingDocumentUpload
              onDocumentUploaded={handleDocumentUploaded}
            />
          </div>
        </div>

        {/* Ligne 3: Documents Financiers (col 1-2) + Mouvements Récents (col 3) */}
        <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-3">
          {/* Documents Financiers - Colonnes 1 et 2 */}
          <div className="h-[500px] xl:col-span-2">
            <BankingDocumentsBox onViewAnalysis={handleViewAnalysis} />
          </div>

          {/* Mouvements Récents - Colonne 3 */}
          {transactions.length > 0 && (
            <div className="flex h-[500px] flex-col rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-[#2c3e50] p-2">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-montserrat text-lg font-semibold tracking-tight text-[#2c3e50]">
                    Mouvements Récents
                  </h3>
                  <p className="font-open-sans text-sm text-[#34495e]">
                    Dernières transactions
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="space-y-2">
                  {transactions.slice(0, 10).map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group flex items-center justify-between rounded-xl border border-transparent bg-[#ecf0f1] p-4 transition-all duration-200 hover:border-[#bdc3c7] hover:bg-white"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                            transaction.type === 'credit'
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {transaction.type === 'credit' ? (
                            <ArrowUpRight className="h-5 w-5" />
                          ) : (
                            <ArrowDownRight className="h-5 w-5" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-montserrat mb-1 truncate text-sm font-medium text-[#2c3e50]">
                            {transaction.description}
                          </p>
                          <div className="font-open-sans flex items-center gap-2 text-xs text-[#34495e]">
                            <span>
                              {new Date(
                                transaction.transactionDate
                              ).toLocaleDateString('fr-FR')}
                            </span>
                            {transaction.category && (
                              <>
                                <span>•</span>
                                <span className="truncate capitalize">
                                  {transaction.category}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="ml-3 flex-shrink-0 text-right">
                        <p
                          className={`font-montserrat font-bold ${
                            transaction.type === 'credit'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'credit' ? '+' : ''}
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: transaction.currency,
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(transaction.amount)}
                        </p>
                        {transaction.account && (
                          <p className="font-open-sans max-w-[80px] truncate text-xs text-[#34495e]">
                            {transaction.account.name}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Analysis Modal */}
      <DocumentAnalysisModal
        isOpen={showAnalysisModal}
        documentData={selectedDocument}
        onClose={() => {
          setShowAnalysisModal(false);
          setSelectedDocument(null);
        }}
      />

      {/* Transactions Modal */}
      <TransactionsModal
        isOpen={showTransactionsModal}
        onClose={() => setShowTransactionsModal(false)}
      />

      {/* Stock Modal */}
      <StockModal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
      />

      {/* Agent Analysis Modal */}
      <AgentAnalysisModal
        isOpen={showAgentAnalysisModal}
        onClose={() => {
          setShowAgentAnalysisModal(false);
          setAgentAnalysisReport(null);
        }}
        report={agentAnalysisReport}
        isLoading={agentAnalysisLoading}
      />

      {/* AI Agents Modal */}
      <AIAgentsModal
        isOpen={showAIAgentsModal}
        onClose={() => setShowAIAgentsModal(false)}
      />
    </div>
  );
}
