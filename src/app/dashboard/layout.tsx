// Dans : /src/app/dashboard/layout.tsx

'use client'; // <-- ÉTAPE 1: On transforme le layout en composant client

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // <-- On importe le hook pour le lien actif
import { LayoutDashboard, User, Settings, HelpCircle, Brain, LogOut, ChevronLeft, Menu, CreditCard, Sparkles } from 'lucide-react';
import { SignOutButton, UserButton, useUser } from '@clerk/nextjs'; 
import Link from 'next/link';

// Fonction pour synchroniser l'utilisateur avec la base de données
async function syncUserToDatabase(clerkUser: {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName?: string | null;
  lastName?: string | null;
}) {
  try {
    const response = await fetch('/api/sync-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Utilisateur'
      })
    });
    
    if (response.ok) {
      console.log('[SYNC] User synchronized successfully');
    }
  } catch (error) {
    console.error('[SYNC] Error syncing user:', error);
  }
}

// Types pour les données d'abonnement
interface SubscriptionData {
  currentPlan: string;
  subscriptionStatus: string | null;
  documentsLimit: number;
  documentsUsed: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

// --- SIDEBAR MODERNE 2025 ---
const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
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
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", color: "from-blue-500 to-blue-600" },
    { href: "/dashboard/profil", icon: User, label: "Profil", color: "from-purple-500 to-purple-600" },
    { href: "/dashboard/ia-chat", icon: Sparkles, label: "IA Chat", color: "from-yellow-500 to-orange-600" },
    { href: "/dashboard/facturation", icon: CreditCard, label: "Facturation", color: "from-emerald-500 to-emerald-600" },
  ];

  const secondaryNavItems = [
    { href: "/dashboard/reglages", icon: Settings, label: "Réglages", color: "from-green-500 to-green-600" },
    { href: "/dashboard/centre-aide", icon: HelpCircle, label: "Centre d'aide", color: "from-indigo-500 to-indigo-600" },
  ];

  return (
    <aside className={`flex-shrink-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700/50 flex flex-col transition-all duration-500 ease-[0.25,0.46,0.45,0.94] backdrop-blur-xl ${isOpen ? 'w-72' : 'w-20'} relative`}>
      {/* Effet glassmorphism moderne */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-green-500/5 rounded-r-3xl"></div>
      
      {/* Header avec logo moderne */}
      <div className={`h-24 flex items-center relative z-10 ${isOpen ? 'justify-between px-8' : 'justify-center'}`}>
        <Link href="/dashboard" className={`flex items-center gap-4 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              Bank-IA
            </span>
            <p className="text-xs text-gray-400 -mt-1">Dashboard</p>
          </div>
        </Link>
        {!isOpen && (
          <Link href="/dashboard">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </Link>
        )}
      </div>
      
      {/* Navigation principale avec design moderne */}
      <nav className="flex-1 px-4 py-8 space-y-3 relative z-10">
        {mainNavItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} 
                  className={`group flex items-center py-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${isOpen ? 'px-6' : 'justify-center px-4'} ${
                    isActive 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105` 
                      : 'text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                  }`}>
              
              {/* Effet de hover subtil */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              )}
              
              <div className="relative z-10 flex items-center w-full">
                <item.icon className={`w-6 h-6 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'} ${isOpen ? 'mr-4' : 'mx-auto'}`} />
                {isOpen && (
                  <div className="flex-1">
                    <span className="text-base font-semibold">{item.label}</span>
                    {isActive && (
                      <div className="w-6 h-0.5 bg-white/30 rounded-full mt-1"></div>
                    )}
                  </div>
                )}
              </div>

              {/* Badge moderne pour item actif */}
              {isActive && !isOpen && (
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-full shadow-lg"></div>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Navigation secondaire (en bas) */}
      <div className="px-4 border-t border-gray-700/30 py-4 relative z-10">
        {secondaryNavItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} 
                  className={`group flex items-center py-3 rounded-xl transition-all duration-300 relative overflow-hidden mb-2 ${isOpen ? 'px-4' : 'justify-center px-3'} ${
                    isActive 
                      ? `bg-gradient-to-r ${item.color} text-white shadow-md transform scale-105` 
                      : 'text-gray-400 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                  }`}>
              
              {/* Effet de hover subtil */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              )}
              
              <div className="relative z-10 flex items-center w-full">
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'} ${isOpen ? 'mr-3' : 'mx-auto'}`} />
                {isOpen && (
                  <div className="flex-1">
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <div className="w-4 h-0.5 bg-white/30 rounded-full mt-1"></div>
                    )}
                  </div>
                )}
              </div>

              {/* Badge moderne pour item actif */}
              {isActive && !isOpen && (
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-full shadow-lg"></div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer moderne avec déconnexion */}
      <div className="px-4 py-6 border-t border-gray-700/30 space-y-4 relative z-10">
        {/* User info si ouvert */}
        {isOpen && (
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm">
            {(() => {
              const hasActiveSubscription = subscriptionData?.subscriptionStatus === 'active';
              const planName = subscriptionData?.currentPlan || 'free';
              
              // Définir les couleurs selon le plan
              const getIconColors = () => {
                if (hasActiveSubscription) {
                  return {
                    gradient: 'from-emerald-500 to-green-500',
                    iconColor: 'text-white'
                  };
                }
                return {
                  gradient: 'from-gray-600 to-gray-700',
                  iconColor: 'text-gray-300'
                };
              };

              const { gradient, iconColor } = getIconColors();
              
              // Formatage du nom du plan
              const getDisplayPlan = () => {
                if (hasActiveSubscription) {
                  return `Plan ${planName.charAt(0).toUpperCase() + planName.slice(1)}`;
                }
                return 'Plan Gratuit';
              };

              return (
                <>
                  <div className={`w-10 h-10 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center transition-all duration-300`}>
                    <User className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user?.firstName || user?.fullName || 'Utilisateur'}
                    </p>
                    <p className={`text-xs transition-colors duration-300 ${hasActiveSubscription ? 'text-emerald-300' : 'text-gray-400'}`}>
                      {getDisplayPlan()}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        )}
        
        <SignOutButton>
          <button className={`group flex w-full items-center py-3 rounded-xl transition-all duration-300 text-gray-300 hover:text-red-400 hover:bg-red-500/10 ${isOpen ? 'px-4' : 'justify-center'}`}>
            <LogOut className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
            {isOpen && <span className="text-sm font-medium">Déconnexion</span>}
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
};

// --- LE LAYOUT PRINCIPAL (MAINTENANT UN COMPOSANT CLIENT) ---
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, isLoaded } = useUser();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Synchroniser l'utilisateur dès que les données Clerk sont chargées
  useEffect(() => {
    if (isLoaded && user) {
      syncUserToDatabase(user);
    }
  }, [isLoaded, user]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* On passe l'état et la fonction à la Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />

      {/* On ajoute une barre de navigation en haut pour les écrans mobiles */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
            <Link href="/dashboard" className="flex items-center gap-2">
                <Brain className="w-7 h-7 text-blue-600" />
                <span className="text-md font-bold text-gray-800">Bank-IA</span>
            </Link>
            <div className='flex items-center gap-4'>
                <UserButton afterSignOutUrl="/" />
                <button onClick={toggleSidebar}>
                    <Menu className="w-6 h-6 text-gray-600"/>
                </button>
            </div>
        </header>

        {/* Le contenu de la page (page.tsx -> DashboardClientPage.tsx) s'affichera ici */}
        <main className="flex-1 overflow-y-auto">
          {/* On ajoute un bouton pour réduire la sidebar sur les grands écrans, positionné sur le contenu */}
          <button 
              onClick={toggleSidebar} 
              className="hidden md:block absolute top-6 left-0 z-10 -translate-x-1/2 bg-white p-1.5 rounded-full border border-gray-200 shadow-md hover:bg-gray-100 transition-all"
              style={{ left: isSidebarOpen ? '16rem' : '5rem' }} // 16rem = w-64, 5rem = w-20
          >
              <ChevronLeft className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} />
          </button>
          {children}
        </main>
      </div>
    </div>
  );
}