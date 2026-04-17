export interface BuffettRatio {
  name: string
  value: number | null
  threshold: string
  passes: boolean | null
  description: string
  buffett_logic: string
  category: string
  equation: string
  weight: number
}

export interface StockFinancials {
  financials: Record<string, Record<string, number | null>>
  balanceSheet: Record<string, Record<string, number | null>>
  cashflow: Record<string, Record<string, number | null>>
}

export interface StockQuote {
  name: string
  price: number | null
  change: number | null
  changesPercentage: number | null
  marketCap: number | null
  pe: number | null
  exchange: string
  // Extended
  sector?: string
  industry?: string
  summary?: string
  forwardPE?: number | null
  pegRatio?: number | null
  roe?: number | null
  roa?: number | null
  revenueGrowth?: number | null
  earningsGrowth?: number | null
  fcfYield?: number | null
  dividendYield?: number | null
  evToEbitda?: number | null
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  streaming?: boolean
}
