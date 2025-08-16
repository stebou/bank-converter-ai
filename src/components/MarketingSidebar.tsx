'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Bot,
  Building,
  CheckSquare,
  ChevronLeft,
  Contact,
  Megaphone,
  MessageCircle,
  Phone,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const marketingNavItems = [
  {
    section: 'Actions',
    items: [
      { name: 'Campagnes', href: '/dashboard/marketing', icon: Megaphone },
      { name: 'Chat', href: '/dashboard/marketing/chat', icon: MessageCircle },
      { name: 'Tasks', href: '/dashboard/marketing/tasks', icon: CheckSquare },
      { name: 'Calls', href: '/dashboard/marketing/calls', icon: Phone },
      {
        name: 'Reports',
        href: '/dashboard/marketing/reports',
        icon: BarChart3,
      },
      { name: 'Models', href: '/dashboard/marketing/models', icon: Bot },
    ],
  },
  {
    section: 'Research',
    items: [
      {
        name: 'People Data',
        href: '/dashboard/marketing/people-data',
        icon: Users,
      },
      {
        name: 'Entreprises Data',
        href: '/dashboard/marketing/entreprises-data',
        icon: Building,
      },
      { name: 'Contact', href: '/dashboard/marketing/contact', icon: Contact },
    ],
  },
];

interface MarketingSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function MarketingSidebar({
  isCollapsed = false,
  onToggle,
}: MarketingSidebarProps) {
  const pathname = usePathname();

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 h-screen overflow-hidden bg-[#2c3e50] text-white shadow-2xl"
    >
      {/* Header */}
      <div className="border-b border-[#34495e] p-6">
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
                <div className="rounded-lg bg-[#3498db] p-2">
                  <Megaphone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="font-montserrat text-xl font-bold">
                    Marketing
                  </h1>
                  <p className="font-open-sans text-sm text-[#bdc3c7]">
                    Hub de gestion
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex w-full justify-center"
            >
              <div className="rounded-lg bg-[#3498db] p-2">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
            </motion.div>
          )}

          {onToggle && (
            <motion.button
              onClick={onToggle}
              className="rounded-lg p-1 transition-colors hover:bg-[#34495e]"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={
                isCollapsed ? 'Étendre la sidebar' : 'Réduire la sidebar'
              }
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
      <div className="space-y-8 px-4 py-6">
        {marketingNavItems.map(section => (
          <div key={section.section}>
            {/* Section Title */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.h3
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-[#bdc3c7]"
                >
                  {section.section}
                </motion.h3>
              )}
            </AnimatePresence>

            {/* Section Items */}
            <div className="space-y-1">
              {section.items.map(item => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      className={`flex items-center ${isCollapsed ? 'justify-center px-3 py-3' : 'gap-3 px-3 py-2.5'} group cursor-pointer rounded-lg transition-all duration-200 ${
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
                          isActive
                            ? 'text-white'
                            : 'text-[#95a5a6] group-hover:text-[#3498db]'
                        }`}
                      />
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                            className="font-open-sans text-sm font-medium"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {isActive && !isCollapsed && (
                        <motion.div
                          className="ml-auto h-2 w-2 rounded-full bg-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                          }}
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
      <div className="absolute bottom-0 left-0 right-0 border-t border-[#34495e] p-4">
        <AnimatePresence>
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="rounded-lg bg-[#34495e] p-3"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#2ecc71]"></div>
                <span className="text-xs font-medium text-[#bdc3c7]">
                  Statut
                </span>
              </div>
              <p className="text-xs text-[#95a5a6]">
                Connecté à Methos Marketing
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <div className="h-3 w-3 animate-pulse rounded-full bg-[#2ecc71]"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
