'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, Settings, HelpCircle, Brain, LogOut, ChevronLeft, CreditCard, Sparkles, Building2 } from 'lucide-react';
import { SignOutButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import '../styles/fonts.css';

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
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);

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

  const mainNavItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/ia-chat", icon: Sparkles, label: "IA Chat" },
    { href: "/dashboard/facturation", icon: CreditCard, label: "Facturation" },
  ];

  const secondaryNavItems = [
    { href: "/dashboard/profil", icon: User, label: "Profil" },
    { href: "/dashboard/reglages", icon: Settings, label: "Réglages" },
    { href: "/dashboard/centre-aide", icon: HelpCircle, label: "Centre d'aide" },
  ];

  return (
    <aside className={`flex-shrink-0 bg-[#ecf0f1] border-r border-[#bdc3c7] flex flex-col transition-all duration-500 ease-[0.25,0.46,0.45,0.94] ${isOpen ? 'w-72' : 'w-20'} relative`}>
      
      {/* Header avec logo professionnel */}
      <div className={`h-24 flex items-center relative z-10 ${isOpen ? 'justify-between px-8' : 'justify-center'}`}>
        <Link href="/dashboard" className={`flex items-center gap-4 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-10 h-10 bg-[#2c3e50] rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-[#ecf0f1]" />
          </div>
          <div>
            <span className="text-xl font-bold text-[#2c3e50] font-montserrat tracking-tight">
              Bank-IA
            </span>
            <p className="text-xs text-[#34495e] -mt-1 font-open-sans">Dashboard</p>
          </div>
        </Link>
        {!isOpen && (
          <Link href="/dashboard">
            <div className="w-10 h-10 bg-[#2c3e50] rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-[#ecf0f1]" />
            </div>
          </Link>
        )}
      </div>
      
      {/* Navigation principale avec design professionnel */}
      <nav className="flex-1 px-4 py-8 space-y-3 relative z-10">
        {mainNavItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} 
                  className={`group flex items-center py-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${isOpen ? 'px-6' : 'justify-center px-4'} ${
                    isActive 
                      ? 'bg-[#2c3e50] text-[#ecf0f1] shadow-lg transform scale-105' 
                      : 'text-[#34495e] hover:text-[#2c3e50] hover:bg-white'
                  }`}>
              
              {/* Effet de hover subtil */}
              {!isActive && (
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              )}
              
              <div className="relative z-10 flex items-center w-full">
                <item.icon className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'} ${isOpen ? 'mr-4' : 'mx-auto'}`} />
                {isOpen && (
                  <div className="flex-1">
                    <span className="text-base font-semibold font-montserrat tracking-wide">{item.label}</span>
                    {isActive && (
                      <div className="w-6 h-0.5 bg-[#ecf0f1]/40 rounded-full mt-1"></div>
                    )}
                  </div>
                )}
              </div>

              {/* Badge pour item actif */}
              {isActive && !isOpen && (
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#2c3e50] rounded-full shadow-lg"></div>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Navigation secondaire (en bas) */}
      <div className="px-4 border-t border-[#bdc3c7] py-4 relative z-10">
        {secondaryNavItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} 
                  className={`group flex items-center py-3 rounded-xl transition-all duration-300 relative overflow-hidden mb-2 ${isOpen ? 'px-4' : 'justify-center px-3'} ${
                    isActive 
                      ? 'bg-[#2c3e50] text-[#ecf0f1] shadow-md transform scale-105' 
                      : 'text-[#34495e] hover:text-[#2c3e50] hover:bg-white'
                  }`}>
              
              {/* Effet de hover subtil */}
              {!isActive && (
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              )}
              
              <div className="relative z-10 flex items-center w-full">
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'} ${isOpen ? 'mr-3' : 'mx-auto'}`} />
                {isOpen && (
                  <div className="flex-1">
                    <span className="text-sm font-medium font-open-sans">{item.label}</span>
                    {isActive && (
                      <div className="w-4 h-0.5 bg-[#ecf0f1]/40 rounded-full mt-1"></div>
                    )}
                  </div>
                )}
              </div>

              {/* Badge pour item actif */}
              {isActive && !isOpen && (
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-[#2c3e50] rounded-full shadow-lg"></div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer avec déconnexion */}
      <div className="px-4 py-6 border-t border-[#bdc3c7] space-y-4 relative z-10">
        {/* User info si ouvert */}
        {isOpen && (
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-white border border-[#bdc3c7]">
            {(() => {
              const hasActiveSubscription = subscriptionData?.subscriptionStatus === 'active';
              const planName = subscriptionData?.currentPlan || 'free';
              
              // Définir les couleurs selon le plan
              const getIconColors = () => {
                if (hasActiveSubscription) {
                  return {
                    bgColor: 'bg-[#2c3e50]',
                    iconColor: 'text-[#ecf0f1]'
                  };
                }
                return {
                  bgColor: 'bg-[#bdc3c7]',
                  iconColor: 'text-[#ecf0f1]'
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
                  <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center transition-all duration-300`}>
                    <User className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2c3e50] font-montserrat">
                      {user?.firstName || user?.fullName || 'Utilisateur'}
                    </p>
                    <p className={`text-xs transition-colors duration-300 font-ibm-plex-mono tracking-wide ${hasActiveSubscription ? 'text-[#2c3e50]' : 'text-[#34495e]'}`}>
                      {getDisplayPlan()}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        )}
        
        <SignOutButton>
          <button className={`group flex w-full items-center py-3 rounded-xl transition-all duration-300 text-[#34495e] hover:text-[#2c3e50] hover:bg-white ${isOpen ? 'px-4' : 'justify-center'}`}>
            <LogOut className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
            {isOpen && <span className="text-sm font-medium font-open-sans">Déconnexion</span>}
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}