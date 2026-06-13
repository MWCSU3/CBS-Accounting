'use client';

import { useState, useEffect } from 'react';
import { Invoice } from '@/types';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/format';
import { invoices as seedInvoices } from '@/data/seed';
import { FileText, Plus, Filter, Download, Mail, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    setInvoices(seedInvoices);
  }, []);

  const filtered = filter === 'all' ? invoices : invoices.filter((i) => i.status === filter);

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === 'paid').length,
    pending: invoices.filter((i) => ['pending', 'sent'].includes(i.status)).length,
    overdue: invoices.filter((i) => i.status === 'overdue').length,
    totalValue: invoices.reduce((sum, i) => sum + i.totalAmount, 0),
    paidValue: invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0),
    outstandingValue: invoices.filter((i) => ['pending', 'sent', 'overdue'].includes(i.status)).reduce((sum, i) => sum + i.totalAmount, 0),
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all your invoices</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="btn-primary">
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card card-body text-center">
          <div className="w-8 h-8 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Total Invoices</p>
        </div>
        <div className="card card-body text-center">
          <div className="w-8 h-8 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-xl font-bold text-green-600">{formatCurrency(stats.paidValue)}</p>
          <p className="text-xs text-gray-500">Paid ({stats.paid})</p>
        </div>
        <div className="card card-body text-center">
          <div className="w-8 h-8 mx-auto bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-yellow-600" />
          </div>
          <p className="text-xl font-bold text-yellow-600">{formatCurrency(stats.outstandingValue)}</p>
          <p className="text-xs text-gray-500">Outstanding ({stats.pending})</p>
        </div>
        <div className="card card-body text-center">
          <div className="w-8 h-8 mx-auto bg-red-100 rounded-lg flex items-center justify-center mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-xl font-bold text-red-600">{stats.overdue}</p>
          <p className="text-xs text-gray-500">Overdue</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'paid', 'pending', 'sent', 'overdue', 'draft'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-brand-100 text-brand-700'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Invoice Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Issue Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-brand-600">{invoice.invoiceNumber}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{invoice.vendor}</p>
                    {invoice.vendorEmail && (
                      <p className="text-xs text-gray-500">{invoice.vendorEmail}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(invoice.issueDate)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(invoice.dueDate)}</td>
                <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  {formatCurrency(invoice.totalAmount)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`badge ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-brand-600 transition-colors">
                    <Mail className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
