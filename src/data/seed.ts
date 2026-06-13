import { Transaction, Invoice, Document, Category, DashboardMetrics, CashFlowPoint } from '@/types';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Revenue', type: 'income', color: '#10b981' },
  { id: 'cat-2', name: 'Consulting', type: 'income', color: '#06b6d4' },
  { id: 'cat-3', name: 'Product Sales', type: 'income', color: '#8b5cf6' },
  { id: 'cat-4', name: 'Rent & Utilities', type: 'expense', color: '#ef4444' },
  { id: 'cat-5', name: 'Software & Tools', type: 'expense', color: '#f59e0b' },
  { id: 'cat-6', name: 'Payroll', type: 'expense', color: '#ec4899' },
  { id: 'cat-7', name: 'Marketing', type: 'expense', color: '#6366f1' },
  { id: 'cat-8', name: 'Office Supplies', type: 'expense', color: '#84cc16' },
  { id: 'cat-9', name: 'Travel', type: 'expense', color: '#14b8a6' },
  { id: 'cat-10', name: 'Professional Services', type: 'expense', color: '#f97316' },
  { id: 'cat-11', name: 'Insurance', type: 'expense', color: '#a855f7' },
  { id: 'cat-12', name: 'Equipment', type: 'expense', color: '#64748b' },
];

export const transactions: Transaction[] = [
  {
    id: 'txn-1', date: '2024-06-01', description: 'Client Payment - Acme Corp',
    amount: 15000, type: 'income', category: 'Revenue', status: 'confirmed',
    vendor: 'Acme Corp', createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-06-01T10:00:00Z',
  },
  {
    id: 'txn-2', date: '2024-06-03', description: 'AWS Monthly',
    amount: 2340, type: 'expense', category: 'Software & Tools', status: 'confirmed',
    vendor: 'Amazon Web Services', createdAt: '2024-06-03T10:00:00Z', updatedAt: '2024-06-03T10:00:00Z',
  },
  {
    id: 'txn-3', date: '2024-06-05', description: 'Office Lease - June',
    amount: 4500, type: 'expense', category: 'Rent & Utilities', status: 'confirmed',
    vendor: 'WeWork', createdAt: '2024-06-05T10:00:00Z', updatedAt: '2024-06-05T10:00:00Z',
  },
  {
    id: 'txn-4', date: '2024-06-07', description: 'Consulting - TechStart Inc',
    amount: 8500, type: 'income', category: 'Consulting', status: 'confirmed',
    vendor: 'TechStart Inc', createdAt: '2024-06-07T10:00:00Z', updatedAt: '2024-06-07T10:00:00Z',
  },
  {
    id: 'txn-5', date: '2024-06-10', description: 'Google Workspace',
    amount: 432, type: 'expense', category: 'Software & Tools', status: 'confirmed',
    vendor: 'Google', createdAt: '2024-06-10T10:00:00Z', updatedAt: '2024-06-10T10:00:00Z',
  },
  {
    id: 'txn-6', date: '2024-06-12', description: 'Payroll - June First Half',
    amount: 45000, type: 'expense', category: 'Payroll', status: 'confirmed',
    vendor: 'Gusto', createdAt: '2024-06-12T10:00:00Z', updatedAt: '2024-06-12T10:00:00Z',
  },
  {
    id: 'txn-7', date: '2024-06-14', description: 'Product Sale - Enterprise License',
    amount: 25000, type: 'income', category: 'Product Sales', status: 'confirmed',
    vendor: 'BigCo Ltd', createdAt: '2024-06-14T10:00:00Z', updatedAt: '2024-06-14T10:00:00Z',
  },
  {
    id: 'txn-8', date: '2024-06-15', description: 'Facebook Ads Campaign',
    amount: 3200, type: 'expense', category: 'Marketing', status: 'confirmed',
    vendor: 'Meta', createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-06-15T10:00:00Z',
  },
  {
    id: 'txn-9', date: '2024-06-18', description: 'Client Payment - Global Dynamics',
    amount: 12000, type: 'income', category: 'Revenue', status: 'pending',
    vendor: 'Global Dynamics', createdAt: '2024-06-18T10:00:00Z', updatedAt: '2024-06-18T10:00:00Z',
  },
  {
    id: 'txn-10', date: '2024-06-20', description: 'Business Insurance - Q2',
    amount: 1800, type: 'expense', category: 'Insurance', status: 'confirmed',
    vendor: 'State Farm', createdAt: '2024-06-20T10:00:00Z', updatedAt: '2024-06-20T10:00:00Z',
  },
  {
    id: 'txn-11', date: '2024-06-22', description: 'Flight to NYC - Client Meeting',
    amount: 680, type: 'expense', category: 'Travel', status: 'confirmed',
    vendor: 'Delta Airlines', createdAt: '2024-06-22T10:00:00Z', updatedAt: '2024-06-22T10:00:00Z',
  },
  {
    id: 'txn-12', date: '2024-06-25', description: 'Legal Consultation',
    amount: 2500, type: 'expense', category: 'Professional Services', status: 'confirmed',
    vendor: 'Smith & Associates', createdAt: '2024-06-25T10:00:00Z', updatedAt: '2024-06-25T10:00:00Z',
  },
];

