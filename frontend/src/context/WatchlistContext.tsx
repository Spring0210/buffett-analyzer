import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface WatchlistEntry {
  ticker: string
  name: string
  price: number | null
  score: number | null
  sector: string | null
  currency: string | null
  addedAt: string
}

const LS_KEY = 'buffettai_watchlist'

function loadFromLS(): WatchlistEntry[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

interface WatchlistContextType {
  entries: WatchlistEntry[]
  add: (entry: WatchlistEntry) => void
  remove: (ticker: string) => void
  has: (ticker: string) => boolean
}

const WatchlistContext = createContext<WatchlistContextType | null>(null)

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<WatchlistEntry[]>(loadFromLS)

  const add = useCallback((entry: WatchlistEntry) => {
    setEntries(prev => {
      const next = [entry, ...prev.filter(e => e.ticker !== entry.ticker)]
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const remove = useCallback((ticker: string) => {
    setEntries(prev => {
      const next = prev.filter(e => e.ticker !== ticker)
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const has = useCallback((ticker: string) => {
    return entries.some(e => e.ticker === ticker)
  }, [entries])

  return (
    <WatchlistContext.Provider value={{ entries, add, remove, has }}>
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be used within WatchlistProvider')
  return ctx
}
