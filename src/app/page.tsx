'use client'

import React, { useState, useCallback } from 'react';
import { FileText, Brain, CheckCircle, AlertCircle, Download, Zap, Check, Crown, Sparkles, ArrowRight, Mail, Twitter, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';
import { SignUpModal } from '@/components/SignUpModal';
import { DocumentUpload } from '@/components/DocumentUpload';
import { Navigation } from '@/components/Navigation';
import AnimatedGradientBackground from '@/components/AnimatedGradientBackground';
import { motion } from 'framer-motion';

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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Des résultats concrets, d équipes comme la vôtre.
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez comment nos clients transforment leur processus comptable avec notre IA
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className={`relative bg-gradient-to-br ${testimonial.bgColor} rounded-2xl p-8 text-white shadow-2xl overflow-hidden group hover:scale-105 transition-all duration-300`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              {/* Effet de lueur en arrière-plan */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                {/* Métrique principale */}
                <div className="mb-6">
                  <div className="text-4xl lg:text-5xl font-bold mb-2">{testimonial.metric}</div>
                  <div className="text-lg opacity-90">{testimonial.description}</div>
                </div>

                {/* Citation */}
                <blockquote className="text-lg mb-8 leading-relaxed opacity-95 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                {/* Profil auteur */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{testimonial.author}</div>
                      <div className="opacity-80 text-sm">{testimonial.position}</div>
                      <div className="opacity-70 text-sm">{testimonial.company}</div>
                    </div>
                  </div>
                  
                  <motion.button 
                    className="bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-all duration-200 flex items-center space-x-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Découvrez</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Effet de particules subtle */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
            </motion.div>
          ))}
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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            <Zap className="w-6 h-6 text-blue-600" />            <span className="text-sm font-semibold uppercase tracking-wide">Tarifs boostés à notre IA</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Choisissez votre puissance <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">IA</span></h2>
          <p className="text-xl text-white max-w-3xl mx-auto">De notre analyse basique à notre IA sur-mesure, trouvez le plan parfait pour automatiser vos relevés bancaires avec une précision révolutionnaire.</p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {plans.map((plan, index) => {
            const cardClasses = `relative bg-white/90 backdrop-blur-sm rounded-2xl border-2 p-8 transition-all duration-500 ease-out transform ${plan.cardStyle} ${plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''} group cursor-pointer`;
            return (
              <motion.div 
                key={plan.name} 
                className={cardClasses}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                {plan.popular && (<div className="absolute -top-4 left-1/2 transform -translate-x-1/2"><div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">⭐ Plus populaire</div></div>)}
                <div className="flex justify-center mb-6">
                  <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-300">
                    {plan.name === "Gratuit" && <FileText className="w-8 h-8 text-gray-600" />}
                    {plan.name === "Intelligent" && <Brain className="w-8 h-8 text-blue-600" />}
                    {plan.name === "Professionnel" && <Crown className="w-8 h-8 text-purple-600" />}
                    {plan.name === "Entreprise" && <Sparkles className="w-8 h-8 text-yellow-600" />}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">{plan.name}</h3>
                <div className="text-center mb-4"><div className="flex items-baseline justify-center"><span className="text-5xl font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{plan.price}</span><span className="text-xl text-gray-500 ml-1">{plan.period}</span></div></div>
                <p className="text-gray-600 text-center mb-8 min-h-[48px] flex items-center justify-center">{plan.description}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3 group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${featureIndex * 50}ms` }}>
                      <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-green-200 transition-colors duration-300"><Check className="w-3 h-3 text-green-600" /></div>
                      <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 transform ${plan.buttonStyle} flex items-center justify-center space-x-2 relative overflow-hidden before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700`}>
                  <span>{plan.buttonText}</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"><div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div></div>
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="inline-flex items-center space-x-4 bg-green-50/90 backdrop-blur-sm border border-green-200 rounded-full px-6 py-3 hover:bg-green-100/90 transition-colors duration-300">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"><Check className="w-5 h-5 text-white" /></div>
            <span className="text-green-800 font-medium">Garantie 30 jours satisfait ou remboursé • Annulation en 1 clic</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

const Footer = () => {
  return (
    <motion.footer 
      className="py-16 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/2 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl shadow-black/5 relative overflow-hidden">
          {/* Effet de gradient subtil en arrière-plan */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5 rounded-3xl"></div>
          
          <div className="relative z-10 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"><Brain className="w-6 h-6 text-white" /></div>
                  <div><h3 className="text-xl font-bold">Bank Statement Converter IA</h3></div>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">La première solution qui utilise notre IA pour convertir vos relevés bancaires avec 99%+ de précision. Automatisez votre comptabilité en quelques clics.</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><Twitter className="w-5 h-5" /></a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
                  <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><Github className="w-5 h-5" /></a>
                </div>
              </div>
              <div><h4 className="text-lg font-semibold mb-6 text-white">Produit</h4><ul className="space-y-4"><li><a href="#features" className="text-gray-300 hover:text-white transition-colors">Fonctionnalités</a></li><li><a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Tarifs</a></li><li><a href="#demo" className="text-gray-300 hover:text-white transition-colors">Démo en direct</a></li></ul></div>
              <div><h4 className="text-lg font-semibold mb-6 text-white">Support</h4><ul className="space-y-4"><li><a href="#help" className="text-gray-300 hover:text-white transition-colors">Centre aide</a></li><li><a href="#contact" className="text-gray-300 hover:text-white transition-colors">Nous contacter</a></li><li><a href="#status" className="text-gray-300 hover:text-white transition-colors">Statut du service</a></li></ul></div>
              <div><h4 className="text-lg font-semibold mb-6 text-white">Légal</h4><ul className="space-y-4"><li><Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Politique de confidentialité</Link></li><li><a href="#terms" className="text-gray-300 hover:text-white transition-colors">Conditions utilisation</a></li><li><a href="#cookies" className="text-gray-300 hover:text-white transition-colors">Politique des cookies</a></li><li><a href="#gdpr" className="text-gray-300 hover:text-white transition-colors">Conformité RGPD</a></li><li><a href="#refund" className="text-gray-300 hover:text-white transition-colors">Politique de remboursement</a></li></ul></div>
            </div>
            
            <div className="border-t border-gray-700/50 mt-12 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300">contact@bankstatement-ai.fr</span>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700/50 mt-8 pt-8 text-center">
              <p className="text-gray-400">© 2024 Bank Statement Converter IA. Tous droits réservés.</p>
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

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCredits = localStorage.getItem('anonymousUserCredits');
      if (savedCredits !== null) {
        setCredits(parseInt(savedCredits, 10));
      }
    }
  }, []);

  // Callback pour les documents validés avec succès
  const handleDocumentSuccess = useCallback((documentData: { bankDetected?: string; aiConfidence?: number; totalTransactions?: number; anomaliesDetected?: number }) => {
    console.log('[HOMEPAGE] Document successfully processed:', documentData);
    
    // Convertir les données de l'API au format attendu par la homepage
    const mockResults: AnalysisResults = {
      bankDetected: documentData.bankDetected || "Banque détectée",
      confidence: documentData.aiConfidence || 95,
      processingTime: 3.2,
      aiCost: 0.041,
      transactions: [
        // Simulation de transactions pour la démonstration
        { id: 1, date: "2024-01-15", description: "VIREMENT SALAIRE ENTREPRISE", originalDesc: "VIR SALAIRE ENTREPRISE XYZ", amount: 3250.00, category: "Revenus", subcategory: "Salaire", confidence: 98.5, anomalyScore: 0.1 },
        { id: 2, date: "2024-01-16", description: "CARTE SUPERMARCHÉ", originalDesc: "CB LECLERC PONTAULT", amount: -87.45, category: "Alimentation", subcategory: "Supermarché", confidence: 95.2, anomalyScore: 0.0 },
        { id: 3, date: "2024-01-17", description: "PRELEVEMENT EDF", originalDesc: "PREL EDF REF:FAC123456", amount: -142.30, category: "Charges", subcategory: "Électricité", confidence: 97.8, anomalyScore: 0.2 }
      ],
      summary: { 
        totalTransactions: documentData.totalTransactions || 3, 
        totalDebits: -229.75, 
        totalCredits: 3250.00, 
        netFlow: 3020.25, 
        avgConfidence: 95.4, 
        anomaliesDetected: documentData.anomaliesDetected || 0 
      }
    };
    
    setResults(mockResults);
  }, []);

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

  return (
    <div className="min-h-screen relative">
      {/* Arrière-plan animé */}
      <AnimatedGradientBackground />
      
      <Navigation />
      <SignUpModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      

      <main className="pt-24 md:pt-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            id="features" 
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <DocumentUpload
                credits={credits}
                onCreditsChange={setCredits}  
                onShowSignUpModal={() => setIsModalOpen(true)}
                onDocumentUploaded={handleDocumentSuccess}
                className="transition-all duration-300 hover:scale-105 hover:border-blue-600 hover:shadow-2xl hover:shadow-purple-500/30 relative group border-4 border-gray-200"
                title="Téléversez votre relevé bancaire"
              />
            </motion.div>
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              {results && (
                <>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
                    <div className="flex items-center space-x-3 mb-6"><CheckCircle className="w-6 h-6 text-green-600" /><h3 className="text-xl font-bold text-gray-900">Analyse IA Terminée</h3></div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200"><div className="text-2xl font-bold text-green-700">{results.confidence}%</div><div className="text-sm text-green-600">Confiance IA</div></div>
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200"><div className="text-2xl font-bold text-blue-700">{results.processingTime}s</div><div className="text-sm text-blue-600">Temps d analyse</div></div>
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200"><div className="text-2xl font-bold text-purple-700">€{results.aiCost}</div><div className="text-sm text-purple-600">Coût IA</div></div>
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200"><div className="text-2xl font-bold text-orange-700">{results.summary.anomaliesDetected}</div><div className="text-sm text-orange-600">Anomalies détectées</div></div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50/90 backdrop-blur-sm rounded-xl">
                      <div><div className="font-semibold text-gray-900">Banque détectée: {results.bankDetected}</div><div className="text-sm text-gray-600">{results.summary.totalTransactions} transactions • Flux net: €{results.summary.netFlow}</div></div>
                      <button onClick={exportToCSV} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"><Download className="w-4 h-4" /><span>Export CSV</span></button>
                    </div>
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Transactions extraites</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead><tr className="border-b border-gray-200"><th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Date</th><th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Description</th><th className="text-right py-3 px-2 text-sm font-semibold text-gray-700">Montant</th><th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Catégorie</th><th className="text-center py-3 px-2 text-sm font-semibold text-gray-700">Score IA</th></tr></thead>
                        <tbody>
                          {results.transactions.map((transaction: Transaction) => {
                            const rowClasses = `border-b border-gray-100 hover:bg-gray-50/50 ${transaction.anomalyScore > 5 ? 'bg-red-50/80 border-red-200' : ''}`;
                            const amountClasses = `py-3 px-2 text-sm font-semibold text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`;
                            const confidenceClasses = `text-sm font-medium ${transaction.confidence > 95 ? 'text-green-600' : transaction.confidence > 90 ? 'text-yellow-600' : 'text-red-600'}`;
                            return (
                              <tr key={transaction.id} className={rowClasses}>
                                <td className="py-3 px-2 text-sm text-gray-900">{transaction.date}</td>
                                <td className="py-3 px-2"><div className="text-sm font-medium text-gray-900">{transaction.description}</div><div className="text-xs text-gray-500">{transaction.originalDesc}</div></td>
                                <td className={amountClasses}>€{transaction.amount.toFixed(2)}</td>
                                <td className="py-3 px-2"><div className="text-sm font-medium text-gray-900">{transaction.category}</div><div className="text-xs text-gray-500">{transaction.subcategory}</div></td>
                                <td className="py-3 px-2 text-center"><div className="flex items-center justify-center space-x-1"><span className={confidenceClasses}>{transaction.confidence.toFixed(1)}%</span>{transaction.anomalyScore > 5 && (<AlertCircle className="w-4 h-4 text-red-500" />)}</div></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
              {!results && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8 text-center transition-all duration-500 hover:translate-x-2 hover:shadow-lg hover:border-blue-200">
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-500 mb-2">En attente de notre analyse</h3>
                  <p className="text-gray-400">Téléversez un relevé bancaire PDF pour commencer.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
          <PricingSection />
          <TestimonialsSection />
          <motion.div 
            id="demo" 
            className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
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