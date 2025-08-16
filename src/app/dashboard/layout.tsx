// Dans : /src/app/dashboard/layout.tsx

'use client'; // <-- ÉTAPE 1: On transforme le layout en composant client

import Sidebar from '@/components/Sidebar';
import { UserButton, useUser } from '@clerk/nextjs';
import { Brain, ChevronLeft, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

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
        name:
          `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() ||
          'Utilisateur',
      }),
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
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Synchroniser l'utilisateur dès que les données Clerk sont chargées
  useEffect(() => {
    if (isLoaded && user) {
      syncUserToDatabase(user);
    }
  }, [isLoaded, user]);

  // Pages sans sidebar principale (qui utilisent la sidebar marketing)
  const pagesWithoutSidebar = [
    '/dashboard/marketing/creer-campagne',
    '/dashboard/marketing/chat',
    '/dashboard/marketing/tasks',
  ];

  // Vérifier si on est sur une page entreprises-data (y compris les sous-pages)
  const isEntreprisesDataPage = pathname.startsWith(
    '/dashboard/marketing/entreprises-data'
  );
  const shouldShowSidebar =
    !pagesWithoutSidebar.includes(pathname) && !isEntreprisesDataPage;

  // Si c'est une page sans sidebar, on rend juste les children
  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* On passe l'état et la fonction à la Sidebar professionnelle */}
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />

      {/* On ajoute une barre de navigation en haut pour les écrans mobiles */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Brain className="h-7 w-7 text-blue-600" />
            <span className="text-md font-bold text-gray-800">Methos</span>
          </Link>
          <div className="flex items-center gap-4">
            <UserButton />
            <button onClick={toggleSidebar}>
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </header>

        {/* Le contenu de la page (page.tsx -> DashboardClientPage.tsx) s'affichera ici */}
        <main className="flex-1 overflow-y-auto">
          {/* On ajoute un bouton pour réduire la sidebar sur les grands écrans, positionné sur le contenu */}
          <button
            onClick={toggleSidebar}
            className="absolute left-0 top-6 z-50 hidden -translate-x-1/2 rounded-full border border-[#bdc3c7] bg-[#2c3e50] p-2 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-[#34495e] md:block"
            style={{ left: isSidebarOpen ? '18rem' : '5rem' }} // 18rem = w-72, 5rem = w-20
          >
            <ChevronLeft
              className={`h-4 w-4 text-white transition-transform duration-300 ${isSidebarOpen ? '' : 'rotate-180'}`}
            />
          </button>
          {children}
        </main>
      </div>
    </div>
  );
}
