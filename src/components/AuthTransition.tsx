'use client';

import { motion } from 'framer-motion';
import { Brain, CheckCircle, Shield, BarChart3, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import '../styles/fonts.css';

type AuthTransitionProps = {
  userFirstName?: string;
  onComplete: () => void;
};

export default function AuthTransition({ userFirstName = 'Utilisateur', onComplete }: AuthTransitionProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      icon: CheckCircle,
      title: "Connexion réussie !",
      description: `Bienvenue ${userFirstName}`,
      color: "bg-[#2c3e50]"
    },
    {
      icon: Shield,
      title: "Sécurisation du compte",
      description: "Vérification des permissions...",
      color: "bg-[#2c3e50]"
    },
    {
      icon: BarChart3,
      title: "Préparation du dashboard",
      description: "Chargement de vos données...",
      color: "bg-[#2c3e50]"
    },
    {
      icon: Sparkles,
      title: "Finalisation",
      description: "Presque prêt !",
      color: "bg-[#2c3e50]"
    }
  ];

  useEffect(() => {
    const stepDuration = 800; // 800ms par étape
    const progressInterval = 20; // Mise à jour toutes les 20ms
    const totalDuration = steps.length * stepDuration;
    
    let currentProgress = 0;
    const increment = 100 / (totalDuration / progressInterval);

    const progressTimer = setInterval(() => {
      currentProgress += increment;
      setProgress(Math.min(currentProgress, 100));
      
      // Changer d'étape à chaque 25% de progression
      const newStep = Math.floor((currentProgress / 100) * steps.length);
      if (newStep < steps.length) {
        setStep(newStep);
      }
      
      if (currentProgress >= 100) {
        clearInterval(progressTimer);
        // Attendre un peu avant de terminer
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, progressInterval);

    return () => clearInterval(progressTimer);
  }, [steps.length, onComplete]);

  const currentStep = steps[step];
  const CurrentIcon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#ecf0f1] overflow-hidden">
      {/* Background pattern subtil avec le style de l'app */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#ecf0f1] to-[#bdc3c7]">
        {/* Grille subtile avec les couleurs de l'app */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(44,62,80,0.1) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }} />
        </div>
      </div>

      {/* Contenu principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 text-center max-w-md mx-auto px-6"
      >
        {/* Logo principal avec animation et style de l'app */}
        <motion.div
          className="mb-8 relative"
          animate={{ 
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-20 h-20 bg-[#2c3e50] rounded-2xl flex items-center justify-center shadow-2xl mx-auto relative">
            <Brain className="w-10 h-10 text-white" />
            
            {/* Effet de pulse subtil avec les couleurs de l'app */}
            <motion.div
              className="absolute inset-0 bg-[#2c3e50] rounded-2xl opacity-30"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>

        {/* Titre principal avec les polices de l'app */}
        <motion.h1
          className="text-3xl font-bold font-montserrat text-[#2c3e50] mb-2 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Bank-IA
        </motion.h1>

        <motion.p
          className="text-[#34495e] mb-8 text-sm font-open-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Financial Intelligence
        </motion.p>

        {/* Étape actuelle avec animation et style de l'app */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <motion.div
            className={`w-16 h-16 ${currentStep.color} rounded-2xl flex items-center justify-center shadow-xl mx-auto mb-4`}
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <CurrentIcon className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-xl font-semibold font-montserrat text-[#2c3e50] mb-2 tracking-wide">
            {currentStep.title}
          </h2>
          <p className="text-[#34495e] text-sm font-open-sans">
            {currentStep.description}
          </p>
        </motion.div>

        {/* Barre de progression moderne avec le style de l'app */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-[#34495e] font-open-sans mb-3">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full bg-[#bdc3c7] rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-[#2c3e50] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Points d'étapes avec les couleurs de l'app */}
        <div className="flex justify-center space-x-3 mb-8">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index <= step ? 'bg-[#2c3e50]' : 'bg-[#bdc3c7]'
              }`}
              animate={{
                scale: index === step ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 1,
                repeat: index === step ? Infinity : 0,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Message d'attente avec le style de l'app */}
        <motion.p
          className="text-[#34495e] text-xs font-open-sans"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Préparation de votre espace personnel...
        </motion.p>
      </motion.div>

      {/* Éléments décoratifs subtils avec les couleurs de l'app */}
      <motion.div
        className="absolute top-10 right-10 w-32 h-32 border border-[#bdc3c7] rounded-full"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-10 left-10 w-24 h-24 border border-[#bdc3c7] rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </div>
  );
}