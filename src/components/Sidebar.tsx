'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Settings,
  HelpCircle,
  Brain,
  LogOut,
  ChevronLeft,
  CreditCard,
  Sparkles,
  Building2,
  Package,
  Clock,
  Calculator,
  Megaphone,
} from 'lucide-react';
import { SignOutButton, useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import '../styles/fonts.css';
import AnalysisHistoryModal from './AnalysisHistoryModal';

// Types pour les données d'abonnement
interface SubscriptionData {
  currentPlan: string;
  subscriptionStatus: string | null;
  documentsLimit: number;
  documentsUsed: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

// Props du composant Sidebar
interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

export default function Sidebar({ isOpen, toggle }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAnalysisHistory, setShowAnalysisHistory] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Récupérer les données d'abonnement
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!user) return;

      try {
        const response = await fetch('/api/user/subscription');
        if (response.ok) {
          const data = await response.json();
          setSubscriptionData(data);
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  // Gérer les clics extérieurs pour fermer le menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const mainNavItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/ia-chat', icon: Sparkles, label: 'IA Chat' },
    { href: '/inventory', icon: Package, label: 'Stocks' },
    { href: '/dashboard/comptabilite', icon: Calculator, label: 'Ma comptabilité' },
    { href: '/dashboard/marketing', icon: Megaphone, label: 'Marketing' },
  ];

  const userMenuItems = [
    { href: '/dashboard/profil', icon: User, label: 'Profil' },
    { href: '/dashboard/reglages', icon: Settings, label: 'Réglages' },
    { href: '/dashboard/facturation', icon: CreditCard, label: 'Facturation' },
    {
      href: '/dashboard/centre-aide',
      icon: HelpCircle,
      label: "Centre d'aide",
    },
  ];

  const handleAnalysisHistoryClick = () => {
    setShowAnalysisHistory(true);
    setShowUserMenu(false);
  };

  return (
    <aside
      className={`flex flex-shrink-0 flex-col border-r border-[#bdc3c7] bg-[#ecf0f1] transition-all duration-500 ease-[0.25,0.46,0.45,0.94] ${isOpen ? 'w-72' : 'w-20'} relative z-40`}
    >
      {/* Header avec logo professionnel */}
      <div
        className={`relative z-10 flex h-24 items-center ${isOpen ? 'justify-between px-8' : 'justify-center'}`}
      >
        <Link
          href="/dashboard"
          className={`flex items-center gap-4 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2c3e50] shadow-lg">
            <Brain className="h-6 w-6 text-[#ecf0f1]" />
          </div>
          <div>
            <span className="font-montserrat text-xl font-bold tracking-tight text-[#2c3e50]">
              Bank-IA
            </span>
            <p className="font-open-sans -mt-1 text-xs text-[#34495e]">
              Dashboard
            </p>
          </div>
        </Link>
        {!isOpen && (
          <Link href="/dashboard">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2c3e50] shadow-lg">
              <Brain className="h-6 w-6 text-[#ecf0f1]" />
            </div>
          </Link>
        )}
      </div>

      {/* Navigation principale avec design professionnel */}
      <nav className="relative z-10 flex-1 space-y-3 px-4 py-8">
        {mainNavItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative flex items-center overflow-hidden rounded-2xl py-4 transition-all duration-300 ${isOpen ? 'px-6' : 'justify-center px-4'} ${
                isActive
                  ? 'scale-105 transform bg-[#2c3e50] text-[#ecf0f1] shadow-lg'
                  : 'text-[#34495e] hover:bg-white hover:text-[#2c3e50]'
              }`}
            >
              {/* Effet de hover subtil */}
              {!isActive && (
                <div className="absolute inset-0 rounded-2xl bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              )}

              <div className="relative z-10 flex w-full items-center">
                <item.icon
                  className={`h-6 w-6 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'} ${isOpen ? 'mr-4' : 'mx-auto'}`}
                />
                {isOpen && (
                  <div className="flex-1">
                    <span className="font-montserrat text-base font-semibold tracking-wide">
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="mt-1 h-0.5 w-6 rounded-full bg-[#ecf0f1]/40"></div>
                    )}
                  </div>
                )}
              </div>

              {/* Badge pour item actif */}
              {isActive && !isOpen && (
                <div className="absolute -right-2 top-1/2 h-8 w-1 -translate-y-1/2 transform rounded-full bg-[#2c3e50] shadow-lg"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer avec menu utilisateur et déconnexion */}
      <div className="relative z-10 space-y-4 border-t border-[#bdc3c7] px-4 py-6">
        {/* Menu utilisateur avec popup */}
        <div className="relative z-[9998]" ref={userMenuRef}>
          {isOpen && (
            <div
              className="flex cursor-pointer items-center space-x-3 rounded-xl border border-[#bdc3c7] bg-white p-3 transition-all duration-300 hover:shadow-lg"
              onMouseEnter={() => setShowUserMenu(true)}
              onMouseLeave={() => setShowUserMenu(false)}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              {(() => {
                const hasActiveSubscription =
                  subscriptionData?.subscriptionStatus === 'active';
                const planName = subscriptionData?.currentPlan || 'free';

                // Définir les couleurs selon le plan
                const getIconColors = () => {
                  if (hasActiveSubscription) {
                    return {
                      bgColor: 'bg-[#2c3e50]',
                      iconColor: 'text-[#ecf0f1]',
                    };
                  }
                  return {
                    bgColor: 'bg-[#bdc3c7]',
                    iconColor: 'text-[#ecf0f1]',
                  };
                };

                const { bgColor, iconColor } = getIconColors();

                // Formatage du nom du plan
                const getDisplayPlan = () => {
                  if (hasActiveSubscription) {
                    return `Plan ${planName.charAt(0).toUpperCase() + planName.slice(1)}`;
                  }
                  return 'Plan Gratuit';
                };

                return (
                  <>
                    <div
                      className={`h-10 w-10 ${bgColor} flex items-center justify-center rounded-xl transition-all duration-300`}
                    >
                      <User className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-montserrat text-sm font-medium text-[#2c3e50]">
                        {user?.firstName || user?.fullName || 'Utilisateur'}
                      </p>
                      <p
                        className={`font-ibm-plex-mono text-xs tracking-wide transition-colors duration-300 ${hasActiveSubscription ? 'text-[#2c3e50]' : 'text-[#34495e]'}`}
                      >
                        {getDisplayPlan()}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Menu popup */}
          <AnimatePresence>
            {showUserMenu && isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute bottom-0 left-full z-[9999] ml-4 min-w-[200px] rounded-2xl border border-[#bdc3c7] bg-white py-2 shadow-2xl"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                {/* Historique des analyses - lien spécial */}
                <button
                  onClick={handleAnalysisHistoryClick}
                  className="flex w-full items-center px-4 py-3 text-left text-[#34495e] transition-all duration-200 hover:bg-[#ecf0f1] hover:text-[#2c3e50]"
                >
                  <Clock className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="font-open-sans font-medium">
                    Historique Analyses
                  </span>
                </button>

                {/* Séparateur */}
                <div className="mx-4 my-1 h-px bg-[#bdc3c7]"></div>

                {userMenuItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={`flex items-center px-4 py-3 transition-all duration-200 ${
                        isActive
                          ? 'bg-[#2c3e50] text-[#ecf0f1]'
                          : 'text-[#34495e] hover:bg-[#ecf0f1] hover:text-[#2c3e50]'
                      }`}
                      onClick={() => setShowUserMenu(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="font-open-sans font-medium">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <SignOutButton>
          <button
            className={`group flex w-full items-center rounded-xl py-3 text-[#34495e] transition-all duration-300 hover:bg-white hover:text-[#2c3e50] ${isOpen ? 'px-4' : 'justify-center'}`}
          >
            <LogOut
              className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isOpen ? 'mr-3' : 'mx-auto'}`}
            />
            {isOpen && (
              <span className="font-open-sans text-sm font-medium">
                Déconnexion
              </span>
            )}
          </button>
        </SignOutButton>
      </div>

      {/* Modal Historique des Analyses */}
      <AnalysisHistoryModal
        isOpen={showAnalysisHistory}
        onClose={() => setShowAnalysisHistory(false)}
      />
    </aside>
  );
}
