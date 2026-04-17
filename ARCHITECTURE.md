# Warren Buffett AI Stock Analyzer — Architecture & Development Plan

## Project Overview

An AI-powered stock analysis web application that combines Warren Buffett's fundamental investing rules with a RAG-based chatbot. Users input any public stock ticker to get a full financial health assessment and can converse with an AI trained on Buffett's investment philosophy.

---

## Tech Stack

### Backend — Python
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Web Framework | **FastAPI** | REST API, async support, auto docs (/docs) |
| Server | **Uvicorn** | ASGI server |
| Financial Data | **Financial Modeling Prep (FMP) API** | Fetch income statement, balance sheet, cash flow |
| RAG - Embeddings | **sentence-transformers** | Embed Buffett knowledge base into vectors |
| RAG - Vector Store | **FAISS** | Local similarity search (no external DB needed) |
| RAG - Orchestration | **LangChain** | Text splitting, retrieval chain |
| LLM | **Groq (LLaMA 3.1-8b-instant)** | Fast, free-tier inference for chat responses |
| Config | **python-dotenv** | Environment variable management |

### Frontend — React
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | **React 18 + TypeScript** | UI framework |
| Build Tool | **Vite** | Fast dev server & bundler |
| Styling | **Tailwind CSS** | Utility-first CSS, dark theme |
| Charts | **Recharts** | Financial ratio bar/line charts |
| HTTP Client | **Axios** | API requests |
| State | **React Context + useState** | Global stock data & chat state |
| Streaming | **Fetch ReadableStream** | Real-time streaming chat output |

---

## Directory Structure

```
buffett-analyzer/
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI app entry, CORS, router registration
│   │   ├── config.py                  # Pydantic Settings, load .env
│   │   ├── api/
│   │   │   └── routes/
│   │   │       ├── stock.py           # GET /api/stock/{ticker}/financials
│   │   │       │                      # GET /api/stock/{ticker}/ratios
│   │   │       └── chat.py            # POST /api/chat  (SSE streaming)
│   │   ├── services/
│   │   │   ├── financial.py           # FMP API client, field mapping, LRU cache
│   │   │   ├── buffett.py             # All 11 ratio calculations + pass/fail
│   │   │   └── rag.py                 # FAISS index build, retrieval, Groq call
│   │   └── data/
│   │       └── buffett_knowledge.txt  # RAG source documents
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
│       ├── main.tsx                   # React DOM entry
│       ├── App.tsx                    # Root layout: Header + Dashboard + Chat
│       ├── index.css                  # Tailwind directives
│       ├── types/
│       │   └── index.ts               # Shared TypeScript interfaces
│       ├── api/
│       │   └── client.ts              # Axios instance + API functions
│       ├── context/
│       │   └── StockContext.tsx       # Global state: ticker, ratios, statements
│       └── components/
│           ├── Header.tsx             # App title + stock search bar
│           ├── StockSearch.tsx        # Ticker input with search button
│           ├── Dashboard/
│           │   ├── index.tsx          # Tab switcher: Ratios / Statements / Charts
│           │   ├── RatioTable.tsx     # 11 ratios table, green/red pass/fail badges
│           │   ├── RatioChart.tsx     # Recharts bar chart, ratio trends over 4 years
│           │   └── StatementTable.tsx # Income / Balance Sheet / Cash Flow tables
│           └── Chatbot/
│               └── ChatWindow.tsx     # Chat UI with streaming message rendering
│
├── .gitignore
└── README.md
```

---

## API Design

### Stock Endpoints
```
GET  /api/stock/{ticker}/financials
     Response: { financials, balanceSheet, cashflow }
     — Raw financial statement data (4 years)

GET  /api/stock/{ticker}/ratios
     Response: { ticker, ratios: BuffettRatio[] }
     — All 11 Buffett ratios with value, threshold, pass/fail
```

### Chat Endpoint
```
POST /api/chat
     Body:    { question: string, ticker: string, ratios: BuffettRatio[] }
     Response: text/event-stream  (SSE)
     — Streams LLM response token by token
```

---

