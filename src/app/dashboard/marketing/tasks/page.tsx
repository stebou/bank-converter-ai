'use client';

import { useUser } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Download,
    Filter,
    HelpCircle,
    MoreHorizontal,
    Plus,
    Search,
    Upload,
    X
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

// Types
type TaskStatus = 'Open' | 'In Progress' | 'Blocked' | 'Review' | 'Resolved' | 'Closed';
type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
type TaskSource = 'Manual' | 'API' | 'Import' | 'Integration' | 'Automation';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  assigneeName: string;
  projectId: string;
  projectName: string;
  dueDate: string;
  progress: number;
  sla: {
    targetAt: string;
    breach: boolean;
    remainingSec: number;
  };
  labels: string[];
  source: TaskSource;
  lastActivityAt: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface SavedView {
  id: string;
  name: string;
  filters: FilterState;
  isPublic: boolean;
  createdBy: string;
}

interface FilterState {
  status: TaskStatus[];
  priority: TaskPriority[];
  assignee: string[];
  project: string[];
  dueDate: {
    start?: string;
    end?: string;
  };
  labels: string[];
  sla: 'all' | 'compliant' | 'at_risk' | 'breached';
  source: TaskSource[];
}

interface KPIData {
  open: number;
  overdue: number;
  inProgress: number;
  resolvedThisWeek: number;
  slaCompliance: number;
  medianTimeToResolve: number;
}

// Mock data
const mockTasks: Task[] = [
  {
    id: 'TSK-1248',
    title: 'Vérifier l\'import banque',
    status: 'In Progress',
    priority: 'High',
    assigneeId: 'u_42',
    assigneeName: 'Marie Dupont',
    projectId: 'p_finops',
    projectName: 'FinOps',
    dueDate: '2025-08-14',
    progress: 60,
    sla: {
      targetAt: '2025-08-15T12:00:00Z',
      breach: false,
      remainingSec: 86400
    },
    labels: ['banking', 'automation'],
    source: 'API',
    lastActivityAt: '2025-08-10T20:15:00Z',
    description: 'Vérifier que tous les imports bancaires fonctionnent correctement après la mise à jour.',
    createdAt: '2025-08-08T09:00:00Z',
    updatedAt: '2025-08-10T20:15:00Z'
  },
  {
    id: 'TSK-1249',
    title: 'Optimiser les campagnes LinkedIn',
    status: 'Open',
    priority: 'Medium',
    assigneeId: 'u_43',
    assigneeName: 'Jean Martin',
    projectId: 'p_marketing',
    projectName: 'Marketing',
    dueDate: '2025-08-16',
    progress: 0,
    sla: {
      targetAt: '2025-08-16T17:00:00Z',
      breach: false,
      remainingSec: 172800
    },
    labels: ['marketing', 'linkedin'],
    source: 'Manual',
    lastActivityAt: '2025-08-10T14:30:00Z',
    description: 'Analyser les performances des campagnes LinkedIn et proposer des optimisations.',
    createdAt: '2025-08-10T09:00:00Z',
    updatedAt: '2025-08-10T14:30:00Z'
  },
  {
    id: 'TSK-1250',
    title: 'Corriger bug dashboard analytics',
    status: 'Review',
    priority: 'Critical',
    assigneeId: 'u_44',
    assigneeName: 'Sophie Bernard',
    projectId: 'p_tech',
    projectName: 'Tech',
    dueDate: '2025-08-11',
    progress: 90,
    sla: {
      targetAt: '2025-08-11T18:00:00Z',
      breach: true,
      remainingSec: -3600
    },
    labels: ['bug', 'dashboard', 'urgent'],
    source: 'Integration',
    lastActivityAt: '2025-08-10T16:45:00Z',
    description: 'Le dashboard analytics ne charge plus les données depuis hier soir.',
    createdAt: '2025-08-09T15:00:00Z',
    updatedAt: '2025-08-10T16:45:00Z'
  }
];

const mockKPIs: KPIData = {
  open: 847,
  overdue: 23,
  inProgress: 156,
  resolvedThisWeek: 89,
  slaCompliance: 94.2,
  medianTimeToResolve: 2.4
};

function TasksSkeleton() {
  return (
    <div className="space-y-6 p-8">
      <div className="h-8 w-64 rounded bg-[#bdc3c7]"></div>
      <div className="h-12 w-full rounded bg-[#bdc3c7]"></div>
      <div className="h-32 w-full rounded bg-[#bdc3c7]"></div>
      <div className="h-96 w-full rounded bg-[#bdc3c7]"></div>
    </div>
  );
}

