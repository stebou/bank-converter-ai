'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Sun, Moon, Trash2, Download, Settings } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

// Données simulées pour l'exemple
const userSettings = {
  plan: 'Smart',
  billingDate: '15 de chaque mois',
  paymentMethod: {
    type: 'Visa',
    last4: '4242',
  },
  theme: 'light',
};

// --- COMPOSANTS DE LA PAGE RÉGLAGES ---

const SettingsHeader = () => (
  <motion.header 
    className="mb-10"
    initial={{ opacity: 0.3, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    <div className="flex items-center gap-4 mb-2">
      <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl shadow-lg">
        <Settings className="w-8 h-8 text-white" />
      </div>
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Réglages
        </h1>
        <p className="text-gray-300 text-lg">Gérez les paramètres de votre compte et vos préférences</p>
      </div>
    </div>
  </motion.header>
);

// --- CONTENU DES ONGLETS ---

const AccountTab = () => (
  <div className="space-y-8">
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-transparent"></div>
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-white mb-4">Exporter vos données</h3>
        <p className="text-sm text-gray-300 mb-4">
          Vous pouvez demander une archive de toutes les données que nous détenons vous concernant, conformément au RGPD.
        </p>
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105">
          <Download className="w-4 h-4"/>
          Demander une archive
        </button>
      </div>
    </div>
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-red-400/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-red-400/10 to-transparent"></div>
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-red-400 mb-4">Zone de Danger</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-white">Supprimer le compte</p>
            <p className="text-sm text-gray-300">
              Cette action est irréversible. Toutes vos données seront définitivement supprimées.
            </p>
          </div>
          <button className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105">
            <Trash2 className="w-4 h-4"/>
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  </div>
);

const SecurityTab = () => (
  <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-purple-400/10 to-transparent"></div>
    <div className="relative z-10">
      <h3 className="text-lg font-semibold text-white mb-6">Authentification à deux facteurs (2FA)</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-white">Statut de la 2FA</p>
          <p className="text-sm text-gray-300">
            Protégez votre compte contre les accès non autorisés.
          </p>
        </div>
        <button className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:scale-105">
          Activer la 2FA
        </button>
      </div>
    </div>
  </div>
);

// La facturation a été déplacée vers /dashboard/facturation

const AppearanceTab = () => {
    const [theme, setTheme] = useState(userSettings.theme);

    return (
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-indigo-400/10 to-transparent"></div>
            <div className="relative z-10">
                <h3 className="text-lg font-semibold text-white mb-4">Thème de l&apos;application</h3>
                <p className="text-sm text-gray-300 mb-6">Choisissez votre préférence d&apos;affichage.</p>
                <div className="flex space-x-4">
                    <button 
                        onClick={() => setTheme('light')} 
                        className={`flex-1 p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                            theme === 'light' 
                                ? 'border-blue-400 bg-blue-500/20 backdrop-blur-sm' 
                                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                        }`}
                    >
                        <Sun className={`w-8 h-8 mb-2 ${theme === 'light' ? 'text-blue-300' : 'text-gray-300'}`}/>
                        <span className={`font-medium ${theme === 'light' ? 'text-blue-200' : 'text-gray-300'}`}>Clair</span>
                    </button>
                    <button 
                        onClick={() => setTheme('dark')} 
                        className={`flex-1 p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                            theme === 'dark' 
                                ? 'border-purple-400 bg-purple-500/20 backdrop-blur-sm' 
                                : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                        }`}
                    >
                        <Moon className={`w-8 h-8 mb-2 ${theme === 'dark' ? 'text-purple-300' : 'text-gray-300'}`}/>
                        <span className={`font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-300'}`}>Sombre</span>
                    </button>
                </div>
            </div>
        </div>
    )
};

type TabId = 'account' | 'security' | 'appearance';

type TabsProps = {
  activeTab: TabId;
  setActiveTab: React.Dispatch<React.SetStateAction<TabId>>;
};

const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'account', label: 'Compte', icon: User },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Sun },
  ];

  return (
    <div className="border-b border-white/20 mb-8">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-all duration-200
              ${activeTab === tab.id
                ? 'border-green-400 text-green-400'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
              }`}
          >
            <tab.icon className="w-5 h-5" />
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL DE LA PAGE ---

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('account');

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-full relative overflow-hidden">
      {/* Effet glassmorphism moderne pour la page réglages */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <SettingsHeader />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <motion.div
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {activeTab === 'account' && <AccountTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'appearance' && <AppearanceTab />}
        </motion.div>
      </div>
    </div>
  );
}