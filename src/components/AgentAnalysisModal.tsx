'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bot, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Target, 
  Clock,
  ArrowRight,
  BarChart3,
  DollarSign,
  Activity,
  Shield,
  Lightbulb,
  Users
} from 'lucide-react';
import { BusinessInsightReport } from '@/lib/ai-agents';

interface AgentAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: BusinessInsightReport | null;
  isLoading: boolean;
}

const AgentAnalysisModal: React.FC<AgentAnalysisModalProps> = ({
  isOpen,
  onClose,
  report,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'insights' | 'recommendations'>('overview');

  if (!isOpen) return null;

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'declining': return <TrendingDown className="w-5 h-5 text-red-500" />;
      default: return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-yellow-600 bg-yellow-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <Bot className="w-16 h-16 text-[#2c3e50] mb-4" />
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      <h3 className="text-xl font-semibold text-[#2c3e50] mb-2 font-montserrat">
        Analyse en cours...
      </h3>
      <p className="text-[#34495e] text-center max-w-md font-open-sans">
        Nos agents IA analysent vos données financières pour générer des insights personnalisés.
      </p>
      <div className="mt-6 flex space-x-2">
        {[1, 2, 3, 4].map((step) => (
          <motion.div
            key={step}
            className="w-3 h-3 bg-blue-500 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              delay: step * 0.3 
            }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] w-full max-w-6xl max-h-[90vh] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-[#bdc3c7]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#2c3e50] rounded-xl">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-montserrat text-[#2c3e50]">
                    Analyse Agentique
                  </h2>
                  <p className="text-[#34495e] font-open-sans">
                    Insights générés par intelligence artificielle
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-[#34495e] hover:text-[#2c3e50] transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : report ? (
            <>
              {/* Navigation Tabs */}
              <div className="border-b border-[#bdc3c7]">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
                    { id: 'metrics', label: 'Métriques', icon: DollarSign },
                    { id: 'insights', label: 'Insights', icon: Lightbulb },
                    { id: 'recommendations', label: 'Recommandations', icon: Target }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium font-open-sans transition-colors ${
                        activeTab === tab.id
                          ? 'border-[#2c3e50] text-[#2c3e50]'
                          : 'border-transparent text-[#34495e] hover:text-[#2c3e50]'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto bg-[#bdc3c7]">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Company Health Score */}
                    <div className="bg-[#ecf0f1] rounded-xl border border-[#bdc3c7] p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-[#2c3e50] font-montserrat">
                          Santé Financière
                        </h3>
                        <div className={`px-4 py-2 rounded-xl border font-semibold font-montserrat ${getHealthColor(report.companyHealth.score)}`}>
                          {report.companyHealth.score}/100
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-[#bdc3c7] shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            {getTrendIcon(report.companyHealth.trend)}
                            <span className="font-medium text-[#2c3e50] font-montserrat">Tendance</span>
                          </div>
                          <p className="text-[#34495e] capitalize font-open-sans">{report.companyHealth.trend}</p>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl border border-[#bdc3c7] shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-5 h-5 text-orange-500" />
                            <span className="font-medium text-[#2c3e50] font-montserrat">Niveau de Risque</span>
                          </div>
                          <span className={`px-2 py-1 rounded-xl text-sm font-medium capitalize font-open-sans ${getRiskColor(report.companyHealth.riskLevel)}`}>
                            {report.companyHealth.riskLevel}
                          </span>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl border border-[#bdc3c7] shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="w-5 h-5 text-green-500" />
                            <span className="font-medium text-[#2c3e50] font-montserrat">Cash Flow</span>
                          </div>
                          <p className="text-[#34495e] font-open-sans">
                            {report.financialMetrics.cashFlow > 0 ? '+' : ''}
                            {report.financialMetrics.cashFlow.toLocaleString()}€
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Executive Summary */}
                    <div className="bg-white border border-[#bdc3c7] rounded-xl p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-[#2c3e50] mb-3 font-montserrat">
                        Résumé Exécutif
                      </h3>
                      <p className="text-[#34495e] leading-relaxed font-open-sans">
                        {report.summary}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'metrics' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { 
                        label: 'Cash Flow', 
                        value: `${report.financialMetrics.cashFlow.toLocaleString()}€`,
                        icon: DollarSign,
                        color: report.financialMetrics.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'
                      },
                      { 
                        label: 'Croissance Mensuelle', 
                        value: `${report.financialMetrics.monthlyGrowth.toFixed(1)}%`,
                        icon: TrendingUp,
                        color: report.financialMetrics.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                      },
                      { 
                        label: 'Ratio de Dépenses', 
                        value: `${report.financialMetrics.expenseRatio.toFixed(1)}%`,
                        icon: BarChart3,
                        color: 'text-blue-600'
                      },
                      { 
                        label: 'Marge Bénéficiaire', 
                        value: `${report.financialMetrics.profitMargin.toFixed(1)}%`,
                        icon: Target,
                        color: report.financialMetrics.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'
                      }
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        className="bg-white border border-[#bdc3c7] rounded-xl p-6 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <metric.icon className={`w-5 h-5 ${metric.color}`} />
                          <h3 className="font-semibold text-[#2c3e50] font-montserrat">
                            {metric.label}
                          </h3>
                        </div>
                        <p className={`text-2xl font-bold ${metric.color} font-montserrat`}>
                          {metric.value}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'insights' && (
                  <div className="space-y-6">
                    {/* Strengths */}
                    <div className="bg-[#ecf0f1] border border-[#bdc3c7] rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <h3 className="text-lg font-semibold text-[#2c3e50] font-montserrat">
                          Points Forts
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {report.insights.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2 text-[#34495e] font-open-sans">
                            <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Concerns */}
                    <div className="bg-[#ecf0f1] border border-[#bdc3c7] rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                        <h3 className="text-lg font-semibold text-[#2c3e50] font-montserrat">
                          Points d'Attention
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {report.insights.concerns.map((concern, index) => (
                          <li key={index} className="flex items-start gap-2 text-[#34495e] font-open-sans">
                            <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600" />
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Opportunities */}
                    <div className="bg-[#ecf0f1] border border-[#bdc3c7] rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-semibold text-[#2c3e50] font-montserrat">
                          Opportunités
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {report.insights.opportunities.map((opportunity, index) => (
                          <li key={index} className="flex items-start gap-2 text-[#34495e] font-open-sans">
                            <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'recommendations' && (
                  <div className="space-y-4">
                    {report.recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        className="bg-white border border-[#bdc3c7] rounded-xl p-6 shadow-sm"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-xl text-xs font-medium border font-open-sans ${getPriorityColor(rec.priority)}`}>
                              {rec.priority.toUpperCase()}
                            </span>
                            <Clock className="w-4 h-4 text-[#34495e]" />
                            <span className="text-sm text-[#34495e] font-open-sans">{rec.timeline}</span>
                          </div>
                        </div>
                        
                        <h4 className="font-semibold text-[#2c3e50] mb-2 font-montserrat">
                          {rec.action}
                        </h4>
                        
                        <p className="text-[#34495e] mb-3 font-open-sans">
                          <strong>Impact attendu:</strong> {rec.impact}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <AlertTriangle className="w-16 h-16 text-[#bdc3c7] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#34495e] mb-2 font-montserrat">
                Aucune analyse disponible
              </h3>
              <p className="text-[#34495e] font-open-sans">
                Veuillez lancer une nouvelle analyse pour voir les résultats.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AgentAnalysisModal;