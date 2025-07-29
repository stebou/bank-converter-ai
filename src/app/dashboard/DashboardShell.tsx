// Dans : /src/app/dashboard/DashboardShell.tsx

'use client';

import React, { useState } from 'react';
import { LayoutDashboard, User, Settings, HelpCircle, Brain, LogOut, ChevronLeft } from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs'; 
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// --- NOUVELLE SIDEBAR MODULAIRE ---
const Sidebar = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => {
  const pathname = usePathname(); // Hook pour savoir quelle page est active

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/profil", icon: User, label: "Profil" },
    { href: "/dashboard/reglages", icon: Settings, label: "Réglages" },
    { href: "/dashboard/centre-aide", icon: HelpCircle, label: "Centre d'aide" },
  ];

  return (
    // On change la largeur et le padding en fonction de l'état 'isOpen'
    <aside className={`flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className={`h-20 flex items-center border-b border-gray-200 ${isOpen ? 'justify-between px-6' : 'justify-center'}`}>
        <div className={`flex items-center gap-3 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <span className="text-lg font-bold text-gray-800">Bank-IA</span>
        </div>
        {/* On peut aussi afficher juste le logo quand c'est fermé */}
        {!isOpen && <Brain className="w-8 h-8 text-blue-600" />}
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.label} href={item.href} 
                  className={`flex items-center py-2.5 rounded-lg transition-colors duration-200 ${isOpen ? 'px-4' : 'justify-center'} ${isActive ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
              {/* On n'affiche le texte que si la sidebar est ouverte */}
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
        {/* BOUTON POUR RÉDUIRE/AGRANDIR */}
        <button onClick={toggle} className={`flex w-full items-center py-2.5 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100 ${isOpen ? 'px-4' : 'justify-center'}`}>
          <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${isOpen ? '' : 'rotate-180'} ${isOpen ? 'mr-3' : 'mx-auto'}`} />
          {isOpen && <span className="text-sm font-medium">Réduire</span>}
        </button>
      </div>
    </aside>
  );
};

// --- COMPOSANT COQUILLE PRINCIPAL ---
export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}