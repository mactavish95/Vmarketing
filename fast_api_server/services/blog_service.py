import os
import httpx
from typing import List, Dict, Any, Optional
from datetime import datetime

# Model selection logic
LLM_MODELS = {
    "blog_generation": {
        "name": "nvidia/llama-3.3-nemotron-super-49b-v1",
        "base_url": "https://integrate.api.nvidia.com/v1/chat/completions",
        "temperature": 0.6,
        "max_tokens": 4096,
        "top_p": 0.95,
        "frequency_penalty": 0,
        "presence_penalty": 0,
        "strengths": ["content_creation", "seo_optimization", "brand_voice", "engagement", "detailed_thinking"],
        "description": "Optimized for creating engaging, SEO-friendly blog content with detailed thinking"
    }
}

def select_model(use_case: str = "blog_generation") -> Dict[str, Any]:
    return LLM_MODELS.get(use_case, LLM_MODELS["blog_generation"])

# Image analysis helpers (simple, as in Express)
def get_suggested_placement(index: int, total: int) -> str:
    if total == 1 or index == 0:
        return "hero-image"
    elif index == 1:
        return "after-introduction"
    elif index == 2:
        return "mid-content"
    else:
        return "gallery-section"

def generate_suggested_caption(name: str, index: int) -> str:
    base = name.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title()
    captions = [
        f"Featured image: {base}",
        f"Behind the scenes: {base}",
        f"Our signature dish: {base}",
        f"Experience the atmosphere: {base}",
        f"Discover our {base}",
        f"A taste of excellence: {base}"
    ]
    return captions[index % len(captions)]

def generate_integration_suggestions(image_analysis: List[Dict[str, Any]]) -> List[str]:
    if len(image_analysis) == 1:
        return ["Use this image as the main hero image for your blog post"]
    elif len(image_analysis) <= 3:
        return [
            "Distribute images throughout the content to maintain reader engagement",
            "Use the first image as a hero image and others to illustrate key points"
        ]
    else:
        return [
            "Create a dedicated gallery section for multiple images",
            "Use images strategically to break up text and maintain visual interest"
        ]

def process_images(images: Optional[List[Dict[str, Any]]]) -> Optional[Dict[str, Any]]:
    if not images:
        return None
    image_analysis = []
    for idx, img in enumerate(images):
        image_analysis.append({
            "id": idx + 1,
            "name": img["name"],
            "type": img["type"],
            "size": img["size"],
            "description": f"Image {idx+1}: {img['name']}",
            "suggestedPlacement": get_suggested_placement(idx, len(images)),
            "suggestedCaption": generate_suggested_caption(img["name"], idx)
        })
    return {
        "totalImages": len(images),
        "imageDetails": image_analysis,
        "integrationSuggestions": generate_integration_suggestions(image_analysis)
    }

