'use client';

// CORRECTION : Ajout de tous les imports manquants
import React, { useState } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Brain, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Le composant est maintenant exporté pour pouvoir être importé ailleurs
export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // STYLE MIS À JOUR : Thème clair pour être cohérent avec la page
  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
    isScrolled
      ? 'bg-white/70 backdrop-blur-lg border-b border-gray-200/80 shadow-md'
      : 'bg-transparent'
  }`;
  
  const textClasses = `transition-colors duration-300 ${
    isScrolled ? 'text-gray-800' : 'text-gray-900'
  }`;

  const navLinks = [
    { href: "#features", text: "Fonctionnalités" },
    { href: "#pricing", text: "Tarifs" },
  ];

  return (
    <header className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-300 ${isScrolled ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white' : 'bg-white shadow-sm'}`}>
              <Brain className="w-6 h-6" />
            </div>
            <span className={`text-xl font-bold ${textClasses}`}>Bank-IA</span>
          </Link>

          {/* Navigation Bureau */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg transition-colors duration-300 group ${isScrolled ? 'text-gray-600 hover:text-black' : 'text-gray-700 hover:text-black'}`}
              >
                {link.text}
                <span className="absolute bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 scale-x-0 group-hover:scale-x-50 transition-transform duration-300 ease-out origin-center" />
              </a>
            ))}
          </nav>

          {/* Boutons d'authentification Bureau */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedOut>
              <Link href="/sign-in" className={`${textClasses} hover:text-blue-600 font-medium transition-colors duration-300`}>
                Se connecter
              </Link>
              <Link href="/sign-up">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Commencer
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                 <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg">
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
              className={`${textClasses} focus:outline-none`}
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile avec animation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-xl"
          >
            <nav className="flex flex-col items-center p-8 space-y-6">
              {navLinks.map((link, i) => (
                 <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * (i + 1), duration: 0.2 }}
                    className="text-2xl text-gray-800 hover:text-blue-600"
                 >
                    {link.text}
                </motion.a>
              ))}

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="pt-8 border-t border-gray-200 w-full flex flex-col items-center space-y-6"
              >
                <SignedOut>
                  <Link href="/sign-in" onClick={() => setIsMenuOpen(false)} className="text-xl text-gray-700 hover:text-blue-600">
                    Se connecter
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-3 rounded-xl font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">
                      Commencer gratuitement
                    </button>
                  </Link>
                </SignedOut>
                <SignedIn>
                   <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-3 rounded-xl font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg">
                       Mon Dashboard
                    </button>
                  </Link>
                  <div className="flex items-center justify-between w-full max-w-xs pt-4">
                    <span className="text-xl text-gray-800">Mon Compte</span>
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};