'use client';

import { useEffect, useState } from 'react';
import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import AuthTransition from '@/components/AuthTransition';

export default function SSOCallback() {
  const { handleRedirectCallback } = useClerk();
  const { user } = useUser();
  const router = useRouter();
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleRedirectCallback();
        // Afficher la transition après succès
        setShowTransition(true);
      } catch (error) {
        console.error('Error handling SSO callback:', error);
        // En cas d'erreur, rediriger vers l'accueil
        router.push('/?error=sso_failed');
      }
    };

    handleCallback();
  }, [handleRedirectCallback, router]);

  const handleTransitionComplete = () => {
    router.push('/dashboard?from_auth=true');
  };

  if (showTransition) {
    return (
      <AuthTransition
        userFirstName={user?.firstName || 'Utilisateur'}
        onComplete={handleTransitionComplete}
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Effet glassmorphism */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 rounded-2xl border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur-xl"
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Logo animé */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>

          {/* Texte de chargement */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              Connexion en cours...
            </h2>
            <p className="text-gray-300">
              Finalisation de votre authentification
            </p>
          </div>

          {/* Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 className="h-8 w-8 text-blue-400" />
          </motion.div>

          {/* Message d'attente */}
          <p className="max-w-md text-sm text-gray-400">
            Veuillez patienter pendant que nous finalisons votre connexion avec
            Google...
          </p>
        </div>
      </motion.div>
    </div>
  );
}
