import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { Document } from '@/types';
import { store } from '@/lib/store';
import { processDocument, inferDocumentType } from '@/lib/document-processor';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const docId = uuidv4();
    const filename = `${docId}-${file.name}`;

    // Create document record
    const doc: Document = {
      id: docId,
      filename,
      originalName: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      type: 'other',
      source: 'upload',
      processingStatus: 'processing',
      uploadedAt: new Date().toISOString(),
    };

    // Save initial record
    store.addDocument(doc);

    // Process document (OCR / PDF parse / AI extraction)
    try {
      const { text, extractedData } = await processDocument(buffer, doc.mimeType, file.name);
      const docType = inferDocumentType(doc.mimeType, file.name, text);

      store.updateDocument(docId, {
        type: docType,
        extractedText: text,
        extractedData,
        processingStatus: 'completed',
        processedAt: new Date().toISOString(),
      });

      return NextResponse.json({
        ...doc,
        type: docType,
        extractedText: text,
        extractedData,
        processingStatus: 'completed',
        processedAt: new Date().toISOString(),
      });
    } catch (processingError: any) {
      store.updateDocument(docId, {
        processingStatus: 'failed',
        processingError: processingError.message,
      });

      return NextResponse.json({
        ...doc,
        processingStatus: 'failed',
        processingError: processingError.message,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(store.getDocuments());
}
