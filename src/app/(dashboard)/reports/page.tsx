'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/format';
import { transactions as seedTransactions, categories } from '@/data/seed';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Download, FileText, Calendar, TrendingUp, TrendingDown } from 'lucide-react';

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'pnl' | 'expenses' | 'tax'>('pnl');

  // Calculate P&L
  const income = seedTransactions.filter((t) => t.type === 'income');
  const expenses = seedTransactions.filter((t) => t.type === 'expense');
  const totalRevenue = income.reduce((s, t) => s + t.amount, 0);
  const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);
  const netIncome = totalRevenue - totalExpenses;
  const estimatedTax = Math.max(0, netIncome * 0.25); // Simplified 25% estimate

  // Expenses by category
  const expensesByCategory = categories
    .filter((c) => c.type === 'expense')
    .map((cat) => ({
      category: cat.name,
      amount: expenses.filter((t) => t.category === cat.name).reduce((s, t) => s + t.amount, 0),
      color: cat.color,
    }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  // Revenue by category
  const revenueByCategory = categories
    .filter((c) => c.type === 'income')
    .map((cat) => ({
      category: cat.name,
      amount: income.filter((t) => t.category === cat.name).reduce((s, t) => s + t.amount, 0),
      color: cat.color,
    }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const barChartData = expensesByCategory.map((cat) => ({
    name: cat.category,
    amount: cat.amount,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Financial summaries and tax preparation</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <Calendar className="w-4 h-4" />
            June 2024
          </button>
          <button className="btn-primary">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'pnl', label: 'Profit & Loss', icon: FileText },
          { id: 'expenses', label: 'Expense Breakdown', icon: TrendingDown },
          { id: 'tax', label: 'Tax Summary', icon: TrendingUp },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              reportType === tab.id
                ? 'bg-brand-100 text-brand-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* P&L Report */}
      {reportType === 'pnl' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Section */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                Revenue
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                {revenueByCategory.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{cat.category}</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(cat.amount)}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Total Revenue</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(totalRevenue)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses Section */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-500" />
                Expenses
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                {expensesByCategory.map((cat) => (
                  <div key={cat.category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{cat.category}</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(cat.amount)}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Total Expenses</span>
                  <span className="text-lg font-bold text-red-600">{formatCurrency(totalExpenses)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Income */}
          <div className="card lg:col-span-2">
            <div className="card-body">
              <div className="grid grid-cols-3 divide-x divide-gray-200 text-center">
                <div className="px-6">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="px-6">
                  <p className="text-sm text-gray-500">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="px-6">
                  <p className="text-sm text-gray-500">Net Income</p>
                  <p className={`text-2xl font-bold mt-1 ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(netIncome)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expense Breakdown */}
      {reportType === 'expenses' && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold text-gray-900">Expense Breakdown by Category</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barChartData} layout="vertical" margin={{ left: 120 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={120} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="amount" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tax Summary */}
      {reportType === 'tax' && (
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-gray-900">Tax Summary (Estimated)</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Gross Revenue</span>
                <span className="text-sm font-medium">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Total Deductible Expenses</span>
                <span className="text-sm font-medium text-red-600">-{formatCurrency(totalExpenses)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 pt-4">
                <span className="text-sm font-semibold text-gray-900">Taxable Income</span>
                <span className="text-sm font-bold">{formatCurrency(netIncome)}</span>
              </div>
              <div className="flex justify-between py-2 bg-amber-50 -mx-6 px-6 rounded-lg">
                <span className="text-sm font-semibold text-amber-800">Estimated Tax (25%)</span>
                <span className="text-sm font-bold text-amber-800">{formatCurrency(estimatedTax)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-gray-200 pt-4">
                <span className="text-sm font-semibold text-gray-900">After-Tax Income</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(netIncome - estimatedTax)}</span>
              </div>
            </div>
          </div>

          <div className="card card-body">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Tax Disclaimer</p>
                <p className="text-xs text-gray-500 mt-1">
                  This is an estimated tax calculation for planning purposes only. Actual tax obligations
                  depend on your jurisdiction, filing status, deductions, and other factors. Consult with a
                  qualified tax professional for accurate tax advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
