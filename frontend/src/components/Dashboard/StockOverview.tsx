import type { StockQuote } from '../../types'

function fmt(n: number | null | undefined, decimals = 2): string {
  if (n === null || n === undefined) return '—'
  return n.toFixed(decimals)
}
function pct(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return `${(n * 100).toFixed(1)}%`
}
function fmtCap(n: number | null | undefined): string {
  if (!n) return '—'
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(1)}M`
  return `$${n.toLocaleString()}`
}

interface Props { ticker: string; quote: StockQuote }

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: 'rgba(235,235,245,0.28)' }}>
        {label}
      </p>
      <p className="text-sm font-semibold font-mono"
        style={{ color: highlight ? '#F5F5F7' : 'rgba(235,235,245,0.7)' }}>
        {value}
      </p>
    </div>
  )
}

export default function StockOverview({ ticker, quote }: Props) {
  const isUp = (quote.changesPercentage ?? 0) >= 0
  const changeColor = isUp ? '#30D158' : '#FF453A'

  return (
    <div className="rounded-xl mb-3" style={{ background: '#2C2C2E', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Top row: name + price */}
      <div className="px-4 py-3 flex items-center gap-5 flex-wrap"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[15px] truncate" style={{ color: '#F5F5F7' }}>
            {quote.name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(235,235,245,0.35)' }}>
            <span className="font-mono">{ticker}</span>
            {quote.exchange ? ` · ${quote.exchange}` : ''}
            {quote.sector ? ` · ${quote.sector}` : ''}
            {quote.industry ? ` — ${quote.industry}` : ''}
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums" style={{ color: '#F5F5F7' }}>
            ${fmt(quote.price)}
          </p>
          <p className="text-xs font-mono mt-0.5" style={{ color: changeColor }}>
            {isUp ? '+' : ''}{fmt(quote.change)} ({isUp ? '+' : ''}{fmt(quote.changesPercentage)}%)
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="px-4 py-3 grid grid-cols-4 gap-x-4 gap-y-2.5 sm:grid-cols-6 lg:grid-cols-8">
        <Stat label="Market Cap"   value={fmtCap(quote.marketCap)} highlight />
        <Stat label="P/E (TTM)"    value={fmt(quote.pe, 1)} />
        <Stat label="Forward P/E"  value={fmt(quote.forwardPE, 1)} />
        <Stat label="PEG Ratio"    value={fmt(quote.pegRatio, 2)} />
        <Stat label="EV/EBITDA"    value={fmt(quote.evToEbitda, 1)} />
        <Stat label="FCF Yield"    value={pct(quote.fcfYield)} />
        <Stat label="ROE"          value={pct(quote.roe)} />
        <Stat label="Rev Growth"   value={pct(quote.revenueGrowth)} />
      </div>
    </div>
  )
}
