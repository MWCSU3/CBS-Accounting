'use client';

import { useEffect, useState } from 'react';
import { DashboardMetrics } from '@/types';
import { formatCurrency } from '@/lib/format';
import { CashFlowChart } from '@/components/charts/CashFlowChart';
import { ExpenseChart } from '@/components/charts/ExpenseChart';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { getDashboardMetrics } from '@/data/seed';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    // In production this would be an API call
    setMetrics(getDashboardMetrics());
  }, []);

  if (!metrics) return <DashboardSkeleton />;

  const kpis = [
    {
      label: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(metrics.totalExpenses),
      change: '+8.2%',
      changeType: 'negative' as const,
      icon: TrendingDown,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      label: 'Net Income',
      value: formatCurrency(metrics.netIncome),
      change: '+18.3%',
      changeType: 'positive' as const,
      icon: DollarSign,
      iconBg: 'bg-brand-100',
      iconColor: 'text-brand-600',
    },
    {
      label: 'Pending Invoices',
      value: metrics.pendingInvoices.toString(),
      change: `${metrics.overdueInvoices} overdue`,
      changeType: metrics.overdueInvoices > 0 ? 'negative' as const : 'neutral' as const,
      icon: metrics.overdueInvoices > 0 ? AlertTriangle : FileText,
      iconBg: metrics.overdueInvoices > 0 ? 'bg-amber-100' : 'bg-purple-100',
      iconColor: metrics.overdueInvoices > 0 ? 'text-amber-600' : 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Financial overview for your business</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card card-body">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.iconBg}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  kpi.changeType === 'positive'
                    ? 'text-green-600'
                    : kpi.changeType === 'negative'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {kpi.changeType === 'positive' && <ArrowUpRight className="w-3 h-3" />}
                {kpi.changeType === 'negative' && <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CashFlowChart data={metrics.cashFlow} />
        </div>
        <div>
          <ExpenseChart data={metrics.expensesByCategory} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Recent Transactions</h3>
          <a href="/transactions" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
            View all →
          </a>
        </div>
        <div className="divide-y divide-gray-100">
          {metrics.recentTransactions.map((txn) => (
            <div key={txn.id} className="px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    txn.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {txn.type === 'income' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{txn.description}</p>
                  <p className="text-xs text-gray-500">{txn.category} • {txn.date}</p>
                </div>
              </div>
              <span
                className={`text-sm font-semibold ${
                  txn.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded"></div>
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 h-80 bg-gray-200 rounded-xl"></div>
        <div className="h-80 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
}
