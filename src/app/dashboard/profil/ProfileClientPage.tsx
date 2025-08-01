'use client';

import React, { useState } from 'react';
import Image from 'next/image'; 
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Lock, 
  Bell, 
  Edit, 
  Save, 
  Camera, 
  Shield, 
  Mail,
  UserCircle,
  Settings,
  CheckCircle,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

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
  securityAlerts: boolean;
};

// --- SOUS-COMPOSANTS DE LA PAGE PROFIL ---

const ProfileHeader = () => (
  <motion.header 
    className="mb-8"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    <div className="flex items-center gap-4 mb-2">
      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
        <UserCircle className="w-8 h-8 text-white" />
      </div>
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
          Mon Profil
        </h1>
        <p className="text-gray-300 text-lg">Gérez vos informations personnelles et vos paramètres.</p>
      </div>
    </div>
  </motion.header>
);

const AvatarSection = ({ name, email, avatar }: AvatarSectionProps) => (
  <motion.div 
    className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 relative overflow-hidden"
    initial={{ opacity: 0.3, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    {/* Effet glassmorphism */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent"></div>
    
    <div className="relative z-10">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
            <Image 
              src={avatar} 
              alt="Avatar utilisateur" 
              width={128}
              height={128}
              className="w-full h-full object-cover" 
            />
          </div>
          <button className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:scale-110">
            <Camera className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">{name}</h2>
          <div className="flex items-center gap-2 text-gray-300">
            <Mail className="w-4 h-4" />
            <p className="text-sm">{email}</p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full mt-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-xs font-medium">Compte vérifié</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const ProfileInfoForm = ({ initialName, initialEmail }: ProfileInfoFormProps) => {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    // Simulation d'une sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 relative overflow-hidden"
      initial={{ opacity: 0.3, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Effet glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/10 to-transparent"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
              <User className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">Informations Personnelles</h3>
          </div>
          <button 
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Sauvegarde...
              </>
            ) : isEditing ? (
              <>
                <Save className="w-4 h-4" />
                Enregistrer
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Modifier
              </>
            )}
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">Nom complet</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              disabled={!isEditing} 
              className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 transition-all"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">Adresse email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              disabled={!isEditing} 
              className="w-full p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 transition-all"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SecuritySettings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 relative overflow-hidden"
      initial={{ opacity: 0.3, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Effet glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-orange-500/10 to-transparent"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Sécurité</h3>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">Mot de passe actuel</label>
            <div className="relative">
              <input 
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full p-4 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all" 
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-200 mb-2 block">Nouveau mot de passe</label>
            <div className="relative">
              <input 
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nouveau mot de passe" 
                className="w-full p-4 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all" 
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:scale-105">
            Changer le mot de passe
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const NotificationPreferences = () => {
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    newUpload: true, 
    analysisComplete: true, 
    monthlyReport: false,
    securityAlerts: true
  });
  
  const togglePref = (key: keyof NotificationPrefs) => { 
    setPrefs(prev => ({ ...prev, [key]: !prev[key] })); 
  };

  const notifications = [
    {
      key: 'analysisComplete' as const,
      title: 'Analyse terminée',
      description: 'Être notifié quand l\'IA a fini son travail'
    },
    {
      key: 'newUpload' as const,
      title: 'Nouveau document',
      description: 'Notification lors de l\'upload d\'un document'
    },
    {
      key: 'monthlyReport' as const,
      title: 'Rapport mensuel',
      description: 'Recevoir un résumé mensuel de vos analyses'
    },
    {
      key: 'securityAlerts' as const,
      title: 'Alertes de sécurité',
      description: 'Notifications pour les activités suspectes'
    }
  ];
  
  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 relative overflow-hidden"
      initial={{ opacity: 0.3, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Effet glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-transparent"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div className="flex-1">
                <p className="font-medium text-white">{notification.title}</p>
                <p className="text-sm text-gray-300 mt-1">{notification.description}</p>
              </div>
              <button 
                onClick={() => togglePref(notification.key)} 
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  prefs[notification.key] ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-600'
                }`}
              >
                <span 
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-300 ${
                    prefs[notification.key] ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- COMPOSANT PRINCIPAL DE LA PAGE CLIENT DU PROFIL ---

type ProfileClientPageProps = {
  userData: UserData;
};

export default function ProfileClientPage({ userData }: ProfileClientPageProps) {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-full relative overflow-hidden">
      {/* Effet glassmorphism moderne pour le profil */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10"></div>
      
      <div className="relative z-10">
        <ProfileHeader />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <ProfileInfoForm initialName={userData.name} initialEmail={userData.email} />
            <SecuritySettings />
          </div>
          <div className="xl:col-span-1 space-y-8">
            <AvatarSection name={userData.name} email={userData.email} avatar={userData.avatar} />
            <NotificationPreferences />
          </div>
        </div>
      </div>
    </div>
  );
}