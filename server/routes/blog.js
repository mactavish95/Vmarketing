const express = require('express');
const router = express.Router();
const axios = require('axios');
const { BlogPost, isMongoDBAvailable, safeSave } = require('../config/database');

// Import the selectModel function with updated model configuration
function selectModel(useCase) {
  const LLM_MODELS = {
    reviewGenerator: {
      name: 'nvidia/llama-3.3-nemotron-super-49b-v1',
      baseURL: 'https://integrate.api.nvidia.com/v1/chat/completions',
      temperature: 0.9,
      maxTokens: 1000,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      strengths: ['creative_writing', 'engagement', 'authenticity'],
      description: 'Optimized for creative, engaging review generation'
    },
    customerService: {
      name: 'nvidia/llama-3.3-nemotron-super-49b-v1',
      baseURL: 'https://integrate.api.nvidia.com/v1/chat/completions',
      temperature: 0.7,
      maxTokens: 800,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      strengths: ['empathy', 'professional', 'problem_solving'],
      description: 'Optimized for empathetic customer service responses'
    },
    voiceAnalysis: {
      name: 'nvidia/llama-3.3-nemotron-super-49b-v1',
      baseURL: 'https://integrate.api.nvidia.com/v1/chat/completions',
      temperature: 0.3,
      maxTokens: 2048,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      strengths: ['analysis', 'detail', 'accuracy'],
      description: 'Optimized for detailed voice analysis'
    },
    blogGenerator: {
      name: 'nvidia/llama-3.3-nemotron-super-49b-v1',
      baseURL: 'https://integrate.api.nvidia.com/v1/chat/completions',
      temperature: 0.6,
      maxTokens: 4096,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      strengths: ['content_creation', 'seo_optimization', 'brand_voice', 'engagement', 'detailed_thinking'],
      description: 'Optimized for creating engaging, SEO-friendly blog content with detailed thinking'
    }
  };

  switch (useCase) {
    case 'review_generation':
      return LLM_MODELS.reviewGenerator;
    case 'customer_service':
      return LLM_MODELS.customerService;
    case 'voice_analysis':
      return LLM_MODELS.voiceAnalysis;
    case 'blog_generation':
      return LLM_MODELS.blogGenerator;
    default:
      return LLM_MODELS.reviewGenerator;
  }
}

// Helper function to process and analyze images
async function processImages(images, apiKey) {
  if (!images || images.length === 0) {
    return null;
  }

  try {
    // For now, we'll create a simple image analysis
    // In a production environment, you might want to use a dedicated image analysis API
    const imageAnalysis = images.map((image, index) => {
      return {
        id: index + 1,
        name: image.name,
        type: image.type,
        size: image.size,
        description: `Image ${index + 1}: ${image.name}`,
        suggestedPlacement: getSuggestedPlacement(index, images.length),
        suggestedCaption: generateSuggestedCaption(image.name, index)
      };
    });

    return {
      totalImages: images.length,
      imageDetails: imageAnalysis,
      integrationSuggestions: generateIntegrationSuggestions(imageAnalysis)
    };
  } catch (error) {
    console.error('Image processing error:', error);
    return null;
  }
}

// Helper function to suggest image placement
function getSuggestedPlacement(index, totalImages) {
  if (totalImages === 1) {
    return 'hero-image';
  } else if (index === 0) {
    return 'hero-image';
  } else if (index === 1) {
    return 'after-introduction';
  } else if (index === 2) {
    return 'mid-content';
  } else {
    return 'gallery-section';
  }
}

// Helper function to generate suggested captions
function generateSuggestedCaption(imageName, index) {
  const baseName = imageName.replace(/\.[^/.]+$/, ''); // Remove file extension
  const cleanName = baseName.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const captions = [
    `Featured image: ${cleanName}`,
    `Behind the scenes: ${cleanName}`,
    `Our signature dish: ${cleanName}`,
    `Experience the atmosphere: ${cleanName}`,
    `Discover our ${cleanName}`,
    `A taste of excellence: ${cleanName}`
  ];
  
  return captions[index % captions.length];
}

