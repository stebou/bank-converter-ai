'use client';

import React, { useState, useCallback } from 'react';
import {
  Brain,
  CheckCircle,
  ArrowRight,
  Mail,
  Shield,
  Users,
  Database,
  Lock,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import { motion } from 'framer-motion';
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

const Navigation = ({
  setIsModalOpen,
  setDefaultMode,
}: {
  setIsModalOpen: (open: boolean) => void;
  setDefaultMode: (mode: 'signin' | 'signup') => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-[#bdc3c7] bg-[#ecf0f1]/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2c3e50]">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-montserrat text-xl font-bold tracking-tight text-[#2c3e50]">
                Bank-IA
              </div>
              <div className="font-open-sans text-xs text-[#34495e]">
                Financial Intelligence
              </div>
            </div>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden items-center space-x-8 md:flex">
            <a
              href="#features"
              className="font-open-sans font-medium text-[#34495e] transition-colors hover:text-[#2c3e50]"
            >
              Fonctionnalités
            </a>
            <a
              href="#pricing"
              className="font-open-sans font-medium text-[#34495e] transition-colors hover:text-[#2c3e50]"
            >
              Tarifs
            </a>
            <a
              href="#enterprise"
              className="font-open-sans font-medium text-[#34495e] transition-colors hover:text-[#2c3e50]"
            >
              Entreprise
            </a>
            <a
              href="#contact"
              className="font-open-sans font-medium text-[#34495e] transition-colors hover:text-[#2c3e50]"
            >
              Contact
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="font-open-sans font-medium text-[#34495e] transition-colors hover:text-[#2c3e50]"
            >
              Connexion
            </button>
            <button
              onClick={() => {
                setDefaultMode('signup');
                setIsModalOpen(true);
              }}
              className="font-open-sans rounded-lg bg-[#2c3e50] px-4 py-2 font-medium text-white transition-colors hover:bg-[#34495e]"
            >
              Essai gratuit
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = ({
  setIsModalOpen,
  setDefaultMode,
}: {
  setIsModalOpen: (open: boolean) => void;
  setDefaultMode: (mode: 'signin' | 'signup') => void;
}) => {
  return (
    <section className="bg-gradient-to-b from-[#bdc3c7] to-[#ecf0f1] pb-20 pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Contenu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-[#bdc3c7] bg-[#ecf0f1] px-4 py-2">
              <Shield className="mr-2 h-4 w-4 text-[#2c3e50]" />
              <span className="font-open-sans text-sm font-medium text-[#2c3e50]">
                Intelligence Artificielle Certifiée
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="font-montserrat text-5xl font-bold leading-tight tracking-tight text-[#2c3e50] lg:text-6xl">
              Automatisez votre{' '}
              <span className="text-[#34495e]">comptabilité</span> avec l'IA
            </h1>

            <p className="font-open-sans max-w-2xl text-xl leading-relaxed text-[#34495e]">
              Transformez vos relevés bancaires en données structurées en
              quelques secondes. Notre IA professionnelle garantit 97% de
              précision pour votre entreprise.
            </p>

            {/* Statistiques */}
            <div className="flex items-center space-x-8">
              <div>
                <div className="font-ibm-plex-mono text-2xl font-bold tracking-wider text-[#2c3e50]">
                  97%
                </div>
                <div className="font-open-sans text-sm text-[#34495e]">
                  Précision IA
                </div>
              </div>
              <div>
                <div className="font-ibm-plex-mono text-2xl font-bold tracking-wider text-[#2c3e50]">
                  10k+
                </div>
                <div className="font-open-sans text-sm text-[#34495e]">
                  Entreprises
                </div>
              </div>
              <div>
                <div className="font-ibm-plex-mono text-2xl font-bold tracking-wider text-[#2c3e50]">
                  50x
                </div>
                <div className="font-open-sans text-sm text-[#34495e]">
                  Plus rapide
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
              <button
                onClick={() => {
                  setDefaultMode('signup');
                  setIsModalOpen(true);
                }}
                className="font-open-sans flex items-center space-x-2 rounded-lg bg-[#2c3e50] px-8 py-4 font-semibold text-white transition-colors hover:bg-[#34495e]"
              >
                <span>Démarrer l'essai gratuit</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <Link
                href="#demo"
                className="font-open-sans rounded-lg border border-[#bdc3c7] px-8 py-4 font-semibold text-[#2c3e50] transition-colors hover:border-[#34495e]"
              >
                Voir la démonstration
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center space-x-6 border-t border-[#bdc3c7] pt-8">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-[#2c3e50]" />
                <span className="font-open-sans text-sm text-[#34495e]">
                  Certifié ISO 27001
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-[#2c3e50]" />
                <span className="font-open-sans text-sm text-[#34495e]">
                  Conformité RGPD
                </span>
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
            <div className="overflow-hidden rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] shadow-2xl">
              {/* Header */}
              <div className="border-b border-[#bdc3c7] bg-[#bdc3c7] px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2c3e50]">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-montserrat font-semibold tracking-wide text-[#2c3e50]">
                        Analyse IA
                      </div>
                      <div className="font-open-sans text-xs text-[#34495e]">
                        En cours...
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-[#2c3e50]"></div>
                    <span className="font-open-sans text-sm text-[#34495e]">
                      97% précision
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Progression */}
                  <div>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-open-sans text-[#34495e]">
                        Détection automatique
                      </span>
                      <span className="font-open-sans text-[#2c3e50]">
                        BNP Paribas
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#bdc3c7]">
                      <motion.div
                        className="h-2 rounded-full bg-[#2c3e50]"
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 2, delay: 1 }}
                      />
                    </div>
                  </div>

                  {/* Résultats */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-white p-4">
                      <div className="font-ibm-plex-mono text-2xl font-bold tracking-wider text-[#2c3e50]">
                        247
                      </div>
                      <div className="font-open-sans text-sm text-[#34495e]">
                        Transactions
                      </div>
                    </div>
                    <div className="rounded-lg border border-[#2c3e50] bg-white p-4">
                      <div className="font-ibm-plex-mono text-2xl font-bold tracking-wider text-[#2c3e50]">
                        2
                      </div>
                      <div className="font-open-sans text-sm text-[#34495e]">
                        Anomalies
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              className="font-open-sans absolute -right-4 -top-4 rounded-full border border-[#2c3e50] bg-[#ecf0f1] px-3 py-1 text-sm font-medium text-[#2c3e50]"
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
      icon: <Brain className="h-8 w-8" />,
      title: 'IA de pointe',
      description:
        "Algorithmes d'apprentissage profond entraînés sur millions de documents bancaires français",
      metric: '97% précision',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Sécurité maximale',
      description:
        'Chiffrement AES-256, conformité RGPD, données supprimées après traitement',
      metric: 'ISO 27001',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Performance',
      description:
        'Traitement en temps réel, API REST, intégrations natives avec vos outils',
      metric: '< 3 secondes',
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: 'Compatibilité totale',
      description:
        'Toutes banques françaises, formats PDF/images, catégorisation automatique',
      metric: '100+ banques',
    },
  ];

  return (
    <section id="features" className="bg-[#ecf0f1] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-montserrat mb-4 text-4xl font-bold tracking-tight text-[#2c3e50]">
            Une technologie d'exception
          </h2>
          <p className="font-open-sans mx-auto max-w-3xl text-xl text-[#34495e]">
            Notre plateforme utilise les dernières avancées en intelligence
            artificielle pour transformer vos documents bancaires en données
            exploitables.
          </p>
        </motion.div>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-[#bdc3c7] bg-white p-8 transition-shadow hover:shadow-lg"
            >
              <div className="mb-6 text-[#2c3e50]">{feature.icon}</div>
              <h3 className="font-montserrat mb-3 text-xl font-bold tracking-wide text-[#2c3e50]">
                {feature.title}
              </h3>
              <p className="font-open-sans mb-4 leading-relaxed text-[#34495e]">
                {feature.description}
              </p>
              <div className="font-open-sans inline-flex items-center rounded-full bg-[#bdc3c7] px-3 py-1 text-sm font-medium text-[#2c3e50]">
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
      name: 'Starter',
      price: '0',
      period: 'Gratuit',
      description: 'Parfait pour tester',
      features: [
        '5 documents/mois',
        'Analyse IA basique',
        'Export CSV',
        'Support communauté',
      ],
      cta: 'Commencer',
      popular: false,
    },
    {
      name: 'Professional',
      price: '49',
      period: '/mois',
      description: 'Pour les PME',
      features: [
        '100 documents/mois',
        'IA avancée 97%',
        'Détection anomalies',
        'API REST',
        'Support prioritaire',
      ],
      cta: 'Essai 14 jours',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '149',
      period: '/mois',
      description: 'Grandes organisations',
      features: [
        'Documents illimités',
        'IA personnalisée',
        'Intégrations ERP',
        'Support 24/7',
        'SLA 99.9%',
      ],
      cta: 'Nous contacter',
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="bg-[#bdc3c7] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-montserrat mb-4 text-4xl font-bold tracking-tight text-[#2c3e50]">
            Tarifs transparents
          </h2>
          <p className="font-open-sans mx-auto max-w-3xl text-xl text-[#34495e]">
            Choisissez la solution adaptée à vos besoins. Changez de plan à tout
            moment, sans engagement.
          </p>
        </motion.div>

        {/* Grille des plans */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl bg-[#ecf0f1] p-8 ${
                plan.popular
                  ? 'scale-105 shadow-xl ring-2 ring-[#2c3e50]'
                  : 'border border-[#bdc3c7] hover:shadow-lg'
              } transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                  <div className="font-open-sans rounded-full bg-[#2c3e50] px-4 py-1 text-sm font-medium text-white">
                    Plus populaire
                  </div>
                </div>
              )}

              <div className="mb-8 text-center">
                <h3 className="font-montserrat mb-2 text-2xl font-bold tracking-wide text-[#2c3e50]">
                  {plan.name}
                </h3>
                <div className="mb-2 flex items-baseline justify-center">
                  <span className="font-ibm-plex-mono text-4xl font-bold tracking-wider text-[#2c3e50]">
                    {plan.price}€
                  </span>
                  <span className="font-open-sans ml-1 text-[#34495e]">
                    {plan.period}
                  </span>
                </div>
                <p className="font-open-sans text-[#34495e]">
                  {plan.description}
                </p>
              </div>

              <ul className="mb-8 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#2c3e50]" />
                    <span className="font-open-sans text-[#34495e]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`font-open-sans w-full rounded-lg px-6 py-3 font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-[#2c3e50] text-white hover:bg-[#34495e]'
                    : 'bg-[#34495e] text-white hover:bg-[#2c3e50]'
                }`}
              >
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
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center rounded-full border border-[#2c3e50] bg-[#ecf0f1] px-6 py-3">
            <CheckCircle className="mr-2 h-5 w-5 text-[#2c3e50]" />
            <span className="font-open-sans font-medium text-[#2c3e50]">
              Garantie 30 jours satisfait ou remboursé
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const EnterpriseSection = ({
  setIsModalOpen,
  setDefaultMode,
}: {
  setIsModalOpen: (open: boolean) => void;
  setDefaultMode: (mode: 'signin' | 'signup') => void;
}) => {
  return (
    <section id="enterprise" className="bg-[#2c3e50] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="font-montserrat mb-6 text-4xl font-bold tracking-tight text-white">
                Solutions entreprise
              </h2>
              <p className="font-open-sans text-xl leading-relaxed text-[#ecf0f1]">
                Déployez Bank-IA à l'échelle de votre organisation avec nos
                solutions d'intégration avancées et notre support dédié.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-xl bg-[#34495e] p-6">
                <Users className="mb-4 h-8 w-8 text-[#ecf0f1]" />
                <h3 className="font-montserrat mb-2 text-lg font-semibold tracking-wide text-white">
                  Multi-utilisateurs
                </h3>
                <p className="font-open-sans text-[#bdc3c7]">
                  Gestion centralisée des équipes et permissions granulaires
                </p>
              </div>
              <div className="rounded-xl bg-[#34495e] p-6">
                <Database className="mb-4 h-8 w-8 text-[#ecf0f1]" />
                <h3 className="font-montserrat mb-2 text-lg font-semibold tracking-wide text-white">
                  Intégrations
                </h3>
                <p className="font-open-sans text-[#bdc3c7]">
                  Connectez Bank-IA à votre ERP, CRM et outils existants
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <button
                onClick={() => {
                  setDefaultMode('signup');
                  setIsModalOpen(true);
                }}
                className="font-open-sans rounded-lg bg-[#ecf0f1] px-8 py-4 text-center font-semibold text-[#2c3e50] transition-colors hover:bg-white"
              >
                Demander une démo
              </button>
              <Link
                href="/enterprise"
                className="font-open-sans rounded-lg border border-[#bdc3c7] px-8 py-4 text-center font-semibold text-[#ecf0f1] transition-colors hover:border-[#ecf0f1]"
              >
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
            <div className="rounded-2xl border border-[#bdc3c7] bg-[#34495e] p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#bdc3c7] pb-4">
                  <h3 className="font-montserrat text-xl font-semibold tracking-wide text-white">
                    Tableau de bord
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-[#ecf0f1]"></div>
                    <span className="font-open-sans text-sm text-[#bdc3c7]">
                      Temps réel
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-[#2c3e50] p-4">
                    <div className="font-ibm-plex-mono text-2xl font-bold tracking-wider text-white">
                      1,247
                    </div>
                    <div className="font-open-sans text-sm text-[#bdc3c7]">
                      Documents traités
                    </div>
                    <div className="font-open-sans mt-1 text-xs text-[#ecf0f1]">
                      +12% ce mois
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#2c3e50] p-4">
                    <div className="font-ibm-plex-mono text-2xl font-bold tracking-wider text-white">
                      97.8%
                    </div>
                    <div className="font-open-sans text-sm text-[#bdc3c7]">
                      Précision moyenne
                    </div>
                    <div className="font-open-sans mt-1 text-xs text-[#ecf0f1]">
                      SLA respecté
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-open-sans text-[#bdc3c7]">
                      Équipe Finance
                    </span>
                    <span className="font-ibm-plex-mono tracking-wider text-white">
                      856 docs
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-open-sans text-[#bdc3c7]">
                      Équipe Comptabilité
                    </span>
                    <span className="font-ibm-plex-mono tracking-wider text-white">
                      391 docs
                    </span>
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
    <footer className="border-t border-[#bdc3c7] bg-[#ecf0f1]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2c3e50]">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="font-montserrat text-xl font-bold tracking-tight text-[#2c3e50]">
                  Bank-IA
                </div>
                <div className="font-open-sans text-sm text-[#34495e]">
                  Financial Intelligence
                </div>
              </div>
            </div>
            <p className="font-open-sans mb-6 max-w-md text-[#34495e]">
              La première solution d'intelligence artificielle dédiée à
              l'automatisation de la comptabilité d'entreprise.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#bdc3c7] text-[#2c3e50] transition-colors hover:bg-white hover:text-[#2c3e50]"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Liens produit */}
          <div>
            <h3 className="font-montserrat mb-4 font-semibold tracking-wide text-[#2c3e50]">
              Produit
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="font-open-sans text-[#34495e] transition-colors hover:text-[#2c3e50]"
                >
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="font-open-sans text-[#34495e] transition-colors hover:text-[#2c3e50]"
                >
                  Tarifs
                </a>
              </li>
              <li>
                <a
                  href="#enterprise"
                  className="font-open-sans text-[#34495e] transition-colors hover:text-[#2c3e50]"
                >
                  Entreprise
                </a>
              </li>
              <li>
                <a
                  href="#security"
                  className="font-open-sans text-[#34495e] transition-colors hover:text-[#2c3e50]"
                >
                  Sécurité
                </a>
              </li>
            </ul>
          </div>

          {/* Liens support */}
          <div>
            <h3 className="font-montserrat mb-4 font-semibold tracking-wide text-[#2c3e50]">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#help"
                  className="font-open-sans text-[#34495e] transition-colors hover:text-[#2c3e50]"
                >
                  Centre d'aide
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="font-open-sans text-[#34495e] transition-colors hover:text-[#2c3e50]"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#status"
                  className="font-open-sans text-[#34495e] transition-colors hover:text-[#2c3e50]"
                >
                  Statut
                </a>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="font-open-sans text-[#34495e] transition-colors hover:text-[#2c3e50]"
                >
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-[#bdc3c7] pt-8 md:flex-row">
          <p className="font-open-sans text-sm text-[#34495e]">
            © 2024 Bank-IA. Tous droits réservés.
          </p>
          <div className="mt-4 flex items-center space-x-6 md:mt-0">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-[#2c3e50]" />
              <span className="font-open-sans text-sm text-[#34495e]">
                ISO 27001
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-[#2c3e50]" />
              <span className="font-open-sans text-sm text-[#34495e]">
                RGPD
              </span>
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

  const handleDocumentSuccess = useCallback(
    (documentData: any) => {
      setIsProcessing(false);
      setProcessingStep('');
      // ... logique de traitement des résultats
    },
    [credits]
  );

  return (
    <div className="min-h-screen bg-[#ecf0f1]">
      <Navigation
        setIsModalOpen={setIsModalOpen}
        setDefaultMode={setDefaultMode}
      />
      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultMode={defaultMode}
      />

      <main>
        <HeroSection
          setIsModalOpen={setIsModalOpen}
          setDefaultMode={setDefaultMode}
        />
        <FeaturesSection />
        <PricingSection />
        <EnterpriseSection
          setIsModalOpen={setIsModalOpen}
          setDefaultMode={setDefaultMode}
        />
      </main>

      <Footer />
    </div>
  );
};

export default BankStatementConverter;