## Data Flow

### Financial Dashboard Flow
```
User inputs ticker (e.g. "AAPL")
    │
    ▼
Frontend → GET /api/stock/AAPL/ratios
    │
    ▼
Backend: financial.py fetches FMP API data (LRU-cached per ticker)
    │
    ▼
Backend: buffett.py computes all 11 ratios, compares to thresholds
    │
    ▼
Response: [{ name, value, threshold, pass, description }, ...]
    │
    ▼
RatioTable renders with green (PASS) / red (FAIL) badges
RatioChart shows 4-year trend bars
```

### RAG Chat Flow
```
User types: "Should I invest in Apple?"
    │
    ▼
Frontend injects current ticker's ratio data as structured context
    │
    ▼
POST /api/chat  { question, ticker, ratios }
    │
    ▼
rag.py: embed question → FAISS similarity search on buffett_knowledge.txt
    │
    ▼
Top-3 relevant chunks retrieved
    │
    ▼
Prompt assembled:
  [System] You are a Warren Buffett investment advisor.
  [Context - RAG chunks] ...Buffett principles...
  [Context - Stock Data] AAPL ratios: Gross Margin 46.2% ✓ ...
  [User] Should I invest in Apple?
    │
    ▼
Groq LLaMA 3.1-8b-instant streams response token by token
    │
    ▼
Frontend renders tokens in real time via ReadableStream
```

---

## Buffett Ratio Reference

| # | Ratio | Formula | Threshold | Statement |
|---|-------|---------|-----------|-----------|
| 1 | Gross Margin | Gross Profit / Revenue | ≥ 40% | Income |
| 2 | SG&A Margin | SG&A / Gross Profit | ≤ 30% | Income |
| 3 | R&D Margin | R&D / Gross Profit | ≤ 30% | Income |
| 4 | Depreciation Margin | Depreciation / Gross Profit | ≤ 10% | Income |
| 5 | Interest Expense Margin | Interest Expense / Operating Income | ≤ 15% | Income |
| 6 | Effective Tax Rate | Tax / Pre-Tax Income | ≈ Corp rate | Income |
| 7 | Net Margin | Net Income / Revenue | ≥ 20% | Income |
| 8 | EPS Growth | Year N EPS / Year N-1 EPS | > 1.0 | Income |
| 9 | Cash vs Debt | Cash / Current Debt | > 1.0 | Balance |
| 10 | Adj. Debt-to-Equity | Total Debt / (Assets - Debt) | < 0.80 | Balance |
| 11 | CapEx Margin | CapEx / Net Income | < 25% | Cash Flow |

---

## Development Phases

### Phase 1 — Backend Core
**Goal:** Stable API that returns financial data and ratios for any ticker.

- [x] **Step 1.1** — Project scaffold
  - `requirements.txt`, `.env.example`, `config.py`
  - FastAPI app with CORS, health check endpoint

- [x] **Step 1.2** — Financial data service (`financial.py`)
  - `get_financials(ticker)` → income statement, balance sheet, cash flow
  - In-memory TTL cache (avoid repeated yfinance calls)
  - Graceful handling of missing fields (not all stocks have all line items)

- [x] **Step 1.3** — Buffett ratio engine (`buffett.py`)
  - Implement all 11 ratio calculations
  - Return structured `BuffettRatio` objects with pass/fail and description

- [x] **Step 1.4** — Stock routes (`stock.py`)
  - `GET /api/stock/{ticker}/financials`
  - `GET /api/stock/{ticker}/ratios`
  - 404 handling for invalid tickers

---

### Phase 2 — RAG Chat Backend
**Goal:** Working chatbot that answers investment questions using Buffett's principles.

- [x] **Step 2.1** — Build knowledge base (`buffett_knowledge.txt`)
  - Write ~30 document chunks covering all ratios + investment philosophy
  - Include interpretation examples and Buffett quotes

- [x] **Step 2.2** — RAG service (`rag.py`)
  - Load and chunk documents with `RecursiveCharacterTextSplitter`
  - Embed with `sentence-transformers/all-MiniLM-L6-v2`
  - Build FAISS index on startup (saved to disk to avoid rebuild)
  - `retrieve(query, k=3)` → top chunks

