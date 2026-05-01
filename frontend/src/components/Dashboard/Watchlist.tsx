import { useWatchlist, type WatchlistEntry } from '../../context/WatchlistContext'
import { useStock } from '../../context/StockContext'
import { getCurrencySymbol } from '../../utils/currency'
import type { Section } from '../../types'

interface Props {
  onNavigate: (s: Section) => void
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span style={{ color: 'rgba(235,235,245,0.3)' }}>—</span>
  const color = score >= 70 ? '#30D158' : score >= 40 ? '#FF9F0A' : '#FF453A'
  return (
    <span className="text-sm font-bold font-mono tabular-nums" style={{ color }}>
      {score.toFixed(0)}
    </span>
  )
}

function EntryRow({ entry, onLoad, onRemove }: {
  entry: WatchlistEntry
  onLoad: () => void
  onRemove: () => void
}) {
  const sym = getCurrencySymbol(entry.currency)
  const score = entry.score ?? 0
  const scoreColor = score >= 70 ? '#30D158' : score >= 40 ? '#FF9F0A' : '#FF453A'
  const addedDate = new Date(entry.addedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all rounded-xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      onClick={onLoad}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(10,132,255,0.08)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
    >
      {/* Score ring */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: `${scoreColor}18`, border: `1.5px solid ${scoreColor}55` }}>
        <ScoreBadge score={entry.score} />
      </div>

      {/* Ticker + name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold font-mono" style={{ color: '#F5F5F7' }}>{entry.ticker}</p>
        <p className="text-[11px] truncate" style={{ color: 'rgba(235,235,245,0.4)' }}>
          {entry.name}{entry.sector ? ` · ${entry.sector}` : ''}
        </p>
      </div>

      {/* Price + date */}
      <div className="text-right flex-shrink-0">
        {entry.price != null && (
          <p className="text-sm font-mono" style={{ color: 'rgba(235,235,245,0.7)' }}>
            {sym}{entry.price.toFixed(2)}
          </p>
        )}
        <p className="text-[10px]" style={{ color: 'rgba(235,235,245,0.25)' }}>Added {addedDate}</p>
      </div>

      {/* Remove button */}
      <button
        onClick={e => { e.stopPropagation(); onRemove() }}
        className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
        style={{ color: 'rgba(235,235,245,0.2)' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,69,58,0.15)'; e.currentTarget.style.color = '#FF453A' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(235,235,245,0.2)' }}
        title="Remove from watchlist"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}

export default function Watchlist({ onNavigate }: Props) {
  const { entries, remove } = useWatchlist()
  const { search } = useStock()

  async function loadEntry(entry: WatchlistEntry) {
    await search(entry.ticker)
    onNavigate('ratios')
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(235,235,245,0.3)" strokeWidth="1.8">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <p className="text-sm font-medium" style={{ color: 'rgba(235,235,245,0.35)' }}>No stocks saved yet</p>
        <p className="text-xs text-center max-w-xs" style={{ color: 'rgba(235,235,245,0.2)' }}>
          Click the star icon while viewing a stock to add it to your watchlist.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs" style={{ color: 'rgba(235,235,245,0.3)' }}>
          {entries.length} stock{entries.length !== 1 ? 's' : ''} · click to load · scores from last analysis
        </p>
      </div>
      {entries.map(entry => (
        <EntryRow
          key={entry.ticker}
          entry={entry}
          onLoad={() => loadEntry(entry)}
          onRemove={() => remove(entry.ticker)}
        />
      ))}
    </div>
  )
}
