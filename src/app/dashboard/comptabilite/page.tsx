import { currentUser } from '@clerk/nextjs/server';
import { BarChart3, Calculator, DollarSign, FileText, PieChart, TrendingUp } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

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
                  <h1 className="text-3xl font-bold text-[#2c3e50] font-montserrat">
                    Ma comptabilité
                  </h1>
                  <p className="text-[#34495e] font-open-sans">
                    Gérez vos finances et votre comptabilité d'entreprise
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Calculator className="h-8 w-8 text-[#2c3e50]" />
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#2c3e50] rounded-xl">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#34495e] font-open-sans">Chiffre d'affaires</p>
                      <p className="text-2xl font-bold text-[#2c3e50] font-montserrat">€ 45,230</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#e74c3c] rounded-xl">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#34495e] font-open-sans">Charges</p>
                      <p className="text-2xl font-bold text-[#2c3e50] font-montserrat">€ 28,150</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#27ae60] rounded-xl">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#34495e] font-open-sans">Résultat net</p>
                      <p className="text-2xl font-bold text-[#27ae60] font-montserrat">€ 17,080</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#f39c12] rounded-xl">
                      <PieChart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#34495e] font-open-sans">Marge</p>
                      <p className="text-2xl font-bold text-[#2c3e50] font-montserrat">37.8%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sections principales */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Factures */}
                <div className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="h-6 w-6 text-[#2c3e50]" />
                    <h3 className="text-xl font-bold text-[#2c3e50] font-montserrat">Facturation</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-[#bdc3c7]">
                      <p className="font-semibold text-[#2c3e50] font-montserrat">Factures en attente</p>
                      <p className="text-sm text-[#34495e] font-open-sans">3 factures • € 8,450</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#bdc3c7]">
                      <p className="font-semibold text-[#2c3e50] font-montserrat">Factures payées</p>
                      <p className="text-sm text-[#34495e] font-open-sans">12 factures • € 36,780</p>
                    </div>
                    <button className="w-full p-3 bg-[#2c3e50] text-white rounded-xl hover:bg-[#34495e] transition-colors font-open-sans">
                      Gérer les factures
                    </button>
                  </div>
                </div>

                {/* Déclarations */}
                <div className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Calculator className="h-6 w-6 text-[#2c3e50]" />
                    <h3 className="text-xl font-bold text-[#2c3e50] font-montserrat">Déclarations</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-[#bdc3c7]">
                      <p className="font-semibold text-[#2c3e50] font-montserrat">TVA à déclarer</p>
                      <p className="text-sm text-[#34495e] font-open-sans">Échéance : 20 août 2025</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#bdc3c7]">
                      <p className="font-semibold text-[#2c3e50] font-montserrat">Cotisations sociales</p>
                      <p className="text-sm text-[#34495e] font-open-sans">Échéance : 15 septembre 2025</p>
                    </div>
                    <button className="w-full p-3 bg-[#2c3e50] text-white rounded-xl hover:bg-[#34495e] transition-colors font-open-sans">
                      Voir les déclarations
                    </button>
                  </div>
                </div>
              </div>

              {/* Section "En construction" */}
              <div className="bg-[#ecf0f1] rounded-2xl p-8 border border-[#bdc3c7] shadow-xl text-center">
                <Calculator className="h-16 w-16 text-[#2c3e50] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#2c3e50] mb-2 font-montserrat">
                  Module comptabilité en développement
                </h3>
                <p className="text-[#34495e] font-open-sans max-w-2xl mx-auto">
                  Notre équipe travaille sur un module comptabilité complet incluant la gestion des factures, 
                  des déclarations fiscales, et l'intégration avec vos relevés bancaires. 
                  Cette fonctionnalité sera disponible prochainement.
                </p>
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
