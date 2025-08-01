// Dans : /src/app/dashboard/DashboardShell.tsx

'use client';

import React, { useState } from 'react';
import { LayoutDashboard, User, Settings, HelpCircle, Brain, LogOut, ChevronLeft } from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs'; 
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// --- SIDEBAR STYLE PROFESSIONNEL PUR ---  
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
      {/* Header professionnel épuré */}
      <div className={`h-20 flex items-center border-b border-gray-200 ${isOpen ? 'justify-start px-6' : 'justify-center'}`}>
        <div className={`flex items-center gap-3 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">Bank-IA</span>
            <div className="text-xs text-gray-500">Financial Intelligence</div>
          </div>
        </div>
        
        {/* Logo compact quand fermé */}
        {!isOpen && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      
      {/* Navigation épurée */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.label} 
              href={item.href} 
              className={`flex items-center py-3 rounded-xl transition-all duration-200 group relative ${
                isOpen ? 'px-4' : 'justify-center'
              } ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
              
              {/* Texte seulement si sidebar ouverte */}
              {isOpen && (
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              )}
              
              {/* Tooltip épuré pour mode fermé */}
              {!isOpen && (
                <div className="absolute left-full ml-2 px-3 py-1 bg-gray-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer épuré */}
      <div className="px-4 py-6 border-t border-gray-200 space-y-2">
        <SignOutButton>
          <button className={`flex w-full items-center py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 group relative ${
            isOpen ? 'px-4' : 'justify-center'
          }`}>
            <LogOut className={`w-5 h-5 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
            {isOpen && <span className="text-sm font-medium">Déconnexion</span>}
            
            {/* Tooltip épuré */}
            {!isOpen && (
              <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Déconnexion
              </div>
            )}
          </button>
        </SignOutButton>
        
        {/* Bouton toggle épuré */}
        <button 
          onClick={toggle} 
          className={`flex w-full items-center py-3 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 group relative ${
            isOpen ? 'px-4' : 'justify-center'
          }`}
        >
          <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? '' : 'rotate-180'
          } ${isOpen ? 'mr-3' : 'mx-auto'}`} />
          {isOpen && <span className="text-sm font-medium">Réduire</span>}
          
          {/* Tooltip épuré */}
          {!isOpen && (
            <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {isOpen ? 'Réduire' : 'Agrandir'}
            </div>
          )}
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