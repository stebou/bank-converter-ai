'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Lock, Database, Users, Mail, FileText, Brain, CheckCircle, Clock, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicyPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
    {/* Effet glassmorphism moderne pour la page privacy policy */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10"></div>
    
    {/* Header Navigation moderne */}
    <motion.header 
      className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50"
      initial={{ opacity: 0.3, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-2xl shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
                Bank Statement Converter IA
              </span>
              <p className="text-xs text-gray-400 -mt-1">Protection des données</p>
            </div>
          </div>
          <Link href="/">
            <motion.button 
              className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-6 py-3 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour à l&apos;accueil</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.header>


    {/* Main Content moderne */}
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
      {/* Hero Section moderne */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0.3, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
          <Shield className="w-6 h-6 text-blue-400" />
          <span className="text-sm font-semibold uppercase tracking-wide text-blue-200">
            Protection des Données RGPD
          </span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
          <span className="text-white">Politique de</span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
            Confidentialité
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
          Nous nous engageons à protéger vos données personnelles et à respecter votre vie privée.
          Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
        </p>
        
        <div className="flex items-center justify-center gap-2 text-sm text-gray-400 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-3 inline-flex">
          <Clock className="w-4 h-4 text-green-400" />
          <span><strong className="text-green-300">Dernière mise à jour :</strong> 31 juillet 2025</span>
        </div>
      </motion.div>


      <div className="space-y-12">
        {/* Responsable du traitement moderne */}
        <motion.section 
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-transparent"></div>
          
          <div className="flex items-start space-x-6 mb-8 relative z-10">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4 text-white">1. Responsable du traitement</h2>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Les données collectées sur ce site sont traitées par <strong className="text-white">Bank Statement Converter IA</strong>,
                société éditrice du site et responsable du traitement des données personnelles.
              </p>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-gray-400">Contact</p>
                      <p className="text-white font-semibold">contact@bankstatement-ai.fr</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <UserCheck className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-gray-400">DPO</p>
                      <p className="text-white font-semibold">dpo@bankstatement-ai.fr</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-gray-400">Certification</p>
                      <p className="text-white font-semibold">RGPD Compliant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>


        {/* Données collectées moderne */}
        <motion.section 
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-400/10 to-transparent"></div>
          
          <div className="flex items-start space-x-6 mb-8 relative z-10">
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <Database className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 text-white">2. Données collectées</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Identité</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Nom, prénom</li>
                    <li>• Adresse e-mail</li>
                    <li>• Informations de compte</li>
                    <li>• Préférences utilisateur</li>
                  </ul>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Techniques</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Adresse IP</li>
                    <li>• Navigateur, OS</li>
                    <li>• Pages visitées</li>
                    <li>• Cookies analytiques</li>
                  </ul>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Documents</h3>
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
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-400/10 to-transparent"></div>
          
          <div className="flex items-start space-x-6 mb-8 relative z-10">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 text-white">3. Finalités de la collecte</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">Fourniture du service de conversion IA</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-300">Création/gestion de compte utilisateur</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-300">Amélioration continue et sécurité</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-orange-400 flex-shrink-0" />
                  <span className="text-gray-300">Support client et communication</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-yellow-300" />
                  <span className="text-yellow-200 font-medium">Respect des obligations légales (RGPD, comptabilité)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>


        {/* Base légale moderne */}
        <motion.section 
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-400/10 to-transparent"></div>
          
          <div className="flex items-start space-x-6 mb-8 relative z-10">
            <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 text-white">4. Base légale RGPD</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <UserCheck className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Consentement</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Newsletter marketing</li>
                    <li>• Cookies analytiques</li>
                    <li>• Communications promotionnelles</li>
                  </ul>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Contrat</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Accès au service IA</li>
                    <li>• Facturation et paiements</li>
                    <li>• Support technique</li>
                  </ul>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-red-400" />
                    <h3 className="text-lg font-semibold text-white">Obligation légale</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Conservation factures (10 ans)</li>
                    <li>• Lutte anti-blanchiment</li>
                    <li>• Obligations comptables</li>
                  </ul>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Intérêt légitime</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300 text-sm">
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
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-pink-400/10 to-transparent"></div>
          
          <div className="flex items-start space-x-6 mb-8 relative z-10">
            <div className="p-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-lg">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 text-white">5. Durée de conservation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-green-400" />
                      <h3 className="text-lg font-semibold text-white">Fichiers PDF</h3>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full border border-green-400/30">
                      Sécurisé
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-300 mb-2">24 heures</p>
                  <p className="text-gray-400 text-sm">Suppression automatique après traitement</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-blue-400" />
                      <h3 className="text-lg font-semibold text-white">Compte utilisateur</h3>
                    </div>
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full border border-blue-400/30">
                      Actif
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-300 mb-2">Durée d&apos;abonnement</p>
                  <p className="text-gray-400 text-sm">Jusqu&apos;à suppression volontaire</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Eye className="w-6 h-6 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">Navigation</h3>
                    </div>
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-400/30">
                      Temporaire
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-purple-300 mb-2">13 mois</p>
                  <p className="text-gray-400 text-sm">Données analytiques et cookies</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Lock className="w-6 h-6 text-orange-400" />
                      <h3 className="text-lg font-semibold text-white">Factures</h3>
                    </div>
                    <span className="text-xs bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full border border-orange-400/30">
                      Légal
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-orange-300 mb-2">10 ans</p>
                  <p className="text-gray-400 text-sm">Obligation comptable française</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>


        {/* Droits RGPD moderne */}
        <motion.section 
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-blue-400/10 to-transparent"></div>
          
          <div className="flex items-start space-x-6 mb-8 relative z-10">
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 text-white">6. Vos droits RGPD</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">Accès</h3>
                  </div>
                  <p className="text-gray-300 text-sm">Consulter vos données personnelles</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-5 h-5 text-green-400" />
                    <h3 className="font-semibold text-white">Rectification</h3>
                  </div>
                  <p className="text-gray-300 text-sm">Corriger vos informations</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Database className="w-5 h-5 text-red-400" />
                    <h3 className="font-semibold text-white">Effacement</h3>
                  </div>
                  <p className="text-gray-300 text-sm">Supprimer vos données</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <ArrowLeft className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-white">Portabilité</h3>
                  </div>
                  <p className="text-gray-300 text-sm">Récupérer vos données</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Lock className="w-5 h-5 text-orange-400" />
                    <h3 className="font-semibold text-white">Opposition</h3>
                  </div>
                  <p className="text-gray-300 text-sm">Refuser un traitement</p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <UserCheck className="w-5 h-5 text-yellow-400" />
                    <h3 className="font-semibold text-white">Retrait</h3>
                  </div>
                  <p className="text-gray-300 text-sm">Annuler votre consentement</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-blue-300 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Exercer vos droits</h3>
                    <p className="text-blue-200 mb-4">Pour toute demande concernant vos données personnelles :</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a href="mailto:dpo@bankstatement-ai.fr" className="bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors font-medium text-center">
                        📧 Contacter le DPO
                      </a>
                      <div className="text-blue-200 text-sm self-center">
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
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-400/10 to-transparent"></div>
          
          <div className="flex items-start space-x-6 mb-8 relative z-10">
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-6 text-white">7. Sécurisation de vos données</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Chiffrement</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>HTTPS/TLS 1.3</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Stockage AES-256</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span>Base de données chiffrée</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">Accès</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Personnel habilité uniquement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Authentification multi-facteurs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                      <span>Audits réguliers</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-red-400" />
                    <h3 className="text-lg font-semibold text-white">Suppression</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-red-400" />
                      <span>Automatique après 24h</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-red-400" />
                      <span>Suppression sécurisée</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-red-400" />
                      <span>Aucune sauvegarde</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Surveillance</h3>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>Monitoring 24/7</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      <span>Logs de sécurité</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-purple-400" />
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
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 relative overflow-hidden"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Effet glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-green-500/20"></div>
          
          <div className="text-center relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-3xl mb-8 shadow-2xl">
              <Mail className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold mb-6 text-white">Questions sur vos données ?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Notre équipe de protection des données est à votre disposition pour répondre à toutes vos questions 
              sur la confidentialité et la sécurité de vos informations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <Mail className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Support général</h3>
                <p className="text-gray-300 text-sm mb-4">Questions générales sur nos services</p>
                <a href="mailto:contact@bankstatement-ai.fr" className="text-blue-300 hover:text-blue-200 font-medium">
                  contact@bankstatement-ai.fr
                </a>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <Shield className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Protection des données</h3>
                <p className="text-gray-300 text-sm mb-4">Exercer vos droits RGPD</p>
                <a href="mailto:dpo@bankstatement-ai.fr" className="text-purple-300 hover:text-purple-200 font-medium">
                  dpo@bankstatement-ai.fr
                </a>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <Clock className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Délai de réponse</h3>
                <p className="text-gray-300 text-sm mb-4">Engagement de service</p>
                <div className="text-green-300 font-semibold">
                  &lt; 48 heures
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a 
                href="mailto:contact@bankstatement-ai.fr"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5" />
                Nous contacter
              </motion.a>
              <motion.a 
                href="mailto:dpo@bankstatement-ai.fr"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield className="w-5 h-5" />
                Contacter le DPO
              </motion.a>
            </div>
          </div>
        </motion.section>
      </div>


      {/* Retour à l'accueil moderne */}
      <motion.div 
        className="text-center mt-16"
        initial={{ opacity: 0.3, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Link href="/">
          <motion.button 
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 text-white px-12 py-5 rounded-3xl font-bold hover:from-blue-600 hover:via-purple-600 hover:to-green-600 transition-all duration-300 shadow-2xl flex items-center space-x-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="text-lg">Retour à l&apos;accueil</span>
          </motion.button>
        </Link>
      </motion.div>
    </main>
  </div>
);


export default PrivacyPolicyPage;
