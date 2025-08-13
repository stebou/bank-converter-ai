'use client';

import { CATEGORIES_JURIDIQUES, CODES_NAF_PRINCIPAUX, SearchCriteria, TRANCHES_EFFECTIFS } from '@/types/search-criteria';
import { Building, Calendar, ChevronDown, ChevronUp, Filter, MapPin, Search, Users } from 'lucide-react';
import { useState } from 'react';

interface AdvancedSearchProps {
  onSearch: (criteria: SearchCriteria) => void;
  isSearching?: boolean;
}

export function AdvancedSearch({ onSearch, isSearching = false }: AdvancedSearchProps) {
  const [criteria, setCriteria] = useState<SearchCriteria>({});
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    location: false,
    activity: false,
    economics: false,
    dates: false,
    status: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(criteria);
  };

  const handleReset = () => {
    setCriteria({});
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateCriteria = (field: keyof SearchCriteria, value: any) => {
    setCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const Section = ({ 
    title, 
    icon: Icon, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    icon: React.ComponentType<any>; 
    sectionKey: keyof typeof expandedSections; 
    children: React.ReactNode 
  }) => (
    <div className="border border-gray-200 rounded-lg mb-4">
      <button
        type="button"
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-[#3498db]" />
          <span className="font-medium text-[#2c3e50]">{title}</span>
        </div>
        {expandedSections[sectionKey] ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {expandedSections[sectionKey] && (
        <div className="p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Barre de recherche rapide */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Recherche rapide par nom d'entreprise..."
            value={criteria.denomination || ''}
            onChange={(e) => updateCriteria('denomination', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="px-6 py-2 bg-[#3498db] text-white rounded-lg hover:bg-[#2980b9] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSearching ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Recherche...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Rechercher
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Réinitialiser
        </button>
      </div>

      {/* Filtres avancés */}
      <div className="space-y-4">
        {/* Informations générales */}
        <Section title="Informations générales" icon={Building} sectionKey="general">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro SIREN
              </label>
              <input
                type="text"
                placeholder="Ex: 123456789"
                value={criteria.siren || ''}
                onChange={(e) => updateCriteria('siren', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                maxLength={9}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro SIRET
              </label>
              <input
                type="text"
                placeholder="Ex: 12345678901234"
                value={criteria.siret || ''}
                onChange={(e) => updateCriteria('siret', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                maxLength={14}
              />
            </div>
          </div>
        </Section>

        {/* Localisation */}
        <Section title="Localisation" icon={MapPin} sectionKey="location">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code postal
              </label>
              <input
                type="text"
                placeholder="Ex: 75001"
                value={criteria.codePostal || ''}
                onChange={(e) => updateCriteria('codePostal', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <input
                type="text"
                placeholder="Ex: Paris"
                value={criteria.ville || ''}
                onChange={(e) => updateCriteria('ville', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Département
              </label>
              <input
                type="text"
                placeholder="Ex: 75"
                value={criteria.departement || ''}
                onChange={(e) => updateCriteria('departement', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
              />
            </div>
          </div>
        </Section>

        {/* Activité */}
        <Section title="Activité" icon={Building} sectionKey="activity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code NAF / Activité principale
              </label>
              <select
                value={criteria.activitePrincipale || ''}
                onChange={(e) => updateCriteria('activitePrincipale', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
              >
                <option value="">Sélectionner une activité</option>
                {CODES_NAF_PRINCIPAUX.map(code => (
                  <option key={code.value} value={code.value}>
                    {code.value} - {code.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie juridique
              </label>
              <select
                value={criteria.categorieJuridique || ''}
                onChange={(e) => updateCriteria('categorieJuridique', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
              >
                <option value="">Sélectionner une catégorie</option>
                {CATEGORIES_JURIDIQUES.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.value} - {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* Caractéristiques économiques */}
        <Section title="Caractéristiques économiques" icon={Users} sectionKey="economics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tranche d'effectifs
              </label>
              <select
                value={criteria.trancheEffectifs || ''}
                onChange={(e) => updateCriteria('trancheEffectifs', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
              >
                <option value="">Tous les effectifs</option>
                {TRANCHES_EFFECTIFS.map(tranche => (
                  <option key={tranche.value} value={tranche.value}>
                    {tranche.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chiffre d'affaires (€)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={criteria.chiffreAffaires?.min || ''}
                  onChange={(e) => updateCriteria('chiffreAffaires', {
                    ...criteria.chiffreAffaires,
                    min: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                />
                <span className="self-center text-gray-500">à</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={criteria.chiffreAffaires?.max || ''}
                  onChange={(e) => updateCriteria('chiffreAffaires', {
                    ...criteria.chiffreAffaires,
                    max: e.target.value ? parseInt(e.target.value) : undefined
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Dates */}
        <Section title="Dates" icon={Calendar} sectionKey="dates">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de création
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={criteria.dateCreation?.debut || ''}
                  onChange={(e) => updateCriteria('dateCreation', {
                    ...criteria.dateCreation,
                    debut: e.target.value
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                />
                <span className="self-center text-gray-500">à</span>
                <input
                  type="date"
                  value={criteria.dateCreation?.fin || ''}
                  onChange={(e) => updateCriteria('dateCreation', {
                    ...criteria.dateCreation,
                    fin: e.target.value
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date dernier financement
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={criteria.dateDernierFinancement?.debut || ''}
                  onChange={(e) => updateCriteria('dateDernierFinancement', {
                    ...criteria.dateDernierFinancement,
                    debut: e.target.value
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                />
                <span className="self-center text-gray-500">à</span>
                <input
                  type="date"
                  value={criteria.dateDernierFinancement?.fin || ''}
                  onChange={(e) => updateCriteria('dateDernierFinancement', {
                    ...criteria.dateDernierFinancement,
                    fin: e.target.value
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* État administratif */}
        <Section title="État et statut" icon={Filter} sectionKey="status">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                État administratif
              </label>
              <select
                value={criteria.etatAdministratif || ''}
                onChange={(e) => updateCriteria('etatAdministratif', e.target.value as 'A' | 'F')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
              >
                <option value="">Tous les états</option>
                <option value="A">Actif</option>
                <option value="F">Fermé</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut de diffusion
              </label>
              <select
                value={criteria.statutDiffusion || ''}
                onChange={(e) => updateCriteria('statutDiffusion', e.target.value as 'O' | 'P' | 'N')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#3498db] focus:border-transparent"
              >
                <option value="">Tous les statuts</option>
                <option value="O">Diffusion autorisée</option>
                <option value="P">Diffusion partielle</option>
                <option value="N">Pas de diffusion</option>
              </select>
            </div>
          </div>
        </Section>
      </div>
    </form>
  );
}
