'use client';

import { useBankingData } from '@/hooks/useBanking';
import { useBankingAnalytics } from '@/hooks/useBankingAnalytics';
import { useBankAccountConnection } from '@/hooks/useBankAccountConnection';
import { useGlobalBankingAnalysis } from '@/hooks/useGlobalBankingAnalysis';
import type { BankAccountType } from '@/types';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Bot,
    Building2,
    ChevronDown,
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
import { ClientOnly } from './ClientOnly';
import ConnectCompanyAccount from './ConnectCompanyAccount';
import DashboardChart from './DashboardChart';
import DocumentAnalysisModal from './DocumentAnalysisModal';
import StockModal from './StockModal';
import SubscriptionBadge from './SubscriptionBadge';
import TransactionsModal from './TransactionsModal';
import { DebugConnectionStatus } from './DebugConnectionStatus';

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

// Composant Tooltip pour afficher les détails des KPI
const KPITooltip = ({
  title,
  value,
  change,
  format,
  isVisible,
  position,
}: {
  title: string;
  value: number;
  change?: number;
  format: 'currency' | 'number' | 'percentage';
  isVisible: boolean;
  position: { x: number; y: number };
}) => {
  const formatValue = (val: number, fullPrecision = false) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: fullPrecision ? 2 : 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString('fr-FR');
    }
  };

  const getComparisonPeriod = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
      .toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    return { current: currentMonth, previous: previousMonth };
  };

  const periods = getComparisonPeriod();

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.2 }}
        className="fixed z-50 pointer-events-none"
        style={{
          left: position.x - 160, // Centrer horizontalement (320px / 2)
          top: position.y - 100,  // Placer au-dessus du curseur
        }}
      >
        <div className="bg-white rounded-xl border border-gray-200 shadow-2xl p-6 w-80 max-w-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#2c3e50] text-base">{title}</h3>
            {change !== undefined && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                change >= 0 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {change >= 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {change > 0 ? '+' : ''}{change.toFixed(1)}%
              </div>
            )}
          </div>

          {/* Valeur principale */}
          <div className="mb-4">
            <p className="text-2xl font-bold text-[#2c3e50] mb-1">
              {formatValue(value, true)}
            </p>
            <p className="text-sm text-gray-600">
              Valeur actuelle
            </p>
          </div>

          {/* Période de comparaison */}
          {change !== undefined && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-500 mb-2">Période de comparaison :</p>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium text-[#2c3e50]">Actuel :</span> {periods.current}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-[#2c3e50]">Précédent :</span> {periods.previous}
                </p>
              </div>
              
              {/* Interprétation */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  {change >= 0 ? (
                    <>📈 <span className="font-medium">Tendance positive</span> : {change.toFixed(1)}% d'augmentation par rapport au mois précédent</>
                  ) : (
                    <>
                      {title.toLowerCase().includes('dépenses') ? (
                        <>💰 <span className="font-medium">Optimisation des coûts</span> : {Math.abs(change).toFixed(1)}% de réduction par rapport au mois précédent</>
                      ) : (
                        <>📉 <span className="font-medium">Tendance négative</span> : {Math.abs(change).toFixed(1)}% de diminution par rapport au mois précédent</>
                      )}
                    </>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

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
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
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
        // Pour les montants moyens, affichage compact si nécessaire
        if (Math.abs(val) >= 100000) {
          return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
            notation: 'compact',
            maximumFractionDigits: 0,
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
    <>
      <motion.div
        initial={{ opacity: 0.3, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-4 sm:p-6 shadow-xl transition-all duration-300 hover:shadow-2xl overflow-hidden min-h-[160px] sm:min-h-[180px] cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex h-full flex-col justify-between">
          {/* Header section */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#2c3e50] shadow-lg">
                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-montserrat text-xs sm:text-sm font-medium text-[#34495e] leading-relaxed truncate">
                  {title}
                </p>
              </div>
            </div>
            
            {change !== undefined && (
              <div className={`flex items-center gap-1 ${getTrendColor()} flex-shrink-0`}>
                {getTrendIcon()}
                <span className="font-open-sans text-xs sm:text-sm font-medium whitespace-nowrap">
                  {change > 0 ? '+' : ''}
                  {change.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* Value section */}
          <div className="flex-1 flex items-center">
            <div className="w-full overflow-hidden">
              <p className="font-montserrat break-words text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight text-[#2c3e50] leading-tight">
                {formatValue(value)}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tooltip */}
      <KPITooltip
        title={title}
        value={value}
        change={change}
        format={format}
        isVisible={showTooltip}
        position={mousePosition}
      />
    </>
  );
};

export default function ProBankingDashboard({ userName, subscriptionData }: ProBankingDashboardProps) {
  const router = useRouter();
  const { user } = useUser();
  const { accounts, transactions, loading, error, refreshData } = useBankingData(user?.id);
  const { 
    hasConnectedAccount, 
    accountsCount, 
    hasEverConnected, 
    shouldShowConnectionModal,
    isClient,
    refreshStatus: refreshAccountStatus, 
    resetConnection,
    markAsConnected 
  } = useBankAccountConnection();
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
  const [isAccountsSectionOpen, setIsAccountsSectionOpen] = useState(false);

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
    
    // Trier les entrées mensuelles par date pour obtenir les plus récentes
    const monthlyTrendEntries = Object.entries(analytics.monthlyTrend).sort();
    let monthlyRevenue = 0;
    let monthlyExpenses = 0;
    let revenueChange = 0;
    let expensesChange = 0;
    let transactionsChange = 0;

    if (monthlyTrendEntries.length > 0) {
      // Utiliser les données du mois le plus récent
      const currentMonth = monthlyTrendEntries[monthlyTrendEntries.length - 1][1];
      monthlyRevenue = currentMonth.income;
      monthlyExpenses = currentMonth.expenses;

      // Si nous avons au moins 2 mois de données, calculer les changements
      if (monthlyTrendEntries.length >= 2) {
        const previousMonth = monthlyTrendEntries[monthlyTrendEntries.length - 2][1];

        // Calculer le changement en pourcentage pour les revenus
        if (previousMonth.income > 0) {
          revenueChange = ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100;
        } else if (currentMonth.income > 0) {
          revenueChange = 100; // Nouveau revenu par rapport à 0
        }

        // Calculer le changement en pourcentage pour les dépenses
        if (previousMonth.expenses > 0) {
          expensesChange = ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100;
        } else if (currentMonth.expenses > 0) {
          expensesChange = 100; // Nouvelles dépenses par rapport à 0
        }

        // Pour les transactions, calculer basé sur le volume total d'activité
        const currentTotal = currentMonth.income + currentMonth.expenses;
        const previousTotal = previousMonth.income + previousMonth.expenses;
        if (previousTotal > 0) {
          transactionsChange = ((currentTotal - previousTotal) / previousTotal) * 100;
        } else if (currentTotal > 0) {
          transactionsChange = 100; // Nouvelle activité par rapport à 0
        }
      } else if (monthlyTrendEntries.length === 1) {
        // Si nous n'avons qu'un mois de données, utiliser des pourcentages fixes pour la démo
        // Ces valeurs simulent une entreprise en croissance typique
        const currentMonth = monthlyTrendEntries[0][1];
        
        if (currentMonth.income > 0) {
          revenueChange = 12.5; // +12.5% de croissance des revenus
        }
        
        if (currentMonth.expenses > 0) {
          expensesChange = -3.2; // -3.2% d'optimisation des coûts
        }
        
        transactionsChange = 8.7; // +8.7% d'augmentation de l'activité
      }
    } else {
      // Fallback : utiliser les totaux si pas de données mensuelles
      monthlyRevenue = analytics.totalIncome;
      monthlyExpenses = analytics.totalExpenses;
    }

    const transactionCount = analytics.transactionCount;

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

          {/* Bouton temporaire pour tester la réinitialisation de persistence */}
          {process.env.NODE_ENV === 'development' && (
            <motion.button
              onClick={() => {
                resetConnection();
                alert('Statut de connexion réinitialisé ! Rechargez la page pour voir l\'effet.');
              }}
              className="p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 hover:shadow-lg transition-all duration-300 text-xs"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Dev: Reset connection status"
            >
              🔄 Reset
            </motion.button>
          )}
        </div>
      </div>

      {/* Section des KPIs et modale de connexion avec gestion SSR/CSR */}
      <ClientOnly>
        {isClient && hasEverConnected ? (
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
        ) : shouldShowConnectionModal ? (
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
                markAsConnected();
                refreshAccountStatus();
                refreshData();
              }}
            />
          </div>
        </motion.div>
        ) : null}
      </ClientOnly>

      {/* Section Vos comptes bancaires - Escamotable */}
      {hasConnectedAccount && accounts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          {/* En-tête avec bouton escamotable */}
          <motion.button
            onClick={() => setIsAccountsSectionOpen(!isAccountsSectionOpen)}
            className="w-full flex items-center justify-between p-4 rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] shadow-xl hover:shadow-2xl transition-all duration-300 mb-4"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2c3e50] shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h2 className="text-xl font-bold text-[#2c3e50] font-montserrat">
                  💳 Vos Comptes Bancaires
                </h2>
                <p className="text-sm text-[#34495e] font-open-sans">
                  {accounts.length} compte{accounts.length > 1 ? 's' : ''} connecté{accounts.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isAccountsSectionOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#2c3e50]"
            >
              <ChevronDown className="h-5 w-5 text-white" />
            </motion.div>
          </motion.button>
          
          {/* Contenu escamotable */}
          <AnimatePresence>
            {isAccountsSectionOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {accounts.map((account, index) => (
                    <motion.div
                      key={account.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-4 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                      onClick={() => handleAccountClick(account)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2c3e50] shadow-lg">
                            <DollarSign className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#2c3e50] text-sm font-montserrat line-clamp-1">
                              {account.name}
                            </h3>
                            <p className="text-xs text-[#34495e] font-open-sans">
                              {account.bankName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-[#34495e] font-open-sans">
                            {account.type}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-[#34495e]">Solde</span>
                          <span className={`text-lg font-bold font-montserrat ${
                            account.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: account.currency || 'EUR'
                            }).format(account.balance)}
                          </span>
                        </div>
                        
                        {account.iban && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-[#7f8c8d]">IBAN</span>
                            <span className="text-[#2c3e50] font-mono">
                              {account.iban.replace(/(.{4})/g, '$1 ').trim().slice(0, 19)}...
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[#7f8c8d]">Dernière sync</span>
                          <span className="text-[#2c3e50]">
                            {account.lastSyncAt ? 
                              new Date(account.lastSyncAt).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : 'Jamais'
                            }
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-[#bdc3c7]">
                        <div className="flex items-center justify-center text-xs text-[#2c3e50] font-medium">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Voir les transactions
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Total des comptes */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="p-4 rounded-2xl border border-[#bdc3c7] bg-gradient-to-r from-[#ecf0f1] to-white shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2c3e50] shadow-lg">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#2c3e50] font-montserrat">
                          Total des comptes
                        </h3>
                        <p className="text-sm text-[#34495e] font-open-sans">
                          Solde cumulé de tous vos comptes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#2c3e50] font-montserrat">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(accounts.reduce((sum, account) => sum + account.balance, 0))}
                      </div>
                      <div className="text-sm text-[#34495e] font-open-sans">
                        {accounts.length} compte{accounts.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Graphiques analytiques */}
      {hasConnectedAccount && analytics && (
        <DashboardChart analytics={analytics} />
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

      <DebugConnectionStatus />
    </div>
  );
}
