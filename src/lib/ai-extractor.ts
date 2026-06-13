import { ExtractedData, LineItem } from '@/types';

/**
 * AI-powered data extraction from document text.
 * Uses OpenAI if OPENAI_API_KEY is set, otherwise falls back to rule-based extraction.
 */
export async function extractDataFromText(text: string, filename: string): Promise<ExtractedData> {
  // Try OpenAI extraction if key is available
  if (process.env.OPENAI_API_KEY) {
    try {
      return await extractWithOpenAI(text, filename);
    } catch (error) {
      console.error('OpenAI extraction failed, falling back to rule-based:', error);
    }
  }

  // Fallback: rule-based extraction
  return extractWithRules(text, filename);
}

async function extractWithOpenAI(text: string, filename: string): Promise<ExtractedData> {
  const { default: OpenAI } = await import('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an accounting document parser. Extract structured financial data from document text.
Return ONLY valid JSON with these fields:
{
  "vendor": "company/person name",
  "vendorEmail": "email if found",
  "invoiceNumber": "invoice/receipt number",
  "date": "YYYY-MM-DD format",
  "dueDate": "YYYY-MM-DD if applicable",
  "amount": numeric_subtotal,
  "tax": numeric_tax_amount,
  "totalAmount": numeric_total,
  "lineItems": [{"description": "...", "quantity": 1, "unitPrice": 0, "amount": 0}],
  "category": "best guess category from: Revenue, Consulting, Product Sales, Rent & Utilities, Software & Tools, Payroll, Marketing, Office Supplies, Travel, Professional Services, Insurance, Equipment",
  "confidence": 0.0_to_1.0
}
Only include fields you can confidently extract. Set confidence based on text clarity.`,
      },
      {
        role: 'user',
        content: `Filename: ${filename}\n\nDocument text:\n${text.slice(0, 4000)}`,
      },
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI');

  const parsed = JSON.parse(content);
  return {
    ...parsed,
    lineItems: parsed.lineItems?.map((li: any, i: number) => ({
      id: `li-extracted-${i}`,
      description: li.description || '',
      quantity: li.quantity || 1,
      unitPrice: li.unitPrice || li.amount || 0,
      amount: li.amount || 0,
    })),
    confidence: parsed.confidence || 0.7,
    rawText: text,
  };
}

function extractWithRules(text: string, filename: string): ExtractedData {
  const data: ExtractedData = { confidence: 0.5, rawText: text };

  // Extract amounts (look for dollar amounts)
  const amountMatches = text.match(/\$[\d,]+\.?\d{0,2}/g);
  if (amountMatches) {
    const amounts = amountMatches.map((a) => parseFloat(a.replace(/[$,]/g, ''))).sort((a, b) => b - a);
    data.totalAmount = amounts[0];
    data.amount = amounts.length > 1 ? amounts[1] : amounts[0];
    if (amounts.length > 2) data.tax = amounts[0] - amounts[1];
  }

  // Extract dates
  const datePatterns = [
    /(\d{4}-\d{2}-\d{2})/,
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4})/i,
  ];
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      const d = new Date(match[1]);
      if (!isNaN(d.getTime())) {
        data.date = d.toISOString().split('T')[0];
        break;
      }
    }
  }

  // Extract invoice number
  const invMatch = text.match(/(?:Invoice|Inv|INV|Receipt|#)\s*[:#]?\s*([A-Z0-9-]+)/i);
  if (invMatch) data.invoiceNumber = invMatch[1];

  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) data.vendorEmail = emailMatch[0];

  // Try to identify vendor (first line or prominent company name)
  const lines = text.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length > 0) {
    const firstMeaningful = lines.find((l) => l.trim().length > 2 && !l.match(/^(invoice|receipt|date|total)/i));
    if (firstMeaningful) data.vendor = firstMeaningful.trim().slice(0, 50);
  }

  // Category inference from keywords
  const lowerText = text.toLowerCase();
  if (lowerText.includes('aws') || lowerText.includes('cloud') || lowerText.includes('software') || lowerText.includes('saas')) {
    data.category = 'Software & Tools';
  } else if (lowerText.includes('rent') || lowerText.includes('lease') || lowerText.includes('utility')) {
    data.category = 'Rent & Utilities';
  } else if (lowerText.includes('travel') || lowerText.includes('flight') || lowerText.includes('hotel')) {
    data.category = 'Travel';
  } else if (lowerText.includes('office') || lowerText.includes('supplies') || lowerText.includes('staples')) {
    data.category = 'Office Supplies';
  } else if (lowerText.includes('insurance')) {
    data.category = 'Insurance';
  } else if (lowerText.includes('marketing') || lowerText.includes('ads') || lowerText.includes('advertising')) {
    data.category = 'Marketing';
  }

  data.confidence = data.totalAmount ? 0.6 : 0.3;
  return data;
}
