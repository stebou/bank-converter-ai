import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route pour récupérer les KPIs bancaires en temps réel
 * GET /api/banking/kpis - Calculer et retourner les métriques financières
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Récupérer les comptes bancaires
    const accounts = await prisma.bankAccount.findMany({
      where: { 
        userId: user.id,
        isActive: true 
      },
    });

    if (accounts.length === 0) {
      return NextResponse.json({
        success: true,
        kpis: {
          totalBalance: 0,
          monthlyRevenue: 0,
          monthlyExpenses: 0,
          transactionCount: 0,
          accountsCount: 0,
          revenueChange: 0,
          expensesChange: 0,
          balanceChange: 0,
          transactionsChange: 0,
          cashFlow: 0,
          averageTransactionAmount: 0,
          topCategories: [],
        },
        message: 'Aucun compte bancaire connecté',
      });
    }

    // Calculer le solde total
    const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

    // Récupérer les transactions des 60 derniers jours pour calculer les tendances
    const twoMonthsAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const now = new Date();

    const allTransactions = await prisma.bankTransaction.findMany({
      where: {
        userId: user.id,
        transactionDate: {
          gte: twoMonthsAgo,
        },
      },
      orderBy: {
        transactionDate: 'desc',
      },
    });

    // Séparer les transactions par période
    const currentMonthTransactions = allTransactions.filter(
      tx => tx.transactionDate >= oneMonthAgo && tx.transactionDate <= now
    );
    
    const previousMonthTransactions = allTransactions.filter(
      tx => tx.transactionDate >= twoMonthsAgo && tx.transactionDate < oneMonthAgo
    );

    // Calculer les revenus et dépenses du mois actuel
    const monthlyRevenue = currentMonthTransactions
      .filter(tx => tx.type === 'credit')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const monthlyExpenses = currentMonthTransactions
      .filter(tx => tx.type === 'debit')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    // Calculer les revenus et dépenses du mois précédent
    const previousMonthRevenue = previousMonthTransactions
      .filter(tx => tx.type === 'credit')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const previousMonthExpenses = previousMonthTransactions
      .filter(tx => tx.type === 'debit')
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    // Calculer les changements en pourcentage
    const revenueChange = previousMonthRevenue > 0 
      ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
      : monthlyRevenue > 0 ? 100 : 0;

    const expensesChange = previousMonthExpenses > 0
      ? ((monthlyExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
      : monthlyExpenses > 0 ? 100 : 0;

    const transactionsChange = previousMonthTransactions.length > 0
      ? ((currentMonthTransactions.length - previousMonthTransactions.length) / previousMonthTransactions.length) * 100
      : currentMonthTransactions.length > 0 ? 100 : 0;

    // Calculer le cash flow
    const cashFlow = monthlyRevenue - monthlyExpenses;

    // Calculer la variation de solde (simulée)
    const balanceChange = totalBalance > 0 ? (cashFlow / totalBalance) * 100 : 0;

    // Calculer le montant moyen des transactions
    const averageTransactionAmount = currentMonthTransactions.length > 0
      ? currentMonthTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0) / currentMonthTransactions.length
      : 0;

    // Analyser les catégories les plus importantes
    const categoryStats = currentMonthTransactions.reduce((stats, tx) => {
      const category = tx.category || 'Autre';
      if (!stats[category]) {
        stats[category] = { amount: 0, count: 0 };
      }
      stats[category].amount += Math.abs(tx.amount);
      stats[category].count += 1;
      return stats;
    }, {} as Record<string, { amount: number; count: number }>);

    const topCategories = Object.entries(categoryStats)
      .sort(([, a], [, b]) => b.amount - a.amount)
      .slice(0, 5)
      .map(([category, stats]) => ({
        name: category,
        amount: stats.amount,
        transactionCount: stats.count,
        percentage: (stats.amount / (monthlyRevenue + monthlyExpenses)) * 100,
      }));

    const kpis = {
      totalBalance,
      monthlyRevenue,
      monthlyExpenses,
      transactionCount: currentMonthTransactions.length,
      accountsCount: accounts.length,
      revenueChange: Number(revenueChange.toFixed(1)),
      expensesChange: Number(expensesChange.toFixed(1)),
      balanceChange: Number(balanceChange.toFixed(1)),
      transactionsChange: Number(transactionsChange.toFixed(1)),
      cashFlow,
      averageTransactionAmount,
      topCategories,
      lastUpdateAt: new Date().toISOString(),
    };

    console.log('[BANKING_KPIS] 📊 KPIs calculés:', {
      totalBalance: kpis.totalBalance,
      monthlyRevenue: kpis.monthlyRevenue,
      monthlyExpenses: kpis.monthlyExpenses,
      cashFlow: kpis.cashFlow,
    });

    return NextResponse.json({
      success: true,
      kpis,
      accountsCount: accounts.length,
      transactionPeriods: {
        current: currentMonthTransactions.length,
        previous: previousMonthTransactions.length,
      },
    });

  } catch (error) {
    console.error('[BANKING_KPIS] ❌ Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors du calcul des KPIs bancaires' },
      { status: 500 }
    );
  }
}