export default function TasksPage() {
  const { user, isLoaded } = useUser();
  
  // États
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(mockTasks);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showKPIs, setShowKPIs] = useState(true);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [activeView, setActiveView] = useState<string | null>(null);
  
  // Filtres
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priority: [],
    assignee: [],
    project: [],
    dueDate: {},
    labels: [],
    sla: 'all',
    source: []
  });

  // Options de tri et groupement
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({
    field: 'lastActivityAt',
    direction: 'desc'
  });
  const [groupBy, setGroupBy] = useState<string>('');

  if (!isLoaded) {
    return <TasksSkeleton />;
  }

  if (!user) {
    redirect('/sign-in');
    return null;
  }

  // Fonctions utilitaires
  const formatTimeRemaining = (seconds: number): string => {
    if (seconds < 0) return `En retard de ${Math.abs(Math.floor(seconds / 3600))}h`;
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}j restants`;
    return `${hours}h restantes`;
  };

  const getStatusColor = (status: TaskStatus): string => {
    const colors = {
      'Open': 'bg-[#95a5a6] text-white',
      'In Progress': 'bg-[#3498db] text-white',
      'Blocked': 'bg-[#e74c3c] text-white',
      'Review': 'bg-[#f39c12] text-white',
      'Resolved': 'bg-[#2ecc71] text-white',
      'Closed': 'bg-[#34495e] text-white'
    };
    return colors[status] || 'bg-[#95a5a6] text-white';
  };

  const getPriorityColor = (priority: TaskPriority): string => {
    const colors = {
      'Low': 'text-[#27ae60]',
      'Medium': 'text-[#f39c12]',
      'High': 'text-[#e67e22]',
      'Critical': 'text-[#e74c3c]'
    };
    return colors[priority] || 'text-[#95a5a6]';
  };

  // Gestion des actions
  const handleTaskSelect = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setShowDetailsPanel(true);
    }
  };

  const handleBulkStatusChange = (newStatus: TaskStatus) => {
    setTasks(prev => 
      prev.map(task => 
        selectedTasks.includes(task.id) 
          ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
          : task
      )
    );
    setSelectedTasks([]);
  };

  const createNewTask = () => {
    // Logique pour créer une nouvelle tâche
    console.log('Créer une nouvelle tâche');
  };

  // Effets
  useEffect(() => {
    // Appliquer les filtres et la recherche
    let filtered = [...tasks];

    // Recherche textuelle
    if (searchQuery.trim()) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtres
    if (filters.status.length > 0) {
      filtered = filtered.filter(task => filters.status.includes(task.status));
    }
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task => filters.priority.includes(task.priority));
    }

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filters]);

  return (
    <div className="min-h-screen bg-[#ecf0f1]">
      <Suspense fallback={<TasksSkeleton />}>
        <div className="flex flex-col h-screen">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-[#bdc3c7] p-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-[#2c3e50] font-montserrat">
                  Tâches · {filteredTasks.length.toLocaleString()}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                {/* Recherche globale */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#7f8c8d]" />
                  <input
                    type="text"
                    placeholder="Rechercher dans les tâches..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-[#bdc3c7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db] w-80"
                  />
                </div>

                {/* Actions rapides */}
                <motion.button
                  onClick={createNewTask}
                  className="flex items-center gap-2 px-4 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="h-4 w-4" />
                  Créer une tâche
                </motion.button>

                <button className="flex items-center gap-2 px-4 py-2 border border-[#bdc3c7] rounded-lg hover:bg-[#ecf0f1] transition-colors">
                  <Upload className="h-4 w-4" />
                  Importer
                </button>

                <button className="flex items-center gap-2 px-4 py-2 border border-[#bdc3c7] rounded-lg hover:bg-[#ecf0f1] transition-colors">
                  <Download className="h-4 w-4" />
                  Exporter
                </button>

                <button className="p-2 border border-[#bdc3c7] rounded-lg hover:bg-[#ecf0f1] transition-colors">
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Filtres et vues */}
          <div className="bg-white border-b border-[#bdc3c7] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    showFilters ? 'bg-[#3498db] text-white' : 'border border-[#bdc3c7] hover:bg-[#ecf0f1]'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  Filtres
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value)}
                  className="px-3 py-2 border border-[#bdc3c7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                >
                  <option value="">Aucun groupement</option>
                  <option value="status">Grouper par statut</option>
                  <option value="priority">Grouper par priorité</option>
                  <option value="assignee">Grouper par assigné</option>
                  <option value="project">Grouper par projet</option>
                </select>

                <select
                  value={`${sortBy.field}-${sortBy.direction}`}
                  onChange={(e) => {
                    const [field, direction] = e.target.value.split('-');
                    setSortBy({ field, direction: direction as 'asc' | 'desc' });
                  }}
                  className="px-3 py-2 border border-[#bdc3c7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                >
                  <option value="lastActivityAt-desc">Dernière activité ↓</option>
                  <option value="lastActivityAt-asc">Dernière activité ↑</option>
                  <option value="dueDate-asc">Échéance ↑</option>
                  <option value="dueDate-desc">Échéance ↓</option>
                  <option value="priority-desc">Priorité ↓</option>
                  <option value="title-asc">Titre A→Z</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-[#7f8c8d]">Vues sauvegardées:</span>
                <button className="px-3 py-1 text-sm bg-[#e8f4fd] text-[#3498db] rounded-lg hover:bg-[#d4e6f1]">
                  Moi · En retard
                </button>
                <button className="px-3 py-1 text-sm border border-[#bdc3c7] rounded-lg hover:bg-[#ecf0f1]">
                  Équipe · Cette semaine
                </button>
                <button className="p-1 text-[#7f8c8d] hover:text-[#2c3e50]">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Panneau de filtres */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
                >
                  {/* Filtres par statut */}
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">Statut</label>
                    <select className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg text-sm">
                      <option>Tous les statuts</option>
                      <option>Ouvert</option>
                      <option>En cours</option>
                      <option>Bloqué</option>
                      <option>En révision</option>
                      <option>Résolu</option>
                    </select>
                  </div>

                  {/* Filtres par priorité */}
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">Priorité</label>
                    <select className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg text-sm">
                      <option>Toutes priorités</option>
                      <option>Critique</option>
                      <option>Haute</option>
                      <option>Moyenne</option>
                      <option>Basse</option>
                    </select>
                  </div>

                  {/* Filtres par assigné */}
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">Assigné</label>
                    <select className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg text-sm">
                      <option>Tous assignés</option>
                      <option>Moi</option>
                      <option>Marie Dupont</option>
                      <option>Jean Martin</option>
                      <option>Sophie Bernard</option>
                    </select>
                  </div>

                  {/* Filtres par projet */}
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">Projet</label>
                    <select className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg text-sm">
                      <option>Tous projets</option>
                      <option>FinOps</option>
                      <option>Marketing</option>
                      <option>Tech</option>
                    </select>
                  </div>

                  {/* Filtres par échéance */}
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">Échéance</label>
                    <select className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg text-sm">
                      <option>Toutes échéances</option>
                      <option>En retard</option>
                      <option>Aujourd'hui</option>
                      <option>Cette semaine</option>
                      <option>Ce mois</option>
                    </select>
                  </div>

                  {/* Filtres par SLA */}
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">SLA</label>
                    <select className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg text-sm">
                      <option>Tous SLA</option>
                      <option>Respecté</option>
                      <option>À risque</option>
                      <option>Dépassé</option>
                    </select>
                  </div>

                  {/* Filtres par source */}
                  <div>
                    <label className="block text-sm font-medium text-[#2c3e50] mb-2">Source</label>
                    <select className="w-full px-3 py-2 border border-[#bdc3c7] rounded-lg text-sm">
                      <option>Toutes sources</option>
                      <option>Manuel</option>
                      <option>API</option>
                      <option>Import</option>
                      <option>Intégration</option>
                    </select>
                  </div>

                  {/* Actions filtres */}
                  <div className="flex items-end gap-2">
                    <button className="px-3 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] text-sm">
                      Appliquer
                    </button>
                    <button className="px-3 py-2 border border-[#bdc3c7] rounded-lg hover:bg-[#ecf0f1] text-sm">
                      Reset
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* KPIs */}
          <AnimatePresence>
            {showKPIs && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white border-b border-[#bdc3c7] p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#2c3e50]">Indicateurs clés</h3>
                  <button
                    onClick={() => setShowKPIs(false)}
                    className="p-1 text-[#7f8c8d] hover:text-[#2c3e50]"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-[#e8f4fd] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-[#3498db]">{mockKPIs.open}</div>
                    <div className="text-sm text-[#7f8c8d]">Ouvertes</div>
                  </div>

                  <div className="bg-[#fdf2e8] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-[#e67e22]">{mockKPIs.overdue}</div>
                    <div className="text-sm text-[#7f8c8d]">En retard</div>
                  </div>

                  <div className="bg-[#e8f6f3] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-[#27ae60]">{mockKPIs.inProgress}</div>
                    <div className="text-sm text-[#7f8c8d]">En cours</div>
                  </div>

                  <div className="bg-[#f0f8ff] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-[#2980b9]">{mockKPIs.resolvedThisWeek}</div>
                    <div className="text-sm text-[#7f8c8d]">Résolues cette semaine</div>
                  </div>

                  <div className="bg-[#f8f9fa] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-[#27ae60]">{mockKPIs.slaCompliance}%</div>
                    <div className="text-sm text-[#7f8c8d]">Respect SLA</div>
                  </div>

                  <div className="bg-[#faf7f0] p-4 rounded-lg">
                    <div className="text-2xl font-bold text-[#f39c12]">{mockKPIs.medianTimeToResolve}j</div>
                    <div className="text-sm text-[#7f8c8d]">Temps médian résolution</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showKPIs && (
            <div className="bg-white border-b border-[#bdc3c7] p-2">
              <button
                onClick={() => setShowKPIs(true)}
                className="text-sm text-[#3498db] hover:text-[#2980b9] flex items-center gap-1"
              >
                <ChevronDown className="h-4 w-4" />
                Afficher les indicateurs
              </button>
            </div>
          )}

          {/* Contenu principal */}
          <div className="flex-1 flex overflow-hidden">
            {/* Table des tâches */}
            <div className={`flex-1 overflow-auto ${showDetailsPanel ? 'mr-96' : ''} transition-all duration-300`}>
              <div className="bg-white">
                {filteredTasks.length === 0 ? (
                  /* État vide */
                  <div className="text-center py-16">
                    <div className="mx-auto w-24 h-24 bg-[#ecf0f1] rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="h-12 w-12 text-[#95a5a6]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#2c3e50] mb-2">
                      {searchQuery || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== 'all' && f !== '')
                        ? 'Aucun résultat trouvé'
                        : 'Aucune tâche'
                      }
                    </h3>
                    <p className="text-[#7f8c8d] mb-6 max-w-md mx-auto">
                      {searchQuery || Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f !== 'all' && f !== '')
                        ? 'Essayez d\'ajuster vos critères de recherche ou de supprimer certains filtres.'
                        : 'Commencez par créer votre première tâche ou importez des tâches existantes.'
                      }
                    </p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={createNewTask}
                        className="flex items-center gap-2 px-6 py-3 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                        Créer une tâche
                      </button>
                      <button className="flex items-center gap-2 px-6 py-3 border border-[#bdc3c7] rounded-lg hover:bg-[#ecf0f1] transition-colors">
                        <Upload className="h-5 w-5" />
                        Importer des tâches
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Table des tâches */
                  <div className="overflow-x-auto">
                    <table role="grid" className="w-full">
                      <thead className="bg-[#f8f9fa] border-b border-[#bdc3c7]">
                        <tr>
                          <th className="px-4 py-3 text-left">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedTasks(filteredTasks.map(t => t.id));
                                } else {
                                  setSelectedTasks([]);
                                }
                              }}
                              checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                            />
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">ID</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Titre</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Statut</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Priorité</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Assigné</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Projet</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Échéance</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Progression</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">SLA</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Source</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-[#2c3e50]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasks.map((task, index) => (
                          <tr
                            key={task.id}
                            className={`border-b border-[#ecf0f1] hover:bg-[#f8f9fa] cursor-pointer transition-colors ${
                              selectedTask?.id === task.id ? 'bg-[#e8f4fd]' : ''
                            }`}
                            onClick={() => handleTaskSelect(task.id)}
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedTasks.includes(task.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (e.target.checked) {
                                    setSelectedTasks([...selectedTasks, task.id]);
                                  } else {
                                    setSelectedTasks(selectedTasks.filter(id => id !== task.id));
                                  }
                                }}
                              />
                            </td>
                            <td className="px-4 py-3 text-sm font-mono text-[#7f8c8d]">{task.id}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-[#2c3e50]">{task.title}</span>
                                {task.labels.map(label => (
                                  <span
                                    key={label}
                                    className="px-2 py-1 text-xs bg-[#ecf0f1] text-[#7f8c8d] rounded-full"
                                  >
                                    {label}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                                {task.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className={`flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                                {task.priority === 'Critical' && <AlertCircle className="h-4 w-4" />}
                                {task.priority === 'High' && <ChevronUp className="h-4 w-4" />}
                                <span className="text-sm font-medium">{task.priority}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-[#3498db] rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-white">
                                    {task.assigneeName.charAt(0)}
                                  </span>
                                </div>
                                <span className="text-sm text-[#2c3e50]">{task.assigneeName}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#7f8c8d]">{task.projectName}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 text-sm text-[#7f8c8d]">
                                <Calendar className="h-4 w-4" />
                                {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="w-full bg-[#ecf0f1] rounded-full h-2">
                                <div
                                  className="bg-[#3498db] h-2 rounded-full"
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-[#7f8c8d] mt-1">{task.progress}%</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs ${task.sla.breach ? 'text-[#e74c3c]' : 'text-[#27ae60]'}`}>
                                {formatTimeRemaining(task.sla.remainingSec)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-[#7f8c8d]">{task.source}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Actions menu
                                }}
                                className="p-1 hover:bg-[#ecf0f1] rounded"
                              >
                                <MoreHorizontal className="h-4 w-4 text-[#7f8c8d]" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Panneau de détail */}
            <AnimatePresence>
              {showDetailsPanel && selectedTask && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="w-96 bg-white border-l border-[#bdc3c7] overflow-y-auto"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-lg font-semibold text-[#2c3e50]">Détails de la tâche</h2>
                      <button
                        onClick={() => setShowDetailsPanel(false)}
                        className="p-1 hover:bg-[#ecf0f1] rounded"
                      >
                        <X className="h-5 w-5 text-[#7f8c8d]" />
                      </button>
                    </div>

                    {/* Propriétés */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-[#2c3e50] mb-2">{selectedTask.title}</h3>
                        <p className="text-sm text-[#7f8c8d] mb-4">{selectedTask.id}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">Description</label>
                        <p className="text-sm text-[#7f8c8d]">{selectedTask.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#2c3e50] mb-2">Statut</label>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedTask.status)}`}>
                            {selectedTask.status}
                          </span>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-[#2c3e50] mb-2">Priorité</label>
                          <span className={`text-sm font-medium ${getPriorityColor(selectedTask.priority)}`}>
                            {selectedTask.priority}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">Assigné à</label>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-[#3498db] rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {selectedTask.assigneeName.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm text-[#2c3e50]">{selectedTask.assigneeName}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">Progression</label>
                        <div className="w-full bg-[#ecf0f1] rounded-full h-3 mb-2">
                          <div
                            className="bg-[#3498db] h-3 rounded-full"
                            style={{ width: `${selectedTask.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-[#7f8c8d]">{selectedTask.progress}% complété</span>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">Échéance</label>
                        <div className="flex items-center gap-2 text-sm text-[#7f8c8d]">
                          <Calendar className="h-4 w-4" />
                          {new Date(selectedTask.dueDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">SLA</label>
                        <span className={`text-sm ${selectedTask.sla.breach ? 'text-[#e74c3c]' : 'text-[#27ae60]'}`}>
                          {formatTimeRemaining(selectedTask.sla.remainingSec)}
                        </span>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">Étiquettes</label>
                        <div className="flex flex-wrap gap-2">
                          {selectedTask.labels.map(label => (
                            <span
                              key={label}
                              className="px-2 py-1 text-xs bg-[#ecf0f1] text-[#7f8c8d] rounded-full"
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#2c3e50] mb-2">Activité récente</label>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-[#3498db] rounded-full mt-2"></div>
                            <div>
                              <p className="text-sm text-[#2c3e50]">Tâche mise à jour</p>
                              <p className="text-xs text-[#7f8c8d]">
                                {new Date(selectedTask.lastActivityAt).toLocaleString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-[#2ecc71] rounded-full mt-2"></div>
                            <div>
                              <p className="text-sm text-[#2c3e50]">Tâche créée</p>
                              <p className="text-xs text-[#7f8c8d]">
                                {new Date(selectedTask.createdAt).toLocaleString('fr-FR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Barre d'actions bulk */}
          <AnimatePresence>
            {selectedTasks.length > 0 && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="bg-[#2c3e50] text-white p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm">
                    {selectedTasks.length} tâche{selectedTasks.length > 1 ? 's' : ''} sélectionnée{selectedTasks.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => handleBulkStatusChange(e.target.value as TaskStatus)}
                    className="px-3 py-1 bg-[#34495e] text-white rounded text-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>Changer le statut</option>
                    <option value="Open">Ouvert</option>
                    <option value="In Progress">En cours</option>
                    <option value="Blocked">Bloqué</option>
                    <option value="Review">En révision</option>
                    <option value="Resolved">Résolu</option>
                    <option value="Closed">Fermé</option>
                  </select>

                  <button className="px-3 py-1 bg-[#34495e] hover:bg-[#4a5d70] rounded text-sm transition-colors">
                    Assigner
                  </button>

                  <button className="px-3 py-1 bg-[#e74c3c] hover:bg-[#c0392b] rounded text-sm transition-colors">
                    Archiver
                  </button>

                  <button
                    onClick={() => setSelectedTasks([])}
                    className="p-1 hover:bg-[#34495e] rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Suspense>
    </div>
  );
}
