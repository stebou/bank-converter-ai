// Inventory/Stock Management AI Agents Team - Nouvelle structure optimisée
// Équipe d'agents IA spécialisés dans la gestion des stocks et inventaires

// Export des nouveaux agents optimisés
export * from './agents';
export * from './tools';

// Types pour l'équipe inventory (à partir de la nouvelle structure)
export interface AgentConfig {
  name: string;
  model: string;
  instructions: string;
  tools: any[];
}
