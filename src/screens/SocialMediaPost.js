import React, { useState, useEffect } from 'react';
import apiConfig from '../config/api';
import './SocialMediaPost.css';

const SocialMediaPost = () => {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [postType, setPostType] = useState('general');
  const [tone, setTone] = useState('engaging');
  const [targetAudience, setTargetAudience] = useState('general');
  const [contentStructure, setContentStructure] = useState('story');
  const [engagementGoal, setEngagementGoal] = useState('awareness');
  const [hashtags, setHashtags] = useState('');
  const [enhancedContent, setEnhancedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState('');
  const [qualityAnalysis, setQualityAnalysis] = useState(null);
  const [generationHistory, setGenerationHistory] = useState([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  // New dynamic length adjustment features
  const [contentLength, setContentLength] = useState('optimal');
  const [brandVoiceIntensity, setBrandVoiceIntensity] = useState('moderate');
  const [engagementUrgency, setEngagementUrgency] = useState('normal');
  const [situation, setSituation] = useState('general');
  const [customLength, setCustomLength] = useState(100);

  // New follow-up question suggestions
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');

  // Add state for reviewed content
  const [reviewedContent, setReviewedContent] = useState('');
  const [isReviewing, setIsReviewing] = useState(false);

  // State for modal view
  const [modalPost, setModalPost] = useState(null);

  // New: Global history from backend
  const [globalHistory, setGlobalHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');

  // State for showing original content
  const [showOriginalContent, setShowOriginalContent] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const platforms = [
    { value: 'facebook', label: 'Facebook', icon: '📘', maxLength: 63206, priority: true },
    { value: 'instagram', label: 'Instagram', icon: '📸', maxLength: 2200 },
    { value: 'twitter', label: 'Twitter/X', icon: '🐦', maxLength: 280 },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼', maxLength: 3000 },
    { value: 'tiktok', label: 'TikTok', icon: '🎵', maxLength: 150 },
    { value: 'youtube', label: 'YouTube', icon: '📺', maxLength: 5000 }
  ];

  // Facebook-specific post types
  const postTypes = [
    { value: 'general', label: 'General Post', icon: '📝', description: 'Standard Facebook post' },
    { value: 'story', label: 'Story/Personal', icon: '📖', description: 'Personal story or experience' },
    { value: 'educational', label: 'Educational', icon: '📚', description: 'Informative or how-to content' },
    { value: 'promotional', label: 'Promotional', icon: '🎯', description: 'Product or service promotion' },
    { value: 'community', label: 'Community', icon: '🤝', description: 'Community engagement or events' },
    { value: 'inspirational', label: 'Inspirational', icon: '✨', description: 'Motivational or uplifting content' },
    { value: 'question', label: 'Question/Poll', icon: '❓', description: 'Engaging questions or polls' },
    { value: 'announcement', label: 'Announcement', icon: '📢', description: 'Important announcements or news' }
  ];

  const tones = [
    { value: 'engaging', label: 'Engaging', icon: '🎯', description: 'Interactive and conversation-starting' },
    { value: 'professional', label: 'Professional', icon: '💼', description: 'Formal and business-like' },
    { value: 'casual', label: 'Casual', icon: '😊', description: 'Friendly and relaxed' },
    { value: 'humorous', label: 'Humorous', icon: '😂', description: 'Funny and entertaining' },
    { value: 'inspirational', label: 'Inspirational', icon: '✨', description: 'Motivational and uplifting' },
    { value: 'educational', label: 'Educational', icon: '📚', description: 'Informative and helpful' },
    { value: 'empathetic', label: 'Empathetic', icon: '🤗', description: 'Understanding and supportive' },
    { value: 'authoritative', label: 'Authoritative', icon: '👑', description: 'Confident and expert-like' }
  ];

  const audiences = [
    { value: 'general', label: 'General', icon: '👥', description: 'Broad audience' },
    { value: 'business', label: 'Business', icon: '🏢', description: 'Business professionals' },
    { value: 'youth', label: 'Youth', icon: '👨‍🎓', description: 'Young adults and students' },
    { value: 'parents', label: 'Parents', icon: '👨‍👩‍👧‍👦', description: 'Parents and families' },
    { value: 'professionals', label: 'Professionals', icon: '👔', description: 'Working professionals' },
    { value: 'creatives', label: 'Creatives', icon: '🎨', description: 'Creative professionals' },
    { value: 'seniors', label: 'Seniors', icon: '👴', description: 'Older adults' },
    { value: 'local', label: 'Local Community', icon: '🏘️', description: 'Local community members' }
  ];

  // Facebook-specific content structures
  const contentStructures = [
    { value: 'story', label: 'Story Format', icon: '📖', description: 'Narrative with beginning, middle, end' },
    { value: 'problem-solution', label: 'Problem-Solution', icon: '🔧', description: 'Identify problem, offer solution' },
    { value: 'list', label: 'List Format', icon: '📋', description: 'Numbered or bulleted list' },
    { value: 'question-answer', label: 'Q&A Format', icon: '❓', description: 'Question followed by answer' },
    { value: 'before-after', label: 'Before-After', icon: '🔄', description: 'Compare two states or situations' },
    { value: 'tips', label: 'Tips Format', icon: '💡', description: 'Actionable tips or advice' },
    { value: 'quote', label: 'Quote Format', icon: '💬', description: 'Quote with commentary' },
    { value: 'announcement', label: 'Announcement', icon: '📢', description: 'Clear announcement structure' }
  ];

  const engagementGoals = [
    { value: 'awareness', label: 'Brand Awareness', icon: '👁️', description: 'Increase visibility' },
    { value: 'engagement', label: 'Engagement', icon: '💬', description: 'Likes, comments, shares' },
    { value: 'conversation', label: 'Conversation', icon: '🗣️', description: 'Start discussions' },
    { value: 'education', label: 'Education', icon: '📚', description: 'Inform and teach' },
    { value: 'conversion', label: 'Conversion', icon: '🎯', description: 'Drive actions' },
    { value: 'community', label: 'Community Building', icon: '🤝', description: 'Build relationships' }
  ];

  // New dynamic length options
  const contentLengths = [
    { value: 'concise', label: 'Concise', icon: '📝', description: 'Short and to the point (20-40 words)', targetWords: 30 },
    { value: 'optimal', label: 'Optimal', icon: '⚡', description: 'Platform-optimized length (40-80 words)', targetWords: 60 },
    { value: 'detailed', label: 'Detailed', icon: '📄', description: 'Comprehensive content (80-150 words)', targetWords: 120 },
    { value: 'comprehensive', label: 'Comprehensive', icon: '📚', description: 'In-depth content (150-300 words)', targetWords: 225 },
    { value: 'custom', label: 'Custom', icon: '🎛️', description: 'Specify exact word count', targetWords: null }
  ];

  const brandVoiceIntensities = [
    { value: 'subtle', label: 'Subtle', icon: '🤫', description: 'Minimal brand voice influence' },
    { value: 'moderate', label: 'Moderate', icon: '🎯', description: 'Balanced brand voice' },
    { value: 'strong', label: 'Strong', icon: '💪', description: 'Prominent brand voice' },
    { value: 'dominant', label: 'Dominant', icon: '👑', description: 'Very strong brand voice' }
  ];

  const engagementUrgencies = [
    { value: 'low', label: 'Low', icon: '😴', description: 'Relaxed, no urgency' },
    { value: 'normal', label: 'Normal', icon: '😊', description: 'Standard engagement level' },
    { value: 'high', label: 'High', icon: '🔥', description: 'High engagement urgency' },
    { value: 'urgent', label: 'Urgent', icon: '🚨', description: 'Maximum engagement urgency' }
  ];

  const situations = [
    { value: 'general', label: 'General', icon: '📝', description: 'Regular posting' },
    { value: 'promotional', label: 'Promotional', icon: '🎯', description: 'Product/service promotion' },
    { value: 'crisis', label: 'Crisis Response', icon: '⚠️', description: 'Addressing issues or concerns' },
    { value: 'celebration', label: 'Celebration', icon: '🎉', description: 'Celebrating achievements' },
    { value: 'educational', label: 'Educational', icon: '📚', description: 'Teaching or informing' },
    { value: 'community', label: 'Community', icon: '🤝', description: 'Community engagement' },
    { value: 'trending', label: 'Trending', icon: '📈', description: 'Riding current trends' },
    { value: 'seasonal', label: 'Seasonal', icon: '🌱', description: 'Seasonal or holiday content' }
  ];

  // Calculate target length based on all factors
  const calculateTargetLength = () => {
    const selectedLength = contentLengths.find(cl => cl.value === contentLength);
    let baseLength = selectedLength?.targetWords || customLength;
    
    // Adjust based on platform
    const selectedPlatform = platforms.find(p => p.value === platform);
    const platformMax = selectedPlatform?.maxLength || 1000;
    const platformOptimal = Math.min(platformMax * 0.1, 80); // 10% of max or 80 words
    
    // Adjust based on brand voice intensity
    const voiceMultiplier = {
      subtle: 0.8,
      moderate: 1.0,
      strong: 1.2,
      dominant: 1.4
    }[brandVoiceIntensity] || 1.0;
    
    // Adjust based on engagement urgency
    const urgencyMultiplier = {
      low: 0.7,
      normal: 1.0,
      high: 1.3,
      urgent: 1.6
    }[engagementUrgency] || 1.0;
    
    // Adjust based on situation
    const situationMultiplier = {
      general: 1.0,
      promotional: 1.1,
      crisis: 1.3,
      celebration: 1.2,
      educational: 1.4,
      community: 1.1,
      trending: 0.9,
      seasonal: 1.0
    }[situation] || 1.0;
    
    // Calculate final target length
    let targetLength = baseLength * voiceMultiplier * urgencyMultiplier * situationMultiplier;
    
    // Ensure it doesn't exceed platform limits
    targetLength = Math.min(targetLength, platformOptimal);
    
    // Ensure minimum length
    targetLength = Math.max(targetLength, 20);
    
    return Math.round(targetLength);
  };

  const generateContent = async () => {
    if (!content.trim()) {
      setError('Please enter some content to enhance.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setEnhancedContent('');
    setQualityAnalysis(null);
    setShowOriginalContent(false);
    setShowComparison(false);

    try {
      const targetLength = calculateTargetLength();
      const minWords = targetLength;
      const maxWords = Math.round(targetLength * 1.2);
      
      // Enhanced prompt focusing on relevance, precision, and clarity (no markdown, emojis, or unnecessary marks)
      const enhancedPrompt = `You are an expert social media content creator specializing in ${platform} posts. Your goal is to create content that is:

**RELEVANCE & PRECISION:**
- Only include information that is directly relevant to the main message
- Remove any unnecessary, off-topic, or verbose content
- Be concise and precise in your wording
- Avoid filler, repetition, or generic statements

**CLARITY:**
- Use simple, direct language that anyone can understand
- Structure content with a clear beginning, middle, and end
- Make each sentence build naturally on the previous one

**FORMATTING:**
${platform === 'instagram' ? `
**INSTAGRAM-SPECIFIC FORMATTING:**
- Use emojis strategically to make content visually appealing and engaging
- Include 3-5 relevant hashtags at the end of the post
- Use bullet points (•) to highlight key points and make content scannable
- Break up text with line breaks for better readability
- Use bold formatting (**text**) for emphasis on important points
- Include call-to-action emojis (👉 🎯 💡 ✨ 🔥) to encourage engagement
- Use food, lifestyle, and aesthetic emojis relevant to the content
- Keep paragraphs short (2-3 lines max) for mobile viewing
- End with a compelling call-to-action and relevant hashtags` : `
- Do NOT Over use markdown, emojis, or any unnecessary formatting or symbols
- Do NOT Over use bullet points, numbered lists, or headings
- Write as a single, well-structured paragraph or two
- Do NOT include hashtags in the main content (they will be added separately)`}

**CONTENT STRUCTURE:**
- Platform: ${platform} (${postType} post)
- Content structure: ${contentStructure}
- Engagement goal: ${engagementGoal}
- Brand voice intensity: ${brandVoiceIntensity}
- Situation context: ${situation}

**ORIGINAL CONTENT TO ENHANCE:**
${content}

**INSTRUCTIONS:**
1. Transform this into a ${platform}-optimized post that is concise, relevant, and precise
2. Remove any irrelevant or unnecessary information
3. Use the ${tone} tone consistently
4. Target ${targetAudience} audience specifically
5. Focus on ${engagementGoal} as the primary goal
6. Ensure every sentence flows logically to the next
7. Make the content immediately understandable and relatable
8. End with a clear call-to-action that fits the ${engagementGoal}
${platform === 'instagram' ? `
9. **INSTAGRAM ENHANCEMENTS:**
   - Add 3-5 relevant emojis throughout the content
   - Use bullet points (•) to highlight 2-3 key points
   - Include bold formatting (**text**) for emphasis
   - Add 3-5 relevant hashtags at the end
   - Use line breaks to create visual appeal
   - Include engagement emojis (💬 ❤️ 🔥 ✨) in call-to-action
   - Make it visually appealing for Instagram's aesthetic-focused audience` : ''}

**LENGTH REQUIREMENT:**
- Write a comprehensive post of at least ${minWords} words, but not more than ${maxWords} words.
- The post should be in-depth, detailed, and provide substantial value to the reader.
- Do NOT stop early; ensure the post meets the minimum word count.

**QUALITY REQUIREMENTS:**
- Relevance: Every detail should matter to the target audience
- Precision: No filler, no off-topic content
- Clarity: Use simple, powerful words that convey meaning instantly
- Engagement: Encourage interaction and sharing
- Authenticity: Make it feel genuine and personal, not generic
${platform === 'instagram' ? '- Visual Appeal: Use emojis and formatting to make it Instagram-worthy' : '- NO MARKDOWN, NO EMOJIS, NO SYMBOLS, NO BULLETS, NO HEADINGS'}

Generate a post that is concise, relevant, and precise${platform === 'instagram' ? ', with strategic emojis, bullet points, and hashtags for Instagram engagement' : ', with no markdown, emojis, or unnecessary marks'}. Output only the post text, nothing else.`;

      // Force production URL if we're on Netlify
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;
      
      const response = await fetch(`${baseURL}/llama`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: enhancedPrompt,
          useCase: 'social_media'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Clean up markdown, emojis, and unnecessary marks from the generated content
        let generatedContent = data.response;
        
        // DEBUG: Log the raw response from LLM
        console.log('🔍 DEBUG: Raw LLM response:', data.response);
        console.log('🔍 DEBUG: Response length:', data.response.length);
        console.log('🔍 DEBUG: Response type:', typeof data.response);
        
        if (platform === 'instagram') {
          // For Instagram, preserve emojis, bullet points, and hashtags
          generatedContent = generatedContent
            // Remove markdown code blocks
            .replace(/```[\s\S]*?```/g, '')
            // Remove inline code
            .replace(/`([^`]+)`/g, '$1')
            // Remove markdown links but keep text
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            // Remove markdown images but keep alt text
            .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
            // Remove markdown emphasis but keep text
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/__([^_]+)__/g, '$1')
            .replace(/_([^_]+)_/g, '$1')
            // Remove markdown strikethrough
            .replace(/~~([^~]+)~~/g, '$1')
            // Remove markdown blockquotes
            .replace(/^>\s*/gm, '')
            // Remove markdown horizontal rules
            .replace(/^[-*_]{3,}$/gm, '')
            // Remove markdown table syntax
            .replace(/^\|.*\|$/gm, '')
            // Remove numbered lists but keep bullet points
            .replace(/^\d+\.\s*/gm, '')
            // Remove headings
            .replace(/^#+\s*/gm, '')
            // Remove extra whitespace but preserve line breaks
            .replace(/\n{3,}/g, '\n\n')
            .replace(/ {2,}/g, ' ')
            .trim();
        } else {
          // For other platforms, remove all formatting
          generatedContent = generatedContent
            // Remove markdown code blocks
            .replace(/```[\s\S]*?```/g, '')
            // Remove inline code
            .replace(/`([^`]+)`/g, '$1')
            // Remove markdown links but keep text
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            // Remove markdown images but keep alt text
            .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
            // Remove markdown emphasis but keep text
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/__([^_]+)__/g, '$1')
            .replace(/_([^_]+)_/g, '$1')
            // Remove markdown strikethrough
            .replace(/~~([^~]+)~~/g, '$1')
            // Remove markdown blockquotes
            .replace(/^>\s*/gm, '')
            // Remove markdown horizontal rules
            .replace(/^[-*_]{3,}$/gm, '')
            // Remove markdown table syntax
            .replace(/^\|.*\|$/gm, '')
            // Remove bullet points and numbered lists
            .replace(/^[-*•]\s*/gm, '')
            .replace(/^\d+\.\s*/gm, '')
            // Remove headings
            .replace(/^#+\s*/gm, '')
            // Remove emojis and symbols
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B06}\u{2194}-\u{21AA}\u{2934}-\u{2935}\u{25AA}-\u{25AB}\u{25FE}-\u{25FF}\u{25B6}\u{25C0}\u{25FB}-\u{25FC}\u{25FD}-\u{25FE}\u{25A0}-\u{25A1}\u{25B2}-\u{25B3}\u{25BC}-\u{25BD}\u{25C6}-\u{25C7}\u{25CB}-\u{25CC}\u{25D0}-\u{25D1}\u{25E2}-\u{25E5}\u{25EF}]/gu, '')
            // Remove extra whitespace
            .replace(/\n{3,}/g, '\n\n')
            .replace(/ {2,}/g, ' ')
            .trim();
        }
        
        // DEBUG: Log the cleaned content
        console.log('🔍 DEBUG: Cleaned content:', generatedContent);
        console.log('🔍 DEBUG: Cleaned content length:', generatedContent.length);
        console.log('🔍 DEBUG: Is content empty?', !generatedContent.trim());
        
        // FALLBACK: If cleaning results in empty content, use the original
        if (!generatedContent.trim()) {
          console.warn('⚠️ WARNING: Cleaning resulted in empty content. Using original response.');
          setError('The generated content was empty after cleaning. Using the original response.');
          setEnhancedContent(data.response);
        } else {
          setEnhancedContent(generatedContent);
        }
        
        // Add to generation history
        const historyItem = {
          original: content,
          enhanced: generatedContent,
          platform,
          postType,
          tone,
          targetAudience,
          contentStructure,
          engagementGoal,
          length: targetLength,
          brandVoiceIntensity,
          situation,
          timestamp: new Date().toISOString()
        };
        
        setGenerationHistory(prev => [
          { ...historyItem, id: Date.now() },
          ...prev.slice(0, 9)
        ]);
        
        // Save to backend
        savePostToBackend(historyItem);
        
        // Analyze quality with focus on coherence and relevance
        await analyzeQuality(generatedContent);
      } else {
        setError(data.error || 'Failed to generate content');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError('Network error. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeQuality = async (text) => {
    if (!text.trim()) return;

    try {
      // Force production URL if we're on Netlify
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;
      
      // Use the correct endpoint and payload for quality analysis
      const response = await fetch(`${baseURL}/analyze-response-quality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: text,
          contentType: 'facebook_post',
          context: {
            platform,
            targetAudience,
            tone,
            engagementGoal,
            contentStructure,
            postType,
            brandVoiceIntensity,
            engagementUrgency,
            situation,
            targetLength: calculateTargetLength()
          }
        })
      });

      const data = await response.json();
      
      if (data.success && data.qualityAnalysis) {
        setQualityAnalysis(data.qualityAnalysis);
      } else {
        setQualityAnalysis(null);
        console.warn('Quality analysis failed:', data.error);
      }
    } catch (err) {
      console.error('Quality analysis error:', err);
      setQualityAnalysis(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Content copied to clipboard!');
  };

  // Function to format Instagram content for preview
  const formatInstagramContent = (content) => {
    // Split content into main content and hashtags
    const lines = content.split('\n');
    const hashtagLines = [];
    const mainContent = [];
    
    lines.forEach(line => {
      if (line.trim().startsWith('#')) {
        hashtagLines.push(line.trim());
      } else {
        mainContent.push(line);
      }
    });
    
    const mainText = mainContent.join('\n');
    const hashtags = hashtagLines.join(' ');
    
    // Format bullet points
    let formattedContent = mainText
      .replace(/^•\s*/gm, '<div class="bullet-item"><span class="bullet-icon">•</span>')
      .replace(/\n/g, '</div>\n<div class="bullet-item"><span class="bullet-icon">•</span>');
    
    // Add hashtags section if present
    if (hashtags) {
      formattedContent += `<div class="hashtags">${hashtags}</div>`;
    }
    
    return formattedContent;
  };

  // Function to open preview in new window
  const openPreviewWindow = (content, platform, postType, tone, targetAudience) => {
    const platformInfo = platforms.find(p => p.value === platform);
    const postTypeInfo = postTypes.find(pt => pt.value === postType);
    const toneInfo = tones.find(t => t.value === tone);
    const audienceInfo = audiences.find(a => a.value === targetAudience);
    
    const previewHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${platformInfo?.label || 'Social Media'} Post Preview</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .preview-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            max-width: 500px;
            width: 100%;
            animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        .preview-header {
            background: linear-gradient(135deg, #4f8cff 0%, #38e8ff 100%);
            padding: 24px;
            text-align: center;
            color: white;
        }
        
        .preview-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }
        
        .preview-meta {
            font-size: 14px;
            opacity: 0.9;
            display: flex;
            justify-content: center;
            gap: 16px;
            flex-wrap: wrap;
        }
        
        .meta-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .preview-content {
            padding: 32px;
            background: #f8f9ff;
            min-height: 300px;
            position: relative;
        }
        
        .post-content {
            background: white;
            border-radius: 12px;
            padding: 24px;
            font-size: 16px;
            line-height: 1.6;
            color: #2d3748;
            white-space: pre-wrap;
            word-wrap: break-word;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            border: 1px solid #e2e8f0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .post-content.instagram {
            font-size: 18px;
            line-height: 1.8;
            padding: 28px;
            background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
            border: 2px solid #ec4899;
        }
        
        .post-content.instagram .hashtags {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #fbbf24;
            color: #7c3aed;
            font-weight: 600;
        }
        
        .post-content.instagram .bullet-points {
            margin: 12px 0;
            padding-left: 8px;
        }
        
        .post-content.instagram .bullet-points .bullet-item {
            margin-bottom: 8px;
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }
        
        .post-content.instagram .bullet-points .bullet-icon {
            color: #ec4899;
            font-size: 20px;
            flex-shrink: 0;
            margin-top: 2px;
        }
        
        .post-stats {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            color: #718096;
        }
        
        .character-count {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .platform-icon {
            font-size: 20px;
        }
        
        .preview-actions {
            padding: 24px;
            background: white;
            display: flex;
            gap: 12px;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .action-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
        }
        
        .action-btn:hover {
            background: #5a67d8;
            transform: translateY(-1px);
        }
        
        .action-btn.secondary {
            background: #e2e8f0;
            color: #4a5568;
        }
        
        .action-btn.secondary:hover {
            background: #cbd5e0;
        }
        
        .quality-badge {
            position: absolute;
            top: 16px;
            right: 16px;
            background: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }
        
        @media (max-width: 600px) {
            .preview-container {
                margin: 10px;
                border-radius: 16px;
            }
            
            .preview-header {
                padding: 20px;
            }
            
            .preview-title {
                font-size: 20px;
            }
            
            .preview-content {
                padding: 20px;
            }
            
            .post-content {
                padding: 20px;
                font-size: 15px;
            }
            
            .preview-actions {
                padding: 20px;
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="preview-container">
        <div class="preview-header">
            <div class="preview-title">
                <span class="platform-icon">${platformInfo?.icon || '📱'}</span>
                ${platformInfo?.label || 'Social Media'} Post Preview
            </div>
            <div class="preview-meta">
                <div class="meta-item">
                    <span>📝</span>
                    <span>${postTypeInfo?.label || 'Post'}</span>
                </div>
                <div class="meta-item">
                    <span>🎭</span>
                    <span>${toneInfo?.label || 'Tone'}</span>
                </div>
                <div class="meta-item">
                    <span>👥</span>
                    <span>${audienceInfo?.label || 'Audience'}</span>
                </div>
            </div>
        </div>
        
        <div class="preview-content">
            <div class="quality-badge">✨ Enhanced</div>
            <div class="post-content${platform === 'instagram' ? ' instagram' : ''}">${platform === 'instagram' ? formatInstagramContent(content) : content}</div>
            <div class="post-stats">
                <div class="character-count">
                    <span>📊</span>
                    <span>${content.length} characters</span>
                </div>
                <div class="character-count">
                    <span>📝</span>
                    <span>${content.split(' ').length} words</span>
                </div>
            </div>
        </div>
        
        <div class="preview-actions">
            <button id="copy-btn" class="action-btn">
                📋 Copy Post
            </button>
            <button id="close-btn" class="action-btn secondary">
                ✖ Close Window
            </button>
        </div>
    </div>
    
    <script>
        // Copy to clipboard function
        function copyToClipboard() {
            const content = \`${content.replace(/`/g, '\\`')}\`;
            navigator.clipboard.writeText(content).then(() => {
                alert('Post copied to clipboard!');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = content;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Post copied to clipboard!');
            });
        }
        
        // Close window function
        function closeWindow() {
            window.close();
        }
        
        // Add event listeners
        document.getElementById('copy-btn').addEventListener('click', copyToClipboard);
        document.getElementById('close-btn').addEventListener('click', closeWindow);
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'c') {
                    e.preventDefault();
                    copyToClipboard();
                } else if (e.key === 'w') {
                    e.preventDefault();
                    closeWindow();
                }
            }
        });
    </script>
</body>
</html>`;

    const newWindow = window.open('', '_blank', 'width=600,height=800,scrollbars=yes,resizable=yes');
    newWindow.document.write(previewHTML);
    newWindow.document.close();
  };

  const clearAll = () => {
    setContent('');
    setEnhancedContent('');
    setError('');
    setQualityAnalysis(null);
    setGenerationHistory([]);
    setShowAdvancedOptions(false);
    setShowSuggestions(false);
    setSelectedSuggestion('');
    setShowOriginalContent(false);
    setShowComparison(false);
  };

  // Show suggestions automatically when content is empty
  useEffect(() => {
    if (!content.trim() && !showSuggestions) {
      setShowSuggestions(true);
    }
  }, [content, showSuggestions]);

  const getPlatformIcon = (platformValue) => {
    return platforms.find(p => p.value === platformValue)?.icon || '📱';
  };

  const getToneIcon = (toneValue) => {
    return tones.find(t => t.value === toneValue)?.icon || '💬';
  };

  const getAudienceIcon = (audienceValue) => {
    return audiences.find(a => a.value === audienceValue)?.icon || '👥';
  };

  const getQualityColor = (score) => {
    if (score >= 0.8) return '#10b981';
    if (score >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  const getQualityLabel = (score) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Poor';
  };

  // Calculate derived values for display
  const selectedPlatform = platforms.find(p => p.value === platform);
  const characterCount = enhancedContent.length;
  const isOverLimit = characterCount > (selectedPlatform?.maxLength || 1000);

  // Follow-up question suggestions based on user selections
  const getFollowUpSuggestions = () => {
    const suggestions = {
      general: [
        "What's the most interesting thing that happened to you today?",
        "Share a personal story that your audience can relate to",
        "What's something you're grateful for right now?",
        "Tell us about a challenge you recently overcame",
        "What's a lesson you learned this week?"
      ],
      promotional: [
        "What problem does your product/service solve?",
        "Share a customer success story",
        "What makes your offering unique?",
        "What's a common misconception about your industry?",
        "How has your product/service evolved?"
      ],
      educational: [
        "What's a common mistake people make in your field?",
        "Share a surprising fact or statistic",
        "What's something everyone should know about your topic?",
        "What's a tip that changed your perspective?",
        "What's the most important lesson you've learned?"
      ],
      community: [
        "What's happening in your local community?",
        "How can people get involved with your cause?",
        "What community event are you excited about?",
        "Share a story about community support",
        "What's a local business you want to highlight?"
      ],
      celebration: [
        "What achievement are you most proud of?",
        "Who deserves recognition in your network?",
        "What milestone are you celebrating?",
        "Share a team success story",
        "What's something worth celebrating today?"
      ],
      trending: [
        "What's your take on the current trend?",
        "How does this trend relate to your audience?",
        "What's the story behind this trend?",
        "How can people participate in this trend?",
        "What's the next big thing you're seeing?"
      ],
      seasonal: [
        "What does this season mean to you?",
        "How are you preparing for this time of year?",
        "What traditions are important to you?",
        "What's your favorite thing about this season?",
        "How can people make the most of this season?"
      ],
      crisis: [
        "How are you supporting your community during this time?",
        "What resources can you share?",
        "How are you adapting to the current situation?",
        "What positive actions can people take?",
        "How can we help each other?"
      ]
    };

    // Get suggestions based on post type and situation
    const postTypeSuggestions = suggestions[postType] || suggestions.general;
    const situationSuggestions = suggestions[situation] || suggestions.general;
    
    // Add content structure specific suggestions
    const structureSuggestions = {
      story: [
        "What's the beginning of your story?",
        "What was the turning point?",
        "How did it end?",
        "What did you learn from this experience?"
      ],
      'problem-solution': [
        "What problem are you addressing?",
        "What's your solution?",
        "How does this help others?",
        "What results can people expect?"
      ],
      list: [
        "What are the key points you want to share?",
        "What's the most important item on your list?",
        "How can people apply these points?",
        "What's your top recommendation?"
      ],
      'question-answer': [
        "What question are you answering?",
        "What's the most common question you get?",
        "What's something people often misunderstand?",
        "What's your expert advice on this topic?"
      ],
      'before-after': [
        "What was the situation before?",
        "What changed?",
        "What's the result now?",
        "What made the difference?"
      ],
      tips: [
        "What's your best tip?",
        "What mistake should people avoid?",
        "What's your secret to success?",
        "What's the easiest way to get started?"
      ],
      quote: [
        "What quote inspires you?",
        "Who said something meaningful about this?",
        "What's your favorite quote on this topic?",
        "How does this quote apply to your audience?"
      ],
      announcement: [
        "What are you announcing?",
        "Why is this important?",
        "What should people know?",
        "What's the next step?"
      ]
    };

    const structureSpecific = structureSuggestions[contentStructure] || [];
    
    // Add tone-specific suggestions
    const toneSuggestions = {
      engaging: [
        "What would make your audience want to comment?",
        "What question would start a conversation?",
        "What's something controversial you can address?",
        "What's a hot topic in your industry?"
      ],
      professional: [
        "What industry insight can you share?",
        "What professional development tip do you have?",
        "What's a business lesson you've learned?",
        "What trend should professionals watch?"
      ],
      casual: [
        "What's something fun you want to share?",
        "What made you smile today?",
        "What's a lighthearted observation?",
        "What's something relatable to your audience?"
      ],
      humorous: [
        "What's something funny that happened?",
        "What's a humorous take on your topic?",
        "What's a joke or pun related to your content?",
        "What's something that made you laugh?"
      ],
      inspirational: [
        "What motivates you?",
        "What's an inspiring story you can share?",
        "What's your message of hope?",
        "What would encourage your audience?"
      ],
      educational: [
        "What fact would surprise your audience?",
        "What's a common misconception?",
        "What's something everyone should know?",
        "What's a practical tip you can share?"
      ],
      empathetic: [
        "What struggle can you relate to?",
        "How can you show understanding?",
        "What support can you offer?",
        "What would make someone feel heard?"
      ],
      authoritative: [
        "What's your expert opinion?",
        "What's the data showing?",
        "What's your proven approach?",
        "What's your professional recommendation?"
      ]
    };

    const toneSpecific = toneSuggestions[tone] || [];
    
    // Combine and remove duplicates
    const allSuggestions = [...new Set([
      ...postTypeSuggestions, 
      ...situationSuggestions,
      ...structureSpecific,
      ...toneSpecific
    ])];
    
    // Add platform-specific suggestions
    const platformSpecific = {
      facebook: [
        "What would you like to discuss with your Facebook community?",
        "Share something that would start a meaningful conversation",
        "What's on your mind that others might relate to?",
        "What's happening in your world that's worth sharing?"
      ],
      instagram: [
        "What visual story would you like to tell?",
        "Share a behind-the-scenes moment",
        "What's inspiring you today?",
        "What's a beautiful moment you want to capture?"
      ],
      twitter: [
        "What's your hot take on a current topic?",
        "Share a quick tip or insight",
        "What's worth sharing in 280 characters?",
        "What's trending that you have thoughts on?"
      ],
      linkedin: [
        "What professional insight can you share?",
        "What industry trend are you following?",
        "What career advice would you give?",
        "What business lesson have you learned?"
      ],
      tiktok: [
        "What's a fun trend you can participate in?",
        "What's something entertaining you can show?",
        "What's a quick tip you can demonstrate?",
        "What's something viral-worthy you can share?"
      ],
      youtube: [
        "What tutorial or guide can you create?",
        "What's a story you can tell in detail?",
        "What's a topic you can explain thoroughly?",
        "What's something you can show step-by-step?"
      ]
    };

    const platformSuggestions = platformSpecific[platform] || platformSpecific.facebook;
    
    // Add engagement goal specific suggestions
    const goalSuggestions = {
      awareness: [
        "What should people know about your brand?",
        "What's unique about what you do?",
        "What's your story that people should hear?",
        "What makes you different from others?"
      ],
      engagement: [
        "What question would get people talking?",
        "What's something people would want to share?",
        "What's a topic that would get comments?",
        "What's something that would make people react?"
      ],
      conversation: [
        "What's a topic people have strong opinions about?",
        "What's something that would start a debate?",
        "What's a question that has no right answer?",
        "What's something that would get people thinking?"
      ],
      education: [
        "What's something people often get wrong?",
        "What's a tip that would help your audience?",
        "What's something you wish everyone knew?",
        "What's a lesson that would benefit others?"
      ],
      conversion: [
        "What problem can you solve for people?",
        "What's the benefit of working with you?",
        "What's a success story you can share?",
        "What's the next step people should take?"
      ],
      community: [
        "How can people connect with each other?",
        "What's a shared experience you can highlight?",
        "What's something that would bring people together?",
        "What's a community event or initiative?"
      ]
    };

    const goalSpecific = goalSuggestions[engagementGoal] || [];
    
    return [...new Set([
      ...allSuggestions, 
      ...platformSuggestions,
      ...goalSpecific
    ])].slice(0, 10); // Show top 10 most relevant suggestions
  };

  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setContent(prev => prev ? `${prev}\n\n${suggestion}` : suggestion);
    setShowSuggestions(false);
  };

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  // Function to review and clean the generated post using LLM-model
  const reviewGeneratedContent = async (content) => {
    setIsReviewing(true);
    try {
      // Use the same baseURL logic as before
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;
      
      // Prompt for LLM-model to review and clean the content
      const reviewPrompt = `Review the following ${platform} post. Remove any unnecessary, irrelevant, verbose, or off-topic content and words. Only keep what is precise, relevant, and directly serves the main message. Do not add anything new.${platform === 'instagram' ? ' Preserve emojis, bullet points (•), and hashtags as they are important for Instagram engagement.' : ' Output only the cleaned post, with no markdown, emojis, or extra formatting.'}

POST TO REVIEW:
${content}`;
      
      const response = await fetch(`${baseURL}/llama`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: reviewPrompt,
          useCase: 'social_media'
        })
      });
      const data = await response.json();
      if (data.success) {
        let cleaned = data.response;
        
        if (platform === 'instagram') {
          // For Instagram, preserve emojis, bullet points, and hashtags
          cleaned = cleaned
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/__([^_]+)__/g, '$1')
            .replace(/_([^_]+)_/g, '$1')
            .replace(/~~([^~]+)~~/g, '$1')
            .replace(/^>\s*/gm, '')
            .replace(/^[-*_]{3,}$/gm, '')
            .replace(/^\|.*\|$/gm, '')
            .replace(/^\d+\.\s*/gm, '')
            .replace(/^#+\s*/gm, '')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/ {2,}/g, ' ')
            .trim();
        } else {
          // For other platforms, remove all formatting
          cleaned = cleaned
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
            .replace(/\*\*([^*]+)\*\*/g, '$1')
            .replace(/\*([^*]+)\*/g, '$1')
            .replace(/__([^_]+)__/g, '$1')
            .replace(/_([^_]+)_/g, '$1')
            .replace(/~~([^~]+)~~/g, '$1')
            .replace(/^>\s*/gm, '')
            .replace(/^[-*_]{3,}$/gm, '')
            .replace(/^\|.*\|$/gm, '')
            .replace(/^[-*•]\s*/gm, '')
            .replace(/^\d+\.\s*/gm, '')
            .replace(/^#+\s*/gm, '')
            .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B06}\u{2194}-\u{21AA}\u{2934}-\u{2935}\u{25AA}-\u{25AB}\u{25FE}-\u{25FF}\u{25B6}\u{25C0}\u{25FB}-\u{25FC}\u{25FD}-\u{25FE}\u{25A0}-\u{25A1}\u{25B2}-\u{25B3}\u{25BC}-\u{25BD}\u{25C6}-\u{25C7}\u{25CB}-\u{25CC}\u{25D0}-\u{25D1}\u{25E2}-\u{25E5}\u{25EF}]/gu, '')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/ {2,}/g, ' ')
            .trim();
        }
        
        setReviewedContent(cleaned);
      } else {
        setReviewedContent(content); // fallback
      }
    } catch (err) {
      setReviewedContent(content); // fallback
    } finally {
      setIsReviewing(false);
    }
  };

  // When enhancedContent changes, trigger review
  useEffect(() => {
    if (enhancedContent) {
      reviewGeneratedContent(enhancedContent);
    } else {
      setReviewedContent('');
    }
  }, [enhancedContent]);

  // Fetch global history from backend
  const fetchGlobalHistory = async () => {
    setIsHistoryLoading(true);
    setHistoryError('');
    try {
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;
      const response = await fetch(`${baseURL}/social-posts`);
      const data = await response.json();
      if (data.success) {
        setGlobalHistory(data.posts || []);
      } else {
        setHistoryError(data.error || 'Failed to fetch global history');
      }
    } catch (err) {
      setHistoryError('Network error fetching global history');
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchGlobalHistory();
  }, []);

  // Save new post to backend after generation
  const savePostToBackend = async (historyItem) => {
    try {
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;
      await fetch(`${baseURL}/social-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(historyItem)
      });
      // Re-fetch global history after saving
      fetchGlobalHistory();
    } catch (err) {
      // Optionally show error
    }
  };

  // Helper to group history by platform (now uses globalHistory)
  const groupHistoryByPlatform = (history) => {
    const grouped = {};
    history.forEach(item => {
      if (!grouped[item.platform]) grouped[item.platform] = [];
      grouped[item.platform].push(item);
    });
    return grouped;
  };

  return (
    <div className="social-media-post responsive-mobile">
      {/* DEBUG: Show enhancedContent and reviewedContent values */}
      <div className="debug-info-mobile">
        <div>🔍 <strong>DEBUG:</strong> enhancedContent: <span>{String(enhancedContent)}</span></div>
        <div>🔍 <strong>DEBUG:</strong> reviewedContent: <span>{String(reviewedContent)}</span></div>
      </div>

      <div className="post-container">
        <div className="post-header">
          <div className="header-icon">📘</div>
          <h1>Facebook Post Creator</h1>
          <p>Create well-structured, precise, and thoughtful Facebook posts with AI enhancement</p>
          <div className="header-features">
            <span className="feature-badge">🤖 AI-Powered</span>
            <span className="feature-badge">📊 Quality Analysis</span>
            <span className="feature-badge">🎯 Engagement Optimized</span>
          </div>
        </div>

        <div className="post-content">
          {/* Platform Selection */}
          <div className="section platform-section-mobile">
            <h2>📱 Platform Selection</h2>
            <div className="platform-grid">
              {platforms.map(p => (
                <button
                  key={p.value}
                  className={`platform-option ${platform === p.value ? 'active' : ''} ${p.priority ? 'priority' : ''}`}
                  onClick={() => setPlatform(p.value)}
                  tabIndex={0}
                >
                  <span className="platform-icon">{p.icon}</span>
                  <span className="platform-label">{p.label}</span>
                  {p.priority && <span className="priority-badge">Recommended</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div className="section content-section-mobile">
            <h2>✍️ Your Content</h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your original content here... What would you like to share on Facebook?"
              rows={5}
              className="content-input mobile-friendly-input"
            />
            <div className="input-stats">
              <span>Characters: {content.length}</span>
              <span>Words: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
            </div>
          </div>

          {/* Follow-up Question Suggestions */}
          <div className="section suggestions-section-mobile">
            <div className="suggestions-header-mobile">
              <h2>💡 Need Ideas? Get Inspired!</h2>
              <button
                onClick={toggleSuggestions}
                className={`suggestions-toggle ${showSuggestions ? 'active' : ''}`}
                tabIndex={0}
              >
                <span>{showSuggestions ? '🙈' : '💡'}</span>
                {showSuggestions ? 'Hide Suggestions' : 'Show Suggestions'}
              </button>
            </div>
            {showSuggestions && (
              <div className="suggestions-container-mobile">
                <div className="suggestions-header">
                  <span style={{ fontSize: '20px' }}>🎯</span>
                  <h3 className="suggestions-title">
                    Personalized Suggestions for {getPlatformIcon(platform)} {platforms.find(p => p.value === platform)?.label}
                  </h3>
                </div>
                
                <p className="suggestions-subtitle">
                  Based on your selections: <strong>{postTypes.find(pt => pt.value === postType)?.label}</strong> • <strong>{situations.find(s => s.value === situation)?.label}</strong> • <strong>{engagementGoals.find(eg => eg.value === engagementGoal)?.label}</strong>
                </p>

                {/* Quick Start Prompts */}
                {!content.trim() && (
                  <div className="quick-start-container">
                    <div className="quick-start-header">
                      <span style={{ fontSize: '18px' }}>🚀</span>
                      <h4 className="quick-start-title">
                        Quick Start - Choose a prompt to begin:
                      </h4>
                    </div>
                    <div className="quick-start-grid">
                      {[
                        "I want to share a personal story...",
                        "I have a tip or advice to give...",
                        "I want to ask my audience something...",
                        "I want to promote something...",
                        "I want to educate about a topic...",
                        "I want to celebrate an achievement..."
                      ].map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => setContent(prompt)}
                          className="quick-start-btn"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="suggestions-grid">
                  {getFollowUpSuggestions().map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="suggestion-item"
                    >
                      <div className="suggestion-add-icon">+</div>
                      <div className="suggestion-text">
                        "{suggestion}"
                      </div>
                    </button>
                  ))}
                </div>

                <div className="suggestions-tip">
                  💡 <strong>Tip:</strong> Click any suggestion above to add it to your content. You can then edit and personalize it!
                </div>
              </div>
            )}
          </div>

          {/* Facebook-Specific Options */}
          <div className="section config-section-mobile">
            <h2>🎯 Facebook Post Configuration</h2>
            
            {/* Post Type */}
            <div className="option-group">
              <label>Post Type</label>
              <div className="options-grid">
                {postTypes.map(type => (
                  <button
                    key={type.value}
                    className={`option-btn ${postType === type.value ? 'active' : ''}`}
                    onClick={() => setPostType(type.value)}
                  >
                    <span className="option-icon">{type.icon}</span>
                    <span className="option-label">{type.label}</span>
                    <span className="option-description">{type.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Structure */}
            <div className="option-group">
              <label>Content Structure</label>
              <div className="options-grid">
                {contentStructures.map(structure => (
                  <button
                    key={structure.value}
                    className={`option-btn ${contentStructure === structure.value ? 'active' : ''}`}
                    onClick={() => setContentStructure(structure.value)}
                  >
                    <span className="option-icon">{structure.icon}</span>
                    <span className="option-label">{structure.label}</span>
                    <span className="option-description">{structure.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Engagement Goal */}
            <div className="option-group">
              <label>Engagement Goal</label>
              <div className="options-grid">
                {engagementGoals.map(goal => (
                  <button
                    key={goal.value}
                    className={`option-btn ${engagementGoal === goal.value ? 'active' : ''}`}
                    onClick={() => setEngagementGoal(goal.value)}
                  >
                    <span className="option-icon">{goal.icon}</span>
                    <span className="option-label">{goal.label}</span>
                    <span className="option-description">{goal.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Length Adjustment */}
            <div className="option-group">
              <label>📏 Content Length & Optimization</label>
              <div className="options-grid">
                {contentLengths.map(length => (
                  <button
                    key={length.value}
                    className={`option-btn ${contentLength === length.value ? 'active' : ''}`}
                    onClick={() => setContentLength(length.value)}
                  >
                    <span className="option-icon">{length.icon}</span>
                    <span className="option-label">{length.label}</span>
                    <span className="option-description">{length.description}</span>
                  </button>
                ))}
              </div>
              
              {/* Custom Length Input */}
              {contentLength === 'custom' && (
                <div className="custom-length-input">
                  <label>Target Words:</label>
                  <input
                    type="number"
                    value={customLength}
                    onChange={(e) => setCustomLength(Math.max(20, parseInt(e.target.value) || 100))}
                    min="20"
                    max="500"
                  />
                  <span className="custom-length-target">
                    Target: {calculateTargetLength()} words
                  </span>
                </div>
              )}
            </div>

            {/* Brand Voice & Engagement */}
            <div className="option-group">
              <label>🎭 Brand Voice & Engagement</label>
              <div className="options-grid">
                {brandVoiceIntensities.map(voice => (
                  <button
                    key={voice.value}
                    className={`option-btn ${brandVoiceIntensity === voice.value ? 'active' : ''}`}
                    onClick={() => setBrandVoiceIntensity(voice.value)}
                  >
                    <span className="option-icon">{voice.icon}</span>
                    <span className="option-label">{voice.label}</span>
                    <span className="option-description">{voice.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="option-group">
              <label>🔥 Engagement Urgency</label>
              <div className="options-grid">
                {engagementUrgencies.map(urgency => (
                  <button
                    key={urgency.value}
                    className={`option-btn ${engagementUrgency === urgency.value ? 'active' : ''}`}
                    onClick={() => setEngagementUrgency(urgency.value)}
                  >
                    <span className="option-icon">{urgency.icon}</span>
                    <span className="option-label">{urgency.label}</span>
                    <span className="option-description">{urgency.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Situation Context */}
            <div className="option-group">
              <label>🎯 Situation & Context</label>
              <div className="options-grid">
                {situations.map(situation => (
                  <button
                    key={situation.value}
                    className={`option-btn ${situation === situation.value ? 'active' : ''}`}
                    onClick={() => setSituation(situation.value)}
                  >
                    <span className="option-icon">{situation.icon}</span>
                    <span className="option-label">{situation.label}</span>
                    <span className="option-description">{situation.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Length Preview */}
            <div className="length-preview">
              <div className="length-preview-header">
                <span>📊</span>
                <span className="length-preview-title">Length Optimization Preview</span>
              </div>
              <div className="length-preview-grid">
                <div>
                  <strong>Base Length:</strong> {contentLengths.find(cl => cl.value === contentLength)?.targetWords || customLength} words
                </div>
                <div>
                  <strong>Brand Voice:</strong> {brandVoiceIntensities.find(bv => bv.value === brandVoiceIntensity)?.label}
                </div>
                <div>
                  <strong>Engagement:</strong> {engagementUrgencies.find(eu => eu.value === engagementUrgency)?.label}
                </div>
                <div>
                  <strong>Situation:</strong> {situations.find(s => s.value === situation)?.label}
                </div>
                <div className="length-preview-target">
                  🎯 Target Length: {calculateTargetLength()} words
                </div>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <button
              className="advanced-toggle"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              {showAdvancedOptions ? '🔽' : '🔼'} Advanced Options
            </button>

            {showAdvancedOptions && (
              <div className="advanced-options">
                {/* Tone */}
                <div className="option-group">
                  <label>Tone</label>
                  <div className="options-grid">
                    {tones.map(tone => (
                      <button
                        key={tone.value}
                        className={`option-btn ${tone === tone.value ? 'active' : ''}`}
                        onClick={() => setTone(tone.value)}
                      >
                        <span className="option-icon">{tone.icon}</span>
                        <span className="option-label">{tone.label}</span>
                        <span className="option-description">{tone.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Audience */}
                <div className="option-group">
                  <label>Target Audience</label>
                  <div className="options-grid">
                    {audiences.map(audience => (
                      <button
                        key={audience.value}
                        className={`option-btn ${targetAudience === audience.value ? 'active' : ''}`}
                        onClick={() => setTargetAudience(audience.value)}
                      >
                        <span className="option-icon">{audience.icon}</span>
                        <span className="option-label">{audience.label}</span>
                        <span className="option-description">{audience.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="section generate-section-mobile">
            <button
              className="generate-btn mobile-generate-btn"
              onClick={generateContent}
              disabled={isGenerating || !content.trim()}
            >
              {isGenerating ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Facebook Post...
                </>
              ) : (
                <>
                  <span>🤖</span>
                  Create Facebook Post
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message mobile-error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Enhanced Content */}
          {enhancedContent && (
            <div className="section result-section mobile-result-section" style={{ position: 'relative' }}>
              {/* Original Content Display */}
              {showOriginalContent && (
                <div className="original-content-section">
                  <h3 style={{ 
                    color: '#6b7280', 
                    fontSize: '18px', 
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    📝 Original Content
                  </h3>
                  <div style={{
                    background: '#f9fafb',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#374151',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#6b7280',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Original
                    </div>
                    {content}
                  </div>
                </div>
              )}
              {/* Side-by-Side Comparison */}
              {showComparison && (
                <div className="comparison-section">
                  <h3 style={{ 
                    color: '#8b5cf6', 
                    fontSize: '18px', 
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    ⚖️ Before vs After Comparison
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    marginBottom: '20px'
                  }}>
                    {/* Original Content */}
                    <div style={{
                      background: '#f9fafb',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '20px',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#6b7280',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        Before
                      </div>
                      <h4 style={{ 
                        color: '#6b7280', 
                        marginBottom: '12px',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>
                        📝 Original Content
                      </h4>
                      <div style={{
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#374151',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        maxHeight: '300px',
                        overflowY: 'auto'
                      }}>
                        {content}
                      </div>
                      <div style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid #e5e7eb',
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        Words: {content.split(/\s+/).filter(word => word.length > 0).length} | 
                        Characters: {content.length}
                      </div>
                    </div>
                    {/* Enhanced Content */}
                    <div style={{
                      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                      border: '2px solid #0ea5e9',
                      borderRadius: '12px',
                      padding: '20px',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#0ea5e9',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        After
                      </div>
                      <h4 style={{ 
                        color: '#0ea5e9', 
                        marginBottom: '12px',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>
                        ✨ Enhanced Content
                      </h4>
                      <div style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#1e293b',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        maxHeight: '300px',
                        overflowY: 'auto'
                      }}>
                        {reviewedContent || enhancedContent}
                      </div>
                      <div style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid #0ea5e9',
                        fontSize: '12px',
                        color: '#0ea5e9'
                      }}>
                        Words: {(reviewedContent || enhancedContent).split(/\s+/).filter(word => word.length > 0).length} | 
                        Characters: {(reviewedContent || enhancedContent).length}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="post-preview mobile-post-preview">
                <div className="preview-header">
                  <span className="platform-icon">{getPlatformIcon(platform)}</span>
                  <span className="preview-title">Facebook Post Preview</span>
                  <div className="preview-meta">
                    <span className="meta-item">
                      {getToneIcon(tone)} {tones.find(t => t.value === tone)?.label}
                    </span>
                    <span className="meta-item">
                      {getAudienceIcon(targetAudience)} {audiences.find(a => a.value === targetAudience)?.label}
                    </span>
                  </div>
                </div>
                <div className={`preview-content ${isOverLimit ? 'over-limit' : ''} ${platform === 'instagram' ? 'instagram-preview' : ''}`}>
                  {isReviewing ? (
                    <span>Reviewing for unnecessary/irrelevant content...</span>
                  ) : (
                    <pre style={{
                      fontFamily: platform === 'instagram' ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' : 'monospace',
                      fontSize: platform === 'instagram' ? '16px' : '14px',
                      lineHeight: platform === 'instagram' ? '1.8' : '1.4',
                      color: platform === 'instagram' ? '#2d3748' : '#333',
                      background: platform === 'instagram' ? 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)' : 'transparent',
                      padding: platform === 'instagram' ? '20px' : '0',
                      borderRadius: platform === 'instagram' ? '12px' : '0',
                      border: platform === 'instagram' ? '2px solid #ec4899' : 'none',
                      margin: platform === 'instagram' ? '0' : '0'
                    }}>
                      {reviewedContent || enhancedContent}
                    </pre>
                  )}
                </div>
                <div className="preview-footer mobile-preview-footer">
                  <div className="character-count">
                    Characters: {(reviewedContent || enhancedContent).length}/{selectedPlatform.maxLength}
                    {isOverLimit && <span className="limit-warning">⚠️ Over character limit</span>}
                  </div>
                </div>
              </div>
              {/* Sticky Action Bar */}
              <div className="sticky-action-bar mobile-sticky-action-bar">
                <button onClick={() => copyToClipboard(reviewedContent || enhancedContent)} className="action-btn mobile-action-btn">
                  📋 Copy Post
                </button>
                <button 
                  onClick={() => openPreviewWindow(
                    reviewedContent || enhancedContent, 
                    platform, 
                    postType, 
                    tone, 
                    targetAudience
                  )} 
                  className="action-btn mobile-action-btn"
                >
                  👁️ Preview in New Window
                </button>
                <button 
                  onClick={() => setShowOriginalContent(!showOriginalContent)} 
                  className="action-btn mobile-action-btn"
                >
                  {showOriginalContent ? '🙈' : '📝'} {showOriginalContent ? 'Hide' : 'Show'} Original
                </button>
                <button 
                  onClick={() => setShowComparison(!showComparison)} 
                  className="action-btn mobile-action-btn"
                >
                  {showComparison ? '🙈' : '⚖️'} {showComparison ? 'Hide' : 'Show'} Comparison
                </button>
              </div>
              {/* Quality Analysis */}
              {qualityAnalysis && (
                <div className="quality-section">
                  <h3>📊 Content Quality Analysis</h3>
                  
                  {/* Overall Score */}
                  <div className="quality-overview">
                    <div className="quality-score">
                      <span className="score-number">{qualityAnalysis.overallScore || 0}</span>
                      <span className="score-label">Overall Score</span>
                    </div>
                  </div>

                  {/* Key Metrics - Focus on Coherence and Relevance */}
                  <div className="quality-metrics">
                    {/* Coherence - Most Important */}
                    <div className="metric-item coherence">
                      <div className="metric-label">
                        <span style={{ color: '#4f8cff', fontWeight: 'bold' }}>🔗 Coherence</span>
                        <span style={{ fontSize: '12px', color: '#666' }}> (40% weight)</span>
                      </div>
                      <div className="metric-score" style={{ color: '#4f8cff' }}>
                        {Math.round((qualityAnalysis.metrics?.coherence || 0) * 100)}%
                      </div>
                    </div>

                    {/* Relevance - Second Most Important */}
                    <div className="metric-item relevance">
                      <div className="metric-label">
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>🎯 Relevance</span>
                        <span style={{ fontSize: '12px', color: '#666' }}> (30% weight)</span>
                      </div>
                      <div className="metric-score" style={{ color: '#10b981' }}>
                        {Math.round((qualityAnalysis.metrics?.relevance || 0) * 100)}%
                      </div>
                    </div>

                    {/* Clarity */}
                    <div className="metric-item clarity">
                      <div className="metric-label">
                        <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>💡 Clarity</span>
                        <span style={{ fontSize: '12px', color: '#666' }}> (15% weight)</span>
                      </div>
                      <div className="metric-score" style={{ color: '#f59e0b' }}>
                        {Math.round((qualityAnalysis.metrics?.clarity || 0) * 100)}%
                      </div>
                    </div>

                    {/* Engagement */}
                    <div className="metric-item engagement">
                      <div className="metric-label">
                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>🔥 Engagement</span>
                        <span style={{ fontSize: '12px', color: '#666' }}> (15% weight)</span>
                      </div>
                      <div className="metric-score" style={{ color: '#ef4444' }}>
                        {Math.round((qualityAnalysis.metrics?.engagement || 0) * 100)}%
                      </div>
                    </div>
                  </div>

                  {/* Detailed Analysis */}
                  {qualityAnalysis.metrics && (
                    <div style={{ marginTop: '20px' }}>
                      {/* Coherence Analysis */}
                      {qualityAnalysis.metrics.coherence && (
                        <div style={{ 
                          background: 'rgba(79, 140, 255, 0.1)', 
                          padding: '12px', 
                          borderRadius: '8px', 
                          marginBottom: '12px',
                          border: '1px solid rgba(79, 140, 255, 0.2)'
                        }}>
                          <div style={{ fontWeight: 'bold', color: '#4f8cff', marginBottom: '8px' }}>
                            🔗 Coherence Analysis:
                          </div>
                          <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                            {qualityAnalysis.metrics.coherence.analysis || 'Logical flow and structure analysis'}
                          </div>
                        </div>
                      )}

                      {/* Relevance Analysis */}
                      {qualityAnalysis.metrics.relevance && (
                        <div style={{ 
                          background: 'rgba(16, 185, 129, 0.1)', 
                          padding: '12px', 
                          borderRadius: '8px', 
                          marginBottom: '12px',
                          border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                          <div style={{ fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
                            🎯 Relevance Analysis:
                          </div>
                          <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                            {qualityAnalysis.metrics.relevance.analysis || 'Audience and context relevance analysis'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Strengths and Weaknesses */}
                  <div style={{ marginTop: '20px' }}>
                    {qualityAnalysis.strengths && qualityAnalysis.strengths.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ color: '#10b981', marginBottom: '8px' }}>✅ Strengths:</h4>
                        <ul style={{ margin: '0', paddingLeft: '20px' }}>
                          {qualityAnalysis.strengths.map((strength, index) => (
                            <li key={index} style={{ marginBottom: '4px', color: '#374151' }}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {qualityAnalysis.weaknesses && qualityAnalysis.weaknesses.length > 0 && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ color: '#ef4444', marginBottom: '8px' }}>⚠️ Areas for Improvement:</h4>
                        <ul style={{ margin: '0', paddingLeft: '20px' }}>
                          {qualityAnalysis.weaknesses.map((weakness, index) => (
                            <li key={index} style={{ marginBottom: '4px', color: '#374151' }}>{weakness}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Suggestions */}
                  {qualityAnalysis.suggestions && qualityAnalysis.suggestions.length > 0 && (
                    <div className="suggestions">
                      <h4 style={{ color: '#4f8cff', marginBottom: '12px' }}>💡 Suggestions for Improvement:</h4>
                      <ul style={{ margin: '0', paddingLeft: '20px' }}>
                        {qualityAnalysis.suggestions.map((suggestion, index) => (
                          <li key={index} style={{ 
                            marginBottom: '8px', 
                            color: '#374151', 
                            lineHeight: '1.5',
                            fontSize: '14px'
                          }}>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Generation History - Categorized by Platform */}
          <div className="section history-section mobile-history-section">
            <h2>📚 Previous Posts by Platform</h2>
            <p style={{ margin: '0', color: '#666', fontSize: '14px', fontStyle: 'italic' }}>
              Your recently generated posts, grouped by platform. Click on any post to view the full content and copy it.
            </p>
            {isHistoryLoading ? (
              <div style={{ color: '#64748b', fontSize: '16px', padding: '24px 0' }}>Loading global history...</div>
            ) : historyError ? (
              <div style={{ color: '#ef4444', fontSize: '16px', padding: '24px 0' }}>{historyError}</div>
            ) : (
              <div style={{ marginTop: '24px' }}>
                {Object.entries(groupHistoryByPlatform(globalHistory)).length > 0 ? (
                  Object.entries(groupHistoryByPlatform(globalHistory)).map(([platformKey, posts]) => (
                    <div key={platformKey} style={{ marginBottom: '32px' }}>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2d3748', fontSize: '20px', fontWeight: '700' }}>
                        <span>{getPlatformIcon(platformKey)}</span>
                        <span>{platforms.find(p => p.value === platformKey)?.label || platformKey}</span>
                        <span style={{ color: '#718096', fontSize: '14px', fontWeight: '400', marginLeft: '8px' }}>({posts.length} post{posts.length > 1 ? 's' : ''})</span>
                      </h3>
                      <div className="history-list">
                        {posts.map((item, index) => (
                          <div key={item._id || item.id} className="history-item">
                            <div className="history-meta">
                              <span className="history-platform">
                                {getPlatformIcon(item.platform)} {platforms.find(p => p.value === item.platform)?.label}
                              </span>
                              <span className="history-type">
                                {postTypes.find(pt => pt.value === item.postType)?.label}
                              </span>
                              <span className="history-time">
                                {new Date(item.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <div className="history-content">
                              <div className="history-original">
                                <strong>Original:</strong> {item.original.substring(0, 100)}...
                              </div>
                              <div className="history-enhanced">
                                <strong>Enhanced:</strong> {item.enhanced.substring(0, 150)}...
                              </div>
                              <div className="history-length-info">
                                <div className="history-length-item">
                                  <span>📏 Target:</span> {item.length || 'N/A'} words
                                </div>
                                <div className="history-length-item">
                                  <span>🎭</span> {brandVoiceIntensities.find(bv => bv.value === item.brandVoiceIntensity)?.label || 'N/A'}
                                </div>
                                <div className="history-length-item">
                                  <span>🔥</span> {engagementUrgencies.find(eu => eu.value === item.engagementUrgency)?.label || 'N/A'}
                                </div>
                              </div>
                            </div>
                            <div className="history-actions">
                              <button 
                                onClick={() => {
                                  setContent(item.original);
                                  setEnhancedContent(item.enhanced);
                                  setPlatform(item.platform);
                                  setPostType(item.postType);
                                  setTone(item.tone);
                                  setTargetAudience(item.targetAudience);
                                  setContentStructure(item.contentStructure);
                                  setEngagementGoal(item.engagementGoal);
                                  setContentLength(item.contentLength || 'optimal');
                                  setBrandVoiceIntensity(item.brandVoiceIntensity);
                                  setEngagementUrgency(item.engagementUrgency);
                                  setSituation(item.situation);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} 
                                className="history-btn"
                                style={{ marginRight: '8px' }}
                              >
                                🔄 Load
                              </button>
                              <button 
                                onClick={() => copyToClipboard(item.enhanced)} 
                                className="history-btn"
                                style={{ marginRight: '8px' }}
                              >
                                📋 Copy
                              </button>
                              <button
                                onClick={() => openPreviewWindow(
                                  item.enhanced,
                                  item.platform,
                                  item.postType,
                                  item.tone,
                                  item.targetAudience
                                )}
                                className="history-btn preview"
                              >
                                👁️ Preview
                              </button>
                              <button
                                onClick={() => setModalPost(item)}
                                className="history-btn"
                              >
                                📄 View Full Post
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  // Show all platforms with empty state if no posts
                  platforms.map(p => (
                    <div key={p.value} style={{ marginBottom: '32px' }}>
                      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2d3748', fontSize: '20px', fontWeight: '700' }}>
                        <span>{p.icon}</span>
                        <span>{p.label}</span>
                        <span style={{ color: '#718096', fontSize: '14px', fontWeight: '400', marginLeft: '8px' }}>(0 posts)</span>
                      </h3>
                      <div className="history-list">
                        <div className="history-item" style={{ color: '#a0aec0', fontStyle: 'italic', padding: '18px 0', fontSize: '16px' }}>
                          No posts yet for {p.label}. Create a post above and it will appear here!
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Modal for full post view */}
            {modalPost && (
              <div 
                className="modal-overlay"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'fadeIn 0.3s ease-out',
                }}
                onClick={() => setModalPost(null)}
              >
                <div
                  className="modal-content"
                  style={{
                    padding: '48px 36px 36px 36px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '340px',
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className="modal-close-btn"
                    onClick={() => setModalPost(null)}
                    style={{
                      background: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px 22px',
                      fontSize: '18px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(239,68,68,0.25)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#dc2626';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#ef4444';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    ✖ Close
                  </button>
                  <h2 style={{
                    marginBottom: '16px',
                    color: '#3730a3',
                    fontSize: '2.1rem',
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}>
                    {getPlatformIcon(modalPost.platform)} {platforms.find(p => p.value === modalPost.platform)?.label} Post
                  </h2>
                  <div style={{ color: '#64748b', fontSize: '15px', marginBottom: '18px', fontWeight: 500 }}>
                    {new Date(modalPost.timestamp).toLocaleString()} • {postTypes.find(pt => pt.value === modalPost.postType)?.label}
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.98)',
                    border: '1.5px solid #c7d2fe',
                    borderRadius: '12px',
                    padding: '28px',
                    fontSize: '1.25rem',
                    color: '#1e293b',
                    whiteSpace: 'pre-wrap',
                    marginBottom: '24px',
                    lineHeight: 1.7,
                    fontWeight: 500,
                    boxShadow: '0 4px 20px rgba(102,126,234,0.12)',
                    wordBreak: 'break-word',
                    minHeight: '120px',
                  }}>
                    {modalPost.enhanced}
                  </div>
                  
                  {/* Original Content in Modal */}
                  <div style={{
                    background: '#f9fafb',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '24px',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#6b7280',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Original
                    </div>
                    <h4 style={{ 
                      color: '#6b7280', 
                      marginBottom: '12px',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>
                      📝 Original Content
                    </h4>
                    <div style={{
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#374151',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word'
                    }}>
                      {modalPost.original}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <button
                      onClick={() => copyToClipboard(modalPost.enhanced)}
                      style={{
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        padding: '12px 28px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(102,126,234,0.15)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#5a67d8';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(102,126,234,0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#667eea';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(102,126,234,0.15)';
                      }}
                    >
                      📋 Copy Post
                    </button>
                    <button
                      onClick={() => openPreviewWindow(
                        modalPost.enhanced,
                        modalPost.platform,
                        modalPost.postType,
                        modalPost.tone,
                        modalPost.targetAudience
                      )}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '12px 28px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(16,185,129,0.15)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#059669';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(16,185,129,0.25)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#10b981';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(16,185,129,0.15)';
                      }}
                    >
                      👁️ Preview in New Window
                    </button>
                    <button
                      onClick={() => setModalPost(null)}
                      style={{
                        background: '#e0e7ff',
                        color: '#3730a3',
                        border: 'none',
                        padding: '12px 28px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(102,126,234,0.12)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#c7d2fe';
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(102,126,234,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#e0e7ff';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(102,126,234,0.12)';
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Clear Button */}
          <div className="section clear-section-mobile">
            <button onClick={clearAll} className="clear-btn mobile-clear-btn">
              🗑️ Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPost; 