# BuffettAI — Product Roadmap

> Goal: A professional-grade US equity analysis platform that combines Warren Buffett's timeless value investing principles with modern quantitative investment concepts to provide actionable stock selection guidance.

---

## Current State (v0.1)

- 14 Buffett metrics with weighted scoring (0–100)
- yfinance data backend (US stocks, HK stocks, A-shares)
- RAG-powered chat advisor (Groq + FAISS)
- AI streaming investment recommendation
- Financial statement viewer (Income / Balance / Cash Flow)
- Bar chart visualization

---

## Phase 1 — Data & Intelligence Upgrade (Current Sprint)

**Goal:** Make the analysis richer and the AI recommendation meaningfully better.

### 1.1 Expanded Quote Data
- [x] Sector / Industry classification
- [x] ROE, ROA from yfinance `.info`
- [x] Revenue Growth, Earnings Growth (YoY)
- [x] PEG Ratio, Forward P/E
- [x] FCF Yield (Free Cash Flow / Market Cap)
- [x] Dividend Yield & Payout Ratio
- [ ] EV/EBITDA (enterprise value multiple)
- [ ] Insider ownership percentage

### 1.2 AI Recommendation Quality
- [x] Company business summary in prompt context
- [x] Sector/industry framing
- [x] Multi-year trend data for key metrics
- [x] Modern metrics (ROE, FCF Yield, PEG) in context
- [ ] Few-shot example in system prompt
- [ ] Prompt caching for repeated tickers

### 1.3 Scoring Refinements
- [ ] Industry-adjusted thresholds (e.g., R&D threshold higher for tech)
- [ ] Trend bonus: metrics that improved 3 years in a row get +weight
- [ ] Penalty system: metrics in freefall get negative weight

### 1.4 StockOverview Panel
- [x] Sector & Industry display
- [x] ROE, Forward P/E, FCF Yield display
- [ ] 52-week high/low bar
- [ ] Analyst consensus (from yfinance `.info`)

---

## Phase 2 — Valuation Engine (Month 2)

**Goal:** Give users a concrete estimate of intrinsic value and margin of safety.

### 2.1 Intrinsic Value Models
- [ ] **DCF Calculator** — 10-year discounted cash flow with user-adjustable growth rate and discount rate
- [ ] **Graham Number** — √(22.5 × EPS × BVPS) — classic Ben Graham formula
- [ ] **FCF Yield Valuation** — fair value based on normalized FCF yield vs 10Y Treasury
- [ ] **Earnings Power Value (EPV)** — Bruce Greenwald's no-growth DCF variant

### 2.2 Margin of Safety
- [ ] Display current price vs estimated intrinsic value range
- [ ] Visual margin-of-safety gauge (price vs value)
- [ ] "Buffett Circle of Competence" check — flag highly complex businesses

### 2.3 Modern Valuation Metrics
- [ ] **ROIC** (Return on Invested Capital) — Buffett's preferred efficiency metric
- [ ] **EV/EBITDA** comparison vs sector median
- [ ] **Price-to-FCF** ratio
- [ ] **PEG Ratio** interpretation (growth-adjusted value)

---

## Phase 3 — Stock Screener (Month 2–3)

**Goal:** Let users discover stocks that meet Buffett criteria, not just analyze one at a time.

### 3.1 Buffett Screen
- [ ] Pre-built screen: Weighted Score ≥ 70 + Gross Margin ≥ 40% + Net Margin ≥ 20%
- [ ] Configurable filters: sector, market cap, exchange
- [ ] S&P 500 batch analysis (top 100 by score)
- [ ] Results ranked by weighted Buffett score

### 3.2 Custom Screener
- [ ] Drag-and-drop metric filter builder
- [ ] Save/load custom screen presets
- [ ] Export results to CSV

### 3.3 Watchlist
- [ ] Save stocks to personal watchlist (localStorage)
- [ ] Daily score change notifications (if backend cron job)
- [ ] Side-by-side comparison of up to 4 stocks

