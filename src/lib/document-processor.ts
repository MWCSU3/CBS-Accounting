import { Document, ExtractedData } from '@/types';
import { extractDataFromText } from './ai-extractor';

/**
 * Process uploaded documents:
 * - PDF: extract text via pdf-parse
 * - Images: OCR via Tesseract.js
 * - Email (.eml): parse text content
 * - Text/CSV: direct text extraction
 */
export async function processDocument(
  buffer: Buffer,
  mimeType: string,
  filename: string
): Promise<{ text: string; extractedData: ExtractedData }> {
  let text = '';

  if (mimeType === 'application/pdf') {
    text = await extractFromPDF(buffer);
  } else if (mimeType.startsWith('image/')) {
    text = await extractFromImage(buffer);
  } else if (mimeType === 'message/rfc822' || filename.endsWith('.eml')) {
    text = extractFromEmail(buffer.toString('utf-8'));
  } else if (mimeType.startsWith('text/') || mimeType === 'application/json') {
    text = buffer.toString('utf-8');
  } else {
    // Attempt text extraction as fallback
    text = buffer.toString('utf-8');
  }

  const extractedData = await extractDataFromText(text, filename);
  return { text, extractedData };
}

async function extractFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    return '';
  }
}

async function extractFromImage(buffer: Buffer): Promise<string> {
  try {
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker('eng');
    const { data: { text } } = await worker.recognize(buffer);
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('OCR extraction error:', error);
    return '';
  }
}

function extractFromEmail(content: string): string {
  // Simple .eml parser - extract body text
  const parts = content.split(/\r?\n\r?\n/);
  if (parts.length > 1) {
    // Skip headers, get body
    return parts.slice(1).join('\n\n');
  }
  return content;
}

export function inferDocumentType(mimeType: string, filename: string, text: string): Document['type'] {
  const lowerFile = filename.toLowerCase();
  const lowerText = text.toLowerCase();

  if (lowerFile.includes('invoice') || lowerText.includes('invoice')) return 'invoice';
  if (lowerFile.includes('receipt') || lowerText.includes('receipt')) return 'receipt';
  if (lowerFile.includes('statement') || lowerText.includes('bank statement')) return 'bank_statement';
  if (mimeType === 'message/rfc822' || lowerFile.endsWith('.eml')) return 'email';
  if (mimeType.startsWith('image/')) return 'photo';
  return 'other';
}
