'use client'; // Indispensable car ce composant utilise des hooks et des composants client

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Brain, Menu, X } from 'lucide-react';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Logique de classes dynamiques (inchangée)
  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${isScrolled ? 'bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-md border-b border-white/20' : 'bg-transparent'}`;
  const titleClasses = `text-lg font-bold transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-gray-900'}`;
  const navLinkClasses = `font-medium transition-colors duration-300 hover:text-blue-200 ${isScrolled ? 'text-white' : 'text-gray-700'}`;
  const loginButtonClasses = `font-medium transition-colors duration-300 hover:text-blue-200 ${isScrolled ? 'text-white' : 'text-gray-700'}`;
  const mobileButtonClasses = `md:hidden transition-colors duration-300 ${isScrolled ? 'text-white' : 'text-gray-900'}`;
  const mobileBorderClasses = `border-t py-4 ${isScrolled ? 'border-white/20' : 'border-gray-200'}`;
  const mobileSeparatorClasses = `pt-4 border-t space-y-3 ${isScrolled ? 'border-white/20' : 'border-gray-200'}`;

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"><Brain className="w-5 h-5 text-white" /></div>
            <span className={titleClasses}>Bank Statement Converter IA</span>
          </div>
          <nav className="hidden md:flex items-center space-x-3">
            <a href="#features" className={navLinkClasses}>Fonctionnalités</a>
            <a href="#pricing" className={navLinkClasses}>Pricing</a>
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            <SignedOut>
              <Link href="/sign-in"><button className={loginButtonClasses}>Se connecter</button></Link>
              <Link href="/sign-up"><button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 font-medium border border-white/20">Commencer</button></Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard"><button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 font-medium border border-white/20">Mon Dashboard</button></Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
          <button className={mobileButtonClasses} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className={mobileBorderClasses}>
              <nav className="flex flex-col space-y-4">
                <a href="#features" className={navLinkClasses} onClick={() => setIsMenuOpen(false)}>Fonctionnalités</a>
                <a href="#pricing" className={navLinkClasses} onClick={() => setIsMenuOpen(false)}>Pricing</a>
                <div className={mobileSeparatorClasses}>
                  <SignedOut>
                    <Link href="/sign-in"><button className={loginButtonClasses} onClick={() => setIsMenuOpen(false)}>Se connecter</button></Link>
                    <Link href="/sign-up"><button className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all font-medium" onClick={() => setIsMenuOpen(false)}>Commencer</button></Link>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard"><button className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all font-medium" onClick={() => setIsMenuOpen(false)}>Mon Dashboard</button></Link>
                    <div className="flex items-center justify-between pt-2"><span className={navLinkClasses}>Mon Compte</span><UserButton afterSignOutUrl="/" /></div>
                  </SignedIn>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