export const invoices: Invoice[] = [
  {
    id: 'inv-1', invoiceNumber: 'INV-2024-001', vendor: 'Acme Corp',
    vendorEmail: 'billing@acmecorp.com', issueDate: '2024-05-15', dueDate: '2024-06-15',
    amount: 15000, tax: 0, totalAmount: 15000, status: 'paid',
    lineItems: [
      { id: 'li-1', description: 'Web Development Services - May', quantity: 1, unitPrice: 15000, amount: 15000, category: 'Revenue' },
    ],
    createdAt: '2024-05-15T10:00:00Z', updatedAt: '2024-06-01T10:00:00Z',
  },
  {
    id: 'inv-2', invoiceNumber: 'INV-2024-002', vendor: 'TechStart Inc',
    vendorEmail: 'ap@techstart.io', issueDate: '2024-06-01', dueDate: '2024-07-01',
    amount: 8500, tax: 0, totalAmount: 8500, status: 'paid',
    lineItems: [
      { id: 'li-2', description: 'Architecture Consulting - 20hrs', quantity: 20, unitPrice: 425, amount: 8500, category: 'Consulting' },
    ],
    createdAt: '2024-06-01T10:00:00Z', updatedAt: '2024-06-07T10:00:00Z',
  },
  {
    id: 'inv-3', invoiceNumber: 'INV-2024-003', vendor: 'BigCo Ltd',
    vendorEmail: 'finance@bigco.com', issueDate: '2024-06-10', dueDate: '2024-07-10',
    amount: 25000, tax: 2500, totalAmount: 27500, status: 'pending',
    lineItems: [
      { id: 'li-3', description: 'Enterprise License - Annual', quantity: 1, unitPrice: 25000, amount: 25000, category: 'Product Sales' },
    ],
    createdAt: '2024-06-10T10:00:00Z', updatedAt: '2024-06-10T10:00:00Z',
  },
  {
    id: 'inv-4', invoiceNumber: 'INV-2024-004', vendor: 'Global Dynamics',
    vendorEmail: 'billing@globaldyn.com', issueDate: '2024-06-15', dueDate: '2024-07-15',
    amount: 12000, tax: 0, totalAmount: 12000, status: 'sent',
    lineItems: [
      { id: 'li-4', description: 'Platform Integration Project', quantity: 1, unitPrice: 12000, amount: 12000, category: 'Revenue' },
    ],
    createdAt: '2024-06-15T10:00:00Z', updatedAt: '2024-06-15T10:00:00Z',
  },
  {
    id: 'inv-5', invoiceNumber: 'INV-2024-005', vendor: 'StartupXYZ',
    vendorEmail: 'cfo@startupxyz.io', issueDate: '2024-05-01', dueDate: '2024-05-31',
    amount: 6000, tax: 600, totalAmount: 6600, status: 'overdue',
    lineItems: [
      { id: 'li-5', description: 'UX Audit & Recommendations', quantity: 1, unitPrice: 6000, amount: 6000, category: 'Consulting' },
    ],
    createdAt: '2024-05-01T10:00:00Z', updatedAt: '2024-05-01T10:00:00Z',
  },
];