- [x] **Step 2.3** — Chat route (`chat.py`)
  - Accept `{ question, ticker, ratios }`
  - Build prompt: system + RAG context + stock ratio context + user question
  - Stream Groq response via `StreamingResponse` (SSE)

---

### Phase 3 — Frontend
**Goal:** Professional React UI connecting to the backend API.

- [x] **Step 3.1** — Project scaffold
  - `vite`, `react`, `typescript`, `tailwindcss`, `recharts`, `axios`
  - Dark theme base layout

- [x] **Step 3.2** — API client + types (`client.ts`, `types/index.ts`)
  - TypeScript interfaces: `BuffettRatio`, `StockData`, `Message`
  - Axios functions: `fetchRatios()`, `fetchFinancials()`

- [x] **Step 3.3** — Stock Context + Header + Search
  - `StockContext` with `ticker`, `ratios`, `statements`, `loading`
  - `Header` with app branding
  - `StockSearch` input triggers API fetch

- [x] **Step 3.4** — Dashboard components
  - `RatioTable`: table with PASS (green) / FAIL (red) / N/A badges
  - `RatioChart`: Recharts bar chart, 4-year trend per ratio
  - `StatementTable`: collapsible income / balance / cash flow tables

- [x] **Step 3.5** — Chatbot component
  - `ChatWindow`: message list + input box
  - Streaming: `fetch()` → `ReadableStream` → append tokens in real time
  - Auto-inject current stock ratios as context on send

---

### Phase 4 — Polish & Portfolio Prep
**Goal:** Production-quality finishing for GitHub/resume.

- [x] **Step 4.1** — Error states
  - Invalid ticker → user-facing error message
  - API down → graceful fallback UI
  - Missing financial fields → show "N/A" instead of crash

- [x] **Step 4.2** — README.md
  - Project description, demo screenshot, tech stack badges
  - Setup instructions (backend + frontend)
  - Architecture diagram

- [x] **Step 4.3** — `.gitignore`, `.env.example`
  - Never commit API keys
  - Document all required environment variables

---

## Environment Variables

```bash
# backend/.env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
FMP_API_KEY=your_fmp_api_key_here
```

```
# Groq free tier:  https://console.groq.com
# FMP free tier:   https://financialmodelingprep.com/register  (250 req/day)
```

---

## Local Development

```bash
# Backend
cd backend
python3.11 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev       # Vite dev server on http://localhost:5173
```

---

## Key Design Decisions & Rationale

| Decision | Alternative | Why This |
|----------|------------|----------|
| FastAPI over Flask | Flask | Async support, auto OpenAPI docs, Pydantic validation |
| FAISS local over Pinecone | Pinecone/Weaviate | No external service, works offline, fine for <10k chunks |
| Groq over OpenAI | OpenAI GPT-4 | Free tier, faster inference, LLaMA 3.1 quality sufficient |
| SSE streaming over WebSocket | WebSocket | Simpler for one-way streaming, no ws library needed |
| Context API over Zustand | Zustand/Redux | App state is simple (1 ticker, 1 chat), no need for extra lib |
| Tailwind over MUI/Ant | Material UI | Faster custom styling, smaller bundle, looks more unique |
| FMP over yfinance | yfinance | yfinance hit Yahoo Finance IP-level 429 rate limits in dev; FMP stable REST API with 250 free req/day |

---

## Phase 5 — UI Redesign (Investment-Bank Theme)

**Goal:** Replace the startup-green dark theme with a premium deep-navy × amber-gold palette, matching the aesthetic of Bloomberg Terminal / institutional finance tools.

### Color Palette

| Role | Old | New |
|---|---|---|
| Page background | `#0c1020` | `#070B14` deep navy-black |
| Panel surface | `#141928` | `#0E1425` |
| Card / inset | `#111624` | `#0A1020` |
| Border | `#2a2f42` | `#1A2340` |
| **Primary accent** | `#10b981` emerald | `#C9A44A` amber-gold |
| PASS badge | green | gold |
| FAIL badge | `#ef4444` | `#C84B4B` muted red |
| Primary text | `#e5e7eb` | `#E8EBF4` cool white |
| Secondary text | `#6b7280` | `#4E5F80` blue-grey |

