from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.rag import stream_chat

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    ticker: str = ""
    ratios: list[dict] = []


@router.post("")
def chat(request: ChatRequest):
    """Stream an LLM response for a user question, with stock context injected."""
    return StreamingResponse(
        stream_chat(request.question, request.ticker, request.ratios),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
