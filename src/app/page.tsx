'use client'

import React, { useState, useCallback } from 'react';
import { FileText, Brain, CheckCircle, AlertCircle, Download, Zap, Check, Crown, Sparkles, ArrowRight, Mail, Twitter, Linkedin, Github, X } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import { DocumentUpload } from '@/components/DocumentUpload';
import { Navigation } from '@/components/Navigation';
import AnimatedGradientBackground from '@/components/AnimatedGradientBackground';
import { motion, AnimatePresence } from 'framer-motion';

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

// --- COMPOSANTS ---

const TestimonialsSection = () => {
  const testimonials = [
    {
      metric: "+95%",
      description: "de précision IA",
      quote: "Bank Statement Converter IA a révolutionné notre processus comptable. Fini les erreurs de saisie manuelle, notre IA détecte automatiquement tous les types de transactions avec une précision remarquable.",
      author: "Marie Dubois",
      position: "Directrice Financière",
      company: "TechStart SAS",
      avatar: "👩‍💼",
      bgColor: "from-blue-500 to-blue-600"
    },
    {
      metric: "10x",
      description: "plus rapide",
      quote: "Ce qui nous prenait des heures se fait maintenant en quelques minutes. Cette automatisation des relevés bancaires nous fait gagner un temps fou, et notre équipe support est toujours là quand on en a besoin.",
      author: "Thomas Martin",
      position: "Expert-Comptable",
      company: "Cabinet Martin & Associés",
      avatar: "👨‍💻",
      bgColor: "from-purple-500 to-purple-600"
    },
    {
      metric: "3x",
      description: "moins erreurs",
      quote: "Dans le métier de comptable, cette organisation et la régularité font vraiment la différence. Je gagne énormément en productivité et je réussis à maintenir un fort niveau de personnalisation.",
      author: "Sophie Chen",
      position: "Responsable Comptabilité",
      company: "InnovateCorp",
      avatar: "👩‍🔬",
      bgColor: "from-indigo-500 to-indigo-600"
    },
    {
      metric: "5x",
      description: "plus de clients traités",
      quote: "Nous avons plus de problème de délivrabilité. Avec cette IA nous ne gardons que les données valides et la fonctionnalité de détection des anomalies assure que nos analyses arrivent vraiment dans les bonnes mains.",
      author: "Alexandre Dubois",
      position: "Directeur de Cabinet",
      company: "Expertise & Conseil",
      avatar: "👨‍💼",
      bgColor: "from-blue-600 to-purple-600"
    }
  ];

  return (
    <motion.section 
      className="py-20 relative"
      initial={{ opacity: 0.3, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0.4, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-flex items-center space-x-2 mb-6">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
              Témoignages clients
            </span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white">Des résultats</span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
              concrets
            </span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Découvrez comment nos clients transforment leur processus comptable avec notre IA révolutionnaire
          </p>
        </motion.div>

        {/* Layout Bento Grid moderne */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 auto-rows-fr">
          {testimonials.map((testimonial, index) => {
            // Alterner les tailles pour créer un layout bento dynamique
            const isLargeCard = index === 0 || index === 3;
            const cardSize = isLargeCard ? "lg:col-span-2 lg:row-span-1" : "lg:col-span-1";
            
            return (
              <motion.div
                key={index}
                className={`relative bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 ${cardSize}`}
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                }}
                initial={{ opacity: 0.4, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                {/* Badge métrique avec neumorphism */}
                <div className="flex items-center space-x-4 mb-8">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${testimonial.bgColor} shadow-lg`}>
                    <span className="text-3xl font-bold text-white">{testimonial.metric}</span>
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold bg-gradient-to-r ${testimonial.bgColor} bg-clip-text text-transparent`}>
                      {testimonial.description}
                    </h3>
                  </div>
                </div>

                {/* Citation avec typography moderne */}
                <blockquote className="text-lg mb-8 leading-relaxed text-gray-700 font-medium">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Profil auteur modernisé */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.bgColor} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-lg text-gray-900">{testimonial.author}</div>
                      <div className="text-gray-600 text-sm font-medium">{testimonial.position}</div>
                      <div className="text-gray-500 text-sm">{testimonial.company}</div>
                    </div>
                  </div>
                  
                  <motion.button 
                    className={`bg-gradient-to-r ${testimonial.bgColor} text-white px-6 py-3 rounded-2xl text-sm font-bold hover:shadow-xl transition-all duration-300 flex items-center space-x-2`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Découvrir</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Effet de profondeur moderne */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

const PricingSection = () => {
  const plans = [
    { name: "Gratuit", price: "0€", period: "/mois", description: "Parfait pour tester notre IA", features: ["5 documents/mois", "Analyse IA 85%+ précision", "Export CSV basique", "Support communauté", "Toutes banques françaises"], buttonText: "Commencer gratuitement", buttonStyle: "bg-gray-100 text-gray-900 hover:bg-gray-200 hover:scale-105", cardStyle: "border-gray-200 hover:border-gray-300 hover:shadow-lg", popular: false, icon: <FileText className="w-8 h-8 text-gray-600" /> },
    { name: "Intelligent", price: "49€", period: "/mois", description: "IA avancée pour les PME", features: ["100 documents/mois", "Analyse IA 95%+ précision", "Auto-catégorisation intelligente", "Détection d'anomalies basique", "Exports multiples (CSV, JSON, Excel)", "Support email prioritaire", "Accès API basique"], buttonText: "Démarrer avec Smart", buttonStyle: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-xl", cardStyle: "border-blue-200 hover:border-blue-400 hover:shadow-2xl hover:-translate-y-2", popular: true, icon: <Brain className="w-8 h-8 text-blue-600" /> },
    { name: "Professionnel", price: "149€", period: "/mois", description: "IA premium pour les cabinets", features: ["500 documents/mois", "Analyse IA 97%+ précision", "Détection d'anomalies avancée", "Rapprochement bancaire IA", "API complète + webhooks", "10 utilisateurs inclus", "Options marque blanche", "Support téléphone prioritaire", "SLA 99.5%"], buttonText: "Passer Pro", buttonStyle: "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105 hover:shadow-xl", cardStyle: "border-purple-200 hover:border-purple-400 hover:shadow-2xl hover:-translate-y-2", popular: false, icon: <Crown className="w-8 h-8 text-purple-600" /> },
    { name: "Entreprise", price: "399€", period: "/mois", description: "IA sur-mesure + CSM dédié", features: ["Documents illimités", "IA affinée sur vos données", "Règles de catégorisation personnalisées", "Utilisateurs illimités", "Intégrations ERP personnalisées", "CSM dédié + formation", "SLA 99.9% + support 24/7", "Déploiement sur site en option", "Audit de conformité inclus"], buttonText: "Contacter l'équipe", buttonStyle: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 hover:scale-105 hover:shadow-xl", cardStyle: "border-yellow-200 hover:border-yellow-400 hover:shadow-2xl hover:-translate-y-2", popular: false, icon: <Sparkles className="w-8 h-8 text-yellow-600" /> }
  ];

  return (
    <motion.section 
      id="pricing" 
      className="py-20 relative"
      initial={{ opacity: 0.3, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0.4, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-flex items-center space-x-2 mb-6">
            <Zap className="w-6 h-6 text-blue-500" />
            <span className="text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
              Tarifs boostés à notre IA
            </span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="text-white">Choisissez votre</span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
              puissance IA
            </span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            De notre analyse basique à notre IA sur-mesure, trouvez le plan parfait pour automatiser vos relevés bancaires avec une précision révolutionnaire.
          </p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8"
          initial={{ opacity: 0.4, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {plans.map((plan, index) => {
            // Couleurs harmonisées avec AnimatedGradientBackground
            const getColors = () => {
              switch(plan.name) {
                case 'Gratuit': return { icon: 'text-gray-600', gradient: 'from-gray-400 to-gray-600', shadow: 'shadow-gray-500/20' };
                case 'Intelligent': return { icon: 'text-blue-500', gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/30' };
                case 'Professionnel': return { icon: 'text-purple-500', gradient: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/30' };
                case 'Entreprise': return { icon: 'text-green-500', gradient: 'from-green-500 to-green-600', shadow: 'shadow-green-500/30' };
                default: return { icon: 'text-gray-600', gradient: 'from-gray-400 to-gray-600', shadow: 'shadow-gray-500/20' };
              }
            };
            const colors = getColors();
            
            return (
              <motion.div 
                key={plan.name} 
                className={`relative bg-white/95 backdrop-blur-md rounded-3xl p-8 transition-all duration-500 ease-out transform hover:scale-105 hover:${colors.shadow} hover:shadow-2xl ${plan.popular ? 'ring-2 ring-blue-500/50 scale-105' : ''} group cursor-pointer`}
                style={{
                  boxShadow: plan.popular 
                    ? '0 25px 50px -12px rgba(59, 130, 246, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.1)' 
                    : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
                initial={{ opacity: 0.4, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.15 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      ⭐ Plus populaire
                    </div>
                  </div>
                )}
                
                {/* Icon avec effet neumorphism */}
                <div className="flex justify-center mb-8">
                  <div className={`p-4 rounded-3xl bg-gradient-to-br ${colors.gradient} shadow-lg`}>
                    {plan.name === "Gratuit" && <FileText className="w-10 h-10 text-white" />}
                    {plan.name === "Intelligent" && <Brain className="w-10 h-10 text-white" />}
                    {plan.name === "Professionnel" && <Crown className="w-10 h-10 text-white" />}
                    {plan.name === "Entreprise" && <Sparkles className="w-10 h-10 text-white" />}
                  </div>
                </div>
                
                {/* Typography hiérarchisée */}
                <h3 className={`text-3xl font-bold text-center mb-3 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                  {plan.name}
                </h3>
                
                {/* Prix avec style moderne */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-6xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-2xl text-gray-500 ml-2">{plan.period}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-center mb-10 text-lg leading-relaxed min-h-[60px] flex items-center justify-center">
                  {plan.description}
                </p>
                {/* Features avec meilleur espacement */}
                <ul className="space-y-5 mb-10">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-4 group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${featureIndex * 50}ms` }}>
                      <div className={`flex-shrink-0 w-6 h-6 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center mt-0.5 shadow-sm`}>
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 text-base leading-relaxed font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Bouton moderne avec neumorphism */}
                <button className={`w-full py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-r ${colors.gradient} text-white shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 relative overflow-hidden`}>
                  <span>{plan.buttonText}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"><div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div></div>
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0.4, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-green-500/10 to-green-600/10 backdrop-blur-md border border-green-500/30 rounded-2xl px-8 py-4 hover:from-green-500/20 hover:to-green-600/20 transition-all duration-300 shadow-lg">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <Check className="w-6 h-6 text-white" />
            </div>
            <span className="text-green-100 font-bold text-lg">
              Garantie 30 jours satisfait ou remboursé • Annulation en 1 clic
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "Comment l'IA garantit-elle 95%+ de précision sur tous les types de banques ?",
      answer: "Notre IA utilise un pipeline de traitement avancé combinant OCR (reconnaissance optique), NLP (traitement du langage naturel) et des modèles d'apprentissage profond entraînés sur plus de 2 millions de relevés bancaires français. Nous détectons automatiquement votre banque et appliquons les règles de parsing spécifiques à chaque format."
    },
    {
      question: "Mes données bancaires sont-elles sécurisées ?",
      answer: "Absolument. Nous utilisons un chiffrement AES-256 bout-en-bout, nos serveurs sont hébergés en France (conformité RGPD), et vos documents sont automatiquement supprimés après traitement. Nous sommes certifiés ISO 27001 et nous ne stockons jamais vos données personnelles."
    },
    {
      question: "Quels formats de fichiers et banques sont supportés ?",
      answer: "Nous supportons tous les formats PDF, images (JPG, PNG, WebP) et toutes les banques françaises : BNP Paribas, Crédit Agricole, Société Générale, LCL, Banque Populaire, Crédit Mutuel, ING, Revolut, N26, et bien d'autres. Notre IA s'adapte automatiquement au format détecté."
    },
    {
      question: "Puis-je essayer gratuitement avant de m'abonner ?",
      answer: "Oui ! Vous avez droit à 3 analyses gratuites sans inscription. Créez ensuite un compte gratuit pour 5 crédits mensuels. Nos plans payants incluent une garantie satisfait ou remboursé de 30 jours."
    },
    {
      question: "Comment fonctionne la détection d'anomalies ?",
      answer: "Notre IA analyse les patterns de vos transactions et détecte automatiquement les doublons, montants inhabituels, dates incohérentes, et transactions suspectes. Chaque anomalie est accompagnée d'un score de confiance et d'une explication détaillée."
    },
    {
      question: "Existe-t-il une API pour intégrer votre solution ?",
      answer: "Oui, nous proposons une API REST complète avec webhooks, authentification par token, et une documentation interactive. Elle est incluse dans les plans Professionnel et Entreprise. Contactez-nous pour une démo personnalisée."
    }
  ];

  return (
    <motion.section 
      className="py-20 relative"
      initial={{ opacity: 0.3, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0.4, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-flex items-center space-x-2 mb-6">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wide bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
              Questions fréquentes
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">Tout ce que vous</span>
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
              devez savoir
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Trouvez rapidement les réponses à vos questions sur notre IA de traitement bancaire
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0.5, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.12 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <button
                className="w-full text-left p-6 focus:outline-none"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 pr-8 leading-relaxed">
                    {faq.question}
                  </h3>
                  <div className={`w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center transition-transform duration-300 ${openFAQ === index ? 'rotate-45' : ''}`}>
                    <div className="w-4 h-4 relative">
                      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white transform -translate-y-0.5"></div>
                      <div className={`absolute inset-y-0 left-1/2 w-0.5 bg-white transform -translate-x-0.5 transition-opacity duration-300 ${openFAQ === index ? 'opacity-0' : 'opacity-100'}`}></div>
                    </div>
                  </div>
                </div>
              </button>
              
              <AnimatePresence>
                {openFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0.3 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0.3 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-700 leading-relaxed text-base">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA en bas de FAQ */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0.4, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 backdrop-blur-md border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Vous avez d&apos;autres questions ?
            </h3>
            <p className="text-gray-300 mb-6">
              Notre équipe d&apos;experts est là pour vous accompagner
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#contact" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Nous contacter</span>
              </a>
              <a href="#demo" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>Planifier une démo</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

const Footer = () => {
  return (
    <motion.footer 
      className="py-20 px-4 sm:px-6 lg:px-8 relative"
      initial={{ opacity: 0.3, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Background moderne avec gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Fat Footer avec CTA et Newsletter */}
        <div className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10 backdrop-blur-xl border border-white/10 rounded-3xl p-12 lg:p-16 shadow-2xl mb-12">
          {/* Header avec CTA principal */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">Prêt à transformer</span>
              <br />
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
                votre comptabilité ?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Rejoignez plus de 10,000 entreprises qui automatisent leur comptabilité avec notre IA
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/sign-up" className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 text-white font-bold py-4 px-8 rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3">
                <Crown className="w-6 h-6" />
                <span className="text-lg">Commencer gratuitement</span>
                <ArrowRight className="w-6 h-6" />
              </Link>
              <a href="#demo" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center space-x-3">
                <Brain className="w-6 h-6" />
                <span className="text-lg">Voir la démo</span>
              </a>
            </div>
          </div>

          {/* Grid des liens - Fat Footer moderne */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Branding section plus large */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-2xl shadow-lg">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Bank Statement Converter IA</h3>
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed text-lg">
                La première solution qui utilise l&apos;IA pour convertir vos relevés bancaires avec 99%+ de précision. 
                Automatisez votre comptabilité en quelques clics.
              </p>
              
              {/* Newsletter moderne */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h4 className="text-white font-bold mb-3">Newsletter IA & Comptabilité</h4>
                <p className="text-gray-300 text-sm mb-4">Recevez nos dernières innovations et conseils comptables</p>
                <div className="flex space-x-3">
                  <input 
                    type="email" 
                    placeholder="votre@email.com" 
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300">
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Colonnes de liens avec plus de contenu */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Produit</h4>
              <ul className="space-y-4">
                <li><a href="#features" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"><ArrowRight className="w-4 h-4" /><span>Fonctionnalités IA</span></a></li>
                <li><a href="#pricing" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"><ArrowRight className="w-4 h-4" /><span>Tarifs & Plans</span></a></li>
                <li><a href="#demo" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"><ArrowRight className="w-4 h-4" /><span>Démo interactive</span></a></li>
                <li><a href="#api" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"><ArrowRight className="w-4 h-4" /><span>API & Intégrations</span></a></li>
                <li><a href="#mobile" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"><ArrowRight className="w-4 h-4" /><span>Applications mobiles</span></a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Solutions</h4>
              <ul className="space-y-4">
                <li><a href="#pme" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"><ArrowRight className="w-4 h-4" /><span>PME & Startups</span></a></li>
                <li><a href="#cabinets" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"><ArrowRight className="w-4 h-4" /><span>Cabinets comptables</span></a></li>
                <li><a href="#entreprises" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"><ArrowRight className="w-4 h-4" /><span>Grandes entreprises</span></a></li>
                <li><a href="#banques" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"><ArrowRight className="w-4 h-4" /><span>Institutions bancaires</span></a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Support & Ressources</h4>
              <ul className="space-y-4">
                <li><a href="#help" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"><ArrowRight className="w-4 h-4" /><span>Centre d&apos;aide</span></a></li>
                <li><a href="#docs" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"><ArrowRight className="w-4 h-4" /><span>Documentation</span></a></li>
                <li><a href="#blog" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"><ArrowRight className="w-4 h-4" /><span>Blog & Actualités</span></a></li>
                <li><a href="#webinars" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"><ArrowRight className="w-4 h-4" /><span>Webinaires</span></a></li>
                <li><a href="#status" className="text-gray-300 hover:text-white transition-colors flex items-center space-x-2"><ArrowRight className="w-4 h-4" /><span>Statut du service</span></a></li>
              </ul>
            </div>
          </div>

          {/* Section contact et réseaux sociaux */}
          <div className="border-t border-white/10 pt-12 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white font-semibold">contact@bankstatement-ai.fr</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-green-500 rounded-2xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Disponibilité</p>
                  <p className="text-white font-semibold">99.9% Uptime SLA</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-4">Suivez-nous</p>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-300">
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-300">
                    <Linkedin className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-300">
                    <Github className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Mentions légales étendues */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
              <div className="flex flex-wrap items-center space-x-6 text-sm">
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Politique de confidentialité</Link>
                <a href="#terms" className="text-gray-400 hover:text-white transition-colors">Conditions d&apos;utilisation</a>
                <a href="#cookies" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
                <a href="#gdpr" className="text-gray-400 hover:text-white transition-colors">RGPD</a>
                <a href="#security" className="text-gray-400 hover:text-white transition-colors">Sécurité</a>
              </div>
              <p className="text-gray-400 text-sm">© 2024 Bank Statement Converter IA. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
const BankStatementConverter = () => {
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [credits, setCredits] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCredits = localStorage.getItem('anonymousUserCredits');
      if (savedCredits !== null) {
        setCredits(parseInt(savedCredits, 10));
      }
    }
  }, []);

  // Callback appelé au début du processing
  const handleProcessingStart = useCallback(() => {
    setIsProcessing(true);
    setProcessingStep('Envoi du document pour analyse IA...');
  }, []);

  // Callback appelé pendant le processing pour mettre à jour l'étape
  const handleProcessingUpdate = useCallback((step: string) => {
    setProcessingStep(step);
  }, []);

  // Callback pour les documents validés avec succès
  const handleDocumentSuccess = useCallback((documentData: { 
    bankDetected?: string; 
    aiConfidence?: number; 
    totalTransactions?: number; 
    anomaliesDetected?: number;
    transactions?: Transaction[];
    processingTime?: number;
    aiCost?: number;
  }) => {
    setIsProcessing(false);
    setProcessingStep('');
    
    // Utiliser les vraies données de l'API
    const transactions = documentData.transactions || [];
    
    // Calculer les statistiques réelles à partir des transactions
    const totalDebits = transactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalCredits = transactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const avgConfidence = transactions.length > 0 
      ? transactions.reduce((sum, t) => sum + (t.confidence || 90), 0) / transactions.length
      : documentData.aiConfidence || 90;
    
    const realResults: AnalysisResults = {
      bankDetected: documentData.bankDetected || "Banque détectée",
      confidence: documentData.aiConfidence || 90,
      processingTime: documentData.processingTime || 2.5,
      aiCost: documentData.aiCost || 0.035,
      transactions: transactions,
      summary: { 
        totalTransactions: documentData.totalTransactions || transactions.length, 
        totalDebits: Math.round(totalDebits * 100) / 100, 
        totalCredits: Math.round(totalCredits * 100) / 100, 
        netFlow: Math.round((totalCredits + totalDebits) * 100) / 100, 
        avgConfidence: Math.round(avgConfidence * 10) / 10, 
        anomaliesDetected: documentData.anomaliesDetected || 0 
      }
    };
    
    setResults(realResults);
    
    // Décrémenter les crédits après une analyse réussie
    const newCredits = credits - 1;
    setCredits(newCredits);
    
    // Sauvegarder en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('anonymousUserCredits', newCredits.toString());
    }
    
  }, [credits]);

  const exportToCSV = () => {
    if (!results) return;
    const csvContent = [
      ['Date', 'Description', 'Montant', 'Catégorie', 'Sous-catégorie', 'Confiance IA', 'Score Anomalie'],
      ...results.transactions.map((t: Transaction) => [t.date, t.description, t.amount, t.category, t.subcategory, `${t.confidence}%`, t.anomalyScore])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${results.bankDetected.replace(' ', '_')}.csv`;
    a.click();
  };

  const exportToExcel = async () => {
    if (!results) return;
    
    try {
      // Import dynamique pour éviter les erreurs SSR
      const XLSX = await import('xlsx');
      
      // Préparer les données pour l'export
      const exportData = results.transactions.map((transaction: Transaction, index: number) => ({
        'N°': index + 1,
        'Date': transaction.date,
        'Description': transaction.description,
        'Description originale': transaction.originalDesc,
        'Montant (€)': transaction.amount,
        'Catégorie': transaction.category,
        'Sous-catégorie': transaction.subcategory,
        'Confiance IA (%)': `${transaction.confidence}%`,
        'Score anomalie': transaction.anomalyScore,
      }));

      // Créer le workbook et la worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Largeurs de colonnes optimisées
      const colWidths = [
        { wch: 5 },   // N°
        { wch: 12 },  // Date
        { wch: 30 },  // Description
        { wch: 35 },  // Description originale
        { wch: 15 },  // Montant
        { wch: 20 },  // Catégorie
        { wch: 20 },  // Sous-catégorie
        { wch: 15 },  // Confiance IA
        { wch: 15 },  // Score anomalie
      ];
      ws['!cols'] = colWidths;

      // Ajouter la feuille au workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

      // Générer le nom de fichier
      const fileName = `transactions_${results.bankDetected.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Télécharger le fichier
      XLSX.writeFile(wb, fileName);
      
    } catch (error) {
      console.error('Erreur lors de l\'export Excel:', error);
      alert('Erreur lors de l\'export Excel');
    }
  };

  // --- COMPOSANT : VUE DÉTAILLÉE DES RÉSULTATS ---
  const ResultsDetailView = ({ results, onClose }: { 
    results: AnalysisResults;
    onClose: () => void;
  }) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
        <X className="w-6 h-6" />
      </button>
      <div className="flex items-center space-x-3 mb-6">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-bold text-gray-900">Analyse IA Terminée</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
          <div className="text-2xl font-bold text-green-700">{results.confidence}%</div>
          <div className="text-sm text-green-600">Confiance IA</div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
          <div className="text-2xl font-bold text-orange-700">{results.summary.anomaliesDetected}</div>
          <div className="text-sm text-orange-600">Anomalies détectées</div>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 bg-gray-50/90 backdrop-blur-sm rounded-xl">
        <div>
          <div className="font-semibold text-gray-900">Banque détectée: {results.bankDetected}</div>
          <div className="text-sm text-gray-600">{results.summary.totalTransactions} transactions • Flux net: €{results.summary.netFlow}</div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={exportToCSV} className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm">
            <Download className="w-4 h-4" />
            <span>CSV</span>
          </button>
          <button onClick={exportToExcel} className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm">
            <Download className="w-4 h-4" />
            <span>Excel</span>
          </button>
        </div>
      </div>
    </div>
  );

  // --- COMPOSANT : LISTE DES TRANSACTIONS ---
  const TransactionsView = ({ results }: { results: AnalysisResults }) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Transactions extraites</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Date</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Description</th>
              <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Montant</th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Catégorie</th>
              <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">Score IA</th>
            </tr>
          </thead>
          <tbody>
            {results.transactions.map((transaction: Transaction) => {
              const rowClasses = `border-b border-gray-100 hover:bg-gray-50/50 ${transaction.anomalyScore > 5 ? 'bg-red-50/80 border-red-200' : ''}`;
              const amountClasses = `py-3 px-2 text-sm font-semibold text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`;
              const confidenceClasses = `text-sm font-medium ${transaction.confidence > 95 ? 'text-green-600' : transaction.confidence > 90 ? 'text-yellow-600' : 'text-red-600'}`;
              return (
                <tr key={transaction.id} className={rowClasses}>
                  <td className="py-3 px-2 text-sm text-gray-900">{transaction.date}</td>
                  <td className="py-3 px-2">
                    <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-xs text-gray-500">{transaction.originalDesc}</div>
                  </td>
                  <td className={amountClasses}>€{transaction.amount.toFixed(2)}</td>
                  <td className="py-3 px-2">
                    <div className="text-sm font-medium text-gray-900">{transaction.category}</div>
                    <div className="text-xs text-gray-500">{transaction.subcategory}</div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className={confidenceClasses}>{transaction.confidence.toFixed(1)}%</span>
                      {transaction.anomalyScore > 5 && (<AlertCircle className="w-4 h-4 text-red-500" />)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      {/* Arrière-plan animé */}
      <AnimatedGradientBackground />
      
      <Navigation />
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultMode="signup" />
      

      <main className="pt-24 md:pt-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Layout 2 colonnes comme le dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Colonne Loader/Résultat d'analyse avec transition */}
            <div className="relative">
              <AnimatePresence mode="wait">
                {results ? (
                  <motion.div
                    key="results-view"
                    initial={{ opacity: 0.5, scale: 0.98, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ResultsDetailView 
                      results={results} 
                      onClose={() => setResults(null)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload-form"
                    initial={{ opacity: 0.5, scale: 0.98, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    {/* Indicateur de crédits */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 p-3 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-sm text-gray-600">Crédits restants:</span>
                        <span className={`text-lg font-bold ${credits <= 0 ? 'text-red-600' : credits <= 1 ? 'text-orange-600' : 'text-green-600'}`}>
                          {credits}
                        </span>
                        {credits <= 0 && (
                          <span className="text-xs text-red-500 ml-2">
                            • Connectez-vous pour plus de crédits
                          </span>
                        )}
                        {/* Bouton pour ajouter un crédit en développement */}
                        {process.env.NODE_ENV === 'development' && (
                          <button 
                            onClick={() => setCredits(prev => prev + 1)}
                            className="ml-3 text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                          >
                            +1 crédit (dev)
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <DocumentUpload
                      credits={credits}
                      onCreditsChange={setCredits}  
                      onShowSignUpModal={() => setIsModalOpen(true)}
                      onProcessingStart={handleProcessingStart}
                      onProcessingUpdate={handleProcessingUpdate}
                      onDocumentUploaded={handleDocumentSuccess}
                      className="transition-all duration-300 hover:scale-105 hover:border-blue-600 hover:shadow-2xl hover:shadow-purple-500/30 relative group border-4 border-gray-200"
                      title="Téléversez votre relevé bancaire"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Colonne 2 avec transitions */}
            <div>
              <AnimatePresence mode="wait">
                {results ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0.5, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0.3, y: -15 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <TransactionsView results={results} />
                  </motion.div>
                ) : isProcessing ? (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0.5, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0.3, y: -15 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                      <h3 className="text-lg font-semibold text-gray-900">Analyse IA en cours...</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{processingStep}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300 animate-pulse"></div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0.5, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0.3, y: -15 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="h-full flex items-center justify-center"
                  >
                    <div className="text-center">
                      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        <span className="text-white">Transformez vos relevés en</span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent">
                          données IA
                        </span>
                      </h1>
                      <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Notre intelligence artificielle analyse automatiquement vos documents bancaires et catégorise chaque transaction avec une précision de 95%.
                      </p>
                      <Link 
                        href="/sign-up"
                        className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 text-white font-semibold py-4 px-8 rounded-2xl hover:shadow-2xl transition-all transform hover:scale-105 backdrop-blur-sm"
                      >
                        <Crown className="w-6 h-6" />
                        <span className="text-lg">Commencer gratuitement</span>
                        <ArrowRight className="w-6 h-6" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <PricingSection />
          <FAQSection />
          <TestimonialsSection />
          <motion.div 
            id="demo" 
            className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center relative z-10"
            initial={{ opacity: 0.4, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-2xl font-bold mb-4">🚀 BankStatement - Mon Banquier IA</h2>
            <p className="text-blue-100 max-w-3xl mx-auto">Pipeline IA complet : OCR → Détection banque → Analyse GPT-4 → Catégorisation → Détection des anomalies. Dans la version de production, une intégration réelle avec OpenAI + Google Cloud Vision est utilisée.</p>
            <div className="mt-6 flex justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5" /><span>Pipeline IA complet</span></div>
              <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5" /><span>Score de confiance</span></div>
              <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5" /><span>Détection d anomalies</span></div>
              <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5" /><span>Export structuré</span></div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BankStatementConverter;