'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Bot,
  Brain,
  CheckSquare,
  ChevronRight,
  Cpu,
  ExternalLink,
  Eye,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Settings,
  X,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaLinkedin } from 'react-icons/fa';
import { SiOpenai, SiPerplexity } from 'react-icons/si';

// Types
type CampaignData = {
  name: string;
  enabled: boolean;
  wizard: Array<'sequence' | 'prospects' | 'send'>;
};

type TabType = 'steps' | 'conditions';

type StepsData = {
  automatic: string[];
  manual: string[];
  other: string[];
  ai: string[];
};

export default function CreerCampagnePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('steps');
  const [campaign, setCampaign] = useState<CampaignData>({
    name: "Alternative94's campaign (4)",
    enabled: true,
    wizard: ['sequence', 'prospects', 'send']
  });

  const stepsData: StepsData = {
    automatic: [
      'Email',
      'Message de chat (LinkedIn)',
      'Message vocal (LinkedIn)',
      'AI Voice message (LinkedIn)',
      'Invitation (LinkedIn)',
      'Visiter le profil'
    ],
    manual: [
      'Appel (Créer une tâche)',
      'Tâche manuelle (Créer une tâche)'
    ],
    other: [
      'Appeler une API',
      'Envoyer à une autre campagne'
    ],
    ai: [
      'Perplexity (browse/generate/classify/analyze)',
      'OpenAI (generate/classify/analyze)'
    ]
  };

  const altMethods = ['create_with_ai', 'templates_library'];

  const toggleCampaign = () => {
    setCampaign(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  return (
    <div className="min-h-screen bg-[#ecf0f1]">
      {/* TopBar simplifiée */}
      <header 
        aria-label="Barre d'entête"
        className="bg-white shadow-sm border-b border-[#bdc3c7] p-4"
      >
        <div className="flex items-center justify-between">
          {/* Titre de la page avec bouton retour */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => router.push('/dashboard/marketing')}
              className="flex items-center gap-2 px-4 py-2 bg-[#2c3e50] text-white rounded-lg hover:bg-[#34495e] transition-all duration-200 text-sm font-medium shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Retour au Marketing"
            >
              <X className="h-4 w-4" />
              Retour au Marketing
            </motion.button>
            
            <div>
              <h1 className="text-2xl font-bold text-[#2c3e50] font-montserrat">
                Créer une campagne
              </h1>
              <p className="text-[#7f8c8d] text-sm">
                Configurez votre nouvelle campagne marketing
              </p>
            </div>
          </div>

          {/* Nom de la campagne + compteur */}
          <div className="flex items-center space-x-4">
            <input
              type="text"
              id="campaign-name"
              value={campaign.name}
              onChange={(e) => setCampaign(prev => ({ ...prev, name: e.target.value }))}
              className="text-xl font-semibold text-[#2c3e50] bg-transparent border-none outline-none"
            />
            
            {/* Interrupteur ON/OFF */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                id="campaign-enabled"
                checked={campaign.enabled}
                onChange={toggleCampaign}
                aria-label="Activer la campagne"
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${
                campaign.enabled ? 'bg-green-500' : 'bg-[#bdc3c7]'
              }`}>
                <div className={`w-4 h-4 bg-white rounded-full mt-1 transition-transform ${
                  campaign.enabled ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </div>
              <span className="text-sm text-[#7f8c8d]">
                {campaign.enabled ? 'ON' : 'OFF'}
              </span>
            </label>
          </div>

          {/* WizardSteps + Menu */}
          <div className="flex items-center space-x-4">
            <nav aria-label="Assistant d'étapes" className="flex items-center space-x-2">
              <ol className="flex items-center space-x-2">
                <li className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-[#2c3e50] text-white rounded text-sm">Séquence</span>
                  <ChevronRight className="h-4 w-4 text-[#7f8c8d]" />
                </li>
                <li className="flex items-center space-x-2">
                  <span className="px-3 py-1 text-[#7f8c8d] rounded text-sm">Liste de prospects</span>
                  <ChevronRight className="h-4 w-4 text-[#7f8c8d]" />
                </li>
                <li>
                  <span className="px-3 py-1 text-[#7f8c8d] rounded text-sm">Envoi</span>
                </li>
              </ol>
              <button className="px-4 py-2 bg-[#3498db] text-white rounded hover:bg-[#2980b9] transition-colors">
                Suivant
              </button>
            </nav>
            
            {/* Icône paramètres */}
            <button 
              id="settings"
              className="p-2 hover:bg-[#ecf0f1] rounded-lg transition-colors"
            >
              <Settings className="h-5 w-5 text-[#7f8c8d]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="p-6">
        {/* BuilderCard */}
        <section aria-labelledby="builder-title" className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* Header */}
          <header className="mb-6">
            <h1 id="builder-title" className="text-2xl font-bold text-[#2c3e50] mb-2">
              Construire ma campagne manuellement
            </h1>
            <p className="text-[#7f8c8d] mb-4">
              Choisir manuellement les étapes
            </p>
            
            {/* Tabs */}
            <nav role="tablist" aria-label="Onglets du builder" className="flex space-x-1 bg-[#ecf0f1] p-1 rounded-lg w-fit">
              <button
                role="tab"
                aria-selected={activeTab === 'steps'}
                onClick={() => setActiveTab('steps')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'steps'
                    ? 'bg-white text-[#2c3e50] shadow-sm'
                    : 'text-[#7f8c8d] hover:text-[#2c3e50]'
                }`}
              >
                Étapes
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'conditions'}
                onClick={() => setActiveTab('conditions')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'conditions'
                    ? 'bg-white text-[#2c3e50] shadow-sm'
                    : 'text-[#7f8c8d] hover:text-[#2c3e50]'
                }`}
              >
                Conditions
              </button>
            </nav>
          </header>

          {/* StepsGrid */}
          {activeTab === 'steps' && (
            <section aria-label="Liste des étapes">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Colonne A - Étapes automatiques */}
                <div role="region" aria-labelledby="auto-steps-title" className="space-y-4">
                  <h3 id="auto-steps-title" className="text-lg font-semibold text-[#2c3e50] flex items-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Étapes automatiques</span>
                  </h3>
                  <ul className="space-y-2">
                    {stepsData.automatic.map((step, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 border border-[#ecf0f1] rounded-lg cursor-pointer hover:border-[#3498db] hover:bg-[#ebf3fd] transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          {step.includes('LinkedIn') ? (
                            <FaLinkedin className="h-4 w-4 text-[#0077b5]" />
                          ) : step.includes('Email') ? (
                            <Mail className="h-4 w-4 text-[#7f8c8d]" />
                          ) : step.includes('Visiter') ? (
                            <Eye className="h-4 w-4 text-[#7f8c8d]" />
                          ) : step.includes('AI Voice') ? (
                            <Bot className="h-4 w-4 text-[#7f8c8d]" />
                          ) : (
                            <MessageCircle className="h-4 w-4 text-[#7f8c8d]" />
                          )}
                          <span className="text-sm text-[#2c3e50]">{step}</span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Colonne B - Exécution manuelle */}
                <div role="region" aria-labelledby="manual-steps-title" className="space-y-4">
                  <h3 id="manual-steps-title" className="text-lg font-semibold text-[#2c3e50] flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>Exécution manuelle</span>
                  </h3>
                  <ul className="space-y-2">
                    {stepsData.manual.map((step, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 border border-[#ecf0f1] rounded-lg cursor-pointer hover:border-[#e67e22] hover:bg-[#fdf2e9] transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          {step.includes('Appel') ? (
                            <Phone className="h-4 w-4 text-[#7f8c8d]" />
                          ) : (
                            <CheckSquare className="h-4 w-4 text-[#7f8c8d]" />
                          )}
                          <span className="text-sm text-[#2c3e50]">{step}</span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                  
                  {/* Autres étapes */}
                  <div>
                    <h4 className="text-md font-medium text-[#7f8c8d] mb-2">Autres étapes</h4>
                    <ul className="space-y-2">
                      {stepsData.other.map((step, index) => (
                        <motion.li
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="p-3 border border-[#ecf0f1] rounded-lg cursor-pointer hover:border-[#9b59b6] hover:bg-[#f4ecf7] transition-all"
                        >
                          <div className="flex items-center space-x-3">
                            {step.includes('API') ? (
                              <ExternalLink className="h-4 w-4 text-[#7f8c8d]" />
                            ) : (
                              <Send className="h-4 w-4 text-[#7f8c8d]" />
                            )}
                            <span className="text-sm text-[#2c3e50]">{step}</span>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Colonne C - AI steps */}
                <div role="region" aria-labelledby="ai-steps-title" className="space-y-4">
                  <h3 id="ai-steps-title" className="text-lg font-semibold text-[#2c3e50] flex items-center space-x-2">
                    <Cpu className="h-5 w-5" />
                    <span>AI steps</span>
                  </h3>
                  <ul className="space-y-2">
                    {stepsData.ai.map((step, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 border border-[#ecf0f1] rounded-lg cursor-pointer hover:border-[#1abc9c] hover:bg-[#e8f8f5] transition-all"
                      >
                        <div className="flex items-center space-x-3">
                          {step.includes('Perplexity') ? (
                            <SiPerplexity className="h-4 w-4 text-[#20b2aa]" />
                          ) : (
                            <SiOpenai className="h-4 w-4 text-[#10a37f]" />
                          )}
                          <span className="text-sm text-[#2c3e50]">{step}</span>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </div>

              </div>
            </section>
          )}

          {/* Tab Conditions */}
          {activeTab === 'conditions' && (
            <div className="text-center py-12">
              <Settings className="h-16 w-16 text-[#7f8c8d] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">
                Configuration des conditions
              </h3>
              <p className="text-[#7f8c8d]">
                Définissez les conditions d'exécution de votre campagne
              </p>
            </div>
          )}
        </section>

        {/* AlternativeMethods */}
        <section aria-label="Méthodes alternatives">
          <h2 className="text-xl font-bold text-[#2c3e50] mb-4">Méthodes alternatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Créer avec IA */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-6 bg-white rounded-xl shadow-sm border border-transparent hover:border-[#3498db] transition-all text-left"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-[#3498db]/10 rounded-lg">
                  <Bot className="h-6 w-6 text-[#3498db]" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#2c3e50] mb-2">Créer avec IA</h3>
              <p className="text-[#7f8c8d] text-sm">
                Laissez l'IA créer automatiquement votre campagne en fonction de vos objectifs
              </p>
            </motion.button>

            {/* Bibliothèque de modèles */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-6 bg-white rounded-xl shadow-sm border border-transparent hover:border-[#2c3e50] transition-all text-left"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-[#2c3e50]/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-[#2c3e50]" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#2c3e50] mb-2">Bibliothèque de modèles</h3>
              <p className="text-[#7f8c8d] text-sm">
                Choisissez parmi nos modèles pré-conçus et personnalisez selon vos besoins
              </p>
            </motion.button>

          </div>
        </section>
      </main>
    </div>
  );
}
