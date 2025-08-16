'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import BankConnectionsManager from './BankConnectionsManager';

interface ManageConnectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageConnectionsModal({
  isOpen,
  onClose,
}: ManageConnectionsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 p-6">
                <h2 className="font-montserrat text-xl font-bold text-[#2c3e50]">
                  Gérer les connexions bancaires
                </h2>
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <BankConnectionsManager />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
