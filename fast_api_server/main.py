from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from fast_api_server.api import health
from fast_api_server.api import blog

app = FastAPI(title="ReviewGen FastAPI Backend")

# CORS configuration (mirrors server/middleware/security.js logic)
origins = [
    "http://localhost:3000",
    "https://vmarketing.netlify.app",
    "https://development--vmarketing.netlify.app",
    "https://app.netlify.com",
    os.getenv("FRONTEND_URL")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in origins if o],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# --- Route imports (to be implemented) ---
# from api import blog, health, llama, ...
app.include_router(blog.router, prefix="/api")
app.include_router(health.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "ReviewGen FastAPI backend is running."} 