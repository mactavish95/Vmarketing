from pydantic import BaseModel
from typing import List, Optional, Dict, Any

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