export const documents: Document[] = [
  {
    id: 'doc-1', filename: 'acme-invoice-may.pdf', originalName: 'Acme_Invoice_May_2024.pdf',
    mimeType: 'application/pdf', size: 245000, type: 'invoice', source: 'upload',
    extractedText: 'Invoice #INV-2024-001\nAcme Corp\nWeb Development Services - May\n$15,000.00',
    processingStatus: 'completed', uploadedAt: '2024-05-20T10:00:00Z', processedAt: '2024-05-20T10:01:00Z',
    extractedData: {
      vendor: 'Acme Corp', invoiceNumber: 'INV-2024-001', date: '2024-05-15',
      dueDate: '2024-06-15', amount: 15000, totalAmount: 15000, confidence: 0.95,
    },
  },
  {
    id: 'doc-2', filename: 'aws-receipt-jun.pdf', originalName: 'AWS_Receipt_June_2024.pdf',
    mimeType: 'application/pdf', size: 128000, type: 'receipt', source: 'email',
    extractedText: 'Amazon Web Services\nMonthly Charges: $2,340.00\nDate: June 3, 2024',
    processingStatus: 'completed', uploadedAt: '2024-06-04T08:00:00Z', processedAt: '2024-06-04T08:01:00Z',
    extractedData: {
      vendor: 'Amazon Web Services', date: '2024-06-03', amount: 2340, totalAmount: 2340,
      category: 'Software & Tools', confidence: 0.92,
    },
  },
  {
    id: 'doc-3', filename: 'office-receipt.jpg', originalName: 'IMG_20240610_receipt.jpg',
    mimeType: 'image/jpeg', size: 3200000, type: 'receipt', source: 'scan',
    processingStatus: 'completed', uploadedAt: '2024-06-10T15:00:00Z', processedAt: '2024-06-10T15:02:00Z',
    extractedData: {
      vendor: 'Staples', date: '2024-06-10', amount: 156.78, totalAmount: 156.78,
      category: 'Office Supplies', confidence: 0.87,
    },
  },
];

export function getDashboardMetrics(): DashboardMetrics {
  const totalRevenue = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingInvoices = invoices.filter((i) => ['pending', 'sent'].includes(i.status)).length;
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue').length;

  const expensesByCategory = categories
    .filter((c) => c.type === 'expense')
    .map((cat) => {
      const amount = transactions
        .filter((t) => t.type === 'expense' && t.category === cat.name)
        .reduce((sum, t) => sum + t.amount, 0);
      return { category: cat.name, amount, percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0, color: cat.color };
    })
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const cashFlow: CashFlowPoint[] = [
    { date: 'Jan', income: 42000, expenses: 38000, net: 4000 },
    { date: 'Feb', income: 38000, expenses: 35000, net: 3000 },
    { date: 'Mar', income: 55000, expenses: 42000, net: 13000 },
    { date: 'Apr', income: 48000, expenses: 40000, net: 8000 },
    { date: 'May', income: 52000, expenses: 44000, net: 8000 },
    { date: 'Jun', income: totalRevenue, expenses: totalExpenses, net: totalRevenue - totalExpenses },
  ];

  const monthlyComparison = cashFlow.map((cf) => ({
    month: cf.date,
    revenue: cf.income,
    expenses: cf.expenses,
    profit: cf.net,
  }));

  return {
    totalRevenue,
    totalExpenses,
    netIncome: totalRevenue - totalExpenses,
    pendingInvoices,
    overdueInvoices,
    cashFlow,
    expensesByCategory,
    recentTransactions: transactions.slice(0, 5),
    monthlyComparison,
  };
}
