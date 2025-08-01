'use client';

import { motion } from 'framer-motion';
import { Brain, Sparkles, CheckCircle, Shield, BarChart3 } from 'lucide-react';
import { useEffect, useState } from 'react';

type AuthTransitionProps = {
  userFirstName?: string;
  onComplete: () => void;
};

export default function AuthTransition({ userFirstName = 'Utilisateur', onComplete }: AuthTransitionProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Positions fixes pour éviter l'erreur d'hydratation
  const particlePositions = [
    { left: 15, top: 25 }, { left: 75, top: 60 }, { left: 35, top: 10 }, { left: 85, top: 80 },
    { left: 5, top: 45 }, { left: 95, top: 15 }, { left: 25, top: 85 }, { left: 65, top: 35 },
    { left: 45, top: 70 }, { left: 55, top: 5 }, { left: 20, top: 55 }, { left: 80, top: 40 },
    { left: 10, top: 75 }, { left: 90, top: 20 }, { left: 40, top: 90 }, { left: 70, top: 30 },
    { left: 30, top: 65 }, { left: 60, top: 50 }, { left: 50, top: 95 }, { left: 12, top: 8 }
  ];
  
  const particleDelays = [0, 0.5, 1, 1.5, 0.3, 0.8, 1.2, 0.6, 0.9, 1.8, 0.4, 1.1, 1.7, 0.2, 1.4, 0.7, 1.3, 1.6, 0.1, 1.9];

  const steps = [
    {
      icon: CheckCircle,
      title: "Connexion réussie !",
      description: `Bienvenue ${userFirstName} 👋`,
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Shield,
      title: "Sécurisation du compte",
      description: "Vérification des permissions...",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: BarChart3,
      title: "Préparation du dashboard",
      description: "Chargement de vos données...",
      color: "from-purple-500 to-violet-600"
    },
    {
      icon: Sparkles,
      title: "Finalisation",
      description: "Presque prêt !",
      color: "from-yellow-500 to-orange-600"
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background animé */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-green-500/10"></div>
        
        {/* Particules flottantes */}
        {particlePositions.map((position, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${position.left}%`,
              top: `${position.top}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: particleDelays[i],
            }}
          />
        ))}
      </div>

      {/* Contenu principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center max-w-md mx-auto px-6"
      >
        {/* Logo principal avec animation */}
        <motion.div
          className="mb-8 relative"
          animate={{ 
            rotateY: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-3xl flex items-center justify-center shadow-2xl mx-auto relative">
            <Brain className="w-12 h-12 text-white" />
            
            {/* Effet de pulse */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>

        {/* Titre principal */}
        <motion.h1
          className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Bank-IA
        </motion.h1>

        <motion.p
          className="text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Votre assistant IA financier
        </motion.p>

        {/* Étape actuelle avec animation */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="mb-8"
        >
          <motion.div
            className={`w-16 h-16 bg-gradient-to-r ${currentStep.color} rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4`}
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 10px 25px rgba(0,0,0,0.1)",
                "0 20px 40px rgba(0,0,0,0.2)",
                "0 10px 25px rgba(0,0,0,0.1)"
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <CurrentIcon className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-xl font-semibold text-white mb-2">
            {currentStep.title}
          </h2>
          <p className="text-gray-300 text-sm">
            {currentStep.description}
          </p>
        </motion.div>

        {/* Barre de progression */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Points d'étapes */}
        <div className="flex justify-center space-x-2">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index <= step ? 'bg-blue-400' : 'bg-gray-600'
              }`}
              animate={{
                scale: index === step ? [1, 1.3, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: index === step ? Infinity : 0,
              }}
            />
          ))}
        </div>

        {/* Message d'attente */}
        <motion.p
          className="text-gray-400 text-xs mt-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Préparation de votre espace personnel...
        </motion.p>
      </motion.div>

      {/* Effet de fond supplémentaire */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-green-500/5"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05), rgba(34, 197, 94, 0.05))",
            "linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05))",
            "linear-gradient(225deg, rgba(147, 51, 234, 0.05), rgba(34, 197, 94, 0.05), rgba(59, 130, 246, 0.05))",
            "linear-gradient(315deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05), rgba(34, 197, 94, 0.05))"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
}