---

## Phase 4 — Modern Investment Concepts (Month 3–4)

**Goal:** Evolve beyond pure Buffett criteria to incorporate frameworks Buffett himself has adapted to.

### 4.1 Quality Investing Overlay
- [ ] **ROIC vs WACC spread** — economic profit indicator
- [ ] **Capital Allocation Score** — buyback history, dividend growth, acquisition discipline
- [ ] **Management Compensation Alignment** — CEO pay vs EPS growth ratio
- [ ] **Insider Ownership** threshold check (Buffett prefers owner-operators)

### 4.2 Competitive Moat Classification
- [ ] Auto-classify moat type based on metrics:
  - Network Effect (platform companies, high gross margin)
  - Switching Costs (high retention, recurring revenue)
  - Cost Advantage (low CapEx, economies of scale)
  - Intangible Assets (brand, patents — high gross margin + low R&D need)
  - Efficient Scale (regulated monopolies, utilities)
- [ ] Moat strength rating: Wide / Narrow / None

### 4.3 Industry-Aware Scoring
- [ ] Sector-specific metric weights (tech vs consumer vs financials vs utilities)
- [ ] Peer comparison: how does the stock rank within its sector?
- [ ] Sector median benchmarks for each metric

### 4.4 Macro Context
- [ ] Interest rate sensitivity flag (high-debt companies warned in rising rate environments)
- [ ] Fed Funds Rate overlay on valuation multiples
- [ ] Recession resilience score (based on revenue stability, cash position, debt maturity)

---

## Phase 5 — Portfolio & Tracking (Month 4–5)

**Goal:** Allow users to manage a virtual portfolio through a Buffett lens.

### 5.1 Portfolio Builder
- [ ] Add stocks with position size
- [ ] Portfolio-level weighted Buffett score
- [ ] Concentration analysis (sector/industry diversification)
- [ ] Portfolio P&L tracking (price from yfinance)

### 5.2 Monitoring & Alerts
- [ ] Weekly score re-calculation (cron job)
- [ ] Alert when a held stock's score drops below threshold
- [ ] Earnings calendar integration

### 5.3 Performance Attribution
- [ ] Backtest: how would a Buffett-screened portfolio have performed vs S&P 500?
- [ ] Score vs return correlation analysis

---

## Phase 6 — UX & Polish (Ongoing)

- [ ] Mobile-responsive layout
- [ ] PDF report export (one-page stock tearsheet)
- [ ] Keyboard shortcuts (type ticker + Enter from anywhere)
- [ ] Light / dark mode toggle
- [ ] Onboarding tour for new users
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] Internationalization: Chinese / English toggle for UI labels

---

## Technical Debt & Infrastructure

- [ ] Replace `lru_cache` with Redis for production-grade caching
- [ ] Rate limiting on API routes
- [ ] Error monitoring (Sentry)
- [ ] Unit tests for `buffett.py` ratio calculations
- [ ] CI/CD pipeline (GitHub Actions → Docker)
- [ ] Environment config validation on startup

---

## Metric Priority Matrix

| Metric | Current | Phase 1 | Phase 2 | Phase 3+ |
|--------|---------|---------|---------|----------|
| 14 Buffett Ratios | ✅ | ✅ | ✅ | ✅ |
| Weighted Score | ✅ | ✅ | ✅ | ✅ |
| AI Recommendation | ✅ | Improved | ✅ | ✅ |
| ROE / ROA | — | ✅ | ✅ | ✅ |
| ROIC | — | — | ✅ | ✅ |
| DCF / Graham Number | — | — | ✅ | ✅ |
| Margin of Safety | — | — | ✅ | ✅ |
| Moat Classification | — | — | — | ✅ |
| Stock Screener | — | — | ✅ | ✅ |
| Portfolio Tracker | — | — | — | ✅ |
| Peer Comparison | — | — | — | ✅ |

---

*Last updated: 2026-04-17*
