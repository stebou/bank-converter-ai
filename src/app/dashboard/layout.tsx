// Dans src/app/dashboard/layout.tsx

import React from 'react';
// Importe SignOutButton depuis clerk/nextjs
import { LayoutDashboard, User, Settings, HelpCircle, Brain, LogOut } from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs'; 
import Link from 'next/link';

// Composant Sidebar (mis à jour)
const Sidebar = () => (
  <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
    {/* ... (le haut de la sidebar ne change pas) ... */}
    <div className="h-20 flex items-center justify-center px-6 border-b border-gray-200">
      <div className="flex items-center gap-3">
        <Brain className="w-8 h-8 text-blue-600" />
        <span className="text-lg font-bold text-gray-800">BankStatement IA</span>
      </div>
    </div>
    <nav className="flex-1 px-4 py-6 space-y-2">
      {/* ... (les liens de navigation ne changent pas) ... */}
       <Link href="/dashboard" className="flex items-center px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
        <LayoutDashboard className="w-5 h-5 mr-3" />
        Dashboard
      </Link>
      <Link href="/dashboard/profil" className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
        <User className="w-5 h-5 mr-3" />
        Profil
      </Link>
      <Link href="/dashboard/reglages" className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
        <Settings className="w-5 h-5 mr-3" />
        Réglages
      </Link>
      <Link href="/dashboard/centre-aide" className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
        <HelpCircle className="w-5 h-5 mr-3" />
        Centre d'aide
      </Link>
    </nav>
    <div className="px-4 py-6 border-t border-gray-200">
       {/* --- MODIFICATION ICI --- */}
       <SignOutButton>
          <button className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </button>
       </SignOutButton>
    </div>
  </aside>
);

// Le reste du fichier DashboardLayout ne change pas
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
