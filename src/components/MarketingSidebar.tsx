'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Megaphone, 
  MessageCircle, 
  CheckSquare, 
  Phone, 
  BarChart3, 
  Bot,
  Users,
  Building,
  Contact,
  ChevronLeft,
  Menu
} from 'lucide-react';

const marketingNavItems = [
  {
    section: 'Actions',
    items: [
      { name: 'Campagnes', href: '/dashboard/marketing', icon: Megaphone },
      { name: 'Chat', href: '/dashboard/marketing/chat', icon: MessageCircle },
      { name: 'Tasks', href: '/dashboard/marketing/tasks', icon: CheckSquare },
      { name: 'Calls', href: '/dashboard/marketing/calls', icon: Phone },
      { name: 'Reports', href: '/dashboard/marketing/reports', icon: BarChart3 },
      { name: 'Models', href: '/dashboard/marketing/models', icon: Bot },
    ]
  },
  {
    section: 'Research',
    items: [
      { name: 'People Data', href: '/dashboard/marketing/people-data', icon: Users },
      { name: 'Entreprises Data', href: '/dashboard/marketing/entreprises-data', icon: Building },
      { name: 'Contact', href: '/dashboard/marketing/contact', icon: Contact },
    ]
  }
];

interface MarketingSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function MarketingSidebar({ isCollapsed = false, onToggle }: MarketingSidebarProps) {
  const pathname = usePathname();

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-[#2c3e50] text-white h-screen fixed left-0 top-0 z-40 shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-[#34495e]">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 bg-[#3498db] rounded-lg">
                  <Megaphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold font-montserrat">Marketing</h1>
                  <p className="text-[#bdc3c7] text-sm font-open-sans">Hub de gestion</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {isCollapsed && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex justify-center"
            >
              <div className="p-2 bg-[#3498db] rounded-lg">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
            </motion.div>
          )}
          
          {onToggle && (
            <motion.button
              onClick={onToggle}
              className="p-1 hover:bg-[#34495e] rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={isCollapsed ? "Étendre la sidebar" : "Réduire la sidebar"}
            >
              <motion.div
                animate={{ rotate: isCollapsed ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronLeft className="h-5 w-5 text-[#bdc3c7]" />
              </motion.div>
            </motion.button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 py-6 space-y-8">
        {marketingNavItems.map((section) => (
          <div key={section.section}>
            {/* Section Title */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="text-xs font-semibold text-[#bdc3c7] uppercase tracking-wider mb-3 px-2"
                >
                  {section.section}
                </motion.h3>
              )}
            </AnimatePresence>
            
            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      className={`flex items-center ${isCollapsed ? 'justify-center px-3 py-3' : 'gap-3 px-3 py-2.5'} rounded-lg transition-all duration-200 group cursor-pointer ${
                        isActive
                          ? 'bg-[#3498db] text-white shadow-lg'
                          : 'text-[#bdc3c7] hover:bg-[#34495e] hover:text-white'
                      }`}
                      whileHover={{ x: isActive || isCollapsed ? 0 : 4 }}
                      whileTap={{ scale: 0.98 }}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon 
                        className={`h-5 w-5 transition-colors duration-200 ${
                          isActive ? 'text-white' : 'text-[#95a5a6] group-hover:text-[#3498db]'
                        }`} 
                      />
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="font-medium font-open-sans text-sm"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {isActive && !isCollapsed && (
                        <motion.div
                          className="ml-auto w-2 h-2 bg-white rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#34495e]">
        <AnimatePresence>
          {!isCollapsed ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#34495e] rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-[#2ecc71] rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-[#bdc3c7]">Statut</span>
              </div>
              <p className="text-xs text-[#95a5a6]">Connecté à Methos Marketing</p>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <div className="w-3 h-3 bg-[#2ecc71] rounded-full animate-pulse"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
