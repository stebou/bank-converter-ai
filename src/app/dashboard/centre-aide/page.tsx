'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, FileText, CreditCard, Shield, Settings, Mail, MessageSquare } from 'lucide-react';

// --- COMPOSANTS DE LA PAGE ---

const HelpCenterHeader = () => (
  <div className="text-center py-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-12">
    {/* CORRECTION : L'apostrophe a été remplacée ici */}
    <h1 className="text-4xl font-bold text-gray-900">Centre d'Aide</h1>
    <p className="text-lg text-gray-600 mt-2">Comment pouvons-nous vous aider ?</p>
    <div className="mt-8 max-w-2xl mx-auto relative">
      <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Rechercher un article, un guide..."
        className="w-full p-4 pl-12 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
);

type CategoryCardProps = {
  icon: React.ElementType;
  title: string;
  description: string;
  count: number;
};

const CategoryCard = ({ icon: Icon, title, description, count }: CategoryCardProps) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer">
    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    <p className="text-sm text-gray-600 mt-1 mb-3">{description}</p>
    <p className="text-xs text-blue-600 font-medium">{count} articles</p>
  </div>
);

type FaqItemProps = {
  question: string;
  answer: string;
};

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <h4 className="font-medium text-gray-800">{question}</h4>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-600 text-sm">
          {answer}
        </div>
      )}
    </div>
  );
};

// --- COMPOSANT PRINCIPAL DE LA PAGE ---

export default function HelpCenterPage() {
  const categories = [
    { icon: FileText, title: 'Gestion des Documents', description: 'Uploader, traiter et exporter vos relevés.', count: 12 },
    { icon: CreditCard, title: 'Facturation & Crédits', description: 'Gérer votre abonnement et vos crédits.', count: 8 },
    { icon: Shield, title: 'Sécurité & Confidentialité', description: 'Protéger votre compte et vos données.', count: 5 },
    { icon: Settings, title: 'Paramètres du Compte', description: 'Configurer votre profil et vos préférences.', count: 7 },
  ];

  const faqs = [
    { question: 'Combien de temps mes fichiers sont-ils conservés ?', answer: 'Pour votre sécurité, les fichiers PDF que vous uploadez sont supprimés de nos serveurs 24 heures après leur traitement. Les données extraites restent disponibles dans votre historique.' },
    { question: 'Quels formats de fichiers sont supportés ?', answer: 'Nous supportons actuellement uniquement les fichiers au format PDF. La taille maximale par fichier est de 10Mo.' },
    // CORRECTION : Les apostrophes ont été remplacées ici
    { question: 'Que faire si l\'IA ne reconnaît pas ma banque ?', answer: 'Notre IA est entraînée sur la majorité des banques françaises. Si une banque n\'est pas reconnue, veuillez nous contacter via le support pour que nous puissions améliorer notre modèle.' },
    { question: 'Comment fonctionnent les crédits ?', answer: 'Chaque traitement de document consomme un crédit. Vous pouvez acheter des packs de crédits depuis la page de facturation dans vos réglages.' },
  ];
  
  // Correction pour le texte dynamique (il est préférable de le faire ici)
  const correctedFaqs = faqs.map(faq => ({
      ...faq,
      question: faq.question.replace(/'/g, "\u2019"), // Remplace par une apostrophe typographique
      answer: faq.answer.replace(/'/g, "\u2019")
  }));


  return (
    <div className="p-8">
      <HelpCenterHeader />

      {/* Catégories */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explorer par catégorie</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => <CategoryCard key={cat.title} {...cat} />)}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Section FAQ */}
        <section className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions fréquentes</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            {correctedFaqs.map(faq => <FaqItem key={faq.question} {...faq} />)}
          </div>
        </section>

        {/* Section Contact */}
        <aside>
          <div className="bg-blue-600 text-white p-8 rounded-xl sticky top-8">
            <h3 className="text-xl font-bold">Vous ne trouvez pas de réponse ?</h3>
            <p className="mt-2 text-blue-100 text-sm">Notre équipe est là pour vous aider. Contactez-nous et nous vous répondrons rapidement.</p>
            <div className="mt-6 space-y-4">
               <button className="w-full bg-white text-blue-700 font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition hover:bg-gray-100">
                  <MessageSquare className="w-5 h-5"/>
                  Chat en direct
               </button>
               <button className="w-full bg-blue-500 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition hover:bg-blue-400">
                  <Mail className="w-5 h-5"/>
                  Envoyer un e-mail
               </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}