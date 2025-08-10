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
  EyeOff,
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
    <div className="mb-2 flex items-center gap-4">
      <div className="rounded-2xl bg-[#2c3e50] p-3 shadow-lg">
        <UserCircle className="h-8 w-8 text-white" />
      </div>
      <div>
        <h1 className="font-montserrat text-4xl font-bold tracking-tight text-[#2c3e50]">
          Mon Profil
        </h1>
        <p className="font-open-sans text-lg text-[#34495e]">
          Gérez vos informations personnelles et vos paramètres.
        </p>
      </div>
    </div>
  </motion.header>
);

const AvatarSection = ({ name, email, avatar }: AvatarSectionProps) => (
  <motion.div
    className="relative overflow-hidden rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl"
    initial={{ opacity: 0.3, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
  >
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-6">
        <div className="h-32 w-32 overflow-hidden rounded-3xl border-4 border-[#bdc3c7] shadow-lg">
          <Image
            src={avatar}
            alt="Avatar utilisateur"
            width={128}
            height={128}
            className="h-full w-full object-cover"
          />
        </div>
        <button className="absolute -bottom-2 -right-2 rounded-2xl bg-[#2c3e50] p-3 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#34495e]">
          <Camera className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-2">
        <h2 className="font-montserrat text-2xl font-bold tracking-tight text-[#2c3e50]">
          {name}
        </h2>
        <div className="flex items-center gap-2 text-[#34495e]">
          <Mail className="h-4 w-4" />
          <p className="font-open-sans text-sm">{email}</p>
        </div>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
          <span className="font-open-sans text-xs font-medium text-green-700">
            Compte vérifié
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

const ProfileInfoForm = ({
  initialName,
  initialEmail,
}: ProfileInfoFormProps) => {
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
      className="relative overflow-hidden rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl"
      initial={{ opacity: 0.3, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#2c3e50] p-2">
            <User className="h-5 w-5 text-white" />
          </div>
          <h3 className="font-montserrat text-xl font-bold tracking-tight text-[#2c3e50]">
            Informations Personnelles
          </h3>
        </div>
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          disabled={isSaving}
          className="font-open-sans flex items-center gap-2 rounded-xl bg-[#2c3e50] px-4 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#34495e] disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
              Sauvegarde...
            </>
          ) : isEditing ? (
            <>
              <Save className="h-4 w-4" />
              Enregistrer
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Modifier
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="font-montserrat mb-2 block text-sm font-medium text-[#34495e]">
            Nom complet
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={!isEditing}
            className="font-open-sans w-full rounded-xl border border-[#bdc3c7] bg-white p-4 text-[#2c3e50] placeholder-gray-500 transition-all focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50] disabled:bg-[#ecf0f1] disabled:opacity-50"
          />
        </div>
        <div>
          <label className="font-montserrat mb-2 block text-sm font-medium text-[#34495e]">
            Adresse email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={!isEditing}
            className="font-open-sans w-full rounded-xl border border-[#bdc3c7] bg-white p-4 text-[#2c3e50] placeholder-gray-500 transition-all focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50] disabled:bg-[#ecf0f1] disabled:opacity-50"
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
      className="relative overflow-hidden rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl"
      initial={{ opacity: 0.3, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-[#2c3e50] p-2">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-montserrat text-xl font-bold tracking-tight text-[#2c3e50]">
          Sécurité
        </h3>
      </div>

      <div className="space-y-6">
        <div>
          <label className="font-montserrat mb-2 block text-sm font-medium text-[#34495e]">
            Mot de passe actuel
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="font-open-sans w-full rounded-xl border border-[#bdc3c7] bg-white p-4 pr-12 text-[#2c3e50] placeholder-gray-500 transition-all focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bdc3c7] transition-colors hover:text-[#34495e]"
            >
              {showCurrentPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="font-montserrat mb-2 block text-sm font-medium text-[#34495e]">
            Nouveau mot de passe
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              className="font-open-sans w-full rounded-xl border border-[#bdc3c7] bg-white p-4 pr-12 text-[#2c3e50] placeholder-gray-500 transition-all focus:border-[#2c3e50] focus:ring-2 focus:ring-[#2c3e50]"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bdc3c7] transition-colors hover:text-[#34495e]"
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <button className="font-open-sans w-full rounded-xl bg-[#2c3e50] py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#34495e]">
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
    securityAlerts: true,
  });

  const togglePref = (key: keyof NotificationPrefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notifications = [
    {
      key: 'analysisComplete' as const,
      title: 'Analyse terminée',
      description: "Être notifié quand l'IA a fini son travail",
    },
    {
      key: 'newUpload' as const,
      title: 'Nouveau document',
      description: "Notification lors de l'upload d'un document",
    },
    {
      key: 'monthlyReport' as const,
      title: 'Rapport mensuel',
      description: 'Recevoir un résumé mensuel de vos analyses',
    },
    {
      key: 'securityAlerts' as const,
      title: 'Alertes de sécurité',
      description: 'Notifications pour les activités suspectes',
    },
  ];

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl border border-[#bdc3c7] bg-white p-6 shadow-xl"
      initial={{ opacity: 0.3, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-[#2c3e50] p-2">
          <Bell className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-montserrat text-xl font-bold tracking-tight text-[#2c3e50]">
          Notifications
        </h3>
      </div>

      <div className="space-y-4">
        {notifications.map(notification => (
          <div
            key={notification.key}
            className="flex items-center justify-between rounded-xl bg-[#ecf0f1] p-4 transition-colors hover:bg-white"
          >
            <div className="flex-1">
              <p className="font-montserrat font-medium text-[#2c3e50]">
                {notification.title}
              </p>
              <p className="font-open-sans mt-1 text-sm text-[#34495e]">
                {notification.description}
              </p>
            </div>
            <button
              onClick={() => togglePref(notification.key)}
              className={`relative h-7 w-14 rounded-full transition-colors duration-300 ${
                prefs[notification.key] ? 'bg-[#2c3e50]' : 'bg-[#bdc3c7]'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-300 ${
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

export default function ProfileClientPage({
  userData,
}: ProfileClientPageProps) {
  return (
    <div className="relative min-h-full bg-[#bdc3c7] p-8">
      <div className="relative z-10">
        <ProfileHeader />

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          <div className="space-y-8 xl:col-span-2">
            <ProfileInfoForm
              initialName={userData.name}
              initialEmail={userData.email}
            />
            <SecuritySettings />
          </div>
          <div className="space-y-8 xl:col-span-1">
            <AvatarSection
              name={userData.name}
              email={userData.email}
              avatar={userData.avatar}
            />
            <NotificationPreferences />
          </div>
        </div>
      </div>
    </div>
  );
}
