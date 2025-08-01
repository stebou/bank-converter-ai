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
  Sparkles
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
import type { BusinessInsightReport } from '@/lib/ai-agents';
import '../styles/fonts.css';

// Composant pour les KPIs principaux (style 2025)
const KPICard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  trend = 'neutral',
  format = 'currency' 
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
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4" />;
      case 'down': return <ArrowDownRight className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0.3, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6 hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex items-start justify-between min-h-[120px]">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-[#2c3e50] rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium font-montserrat text-[#34495e] mb-2">{title}</p>
            <p className="text-xl lg:text-2xl font-bold font-montserrat tracking-tight text-[#2c3e50] break-words">
              {formatValue(value)}
            </p>
          </div>
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center gap-1 ${getTrendColor()} flex-shrink-0 ml-2`}>
            {getTrendIcon()}
            <span className="text-sm font-medium font-open-sans">
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
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
  agentAnalysisLoading 
}: {
  accounts: BankAccountType[];
  transactions: BankTransactionType[];
  onAgentAnalysis?: () => void;
  agentAnalysisLoading?: boolean;
}) => {
  // Simulation de données d'évolution sur 12 mois
  const generateEvolutionData = () => {
    const months = [];
    const now = new Date();
    
    // Calculer le solde de base
    const baseBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0) || 10000; // Valeur par défaut si pas de comptes
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
      
      // Simulation de l'évolution avec des valeurs garanties non-nulles
      const variation = (Math.sin(i * 0.5) * 0.1) + (Math.random() - 0.5) * 0.05; // Variation plus prévisible
      const balance = baseBalance * (1 + variation);
      
      months.push({
        month: monthName,
        balance: Math.max(balance, 1000), // Minimum 1000€
        transactions: Math.floor(Math.random() * 20) + 10
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
    <div className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold font-montserrat tracking-tight text-[#2c3e50]">Évolution des Comptes Pro</h3>
          <p className="text-sm font-open-sans text-[#34495e]">Solde total sur 12 mois</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Bouton Analyse Agentique */}
          {onAgentAnalysis && (
            <button
              onClick={onAgentAnalysis}
              disabled={agentAnalysisLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:scale-105 font-medium font-open-sans text-sm"
            >
              <Sparkles className={`w-4 h-4 ${agentAnalysisLoading ? 'animate-pulse' : ''}`} />
              {agentAnalysisLoading ? 'Analyse...' : 'Analyse agentique'}
            </button>
          )}
          
          {/* Boutons de période */}
          <div className="flex gap-2">
            <button className="px-3 py-1 text-xs font-medium font-open-sans bg-[#2c3e50] text-white rounded-xl">
              12M
            </button>
            <button className="px-3 py-1 text-xs font-medium font-open-sans text-[#34495e] hover:bg-[#ecf0f1] rounded-xl transition-colors">
              6M
            </button>
            <button className="px-3 py-1 text-xs font-medium font-open-sans text-[#34495e] hover:bg-[#ecf0f1] rounded-xl transition-colors">
              3M
            </button>
          </div>
        </div>
      </div>

      {/* Graphique simple SVG - remplacer par Chart.js en production */}
      <div className="h-64 relative">
        <svg className="w-full h-full" viewBox="0 0 800 200">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
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
            d={`M ${evolutionData.map((d, i) => {
              const x = (i * 800) / Math.max(evolutionData.length - 1, 1);
              const y = 200 - ((d.balance - safeMinBalance) / Math.max(safeMaxBalance - safeMinBalance, 1)) * 160;
              return `${x},${Math.max(20, Math.min(180, y))}`;
            }).join(' L ')}`}
            fill="none"
            stroke="#2c3e50"
            strokeWidth="3"
            className="drop-shadow-sm"
          />
          
          {/* Aire sous la courbe */}
          <path
            d={`M ${evolutionData.map((d, i) => {
              const x = (i * 800) / Math.max(evolutionData.length - 1, 1);
              const y = 200 - ((d.balance - safeMinBalance) / Math.max(safeMaxBalance - safeMinBalance, 1)) * 160;
              return `${x},${Math.max(20, Math.min(180, y))}`;
            }).join(' L ')} L 800,200 L 0,200 Z`}
            fill="url(#chartGradient)"
          />
          
          {/* Points */}
          {evolutionData.map((d, i) => {
            const x = (i * 800) / Math.max(evolutionData.length - 1, 1);
            const y = 200 - ((d.balance - safeMinBalance) / Math.max(safeMaxBalance - safeMinBalance, 1)) * 160;
            const safeX = Math.max(0, Math.min(800, x));
            const safeY = Math.max(20, Math.min(180, y));
            
            return (
              <circle
                key={i}
                cx={safeX}
                cy={safeY}
                r="4"
                fill="#2c3e50"
                className="hover:r-6 transition-all cursor-pointer"
                style={{ cursor: 'pointer' }}
              />
            );
          })}
        </svg>
        
        {/* Labels des mois */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-[#34495e] mt-2 font-open-sans">
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
          icon: '🏢'
        };
      case 'checking':
      case 'current':
        return { 
          label: 'Compte Courant', 
          color: 'bg-[#34495e] text-white',
          icon: '💳'
        };
      case 'savings':
        return { 
          label: 'Épargne', 
          color: 'bg-green-600 text-white',
          icon: '💰'
        };
      default:
        return { 
          label: type, 
          color: 'bg-[#bdc3c7] text-[#2c3e50]',
          icon: '🏦'
        };
    }
  };

  const accountInfo = getAccountTypeInfo(account.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl p-6 shadow-xl border border-[#bdc3c7] hover:shadow-2xl transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{accountInfo.icon}</span>
            <h3 className="font-semibold font-montserrat text-[#2c3e50]">{account.name}</h3>
          </div>
          <span className={`px-3 py-1 text-xs font-medium font-open-sans rounded-xl ${accountInfo.color}`}>
            {accountInfo.label}
          </span>
        </div>
        
        <div className={`w-3 h-3 rounded-full ${account.isActive ? 'bg-green-500' : 'bg-[#bdc3c7]'}`} />
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-3xl font-bold font-montserrat tracking-tight text-[#2c3e50]">
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: account.currency,
              minimumFractionDigits: 2,
            }).format(account.balance)}
          </p>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#34495e] font-open-sans">{account.bankName}</span>
          {account.lastSyncAt && (
            <span className="text-[#34495e] font-open-sans">
              Sync: {new Date(account.lastSyncAt).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
        
        {account.iban && (
          <div className="pt-2 border-t border-[#bdc3c7]">
            <p className="text-xs text-[#34495e] font-mono">
              {account.iban.substring(0, 8)}****{account.iban.substring(account.iban.length - 4)}
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
export default function ProBankingDashboard({ userName, subscriptionData }: ProBankingDashboardProps = {}) {
  const { user } = useUser();
  const { 
    accounts, 
    transactions, 
    analytics, 
    loading, 
    error, 
    syncing, 
    syncData, 
    refreshData 
  } = useBankingData(user?.id);

  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showTransactionsModal, setShowTransactionsModal] = useState(false);
  const [showAgentAnalysisModal, setShowAgentAnalysisModal] = useState(false);
  const [agentAnalysisReport, setAgentAnalysisReport] = useState<BusinessInsightReport | null>(null);
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
        throw new Error(errorData.details || 'Erreur lors de l\'analyse agentique');
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
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Calcul des KPIs pour entreprise - filtrer seulement les comptes pro
  const businessAccounts = accounts.filter(acc => 
    acc.type.toLowerCase().includes('business') || 
    acc.type.toLowerCase().includes('professional') ||
    acc.name.toLowerCase().includes('pro') ||
    acc.name.toLowerCase().includes('entreprise') ||
    acc.name.toLowerCase().includes('société')
  );
  const totalBalance = businessAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyIncome = analytics?.totalIncome || 0;
  const monthlyExpenses = Math.abs(analytics?.totalExpenses || 0);
  const cashFlow = monthlyIncome - monthlyExpenses;

  return (
    <div className="min-h-screen bg-[#bdc3c7]">
      <div className="p-8 space-y-8">
        {/* Header professionnel */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold font-montserrat tracking-tight text-[#2c3e50]">
                Dashboard Financier Pro
              </h1>
              {subscriptionData && (
                <SubscriptionBadge 
                  currentPlan={subscriptionData.currentPlan}
                  subscriptionStatus={subscriptionData.subscriptionStatus}
                />
              )}
            </div>
            <p className="text-[#34495e] font-open-sans">
              Gestion et suivi des comptes société • {businessAccounts.length} compte{businessAccounts.length > 1 ? 's' : ''} professionnel{businessAccounts.length > 1 ? 's' : ''}
              {userName && ` • Bienvenue ${userName}`}
            </p>
          </div>
          
          <div className="flex gap-3">
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={handleLoadTestData}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:scale-105 font-medium font-open-sans"
              >
                <DollarSign className="w-4 h-4" />
                Données Test
              </button>
            )}
            
            <button
              onClick={() => setShowTransactionsModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:scale-105 font-medium font-open-sans"
            >
              <TrendingUp className="w-4 h-4" />
              Mes transactions
            </button>
            
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-[#2c3e50] text-white rounded-xl hover:bg-[#34495e] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:scale-105 font-medium font-open-sans"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Synchronisation...' : 'Synchroniser'}
            </button>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
          />
        </div>

        {/* Comptes Pro + Documents + Upload - 3 colonnes de même taille */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Répartition des comptes pro - 1 colonne */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-[#bdc3c7] h-[400px] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#2c3e50] rounded-xl">
                <PieChart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold font-montserrat tracking-tight text-[#2c3e50]">
                  Répartition des Comptes Pro
                </h3>
                <p className="text-sm text-[#34495e] font-open-sans">
                  Distribution de la trésorerie
                </p>
              </div>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto">
              {businessAccounts.map((account, index) => {
                const percentage = totalBalance > 0 ? (account.balance / totalBalance) * 100 : 0;
                const safePercentage = Math.max(0, Math.min(100, percentage));
                
                return (
                  <div key={account.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium font-montserrat text-[#2c3e50]">
                        {account.name}
                      </span>
                      <span className="text-sm font-open-sans text-[#34495e]">
                        {safePercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-[#ecf0f1] rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full bg-gradient-to-r from-[#2c3e50] to-[#34495e]"
                        initial={{ width: 0 }}
                        animate={{ width: `${safePercentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold font-montserrat text-[#2c3e50]">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: account.currency,
                          minimumFractionDigits: 0,
                        }).format(account.balance)}
                      </p>
                      <p className="text-xs text-[#34495e] font-open-sans">{account.bankName}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Comptes Pro - Colonne 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-[#bdc3c7] h-[400px] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#2c3e50] rounded-xl">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold font-montserrat tracking-tight text-[#2c3e50]">
                  Comptes Professionnels
                </h3>
                <p className="text-sm text-[#34495e] font-open-sans">
                  {businessAccounts.length} compte{businessAccounts.length > 1 ? 's' : ''} actif{businessAccounts.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto">
              {businessAccounts.map((account, index) => (
                <ProAccountCard key={account.id} account={account} />
              ))}
            </div>
          </div>
          
          {/* Upload de documents - Colonne 3 */}
          <div className="h-[400px]">
            <BankingDocumentUpload onDocumentUploaded={handleDocumentUploaded} />
          </div>
        </div>

        {/* Ligne 3: Documents Financiers (col 1-2) + Mouvements Récents (col 3) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          {/* Documents Financiers - Colonnes 1 et 2 */}
          <div className="xl:col-span-2 h-[500px]">
            <BankingDocumentsBox onViewAnalysis={handleViewAnalysis} />
          </div>

          {/* Mouvements Récents - Colonne 3 */}
          {transactions.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-[#bdc3c7] h-[500px] flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#2c3e50] rounded-xl">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-montserrat tracking-tight text-[#2c3e50]">
                    Mouvements Récents
                  </h3>
                  <p className="text-sm text-[#34495e] font-open-sans">
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
                      className="flex items-center justify-between p-4 bg-[#ecf0f1] rounded-xl hover:bg-white transition-all duration-200 border border-transparent hover:border-[#bdc3c7] group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          transaction.type === 'credit' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <ArrowUpRight className="w-5 h-5" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5" />
                          )}
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <p className="font-medium font-montserrat text-[#2c3e50] text-sm truncate mb-1">
                            {transaction.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-[#34495e] font-open-sans">
                            <span>{new Date(transaction.transactionDate).toLocaleDateString('fr-FR')}</span>
                            {transaction.category && (
                              <>
                                <span>•</span>
                                <span className="capitalize truncate">{transaction.category}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className={`font-bold font-montserrat ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : ''}
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: transaction.currency,
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(transaction.amount)}
                        </p>
                        {transaction.account && (
                          <p className="text-xs text-[#34495e] font-open-sans truncate max-w-[80px]">
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
    </div>
  );
}