'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreerCampagneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleReturnToDashboard = () => {
    router.push('/dashboard/marketing');
  };

  return (
    <div className="min-h-screen bg-[#ecf0f1]">
      {/* Header avec bouton retour */}
      <header className="bg-white border-b border-[#bdc3c7] shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleReturnToDashboard}
              className="flex items-center gap-2 px-4 py-2 bg-[#2c3e50] text-white rounded-lg hover:bg-[#34495e] transition-all duration-200 text-sm font-medium shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChevronLeft className="h-4 w-4" />
              Retour au Marketing
            </motion.button>

            <div className="h-6 w-px bg-[#bdc3c7]"></div>

            <div className="flex items-center gap-2">
              <Home className="h-5 w-5 text-[#2c3e50]" />
              <span className="text-lg font-semibold text-[#2c3e50]">Methos</span>
            </div>
          </div>

          <div className="text-sm text-[#7f8c8d]">
            Création de campagne marketing
          </div>
        </div>
      </header>

      {/* Contenu principal sans sidebar */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
