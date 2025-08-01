'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, FileText, CreditCard, Shield, Settings, Mail, MessageSquare, HelpCircle, BookOpen, Zap } from 'lucide-react';

// --- COMPOSANT : HEADER MODERNE ---
const HelpCenterHeader = () => (
  <motion.div 
    className="text-center py-16 bg-white/10 backdrop-blur-xl rounded-3xl mb-12 relative overflow-hidden border border-white/20"
    initial={{ opacity: 0.3, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {/* Effet glassmorphism */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-purple-500/20"></div>
    
    <div className="relative z-10">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="p-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl shadow-lg">
          <HelpCircle className="w-10 h-10 text-white" />
        </div>
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Centre d&apos;Aide
          </h1>
          <p className="text-gray-300 text-lg mt-2">Comment pouvons-nous vous aider ?</p>
        </div>
      </div>
      
      <motion.div 
        className="mt-8 max-w-2xl mx-auto relative"
        initial={{ opacity: 0.3, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <Search className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher un article, un guide..."
          className="w-full p-4 pl-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-gray-400 transition-all duration-300"
        />
      </motion.div>
    </div>
  </motion.div>
);

// --- COMPOSANT : CARTE DE CATÉGORIE MODERNE ---
type CategoryCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  count: number;
  color: string;
  delay: number;
};

const CategoryCard = ({ icon: Icon, title, description, count, color, delay }: CategoryCardProps) => (
  <motion.div 
    className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl hover:border-white/30 transition-all duration-300 cursor-pointer group relative overflow-hidden"
    initial={{ opacity: 0.3, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {/* Effet glassmorphism coloré */}
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
    
    <div className="relative z-10">
      <div className={`flex items-center justify-center w-14 h-14 bg-gradient-to-r ${color.replace('from-', 'from-').replace(' to-', ' to-')} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300">{title}</h3>
      <p className="text-gray-300 mb-4 leading-relaxed">{description}</p>
      <div className="flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-blue-400" />
        <p className="text-blue-300 font-medium">{count} articles</p>
      </div>
    </div>
  </motion.div>
);

// --- COMPOSANT : ÉLÉMENT FAQ MODERNE ---
type FaqItemProps = {
  question: string;
  answer: string;
  delay: number;
};

const FaqItem = ({ question, answer, delay }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      className="border-b border-white/10 py-6 last:border-b-0"
      initial={{ opacity: 0.3, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left group"
      >
        <h4 className="font-semibold text-white pr-4 group-hover:text-blue-300 transition-colors duration-200">{question}</h4>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors duration-200 flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="mt-4 text-gray-300 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// --- COMPOSANT : SECTION CONTACT MODERNE ---
const ContactSection = () => (
  <motion.aside
    initial={{ opacity: 0.3, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl sticky top-8 border border-white/20 relative overflow-hidden shadow-xl">
      {/* Effet glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-indigo-500/10 to-blue-500/20"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Besoin d&apos;aide ?</h3>
        </div>
        
        <p className="text-gray-300 mb-6 leading-relaxed">
          Notre équipe est là pour vous aider. Contactez-nous et nous vous répondrons rapidement.
        </p>
        
        <div className="space-y-4">
          <motion.button 
            className="w-full bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 border border-white/20 hover:from-white/30 hover:to-white/20 hover:scale-105 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare className="w-5 h-5"/>
            Chat en direct
          </motion.button>
          
          <motion.button 
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 hover:from-purple-600 hover:to-indigo-600 hover:scale-105 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="w-5 h-5"/>
            Envoyer un e-mail
          </motion.button>
        </div>
        
        {/* Stats de support */}
        <motion.div 
          className="mt-6 pt-6 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-white">&lt; 2h</div>
              <div className="text-xs text-gray-400">Temps de réponse</div>
            </div>
            <div>
              <div className="text-lg font-bold text-white">24/7</div>
              <div className="text-xs text-gray-400">Disponibilité</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </motion.aside>
);

// --- COMPOSANT PRINCIPAL DE LA PAGE ---
export default function HelpCenterPage() {
  const categories = [
    { 
      icon: FileText, 
      title: 'Gestion des Documents', 
      description: 'Uploader, traiter et exporter vos relevés bancaires.', 
      count: 12,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: CreditCard, 
      title: 'Facturation & Crédits', 
      description: 'Gérer votre abonnement et vos crédits.', 
      count: 8,
      color: 'from-emerald-500 to-emerald-600'
    },
    { 
      icon: Shield, 
      title: 'Sécurité & Confidentialité', 
      description: 'Protéger votre compte et vos données.', 
      count: 5,
      color: 'from-red-500 to-red-600'
    },
    { 
      icon: Settings, 
      title: 'Paramètres du Compte', 
      description: 'Configurer votre profil et vos préférences.', 
      count: 7,
      color: 'from-purple-500 to-purple-600'
    },
  ];

  const faqs = [
    { 
      question: 'Combien de temps mes fichiers sont-ils conservés ?', 
      answer: 'Pour votre sécurité, les fichiers PDF que vous uploadez sont supprimés de nos serveurs 24 heures après leur traitement. Les données extraites restent disponibles dans votre historique pendant toute la durée de votre abonnement.' 
    },
    { 
      question: 'Quels formats de fichiers sont supportés ?', 
      answer: 'Nous supportons actuellement uniquement les fichiers au format PDF. La taille maximale par fichier est de 10Mo. Nous travaillons sur le support d\'autres formats comme CSV et Excel.' 
    },
    { 
      question: 'Que faire si l\'IA ne reconnaît pas ma banque ?', 
      answer: 'Notre IA est entraînée sur la majorité des banques françaises et européennes. Si une banque n\'est pas reconnue, veuillez nous contacter via le support pour que nous puissions améliorer notre modèle et ajouter votre banque.' 
    },
    { 
      question: 'Comment fonctionnent les crédits ?', 
      answer: 'Chaque traitement de document consomme un crédit. Le plan gratuit inclut 5 crédits par mois. Vous pouvez souscrire à un abonnement pour obtenir plus de crédits ou acheter des packs supplémentaires.' 
    },
    { 
      question: 'L\'analyse IA est-elle précise ?', 
      answer: 'Notre IA atteint une précision de plus de 95% sur les formats de relevés supportés. Elle détecte automatiquement les anomalies et catégorise les transactions. Les résultats peuvent être exportés et vérifiés.' 
    },
    { 
      question: 'Puis-je modifier les catégories détectées ?', 
      answer: 'Actuellement, les catégories sont automatiquement assignées par l\'IA. Nous développons une fonctionnalité permettant de personnaliser et corriger les catégories dans une prochaine mise à jour.' 
    }
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-full relative overflow-hidden">
      {/* Effet glassmorphism moderne pour la page centre d'aide */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-purple-500/10"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <HelpCenterHeader />

        {/* Section Catégories */}
        <motion.section 
          className="mb-16"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-6 h-6 text-indigo-400" />
            <h2 className="text-3xl font-bold text-white">Explorer par catégorie</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, index) => 
              <CategoryCard key={cat.title} {...cat} delay={0.4 + index * 0.1} />
            )}
          </div>
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Section FAQ */}
          <section className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0.3, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-center gap-3 mb-8">
                <HelpCircle className="w-6 h-6 text-blue-400" />
                <h2 className="text-3xl font-bold text-white">Questions fréquentes</h2>
              </div>
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10"></div>
                <div className="relative z-10">
                  {faqs.map((faq, index) => 
                    <FaqItem key={faq.question} {...faq} delay={0.6 + index * 0.1} />
                  )}
                </div>
              </div>
            </motion.div>
          </section>

          {/* Section Contact */}
          <ContactSection />
        </div>

        {/* Section Ressources supplémentaires */}
        <motion.section 
          className="mt-16"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20"></div>
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">Ressources utiles</h3>
              </div>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Découvrez nos guides détaillés, tutoriels vidéo et bonnes pratiques pour tirer le meilleur parti de notre plateforme d&apos;analyse IA.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button 
                  className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-xl border border-blue-400/30 hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📖 Guide de démarrage
                </motion.button>
                <motion.button 
                  className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-xl border border-purple-400/30 hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎥 Tutoriels vidéo
                </motion.button>
                <motion.button 
                  className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 backdrop-blur-sm text-white font-medium py-3 px-6 rounded-xl border border-emerald-400/30 hover:from-emerald-500/30 hover:to-emerald-600/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ⚡ Bonnes pratiques
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}