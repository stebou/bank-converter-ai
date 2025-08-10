'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
  Plus,
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useBankingData } from '@/hooks/useBanking';
import { useGlobalBankingAnalysis } from '@/hooks/useGlobalBankingAnalysis';
import type { BankAccountType, BankTransactionType } from '@/types';
import BankingDocumentsBox from './BankingDocumentsBox';
import BankingDocumentUpload from './BankingDocumentUpload';
import DocumentAnalysisModal from './DocumentAnalysisModal';
import TransactionsModal from './TransactionsModal';
import SubscriptionBadge from './SubscriptionBadge';
import AgentAnalysisModal from './AgentAnalysisModal';
import StockModal from './StockModal';
import '../styles/fonts.css';

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
  userName: string;
  subscriptionData: SubscriptionData;
}

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
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString('fr-FR');
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600';
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
      className="rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-xl transition-all duration-300 hover:shadow-2xl"
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

export default function ProBankingDashboard({ userName, subscriptionData }: ProBankingDashboardProps) {
  const router = useRouter();
  const { user } = useUser();
  const { accounts, transactions, loading, error, refreshData } = useBankingData(user?.id);
  const { 
    report: analysisReport, 
    isLoading: analysisLoading, 
    error: analysisError,
    startAnalysis,
    clearReport 
  } = useGlobalBankingAnalysis();
  
  // États pour les modales
  const [selectedAnalysisDocument, setSelectedAnalysisDocument] = useState<string | null>(null);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccountType | null>(null);
  const [showAgentAnalysisModal, setShowAgentAnalysisModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  // Calculs des KPIs
  const calculateKPIs = () => {
    if (!accounts.length || !transactions.length) {
      return {
        totalBalance: 0,
        monthlyRevenue: 0,
        monthlyExpenses: 0,
        transactionCount: 0,
      };
    }

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    
    // Calculs pour le mois en cours
    const currentMonth = new Date();
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    
    const monthlyTransactions = transactions.filter(t => 
      new Date(t.transactionDate) >= monthStart
    );

    const monthlyRevenue = monthlyTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      totalBalance,
      monthlyRevenue,
      monthlyExpenses,
      transactionCount: transactions.length,
    };
  };

  const kpis = calculateKPIs();

  const handleAccountClick = (account: BankAccountType) => {
    setSelectedAccount(account);
    setShowTransactionsModal(true);
  };

  const handleDocumentAnalysis = (documentId: string) => {
    setSelectedAnalysisDocument(documentId);
  };

  const handleCreateCampaign = () => {
    router.push('/dashboard/marketing/creer-campagne');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#2c3e50] mb-2 font-montserrat tracking-tight">
            Bonjour {userName} 👋
          </h1>
          <p className="text-[#34495e] font-open-sans">
            Voici un aperçu de vos données bancaires
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Boutons Agents et Stock repositionnés en haut */}
          <motion.button
            onClick={() => setShowAgentAnalysisModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2c3e50] text-white rounded-lg hover:bg-[#34495e] hover:shadow-lg transition-all duration-300 font-open-sans"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="h-4 w-4" />
            Analyse Bancaire IA
          </motion.button>
          
          <motion.button
            onClick={() => setShowStockModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#2c3e50] text-white rounded-lg hover:bg-[#34495e] hover:shadow-lg transition-all duration-300 font-open-sans"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Package className="h-4 w-4" />
            Stock Manager
          </motion.button>
          
          <motion.button
            onClick={handleCreateCampaign}
            className="flex items-center gap-2 px-4 py-2 bg-[#2c3e50] text-white rounded-lg hover:bg-[#34495e] hover:shadow-lg transition-all duration-300 font-open-sans"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="h-4 w-4" />
            Créer une campagne
          </motion.button>
          
          <SubscriptionBadge 
            currentPlan={subscriptionData.currentPlan}
            subscriptionStatus={subscriptionData.subscriptionStatus}
          />
          <motion.button
            onClick={() => refreshData()}
            className="p-3 bg-[#2c3e50] text-white rounded-xl hover:bg-[#34495e] hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <RefreshCw className="h-5 w-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard
          title="Solde Total"
          value={kpis.totalBalance}
          icon={DollarSign}
          trend="up"
          change={5.2}
          format="currency"
        />
        <KPICard
          title="Revenus Mensuels"
          value={kpis.monthlyRevenue}
          icon={TrendingUp}
          trend="up"
          change={12.5}
          format="currency"
        />
        <KPICard
          title="Dépenses Mensuelles"
          value={kpis.monthlyExpenses}
          icon={TrendingDown}
          trend="down"
          change={-3.2}
          format="currency"
        />
        <KPICard
          title="Transactions"
          value={kpis.transactionCount}
          icon={BarChart3}
          trend="neutral"
          format="number"
        />
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload et analyse de documents */}
        <motion.div
          className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#2c3e50] rounded-lg">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-[#2c3e50] font-montserrat">Analyse IA</h3>
          </div>
          <p className="text-sm text-[#34495e] mb-4 font-open-sans">
            Analysez vos documents bancaires avec l'intelligence artificielle
          </p>
          <div className="space-y-2">
            <BankingDocumentUpload />
            <motion.button
              onClick={() => setShowAgentAnalysisModal(true)}
              className="w-full p-3 bg-[#2c3e50] text-white rounded-lg hover:bg-[#34495e] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 font-open-sans"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="h-4 w-4" />
              Agents IA Bancaires
            </motion.button>
          </div>
        </motion.div>

        {/* Documents financiers - sur 2 colonnes */}
        <div className="lg:col-span-2">
          <BankingDocumentsBox />
        </div>
      </div>

      {/* Comptes bancaires */}
      {accounts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-[#2c3e50] mb-6 font-montserrat">Vos Comptes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map((account) => (
              <motion.div
                key={account.id}
                onClick={() => handleAccountClick(account)}
                className="bg-[#ecf0f1] rounded-2xl p-6 shadow-xl border border-[#bdc3c7] hover:shadow-2xl cursor-pointer transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0.3, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#2c3e50] font-montserrat">{account.name}</h3>
                    <p className="text-sm text-[#34495e] font-open-sans">{account.bankName}</p>
                    <p className="text-xs text-[#7f8c8d] font-open-sans">•••• {account.iban?.slice(-4) || 'N/A'}</p>
                  </div>
                  <div className="p-2 bg-[#2c3e50] rounded-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#34495e] font-open-sans">Solde</span>
                    <span className={`font-semibold font-montserrat ${
                      account.balance >= 0 ? 'text-[#27ae60]' : 'text-[#e74c3c]'
                    }`}>
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(account.balance)}
                    </span>
                  </div>
                  <div className="text-xs text-[#7f8c8d] font-open-sans">
                    Dernière mise à jour: {account.lastSyncAt ? new Date(account.lastSyncAt).toLocaleDateString('fr-FR') : 'Jamais'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Modales */}
      {selectedAnalysisDocument && (
        <DocumentAnalysisModal
          documentData={null}
          isOpen={!!selectedAnalysisDocument}
          onClose={() => setSelectedAnalysisDocument(null)}
        />
      )}

      {showTransactionsModal && selectedAccount && (
        <TransactionsModal
          isOpen={showTransactionsModal}
          onClose={() => {
            setShowTransactionsModal(false);
            setSelectedAccount(null);
          }}
        />
      )}

      {showAgentAnalysisModal && (
        <AgentAnalysisModal
          report={analysisReport}
          isLoading={analysisLoading}
          isOpen={showAgentAnalysisModal}
          onClose={() => {
            setShowAgentAnalysisModal(false);
            clearReport(); // Nettoyer le rapport quand on ferme
          }}
          onStartAnalysis={async () => {
            try {
              await startAnalysis();
              if (analysisError) {
                alert(`Erreur: ${analysisError}`);
              }
            } catch (error) {
              console.error('Erreur lors du démarrage de l\'analyse:', error);
            }
          }}
        />
      )}

      {showStockModal && (
        <StockModal
          isOpen={showStockModal}
          onClose={() => setShowStockModal(false)}
        />
      )}
    </div>
  );
}
