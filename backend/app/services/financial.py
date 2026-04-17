from functools import lru_cache
from typing import Optional

import pandas as pd
import yfinance as yf


def _df_to_dict(df: pd.DataFrame) -> dict:
    """Convert yfinance DataFrame (index=fields, columns=dates) to {date_str: {field: value}}."""
    result: dict = {}
    for col in df.columns:
        date_str = str(col.date())
        result[date_str] = {
            field: (None if pd.isna(val) else float(val))
            for field, val in df[col].items()
        }
    return result


@lru_cache(maxsize=64)
def get_stock_quote(ticker: str) -> dict:
    t = yf.Ticker(ticker)
    info = t.info

    price = info.get("currentPrice") or info.get("regularMarketPrice")
    if not price:
        raise ValueError(f"No quote data found for '{ticker}'. Check the ticker symbol.")

    prev_close = info.get("previousClose") or price
    change = price - prev_close
    change_pct = (change / prev_close * 100) if prev_close else None

    market_cap = info.get("marketCap")
    fcf        = info.get("freeCashflow")
    fcf_yield  = (fcf / market_cap) if (fcf and market_cap) else None

    # Trim business summary to ~300 chars for prompt use
    summary = info.get("longBusinessSummary", "")
    if len(summary) > 300:
        summary = summary[:297] + "…"

    return {
        "name":              info.get("longName") or info.get("shortName", ticker),
        "price":             price,
        "change":            change,
        "changesPercentage": change_pct,
        "marketCap":         market_cap,
        "pe":                info.get("trailingPE"),
        "exchange":          info.get("exchange", ""),
        # Extended fields
        "sector":            info.get("sector", ""),
        "industry":          info.get("industry", ""),
        "summary":           summary,
        "forwardPE":         info.get("forwardPE"),
        "pegRatio":          info.get("pegRatio"),
        "roe":               info.get("returnOnEquity"),
        "roa":               info.get("returnOnAssets"),
        "revenueGrowth":     info.get("revenueGrowth"),
        "earningsGrowth":    info.get("earningsGrowth"),
        "fcfYield":          fcf_yield,
        "dividendYield":     info.get("dividendYield"),
        "grossMargins":      info.get("grossMargins"),
        "operatingMargins":  info.get("operatingMargins"),
        "evToEbitda":        info.get("enterpriseToEbitda"),
    }


@lru_cache(maxsize=64)
def get_stock_data(ticker: str) -> dict:
    t = yf.Ticker(ticker)

    try:
        income   = t.financials    # annual income statement
        balance  = t.balance_sheet # annual balance sheet
        cashflow = t.cashflow      # annual cash flow
    except Exception as exc:
        raise ValueError(f"Failed to fetch data for '{ticker}': {exc}") from exc

    if income is None or income.empty:
        raise ValueError(
            f"No financial data found for '{ticker}'. "
            "Check that the ticker is valid (e.g. AAPL, MSFT, KO, 0700.HK, 600519.SS)."
        )

    return {
        "financials":   _df_to_dict(income),
        "balanceSheet": _df_to_dict(balance),
        "cashflow":     _df_to_dict(cashflow),
    }


def safe_get(statement: dict, column: str, row: str) -> Optional[float]:
    return statement.get(column, {}).get(row)
