'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Database,
  Users,
  Mail,
  FileText,
  Brain,
  CheckCircle,
  Clock,
  UserCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => (
  <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
    {/* Effet glassmorphism moderne pour la page privacy policy */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10"></div>

    {/* Header Navigation moderne */}
    <motion.header
      className="sticky top-0 z-50 border-b border-white/20 bg-white/10 backdrop-blur-xl"
      initial={{ opacity: 0.3, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 shadow-lg">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-xl font-bold text-transparent">
                Bank Statement Converter IA
              </span>
              <p className="-mt-1 text-xs text-gray-400">
                Protection des données
              </p>
            </div>
          </div>
          <Link href="/">
            <motion.button
              className="flex items-center space-x-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Retour à l&apos;accueil</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.header>

    {/* Main Content moderne */}
    <main className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section moderne */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0.3, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <div className="mb-8 inline-flex items-center space-x-3 rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-sm">
          <Shield className="h-6 w-6 text-blue-400" />
          <span className="text-sm font-semibold uppercase tracking-wide text-blue-200">
            Protection des Données RGPD
          </span>
        </div>

        <h1 className="mb-8 text-5xl font-bold leading-tight lg:text-7xl">
          <span className="text-white">Politique de</span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            Confidentialité
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-4xl text-xl leading-relaxed text-gray-300">
          Nous nous engageons à protéger vos données personnelles et à respecter
          votre vie privée. Cette politique explique comment nous collectons,
          utilisons et protégeons vos informations.
        </p>

        <div className="flex inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-gray-400 backdrop-blur-sm">
          <Clock className="h-4 w-4 text-green-400" />
          <span>
            <strong className="text-green-300">Dernière mise à jour :</strong>{' '}
            31 juillet 2025
          </span>
        </div>
      </motion.div>

      <div className="space-y-12">
        {/* Responsable du traitement moderne */}
        <motion.section
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-transparent"></div>

          <div className="relative z-10 mb-8 flex items-start space-x-6">
            <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 p-4 shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="mb-4 text-3xl font-bold text-white">
                1. Responsable du traitement
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-300">
                Les données collectées sur ce site sont traitées par{' '}
                <strong className="text-white">
                  Bank Statement Converter IA
                </strong>
                , société éditrice du site et responsable du traitement des
                données personnelles.
              </p>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-400" />
                    <div>
                      <p className="text-gray-400">Contact</p>
                      <p className="font-semibold text-white">
                        contact@bankstatement-ai.fr
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-purple-400" />
                    <div>
                      <p className="text-gray-400">DPO</p>
                      <p className="font-semibold text-white">
                        dpo@bankstatement-ai.fr
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div>
                      <p className="text-gray-400">Certification</p>
                      <p className="font-semibold text-white">RGPD Compliant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Données collectées moderne */}
        <motion.section
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-400/10 to-transparent"></div>

          <div className="relative z-10 mb-8 flex items-start space-x-6">
            <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-4 shadow-lg">
              <Database className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="mb-6 text-3xl font-bold text-white">
                2. Données collectées
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <Users className="h-6 w-6 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Identité
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Nom, prénom</li>
                    <li>• Adresse e-mail</li>
                    <li>• Informations de compte</li>
                    <li>• Préférences utilisateur</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <Shield className="h-6 w-6 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Techniques
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Adresse IP</li>
                    <li>• Navigateur, OS</li>
                    <li>• Pages visitées</li>
                    <li>• Cookies analytiques</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <FileText className="h-6 w-6 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Documents
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Relevés bancaires PDF</li>
                    <li>• Métadonnées fichiers</li>
                    <li>• Extraits temporaires</li>
                    <li>• Résultats analyse IA</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Finalité moderne */}
        <motion.section
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-400/10 to-transparent"></div>

          <div className="relative z-10 mb-8 flex items-start space-x-6">
            <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 p-4 shadow-lg">
              <Eye className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="mb-6 text-3xl font-bold text-white">
                3. Finalités de la collecte
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-400" />
                  <span className="text-gray-300">
                    Fourniture du service de conversion IA
                  </span>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-blue-400" />
                  <span className="text-gray-300">
                    Création/gestion de compte utilisateur
                  </span>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-purple-400" />
                  <span className="text-gray-300">
                    Amélioration continue et sécurité
                  </span>
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-orange-400" />
                  <span className="text-gray-300">
                    Support client et communication
                  </span>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-yellow-400/30 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-yellow-300" />
                  <span className="font-medium text-yellow-200">
                    Respect des obligations légales (RGPD, comptabilité)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Base légale moderne */}
        <motion.section
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-400/10 to-transparent"></div>

          <div className="relative z-10 mb-8 flex items-start space-x-6">
            <div className="rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-600 p-4 shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="mb-6 text-3xl font-bold text-white">
                4. Base légale RGPD
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <UserCheck className="h-6 w-6 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Consentement
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Newsletter marketing</li>
                    <li>• Cookies analytiques</li>
                    <li>• Communications promotionnelles</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <FileText className="h-6 w-6 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Contrat
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Accès au service IA</li>
                    <li>• Facturation et paiements</li>
                    <li>• Support technique</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <Shield className="h-6 w-6 text-red-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Obligation légale
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Conservation factures (10 ans)</li>
                    <li>• Lutte anti-blanchiment</li>
                    <li>• Obligations comptables</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <Eye className="h-6 w-6 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Intérêt légitime
                    </h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Sécurité de la plateforme</li>
                    <li>• Amélioration continue</li>
                    <li>• Détection de fraudes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Conservation moderne */}
        <motion.section
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-pink-400/10 to-transparent"></div>

          <div className="relative z-10 mb-8 flex items-start space-x-6">
            <div className="rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 p-4 shadow-lg">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="mb-6 text-3xl font-bold text-white">
                5. Durée de conservation
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-6 w-6 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">
                        Fichiers PDF
                      </h3>
                    </div>
                    <span className="rounded-full border border-green-400/30 bg-green-500/20 px-3 py-1 text-xs text-green-300">
                      Sécurisé
                    </span>
                  </div>
                  <p className="mb-2 text-2xl font-bold text-green-300">
                    24 heures
                  </p>
                  <p className="text-sm text-gray-400">
                    Suppression automatique après traitement
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-6 w-6 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">
                        Compte utilisateur
                      </h3>
                    </div>
                    <span className="rounded-full border border-blue-400/30 bg-blue-500/20 px-3 py-1 text-xs text-blue-300">
                      Actif
                    </span>
                  </div>
                  <p className="mb-2 text-2xl font-bold text-blue-300">
                    Durée d&apos;abonnement
                  </p>
                  <p className="text-sm text-gray-400">
                    Jusqu&apos;à suppression volontaire
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="h-6 w-6 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">
                        Navigation
                      </h3>
                    </div>
                    <span className="rounded-full border border-purple-400/30 bg-purple-500/20 px-3 py-1 text-xs text-purple-300">
                      Temporaire
                    </span>
                  </div>
                  <p className="mb-2 text-2xl font-bold text-purple-300">
                    13 mois
                  </p>
                  <p className="text-sm text-gray-400">
                    Données analytiques et cookies
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="h-6 w-6 text-orange-400" />
                      <h3 className="text-lg font-semibold text-white">
                        Factures
                      </h3>
                    </div>
                    <span className="rounded-full border border-orange-400/30 bg-orange-500/20 px-3 py-1 text-xs text-orange-300">
                      Légal
                    </span>
                  </div>
                  <p className="mb-2 text-2xl font-bold text-orange-300">
                    10 ans
                  </p>
                  <p className="text-sm text-gray-400">
                    Obligation comptable française
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Droits RGPD moderne */}
        <motion.section
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-blue-400/10 to-transparent"></div>

          <div className="relative z-10 mb-8 flex items-start space-x-6">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 p-4 shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="mb-6 text-3xl font-bold text-white">
                6. Vos droits RGPD
              </h2>

              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <Eye className="h-5 w-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Accès</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    Consulter vos données personnelles
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <FileText className="h-5 w-5 text-green-400" />
                    <h3 className="font-semibold text-white">Rectification</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    Corriger vos informations
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <Database className="h-5 w-5 text-red-400" />
                    <h3 className="font-semibold text-white">Effacement</h3>
                  </div>
                  <p className="text-sm text-gray-300">Supprimer vos données</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <ArrowLeft className="h-5 w-5 text-purple-400" />
                    <h3 className="font-semibold text-white">Portabilité</h3>
                  </div>
                  <p className="text-sm text-gray-300">Récupérer vos données</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <Lock className="h-5 w-5 text-orange-400" />
                    <h3 className="font-semibold text-white">Opposition</h3>
                  </div>
                  <p className="text-sm text-gray-300">Refuser un traitement</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <UserCheck className="h-5 w-5 text-yellow-400" />
                    <h3 className="font-semibold text-white">Retrait</h3>
                  </div>
                  <p className="text-sm text-gray-300">
                    Annuler votre consentement
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-400/30 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 p-6">
                <div className="flex items-start gap-4">
                  <Mail className="mt-1 h-6 w-6 flex-shrink-0 text-blue-300" />
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      Exercer vos droits
                    </h3>
                    <p className="mb-4 text-blue-200">
                      Pour toute demande concernant vos données personnelles :
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <a
                        href="mailto:dpo@bankstatement-ai.fr"
                        className="rounded-xl bg-white/20 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-white/30"
                      >
                        📧 Contacter le DPO
                      </a>
                      <div className="self-center text-sm text-blue-200">
                        Réponse sous 30 jours maximum
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Sécurité moderne */}
        <motion.section
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.9,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-400/10 to-transparent"></div>

          <div className="relative z-10 mb-8 flex items-start space-x-6">
            <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-4 shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="mb-6 text-3xl font-bold text-white">
                7. Sécurisation de vos données
              </h2>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <Shield className="h-6 w-6 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Chiffrement
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>HTTPS/TLS 1.3</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Stockage AES-256</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Base de données chiffrée</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <Users className="h-6 w-6 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Accès</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span>Personnel habilité uniquement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span>Authentification multi-facteurs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-400" />
                      <span>Audits réguliers</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <Clock className="h-6 w-6 text-red-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Suppression
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-400" />
                      <span>Automatique après 24h</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-400" />
                      <span>Suppression sécurisée</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-400" />
                      <span>Aucune sauvegarde</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <Eye className="h-6 w-6 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">
                      Surveillance
                    </h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-400" />
                      <span>Monitoring 24/7</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-400" />
                      <span>Logs de sécurité</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-400" />
                      <span>Détection d&apos;intrusions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact moderne */}
        <motion.section
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-12 shadow-2xl backdrop-blur-xl"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 1.0,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-green-500/20"></div>

          <div className="relative z-10 text-center">
            <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 shadow-2xl">
              <Mail className="h-10 w-10 text-white" />
            </div>

            <h2 className="mb-6 text-4xl font-bold text-white">
              Questions sur vos données ?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-gray-300">
              Notre équipe de protection des données est à votre disposition
              pour répondre à toutes vos questions sur la confidentialité et la
              sécurité de vos informations.
            </p>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <Mail className="mx-auto mb-4 h-8 w-8 text-blue-400" />
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Support général
                </h3>
                <p className="mb-4 text-sm text-gray-300">
                  Questions générales sur nos services
                </p>
                <a
                  href="mailto:contact@bankstatement-ai.fr"
                  className="font-medium text-blue-300 hover:text-blue-200"
                >
                  contact@bankstatement-ai.fr
                </a>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <Shield className="mx-auto mb-4 h-8 w-8 text-purple-400" />
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Protection des données
                </h3>
                <p className="mb-4 text-sm text-gray-300">
                  Exercer vos droits RGPD
                </p>
                <a
                  href="mailto:dpo@bankstatement-ai.fr"
                  className="font-medium text-purple-300 hover:text-purple-200"
                >
                  dpo@bankstatement-ai.fr
                </a>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <Clock className="mx-auto mb-4 h-8 w-8 text-green-400" />
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Délai de réponse
                </h3>
                <p className="mb-4 text-sm text-gray-300">
                  Engagement de service
                </p>
                <div className="font-semibold text-green-300">
                  &lt; 48 heures
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <motion.a
                href="mailto:contact@bankstatement-ai.fr"
                className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:from-blue-600 hover:to-purple-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="h-5 w-5" />
                Nous contacter
              </motion.a>
              <motion.a
                href="mailto:dpo@bankstatement-ai.fr"
                className="flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield className="h-5 w-5" />
                Contacter le DPO
              </motion.a>
            </div>
          </div>
        </motion.section>
      </div>

      {/* Retour à l'accueil moderne */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0.3, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 1.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <Link href="/">
          <motion.button
            className="mx-auto flex items-center space-x-3 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 px-12 py-5 font-bold text-white shadow-2xl transition-all duration-300 hover:from-blue-600 hover:via-purple-600 hover:to-green-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="text-lg">Retour à l&apos;accueil</span>
          </motion.button>
        </Link>
      </motion.div>
    </main>
  </div>
);

export default PrivacyPolicyPage;
