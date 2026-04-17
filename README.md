# Buffett AI Stock Analyzer

A full-stack AI-powered stock analysis tool built on Warren Buffett's investment framework. Enter any publicly traded ticker to instantly evaluate it against Buffett's 11 financial criteria, view complete financial statements, and chat with a RAG-powered AI advisor trained on Buffett's principles.

![Tech Stack](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![LangChain](https://img.shields.io/badge/LangChain-RAG-1C3C3C?style=flat)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.1-F55036?style=flat)

## Features

- **11 Buffett Ratios** — Gross Margin, SG&A, R&D, Depreciation, Interest Expense, Tax Rate, Net Profit Margin, EPS Growth, Cash vs Debt, Debt-to-Equity, CapEx Margin — each with PASS/FAIL verdict and Buffett's reasoning
- **Financial Statements** — Income Statement, Balance Sheet, and Cash Flow Statement with 4 years of history
- **Interactive Chart** — Bar chart with threshold reference lines showing where each ratio stands
- **RAG Chatbot** — Ask questions in natural language; answers are grounded in a Buffett knowledge base via FAISS vector search + Groq LLaMA 3.1 with real-time streaming

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 · TypeScript · Vite · Tailwind CSS · Recharts |
| Backend | FastAPI · Python 3.11 · Uvicorn |
| AI / RAG | LangChain · FAISS · sentence-transformers (all-MiniLM-L6-v2) · Groq API |
| Data | Financial Modeling Prep (FMP) API |
| Streaming | Server-Sent Events (SSE) |

## Project Structure

```
buffett-analyzer/
├── backend/
│   ├── app/
│   │   ├── api/routes/
│   │   │   ├── chat.py          # POST /api/chat  — SSE streaming
│   │   │   └── stock.py         # GET  /api/stock/{ticker}/ratios|financials
│   │   ├── data/
│   │   │   └── buffett_knowledge.txt   # RAG knowledge base
│   │   └── services/
│   │       ├── buffett.py       # 11 ratio computation engine
│   │       ├── financial.py     # FMP API client + data normalization
│   │       └── rag.py           # FAISS index + Groq streaming
│   ├── .env                     # API keys (not committed)
│   └── requirements.txt
└── frontend/
    └── src/
        ├── api/client.ts        # Axios + SSE fetch
        ├── components/
        │   ├── Dashboard/       # RatioTable · RatioChart · StatementTable
        │   └── Chatbot/         # Streaming ChatWindow
        └── context/StockContext.tsx
```

## Getting Started

### Prerequisites

- Python 3.11
- Node.js 18+
- [Groq API key](https://console.groq.com) (free)
- [FMP API key](https://financialmodelingprep.com/register) (free, 250 req/day)

### Backend

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:
```env
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.1-8b-instant
FMP_API_KEY=your_fmp_key
```

```bash
uvicorn app.main:app --reload
# API running at http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/stock/{ticker}/ratios` | 11 Buffett ratios with pass/fail |
| GET | `/api/stock/{ticker}/financials` | Raw income statement, balance sheet, cash flow |
| POST | `/api/chat` | SSE streaming chat (question + optional stock context) |

## Buffett's 11 Financial Rules

| # | Ratio | Rule | Statement |
|---|---|---|---|
| 1 | Gross Margin | ≥ 40% | Income |
| 2 | SG&A Margin | ≤ 30% | Income |
| 3 | R&D Margin | ≤ 30% | Income |
| 4 | Depreciation Margin | ≤ 10% | Income |
| 5 | Interest Expense Margin | ≤ 15% | Income |
| 6 | Effective Tax Rate | 15–30% | Income |
| 7 | Net Profit Margin | ≥ 20% | Income |
| 8 | EPS Growth YoY | > 1.0 | Income |
| 9 | Cash vs Current Debt | > 1.0 | Balance Sheet |
| 10 | Adj. Debt-to-Equity | < 0.80 | Balance Sheet |
| 11 | CapEx Margin | < 25% | Cash Flow |

## Architecture

```
Browser
  │
  ├── GET /api/stock/{ticker}/ratios
  │     └── FMP API → normalize → compute 11 ratios → JSON
  │
  ├── GET /api/stock/{ticker}/financials
  │     └── FMP API → normalize → JSON
  │
  └── POST /api/chat  (SSE stream)
        ├── FAISS similarity search → top-3 Buffett knowledge chunks
        ├── Build prompt (knowledge + stock ratios + question)
        └── Groq LLaMA 3.1 → token stream → SSE → browser
```

## License

MIT
