from fastapi import APIRouter, HTTPException, Body
from typing import List
from app.models.blog import BlogGenerateRequest, BlogSaveRequest, ImageInput
from app.services.blog_service import generate_blog_post, process_images, select_model
from app.db.collections.blogs import insert_blog, list_blogs as db_list_blogs, get_blog, update_blog, delete_blog
from bson.errors import InvalidId
from fastapi import Path

router = APIRouter()

@router.post("/blog/generate")
async def generate_blog(request: BlogGenerateRequest):
    result = await generate_blog_post(request.dict())
    if result.get("success"):
        return result
    else:
        raise HTTPException(status_code=400, detail=result.get("error", "Blog generation failed"))

@router.post("/blog/save")
async def save_blog(request: BlogSaveRequest):
    blog_data = request.dict()
    blog_data["createdAt"] = blog_data.get("createdAt") or __import__('datetime').datetime.utcnow().isoformat() + "Z"
    try:
        blog_id = await insert_blog(blog_data)
        return {"success": True, "blogId": blog_id}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.post("/blog/process-images")
async def process_blog_images(images: List[ImageInput] = Body(...)):
    # Use the service logic for image analysis
    result = process_images([img.dict() for img in images])
    return {"success": True, "imageAnalysis": result}

@router.get("/blog/model")
def get_blog_model():
    model = select_model("blog_generation")
    return {
        "success": True,
        "model": {
            "name": model["name"],
            "description": model["description"],
            "useCase": "blog_generation",
            "strengths": model["strengths"],
            "imageSupport": True,
            "maxImages": 10,
            "supportedFormats": ["JPEG", "PNG", "GIF", "WebP"],
            "parameters": {
                "temperature": model["temperature"],
                "maxTokens": model["max_tokens"],
                "topP": model["top_p"],
                "frequencyPenalty": model["frequency_penalty"],
                "presencePenalty": model["presence_penalty"]
            },
            "modelInfo": {
                "provider": "NVIDIA",
                "modelType": model["name"],
                "parameters": "49B",
                "maxContextLength": "4096 tokens",
                "capabilities": [
                    "Long-form content generation",
                    "Detailed reasoning and analysis",
                    "SEO-optimized writing",
                    "Image integration and captioning",
                    "Multi-section blog structuring",
                    "Brand voice adaptation"
                ],
                "performance": {
                    "responseTime": "Fast",
                    "contentQuality": "High",
                    "consistency": "Excellent",
                    "creativity": "Balanced"
                }
            }
        }
    }

@router.get("/blog/list")
async def list_blogs():
    try:
        blogs = await db_list_blogs()
        return {"success": True, "blogs": blogs}
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.get("/blog/{blog_id}")
async def get_blog_by_id(blog_id: str = Path(..., description="MongoDB ObjectId of the blog")):
    try:
        blog = await get_blog(blog_id)
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        return {"success": True, "blog": blog}
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid blog ID")
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.put("/blog/{blog_id}")
async def update_blog_by_id(blog_id: str, update: dict):
    try:
        updated = await update_blog(blog_id, update)
        if not updated:
            raise HTTPException(status_code=404, detail="Blog not found or not updated")
        return {"success": True}
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid blog ID")
    except Exception as e:
        return {"success": False, "error": str(e)}

@router.delete("/blog/{blog_id}")
async def delete_blog_by_id(blog_id: str):
    try:
        deleted = await delete_blog(blog_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Blog not found or not deleted")
        return {"success": True}
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid blog ID")
    except Exception as e:
        return {"success": False, "error": str(e)} 