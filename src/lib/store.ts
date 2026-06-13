import { Transaction, Invoice, Document } from '@/types';
import { transactions as seedTransactions, invoices as seedInvoices, documents as seedDocuments } from '@/data/seed';

// In-memory store (persisted via JSON files in production, in-memory for dev)
class DataStore {
  private transactions: Transaction[] = [...seedTransactions];
  private invoices: Invoice[] = [...seedInvoices];
  private documents: Document[] = [...seedDocuments];

  // Transactions
  getTransactions(): Transaction[] {
    return this.transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getTransaction(id: string): Transaction | undefined {
    return this.transactions.find((t) => t.id === id);
  }

  addTransaction(transaction: Transaction): Transaction {
    this.transactions.push(transaction);
    return transaction;
  }

  updateTransaction(id: string, updates: Partial<Transaction>): Transaction | undefined {
    const index = this.transactions.findIndex((t) => t.id === id);
    if (index === -1) return undefined;
    this.transactions[index] = { ...this.transactions[index], ...updates, updatedAt: new Date().toISOString() };
    return this.transactions[index];
  }

  deleteTransaction(id: string): boolean {
    const len = this.transactions.length;
    this.transactions = this.transactions.filter((t) => t.id !== id);
    return this.transactions.length < len;
  }

  // Invoices
  getInvoices(): Invoice[] {
    return this.invoices.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }

  getInvoice(id: string): Invoice | undefined {
    return this.invoices.find((i) => i.id === id);
  }

  addInvoice(invoice: Invoice): Invoice {
    this.invoices.push(invoice);
    return invoice;
  }

  updateInvoice(id: string, updates: Partial<Invoice>): Invoice | undefined {
    const index = this.invoices.findIndex((i) => i.id === id);
    if (index === -1) return undefined;
    this.invoices[index] = { ...this.invoices[index], ...updates, updatedAt: new Date().toISOString() };
    return this.invoices[index];
  }

  // Documents
  getDocuments(): Document[] {
    return this.documents.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  getDocument(id: string): Document | undefined {
    return this.documents.find((d) => d.id === id);
  }

  addDocument(document: Document): Document {
    this.documents.push(document);
    return document;
  }

  updateDocument(id: string, updates: Partial<Document>): Document | undefined {
    const index = this.documents.findIndex((d) => d.id === id);
    if (index === -1) return undefined;
    this.documents[index] = { ...this.documents[index], ...updates };
    return this.documents[index];
  }
}

// Singleton
const globalForStore = globalThis as unknown as { store: DataStore };
export const store = globalForStore.store || new DataStore();
if (process.env.NODE_ENV !== 'production') globalForStore.store = store;
