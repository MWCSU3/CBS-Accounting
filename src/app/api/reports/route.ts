import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { ProfitAndLoss } from '@/types';
import { categories } from '@/data/seed';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'pnl';
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let transactions = store.getTransactions();

  // Date filtering
  if (startDate) {
    transactions = transactions.filter((t) => t.date >= startDate);
  }
  if (endDate) {
    transactions = transactions.filter((t) => t.date <= endDate);
  }

  if (type === 'pnl') {
    const income = transactions.filter((t) => t.type === 'income');
    const expenses = transactions.filter((t) => t.type === 'expense');
    const totalRevenue = income.reduce((s, t) => s + t.amount, 0);
    const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);
    const netIncome = totalRevenue - totalExpenses;

    const revenueByCategory = categories
      .filter((c) => c.type === 'income')
      .map((cat) => ({
        category: cat.name,
        amount: income.filter((t) => t.category === cat.name).reduce((s, t) => s + t.amount, 0),
      }))
      .filter((c) => c.amount > 0);

    const expensesByCategory = categories
      .filter((c) => c.type === 'expense')
      .map((cat) => ({
        category: cat.name,
        amount: expenses.filter((t) => t.category === cat.name).reduce((s, t) => s + t.amount, 0),
      }))
      .filter((c) => c.amount > 0);

    const pnl: ProfitAndLoss = {
      period: `${startDate || 'Start'} to ${endDate || 'Present'}`,
      revenue: revenueByCategory,
      expenses: expensesByCategory,
      totalRevenue,
      totalExpenses,
      netIncome,
      taxEstimate: Math.max(0, netIncome * 0.25),
    };

    return NextResponse.json(pnl);
  }

  // Default: return raw transactions for the period
  return NextResponse.json({ transactions, total: transactions.length });
}
