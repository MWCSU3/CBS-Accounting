import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Invoice } from '@/types';
import { store } from '@/lib/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let invoices = store.getInvoices();

  if (status && status !== 'all') {
    invoices = invoices.filter((i) => i.status === status);
  }

  return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();

    const invoice: Invoice = {
      id: uuidv4(),
      invoiceNumber: body.invoiceNumber || `INV-${Date.now()}`,
      vendor: body.vendor,
      vendorEmail: body.vendorEmail,
      issueDate: body.issueDate || now.split('T')[0],
      dueDate: body.dueDate,
      amount: body.amount,
      tax: body.tax || 0,
      totalAmount: body.totalAmount || body.amount + (body.tax || 0),
      status: body.status || 'draft',
      lineItems: body.lineItems || [],
      documentId: body.documentId,
      notes: body.notes,
      createdAt: now,
      updatedAt: now,
    };

    store.addInvoice(invoice);
    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Invoice ID required' }, { status: 400 });
    }

    const updated = store.updateInvoice(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
