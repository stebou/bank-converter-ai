'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Sun, Moon, Trash2, Download, Settings } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import '../../../styles/fonts.css';

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
      <div className="p-3 bg-[#2c3e50] rounded-2xl shadow-lg">
        <Settings className="w-8 h-8 text-white" />
      </div>
      <div>
        <h1 className="text-4xl font-bold text-[#2c3e50] font-montserrat tracking-tight">
          Réglages
        </h1>
        <p className="text-[#34495e] text-lg font-open-sans">Gérez les paramètres de votre compte et vos préférences</p>
      </div>
    </div>
  </motion.header>
);

// --- CONTENU DES ONGLETS ---

const AccountTab = () => (
  <div className="space-y-8">
    <div className="bg-[#ecf0f1] p-6 rounded-2xl shadow-xl border border-[#bdc3c7] relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-[#2c3e50] mb-4 font-montserrat tracking-wide">Exporter vos données</h3>
        <p className="text-sm text-[#34495e] mb-4 font-open-sans">
          Vous pouvez demander une archive de toutes les données que nous détenons vous concernant, conformément au RGPD.
        </p>
        <button className="bg-[#2c3e50] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#34495e] transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105 font-open-sans">
          <Download className="w-4 h-4"/>
          Demander une archive
        </button>
      </div>
    </div>
    <div className="bg-[#ecf0f1] p-6 rounded-2xl shadow-xl border border-[#bdc3c7] relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-lg font-semibold text-red-600 mb-4 font-montserrat tracking-wide">Zone de Danger</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[#2c3e50] font-open-sans">Supprimer le compte</p>
            <p className="text-sm text-[#34495e] font-open-sans">
              Cette action est irréversible. Toutes vos données seront définitivement supprimées.
            </p>
          </div>
          <button className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105 font-open-sans">
            <Trash2 className="w-4 h-4"/>
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  </div>
);

const SecurityTab = () => (
  <div className="bg-[#ecf0f1] p-6 rounded-2xl shadow-xl border border-[#bdc3c7] relative overflow-hidden">
    <div className="relative z-10">
      <h3 className="text-lg font-semibold text-[#2c3e50] mb-6 font-montserrat tracking-wide">Authentification à deux facteurs (2FA)</h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-[#2c3e50] font-open-sans">Statut de la 2FA</p>
          <p className="text-sm text-[#34495e] font-open-sans">
            Protégez votre compte contre les accès non autorisés.
          </p>
        </div>
        <button className="bg-[#2c3e50] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#34495e] transition-all duration-300 shadow-lg hover:scale-105 font-open-sans">
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
        <div className="bg-[#ecf0f1] p-6 rounded-2xl shadow-xl border border-[#bdc3c7] relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="text-lg font-semibold text-[#2c3e50] mb-4 font-montserrat tracking-wide">Thème de l&apos;application</h3>
                <p className="text-sm text-[#34495e] mb-6 font-open-sans">Choisissez votre préférence d&apos;affichage.</p>
                <div className="flex space-x-4">
                    <button 
                        onClick={() => setTheme('light')} 
                        className={`flex-1 p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                            theme === 'light' 
                                ? 'border-[#2c3e50] bg-white' 
                                : 'border-[#bdc3c7] hover:border-[#34495e] hover:bg-white'
                        }`}
                    >
                        <Sun className={`w-8 h-8 mb-2 ${theme === 'light' ? 'text-[#2c3e50]' : 'text-[#34495e]'}`}/>
                        <span className={`font-medium font-open-sans ${theme === 'light' ? 'text-[#2c3e50]' : 'text-[#34495e]'}`}>Clair</span>
                    </button>
                    <button 
                        onClick={() => setTheme('dark')} 
                        className={`flex-1 p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                            theme === 'dark' 
                                ? 'border-[#2c3e50] bg-white' 
                                : 'border-[#bdc3c7] hover:border-[#34495e] hover:bg-white'
                        }`}
                    >
                        <Moon className={`w-8 h-8 mb-2 ${theme === 'dark' ? 'text-[#2c3e50]' : 'text-[#34495e]'}`}/>
                        <span className={`font-medium font-open-sans ${theme === 'dark' ? 'text-[#2c3e50]' : 'text-[#34495e]'}`}>Sombre</span>
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
    <div className="border-b border-[#bdc3c7] mb-8">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-all duration-200 font-montserrat
              ${activeTab === tab.id
                ? 'border-[#2c3e50] text-[#2c3e50]'
                : 'border-transparent text-[#34495e] hover:text-[#2c3e50] hover:border-[#bdc3c7]'
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
    <div className="p-8 bg-[#bdc3c7] min-h-full relative overflow-hidden">
      
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