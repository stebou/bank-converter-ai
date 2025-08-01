'use client';

import React, { useState } from 'react';
import Image from 'next/image'; 
import { motion, AnimatePresence } from 'framer-motion';
import '../../../styles/fonts.css';
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
      <div className="p-3 bg-[#2c3e50] rounded-2xl shadow-lg">
        <UserCircle className="w-8 h-8 text-white" />
      </div>
      <div>
        <h1 className="text-4xl font-bold font-montserrat tracking-tight text-[#2c3e50]">
          Mon Profil
        </h1>
        <p className="text-[#34495e] text-lg font-open-sans">Gérez vos informations personnelles et vos paramètres.</p>
      </div>
    </div>
  </motion.header>
);

const AvatarSection = ({ name, email, avatar }: AvatarSectionProps) => (
  <motion.div 
    className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6 relative overflow-hidden"
    initial={{ opacity: 0.3, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-6">
        <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-[#bdc3c7] shadow-lg">
          <Image 
            src={avatar} 
            alt="Avatar utilisateur" 
            width={128}
            height={128}
            className="w-full h-full object-cover" 
          />
        </div>
        <button className="absolute -bottom-2 -right-2 bg-[#2c3e50] text-white p-3 rounded-2xl hover:bg-[#34495e] transition-all duration-300 shadow-lg hover:scale-110">
          <Camera className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-montserrat tracking-tight text-[#2c3e50]">{name}</h2>
        <div className="flex items-center gap-2 text-[#34495e]">
          <Mail className="w-4 h-4" />
          <p className="text-sm font-open-sans">{email}</p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full mt-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-green-700 text-xs font-medium font-open-sans">Compte vérifié</span>
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
      className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6 relative overflow-hidden"
      initial={{ opacity: 0.3, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#2c3e50] rounded-xl">
            <User className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold font-montserrat tracking-tight text-[#2c3e50]">Informations Personnelles</h3>
        </div>
        <button 
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={isSaving}
          className="bg-[#2c3e50] hover:bg-[#34495e] text-white font-medium font-open-sans py-2 px-4 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:scale-105 disabled:opacity-50"
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
          <label className="text-sm font-medium font-montserrat text-[#34495e] mb-2 block">Nom complet</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            disabled={!isEditing} 
            className="w-full p-4 bg-white border border-[#bdc3c7] rounded-xl text-[#2c3e50] font-open-sans placeholder-gray-500 focus:ring-2 focus:ring-[#2c3e50] focus:border-[#2c3e50] disabled:opacity-50 disabled:bg-[#ecf0f1] transition-all"
          />
        </div>
        <div>
          <label className="text-sm font-medium font-montserrat text-[#34495e] mb-2 block">Adresse email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={!isEditing} 
            className="w-full p-4 bg-white border border-[#bdc3c7] rounded-xl text-[#2c3e50] font-open-sans placeholder-gray-500 focus:ring-2 focus:ring-[#2c3e50] focus:border-[#2c3e50] disabled:opacity-50 disabled:bg-[#ecf0f1] transition-all"
          />
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
      className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6 relative overflow-hidden"
      initial={{ opacity: 0.3, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#2c3e50] rounded-xl">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold font-montserrat tracking-tight text-[#2c3e50]">Sécurité</h3>
      </div>
        
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium font-montserrat text-[#34495e] mb-2 block">Mot de passe actuel</label>
          <div className="relative">
            <input 
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full p-4 pr-12 bg-white border border-[#bdc3c7] rounded-xl text-[#2c3e50] font-open-sans placeholder-gray-500 focus:ring-2 focus:ring-[#2c3e50] focus:border-[#2c3e50] transition-all" 
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bdc3c7] hover:text-[#34495e] transition-colors"
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium font-montserrat text-[#34495e] mb-2 block">Nouveau mot de passe</label>
          <div className="relative">
            <input 
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nouveau mot de passe" 
              className="w-full p-4 pr-12 bg-white border border-[#bdc3c7] rounded-xl text-[#2c3e50] font-open-sans placeholder-gray-500 focus:ring-2 focus:ring-[#2c3e50] focus:border-[#2c3e50] transition-all" 
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bdc3c7] hover:text-[#34495e] transition-colors"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <button className="w-full bg-[#2c3e50] hover:bg-[#34495e] text-white font-semibold font-open-sans py-3 rounded-xl transition-all duration-300 shadow-lg hover:scale-105">
          Changer le mot de passe
        </button>
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
      className="bg-white rounded-2xl shadow-xl border border-[#bdc3c7] p-6 relative overflow-hidden"
      initial={{ opacity: 0.3, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#2c3e50] rounded-xl">
          <Bell className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold font-montserrat tracking-tight text-[#2c3e50]">Notifications</h3>
      </div>
        
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.key} className="flex items-center justify-between p-4 bg-[#ecf0f1] rounded-xl hover:bg-white transition-colors">
            <div className="flex-1">
              <p className="font-medium font-montserrat text-[#2c3e50]">{notification.title}</p>
              <p className="text-sm text-[#34495e] font-open-sans mt-1">{notification.description}</p>
            </div>
            <button 
              onClick={() => togglePref(notification.key)} 
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                prefs[notification.key] ? 'bg-[#2c3e50]' : 'bg-[#bdc3c7]'
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
    </motion.div>
  );
};

// --- COMPOSANT PRINCIPAL DE LA PAGE CLIENT DU PROFIL ---

type ProfileClientPageProps = {
  userData: UserData;
};

export default function ProfileClientPage({ userData }: ProfileClientPageProps) {
  return (
    <div className="p-8 bg-[#bdc3c7] min-h-full relative">
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