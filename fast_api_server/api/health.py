from fastapi import APIRouter
import os
from datetime import datetime

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "OK",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "environment": os.getenv("NODE_ENV", "development"),
        "apiKeyConfigured": bool(os.getenv("NVIDIA_API_KEY")),
        "apiKeyLength": len(os.getenv("NVIDIA_API_KEY", ""))
    } 