from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.rag import stream_chat
from app.limiter import limiter

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    ticker: str = ""
    ratios: list[dict] = []
    history: list[dict] = []   # [{role: "user"|"assistant", content: str}, ...]


@router.post("")
@limiter.limit("10/minute")
def chat(request: Request, body: ChatRequest):
    """Stream an LLM response with RAG context and full conversation history."""
    return StreamingResponse(
        stream_chat(body.question, body.ticker, body.ratios, body.history),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
