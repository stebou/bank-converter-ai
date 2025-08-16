'use client';

import { useCompanyListsStore } from '@/stores/company-lists';
import { CompanyList } from '@/types/company-lists';
import { useEffect } from 'react';

export default function EntreprisesDataNewPage() {
  const { lists, isLoading, fetchLists } = useCompanyListsStore();

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Nouvelles Données Entreprises</h1>
      
      <div className="grid gap-4">
        {lists.map((list: CompanyList) => (
          <div
            key={list.id}
            className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold">{list.name}</h3>
            <p className="text-gray-600">{list.description}</p>
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                {list.companyCount} entreprises
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