// Helper function to generate integration suggestions
function generateIntegrationSuggestions(imageAnalysis) {
  const suggestions = [];
  
  if (imageAnalysis.length === 1) {
    suggestions.push('Use this image as the main hero image for your blog post');
  } else if (imageAnalysis.length <= 3) {
    suggestions.push('Distribute images throughout the content to maintain reader engagement');
    suggestions.push('Use the first image as a hero image and others to illustrate key points');
  } else {
    suggestions.push('Create a dedicated gallery section for multiple images');
    suggestions.push('Use images strategically to break up text and maintain visual interest');
  }
  
  return suggestions;
}

// Enhanced blog post generation endpoint with image support
router.post('/blog/generate', async (req, res) => {
  try {
    // Accept both new and old field names for backward compatibility
    const {
      topic,
      mainName, // new
      type,     // new
      industry, // new
      location,
      targetAudience,
      tone,
      length,
      keyPoints,
      specialFeatures,
      images,
      // legacy fields for fallback
      restaurantName,
      restaurantType,
      cuisine
    } = req.body;

    // Use new fields if present, otherwise fallback to old
    const resolvedMainName = mainName || restaurantName;
    const resolvedType = type || restaurantType;
    const resolvedIndustry = industry || cuisine;

    // Validate required fields
    if (!topic || !resolvedMainName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: topic and mainName are required'
      });
    }

    // Use API key from environment variables (more secure)
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'NVIDIA API key not configured on server',
        code: 'API_KEY_NOT_CONFIGURED'
      });
    }

    // Process images if provided
    let imageAnalysis = null;
    if (images && images.length > 0) {
      console.log(`📸 Processing ${images.length} images for blog post`);
      imageAnalysis = await processImages(images, apiKey);
    }

    // Select appropriate model for blog generation
    const model = selectModel('blog_generation');
    
    // Determine word count based on length preference
    let targetWordCount;
    switch (length) {
      case 'short':
        targetWordCount = '300-500';
        break;
      case 'long':
        targetWordCount = '900-1200';
        break;
      case 'extra_long':
        targetWordCount = '1500-3000';
        break;
      default:
        targetWordCount = '600-800';
    }

    // Create comprehensive prompt for blog generation with image integration
    let imageInstructions = '';
    if (imageAnalysis) {
      imageInstructions = `\n\nIMAGE INTEGRATION:\n- Total Images: ${imageAnalysis.totalImages}\n- Image Details: ${imageAnalysis.imageDetails.map(img => `${img.name} (${img.suggestedPlacement})`).join(', ')}\n- Integration Suggestions: ${imageAnalysis.integrationSuggestions.join('; ')}\n\nWhen writing the blog post, naturally incorporate mentions of these images in appropriate sections. Include suggested captions and placement hints in your content.`;
    }

    // Enhanced prompt that better utilizes key points and special features
    const prompt = `Create a professional, engaging blog post for a business, project, event, product, organization, or topic with the following specifications:\n\nDETAILS:\n- Name: ${resolvedMainName}\n- Type/Category: ${resolvedType || 'Not specified'}\n- Industry/Field: ${resolvedIndustry || 'Not specified'}\n- Location: ${location || 'Not specified'}\n\nBLOG SPECIFICATIONS:\n- Topic: ${topic}\n- Target Audience: ${targetAudience}\n- Writing Tone: ${tone}\n- Target Length: ${targetWordCount} words\n\nCORE CONTENT FRAMEWORK:\n${keyPoints ? `KEY POINTS TO INCLUDE (Structure your blog around these main points):\n${keyPoints}\n\n` : ''}${specialFeatures ? `SPECIAL FEATURES & HIGHLIGHTS (Weave these unique details throughout your content):\n${specialFeatures}\n\n` : ''}${imageInstructions}\n\nCONTENT REQUIREMENTS:\nWrite a compelling, well-structured blog post that follows the established blog content structure guidelines. IMPORTANT: Use clean, simple formatting without any markdown artifacts or unnecessary symbols.\n\nCONTENT STRATEGY:\n1. **Use Key Points as Section Headers**: Transform each key point into a major section (H2) of your blog\n2. **Integrate Special Features**: Naturally weave special features into relevant sections to support your key points\n3. **Create Logical Flow**: Organize content so each section builds upon the previous one\n4. **Balance Information**: Mix factual details with engaging storytelling\n5. **Include Calls-to-Action**: End with clear next steps for readers\n\nREFERENCE: Follow the Blog Content Structure Guidelines for consistent formatting and professional appearance.\n\nBLOG CONTENT STRUCTURE REFERENCE:\n- **H1**: Main blog title with strategic emojis (# Title ✨)\n- **H2**: Major sections based on key points with relevant emojis (## Key Point 🌟)\n- **H3**: Subsections with descriptive emojis (### Subsection 💡)\n- **H4**: Detailed points when needed (#### Detail ⭐)\n- **Lists**: Use • for bullets, 1. 2. 3. for numbered lists\n- **Highlighting**: Use ✨ 💡 🎯 ⭐ 🔥 💎 for key points\n- **Bold Text**: Use **text** for emphasis with highlighting\n- **Clean Formatting**: No markdown artifacts or excessive symbols\n\nPlease generate the complete blog post content following the established Blog Content Structure Guidelines. Ensure proper hierarchical formatting, strategic emoji usage, clear headings, and engaging structure. Focus on creating valuable content that readers will find informative, visually appealing, and enjoyable to read while maintaining the professional formatting standards.`;

    // Generate blog post using the selected model
    try {
      const response = await axios.post(model.baseURL, {
        model: model.name,
        messages: [
          {
            role: 'system',
            content: `You are a professional content writer specializing in blog creation for any business, project, event, or topic. Create engaging, SEO-friendly blog posts that help organizations connect with their audience. \n\nIMPORTANT: Follow the established Blog Content Structure Guidelines for consistent formatting:\n- Use proper heading hierarchy (H1 > H2 > H3 > H4)\n- Apply strategic emoji usage for engagement\n- Maintain clean, professional formatting\n- Include highlighting for key points (✨ 💡 🎯 ⭐ 🔥 💎)\n- Use proper list formatting (• for bullets, 1. 2. 3. for numbered)\n- Focus on readability and professional appearance\n- Avoid markdown artifacts and excessive symbols\n\nCONTENT STRATEGY:\n- Use provided key points as the main structure for your blog sections\n- Integrate special features naturally throughout the content to support key points\n- Create a logical flow that builds from introduction to conclusion\n- Balance factual information with engaging storytelling\n- Include clear calls-to-action for readers\n\n${imageAnalysis ? 'You excel at naturally integrating images into blog content with appropriate captions and placement suggestions.' : ''}`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: model.temperature,
        max_tokens: model.maxTokens,
        top_p: model.top_p,
        frequency_penalty: model.frequency_penalty,
        presence_penalty: model.presence_penalty,
        stream: false
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      const blogContent = response.data.choices[0].message.content;
      
      res.json({
        success: true,
        blogPost: blogContent,
        wordCount: blogContent.split(/\s+/).length,
        model: model.name,
        imageAnalysis: imageAnalysis,
        metadata: {
          topic,
          mainName: resolvedMainName,
          type: resolvedType,
          industry: resolvedIndustry,
          location,
          targetAudience,
          tone,
          length,
          imageCount: images ? images.length : 0,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (apiError) {
      console.error('API Error:', apiError.response?.data || apiError.message);
      res.status(500).json({
        success: false,
        error: 'Failed to generate blog post. Please check your API key and try again.'
      });
    }

  } catch (error) {
    console.error('Blog generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during blog generation'
    });
  }
});

// Save a generated blog post to the database
router.post('/blog/save', async (req, res) => {
  try {
    if (!isMongoDBAvailable()) {
      return res.status(503).json({
        success: false,
        error: 'Database not available',
        code: 'DB_UNAVAILABLE'
      });
    }
    // Accept both new and old field names for backward compatibility
    const {
      topic,
      mainName, // new
      type,     // new
      industry, // new
      location,
      targetAudience,
      tone,
      length,
      keyPoints,
      specialFeatures,
      blogPost,
      images,
      imageAnalysis,
      model,
      wordCount,
      metadata,
      // legacy fields for fallback
      restaurantName,
      restaurantType,
      cuisine
    } = req.body;

    // Use new fields if present, otherwise fallback to old
    const resolvedMainName = mainName || restaurantName;
    const resolvedType = type || restaurantType;
    const resolvedIndustry = industry || cuisine;

    if (!topic || !resolvedMainName || !blogPost) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: topic, mainName, and blogPost are required.'
      });
    }

    const newBlog = await safeSave(BlogPost, {
      topic,
      mainName: resolvedMainName,
      type: resolvedType,
      industry: resolvedIndustry,
      location,
      targetAudience,
      tone,
      length,
      keyPoints,
      specialFeatures,
      blogPost,
      images,
      imageAnalysis,
      model,
      wordCount,
      metadata
    });

    if (newBlog) {
      res.json({ success: true, blog: newBlog });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to save blog post to database',
        code: 'SAVE_ERROR'
      });
    }
  } catch (error) {
    console.error('Blog post save error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save blog post',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Image processing endpoint (for future use with dedicated image analysis APIs)
router.post('/blog/process-images', async (req, res) => {
  try {
    const { images } = req.body;

    if (!images || !Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        error: 'Images array is required'
      });
    }

    // Use API key from environment variables (more secure)
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'NVIDIA API key not configured on server',
        code: 'API_KEY_NOT_CONFIGURED'
      });
    }

    console.log(`📸 Processing ${images.length} images for analysis`);

    const imageAnalysis = await processImages(images, apiKey);

    res.json({
      success: true,
      imageAnalysis,
      processedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during image processing'
    });
  }
});

