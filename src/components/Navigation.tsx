// Fichier : src/components/Navigation.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Brain, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openSignInModal = () => {
    setAuthMode('signin');
    setAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  const openSignUpModal = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
    setIsMenuOpen(false);
  };

  // --- ANIMATION CORRIGÉE POUR L'EFFET DE RÉTRÉCISSEMENT ---
  const navVariants = {
    // État initial : la barre est large et flottante
    initial: {
      y: 16,
      width: '95%',
      borderRadius: '9999px',
      paddingTop: '1rem',
      paddingBottom: '1rem',
    },
    // État au scroll : la barre se resserre vers le centre
    scrolled: {
      y: 0,
      width: '60%', // Se resserre significativement
      borderRadius: '12px',
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
    },
  };

  const navLinks = [
    { href: "#features", text: "Fonctionnalités" },
    { href: "#pricing", text: "Tarifs" },
  ];

  return (
    // --- STRUCTURE STICKY CORRIGÉE : C'EST LA CLÉ ! ---
    <div className="sticky top-0 z-50 w-full flex justify-center pt-4">
      <motion.div
        className="bg-black/50 backdrop-blur-lg border border-white/10 shadow-2xl"
        variants={navVariants}
        animate={isScrolled ? 'scrolled' : 'initial'}
        transition={{ 
          duration: 0.35, 
          ease: [0.16, 1, 0.3, 1] // Courbe d'animation professionnelle
        }}
        style={{
          maxWidth: '72rem', // Contrainte de largeur maximale
        }}
      >
        <div className="flex items-center justify-between px-6">
          {/* Section Gauche : Logo + Liens de navigation */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Bank-IA</span>
            </Link>
            
            {/* Liens de navigation à côté du logo */}
            <nav className="hidden md:flex items-center space-x-4">
              {navLinks.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  className="relative rounded-lg px-3 py-2 text-sm text-white/80 transition-colors duration-300 hover:text-white group"
                >
                  {link.text}
                  <span className="absolute bottom-1 left-0 h-0.5 w-full origin-center scale-x-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-transform duration-300 ease-out group-hover:scale-x-50" />
                </a>
              ))}
            </nav>
          </div>

          {/* Section Droite : Authentification */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedOut>
              <button 
                onClick={openSignInModal}
                className="text-sm font-medium text-white/80 transition-colors duration-300 hover:text-white"
              >
                Se connecter
              </button>
              <button 
                onClick={openSignUpModal}
                className="transform rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90"
              >
                Commencer
              </button>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="transform rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:opacity-90">
                  Mon Dashboard
                </button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Bouton du menu mobile */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Menu Mobile avec animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-4 right-4 mt-2 bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl z-50"
          >
            <nav className="flex flex-col items-center p-8 space-y-6">
              {navLinks.map((link) => (
                <a 
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xl text-white hover:text-blue-400 transition-colors"
                >
                  {link.text}
                </a>
              ))}
              
              <div className="pt-4 border-t border-white/20 w-full flex flex-col items-center space-y-4">
                <SignedOut>
                  <button 
                    onClick={openSignInModal}
                    className="text-lg text-white hover:text-blue-400"
                  >
                    Se connecter
                  </button>
                  <button 
                    onClick={openSignUpModal}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold"
                  >
                    Commencer
                  </button>
                </SignedOut>
                <SignedIn>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold">
                      Mon Dashboard
                    </button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal d'authentification */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultMode={authMode}
      />
    </div>
  );
};