### Files to Update
- `App.tsx` — background dot-grid color
- `Header.tsx` — logo gradient, brand accent
- `StockSearch.tsx` — button, focus ring, ticker badge
- `Dashboard/index.tsx` — stock bar accent, active tab indicator
- `RatioTable.tsx` — score ring, progress bars, PASS/FAIL badges
- `RatioChart.tsx` — bar fill colors, threshold line color
- `ChatWindow.tsx` — header, message bubbles, send button
- `StatementTable.tsx` — section header colors

### Status
- [x] Apply new color palette across all components (deep-navy `#070B14` + amber-gold `#C9A44A`)

---

## Phase 6 — Layout Redesign & Personal Tool Extensions

**Goal:** Evolve from a course project into a personal-use investment analysis tool with a professional layout and an AI advisor with a strong Buffett persona.

### Implemented Layout

```
┌────────────────────────────────────────────────────────────┐
│  [B] BuffettAI    [════════ AAPL ════════ 🔍 Analyze ]     │
├────────────────────────────────────────────────────────────┤
│                                    │                        │
│  ┌── Stock Overview ─────────────┐ │  ┌── AI Advisor ────┐ │
│  │ Apple Inc.  AAPL  $189 ▲2.3% │ │  │  (Buffett voice) │ │
│  │ Market Cap $2.9T  P/E 31.2   │ │  │                  │ │
│  └───────────────────────────────┘ │  │  [chat messages] │ │
│  [══════ Buffett Score 8/11 ═════] │  │                  │ │
│  [Ratios ◎] [Chart ▦] [Data ≡]    │  │  [input bar]     │ │
│                                    │  └──────────────────┘ │
│  (dashboard content)               │                        │
└────────────────────────────────────────────────────────────┘
```

### Feature Roadmap

#### Priority 1 — Core Usability
| Feature | Description | Effort | Status |
|---|---|---|---|
| **Stock Overview card** | Current price, market cap, P/E via FMP `/quote` | Low | ✅ Done |
| **FMP quote endpoint** | `GET /api/stock/{ticker}/quote` | Low | ✅ Done |
| **Buffett persona** | System prompt rewritten as first-person Buffett voice | Minimal | ⬜ Todo |
| **Watchlist** | Persistent ticker list in header (localStorage); click to switch | Low | ⬜ Todo |
| **Chat persistence** | Messages survive stock ticker changes; context accumulates | Low | ⬜ Todo |

#### Priority 2 — Analytical Depth
| Feature | Description | Effort | Status |
|---|---|---|---|
| **Ratio trend lines** | Line chart showing each ratio across 4 years | Low | ⬜ Todo |
| **Auto investment thesis** | One-paragraph Buffett-style verdict from ratios | Low | ⬜ Todo |
| **Multi-stock compare** | 2–3 tickers side-by-side Buffett score comparison | Medium | ⬜ Todo |

### Remaining Backend Work
- `rag.py` — upgrade system prompt to first-person Buffett persona with opinionated tone
- `chat.py` + `rag.py` — accept `history: Message[]` for multi-turn conversation context

### Remaining Frontend Work
- `Header.tsx` — watchlist pill row (localStorage `watchlist[]`, click to search)
- `ChatWindow.tsx` — pass message history array to backend; persist across ticker switches
- New `InvestmentThesis.tsx` — auto-generated one-paragraph verdict below score ring
- `RatioChart.tsx` — add trend line view (multi-year per ratio)

### Status
- [x] Apply new color palette (Phase 5)
- [x] Stock Overview card + FMP quote endpoint
- [ ] Upgrade Buffett persona prompt
- [ ] Add Watchlist (localStorage)
- [ ] Chat history persistence across ticker switches
- [ ] Auto investment thesis card
- [ ] Ratio trend line chart
