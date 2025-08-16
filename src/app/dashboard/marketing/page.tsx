'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Bot,
  Cake,
  ChevronDown,
  Diamond,
  Info,
  Laptop,
  Mail,
  Megaphone,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Types et interfaces
interface Campaign {
  id: string;
  name: string;
  status:
    | 'draft'
    | 'in_progress'
    | 'completed'
    | 'paused'
    | 'error'
    | 'archived';
  isActive: boolean;
  prospectsSent: number;
  prospectsTotal: number;
  sender: {
    name: string | null;
    avatar: string | null;
  };
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  createdAt: Date;
  icon: 'cake' | 'star' | 'laptop' | 'diamond' | 'envelope';
  variant: number;
}

interface FilterOption {
  value: string;
  label: string;
  count?: number;
  icon?: string;
}

// Composants
const TrialExpirationBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-center gap-3">
        <Info className="h-5 w-5 text-amber-600" />
        <div>
          <p className="text-sm text-amber-800">
            La période d'essai pour lemlist a expiré. Les campagnes ne peuvent
            pas être lancées en version d'essai gratuite, veuillez passer à un
            plan supérieur pour lancer vos campagnes.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/pricing"
          className="text-sm font-medium text-amber-700 underline hover:text-amber-800"
        >
          Mettre à niveau le plan
        </Link>
        <button
          onClick={() => setIsVisible(false)}
          className="text-amber-600 hover:text-amber-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const AIStatusMessage = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center gap-3">
        <Bot className="h-5 w-5 text-blue-600" />
        <div>
          <h4 className="text-sm font-medium text-blue-900">
            Vous n'avez pas terminé la création de votre campagne avec l'IA.
          </h4>
          <p className="text-sm text-blue-700">
            Nous avons mis en pause la création de votre campagne. Vous pouvez
            la reprendre en un clic.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-sm font-medium text-blue-700 underline hover:text-blue-800">
          Poursuivre ma campagne avec l'IA.
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="text-blue-600 hover:text-blue-700"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const FilterDropdown = ({
  label,
  options,
  value,
  onChange,
  searchable = false,
}: {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  searchable?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50"
      >
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{selectedOption?.label || 'Tout'}</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-gray-200 bg-white shadow-lg"
          >
            {searchable && (
              <div className="border-b border-gray-100 p-2">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full rounded border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="max-h-48 overflow-y-auto p-1">
              {filteredOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className="flex w-full items-center justify-between rounded px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    {option.icon && <span>{option.icon}</span>}
                    <span>{option.label}</span>
                  </div>
                  {option.count !== undefined && (
                    <span className="text-xs text-gray-400">
                      {option.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CampaignIcon = ({ type, variant }: { type: string; variant: number }) => {
  const icons = {
    cake: Cake,
    star: Star,
    laptop: Laptop,
    diamond: Diamond,
    envelope: Mail,
  };

  const Icon = icons[type as keyof typeof icons] || Mail;

  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-blue-600" />
      <span className="text-sm text-gray-400">({variant})</span>
    </div>
  );
};

const CampaignRow = ({ campaign }: { campaign: Campaign }) => {
  const router = useRouter();

  const getRelativeTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'few seconds ago';
    if (minutes < 60) return `il y a ${minutes} min`;
    if (hours < 24) return `il y a ${hours} h`;
    if (days < 7) return `il y a ${days} j`;
    if (days < 30) return `il y a ${Math.floor(days / 7)} sem`;
    if (days < 365) return `il y a ${Math.floor(days / 30)} mois`;
    return `il y a ${Math.floor(days / 365)} ans`;
  };

  return (
    <tr className="transition-colors hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex items-center">
          <button
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              campaign.isActive ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                campaign.isActive ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={() =>
            router.push(`/dashboard/marketing/campagnes/${campaign.id}`)
          }
          className="flex items-center gap-2 text-left transition-colors hover:text-blue-600"
        >
          <CampaignIcon type={campaign.icon} variant={campaign.variant} />
          <span className="font-medium">{campaign.name}</span>
        </button>
      </td>
      <td className="px-4 py-3 text-gray-600">
        {campaign.prospectsSent}/{campaign.prospectsTotal}
      </td>
      <td className="px-4 py-3 text-gray-600">{campaign.sender.name || '-'}</td>
      <td className="px-4 py-3">
        {campaign.tags.length > 0 ? (
          <div className="flex gap-1">
            {campaign.tags.map(tag => (
              <span
                key={tag.id}
                className="rounded-full px-2 py-1 text-xs"
                style={{
                  backgroundColor: tag.color + '20',
                  color: tag.color,
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {getRelativeTime(campaign.createdAt)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button className="p-1 text-gray-400 transition-colors hover:text-blue-600">
            <BarChart3 className="h-4 w-4" />
          </button>
          <button className="p-1 text-gray-400 transition-colors hover:text-gray-600">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default function CampaignsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [senderFilter, setSenderFilter] = useState('all');
  const [tagsFilter, setTagsFilter] = useState('all');
  const [creatorsFilter, setCreatorsFilter] = useState('all');

  // Mock data - À remplacer par des appels API
  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Campaign Marketing Q4',
      status: 'draft',
      isActive: false,
      prospectsSent: 0,
      prospectsTotal: 0,
      sender: { name: null, avatar: null },
      tags: [],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      icon: 'cake',
      variant: 5,
    },
  ];

  const statusOptions: FilterOption[] = [
    { value: 'all', label: 'Tout' },
    { value: 'draft', label: 'Brouillon', count: 5, icon: '📝' },
    { value: 'in_progress', label: 'En cours envoi', count: 0, icon: '⏳' },
    { value: 'completed', label: 'Termine', count: 0, icon: '✅' },
    { value: 'paused', label: 'En pause', count: 0, icon: '⏸' },
    { value: 'error', label: 'En erreur', count: 0, icon: '⚠' },
    { value: 'archived', label: 'Archives', count: 0, icon: '📁' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Campagnes</h1>

          {/* Trial Banner */}
          <TrialExpirationBanner />

          {/* AI Status Message */}
          <AIStatusMessage />
        </div>

        {/* Controls */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          {/* Filters Row */}
          <div className="mb-4 flex items-center gap-4">
            <FilterDropdown
              label="Statut:"
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
            />
            <FilterDropdown
              label="Expéditeur:"
              options={[{ value: 'all', label: 'Tout' }]}
              value={senderFilter}
              onChange={setSenderFilter}
              searchable
            />
            <FilterDropdown
              label="Tags:"
              options={[{ value: 'all', label: 'Tout' }]}
              value={tagsFilter}
              onChange={setTagsFilter}
              searchable
            />
            <FilterDropdown
              label="Créateurs:"
              options={[{ value: 'all', label: 'Tout' }]}
              value={creatorsFilter}
              onChange={setCreatorsFilter}
              searchable
            />
          </div>

          {/* Search Bar and Create Button */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une campagne..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Link
              href="/dashboard/marketing/creer-campagne"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Créer une nouvelle campagne
            </Link>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="w-16 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Nom de la campagne
                  </th>
                  <th className="w-40 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Prospects terminés
                  </th>
                  <th className="w-32 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Expéditeur
                  </th>
                  <th className="w-24 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tag
                  </th>
                  <th className="w-32 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Créé à
                  </th>
                  <th className="w-24 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Megaphone className="h-12 w-12 text-gray-300" />
                        <div>
                          <h3 className="mb-1 text-lg font-medium text-gray-900">
                            Aucune campagne créée
                          </h3>
                          <p className="text-gray-500">
                            Commencez par créer votre première campagne
                            marketing
                          </p>
                        </div>
                        <Link
                          href="/dashboard/marketing/creer-campagne"
                          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4" />
                          Créer une nouvelle campagne
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  campaigns.map(campaign => (
                    <CampaignRow key={campaign.id} campaign={campaign} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
