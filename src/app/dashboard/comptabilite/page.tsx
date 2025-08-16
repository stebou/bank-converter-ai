import { currentUser } from '@clerk/nextjs/server';
import {
  BarChart3,
  Calculator,
  DollarSign,
  FileText,
  PieChart,
  TrendingUp,
  Upload,
  FolderOpen,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import ComptabiliteClient from './ComptabiliteClient';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function ComptabiliteSkeleton() {
  return (
    <div className="space-y-8 p-8">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-2 h-8 w-64 rounded bg-[#bdc3c7]"></div>
          <div className="h-4 w-48 rounded bg-[#bdc3c7]"></div>
        </div>
        <div className="h-10 w-32 rounded bg-[#bdc3c7]"></div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-[#bdc3c7] bg-[#ecf0f1] p-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#bdc3c7]"></div>
              <div>
                <div className="mb-1 h-4 w-16 rounded bg-[#bdc3c7]"></div>
                <div className="h-6 w-20 rounded bg-[#bdc3c7]"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-[400px] rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-xl"
          >
            <div className="mb-6 h-6 w-32 rounded bg-[#bdc3c7]"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-16 rounded-xl bg-[#bdc3c7]"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ComptabilitePage() {
  try {
    const user = await currentUser();

    if (!user) {
      redirect('/sign-in');
    }

    const firstName = user.firstName || user.fullName || 'Utilisateur';

    return (
      <div className="min-h-screen bg-[#ecf0f1]">
        <div className="p-8">
          <Suspense fallback={<ComptabiliteSkeleton />}>
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-montserrat text-3xl font-bold text-[#2c3e50]">
                    Ma comptabilité
                  </h1>
                  <p className="font-open-sans text-[#34495e]">
                    Gérez vos finances et votre comptabilité d'entreprise
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Calculator className="h-8 w-8 text-[#2c3e50]" />
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#2c3e50] p-3">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-open-sans text-sm text-[#34495e]">
                        Chiffre d'affaires
                      </p>
                      <p className="font-montserrat text-2xl font-bold text-[#2c3e50]">
                        € 45,230
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#e74c3c] p-3">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-open-sans text-sm text-[#34495e]">
                        Charges
                      </p>
                      <p className="font-montserrat text-2xl font-bold text-[#2c3e50]">
                        € 28,150
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#27ae60] p-3">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-open-sans text-sm text-[#34495e]">
                        Résultat net
                      </p>
                      <p className="font-montserrat text-2xl font-bold text-[#27ae60]">
                        € 17,080
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#f39c12] p-3">
                      <PieChart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-open-sans text-sm text-[#34495e]">
                        Marge
                      </p>
                      <p className="font-montserrat text-2xl font-bold text-[#2c3e50]">
                        37.8%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sections principales */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Factures */}
                <div className="rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-xl">
                  <div className="mb-6 flex items-center gap-3">
                    <FileText className="h-6 w-6 text-[#2c3e50]" />
                    <h3 className="font-montserrat text-xl font-bold text-[#2c3e50]">
                      Facturation
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-xl border border-[#bdc3c7] bg-white p-4">
                      <p className="font-montserrat font-semibold text-[#2c3e50]">
                        Factures en attente
                      </p>
                      <p className="font-open-sans text-sm text-[#34495e]">
                        3 factures • € 8,450
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#bdc3c7] bg-white p-4">
                      <p className="font-montserrat font-semibold text-[#2c3e50]">
                        Factures payées
                      </p>
                      <p className="font-open-sans text-sm text-[#34495e]">
                        12 factures • € 36,780
                      </p>
                    </div>
                    <button className="font-open-sans w-full rounded-xl bg-[#2c3e50] p-3 text-white transition-colors hover:bg-[#34495e]">
                      Gérer les factures
                    </button>
                  </div>
                </div>

                {/* Déclarations */}
                <div className="rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-xl">
                  <div className="mb-6 flex items-center gap-3">
                    <Calculator className="h-6 w-6 text-[#2c3e50]" />
                    <h3 className="font-montserrat text-xl font-bold text-[#2c3e50]">
                      Déclarations
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-xl border border-[#bdc3c7] bg-white p-4">
                      <p className="font-montserrat font-semibold text-[#2c3e50]">
                        TVA à déclarer
                      </p>
                      <p className="font-open-sans text-sm text-[#34495e]">
                        Échéance : 20 août 2025
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#bdc3c7] bg-white p-4">
                      <p className="font-montserrat font-semibold text-[#2c3e50]">
                        Cotisations sociales
                      </p>
                      <p className="font-open-sans text-sm text-[#34495e]">
                        Échéance : 15 septembre 2025
                      </p>
                    </div>
                    <button className="font-open-sans w-full rounded-xl bg-[#2c3e50] p-3 text-white transition-colors hover:bg-[#34495e]">
                      Voir les déclarations
                    </button>
                  </div>
                </div>
              </div>

              {/* Section Documents comptables */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-6 w-6 text-[#2c3e50]" />
                  <h2 className="font-montserrat text-2xl font-bold text-[#2c3e50]">
                    Documents comptables
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                  {/* Zone d'upload */}
                  <div className="xl:col-span-1">
                    <ComptabiliteClient userName={firstName} />
                  </div>

                  {/* Liste des documents - gérée par le composant client */}
                  <div className="xl:col-span-2">
                    <div className="rounded-2xl border border-[#bdc3c7] bg-[#ecf0f1] p-6 shadow-xl">
                      <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-[#2c3e50]" />
                          <h3 className="font-montserrat text-xl font-bold text-[#2c3e50]">
                            Mes documents
                          </h3>
                        </div>
                        <div className="flex gap-2">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                            Factures
                          </span>
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                            Relevés
                          </span>
                          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
                            Autres
                          </span>
                        </div>
                      </div>
                      
                      {/* Liste des documents gérée par BankingDocumentsBox réutilisé */}
                      <div className="min-h-[200px]">
                        <ComptabiliteClient 
                          userName={firstName} 
                          showDocumentsList={true}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Comptabilite page error:', error);
    redirect('/sign-in');
  }
}
