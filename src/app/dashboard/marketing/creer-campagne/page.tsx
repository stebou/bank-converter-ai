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
  Zap,
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
    wizard: ['sequence', 'prospects', 'send'],
  });

  const stepsData: StepsData = {
    automatic: [
      'Email',
      'Message de chat (LinkedIn)',
      'Message vocal (LinkedIn)',
      'AI Voice message (LinkedIn)',
      'Invitation (LinkedIn)',
      'Visiter le profil',
    ],
    manual: ['Appel (Créer une tâche)', 'Tâche manuelle (Créer une tâche)'],
    other: ['Appeler une API', 'Envoyer à une autre campagne'],
    ai: [
      'Perplexity (browse/generate/classify/analyze)',
      'OpenAI (generate/classify/analyze)',
    ],
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
        className="border-b border-[#bdc3c7] bg-white p-4 shadow-sm"
      >
        <div className="flex items-center justify-between">
          {/* Titre de la page avec bouton retour */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => router.push('/dashboard/marketing')}
              className="flex items-center gap-2 rounded-lg bg-[#2c3e50] px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:bg-[#34495e]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Retour au Marketing"
            >
              <X className="h-4 w-4" />
              Retour au Marketing
            </motion.button>

            <div>
              <h1 className="font-montserrat text-2xl font-bold text-[#2c3e50]">
                Créer une campagne
              </h1>
              <p className="text-sm text-[#7f8c8d]">
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
              onChange={e =>
                setCampaign(prev => ({ ...prev, name: e.target.value }))
              }
              className="border-none bg-transparent text-xl font-semibold text-[#2c3e50] outline-none"
            />

            {/* Interrupteur ON/OFF */}
            <label className="flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                id="campaign-enabled"
                checked={campaign.enabled}
                onChange={toggleCampaign}
                aria-label="Activer la campagne"
                className="sr-only"
              />
              <div
                className={`h-6 w-10 rounded-full transition-colors ${
                  campaign.enabled ? 'bg-green-500' : 'bg-[#bdc3c7]'
                }`}
              >
                <div
                  className={`mt-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    campaign.enabled ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </div>
              <span className="text-sm text-[#7f8c8d]">
                {campaign.enabled ? 'ON' : 'OFF'}
              </span>
            </label>
          </div>

          {/* WizardSteps + Menu */}
          <div className="flex items-center space-x-4">
            <nav
              aria-label="Assistant d'étapes"
              className="flex items-center space-x-2"
            >
              <ol className="flex items-center space-x-2">
                <li className="flex items-center space-x-2">
                  <span className="rounded bg-[#2c3e50] px-3 py-1 text-sm text-white">
                    Séquence
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#7f8c8d]" />
                </li>
                <li className="flex items-center space-x-2">
                  <span className="rounded px-3 py-1 text-sm text-[#7f8c8d]">
                    Liste de prospects
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#7f8c8d]" />
                </li>
                <li>
                  <span className="rounded px-3 py-1 text-sm text-[#7f8c8d]">
                    Envoi
                  </span>
                </li>
              </ol>
              <button className="rounded bg-[#3498db] px-4 py-2 text-white transition-colors hover:bg-[#2980b9]">
                Suivant
              </button>
            </nav>

            {/* Icône paramètres */}
            <button
              id="settings"
              className="rounded-lg p-2 transition-colors hover:bg-[#ecf0f1]"
            >
              <Settings className="h-5 w-5 text-[#7f8c8d]" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="p-6">
        {/* BuilderCard */}
        <section
          aria-labelledby="builder-title"
          className="mb-6 rounded-xl bg-white p-6 shadow-sm"
        >
          {/* Header */}
          <header className="mb-6">
            <h1
              id="builder-title"
              className="mb-2 text-2xl font-bold text-[#2c3e50]"
            >
              Construire ma campagne manuellement
            </h1>
            <p className="mb-4 text-[#7f8c8d]">
              Choisir manuellement les étapes
            </p>

            {/* Tabs */}
            <nav
              role="tablist"
              aria-label="Onglets du builder"
              className="flex w-fit space-x-1 rounded-lg bg-[#ecf0f1] p-1"
            >
              <button
                role="tab"
                aria-selected={activeTab === 'steps'}
                onClick={() => setActiveTab('steps')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
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
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
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
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Colonne A - Étapes automatiques */}
                <div
                  role="region"
                  aria-labelledby="auto-steps-title"
                  className="space-y-4"
                >
                  <h3
                    id="auto-steps-title"
                    className="flex items-center space-x-2 text-lg font-semibold text-[#2c3e50]"
                  >
                    <Zap className="h-5 w-5" />
                    <span>Étapes automatiques</span>
                  </h3>
                  <ul className="space-y-2">
                    {stepsData.automatic.map((step, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer rounded-lg border border-[#ecf0f1] p-3 transition-all hover:border-[#3498db] hover:bg-[#ebf3fd]"
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
                <div
                  role="region"
                  aria-labelledby="manual-steps-title"
                  className="space-y-4"
                >
                  <h3
                    id="manual-steps-title"
                    className="flex items-center space-x-2 text-lg font-semibold text-[#2c3e50]"
                  >
                    <Brain className="h-5 w-5" />
                    <span>Exécution manuelle</span>
                  </h3>
                  <ul className="space-y-2">
                    {stepsData.manual.map((step, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer rounded-lg border border-[#ecf0f1] p-3 transition-all hover:border-[#e67e22] hover:bg-[#fdf2e9]"
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
                    <h4 className="text-md mb-2 font-medium text-[#7f8c8d]">
                      Autres étapes
                    </h4>
                    <ul className="space-y-2">
                      {stepsData.other.map((step, index) => (
                        <motion.li
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          className="cursor-pointer rounded-lg border border-[#ecf0f1] p-3 transition-all hover:border-[#9b59b6] hover:bg-[#f4ecf7]"
                        >
                          <div className="flex items-center space-x-3">
                            {step.includes('API') ? (
                              <ExternalLink className="h-4 w-4 text-[#7f8c8d]" />
                            ) : (
                              <Send className="h-4 w-4 text-[#7f8c8d]" />
                            )}
                            <span className="text-sm text-[#2c3e50]">
                              {step}
                            </span>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Colonne C - AI steps */}
                <div
                  role="region"
                  aria-labelledby="ai-steps-title"
                  className="space-y-4"
                >
                  <h3
                    id="ai-steps-title"
                    className="flex items-center space-x-2 text-lg font-semibold text-[#2c3e50]"
                  >
                    <Cpu className="h-5 w-5" />
                    <span>AI steps</span>
                  </h3>
                  <ul className="space-y-2">
                    {stepsData.ai.map((step, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer rounded-lg border border-[#ecf0f1] p-3 transition-all hover:border-[#1abc9c] hover:bg-[#e8f8f5]"
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
            <div className="py-12 text-center">
              <Settings className="mx-auto mb-4 h-16 w-16 text-[#7f8c8d]" />
              <h3 className="mb-2 text-xl font-semibold text-[#2c3e50]">
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
          <h2 className="mb-4 text-xl font-bold text-[#2c3e50]">
            Méthodes alternatives
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Créer avec IA */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              className="rounded-xl border border-transparent bg-white p-6 text-left shadow-sm transition-all hover:border-[#3498db]"
            >
              <div className="mb-4 flex items-center space-x-4">
                <div className="rounded-lg bg-[#3498db]/10 p-3">
                  <Bot className="h-6 w-6 text-[#3498db]" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#2c3e50]">
                Créer avec IA
              </h3>
              <p className="text-sm text-[#7f8c8d]">
                Laissez l'IA créer automatiquement votre campagne en fonction de
                vos objectifs
              </p>
            </motion.button>

            {/* Bibliothèque de modèles */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              className="rounded-xl border border-transparent bg-white p-6 text-left shadow-sm transition-all hover:border-[#2c3e50]"
            >
              <div className="mb-4 flex items-center space-x-4">
                <div className="rounded-lg bg-[#2c3e50]/10 p-3">
                  <BookOpen className="h-6 w-6 text-[#2c3e50]" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-[#2c3e50]">
                Bibliothèque de modèles
              </h3>
              <p className="text-sm text-[#7f8c8d]">
                Choisissez parmi nos modèles pré-conçus et personnalisez selon
                vos besoins
              </p>
            </motion.button>
          </div>
        </section>
      </main>
    </div>
  );
}
