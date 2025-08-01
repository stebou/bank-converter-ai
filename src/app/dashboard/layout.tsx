// Dans : /src/app/dashboard/layout.tsx

'use client'; // <-- ÉTAPE 1: On transforme le layout en composant client

import React, { useState, useEffect } from 'react';
import { ChevronLeft, Menu, Brain } from 'lucide-react';
import { UserButton, useUser } from '@clerk/nextjs'; 
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';

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
      {/* On passe l'état et la fonction à la Sidebar professionnelle */}
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
              className="hidden md:block absolute top-6 left-0 z-50 -translate-x-1/2 bg-[#2c3e50] p-2 rounded-full border border-[#bdc3c7] shadow-lg hover:bg-[#34495e] transition-all duration-300 hover:scale-110"
              style={{ left: isSidebarOpen ? '18rem' : '5rem' }} // 18rem = w-72, 5rem = w-20
          >
              <ChevronLeft className={`w-4 h-4 text-white transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`} />
          </button>
          {children}
        </main>
      </div>
    </div>
  );
}