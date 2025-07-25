from fastapi import APIRouter, HTTPException, status, Body
from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from fast_api_server.services import blog_service

router = APIRouter()

# --- Pydantic models (to be expanded) ---
class ImageInput(BaseModel):
    name: str
    type: str
    size: int
    dataUrl: Optional[str] = None

class BlogGenerateRequest(BaseModel):
    topic: str
    mainName: Optional[str] = None
    type: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    targetAudience: Optional[str] = None
    tone: Optional[str] = None
    length: Optional[str] = None
    keyPoints: Optional[str] = None
    specialFeatures: Optional[str] = None
    images: Optional[List[ImageInput]] = None
    restaurantName: Optional[str] = None
    restaurantType: Optional[str] = None
    cuisine: Optional[str] = None

class BlogSaveRequest(BlogGenerateRequest):
    blogPost: str
    imageAnalysis: Optional[Dict[str, Any]] = None
    model: Optional[str] = None
    wordCount: Optional[int] = None
    metadata: Optional[Dict[str, Any]] = None

# --- Endpoints ---

@router.post("/blog/generate")
async def generate_blog(request: BlogGenerateRequest):
    result = await blog_service.generate_blog_post(request.dict())
    if result.get("success"):
        return result
    else:
        raise HTTPException(status_code=400, detail=result.get("error", "Blog generation failed"))

@router.post("/blog/save")
def save_blog(request: BlogSaveRequest):
    # TODO: Implement blog save logic (DB integration)
    raise HTTPException(status_code=501, detail="Not implemented yet")

@router.post("/blog/process-images")
def process_images(images: List[ImageInput] = Body(...)):
    # TODO: Implement image processing logic
    raise HTTPException(status_code=501, detail="Not implemented yet")

@router.get("/blog/model")
def get_blog_model():
    # TODO: Return model info
    return {"success": True, "model": {"name": "nvidia/llama-3.3-nemotron-super-49b-v1"}}

@router.get("/blog/list")
def list_blogs():
    # TODO: Return list of saved blogs from DB
    raise HTTPException(status_code=501, detail="Not implemented yet") 