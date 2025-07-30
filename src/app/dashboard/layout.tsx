// Dans : /src/app/dashboard/layout.tsx

'use client'; // <-- ÉTAPE 1: On transforme le layout en composant client

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // <-- On importe le hook pour le lien actif
import { LayoutDashboard, User, Settings, HelpCircle, Brain, LogOut, ChevronLeft, Menu } from 'lucide-react';
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

// --- NOUVELLE SIDEBAR MODULAIRE (déplacée à l'intérieur pour la clarté) ---
const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/profil", icon: User, label: "Profil" },
    { href: "/dashboard/reglages", icon: Settings, label: "Réglages" },
    { href: "/dashboard/centre-aide", icon: HelpCircle, label: "Centre d'aide" },
  ];

  return (
    <aside className={`flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className={`h-20 flex items-center border-b border-gray-200 ${isOpen ? 'justify-between px-6' : 'justify-center'}`}>
        <Link href="/dashboard" className={`flex items-center gap-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <span className="text-lg font-bold text-gray-800">Bank-IA</span>
        </Link>
        {!isOpen && <Link href="/dashboard"><Brain className="w-8 h-8 text-blue-600" /></Link>}
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} 
                  className={`flex items-center py-2.5 rounded-lg transition-colors duration-200 ${isOpen ? 'px-4' : 'justify-center'} ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      
      <div className="px-4 py-6 border-t border-gray-200 space-y-2">
        <SignOutButton>
          <button className={`flex w-full items-center py-2.5 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 ${isOpen ? 'px-4' : 'justify-center'}`}>
            <LogOut className={`w-5 h-5 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
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