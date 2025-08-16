'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  ChevronDown,
  CreditCard,
  FileText,
  HelpCircle,
  Mail,
  MessageSquare,
  Search,
  Settings,
  Shield,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import '../../../styles/fonts.css';

// --- COMPOSANT : HEADER MODERNE ---
const HelpCenterHeader = () => (
  <motion.div
    className="relative mb-12 overflow-hidden rounded-3xl border border-[#bdc3c7] bg-[#ecf0f1] py-16 text-center shadow-xl"
    initial={{ opacity: 0.3, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    <div className="relative z-10">
      <div className="mb-6 flex items-center justify-center gap-4">
        <div className="rounded-3xl bg-[#2c3e50] p-4 shadow-lg">
          <HelpCircle className="h-10 w-10 text-[#ecf0f1]" />
        </div>
        <div>
          <h1 className="font-montserrat text-5xl font-bold tracking-tight text-[#2c3e50]">
            Centre d&apos;Aide
          </h1>
          <p className="font-open-sans mt-2 text-lg text-[#34495e]">
            Comment pouvons-nous vous aider ?
          </p>
        </div>
      </div>

      <motion.div
        className="relative mx-auto mt-8 max-w-2xl"
        initial={{ opacity: 0.3, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <Search className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-[#bdc3c7]" />
        <input
          type="text"
          placeholder="Rechercher un article, un guide..."
          className="font-open-sans w-full rounded-2xl border border-[#bdc3c7] bg-white p-4 pl-14 text-[#2c3e50] placeholder-[#bdc3c7] shadow-lg transition-all duration-300 focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
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

const CategoryCard = ({
  icon: Icon,
  title,
  description,
  count,
  color,
  delay,
}: CategoryCardProps) => (
  <motion.div
    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-8 shadow-xl transition-all duration-300 hover:border-[#34495e] hover:shadow-2xl"
    initial={{ opacity: 0.3, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="relative z-10">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2c3e50] shadow-lg transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-7 w-7 text-[#ecf0f1]" />
      </div>
      <h3 className="font-montserrat mb-3 text-xl font-bold tracking-wide text-[#2c3e50] transition-colors duration-300 group-hover:text-[#34495e]">
        {title}
      </h3>
      <p className="font-open-sans mb-4 leading-relaxed text-[#34495e]">
        {description}
      </p>
      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-[#2c3e50]" />
        <p className="font-ibm-plex-mono text-sm font-medium tracking-wider text-[#2c3e50]">
          {count} articles
        </p>
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
      className="border-b border-[#bdc3c7] py-6 last:border-b-0"
      initial={{ opacity: 0.3, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between text-left"
      >
        <h4 className="font-montserrat pr-4 font-semibold tracking-wide text-[#2c3e50] transition-colors duration-200 group-hover:text-[#34495e]">
          {question}
        </h4>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <ChevronDown className="h-5 w-5 flex-shrink-0 text-[#bdc3c7] transition-colors duration-200 group-hover:text-[#2c3e50]" />
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
            <div className="font-open-sans mt-4 leading-relaxed text-[#34495e]">
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
    <div className="sticky top-8 overflow-hidden rounded-3xl border border-[#bdc3c7] bg-[#ecf0f1] p-8 shadow-xl">
      <div className="relative z-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-[#2c3e50] p-2">
            <MessageSquare className="h-6 w-6 text-[#ecf0f1]" />
          </div>
          <h3 className="font-montserrat text-xl font-bold tracking-wide text-[#2c3e50]">
            Besoin d&apos;aide ?
          </h3>
        </div>

        <p className="font-open-sans mb-6 leading-relaxed text-[#34495e]">
          Notre équipe est là pour vous aider. Contactez-nous et nous vous
          répondrons rapidement.
        </p>

        <div className="space-y-4">
          <motion.button
            className="font-open-sans flex w-full items-center justify-center gap-3 rounded-xl border border-[#bdc3c7] bg-white py-3 font-semibold text-[#2c3e50] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#bdc3c7]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare className="h-5 w-5" />
            Chat en direct
          </motion.button>

          <motion.button
            className="font-open-sans flex w-full items-center justify-center gap-3 rounded-xl bg-[#2c3e50] py-3 font-semibold text-[#ecf0f1] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#34495e]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mail className="h-5 w-5" />
            Envoyer un e-mail
          </motion.button>
        </div>

        {/* Stats de support */}
        <motion.div
          className="mt-6 border-t border-[#bdc3c7] pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="font-ibm-plex-mono text-lg font-bold tracking-wider text-[#2c3e50]">
                &lt; 2h
              </div>
              <div className="font-open-sans text-xs text-[#34495e]">
                Temps de réponse
              </div>
            </div>
            <div>
              <div className="font-ibm-plex-mono text-lg font-bold tracking-wider text-[#2c3e50]">
                24/7
              </div>
              <div className="font-open-sans text-xs text-[#34495e]">
                Disponibilité
              </div>
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
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: CreditCard,
      title: 'Facturation & Crédits',
      description: 'Gérer votre abonnement et vos crédits.',
      count: 8,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: Shield,
      title: 'Sécurité & Confidentialité',
      description: 'Protéger votre compte et vos données.',
      count: 5,
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Settings,
      title: 'Paramètres du Compte',
      description: 'Configurer votre profil et vos préférences.',
      count: 7,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const faqs = [
    {
      question: 'Combien de temps mes fichiers sont-ils conservés ?',
      answer:
        'Pour votre sécurité, les fichiers PDF que vous uploadez sont supprimés de nos serveurs 24 heures après leur traitement. Les données extraites restent disponibles dans votre historique pendant toute la durée de votre abonnement.',
    },
    {
      question: 'Quels formats de fichiers sont supportés ?',
      answer:
        "Nous supportons actuellement uniquement les fichiers au format PDF. La taille maximale par fichier est de 10Mo. Nous travaillons sur le support d'autres formats comme CSV et Excel.",
    },
    {
      question: "Que faire si l'IA ne reconnaît pas ma banque ?",
      answer:
        "Notre IA est entraînée sur la majorité des banques françaises et européennes. Si une banque n'est pas reconnue, veuillez nous contacter via le support pour que nous puissions améliorer notre modèle et ajouter votre banque.",
    },
    {
      question: 'Comment fonctionnent les crédits ?',
      answer:
        'Chaque traitement de document consomme un crédit. Le plan gratuit inclut 5 crédits par mois. Vous pouvez souscrire à un abonnement pour obtenir plus de crédits ou acheter des packs supplémentaires.',
    },
    {
      question: "L'analyse IA est-elle précise ?",
      answer:
        'Notre IA atteint une précision de plus de 95% sur les formats de relevés supportés. Elle détecte automatiquement les anomalies et catégorise les transactions. Les résultats peuvent être exportés et vérifiés.',
    },
    {
      question: 'Puis-je modifier les catégories détectées ?',
      answer:
        "Actuellement, les catégories sont automatiquement assignées par l'IA. Nous développons une fonctionnalité permettant de personnaliser et corriger les catégories dans une prochaine mise à jour.",
    },
  ];

  return (
    <div className="relative min-h-full overflow-hidden bg-[#bdc3c7] p-8">
      <div className="relative z-10 mx-auto max-w-7xl">
        <HelpCenterHeader />

        {/* Section Catégories */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="mb-8 flex items-center gap-3">
            <Zap className="h-6 w-6 text-[#2c3e50]" />
            <h2 className="font-montserrat text-3xl font-bold tracking-tight text-[#2c3e50]">
              Explorer par catégorie
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, index) => (
              <CategoryCard
                key={cat.title}
                {...cat}
                delay={0.4 + index * 0.1}
              />
            ))}
          </div>
        </motion.section>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Section FAQ */}
          <section className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0.3, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div className="mb-8 flex items-center gap-3">
                <HelpCircle className="h-6 w-6 text-[#2c3e50]" />
                <h2 className="font-montserrat text-3xl font-bold tracking-tight text-[#2c3e50]">
                  Questions fréquentes
                </h2>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-[#bdc3c7] bg-[#ecf0f1] p-8 shadow-xl">
                <div className="relative z-10">
                  {faqs.map((faq, index) => (
                    <FaqItem
                      key={faq.question}
                      {...faq}
                      delay={0.6 + index * 0.1}
                    />
                  ))}
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
          transition={{
            duration: 0.5,
            delay: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-[#bdc3c7] bg-[#ecf0f1] p-8 shadow-xl">
            <div className="relative z-10 text-center">
              <div className="mb-4 flex items-center justify-center gap-3">
                <div className="rounded-2xl bg-[#2c3e50] p-3">
                  <BookOpen className="h-8 w-8 text-[#ecf0f1]" />
                </div>
                <h3 className="font-montserrat text-2xl font-bold tracking-wide text-[#2c3e50]">
                  Ressources utiles
                </h3>
              </div>
              <p className="font-open-sans mx-auto mb-6 max-w-2xl leading-relaxed text-[#34495e]">
                Découvrez nos guides détaillés, tutoriels vidéo et bonnes
                pratiques pour tirer le meilleur parti de notre plateforme
                d&apos;analyse IA.
              </p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <motion.button
                  className="font-open-sans rounded-xl border border-[#bdc3c7] bg-white px-6 py-3 font-medium text-[#2c3e50] transition-all duration-300 hover:bg-[#bdc3c7]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📖 Guide de démarrage
                </motion.button>
                <motion.button
                  className="font-open-sans rounded-xl border border-[#34495e] bg-[#34495e] px-6 py-3 font-medium text-[#ecf0f1] transition-all duration-300 hover:bg-[#2c3e50]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🎥 Tutoriels vidéo
                </motion.button>
                <motion.button
                  className="font-open-sans rounded-xl border border-[#bdc3c7] bg-white px-6 py-3 font-medium text-[#2c3e50] transition-all duration-300 hover:bg-[#bdc3c7]"
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
