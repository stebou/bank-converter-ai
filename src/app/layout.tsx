import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers'; // Importe ton nouveau composant
import './globals.css';

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
        {/* Enveloppe tes enfants avec le nouveau Provider */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
