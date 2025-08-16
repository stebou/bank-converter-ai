'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Shield,
  Sun,
  Moon,
  Trash2,
  Download,
  Settings,
} from 'lucide-react';
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
    <div className="mb-2 flex items-center gap-4">
      <div className="rounded-2xl bg-[#2c3e50] p-3 shadow-lg">
        <Settings className="h-8 w-8 text-white" />
      </div>
      <div>
        <h1 className="font-montserrat text-4xl font-bold tracking-tight text-[#2c3e50]">
          Réglages
        </h1>
        <p className="font-open-sans text-lg text-[#34495e]">
          Gérez les paramètres de votre compte et vos préférences
        </p>
      </div>
    </div>
  </motion.header>
);

// --- CONTENU DES ONGLETS ---

const AccountTab = () => (
  <div className="space-y-8">
    <div className="relative overflow-hidden rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-xl">
      <div className="relative z-10">
        <h3 className="font-montserrat mb-4 text-lg font-semibold tracking-wide text-[#2c3e50]">
          Exporter vos données
        </h3>
        <p className="font-open-sans mb-4 text-sm text-[#34495e]">
          Vous pouvez demander une archive de toutes les données que nous
          détenons vous concernant, conformément au RGPD.
        </p>
        <button className="font-open-sans flex items-center gap-2 rounded-lg bg-[#2c3e50] px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#34495e]">
          <Download className="h-4 w-4" />
          Demander une archive
        </button>
      </div>
    </div>
    <div className="relative overflow-hidden rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-xl">
      <div className="relative z-10">
        <h3 className="font-montserrat mb-4 text-lg font-semibold tracking-wide text-red-600">
          Zone de Danger
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-open-sans font-medium text-[#2c3e50]">
              Supprimer le compte
            </p>
            <p className="font-open-sans text-sm text-[#34495e]">
              Cette action est irréversible. Toutes vos données seront
              définitivement supprimées.
            </p>
          </div>
          <button className="font-open-sans flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-red-700">
            <Trash2 className="h-4 w-4" />
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  </div>
);

const SecurityTab = () => (
  <div className="relative overflow-hidden rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-xl">
    <div className="relative z-10">
      <h3 className="font-montserrat mb-6 text-lg font-semibold tracking-wide text-[#2c3e50]">
        Authentification à deux facteurs (2FA)
      </h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-open-sans font-medium text-[#2c3e50]">
            Statut de la 2FA
          </p>
          <p className="font-open-sans text-sm text-[#34495e]">
            Protégez votre compte contre les accès non autorisés.
          </p>
        </div>
        <button className="font-open-sans rounded-lg bg-[#2c3e50] px-4 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#34495e]">
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
    <div className="relative overflow-hidden rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-xl">
      <div className="relative z-10">
        <h3 className="font-montserrat mb-4 text-lg font-semibold tracking-wide text-[#2c3e50]">
          Thème de l&apos;application
        </h3>
        <p className="font-open-sans mb-6 text-sm text-[#34495e]">
          Choisissez votre préférence d&apos;affichage.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-1 flex-col items-center justify-center rounded-lg border-2 p-4 transition-all duration-300 ${
              theme === 'light'
                ? 'border-[#2c3e50] bg-white'
                : 'border-[#bdc3c7] hover:border-[#34495e] hover:bg-white'
            }`}
          >
            <Sun
              className={`mb-2 h-8 w-8 ${theme === 'light' ? 'text-[#2c3e50]' : 'text-[#34495e]'}`}
            />
            <span
              className={`font-open-sans font-medium ${theme === 'light' ? 'text-[#2c3e50]' : 'text-[#34495e]'}`}
            >
              Clair
            </span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-1 flex-col items-center justify-center rounded-lg border-2 p-4 transition-all duration-300 ${
              theme === 'dark'
                ? 'border-[#2c3e50] bg-white'
                : 'border-[#bdc3c7] hover:border-[#34495e] hover:bg-white'
            }`}
          >
            <Moon
              className={`mb-2 h-8 w-8 ${theme === 'dark' ? 'text-[#2c3e50]' : 'text-[#34495e]'}`}
            />
            <span
              className={`font-open-sans font-medium ${theme === 'dark' ? 'text-[#2c3e50]' : 'text-[#34495e]'}`}
            >
              Sombre
            </span>
          </button>
        </div>
      </div>
    </div>
  );
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
    <div className="mb-8 border-b border-[#bdc3c7]">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`font-montserrat flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-[#2c3e50] text-[#2c3e50]'
                : 'border-transparent text-[#34495e] hover:border-[#bdc3c7] hover:text-[#2c3e50]'
            }`}
          >
            <tab.icon className="h-5 w-5" />
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
    <div className="relative min-h-full overflow-hidden bg-[#bdc3c7] p-8">
      <div className="relative z-10 mx-auto max-w-4xl">
        <SettingsHeader />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <motion.div
          initial={{ opacity: 0.3, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {activeTab === 'account' && <AccountTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'appearance' && <AppearanceTab />}
        </motion.div>
      </div>
    </div>
  );
}