async def generate_blog_post(data: Dict[str, Any]) -> Dict[str, Any]:
    api_key = os.getenv("NVIDIA_API_KEY")
    if not api_key:
        return {"success": False, "error": "NVIDIA API key not configured on server", "code": "API_KEY_NOT_CONFIGURED"}

    # Prepare fields
    topic = data.get("topic")
    main_name = data.get("mainName") or data.get("restaurantName")
    type_ = data.get("type") or data.get("restaurantType")
    industry = data.get("industry") or data.get("cuisine")
    location = data.get("location")
    target_audience = data.get("targetAudience")
    tone = data.get("tone")
    length = data.get("length")
    key_points = data.get("keyPoints")
    special_features = data.get("specialFeatures")
    images = data.get("images")

    if not topic or not main_name:
        return {"success": False, "error": "Missing required fields: topic and mainName are required"}

    # Process images
    image_analysis = process_images(images)

    # Model selection
    model = select_model("blog_generation")

    # Word count
    if length == "short":
        target_word_count = "300-500"
    elif length == "long":
        target_word_count = "900-1200"
    elif length == "extra_long":
        target_word_count = "1500-3000"
    else:
        target_word_count = "600-800"

    # Image instructions
    image_instructions = ""
    if image_analysis:
        details = ', '.join(f"{img['name']} ({img['suggestedPlacement']})" for img in image_analysis["imageDetails"])
        suggestions = '; '.join(image_analysis["integrationSuggestions"])
        image_instructions = f"\n\nIMAGE INTEGRATION:\n- Total Images: {image_analysis['totalImages']}\n- Image Details: {details}\n- Integration Suggestions: {suggestions}\n\nWhen writing the blog post, naturally incorporate mentions of these images in appropriate sections. Include suggested captions and placement hints in your content."

    # Prompt
    prompt = f"Create a professional, engaging blog post for a business, project, event, product, organization, or topic with the following specifications:\n\nDETAILS:\n- Name: {main_name}\n- Type/Category: {type_ or 'Not specified'}\n- Industry/Field: {industry or 'Not specified'}\n- Location: {location or 'Not specified'}\n\nBLOG SPECIFICATIONS:\n- Topic: {topic}\n- Target Audience: {target_audience}\n- Writing Tone: {tone}\n- Target Length: {target_word_count} words\n\nADDITIONAL INFORMATION:\n"
    if key_points:
        prompt += f"- Key Points to Include: {key_points}\n"
    if special_features:
        prompt += f"- Special Features: {special_features}\n"
    prompt += image_instructions
    prompt += "\n\nCONTENT REQUIREMENTS:\nWrite a compelling, well-structured blog post that follows the established blog content structure guidelines. IMPORTANT: Use clean, simple formatting without any markdown artifacts or unnecessary symbols.\n\nREFERENCE: Follow the Blog Content Structure Guidelines for consistent formatting and professional appearance.\n\nBLOG CONTENT STRUCTURE REFERENCE:\n- **H1**: Main blog title with strategic emojis (# Title ✨)\n- **H2**: Major sections with relevant emojis (## Section 🌟)\n- **H3**: Subsections with descriptive emojis (### Subsection 💡)\n- **H4**: Detailed points when needed (#### Detail ⭐)\n- **Lists**: Use • for bullets, 1. 2. 3. for numbered lists\n- **Highlighting**: Use ✨ 💡 🎯 ⭐ 🔥 💎 for key points\n- **Bold Text**: Use **text** for emphasis with highlighting\n- **Clean Formatting**: No markdown artifacts or excessive symbols\n\n(Full structure guidelines omitted for brevity)\n\nPlease generate the complete blog post content following the established Blog Content Structure Guidelines. Ensure proper hierarchical formatting, strategic emoji usage, clear headings, and engaging structure. Focus on creating valuable content that readers will find informative, visually appealing, and enjoyable to read while maintaining the professional formatting standards."

    # LLM API call
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                model["base_url"],
                json={
                    "model": model["name"],
                    "messages": [
                        {
                            "role": "system",
                            "content": "You are a professional content writer specializing in blog creation for any business, project, event, or topic. Create engaging, SEO-friendly blog posts that help organizations connect with their audience. \n\nIMPORTANT: Follow the established Blog Content Structure Guidelines for consistent formatting:\n- Use proper heading hierarchy (H1 > H2 > H3 > H4)\n- Apply strategic emoji usage for engagement\n- Maintain clean, professional formatting\n- Include highlighting for key points (✨ 💡 🎯 ⭐ 🔥 💎)\n- Use proper list formatting (• for bullets, 1. 2. 3. for numbered)\n- Focus on readability and professional appearance\n- Avoid markdown artifacts and excessive symbols\n\n" + ("You excel at naturally integrating images into blog content with appropriate captions and placement suggestions." if image_analysis else "")
                        },
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": model["temperature"],
                    "max_tokens": model["max_tokens"],
                    "top_p": model["top_p"],
                    "frequency_penalty": model["frequency_penalty"],
                    "presence_penalty": model["presence_penalty"],
                    "stream": False
                },
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                }
            )
        resp.raise_for_status()
        data = resp.json()
        blog_content = data["choices"][0]["message"]["content"]
        return {
            "success": True,
            "blogPost": blog_content,
            "wordCount": len(blog_content.split()),
            "model": model["name"],
            "imageAnalysis": image_analysis,
            "metadata": {
                "topic": topic,
                "mainName": main_name,
                "type": type_,
                "industry": industry,
                "location": location,
                "targetAudience": target_audience,
                "tone": tone,
                "length": length,
                "imageCount": len(images) if images else 0,
                "generatedAt": datetime.utcnow().isoformat() + "Z"
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)} 