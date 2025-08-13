'use client';

import { motion } from 'framer-motion';
import {
    BookOpen,
    Bot,
    Brain,
    CheckSquare,
    ChevronRight,
    Eye,
    Mail,
    Phone,
    Send,
    Settings,
    UserPlus,
    Zap
} from 'lucide-react';
import { useState } from 'react';
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
      { id: 'phone-call', name: 'Appel téléphonique', icon: Phone },
      { id: 'task', name: 'Tâche', icon: CheckSquare }
    ],
    manual: [
      { id: 'manual-email', name: 'Email', icon: Mail },
      { id: 'manual-task', name: 'Tâche', icon: CheckSquare }
    ]
  };

  const alternativeOptions = [
    {
      id: 'enrichment',
      icon: UserPlus,
      color: '#2c3e50',
      title: 'Enrichissement de prospects',
      description: 'Ajoutez automatiquement des informations détaillées sur vos prospects'
    },
    {
      id: 'engagement',
      icon: Eye,
      color: '#2c3e50',
      title: 'Suivi d\'engagement',
      description: 'Surveillez et analysez l\'engagement de vos prospects en temps réel'
    },
    {
      id: 'ai-linkedin',
      icon: SiOpenai,
      color: '#10a37f',
      title: 'IA LinkedIn avec OpenAI',
      description: 'Automatisez vos interactions LinkedIn avec l\'intelligence artificielle avancée'
    },
    {
      id: 'ai-perplexity',
      icon: SiPerplexity,
      color: '#20b2aa',
      title: 'Recherche IA avec Perplexity',
      description: 'Effectuez des recherches approfondies sur vos prospects avec l\'IA'
    },
    {
      id: 'ai-linkedin-native',
      icon: FaLinkedin,
      color: '#0077b5',
      title: 'IA LinkedIn native',
      description: 'Utilisez les outils d\'IA intégrés directement dans LinkedIn'
    },
    {
      id: 'templates',
      icon: BookOpen,
      color: '#2c3e50',
      title: 'Bibliothèque de modèles',
      description: 'Choisissez parmi nos modèles pré-conçus et personnalisez selon vos besoins'
    }
  ];

  return (
    <div className="min-h-screen bg-[#ecf0f1] p-6">
      {/* En-tête de campagne */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={campaign.name}
              onChange={(e) => setCampaign(prev => ({ ...prev, name: e.target.value }))}
              className="text-2xl font-bold text-[#2c3e50] bg-transparent border-none outline-none"
            />
            <div className="flex items-center space-x-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={campaign.enabled}
                  onChange={toggleCampaign}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  campaign.enabled ? 'bg-green-500' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    campaign.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </div>
              </label>
              <span className="text-sm text-[#7f8c8d]">
                {campaign.enabled ? 'Activée' : 'Désactivée'}
              </span>
            </div>
          </div>
          <Settings className="h-5 w-5 text-[#7f8c8d] cursor-pointer hover:text-[#2c3e50]" />
        </div>
      </motion.div>

      {/* Navigation principale */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm p-6 mb-6"
      >
        <div className="flex items-center space-x-8">
          <button
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              campaign.currentStep === 'sequence' 
                ? 'bg-[#2c3e50] text-white' 
                : 'text-[#7f8c8d] hover:text-[#2c3e50]'
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>1. Séquence</span>
          </button>
          <ChevronRight className="h-4 w-4 text-[#7f8c8d]" />
          <button
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              campaign.currentStep === 'prospects' 
                ? 'bg-[#2c3e50] text-white' 
                : 'text-[#7f8c8d] hover:text-[#2c3e50]'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>2. Prospects</span>
          </button>
          <ChevronRight className="h-4 w-4 text-[#7f8c8d]" />
          <button
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              campaign.currentStep === 'send' 
                ? 'bg-[#2c3e50] text-white' 
                : 'text-[#7f8c8d] hover:text-[#2c3e50]'
            }`}
          >
            <Send className="h-4 w-4" />
            <span>3. Envoyer</span>
          </button>
        </div>
      </motion.div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar des onglets */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('steps')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'steps' 
                  ? 'bg-[#2c3e50] text-white' 
                  : 'text-[#7f8c8d] hover:bg-[#ecf0f1]'
              }`}
            >
              Étapes
            </button>
            <button
              onClick={() => setActiveTab('conditions')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'conditions' 
                  ? 'bg-[#2c3e50] text-white' 
                  : 'text-[#7f8c8d] hover:bg-[#ecf0f1]'
              }`}
            >
              Conditions
            </button>
          </div>
        </motion.div>

        {/* Zone de construction */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6"
        >
          <div className="text-center py-12">
            <Bot className="h-16 w-16 text-[#7f8c8d] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">
              Construisez votre séquence
            </h3>
            <p className="text-[#7f8c8d] mb-6">
              Glissez-déposez les étapes depuis la bibliothèque pour créer votre campagne
            </p>
            <div className="flex justify-center space-x-4">
              <button className="flex items-center space-x-2 px-6 py-3 bg-[#2c3e50] text-white rounded-lg hover:bg-[#34495e] transition-colors">
                <Zap className="h-4 w-4" />
                <span>Étape automatique</span>
              </button>
              <button className="flex items-center space-x-2 px-6 py-3 border border-[#2c3e50] text-[#2c3e50] rounded-lg hover:bg-[#ecf0f1] transition-colors">
                <Brain className="h-4 w-4" />
                <span>Étape manuelle</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bibliothèque d'étapes */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h3 className="text-lg font-semibold text-[#2c3e50] mb-4">Bibliothèque</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-[#7f8c8d] mb-2">Automatique</h4>
              <div className="space-y-2">
                {stepsData.automatic.map((step) => {
                  const IconComponent = step.icon;
                  return (
                    <motion.div
                      key={step.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-3 p-3 border border-[#ecf0f1] rounded-lg cursor-pointer hover:border-[#2c3e50] transition-colors"
                    >
                      {step.id.includes('linkedin') ? (
                        <FaLinkedin className="h-4 w-4 text-[#0077b5]" />
                      ) : (
                        <IconComponent className="h-4 w-4 text-[#7f8c8d]" />
                      )}
                      <span className="text-sm text-[#2c3e50]">{step.name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-[#7f8c8d] mb-2">Manuel</h4>
              <div className="space-y-2">
                {stepsData.manual.map((step) => {
                  const IconComponent = step.icon;
                  return (
                    <motion.div
                      key={step.id}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-3 p-3 border border-[#ecf0f1] rounded-lg cursor-pointer hover:border-[#2c3e50] transition-colors"
                    >
                      <IconComponent className="h-4 w-4 text-[#7f8c8d]" />
                      <span className="text-sm text-[#2c3e50]">{step.name}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section Méthodes alternatives */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <h2 className="text-2xl font-bold text-[#2c3e50] mb-6">Méthodes alternatives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alternativeOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-xl shadow-sm p-6 cursor-pointer border border-transparent hover:border-[#2c3e50] transition-all"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${option.color}10` }}
                  >
                    <IconComponent 
                      className="h-6 w-6" 
                      style={{ color: option.color }}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#2c3e50] mb-2">{option.title}</h3>
                <p className="text-[#7f8c8d] text-sm">
                  {option.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
