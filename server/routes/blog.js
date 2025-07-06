const express = require('express');
const router = express.Router();
const axios = require('axios');

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
    const {
      topic,
      restaurantName,
      restaurantType,
      cuisine,
      location,
      targetAudience,
      tone,
      length,
      keyPoints,
      specialFeatures,
      images
    } = req.body;

    // Validate required fields
    if (!topic || !restaurantName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: topic and restaurantName are required'
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
      default:
        targetWordCount = '600-800';
    }

    // Create comprehensive prompt for blog generation with image integration
    let imageInstructions = '';
    if (imageAnalysis) {
      imageInstructions = `

IMAGE INTEGRATION:
- Total Images: ${imageAnalysis.totalImages}
- Image Details: ${imageAnalysis.imageDetails.map(img => `${img.name} (${img.suggestedPlacement})`).join(', ')}
- Integration Suggestions: ${imageAnalysis.integrationSuggestions.join('; ')}

When writing the blog post, naturally incorporate mentions of these images in appropriate sections. Include suggested captions and placement hints in your content.`;
    }

    const prompt = `Create a professional, engaging blog post for a restaurant business with the following specifications:

RESTAURANT DETAILS:
- Name: ${restaurantName}
- Type: ${restaurantType}
- Cuisine: ${cuisine || 'Various'}
- Location: ${location || 'Not specified'}

BLOG SPECIFICATIONS:
- Topic: ${topic}
- Target Audience: ${targetAudience}
- Writing Tone: ${tone}
- Target Length: ${targetWordCount} words

ADDITIONAL INFORMATION:
${keyPoints ? `- Key Points to Include: ${keyPoints}` : ''}
${specialFeatures ? `- Special Features: ${specialFeatures}` : ''}${imageInstructions}

CONTENT REQUIREMENTS:
Write a compelling, well-structured blog post that follows the established blog content structure guidelines. IMPORTANT: Use clean, simple formatting without any markdown artifacts or unnecessary symbols.

REFERENCE: Follow the Blog Content Structure Guidelines for consistent formatting and professional appearance.

BLOG CONTENT STRUCTURE REFERENCE:
- **H1**: Main blog title with strategic emojis (# Title ✨)
- **H2**: Major sections with relevant emojis (## Section 🌟)
- **H3**: Subsections with descriptive emojis (### Subsection 💡)
- **H4**: Detailed points when needed (#### Detail ⭐)
- **Lists**: Use • for bullets, 1. 2. 3. for numbered lists
- **Highlighting**: Use ✨ 💡 🎯 ⭐ 🔥 💎 for key points
- **Bold Text**: Use **text** for emphasis with highlighting
- **Clean Formatting**: No markdown artifacts or excessive symbols

1. **H1 - Main Title** (Use # for the main blog title)
   - Create a compelling, SEO-optimized main title
   - Add 1-2 relevant emojis to make it eye-catching
   - Make it engaging and relevant to the topic
   - Use clean formatting: # Title with Emoji

2. **H2 - Major Sections** (Use ## for major content sections)
   - Introduction/Overview
   - Main Content Sections (2-4 major sections)
   - Conclusion/Call-to-Action
   - Each H2 should represent a major topic or theme
   - Add 1 relevant emoji to each H2 heading
   - Use clean formatting: ## Section Title with Emoji

3. **H3 - Subsections** (Use ### for subsections within major sections)
   - Break down major sections into digestible subsections
   - Use descriptive, keyword-rich headings
   - Each H3 should focus on a specific aspect or point
   - Add 1 relevant emoji to each H3 heading
   - Use clean formatting: ### Subsection Title with Emoji

4. **H4 - Detailed Points** (Use #### for detailed explanations when needed)
   - Use sparingly for very specific details or lists
   - Help organize complex information
   - Add 1 relevant emoji to each H4 heading

5. **Content Structure Guidelines:**
   - Start with an engaging introduction (2-3 paragraphs)
   - Use clear, descriptive headings that guide the reader
   - Break content into logical sections with proper hierarchy
   - Include relevant examples, tips, or insights in each section
   - End with a compelling conclusion and call-to-action

6. **Emoji and Symbol Guidelines:**
   - Use emojis strategically in headings (1 per heading)
   - Add emojis to bullet points and lists for visual appeal
   - Use food-related emojis (🍽️ 🍕 🍔 🍜 🍣 🍰 ☕ 🍷 🍺)
   - Use atmosphere emojis (✨ 🌟 💫 ⭐ 🎉 🎊 🎈)
   - Use service emojis (👨‍🍳 👩‍🍳 🛎️ 💁‍♂️ 💁‍♀️)
   - Use location emojis (📍 🏙️ 🌆 🏘️)
   - Use quality emojis (⭐ 🌟 💎 👑 🏆)
   - Use emotion emojis (😋 😍 🤤 😊 😌)
   - Use action emojis (🚀 💪 🎯 🔥)
   - Use highlighting emojis for important points (✨ 💡 🎯 ⭐ 🔥 💎)
   - Use symbols like → • ✨ 💡 🎉 for emphasis
   - Don't overuse - keep it tasteful and professional

7. **Formatting Requirements:**
   - Use proper markdown heading syntax (# ## ### ####)
   - Keep paragraphs short (3-4 sentences maximum)
   - Use bullet points and numbered lists with emojis
   - Include bold text sparingly for emphasis
   - Maintain consistent formatting throughout
   - Add emojis to key phrases and important points
   - AVOID unnecessary markdown artifacts like code blocks, links, or excessive formatting
   - Use clean, simple formatting without decorative symbols
   - Focus on readability and professional appearance

8. **SEO and Engagement:**
   - Include relevant keywords naturally in headings and content
   - Use conversational language that connects with the target audience
   - Maintain consistent tone throughout
   - Create scannable content with clear headings
   - Use emojis to highlight key benefits and features

9. **Restaurant Integration:**
   - Naturally mention the restaurant name and offerings
   - Include location and cuisine details where relevant
   - Highlight special features and key points
   - Make content specific to the restaurant's unique qualities
   - Use food and dining emojis to enhance descriptions${imageAnalysis ? `

