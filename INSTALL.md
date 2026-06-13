# CBS Accounting — One-Click Install Guide

## Option 1: Download Pre-Built Installer (Recommended)

If someone has already built the app, just double-click:

```
CBS-Accounting-Setup-1.0.0.exe
```

That's it. It will:
1. Install silently (no wizard, no prompts)
2. Create a desktop shortcut
3. Launch the app immediately

To uninstall: Settings → Apps → CBS Accounting → Uninstall

---

## Option 2: Build It Yourself

### Prerequisites
- Windows 10/11
- [Node.js 18+](https://nodejs.org/) (LTS recommended)
- Git (optional, for cloning)

### Steps

**Method A: One-click build (easiest)**

1. Clone or download this repo
2. Double-click `BUILD.bat`
3. Wait ~2 minutes
4. The installer opens automatically in File Explorer

**Method B: Command line**

```bash
git clone https://github.com/MWCSU3/CBS-Accounting.git
cd CBS-Accounting
npm install
npm run electron:build
```

### Output Files

After building, check `dist-electron/`:

| File | Description |
|------|-------------|
| `CBS-Accounting-Setup-1.0.0.exe` | One-click installer (installs + launches) |
| `CBS-Accounting-Portable-1.0.0.exe` | Portable version (no install needed, runs from anywhere) |

---

## Option 3: Portable Mode (No Install)

Use the portable `.exe` — just copy it to your desktop and double-click. No installation required. Data is still stored in `%APPDATA%/cbs-accounting/`.

---

## Where Is My Data?

All financial data is stored locally on your machine:

```
%APPDATA%/cbs-accounting/
├── data/
│   ├── transactions.json
│   ├── invoices.json
│   └── documents.json
└── uploads/
    └── (your uploaded PDFs, images, etc.)
```

Your data is NEVER sent to the cloud unless you enable the OpenAI integration for AI document scanning.

---

## AI Setup (Optional)

To enable AI-powered document extraction:

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Create a file called `.env` in the app folder with:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

Without the key, the app still works — it uses built-in rule-based extraction (handles most invoices/receipts).
