import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '@/types';
import { store } from '@/lib/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const category = searchParams.get('category');

  let transactions = store.getTransactions();

  if (type && type !== 'all') {
    transactions = transactions.filter((t) => t.type === type);
  }
  if (category && category !== 'all') {
    transactions = transactions.filter((t) => t.category === category);
  }

  return NextResponse.json(transactions);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const transaction: Transaction = {
      id: uuidv4(),
      date: body.date || now.split('T')[0],
      description: body.description,
      amount: body.amount,
      type: body.type,
      category: body.category,
      vendor: body.vendor,
      invoiceId: body.invoiceId,
      documentId: body.documentId,
      status: body.status || 'pending',
      notes: body.notes,
      createdAt: now,
      updatedAt: now,
    };

    store.addTransaction(transaction);
    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
