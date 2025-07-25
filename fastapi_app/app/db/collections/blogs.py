from app.db.database import db
from typing import Dict, Any, List, Optional
from bson import ObjectId

async def insert_blog(blog: Dict[str, Any]) -> str:
    result = await db.blogs.insert_one(blog)
    return str(result.inserted_id)

async def list_blogs() -> List[Dict[str, Any]]:
    blogs = await db.blogs.find().sort("createdAt", -1).to_list(100)
    for blog in blogs:
        blog["_id"] = str(blog["_id"])
    return blogs

async def get_blog(blog_id: str) -> Optional[Dict[str, Any]]:
    blog = await db.blogs.find_one({"_id": ObjectId(blog_id)})
    if blog:
        blog["_id"] = str(blog["_id"])
    return blog

async def update_blog(blog_id: str, update: Dict[str, Any]) -> bool:
    result = await db.blogs.update_one({"_id": ObjectId(blog_id)}, {"$set": update})
    return result.modified_count > 0

async def delete_blog(blog_id: str) -> bool:
    result = await db.blogs.delete_one({"_id": ObjectId(blog_id)})
    return result.deleted_count > 0 