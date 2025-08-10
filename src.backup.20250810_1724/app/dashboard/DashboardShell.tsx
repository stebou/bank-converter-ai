// Dans : /src/app/dashboard/DashboardShell.tsx

'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  User,
  Settings,
  HelpCircle,
  Brain,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// --- SIDEBAR STYLE PROFESSIONNEL PUR ---
const Sidebar = ({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/profil', icon: User, label: 'Profil' },
    { href: '/dashboard/reglages', icon: Settings, label: 'Réglages' },
    {
      href: '/dashboard/centre-aide',
      icon: HelpCircle,
      label: "Centre d'aide",
    },
  ];

  return (
    <aside
      className={`flex flex-shrink-0 flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}
    >
      {/* Header professionnel épuré */}
      <div
        className={`flex h-20 items-center border-b border-gray-200 ${isOpen ? 'justify-start px-6' : 'justify-center'}`}
      >
        <div
          className={`flex items-center gap-3 transition-all duration-300 ${isOpen ? 'opacity-100' : 'w-0 opacity-0'}`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">Bank-IA</span>
            <div className="text-xs text-gray-500">Financial Intelligence</div>
          </div>
        </div>

        {/* Logo compact quand fermé */}
        {!isOpen && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Brain className="h-5 w-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation épurée */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map(item => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative flex items-center rounded-xl py-3 transition-all duration-200 ${
                isOpen ? 'px-4' : 'justify-center'
              } ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`h-5 w-5 flex-shrink-0 ${isOpen ? 'mr-3' : 'mx-auto'}`}
              />

              {/* Texte seulement si sidebar ouverte */}
              {isOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}

              {/* Tooltip épuré pour mode fermé */}
              {!isOpen && (
                <div className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded bg-gray-600 px-3 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer épuré */}
      <div className="space-y-2 border-t border-gray-200 px-4 py-6">
        <SignOutButton>
          <button
            className={`group relative flex w-full items-center rounded-xl py-3 text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 ${
              isOpen ? 'px-4' : 'justify-center'
            }`}
          >
            <LogOut className={`h-5 w-5 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
            {isOpen && <span className="text-sm font-medium">Déconnexion</span>}

            {/* Tooltip épuré */}
            {!isOpen && (
              <div className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded bg-gray-900 px-3 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Déconnexion
              </div>
            )}
          </button>
        </SignOutButton>

        {/* Bouton toggle épuré */}
        <button
          onClick={toggle}
          className={`group relative flex w-full items-center rounded-xl py-3 text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 ${
            isOpen ? 'px-4' : 'justify-center'
          }`}
        >
          <ChevronLeft
            className={`h-5 w-5 transition-transform duration-300 ${
              isOpen ? '' : 'rotate-180'
            } ${isOpen ? 'mr-3' : 'mx-auto'}`}
          />
          {isOpen && <span className="text-sm font-medium">Réduire</span>}

          {/* Tooltip épuré */}
          {!isOpen && (
            <div className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded bg-gray-900 px-3 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              {isOpen ? 'Réduire' : 'Agrandir'}
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

// --- COMPOSANT COQUILLE PRINCIPAL ---
export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
