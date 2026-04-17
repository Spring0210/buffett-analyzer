import { useState } from 'react'
import { useStock } from '../../context/StockContext'
import RatioTable from './RatioTable'
import RatioChart from './RatioChart'
import StatementTable from './StatementTable'
import StockOverview from './StockOverview'
import AIRecommendation from './AIRecommendation'

const TABS = [
  { label: 'Ratios' },
  { label: 'Chart' },
  { label: 'Statements' },
  { label: 'AI Pick' },
]

export default function Dashboard() {
  const [tab, setTab] = useState(0)
  const { ticker, quote, ratios, weightedScore, financials, loading, error } = useStock()

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-9 h-9 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: 'rgba(10,132,255,0.2)', borderTopColor: '#0A84FF' }}
          />
          <p className="text-sm" style={{ color: 'rgba(235,235,245,0.5)' }}>Fetching financial data…</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(235,235,245,0.25)' }}>Pulling statements from Yahoo Finance</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="rounded-2xl p-6 text-center max-w-sm w-full"
          style={{ background: 'rgba(255,69,58,0.08)', border: '1px solid rgba(255,69,58,0.2)' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(255,69,58,0.12)' }}>
            <span style={{ color: '#FF453A' }} className="text-base font-bold">!</span>
          </div>
          <p className="font-semibold mb-1" style={{ color: '#FF453A' }}>Failed to load data</p>
          <p className="text-sm" style={{ color: 'rgba(235,235,245,0.5)' }}>{error}</p>
          <p className="text-xs mt-2" style={{ color: 'rgba(235,235,245,0.25)' }}>Check the ticker symbol and try again.</p>
        </div>
      </div>
    )
  }

  if (!ticker) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: '#0A84FF', boxShadow: '0 8px 32px rgba(10,132,255,0.35)' }}
          >
            <span className="text-3xl font-bold text-white">B</span>
          </div>
          <p className="font-semibold text-[17px]" style={{ color: '#F5F5F7' }}>
            Warren Buffett Stock Analyzer
          </p>
          <p className="text-sm mt-1.5 max-w-xs mx-auto" style={{ color: 'rgba(235,235,245,0.45)' }}>
            Enter any stock ticker to analyze against Buffett's investment criteria
          </p>
          <div className="flex gap-2 justify-center mt-4 flex-wrap">
            {['AAPL', 'MSFT', 'KO', 'BRK-B', 'JNJ'].map(t => (
              <span key={t} className="text-xs font-mono rounded-md px-2.5 py-1"
                style={{ color: 'rgba(235,235,245,0.4)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const pass  = ratios.filter(r => r.passes === true).length
  const total = ratios.length

  return (
    <div
      className="rounded-2xl overflow-hidden h-full flex flex-col"
      style={{ background: '#242426', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="px-4 pt-4 flex-shrink-0">
        {quote && <StockOverview ticker={ticker} quote={quote} />}
      </div>

      {/* Score bar */}
      <div
        className="mx-4 mb-3 rounded-lg px-4 py-2.5 flex items-center justify-between flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div>
          <span className="text-xs" style={{ color: 'rgba(235,235,245,0.35)' }}>Weighted Score</span>
          <span className="text-[11px] ml-2" style={{ color: 'rgba(235,235,245,0.2)' }}>
            ({pass}/{total} passed)
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${weightedScore}%`,
                background: weightedScore >= 70 ? '#30D158' : weightedScore >= 40 ? '#FF9F0A' : '#FF453A',
              }}
            />
          </div>
          <span className="text-sm font-semibold font-mono"
            style={{ color: weightedScore >= 70 ? '#30D158' : weightedScore >= 40 ? '#FF9F0A' : '#FF453A' }}>
            {weightedScore.toFixed(0)}
          </span>
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex flex-shrink-0 border-b px-4"
        style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(28,28,30,0.5)' }}
      >
        {TABS.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setTab(i)}
            className="px-4 py-2.5 text-sm font-medium transition-colors relative"
            style={{ color: tab === i ? '#F5F5F7' : 'rgba(235,235,245,0.35)' }}
          >
            {t.label}
            {tab === i && (
              <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-t-full"
                style={{ background: '#0A84FF' }} />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {tab === 0 && <RatioTable ratios={ratios} />}
        {tab === 1 && <RatioChart ratios={ratios} />}
        {tab === 2 && financials && <StatementTable financials={financials} />}
        {tab === 3 && <AIRecommendation />}
      </div>
    </div>
  )
}
