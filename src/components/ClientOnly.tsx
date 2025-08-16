'use client';

import { useClientOnly } from '@/hooks/useClientOnly';
import { ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Composant wrapper pour s'assurer qu'un contenu n'est rendu que côté client.
 * Résout les problèmes d'hydratation en utilisant un pattern à deux passes.
 *
 * @param children - Le contenu à rendre seulement côté client
 * @param fallback - Contenu optionnel à afficher pendant la phase SSR/hydratation
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isClientReady = useClientOnly();

  if (!isClientReady) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
