from dataclasses import asdict
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.financial import get_stock_data, get_stock_quote
from app.services.buffett import compute_ratios, compute_weighted_score
from app.services.rag import stream_recommendation

router = APIRouter()


@router.get("/{ticker}/quote")
def get_quote(ticker: str):
    try:
        return get_stock_quote(ticker.upper())
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{ticker}/financials")
def get_financials(ticker: str):
    try:
        return get_stock_data(ticker.upper())
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.get("/{ticker}/ratios")
def get_ratios(ticker: str):
    try:
        data   = get_stock_data(ticker.upper())
        ratios = compute_ratios(data)
        score  = compute_weighted_score(ratios)
        return {
            "ticker":         ticker.upper(),
            "ratios":         [asdict(r) for r in ratios],
            "weighted_score": score,
        }
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


class RecommendationRequest(BaseModel):
    ticker: str
    ratios: list[dict]
    weighted_score: float
    quote: dict


@router.post("/recommendation")
def get_recommendation(req: RecommendationRequest):
    """Stream an AI-generated investment recommendation based on Buffett metrics."""
    return StreamingResponse(
        stream_recommendation(req.ticker, req.ratios, req.weighted_score, req.quote),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
