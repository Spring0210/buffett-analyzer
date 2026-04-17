import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")
FMP_API_KEY: str = os.getenv("FMP_API_KEY", "")

if not GROQ_API_KEY:
    print("WARNING: GROQ_API_KEY is not set. Chat functionality will not work.")
if not FMP_API_KEY:
    print("WARNING: FMP_API_KEY is not set. Stock data will not work.")
