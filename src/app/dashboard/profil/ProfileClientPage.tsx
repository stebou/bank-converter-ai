'use client';

import React, { useState } from 'react';
import { User, Lock, Bell, Edit, Save, Camera } from 'lucide-react';

// --- TYPES ---
type AvatarSectionProps = {
  name: string;
  email: string;
  avatar: string;
};

type ProfileInfoFormProps = {
  initialName: string;
  initialEmail: string;
};

type UserData = {
  name: string;
  email: string;
  avatar: string;
};

type NotificationPrefs = {
  newUpload: boolean;
  analysisComplete: boolean;
  monthlyReport: boolean;
};

// --- SOUS-COMPOSANTS DE LA PAGE PROFIL ---

const ProfileHeader = () => (
    <header className="mb-10"><h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1><p className="text-gray-600 mt-1">Gérez vos informations personnelles et vos paramètres de sécurité.</p></header>
);

const AvatarSection = ({ name, email, avatar }: AvatarSectionProps) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"><div className="flex items-center gap-6"><div className="relative"><img src={avatar} alt="Avatar utilisateur" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" /><button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition transform hover:scale-110"><Camera className="w-4 h-4" /></button></div><div><h2 className="text-xl font-bold text-gray-800">{name}</h2><p className="text-gray-500">{email}</p></div></div></div>
);

const ProfileInfoForm = ({ initialName, initialEmail }: ProfileInfoFormProps) => {
    const [name, setName] = useState(initialName);
    const [email, setEmail] = useState(initialEmail);
    const [isEditing, setIsEditing] = useState(false);
    return (<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"><div className="flex justify-between items-center mb-6"><h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><User className="w-5 h-5 text-blue-600"/> Informations Personnelles</h3><button onClick={() => setIsEditing(!isEditing)} className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">{isEditing ? <Save className="w-4 h-4"/> : <Edit className="w-4 h-4"/>}{isEditing ? 'Enregistrer' : 'Modifier'}</button></div><div className="space-y-4"><div><label className="text-sm font-medium text-gray-700">Nom complet</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"/></div><div><label className="text-sm font-medium text-gray-700">Adresse e-mail</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditing} className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"/></div></div></div>);
};

const SecuritySettings = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"><h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2"><Lock className="w-5 h-5 text-blue-600"/> Sécurité</h3><div className="space-y-4"><div><label className="text-sm font-medium text-gray-700">Mot de passe actuel</label><input type="password" placeholder="••••••••" className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" /></div><div><label className="text-sm font-medium text-gray-700">Nouveau mot de passe</label><input type="password" placeholder="Nouveau mot de passe" className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" /></div><button className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition">Changer le mot de passe</button></div></div>
);

const NotificationPreferences = () => {
    const [prefs, setPrefs] = useState<NotificationPrefs>({newUpload: true, analysisComplete: true, monthlyReport: false});
    const togglePref = (key: keyof NotificationPrefs) => { setPrefs(prev => ({ ...prev, [key]: !prev[key] })); };
    return (<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"><h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2"><Bell className="w-5 h-5 text-blue-600"/> Préférences de notification</h3><div className="space-y-4"><div className="flex items-center justify-between"><div><p className="font-medium text-gray-800">Analyse terminée</p><p className="text-sm text-gray-500">Être notifié quand l'IA a fini son travail.</p></div><button onClick={() => togglePref('analysisComplete')} className={`w-12 h-6 rounded-full flex items-center transition-colors ${prefs.analysisComplete ? 'bg-blue-600' : 'bg-gray-300'}`}><span className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${prefs.analysisComplete ? 'translate-x-6' : 'translate-x-1'}`}></span></button></div>{/* ... Autres préférences ... */}</div></div>);
};

// --- COMPOSANT PRINCIPAL DE LA PAGE CLIENT DU PROFIL ---

type ProfileClientPageProps = {
  userData: UserData;
};

export default function ProfileClientPage({ userData }: ProfileClientPageProps) {
  return (
    <div className="p-8">
      <ProfileHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProfileInfoForm initialName={userData.name} initialEmail={userData.email} />
          <SecuritySettings />
        </div>
        <div className="lg:col-span-1 space-y-8">
           <AvatarSection name={userData.name} email={userData.email} avatar={userData.avatar} />
           <NotificationPreferences />
        </div>
      </div>
    </div>
  );
}