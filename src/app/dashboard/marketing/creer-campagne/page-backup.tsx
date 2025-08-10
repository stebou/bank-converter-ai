'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  ChevronRight, 
  Mail, 
  MessageCircle, 
  Mic, 
  Bot, 
  UserPlus, 
  Eye,
  Phone,
  CheckSquare,
  Zap,
  Send,
  Brain,
  BookOpen
} from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa';
import { SiOpenai, SiPerplexity } from 'react-icons/si';

// Types pour la campagne
type CampaignData = {
  name: string;
  enabled: boolean;
  currentStep: 'sequence' | 'prospects' | 'send';
};

type TabType = 'steps' | 'conditions';

export default function CreerCampagnePage() {
  const [activeTab, setActiveTab] = useState<TabType>('steps');
  const [campaign, setCampaign] = useState<CampaignData>({
    name: "Nouvelle campagne (1)",
    enabled: true,
    currentStep: 'sequence'
  });

  const toggleCampaign = () => {
    setCampaign(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  // Mock steps data
  const stepsData = {
    automatic: [
      { id: 'email', name: 'Email', icon: Mail },
      { id: 'chat-message', name: 'Message de chat (LinkedIn)', icon: FaLinkedin },
      { id: 'voice-message', name: 'Message vocal (LinkedIn)', icon: FaLinkedin },
      { id: 'ai-voice-message', name: 'AI Voice message (LinkedIn)', icon: FaLinkedin },
      { id: 'invitation', name: 'Invitation (LinkedIn)', icon: FaLinkedin },
      { id: 'visit-profile', name: 'Visiter le profil', icon: Eye }
    ],
    manual: [
      { id: 'call-task', name: 'Appel (Créer une tâche)', icon: Phone },
      { id: 'manual-task', name: 'Tâche manuelle (Créer une tâche)', icon: CheckSquare }
    ],
    other: [
      { id: 'call-api', name: 'Appeler une API', icon: Zap },
      { id: 'send-to-other-campaign', name: 'Envoyer à une autre campagne', icon: Send }
    ],
    ai: [
      { id: 'perplexity', name: 'Perplexity (browse/generate/classify/analyze)', icon: SiPerplexity },
      { id: 'openai', name: 'OpenAI (generate/classify/analyze)', icon: SiOpenai }
    ]
  };

  const wizardSteps = [
    { id: 'sequence', name: 'Séquence', active: campaign.currentStep === 'sequence' },
    { id: 'prospects', name: 'Liste de prospects', active: campaign.currentStep === 'prospects' },
    { id: 'send', name: 'Envoi', active: campaign.currentStep === 'send' }
  ];

  return (
    <div className="p-6">
      {/* Campaign Info Bar */}
      <div className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6 mb-6">
        <div className="flex items-center justify-between">
          {/* Partie gauche - Nom + Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#2c3e50]">{campaign.name}</h1>
              
              <div className="flex items-center gap-2">
                <span className={`text-sm ${campaign.enabled ? 'text-[#27ae60]' : 'text-[#95a5a6]'}`}>
                  {campaign.enabled ? 'ON' : 'OFF'}
                </span>
                <button
                  onClick={toggleCampaign}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    campaign.enabled ? 'bg-[#27ae60]' : 'bg-[#bdc3c7]'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      campaign.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <button className="p-2 rounded-lg bg-[#ecf0f1] hover:bg-[#bdc3c7] transition-colors">
              <Settings className="h-5 w-5 text-[#2c3e50]" />
            </button>
          </div>

          {/* Partie droite - Wizard Steps */}
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2">
              {wizardSteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    step.active 
                      ? 'bg-[#2c3e50] text-white' 
                      : 'bg-[#ecf0f1] text-[#7f8c8d]'
                  }`}>
                    {step.name}
                  </div>
                  {index < wizardSteps.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-[#bdc3c7] mx-1" />
                  )}
                </div>
              ))}
            </nav>
            
            <motion.button
              className="px-4 py-2 bg-[#2c3e50] text-white rounded-lg hover:bg-[#34495e] transition-colors text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Suivant
            </motion.button>
          </div>
        </div>
      </div>
        {/* Builder Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6 mb-6"
        >
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">
              Construire ma campagne manuellement
            </h2>
            <p className="text-[#7f8c8d] mb-4">
              Choisir manuellement les étapes
            </p>

            {/* Tabs */}
            <div className="flex border-b border-[#bdc3c7]">
              <button
                onClick={() => setActiveTab('steps')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'steps'
                    ? 'border-[#2c3e50] text-[#2c3e50]'
                    : 'border-transparent text-[#7f8c8d] hover:text-[#2c3e50]'
                }`}
              >
                Étapes
              </button>
              <button
                onClick={() => setActiveTab('conditions')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'conditions'
                    ? 'border-[#2c3e50] text-[#2c3e50]'
                    : 'border-transparent text-[#7f8c8d] hover:text-[#2c3e50]'
                }`}
              >
                Conditions
              </button>
            </div>
          </div>

          {/* Steps Grid */}
          {activeTab === 'steps' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Colonne A - Étapes automatiques */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#2c3e50] border-b border-[#ecf0f1] pb-2">
                  Étapes automatiques
                </h3>
                <div className="space-y-2">
                  {stepsData.automatic.map((step) => (
                    <motion.div
                      key={step.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#ecf0f1] hover:bg-[#bdc3c7] cursor-pointer transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <step.icon 
                        className={`h-5 w-5 ${
                          step.id.includes('chat-message') || step.id.includes('voice-message') || step.id.includes('ai-voice-message') || step.id.includes('invitation')
                            ? 'text-[#0077b5]' // LinkedIn blue
                            : 'text-[#2c3e50]'
                        }`} 
                      />
                      <span className="text-sm font-medium text-[#2c3e50]">{step.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Colonne B - Exécution manuelle */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#2c3e50] border-b border-[#ecf0f1] pb-2">
                  Exécution manuelle
                </h3>
                <div className="space-y-2">
                  {stepsData.manual.map((step) => (
                    <motion.div
                      key={step.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#ecf0f1] hover:bg-[#bdc3c7] cursor-pointer transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <step.icon className="h-5 w-5 text-[#2c3e50]" />
                      <span className="text-sm font-medium text-[#2c3e50]">{step.name}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Autres étapes */}
                <div className="mt-6">
                  <h4 className="text-md font-medium text-[#34495e] mb-3 border-b border-[#ecf0f1] pb-1">
                    Autres étapes
                  </h4>
                  <div className="space-y-2">
                    {stepsData.other.map((step) => (
                      <motion.div
                        key={step.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-[#ecf0f1] hover:bg-[#bdc3c7] cursor-pointer transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <step.icon className="h-5 w-5 text-[#2c3e50]" />
                        <span className="text-sm font-medium text-[#2c3e50]">{step.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Colonne C - AI steps */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#2c3e50] border-b border-[#ecf0f1] pb-2">
                  AI steps
                </h3>
                <div className="space-y-2">
                  {stepsData.ai.map((step) => (
                    <motion.div
                      key={step.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-[#ecf0f1] hover:bg-[#bdc3c7] cursor-pointer transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <step.icon 
                        className={`h-5 w-5 ${
                          step.id === 'openai' 
                            ? 'text-[#10a37f]' // OpenAI green
                            : step.id === 'perplexity'
                            ? 'text-[#20b2aa]' // Perplexity teal
                            : 'text-[#2c3e50]'
                        }`} 
                      />
                      <span className="text-sm font-medium text-[#2c3e50]">{step.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Conditions Tab (placeholder) */}
          {activeTab === 'conditions' && (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-[#bdc3c7] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#7f8c8d] mb-2">Conditions</h3>
              <p className="text-[#95a5a6]">Configuration des conditions en développement</p>
            </div>
          )}
        </motion.div>

        {/* Alternative Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Créer avec IA */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6 cursor-pointer hover:shadow-2xl transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="bg-[#3498db] rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#2c3e50] mb-2">Créer avec IA</h3>
              <p className="text-[#7f8c8d] text-sm">
                Laissez l'IA créer automatiquement votre campagne en fonction de vos objectifs
              </p>
            </div>
          </motion.div>

          {/* Bibliothèque de modèles */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6 cursor-pointer hover:shadow-2xl transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <div className="bg-[#9b59b6] rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#2c3e50] mb-2">Bibliothèque de modèles</h3>
              <p className="text-[#7f8c8d] text-sm">
                Choisissez parmi nos modèles pré-conçus et personnalisez selon vos besoins
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
