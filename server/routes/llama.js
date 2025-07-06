const express = require('express');
const router = express.Router();
const axios = require('axios');
const llamaService = require('../services/llamaService');
const { Review, mongoose } = require('../config/database');

// Import the selectModel function
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
    },
    socialMedia: {
      name: 'nvidia/llama-3.3-nemotron-super-49b-v1',
      baseURL: 'https://integrate.api.nvidia.com/v1/chat/completions',
      temperature: 0.7,
      maxTokens: 1500,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      strengths: ['engagement', 'viral_potential', 'platform_optimization', 'trending_content'],
      description: 'Optimized for creating engaging social media content with viral potential'
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
    case 'social_media':
      return LLM_MODELS.socialMedia;
    default:
      return LLM_MODELS.reviewGenerator;
  }
}

// Main Llama API endpoint
router.post('/llama', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Text input is required'
      });
    }

    if (text.length > 4000) {
      return res.status(400).json({
        success: false,
        error: 'Text input is too long (max 4000 characters)'
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

    const model = selectModel('review_generation');

    const response = await axios.post(model.baseURL, {
      model: model.name,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant that provides engaging, well-structured responses. Focus on being helpful, accurate, and engaging in your responses.'
        },
        {
          role: 'user',
          content: text
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

    const aiResponse = response.data.choices[0].message.content;

    res.json({
      success: true,
      response: aiResponse,
      usage: response.data.usage,
      model: model.name,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Llama API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      res.status(401).json({
        success: false,
        error: 'Invalid API key',
        code: 'INVALID_API_KEY'
      });
    } else if (error.response?.status === 429) {
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to generate response',
        code: 'API_ERROR'
      });
    }
  }
});

// Response quality analysis endpoint
router.post('/analyze-response-quality', async (req, res) => {
  try {
    const { response, contentType = 'general', context = {} } = req.body;

    if (!response || response.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Response text is required'
      });
    }

    // Use API key from environment variables
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'NVIDIA API key not configured on server',
        code: 'API_KEY_NOT_CONFIGURED'
      });
    }

    const model = selectModel('voice_analysis'); // Use analysis model for quality assessment

    // Create specialized analysis prompt based on content type
    let analysisPrompt;
    
    if (contentType === 'facebook_post') {
      analysisPrompt = `Analyze the quality of this Facebook post and provide a detailed assessment.

Facebook Post to analyze:
"${response}"

Context: ${JSON.stringify(context)}

Please provide a comprehensive Facebook-specific quality analysis including:

1. Overall Quality Score (0.0 to 1.0)
2. Facebook-Specific Metrics (0.0 to 1.0 each):
   - Hook: How compelling the opening is (first 2-3 lines)
   - Structure: How well-organized with clear sections
   - Engagement: How likely to generate likes, comments, shares
   - Readability: How easy to read on mobile devices
   - Call-to-Action: How clear and compelling the CTA is
   - Tone: How appropriate for Facebook audience
   - Length: How optimal for Facebook algorithm (40-80 words ideal)
   - Hashtags: How relevant and strategic the hashtags are

3. Facebook-Specific Strengths (list 3-5 main strengths)
4. Facebook-Specific Improvement Suggestions (list 3-5 specific suggestions)

Facebook Best Practices to Consider:
- Strong opening hook that grabs attention
- Short, scannable paragraphs
- Clear call-to-action
- Appropriate hashtag usage (3-5 relevant hashtags)
- Mobile-friendly formatting
- Conversational, authentic tone
- Optimal length for engagement (40-80 words)

Format your response as a JSON object with the following structure:
{
  "overallScore": 0.85,
  "metrics": {
    "hook": 0.9,
    "structure": 0.85,
    "engagement": 0.8,
    "readability": 0.9,
    "callToAction": 0.85,
    "tone": 0.8,
    "length": 0.9,
    "hashtags": 0.85
  },
  "strengths": ["Strong opening hook", "Clear call-to-action", "Good mobile formatting"],
  "suggestions": ["Add more specific hashtags", "Include a question to boost engagement", "Consider adding emojis for visual appeal"]
}

Be objective and constructive in your analysis, focusing specifically on Facebook optimization.`;
    } else {
      analysisPrompt = `Analyze the quality of this ${contentType} content and provide a detailed assessment.

Content to analyze:
"${response}"

Context: ${JSON.stringify(context)}

Please provide a comprehensive quality analysis including:

1. Overall Quality Score (0.0 to 1.0)
2. Individual Metrics (0.0 to 1.0 each):
   - Coherence: How well-structured and logical the content is
   - Relevance: How well it addresses the intended purpose
   - Completeness: How comprehensive and thorough the content is
   - Clarity: How clear and easy to understand the content is
   - Engagement: How engaging and interesting the content is
   - Structure: How well-organized the content is
   - Tone: How appropriate the tone is for the context
   - Length: How appropriate the length is for the content type

3. Key Strengths (list 3-5 main strengths)
4. Improvement Suggestions (list 3-5 specific suggestions)

Format your response as a JSON object with the following structure:
{
  "overallScore": 0.85,
  "metrics": {
    "coherence": 0.9,
    "relevance": 0.85,
    "completeness": 0.8,
    "clarity": 0.9,
    "engagement": 0.85,
    "structure": 0.8,
    "tone": 0.9,
    "length": 0.85
  },
  "strengths": ["Clear and concise writing", "Appropriate tone", "Good structure"],
  "suggestions": ["Add more specific examples", "Include a call-to-action", "Consider adding hashtags"]
}

Be objective and constructive in your analysis.`;
    }

    const analysisResponse = await axios.post(model.baseURL, {
      model: model.name,
      messages: [
        {
          role: 'system',
          content: 'You are an expert content quality analyst. Provide objective, detailed assessments of content quality with specific, actionable feedback.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2048,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const analysisText = analysisResponse.data.choices[0].message.content;
    
    // Try to parse the JSON response
    let qualityAnalysis;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        qualityAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.warn('Failed to parse quality analysis JSON:', parseError);
      // Provide a fallback analysis based on content type
      if (contentType === 'facebook_post') {
        qualityAnalysis = {
          overallScore: 0.7,
          metrics: {
            hook: 0.7,
            structure: 0.7,
            engagement: 0.7,
            readability: 0.7,
            callToAction: 0.7,
            tone: 0.7,
            length: 0.7,
            hashtags: 0.7
          },
          strengths: ['Content is readable and understandable'],
          suggestions: ['Add a compelling opening hook', 'Include a clear call-to-action', 'Consider adding relevant hashtags']
        };
      } else {
        qualityAnalysis = {
          overallScore: 0.7,
          metrics: {
            coherence: 0.7,
            relevance: 0.7,
            completeness: 0.7,
            clarity: 0.7,
            engagement: 0.7,
            structure: 0.7,
            tone: 0.7,
            length: 0.7
          },
          strengths: ['Content is readable and understandable'],
          suggestions: ['Consider adding more specific details', 'Review for clarity and engagement']
        };
      }
    }

    res.json({
      success: true,
      qualityAnalysis,
      model: model.name,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Quality Analysis Error:', error.response?.data || error.message);
    
    res.status(500).json({
      success: false,
      error: 'Failed to analyze response quality',
      code: 'ANALYSIS_ERROR'
    });
  }
});

module.exports = router; 