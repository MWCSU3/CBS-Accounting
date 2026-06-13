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

## Getting Started (Desktop EXE)

### Build the Windows Installer on your Windows machine:

```bash
# Clone the repo
git clone https://github.com/MWCSU3/CBS-Accounting.git
cd CBS-Accounting

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Add your OpenAI API key to .env (optional but recommended)

# Build the Windows .exe installer
npm run electron:build
```

This produces `dist-electron/CBS-Accounting-Setup-1.0.0.exe` — a full installer that creates a desktop shortcut.

### Or run in dev mode (web browser):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Desktop App Commands

| Command | Description |
|---------|-------------|
| `npm run electron:dev` | Build & run locally in Electron (dev mode) |
| `npm run electron:build` | Build Windows `.exe` installer (NSIS) |
| `npm run electron:build-dir` | Build unpacked directory (faster, for testing) |

### Where Data is Stored

When running as a desktop app, all your data is stored locally:
- **Windows:** `%APPDATA%/cbs-accounting/data/`
- Files: `transactions.json`, `invoices.json`, `documents.json`
- Uploaded documents: `%APPDATA%/cbs-accounting/uploads/`

No cloud database required. Your financial data never leaves your machine (except AI extraction calls to OpenAI if you enable it).

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

## Architecture (Desktop App)

```
┌─────────────────────────────────────────────────┐
│  Electron Shell (main.js)                       │
│  ┌───────────────────────────────────────────┐  │
│  │  Next.js Standalone Server (localhost)     │  │
│  │  ┌─────────┐  ┌──────────────────────┐   │  │
│  │  │ React UI│  │ API Routes            │   │  │
│  │  │ (Pages) │  │ • /api/documents      │   │  │
│  │  │         │  │ • /api/transactions   │   │  │
│  │  │         │  │ • /api/invoices       │   │  │
│  │  │         │  │ • /api/ai-extract     │   │  │
│  │  └─────────┘  └──────────────────────┘   │  │
│  └───────────────────────────────────────────┘  │
│           │                    │                 │
│  ┌────────▼────────┐  ┌──────▼───────────┐     │
│  │ Local JSON Files │  │ OpenAI API (web) │     │
│  │ %APPDATA%/data/  │  │ GPT-4o-mini      │     │
│  └──────────────────┘  └──────────────────┘     │
└─────────────────────────────────────────────────┘
```

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
