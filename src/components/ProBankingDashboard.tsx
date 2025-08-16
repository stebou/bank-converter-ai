'use client';

import { useBankAccountConnection } from '@/hooks/useBankAccountConnection';
import { useBankingData } from '@/hooks/useBanking';
import { useBankingAnalytics } from '@/hooks/useBankingAnalytics';
import { useBankingKPIs } from '@/hooks/useBankingKPIs';
import { useGlobalBankingAnalysis } from '@/hooks/useGlobalBankingAnalysis';
import type { BankAccountType } from '@/types';
import { useUser } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
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
  Settings,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import '../styles/fonts.css';
import AgentAnalysisModal from './AgentAnalysisModal';
import BankingDocumentsBox from './BankingDocumentsBox';
import BankingDocumentUpload from './BankingDocumentUpload';
import BridgeConnectOfficial from './BridgeConnectOfficial';
import { ClientOnly } from './ClientOnly';
import DashboardChart from './DashboardChart';
import { DebugConnectionStatus } from './DebugConnectionStatus';
import DocumentAnalysisModal from './DocumentAnalysisModal';
import EmptyBankAccounts from './EmptyBankAccounts';
import ManageConnectionsModal from './ManageConnectionsModal';
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
    const currentMonth = currentDate.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    });
    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    ).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
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
        className="pointer-events-none fixed z-50"
        style={{
          left: position.x - 160, // Centrer horizontalement (320px / 2)
          top: position.y - 100, // Placer au-dessus du curseur
        }}
      >
        <div className="w-80 max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-2xl">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#2c3e50]">{title}</h3>
            {change !== undefined && (
              <div
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
                  change >= 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {change >= 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {change > 0 ? '+' : ''}
                {change.toFixed(1)}%
              </div>
            )}
          </div>

          {/* Valeur principale */}
          <div className="mb-4">
            <p className="mb-1 text-2xl font-bold text-[#2c3e50]">
              {formatValue(value, true)}
            </p>
            <p className="text-sm text-gray-600">Valeur actuelle</p>
          </div>

          {/* Période de comparaison */}
          {change !== undefined && (
            <div className="border-t border-gray-100 pt-4">
              <p className="mb-2 text-xs text-gray-500">
                Période de comparaison :
              </p>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium text-[#2c3e50]">Actuel :</span>{' '}
                  {periods.current}
                </p>
                <p className="text-sm">
                  <span className="font-medium text-[#2c3e50]">
                    Précédent :
                  </span>{' '}
                  {periods.previous}
                </p>
              </div>

              {/* Interprétation */}
              <div className="mt-3 rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-600">
                  {change >= 0 ? (
                    <>
                      📈 <span className="font-medium">Tendance positive</span>{' '}
                      : {change.toFixed(1)}% d'augmentation par rapport au mois
                      précédent
                    </>
                  ) : (
                    <>
                      {title.toLowerCase().includes('dépenses') ? (
                        <>
                          💰{' '}
                          <span className="font-medium">
                            Optimisation des coûts
                          </span>{' '}
                          : {Math.abs(change).toFixed(1)}% de réduction par
                          rapport au mois précédent
                        </>
                      ) : (
                        <>
                          📉{' '}
                          <span className="font-medium">Tendance négative</span>{' '}
                          : {Math.abs(change).toFixed(1)}% de diminution par
                          rapport au mois précédent
                        </>
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
        className="min-h-[160px] cursor-pointer overflow-hidden rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-4 shadow-xl transition-all duration-300 hover:shadow-2xl sm:min-h-[180px] sm:p-6"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex h-full flex-col justify-between">
          {/* Header section */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#2c3e50] shadow-lg sm:h-12 sm:w-12">
                <Icon className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-montserrat truncate text-xs font-medium leading-relaxed text-[#34495e] sm:text-sm">
                  {title}
                </p>
              </div>
            </div>

            {change !== undefined && (
              <div
                className={`flex items-center gap-1 ${getTrendColor()} flex-shrink-0`}
              >
                {getTrendIcon()}
                <span className="font-open-sans whitespace-nowrap text-xs font-medium sm:text-sm">
                  {change > 0 ? '+' : ''}
                  {change.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          {/* Value section */}
          <div className="flex flex-1 items-center">
            <div className="w-full overflow-hidden">
              <p className="font-montserrat break-words text-lg font-bold leading-tight tracking-tight text-[#2c3e50] sm:text-xl lg:text-2xl xl:text-3xl">
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

export default function ProBankingDashboard({
  userName,
  subscriptionData,
}: ProBankingDashboardProps) {
  const router = useRouter();
  const { user } = useUser();
  const { accounts, transactions, loading, refreshData } =
    useBankingData(user?.id);
  const {
    hasConnectedAccount,
    hasEverConnected,
    shouldShowConnectionModal,
    isClient,
    refreshStatus: refreshAccountStatus,
    resetConnection,
    markAsConnected,
  } = useBankAccountConnection();
  const {
    analytics,
    loading: analyticsLoading,
    refreshAnalytics,
  } = useBankingAnalytics('1y');
  const {
    kpis,
    loading: kpisLoading,
    refreshKPIs,
  } = useBankingKPIs();
  const {
    report: analysisReport,
    isLoading: analysisLoading,
    error: analysisError,
    startAnalysis,
    clearReport,
  } = useGlobalBankingAnalysis();

  // Forcer rafraîchissement analytics et KPIs quand les comptes sont chargés
  useEffect(() => {
    if (accounts?.length > 0 && !analyticsLoading && !analytics) {
      refreshAnalytics();
    }
    if (accounts?.length > 0 && !kpisLoading && !kpis) {
      refreshKPIs();
    }
  }, [accounts, analyticsLoading, analytics, refreshAnalytics, kpisLoading, kpis, refreshKPIs]);

  // États pour les modales
  const [selectedAnalysisDocument, setSelectedAnalysisDocument] = useState<
    string | null
  >(null);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [selectedAccount, setSelectedAccount] =
    useState<BankAccountType | null>(null);
  const [showAgentAnalysisModal, setShowAgentAnalysisModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showConnectAccountModal, setShowConnectAccountModal] = useState(false);
  const [showManageConnectionsModal, setShowManageConnectionsModal] = useState(false);
  const [isAccountsSectionOpen, setIsAccountsSectionOpen] = useState(false);

  // Utiliser les KPIs calculés en temps réel ou fallback vers des valeurs par défaut
  const getKPIsData = () => {
    if (kpis) {
      return kpis;
    }

    // Fallback vers des calculs basiques si les KPIs ne sont pas encore chargés
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

    const totalBalance = accounts.reduce(
      (sum, account) => sum + account.balance,
      0
    );

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
  };

  const kpisData = getKPIsData();

  const handleAccountClick = (account: BankAccountType) => {
    setSelectedAccount(account);
    setShowTransactionsModal(true);
  };

  // Removed unused handleDocumentAnalysis function

  const handleCreateCampaign = () => {
    router.push('/dashboard/marketing/creer-campagne');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-montserrat mb-2 text-3xl font-bold tracking-tight text-[#2c3e50]">
            Bonjour {userName} 👋
          </h1>
          <p className="font-open-sans text-[#34495e]">
            Voici un aperçu de vos données bancaires
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Boutons Agents et Stock repositionnés en haut */}
          <motion.button
            onClick={() => setShowAgentAnalysisModal(true)}
            className="font-open-sans flex items-center gap-2 rounded-lg bg-[#2c3e50] px-4 py-2 text-white transition-all duration-300 hover:bg-[#34495e] hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="h-4 w-4" />
            Analyse Bancaire IA
          </motion.button>

          <motion.button
            onClick={() => setShowStockModal(true)}
            className="font-open-sans flex items-center gap-2 rounded-lg bg-[#2c3e50] px-4 py-2 text-white transition-all duration-300 hover:bg-[#34495e] hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Package className="h-4 w-4" />
            Stock Manager
          </motion.button>

          <motion.button
            onClick={handleCreateCampaign}
            className="font-open-sans flex items-center gap-2 rounded-lg bg-[#2c3e50] px-4 py-2 text-white transition-all duration-300 hover:bg-[#34495e] hover:shadow-lg"
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
              refreshKPIs();
            }}
            className="rounded-xl bg-[#2c3e50] p-3 text-white transition-all duration-300 hover:bg-[#34495e] hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading || analyticsLoading || kpisLoading}
          >
            {loading || analyticsLoading || kpisLoading ? (
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
                alert(
                  "Statut de connexion réinitialisé ! Rechargez la page pour voir l'effet."
                );
              }}
              className="rounded-xl bg-red-600 p-3 text-xs text-white transition-all duration-300 hover:bg-red-700 hover:shadow-lg"
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
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Solde Total"
              value={kpisData.totalBalance}
              icon={DollarSign}
              trend={
                kpisData.balanceChange > 0
                  ? 'up'
                  : kpisData.balanceChange < 0
                    ? 'down'
                    : 'neutral'
              }
              change={kpisData.balanceChange}
              format="currency"
            />
            <KPICard
              title="Revenus Mensuels"
              value={kpisData.monthlyRevenue}
              icon={TrendingUp}
              trend={
                kpisData.revenueChange > 0
                  ? 'up'
                  : kpisData.revenueChange < 0
                    ? 'down'
                    : 'neutral'
              }
              change={kpisData.revenueChange}
              format="currency"
            />
            <KPICard
              title="Dépenses Mensuelles"
              value={kpisData.monthlyExpenses}
              icon={TrendingDown}
              trend={
                kpisData.expensesChange > 0
                  ? 'up'
                  : kpisData.expensesChange < 0
                    ? 'down'
                    : 'neutral'
              }
              change={kpisData.expensesChange}
              format="currency"
            />
            <KPICard
              title="Transactions"
              value={kpisData.transactionCount}
              icon={BarChart3}
              trend={
                kpisData.transactionsChange > 0
                  ? 'up'
                  : kpisData.transactionsChange < 0
                    ? 'down'
                    : 'neutral'
              }
              change={kpisData.transactionsChange}
              format="number"
            />
          </div>
        ) : shouldShowConnectionModal ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center shadow-xl"
          >
            <div className="mx-auto max-w-md">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-blue-600 p-4">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="font-montserrat mb-3 text-2xl font-bold text-[#2c3e50]">
                Connectez le compte de votre société
              </h3>
              <p className="font-open-sans mb-6 text-[#7f8c8d]">
                Synchronisez automatiquement vos données bancaires
                professionnelles pour une gestion financière complète et en
                temps réel.
              </p>
              <BridgeConnectOfficial
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
          {/* En-tête avec boutons d'action */}
          <div className="mb-4 rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-4 shadow-xl">
            <div className="flex items-center justify-between">
              {/* Partie gauche : Titre et informations */}
              <motion.button
                onClick={() => setIsAccountsSectionOpen(!isAccountsSectionOpen)}
                className="flex items-center gap-3 transition-all duration-300"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2c3e50] shadow-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="font-montserrat text-xl font-bold text-[#2c3e50]">
                    💳 Vos Comptes Bancaires
                  </h2>
                  <p className="font-open-sans text-sm text-[#34495e]">
                    {accounts.length} compte{accounts.length > 1 ? 's' : ''}{' '}
                    connecté{accounts.length > 1 ? 's' : ''}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: isAccountsSectionOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-4 flex h-8 w-8 items-center justify-center rounded-lg bg-[#2c3e50]"
                >
                  <ChevronDown className="h-5 w-5 text-white" />
                </motion.div>
              </motion.button>

              {/* Partie droite : Boutons d'action */}
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={() => setShowConnectAccountModal(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#27ae60] px-4 py-2 text-white shadow-lg transition-all duration-300 hover:bg-[#229954] hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-medium">Lier nouveau compte</span>
                </motion.button>

                <motion.button
                  onClick={() => setShowManageConnectionsModal(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#e74c3c] px-4 py-2 text-white shadow-lg transition-all duration-300 hover:bg-[#c0392b] hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Gérer les comptes</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Contenu escamotable */}
          <AnimatePresence>
            {isAccountsSectionOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {accounts.map((account, index) => (
                    <motion.div
                      key={account.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="cursor-pointer rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-4 shadow-xl transition-all duration-300 hover:shadow-2xl"
                      onClick={() => handleAccountClick(account)}
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2c3e50] shadow-lg">
                            <DollarSign className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-montserrat line-clamp-1 text-sm font-semibold text-[#2c3e50]">
                              {account.name}
                            </h3>
                            <p className="font-open-sans text-xs text-[#34495e]">
                              {account.bankName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-open-sans text-xs text-[#34495e]">
                            {account.type}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#34495e]">
                            Solde
                          </span>
                          <span
                            className={`font-montserrat text-lg font-bold ${
                              account.balance >= 0
                                ? 'text-emerald-600'
                                : 'text-red-600'
                            }`}
                          >
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: account.currency || 'EUR',
                            }).format(account.balance)}
                          </span>
                        </div>

                        {account.iban && (
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#7f8c8d]">IBAN</span>
                            <span className="font-mono text-[#2c3e50]">
                              {account.iban
                                .replace(/(.{4})/g, '$1 ')
                                .trim()
                                .slice(0, 19)}
                              ...
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#7f8c8d]">Dernière sync</span>
                          <span className="text-[#2c3e50]">
                            {account.lastSyncAt
                              ? new Date(account.lastSyncAt).toLocaleDateString(
                                  'fr-FR',
                                  {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  }
                                )
                              : 'Jamais'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 border-t border-[#bdc3c7] pt-3">
                        <div className="flex items-center justify-center text-xs font-medium text-[#2c3e50]">
                          <BarChart3 className="mr-1 h-3 w-3" />
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
                  className="rounded-2xl border border-[#bdc3c7] bg-gradient-to-r from-[#ecf0f1] to-white p-4 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2c3e50] shadow-lg">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-montserrat font-semibold text-[#2c3e50]">
                          Total des comptes
                        </h3>
                        <p className="font-open-sans text-sm text-[#34495e]">
                          Solde cumulé de tous vos comptes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-montserrat text-2xl font-bold text-[#2c3e50]">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(
                          accounts.reduce(
                            (sum, account) => sum + account.balance,
                            0
                          )
                        )}
                      </div>
                      <div className="font-open-sans text-sm text-[#34495e]">
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

      {/* État vide - Première connexion */}
      {!hasConnectedAccount || accounts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <div className="overflow-hidden rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] shadow-xl">
            <EmptyBankAccounts
              onAccountConnected={() => {
                markAsConnected();
                refreshAccountStatus();
                refreshData();
              }}
            />
          </div>
        </motion.div>
      ) : null}

      {/* Graphiques analytiques */}
      {hasConnectedAccount && analytics && (
        <DashboardChart analytics={analytics} />
      )}

      {/* Actions rapides */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Upload et analyse de documents */}
        <motion.div
          className="rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-xl"
          whileHover={{ scale: 1.02 }}
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-[#2c3e50] p-2">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-montserrat font-semibold text-[#2c3e50]">
              Analyse IA
            </h3>
          </div>
          <p className="font-open-sans mb-4 text-sm text-[#34495e]">
            Analysez vos documents bancaires avec l'intelligence artificielle
          </p>
          <div className="space-y-2">
            <BankingDocumentUpload />
            <motion.button
              onClick={() => setShowAgentAnalysisModal(true)}
              className="font-open-sans flex w-full items-center justify-center gap-2 rounded-lg bg-[#2c3e50] p-3 text-white transition-all duration-300 hover:bg-[#34495e] hover:shadow-lg"
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
              console.error("Erreur lors du démarrage de l'analyse:", error);
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

      {showConnectAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <BridgeConnectOfficial
              onSuccess={() => {
                setShowConnectAccountModal(false);
                // Rafraîchir les données après connexion
                window.location.reload();
              }}
              onClose={() => setShowConnectAccountModal(false)}
            />
          </div>
        </div>
      )}

      {showManageConnectionsModal && (
        <ManageConnectionsModal
          isOpen={showManageConnectionsModal}
          onClose={() => setShowManageConnectionsModal(false)}
        />
      )}

      <DebugConnectionStatus />
    </div>
  );
}
