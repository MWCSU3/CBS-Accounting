export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'pending' | 'confirmed' | 'reconciled';
export type InvoiceStatus = 'draft' | 'sent' | 'pending' | 'paid' | 'overdue' | 'cancelled';
export type DocumentType = 'invoice' | 'receipt' | 'bank_statement' | 'email' | 'photo' | 'other';
export type DocumentSource = 'upload' | 'email' | 'scan' | 'api';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  vendor?: string;
  invoiceId?: string;
  documentId?: string;
  status: TransactionStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  vendorEmail?: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  tax?: number;
  totalAmount: number;
  status: InvoiceStatus;
  lineItems: LineItem[];
  documentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  category?: string;
}

export interface Document {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  type: DocumentType;
  source: DocumentSource;
  extractedText?: string;
  extractedData?: ExtractedData;
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
  processingError?: string;
  uploadedAt: string;
  processedAt?: string;
}

export interface ExtractedData {
  vendor?: string;
  vendorEmail?: string;
  invoiceNumber?: string;
  date?: string;
  dueDate?: string;
  amount?: number;
  tax?: number;
  totalAmount?: number;
  lineItems?: LineItem[];
  category?: string;
  confidence: number;
  rawText?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon?: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  pendingInvoices: number;
  overdueInvoices: number;
  cashFlow: CashFlowPoint[];
  expensesByCategory: CategoryBreakdown[];
  recentTransactions: Transaction[];
  monthlyComparison: MonthlyData[];
}

export interface CashFlowPoint {
  date: string;
  income: number;
  expenses: number;
  net: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  type?: TransactionType;
  category?: string;
  vendor?: string;
}

export interface ProfitAndLoss {
  period: string;
  revenue: { category: string; amount: number }[];
  expenses: { category: string; amount: number }[];
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  taxEstimate: number;
}
