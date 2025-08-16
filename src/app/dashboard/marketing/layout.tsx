'use client';

import MarketingSidebar from '@/components/MarketingSidebar';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Afficher la sidebar marketing sur la page de création de campagne, chat, tasks ET entreprises-data (y compris les sous-pages)
  const isCreerCampagnePage =
    pathname === '/dashboard/marketing/creer-campagne';
  const isChatPage = pathname === '/dashboard/marketing/chat';
  const isTasksPage = pathname === '/dashboard/marketing/tasks';
  const isEntreprisesDataPage = pathname.startsWith(
    '/dashboard/marketing/entreprises-data'
  );
  const shouldShowMarketingSidebar =
    isCreerCampagnePage || isChatPage || isTasksPage || isEntreprisesDataPage;

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (shouldShowMarketingSidebar) {
    return (
      <div className="flex h-screen bg-[#ecf0f1]">
        {/* Marketing Sidebar */}
        <MarketingSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
        />

        {/* Main Content */}
        <div
          className="flex-1 overflow-auto transition-all duration-300 ease-in-out"
          style={{
            marginLeft: isSidebarCollapsed ? '80px' : '256px',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
