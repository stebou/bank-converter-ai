'use client';

import React, { useState } from 'react';
import { User, Shield, CreditCard, Sun, Moon, Trash2, Download } from 'lucide-react';

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
  <header className="mb-10">
    <h1 className="text-3xl font-bold text-gray-900">Réglages</h1>
    <p className="text-gray-600 mt-1">Gérez les paramètres de votre compte, votre abonnement et vos préférences.</p>
  </header>
);

// --- CONTENU DES ONGLETS ---

const AccountTab = () => (
  <div className="space-y-8">
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Exporter vos données</h3>
      <p className="text-sm text-gray-600 mb-4">
        Vous pouvez demander une archive de toutes les données que nous détenons vous concernant, conformément au RGPD.
      </p>
      <button className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition flex items-center gap-2">
        <Download className="w-4 h-4"/>
        Demander une archive
      </button>
    </div>
    <div className="bg-white p-6 rounded-xl shadow-sm border-red-200 border-2">
       <h3 className="text-lg font-semibold text-red-700 mb-4">Zone de Danger</h3>
       <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Supprimer le compte</p>
            <p className="text-sm text-gray-600">
              Cette action est irréversible. Toutes vos données seront définitivement supprimées.
            </p>
          </div>
          <button className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition flex items-center gap-2">
            <Trash2 className="w-4 h-4"/>
            Supprimer mon compte
          </button>
       </div>
    </div>
  </div>
);

const SecurityTab = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Authentification à deux facteurs (2FA)</h3>
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-800">Statut de la 2FA</p>
        <p className="text-sm text-gray-600">
          Protégez votre compte contre les accès non autorisés.
        </p>
      </div>
       <button className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition">
        Activer la 2FA
      </button>
    </div>
  </div>
);

const BillingTab = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Gestion de l'abonnement</h3>
    <div className="space-y-4">
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <p className="font-medium text-gray-700">Plan actuel</p>
        <p className="font-semibold text-blue-600">{userSettings.plan}</p>
      </div>
       <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <p className="font-medium text-gray-700">Prochaine facture</p>
        <p className="font-semibold text-gray-800">{userSettings.billingDate}</p>
      </div>
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <p className="font-medium text-gray-700">Moyen de paiement</p>
        <p className="font-semibold text-gray-800">{userSettings.paymentMethod.type} se terminant par {userSettings.paymentMethod.last4}</p>
      </div>
      <div className="pt-4 flex space-x-4">
        <button className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition">Changer de plan</button>
        <button className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-lg hover:bg-gray-300 transition">Voir les factures</button>
      </div>
    </div>
  </div>
);

const AppearanceTab = () => {
    const [theme, setTheme] = useState(userSettings.theme);

    return (
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thème de l'application</h3>
            <p className="text-sm text-gray-600 mb-6">Choisissez votre préférence d'affichage.</p>
            <div className="flex space-x-4">
                <button onClick={() => setTheme('light')} className={`flex-1 p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all ${theme === 'light' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                    <Sun className="w-8 h-8 text-gray-700 mb-2"/>
                    <span className="font-medium">Clair</span>
                </button>
                <button onClick={() => setTheme('dark')} className={`flex-1 p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all ${theme === 'dark' ? 'border-blue-600 bg-gray-800 text-white' : 'border-gray-300'}`}>
                    <Moon className="w-8 h-8 mb-2"/>
                    <span className="font-medium">Sombre</span>
                </button>
            </div>
        </div>
    )
};

type TabId = 'account' | 'security' | 'billing' | 'appearance';

type TabsProps = {
  activeTab: TabId;
  setActiveTab: React.Dispatch<React.SetStateAction<TabId>>;
};

const Tabs = ({ activeTab, setActiveTab }: TabsProps) => {
  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'account', label: 'Compte', icon: User },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'billing', label: 'Facturation', icon: CreditCard },
    { id: 'appearance', label: 'Apparence', icon: Sun },
  ];

  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
    <div className="p-8 max-w-4xl mx-auto">
      <SettingsHeader />
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div>
        {activeTab === 'account' && <AccountTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'billing' && <BillingTab />}
        {activeTab === 'appearance' && <AppearanceTab />}
      </div>
    </div>
  );
}