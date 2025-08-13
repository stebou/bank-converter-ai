'use client';

import { useBankingData } from '@/hooks/useBanking';
import { useBankingAnalytics } from '@/hooks/useBankingAnalytics';
import { useCompanyAccountStatus } from '@/hooks/useCompanyAccountStatus';
import { useGlobalBankingAnalysis } from '@/hooks/useGlobalBankingAnalysis';
import type { BankAccountType } from '@/types';
import { useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Bot,
    Building2,
    DollarSign,
    Loader2,
    Package,
    Plus,
    RefreshCw,
    Sparkles,
    TrendingDown,
    TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import '../styles/fonts.css';
import AgentAnalysisModal from './AgentAnalysisModal';
import BankingDocumentsBox from './BankingDocumentsBox';
import BankingDocumentUpload from './BankingDocumentUpload';
import ConnectCompanyAccount from './ConnectCompanyAccount';
import DocumentAnalysisModal from './DocumentAnalysisModal';
import StockModal from './StockModal';
import SubscriptionBadge from './SubscriptionBadge';
import TransactionsModal from './TransactionsModal';

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
        // Pour de très gros montants, utiliser une notation plus compacte
        if (Math.abs(val) >= 1000000) {
          return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            notation: 'compact',
            maximumFractionDigits: 1,
          }).format(val);
        }
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 2,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        // Pour les nombres, utiliser aussi la notation compacte si nécessaire
        if (Math.abs(val) >= 10000) {
          return new Intl.NumberFormat('fr-FR', {
            notation: 'compact',
            maximumFractionDigits: 1,
          }).format(val);
        }
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
      <div className="flex min-h-[140px] items-start justify-between">
        <div className="flex flex-1 items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#2c3e50] shadow-lg">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-montserrat mb-3 text-sm font-medium text-[#34495e] leading-relaxed">
              {title}
            </p>
            <p className="font-montserrat break-words text-lg font-bold tracking-tight text-[#2c3e50] lg:text-xl xl:text-2xl leading-tight">
              {formatValue(value)}
            </p>
          </div>
        </div>

        {change !== undefined && (
          <div
            className={`flex items-center gap-1 ${getTrendColor()} ml-2 flex-shrink-0 mt-1`}
          >
            {getTrendIcon()}
            <span className="font-open-sans text-xs sm:text-sm font-medium whitespace-nowrap">
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
  const { hasConnectedAccount, accountsCount, refreshStatus: refreshAccountStatus } = useCompanyAccountStatus();
  const { analytics, loading: analyticsLoading, refreshAnalytics } = useBankingAnalytics('1y');
  const { 
    report: analysisReport, 
    isLoading: analysisLoading, 
    error: analysisError,
    startAnalysis,
    clearReport 
  } = useGlobalBankingAnalysis();
  
  // Forcer rafraîchissement analytics quand les comptes sont chargés
  useEffect(() => {
    if (accounts?.length > 0 && !analyticsLoading && !analytics) {
      refreshAnalytics();
    }
  }, [accounts, analyticsLoading, analytics, refreshAnalytics]);
  
  // États pour les modales
  const [selectedAnalysisDocument, setSelectedAnalysisDocument] = useState<string | null>(null);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccountType | null>(null);
  const [showAgentAnalysisModal, setShowAgentAnalysisModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  // Calculs des KPIs avec vraies données et changements
  const calculateKPIs = () => {
    // Si pas de comptes connectés, retourner des valeurs par défaut
    if (!accounts.length) {
      return {
        totalBalance: 0,
        monthlyRevenue: 0,
        monthlyExpenses: 0,
        transactionCount: 0,
        revenueChange: 0,
        expensesChange: 0,
        transactionsChange: 0,
        balanceChange: 0,
      };
    }

    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    
    // Si les analytics ne sont pas encore chargées, utiliser les données de base
    if (!analytics) {
      return {
        totalBalance,
        monthlyRevenue: 0,
        monthlyExpenses: 0,
        transactionCount: transactions.length,
        revenueChange: 0,
        expensesChange: 0,
        transactionsChange: 0,
        balanceChange: 0,
      };
    }
    
    // Utiliser les données analytics pour les revenus et dépenses du mois
    const monthlyRevenue = analytics.totalIncome;
    const monthlyExpenses = analytics.totalExpenses;
    const transactionCount = analytics.transactionCount;

    // Calculer les changements par rapport au mois précédent
    const monthlyTrendEntries = Object.entries(analytics.monthlyTrend).sort();
    let revenueChange = 0;
    let expensesChange = 0;
    let transactionsChange = 0;

    if (monthlyTrendEntries.length >= 2) {
      const currentMonth = monthlyTrendEntries[monthlyTrendEntries.length - 1][1];
      const previousMonth = monthlyTrendEntries[monthlyTrendEntries.length - 2][1];

      // Calculer le changement en pourcentage
      if (previousMonth.income > 0) {
        revenueChange = ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100;
      }
      if (previousMonth.expenses > 0) {
        expensesChange = ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100;
      }

      // Pour les transactions, on estime basé sur la variation des montants
      const currentTotal = currentMonth.income + currentMonth.expenses;
      const previousTotal = previousMonth.income + previousMonth.expenses;
      if (previousTotal > 0) {
        transactionsChange = ((currentTotal - previousTotal) / previousTotal) * 100;
      }
    }

    // Simuler un changement de balance (on peut l'améliorer avec des données historiques)
    const balanceChange = (monthlyRevenue - monthlyExpenses) / totalBalance * 100;

    return {
      totalBalance,
      monthlyRevenue,
      monthlyExpenses,
      transactionCount,
      revenueChange,
      expensesChange,
      transactionsChange,
      balanceChange: isFinite(balanceChange) ? balanceChange : 0,
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
          
          <motion.button
            onClick={() => router.push('/dashboard/bridge-demo')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-300 font-open-sans"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Building2 className="h-4 w-4" />
            Comptes Pro (Bridge)
          </motion.button>
          
          <SubscriptionBadge 
            currentPlan={subscriptionData.currentPlan}
            subscriptionStatus={subscriptionData.subscriptionStatus}
          />
          <motion.button
            onClick={() => {
              refreshData();
              refreshAnalytics();
            }}
            className="p-3 bg-[#2c3e50] text-white rounded-xl hover:bg-[#34495e] hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading || analyticsLoading}
          >
            {loading || analyticsLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <RefreshCw className="h-5 w-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* KPIs Grid ou invitation à connecter un compte société */}
      {hasConnectedAccount ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Solde Total"
            value={kpis.totalBalance}
            icon={DollarSign}
            trend={kpis.balanceChange > 0 ? 'up' : kpis.balanceChange < 0 ? 'down' : 'neutral'}
            change={kpis.balanceChange}
            format="currency"
          />
          <KPICard
            title="Revenus"
            value={kpis.monthlyRevenue}
            icon={TrendingUp}
            trend={kpis.revenueChange > 0 ? 'up' : kpis.revenueChange < 0 ? 'down' : 'neutral'}
            change={kpis.revenueChange}
            format="currency"
          />
          <KPICard
            title="Dépenses"
            value={kpis.monthlyExpenses}
            icon={TrendingDown}
            trend={kpis.expensesChange > 0 ? 'up' : kpis.expensesChange < 0 ? 'down' : 'neutral'}
            change={kpis.expensesChange}
            format="currency"
          />
          <KPICard
            title="Transactions"
            value={kpis.transactionCount}
            icon={BarChart3}
            trend={kpis.transactionsChange > 0 ? 'up' : kpis.transactionsChange < 0 ? 'down' : 'neutral'}
            change={kpis.transactionsChange}
            format="number"
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 text-center shadow-xl"
        >
          <div className="max-w-md mx-auto">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-600 rounded-full">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#2c3e50] mb-3 font-montserrat">
              Connectez le compte de votre société
            </h3>
            <p className="text-[#7f8c8d] mb-6 font-open-sans">
              Synchronisez automatiquement vos données bancaires professionnelles 
              pour une gestion financière complète et en temps réel.
            </p>
            <ConnectCompanyAccount 
              onSuccess={() => {
                refreshAccountStatus();
                refreshData();
              }}
            />
          </div>
        </motion.div>
      )}

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
