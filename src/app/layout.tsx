// Fichier : src/app/layout.tsx

import CookieBanner from '@/components/CookieBanner'; // 1. Importer le composant
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bank Statement Converter IA',
  description:
    'Convertissez vos relevés bancaires PDF en données structurées avec 95%+ de précision',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          {children}
          {/* 2. Ajouter la bannière ici, à l'intérieur du Provider mais après les enfants */}
          <CookieBanner />
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