// Get blog generation model info
router.get('/blog/model', (req, res) => {
  try {
    const model = selectModel('blog_generation');
    res.json({
      success: true,
      model: {
        name: model.name,
        description: model.description,
        useCase: 'blog_generation',
        strengths: model.strengths || ['Content Creation', 'SEO Optimization', 'Brand Voice', 'Engagement', 'Detailed Thinking'],
        imageSupport: true,
        maxImages: 10,
        supportedFormats: ['JPEG', 'PNG', 'GIF', 'WebP'],
        parameters: {
          temperature: model.temperature,
          maxTokens: model.maxTokens,
          topP: model.top_p,
          frequencyPenalty: model.frequency_penalty,
          presencePenalty: model.presence_penalty
        },
        modelInfo: {
          provider: 'NVIDIA',
          modelType: 'nvidia/llama-3.3-nemotron-super-49b-v1',
          parameters: '49B',
          maxContextLength: '4096 tokens',
          capabilities: [
            'Long-form content generation',
            'Detailed reasoning and analysis',
            'SEO-optimized writing',
            'Image integration and captioning',
            'Multi-section blog structuring',
            'Brand voice adaptation'
          ],
          performance: {
            responseTime: 'Fast',
            contentQuality: 'High',
            consistency: 'Excellent',
            creativity: 'Balanced'
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get blog model information'
    });
  }
});

// List all saved blog posts
router.get('/blog/list', async (req, res) => {
  try {
    if (!isMongoDBAvailable()) {
      return res.status(503).json({
        success: false,
        error: 'Database not available',
        code: 'DB_UNAVAILABLE'
      });
    }
    const blogs = await BlogPost.find().sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    console.error('Blog post list error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve blog posts',
      code: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router; 