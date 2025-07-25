from fastapi import FastAPI
from app.api.v1.routes import blog

app = FastAPI(title="ReviewGen FastAPI Backend")

app.include_router(blog.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "ReviewGen FastAPI backend is running."}
