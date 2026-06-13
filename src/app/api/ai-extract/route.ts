import { NextRequest, NextResponse } from 'next/server';
import { extractDataFromText } from '@/lib/ai-extractor';

/**
 * Endpoint to re-run AI extraction on raw text.
 * Useful for retrying failed extractions or testing with pasted text.
 */
export async function POST(request: NextRequest) {
  try {
    const { text, filename } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }

    const extractedData = await extractDataFromText(text, filename || 'manual-input.txt');

    return NextResponse.json({
      success: true,
      extractedData,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Extraction failed' },
      { status: 500 }
    );
  }
}
