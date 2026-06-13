# CBS Accounting — AI-Powered Small Business Dashboard

Full-stack accounting dashboard that uses AI to automatically extract financial data from uploaded documents (PDFs, photos, emails, invoices).

## Features

- **AI Document Processing** — Upload PDFs, images, emails, or photos. The AI extracts vendor, amounts, dates, line items, and auto-categorizes.
- **Invoice Management** — Track invoices (sent, pending, paid, overdue) with full line-item detail.
- **Transaction Tracking** — All income/expenses auto-categorized, searchable, filterable.
- **Financial Dashboard** — Revenue/expense KPIs, cash flow charts, expense breakdowns.
- **Reports** — P&L statements, expense breakdown, tax summary with export.
- **Multi-Source Ingestion** — Supports PDF, JPG/PNG (OCR), .eml email files, CSV, and text.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS, Lucide Icons
- **Charts:** Recharts
- **AI:** OpenAI GPT-4o-mini (optional, falls back to rule-based extraction)
- **OCR:** Tesseract.js
- **PDF:** pdf-parse
- **State:** Zustand (client), in-memory store (server)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# (Optional) Add your OpenAI API key to .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List transactions (filterable by type/category) |
| POST | `/api/transactions` | Create transaction |
| GET | `/api/invoices` | List invoices (filterable by status) |
| POST | `/api/invoices` | Create invoice |
| PATCH | `/api/invoices` | Update invoice status |
| POST | `/api/documents/upload` | Upload & process document |
| GET | `/api/documents/upload` | List all documents |
| POST | `/api/ai-extract` | Re-run AI extraction on text |
| GET | `/api/reports?type=pnl` | Generate P&L report |

## Document Processing Pipeline

1. **Upload** — File received via multipart form
2. **Text Extraction** — PDF → pdf-parse, Image → Tesseract OCR, Email → body parser
3. **AI Analysis** — OpenAI extracts structured data (vendor, amounts, dates, categories)
4. **Fallback** — If no API key, rule-based regex extraction runs
5. **Storage** — Document + extracted data saved, available for invoice/transaction creation

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/          # Dashboard layout group
│   │   ├── page.tsx          # Main dashboard
│   │   ├── invoices/         # Invoice management
│   │   ├── documents/        # Document upload & processing
│   │   ├── transactions/     # Transaction list
│   │   └── reports/          # Financial reports
│   ├── api/                  # API routes
│   │   ├── transactions/
│   │   ├── invoices/
│   │   ├── documents/upload/
│   │   ├── ai-extract/
│   │   └── reports/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                   # Sidebar, shared UI
│   └── charts/               # Recharts wrappers
├── lib/
│   ├── ai-extractor.ts       # OpenAI + rule-based extraction
│   ├── document-processor.ts # PDF/OCR/email pipeline
│   ├── store.ts              # In-memory data store
│   ├── cn.ts                 # Class name utility
│   └── format.ts             # Currency/date formatters
├── types/
│   └── index.ts              # All TypeScript interfaces
└── data/
    └── seed.ts               # Sample data for development
```

## License

Private — CBS Internal Use
