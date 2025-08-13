'use client';

import { useEffect, useState } from 'react';

// Hook localStorage sécurisé pour Next.js avec gestion de l'hydratation
export function useLocalStorage<T>(key: string, initialValue: T) {
  // État pour savoir si on est côté client
  const [isClient, setIsClient] = useState(false);
  
  // État pour la valeur stockée
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Retourner la valeur initiale pendant le SSR
    return initialValue;
  });

  // Effet pour détecter le côté client et charger la valeur
  useEffect(() => {
    setIsClient(true);
    
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Erreur lors de la lecture de localStorage pour la clé "${key}":`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  // Fonction pour mettre à jour la valeur
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permettre à la valeur d'être une fonction pour la même API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Sauvegarder dans l'état
      setStoredValue(valueToStore);
      
      // Sauvegarder dans localStorage seulement côté client
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Erreur lors de l'écriture dans localStorage pour la clé "${key}":`, error);
    }
  };

  // Fonction pour supprimer la valeur
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (isClient) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Erreur lors de la suppression de localStorage pour la clé "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue, isClient] as const;
}