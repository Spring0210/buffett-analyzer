import { createContext, useContext, useState, type ReactNode } from 'react'
import type { BuffettRatio, StockFinancials, StockQuote } from '../types'
import { fetchRatios, fetchFinancials, fetchQuote } from '../api/client'

interface StockContextType {
  ticker: string
  quote: StockQuote | null
  ratios: BuffettRatio[]
  weightedScore: number
  financials: StockFinancials | null
  loading: boolean
  error: string | null
  search: (ticker: string) => Promise<void>
}

const StockContext = createContext<StockContextType | null>(null)

export function StockProvider({ children }: { children: ReactNode }) {
  const [ticker, setTicker]           = useState('')
  const [quote, setQuote]             = useState<StockQuote | null>(null)
  const [ratios, setRatios]           = useState<BuffettRatio[]>([])
  const [weightedScore, setWeightedScore] = useState(0)
  const [financials, setFinancials]   = useState<StockFinancials | null>(null)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)

  const search = async (newTicker: string) => {
    setLoading(true)
    setError(null)
    try {
      const [ratioData, finData, quoteData] = await Promise.all([
        fetchRatios(newTicker),
        fetchFinancials(newTicker),
        fetchQuote(newTicker),
      ])
      setTicker(ratioData.ticker)
      setRatios(ratioData.ratios)
      setWeightedScore(ratioData.weighted_score)
      setFinancials(finData)
      setQuote(quoteData)
    } catch (e) {
      const msg = (e instanceof Error && e.message) ? e.message : 'Failed to fetch stock data.'
      setError(msg)
      setTicker('')
      setRatios([])
      setWeightedScore(0)
      setFinancials(null)
      setQuote(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <StockContext.Provider value={{ ticker, quote, ratios, weightedScore, financials, loading, error, search }}>
      {children}
    </StockContext.Provider>
  )
}

export function useStock() {
  const ctx = useContext(StockContext)
  if (!ctx) throw new Error('useStock must be used within StockProvider')
  return ctx
}
