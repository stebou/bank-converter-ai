'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { 
  useSignIn, 
  useSignUp, 
  useAuth,
  useUser
} from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import AuthTransition from './AuthTransition';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
};

type AuthMode = 'signin' | 'signup';

// Fonction pour vérifier si c'est une erreur Clerk
const isClerkError = (err: unknown): err is { errors: Array<{ message: string }> } => {
  return err && typeof err === 'object' && 'errors' in err && Array.isArray((err as { errors: unknown }).errors);
};

// Composant icône Google
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  // Formulaire
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const { signIn, setActive: setActiveSignIn } = useSignIn();
  const { signUp, setActive: setActiveSignUp } = useSignUp();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  // Gérer les changements de formulaire
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null); // Effacer l'erreur lors de la saisie
  };

  // Basculer entre connexion et inscription
  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
    setFormData({ email: '', password: '', firstName: '', lastName: '' });
  };

  // Authentification Google
  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      if (mode === 'signin') {
        if (!signIn) throw new Error('SignIn not available');
        
        await signIn.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/dashboard?from_auth=true'
        });
      } else {
        if (!signUp) throw new Error('SignUp not available');
        
        await signUp.authenticateWithRedirect({
          strategy: 'oauth_google',
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/dashboard?from_auth=true'
        });
      }
    } catch (err) {
      if (isClerkError(err)) {
        setError(err.errors[0]?.message || 'Erreur lors de la connexion Google');
      } else {
        setError('Erreur lors de la connexion Google');
      }
      setIsGoogleLoading(false);
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signin') {
        // Mode connexion
        if (!signIn) throw new Error('SignIn not available');

        const result = await signIn.create({
          identifier: formData.email,
          password: formData.password,
        });

        if (result.status === 'complete') {
          await setActiveSignIn({ session: result.createdSessionId });
          console.log('[AUTH] Sign in successful, showing transition');
          setShowTransition(true);
        }
      } else {
        // Mode inscription
        if (!signUp) throw new Error('SignUp not available');

        const result = await signUp.create({
          emailAddress: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });

        if (result.status === 'complete') {
          await setActiveSignUp({ session: result.createdSessionId });
          console.log('[AUTH] Sign up successful, showing transition');
          setShowTransition(true);
        } else {
          // Gestion de la vérification email si nécessaire
          console.log('Verification needed:', result);
        }
      }
    } catch (err) {
      if (isClerkError(err)) {
        setError(err.errors[0]?.message || 'Une erreur est survenue');
      } else {
        setError('Une erreur inattendue est survenue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour finaliser la transition
  const handleTransitionComplete = () => {
    onClose();
    router.push('/dashboard?from_auth=true');
  };

  // Rediriger si déjà connecté (mais pas si on est en train de montrer la transition)
  React.useEffect(() => {
    if (isSignedIn && !showTransition) {
      onClose();
      router.push('/dashboard');
    }
  }, [isSignedIn, onClose, router, showTransition]);

  // Vérifier les erreurs SSO dans l'URL
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('error') === 'sso_failed') {
        setError('Erreur lors de la connexion avec Google. Veuillez réessayer.');
        // Nettoyer l'URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, []);

  // Afficher la transition si nécessaire
  if (showTransition) {
    console.log('[AUTH] Rendering transition for user:', user?.firstName);
    return (
      <AuthTransition 
        userFirstName={user?.firstName || 'Utilisateur'}
        onComplete={handleTransitionComplete}
      />
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
          >
            {/* Header avec gradient */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-500 p-6 text-white relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-green-500/90"></div>
              <div className="relative z-10">
                <button
                  onClick={onClose}
                  className="absolute top-0 right-0 text-white/80 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold">
                    {mode === 'signin' ? 'Connexion' : 'Inscription'}
                  </h2>
                </div>
                <p className="text-white/90 text-sm">
                  {mode === 'signin' 
                    ? 'Accédez à votre tableau de bord IA' 
                    : 'Créez votre compte et commencez'}
                </p>
              </div>
            </div>

            {/* Formulaire */}
            <div className="p-6">
              {/* Bouton Google */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGoogleLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                  <span className="text-gray-700 font-medium">
                    {mode === 'signin' ? 'Se connecter avec Google' : 'S\'inscrire avec Google'}
                  </span>
                </button>

                {/* Séparateur */}
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <div className="px-4 text-sm text-gray-500 bg-white">ou</div>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Champs inscription uniquement */}
                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Prénom
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Prénom"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Nom
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Nom"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="••••••••"
                      required={mode === 'signup'}
                      minLength={mode === 'signup' ? 8 : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Message d'erreur */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {mode === 'signin' ? 'Se connecter' : 'Créer le compte'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Basculer entre les modes */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  {mode === 'signin' 
                    ? "Vous n'avez pas de compte ?" 
                    : 'Vous avez déjà un compte ?'}
                  <button
                    onClick={toggleMode}
                    className="text-blue-600 hover:text-blue-700 font-semibold ml-1 transition-colors"
                  >
                    {mode === 'signin' ? "S'inscrire" : 'Se connecter'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}