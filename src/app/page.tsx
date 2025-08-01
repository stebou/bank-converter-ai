'use client'

import React, { useState, useCallback } from 'react';
import { FileText, Brain, CheckCircle, ArrowRight, Mail, Shield, Users, TrendingUp, Database, Lock, Zap, X, Download } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import { DocumentUpload } from '@/components/DocumentUpload';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/fonts.css';

// --- TYPES ---
interface Transaction {
  id: number;
  date: string;
  description: string;
  originalDesc: string;
  amount: number;
  category: string;
  subcategory: string;
  confidence: number;
  anomalyScore: number;
}

interface AnalysisResults {
  bankDetected: string;
  confidence: number;
  processingTime: number;
  aiCost: number;
  transactions: Transaction[];
  summary: {
    totalTransactions: number;
    totalDebits: number;
    totalCredits: number;
    netFlow: number;
    avgConfidence: number;
    anomaliesDetected: number;
  };
}

// --- COMPOSANTS MODERNES ---

const Navigation = ({ setIsModalOpen, setDefaultMode }: { 
  setIsModalOpen: (open: boolean) => void;
  setDefaultMode: (mode: 'signin' | 'signup') => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#ecf0f1]/95 backdrop-blur-xl border-b border-[#bdc3c7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#2c3e50] rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-[#2c3e50] font-montserrat tracking-tight">Bank-IA</div>
              <div className="text-xs text-[#34495e] font-open-sans">Financial Intelligence</div>
            </div>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-[#34495e] hover:text-[#2c3e50] font-medium transition-colors font-open-sans">Fonctionnalités</a>
            <a href="#pricing" className="text-[#34495e] hover:text-[#2c3e50] font-medium transition-colors font-open-sans">Tarifs</a>
            <a href="#enterprise" className="text-[#34495e] hover:text-[#2c3e50] font-medium transition-colors font-open-sans">Entreprise</a>
            <a href="#contact" className="text-[#34495e] hover:text-[#2c3e50] font-medium transition-colors font-open-sans">Contact</a>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-[#34495e] hover:text-[#2c3e50] font-medium transition-colors font-open-sans"
            >
              Connexion
            </button>
            <button 
              onClick={() => {
                setDefaultMode('signup');
                setIsModalOpen(true);
              }}
              className="bg-[#2c3e50] text-white px-4 py-2 rounded-lg hover:bg-[#34495e] transition-colors font-medium font-open-sans"
            >
              Essai gratuit
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = ({ setIsModalOpen, setDefaultMode }: { 
  setIsModalOpen: (open: boolean) => void;
  setDefaultMode: (mode: 'signin' | 'signup') => void;
}) => {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-[#bdc3c7] to-[#ecf0f1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Contenu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-[#ecf0f1] rounded-full border border-[#bdc3c7]">
              <Shield className="w-4 h-4 text-[#2c3e50] mr-2" />
              <span className="text-sm font-medium text-[#2c3e50] font-open-sans">Intelligence Artificielle Certifiée</span>
            </div>

            {/* Titre principal */}
            <h1 className="text-5xl lg:text-6xl font-bold text-[#2c3e50] leading-tight font-montserrat tracking-tight">
              Automatisez votre{' '}
              <span className="text-[#34495e]">comptabilité</span>{' '}
              avec l'IA
            </h1>

            <p className="text-xl text-[#34495e] leading-relaxed max-w-2xl font-open-sans">
              Transformez vos relevés bancaires en données structurées en quelques secondes. 
              Notre IA professionnelle garantit 97% de précision pour votre entreprise.
            </p>

            {/* Statistiques */}
            <div className="flex items-center space-x-8">
              <div>
                <div className="text-2xl font-bold text-[#2c3e50] font-ibm-plex-mono tracking-wider">97%</div>
                <div className="text-sm text-[#34495e] font-open-sans">Précision IA</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2c3e50] font-ibm-plex-mono tracking-wider">10k+</div>
                <div className="text-sm text-[#34495e] font-open-sans">Entreprises</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#2c3e50] font-ibm-plex-mono tracking-wider">50x</div>
                <div className="text-sm text-[#34495e] font-open-sans">Plus rapide</div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => {
                  setDefaultMode('signup');
                  setIsModalOpen(true);
                }}
                className="bg-[#2c3e50] text-white px-8 py-4 rounded-lg hover:bg-[#34495e] transition-colors font-semibold flex items-center space-x-2 font-open-sans"
              >
                <span>Démarrer l'essai gratuit</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link href="#demo" className="border border-[#bdc3c7] text-[#2c3e50] px-8 py-4 rounded-lg hover:border-[#34495e] transition-colors font-semibold font-open-sans">
                Voir la démonstration
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 pt-8 border-t border-[#bdc3c7]">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-[#2c3e50]" />
                <span className="text-sm text-[#34495e] font-open-sans">Certifié ISO 27001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-[#2c3e50]" />
                <span className="text-sm text-[#34495e] font-open-sans">Conformité RGPD</span>
              </div>
            </div>
          </motion.div>

          {/* Interface Demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-[#ecf0f1] rounded-2xl shadow-2xl border border-[#bdc3c7] overflow-hidden">
              {/* Header */}
              <div className="bg-[#bdc3c7] px-6 py-4 border-b border-[#bdc3c7]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#2c3e50] rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#2c3e50] font-montserrat tracking-wide">Analyse IA</div>
                      <div className="text-xs text-[#34495e] font-open-sans">En cours...</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#2c3e50] rounded-full animate-pulse"></div>
                    <span className="text-sm text-[#34495e] font-open-sans">97% précision</span>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Progression */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#34495e] font-open-sans">Détection automatique</span>
                      <span className="text-[#2c3e50] font-open-sans">BNP Paribas</span>
                    </div>
                    <div className="w-full bg-[#bdc3c7] rounded-full h-2">
                      <motion.div
                        className="bg-[#2c3e50] h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 2, delay: 1 }}
                      />
                    </div>
                  </div>

                  {/* Résultats */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white p-4 rounded-lg">
                      <div className="text-2xl font-bold text-[#2c3e50] font-ibm-plex-mono tracking-wider">247</div>
                      <div className="text-sm text-[#34495e] font-open-sans">Transactions</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-[#2c3e50]">
                      <div className="text-2xl font-bold text-[#2c3e50] font-ibm-plex-mono tracking-wider">2</div>
                      <div className="text-sm text-[#34495e] font-open-sans">Anomalies</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              className="absolute -top-4 -right-4 bg-[#ecf0f1] text-[#2c3e50] px-3 py-1 rounded-full text-sm font-medium border border-[#2c3e50] font-open-sans"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✓ Analyse terminée
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "IA de pointe",
      description: "Algorithmes d'apprentissage profond entraînés sur millions de documents bancaires français",
      metric: "97% précision"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Sécurité maximale",
      description: "Chiffrement AES-256, conformité RGPD, données supprimées après traitement",
      metric: "ISO 27001"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Performance",
      description: "Traitement en temps réel, API REST, intégrations natives avec vos outils",
      metric: "< 3 secondes"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Compatibilité totale",
      description: "Toutes banques françaises, formats PDF/images, catégorisation automatique",
      metric: "100+ banques"
    }
  ];

  return (
    <section id="features" className="py-20 bg-[#ecf0f1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#2c3e50] mb-4 font-montserrat tracking-tight">
            Une technologie d'exception
          </h2>
          <p className="text-xl text-[#34495e] max-w-3xl mx-auto font-open-sans">
            Notre plateforme utilise les dernières avancées en intelligence artificielle 
            pour transformer vos documents bancaires en données exploitables.
          </p>
        </motion.div>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl hover:shadow-lg transition-shadow border border-[#bdc3c7]"
            >
              <div className="text-[#2c3e50] mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-[#2c3e50] mb-3 font-montserrat tracking-wide">{feature.title}</h3>
              <p className="text-[#34495e] mb-4 leading-relaxed font-open-sans">{feature.description}</p>
              <div className="inline-flex items-center px-3 py-1 bg-[#bdc3c7] text-[#2c3e50] rounded-full text-sm font-medium font-open-sans">
                {feature.metric}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: "0",
      period: "Gratuit",
      description: "Parfait pour tester",
      features: [
        "5 documents/mois",
        "Analyse IA basique",
        "Export CSV",
        "Support communauté"
      ],
      cta: "Commencer",
      popular: false
    },
    {
      name: "Professional",
      price: "49",
      period: "/mois",
      description: "Pour les PME",
      features: [
        "100 documents/mois",
        "IA avancée 97%",
        "Détection anomalies",
        "API REST",
        "Support prioritaire"
      ],
      cta: "Essai 14 jours",
      popular: true
    },
    {
      name: "Enterprise",
      price: "149",
      period: "/mois",
      description: "Grandes organisations",
      features: [
        "Documents illimités",
        "IA personnalisée",
        "Intégrations ERP",
        "Support 24/7",
        "SLA 99.9%"
      ],
      cta: "Nous contacter",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-[#bdc3c7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#2c3e50] mb-4 font-montserrat tracking-tight">
            Tarifs transparents
          </h2>
          <p className="text-xl text-[#34495e] max-w-3xl mx-auto font-open-sans">
            Choisissez la solution adaptée à vos besoins. 
            Changez de plan à tout moment, sans engagement.
          </p>
        </motion.div>

        {/* Grille des plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-[#ecf0f1] rounded-2xl p-8 relative ${
                plan.popular 
                  ? 'ring-2 ring-[#2c3e50] shadow-xl scale-105' 
                  : 'border border-[#bdc3c7] hover:shadow-lg'
              } transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#2c3e50] text-white px-4 py-1 rounded-full text-sm font-medium font-open-sans">
                    Plus populaire
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-[#2c3e50] mb-2 font-montserrat tracking-wide">{plan.name}</h3>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-4xl font-bold text-[#2c3e50] font-ibm-plex-mono tracking-wider">{plan.price}€</span>
                  <span className="text-[#34495e] ml-1 font-open-sans">{plan.period}</span>
                </div>
                <p className="text-[#34495e] font-open-sans">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#2c3e50] mt-0.5 flex-shrink-0" />
                    <span className="text-[#34495e] font-open-sans">{feature}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors font-open-sans ${
                plan.popular
                  ? 'bg-[#2c3e50] text-white hover:bg-[#34495e]'
                  : 'bg-[#34495e] text-white hover:bg-[#2c3e50]'
              }`}>
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Garantie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center px-6 py-3 bg-[#ecf0f1] rounded-full border border-[#2c3e50]">
            <CheckCircle className="w-5 h-5 text-[#2c3e50] mr-2" />
            <span className="text-[#2c3e50] font-medium font-open-sans">Garantie 30 jours satisfait ou remboursé</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const EnterpriseSection = ({ setIsModalOpen, setDefaultMode }: { 
  setIsModalOpen: (open: boolean) => void;
  setDefaultMode: (mode: 'signin' | 'signup') => void;
}) => {
  return (
    <section id="enterprise" className="py-20 bg-[#2c3e50]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-bold text-white mb-6 font-montserrat tracking-tight">
                Solutions entreprise
              </h2>
              <p className="text-xl text-[#ecf0f1] leading-relaxed font-open-sans">
                Déployez Bank-IA à l'échelle de votre organisation avec nos solutions 
                d'intégration avancées et notre support dédié.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#34495e] p-6 rounded-xl">
                <Users className="w-8 h-8 text-[#ecf0f1] mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2 font-montserrat tracking-wide">Multi-utilisateurs</h3>
                <p className="text-[#bdc3c7] font-open-sans">Gestion centralisée des équipes et permissions granulaires</p>
              </div>
              <div className="bg-[#34495e] p-6 rounded-xl">
                <Database className="w-8 h-8 text-[#ecf0f1] mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2 font-montserrat tracking-wide">Intégrations</h3>
                <p className="text-[#bdc3c7] font-open-sans">Connectez Bank-IA à votre ERP, CRM et outils existants</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => {
                  setDefaultMode('signup');
                  setIsModalOpen(true);
                }}
                className="bg-[#ecf0f1] text-[#2c3e50] px-8 py-4 rounded-lg hover:bg-white transition-colors font-semibold text-center font-open-sans"
              >
                Demander une démo
              </button>
              <Link href="/enterprise" className="border border-[#bdc3c7] text-[#ecf0f1] px-8 py-4 rounded-lg hover:border-[#ecf0f1] transition-colors font-semibold text-center font-open-sans">
                En savoir plus
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-[#34495e] rounded-2xl p-8 border border-[#bdc3c7]">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#bdc3c7]">
                  <h3 className="text-xl font-semibold text-white font-montserrat tracking-wide">Tableau de bord</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#ecf0f1] rounded-full"></div>
                    <span className="text-sm text-[#bdc3c7] font-open-sans">Temps réel</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#2c3e50] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-white font-ibm-plex-mono tracking-wider">1,247</div>
                    <div className="text-sm text-[#bdc3c7] font-open-sans">Documents traités</div>
                    <div className="text-xs text-[#ecf0f1] mt-1 font-open-sans">+12% ce mois</div>
                  </div>
                  <div className="bg-[#2c3e50] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-white font-ibm-plex-mono tracking-wider">97.8%</div>
                    <div className="text-sm text-[#bdc3c7] font-open-sans">Précision moyenne</div>
                    <div className="text-xs text-[#ecf0f1] mt-1 font-open-sans">SLA respecté</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#bdc3c7] font-open-sans">Équipe Finance</span>
                    <span className="text-white font-ibm-plex-mono tracking-wider">856 docs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#bdc3c7] font-open-sans">Équipe Comptabilité</span>
                    <span className="text-white font-ibm-plex-mono tracking-wider">391 docs</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#ecf0f1] border-t border-[#bdc3c7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-[#2c3e50] rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-[#2c3e50] font-montserrat tracking-tight">Bank-IA</div>
                <div className="text-sm text-[#34495e] font-open-sans">Financial Intelligence</div>
              </div>
            </div>
            <p className="text-[#34495e] mb-6 max-w-md font-open-sans">
              La première solution d'intelligence artificielle dédiée à l'automatisation 
              de la comptabilité d'entreprise.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-[#bdc3c7] rounded-lg flex items-center justify-center text-[#2c3e50] hover:bg-white hover:text-[#2c3e50] transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Liens produit */}
          <div>
            <h3 className="font-semibold text-[#2c3e50] mb-4 font-montserrat tracking-wide">Produit</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-[#34495e] hover:text-[#2c3e50] transition-colors font-open-sans">Fonctionnalités</a></li>
              <li><a href="#pricing" className="text-[#34495e] hover:text-[#2c3e50] transition-colors font-open-sans">Tarifs</a></li>
              <li><a href="#enterprise" className="text-[#34495e] hover:text-[#2c3e50] transition-colors font-open-sans">Entreprise</a></li>
              <li><a href="#security" className="text-[#34495e] hover:text-[#2c3e50] transition-colors font-open-sans">Sécurité</a></li>
            </ul>
          </div>

          {/* Liens support */}
          <div>
            <h3 className="font-semibold text-[#2c3e50] mb-4 font-montserrat tracking-wide">Support</h3>
            <ul className="space-y-3">
              <li><a href="#help" className="text-[#34495e] hover:text-[#2c3e50] transition-colors font-open-sans">Centre d'aide</a></li>
              <li><a href="#contact" className="text-[#34495e] hover:text-[#2c3e50] transition-colors font-open-sans">Contact</a></li>
              <li><a href="#status" className="text-[#34495e] hover:text-[#2c3e50] transition-colors font-open-sans">Statut</a></li>
              <li><Link href="/privacy-policy" className="text-[#34495e] hover:text-[#2c3e50] transition-colors font-open-sans">Confidentialité</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#bdc3c7] mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#34495e] text-sm font-open-sans">
            © 2024 Bank-IA. Tous droits réservés.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#2c3e50]" />
              <span className="text-sm text-[#34495e] font-open-sans">ISO 27001</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-[#2c3e50]" />
              <span className="text-sm text-[#34495e] font-open-sans">RGPD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- COMPOSANT PRINCIPAL ---
const BankStatementConverter = () => {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [credits, setCredits] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [defaultMode, setDefaultMode] = useState<'signin' | 'signup'>('signin');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCredits = localStorage.getItem('anonymousUserCredits');
      if (savedCredits !== null) {
        setCredits(parseInt(savedCredits, 10));
      }
    }
  }, []);

  const handleProcessingStart = useCallback(() => {
    setIsProcessing(true);
    setProcessingStep('Analyse IA en cours...');
  }, []);

  const handleProcessingUpdate = useCallback((step: string) => {
    setProcessingStep(step);
  }, []);

  const handleDocumentSuccess = useCallback((documentData: any) => {
    setIsProcessing(false);
    setProcessingStep('');
    // ... logique de traitement des résultats
  }, [credits]);

  return (
    <div className="min-h-screen bg-[#ecf0f1]">
      <Navigation setIsModalOpen={setIsModalOpen} setDefaultMode={setDefaultMode} />
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultMode={defaultMode} />
      
      <main>
        <HeroSection setIsModalOpen={setIsModalOpen} setDefaultMode={setDefaultMode} />
        <FeaturesSection />
        <PricingSection />
        <EnterpriseSection setIsModalOpen={setIsModalOpen} setDefaultMode={setDefaultMode} />
      </main>
      
      <Footer />
    </div>
  );
};

export default BankStatementConverter;