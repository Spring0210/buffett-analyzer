import { useState, type KeyboardEvent } from 'react'
import { useStock } from '../context/StockContext'

export default function StockSearch() {
  const [input, setInput] = useState('')
  const { search, loading, ticker } = useStock()

  const handleSearch = () => {
    const t = input.trim().toUpperCase()
    if (t) search(t)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
          style={{ color: 'rgba(235,235,245,0.3)' }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value.toUpperCase())}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && !loading && handleSearch()}
          placeholder="AAPL, MSFT, KO…"
          maxLength={10}
          className="rounded-lg pl-9 pr-3 py-1.5 text-sm font-mono w-40 outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#F5F5F7',
          }}
          onFocus={e => (e.target.style.borderColor = 'rgba(10,132,255,0.7)')}
          onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
        />
      </div>

      <button
        onClick={handleSearch}
        disabled={loading || !input.trim()}
        className="px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          background: loading || !input.trim() ? 'rgba(255,255,255,0.06)' : '#0A84FF',
          color: loading || !input.trim() ? 'rgba(235,235,245,0.4)' : '#ffffff',
        }}
      >
        {loading ? (
          <>
            <div
              className="w-3 h-3 border-2 rounded-full animate-spin"
              style={{ borderColor: 'rgba(235,235,245,0.2)', borderTopColor: 'rgba(235,235,245,0.6)' }}
            />
            Loading
          </>
        ) : 'Analyze'}
      </button>

      {ticker && !loading && (
        <div
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1"
          style={{ background: 'rgba(10,132,255,0.12)', border: '1px solid rgba(10,132,255,0.25)' }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#0A84FF' }} />
          <span className="font-mono text-xs font-semibold" style={{ color: '#0A84FF' }}>{ticker}</span>
        </div>
      )}
    </div>
  )
}
