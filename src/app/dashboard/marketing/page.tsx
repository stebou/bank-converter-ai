'use client';

import { Suspense } from 'react';
import { Megaphone, Users, Target, TrendingUp, Eye, MousePointer, BarChart3, Star, Plus } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { redirect, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

function MarketingSkeleton() {
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

export default function MarketingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return <MarketingSkeleton />;
  }

  if (!user) {
    redirect('/sign-in');
    return null;
  }

  const firstName = user.firstName || user.fullName || 'Utilisateur';

    return (
      <div className="min-h-screen bg-[#ecf0f1]">
        <div className="p-8">
          <Suspense fallback={<MarketingSkeleton />}>
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-[#2c3e50] font-montserrat">
                    Marketing
                  </h1>
                  <p className="text-[#34495e] font-open-sans">
                    Analysez vos performances et optimisez vos campagnes marketing
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => router.push('/dashboard/marketing/creer-campagne')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2c3e50] text-white rounded-lg hover:bg-[#34495e] transition-all duration-200 text-sm font-medium shadow-md"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="h-4 w-4" />
                    Créer une campagne
                  </motion.button>
                  <Megaphone className="h-8 w-8 text-[#2c3e50]" />
                </div>
              </div>

              {/* KPIs Marketing */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#3498db] rounded-xl">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#34495e] font-open-sans">Impressions</p>
                      <p className="text-2xl font-bold text-[#2c3e50] font-montserrat">125,489</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#9b59b6] rounded-xl">
                      <MousePointer className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#34495e] font-open-sans">Clics</p>
                      <p className="text-2xl font-bold text-[#2c3e50] font-montserrat">3,847</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#e74c3c] rounded-xl">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#34495e] font-open-sans">Taux de conversion</p>
                      <p className="text-2xl font-bold text-[#2c3e50] font-montserrat">3.4%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#f39c12] rounded-xl">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#34495e] font-open-sans">ROAS</p>
                      <p className="text-2xl font-bold text-[#2c3e50] font-montserrat">4.2x</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sections principales */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Campagnes */}
                <div className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="h-6 w-6 text-[#2c3e50]" />
                    <h3 className="text-xl font-bold text-[#2c3e50] font-montserrat">Campagnes actives</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-[#bdc3c7]">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-[#2c3e50] font-montserrat">Campagne été 2025</p>
                        <span className="bg-[#27ae60] text-white px-2 py-1 rounded-full text-xs">Active</span>
                      </div>
                      <p className="text-sm text-[#34495e] font-open-sans">Budget: €2,500 • CTR: 3.2%</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#bdc3c7]">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-[#2c3e50] font-montserrat">Retargeting clients</p>
                        <span className="bg-[#f39c12] text-white px-2 py-1 rounded-full text-xs">En pause</span>
                      </div>
                      <p className="text-sm text-[#34495e] font-open-sans">Budget: €800 • CTR: 5.1%</p>
                    </div>
                    <button className="w-full p-3 bg-[#2c3e50] text-white rounded-xl hover:bg-[#34495e] transition-colors font-open-sans">
                      Gérer les campagnes
                    </button>
                  </div>
                </div>

                {/* Analytics */}
                <div className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="h-6 w-6 text-[#2c3e50]" />
                    <h3 className="text-xl font-bold text-[#2c3e50] font-montserrat">Analytics</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl border border-[#bdc3c7]">
                      <p className="font-semibold text-[#2c3e50] font-montserrat">Top canal d'acquisition</p>
                      <p className="text-sm text-[#34495e] font-open-sans">Google Ads • 42% du trafic</p>
                    </div>
                    <div className="p-4 bg-white rounded-xl border border-[#bdc3c7]">
                      <p className="font-semibold text-[#2c3e50] font-montserrat">Meilleure audience</p>
                      <p className="text-sm text-[#34495e] font-open-sans">25-35 ans • Taux conversion 4.8%</p>
                    </div>
                    <button className="w-full p-3 bg-[#2c3e50] text-white rounded-xl hover:bg-[#34495e] transition-colors font-open-sans">
                      Voir les rapports détaillés
                    </button>
                  </div>
                </div>
              </div>

              {/* Section clients */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="h-6 w-6 text-[#2c3e50]" />
                    <h3 className="text-lg font-bold text-[#2c3e50] font-montserrat">Nouveaux clients</h3>
                  </div>
                  <p className="text-3xl font-bold text-[#27ae60] font-montserrat">+127</p>
                  <p className="text-sm text-[#34495e] font-open-sans">Ce mois-ci</p>
                </div>

                <div className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="h-6 w-6 text-[#2c3e50]" />
                    <h3 className="text-lg font-bold text-[#2c3e50] font-montserrat">Satisfaction client</h3>
                  </div>
                  <p className="text-3xl font-bold text-[#f39c12] font-montserrat">4.6/5</p>
                  <p className="text-sm text-[#34495e] font-open-sans">Note moyenne</p>
                </div>

                <div className="bg-[#ecf0f1] rounded-2xl p-6 border border-[#bdc3c7] shadow-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-6 w-6 text-[#2c3e50]" />
                    <h3 className="text-lg font-bold text-[#2c3e50] font-montserrat">Croissance</h3>
                  </div>
                  <p className="text-3xl font-bold text-[#27ae60] font-montserrat">+23%</p>
                  <p className="text-sm text-[#34495e] font-open-sans">vs mois dernier</p>
                </div>
              </div>

              {/* Section "En construction" */}
              <div className="bg-[#ecf0f1] rounded-2xl p-8 border border-[#bdc3c7] shadow-xl text-center">
                <Megaphone className="h-16 w-16 text-[#2c3e50] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#2c3e50] mb-2 font-montserrat">
                  Module marketing en développement
                </h3>
                <p className="text-[#34495e] font-open-sans max-w-2xl mx-auto">
                  Notre équipe développe un module marketing avancé incluant l'analyse des performances, 
                  la gestion des campagnes publicitaires, le suivi des conversions et l'automatisation 
                  des emails. Cette fonctionnalité sera disponible prochainement.
                </p>
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    );
}
