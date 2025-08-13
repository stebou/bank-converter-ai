'use client';

import { useEffect, useState } from 'react';

/**
 * Hook pour s'assurer qu'un composant n'est rendu que côté client.
 * Ceci résout les problèmes d'hydratation en utilisant un pattern à deux passes :
 * 1. Premier rendu (SSR + hydratation) : retourne false 
 * 2. Deuxième rendu (après useEffect) : retourne true
 * 
 * Basé sur les meilleures pratiques recommandées par :
 * - Josh W. Comeau: https://www.joshwcomeau.com/react/the-perils-of-rehydration/
 * - Next.js documentation: https://nextjs.org/docs/messages/react-hydration-error
 */
export function useClientOnly(): boolean {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