10. **Image Integration**
    - Naturally reference images in the content
    - Include descriptive captions for images
    - Suggest optimal placement for visual impact
    - Use images to enhance the storytelling
    - Add camera emojis (📸 📷) when mentioning images` : ''}

HIERARCHICAL STRUCTURE EXAMPLE:
# 🍽️ Main Blog Title ✨

## 🌟 Introduction
### 🎯 Setting the Scene
### 📋 What to Expect

## 🍕 Main Content Section 1
### ⭐ Key Point 1
### 💎 Key Point 2

## 🍷 Main Content Section 2
### 🔥 Important Aspect 1
### 🎊 Important Aspect 2

## 🎉 Conclusion
### 📝 Summary
### 🚀 Call-to-Action

EMOJI USAGE EXAMPLES:
- Food & Dining: 🍽️ 🍕 🍔 🍜 🍣 🍰 ☕ 🍷 🍺 🥗 🥩 🍤
- Quality & Excellence: ⭐ 🌟 💎 👑 🏆 💫 ✨
- Service & Experience: 👨‍🍳 👩‍🍳 🛎️ 💁‍♂️ 💁‍♀️ 🤝
- Atmosphere & Location: 📍 🏙️ 🌆 🏘️ 🌟 ✨
- Emotions & Reactions: 😋 😍 🤤 😊 😌 🎉 🎊
- Actions & Benefits: 🚀 💪 🎯 🔥 💡
- Key Points & Highlights: ✨ 💡 🎯 ⭐ 🔥 💎 (Use these to highlight important information)

FORMATTING GUIDELINES (Follow Blog Content Structure):
- Use emojis tastefully and strategically
- Don't overuse - maintain professional appearance
- Use food-related emojis for menu items and dishes
- Use quality emojis for highlighting benefits
- Use service emojis for staff and experience mentions
- Use location emojis for place references
- Use emotion emojis sparingly for engagement
- Use action emojis for calls-to-action and benefits
- Use highlighting emojis (✨ 💡 🎯 ⭐ 🔥 💎) for important key points and sentences
- Keep sentences clear and concise
- Use active voice when possible
- Maintain consistent formatting throughout
- Follow proper heading hierarchy (H1 > H2 > H3 > H4)
- Use • for bullet points and 1. 2. 3. for numbered lists
- Apply **bold text** with highlighting for emphasis
- Ensure clean, professional appearance without artifacts

Please generate the complete blog post content following the established Blog Content Structure Guidelines. Ensure proper hierarchical formatting, strategic emoji usage, clear headings, and engaging structure. Focus on creating valuable content that readers will find informative, visually appealing, and enjoyable to read while maintaining the professional formatting standards.`;

    // Generate blog post using the selected model
    try {
      const response = await axios.post(model.baseURL, {
        model: model.name,
        messages: [
          {
            role: 'system',
            content: `You are a professional content writer specializing in restaurant blog creation. Create engaging, SEO-friendly blog posts that help restaurants connect with their audience. 

IMPORTANT: Follow the established Blog Content Structure Guidelines for consistent formatting:
- Use proper heading hierarchy (H1 > H2 > H3 > H4)
- Apply strategic emoji usage for engagement
- Maintain clean, professional formatting
- Include highlighting for key points (✨ 💡 🎯 ⭐ 🔥 💎)
- Use proper list formatting (• for bullets, 1. 2. 3. for numbered)
- Focus on readability and professional appearance
- Avoid markdown artifacts and excessive symbols

${imageAnalysis ? 'You excel at naturally integrating images into blog content with appropriate captions and placement suggestions.' : ''}`
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
          restaurantName,
          restaurantType,
          cuisine,
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

module.exports = router; 