// Fichier : src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';
import CookieBanner from '@/components/CookieBanner'; // 1. Importer le composant

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bank Statement Converter IA',
  description: 'Convertissez vos relevés bancaires PDF en données structurées avec 95%+ de précision',
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
        </Providers>
      </body>
    </html>
  );
}
