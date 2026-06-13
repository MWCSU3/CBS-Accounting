import { Transaction, Invoice, Document } from '@/types';
import { transactions as seedTransactions, invoices as seedInvoices, documents as seedDocuments } from '@/data/seed';
import * as fs from 'fs';
import * as path from 'path';

// Local file-based persistence
// Data is stored in JSON files in the user's app data directory
const DATA_DIR = process.env.CBS_DATA_DIR || path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadJSON<T>(filename: string, fallback: T[]): T[] {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
  }
  return fallback;
}

function saveJSON<T>(filename: string, data: T[]): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error saving ${filename}:`, error);
  }
}

class DataStore {
  private transactions: Transaction[];
  private invoices: Invoice[];
  private documents: Document[];

  constructor() {
    // Load from local JSON files, fall back to seed data on first run
    this.transactions = loadJSON<Transaction>('transactions.json', seedTransactions);
    this.invoices = loadJSON<Invoice>('invoices.json', seedInvoices);
    this.documents = loadJSON<Document>('documents.json', seedDocuments);
  }

  private persistTransactions() {
    saveJSON('transactions.json', this.transactions);
  }

  private persistInvoices() {
    saveJSON('invoices.json', this.invoices);
  }

  private persistDocuments() {
    saveJSON('documents.json', this.documents);
  }

  // Transactions
  getTransactions(): Transaction[] {
    return [...this.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getTransaction(id: string): Transaction | undefined {
    return this.transactions.find((t) => t.id === id);
  }

  addTransaction(transaction: Transaction): Transaction {
    this.transactions.push(transaction);
    this.persistTransactions();
    return transaction;
  }

  updateTransaction(id: string, updates: Partial<Transaction>): Transaction | undefined {
    const index = this.transactions.findIndex((t) => t.id === id);
    if (index === -1) return undefined;
    this.transactions[index] = { ...this.transactions[index], ...updates, updatedAt: new Date().toISOString() };
    this.persistTransactions();
    return this.transactions[index];
  }

  deleteTransaction(id: string): boolean {
    const len = this.transactions.length;
    this.transactions = this.transactions.filter((t) => t.id !== id);
    if (this.transactions.length < len) {
      this.persistTransactions();
      return true;
    }
    return false;
  }

  // Invoices
  getInvoices(): Invoice[] {
    return [...this.invoices].sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
  }

  getInvoice(id: string): Invoice | undefined {
    return this.invoices.find((i) => i.id === id);
  }

  addInvoice(invoice: Invoice): Invoice {
    this.invoices.push(invoice);
    this.persistInvoices();
    return invoice;
  }

  updateInvoice(id: string, updates: Partial<Invoice>): Invoice | undefined {
    const index = this.invoices.findIndex((i) => i.id === id);
    if (index === -1) return undefined;
    this.invoices[index] = { ...this.invoices[index], ...updates, updatedAt: new Date().toISOString() };
    this.persistInvoices();
    return this.invoices[index];
  }

  // Documents
  getDocuments(): Document[] {
    return [...this.documents].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  getDocument(id: string): Document | undefined {
    return this.documents.find((d) => d.id === id);
  }

  addDocument(document: Document): Document {
    this.documents.push(document);
    this.persistDocuments();
    return document;
  }

  updateDocument(id: string, updates: Partial<Document>): Document | undefined {
    const index = this.documents.findIndex((d) => d.id === id);
    if (index === -1) return undefined;
    this.documents[index] = { ...this.documents[index], ...updates };
    this.persistDocuments();
    return this.documents[index];
  }
}

// Singleton
const globalForStore = globalThis as unknown as { store: DataStore };
export const store = globalForStore.store || new DataStore();
if (process.env.NODE_ENV !== 'production') globalForStore.store = store;
