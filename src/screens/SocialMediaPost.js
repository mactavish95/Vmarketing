import React, { useState, useEffect } from 'react';
import apiConfig from '../config/api';
import './SocialMediaPost.css';

// [EXTRACT] Move all option/selector UI (platform, post type, tone, audience, content structure, engagement goal, length, brand voice, urgency, situation, advanced options) into a new component SocialMediaPostOptions.js
import SocialMediaPostOptions from '../components/SocialMediaPostOptions';
import SocialMediaPostResult from '../components/SocialMediaPostResult';
import ModelInfo from '../components/ModelInfo';

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
    { value: 'instagram', label: 'Instagram', icon: '📸', maxLength: 2200, priority: true },
    { value: 'tiktok', label: 'TikTok', icon: '🎵', maxLength: 150, priority: true },
    { value: 'twitter', label: 'Twitter/X', icon: '🐦', maxLength: 280 },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼', maxLength: 3000 },
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
      {/* Page Header/Description */}
      <div className="page-header" style={{
        background: 'linear-gradient(135deg, #4f8cff 0%, #38e8ff 100%)',
        padding: '48px 32px',
        textAlign: 'center',
        borderRadius: '24px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
        
        <div style={{ 
          fontSize: '64px', 
          marginBottom: '20px', 
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
          animation: 'fadeIn 0.8s ease-out'
        }}>
          📱
        </div>
        <h1 style={{
          margin: '0 0 16px 0',
          fontWeight: '800',
          fontSize: '42px',
          letterSpacing: '-0.5px',
          color: '#fff',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          lineHeight: '1.1',
          animation: 'fadeIn 0.8s ease-out 0.1s both'
        }}>
          Social Media Post Generator
        </h1>
        <p style={{
          margin: '0 0 32px 0',
          fontSize: '20px',
          opacity: '0.95',
          color: '#fff',
          fontWeight: '500',
          lineHeight: '1.4',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          animation: 'fadeIn 0.8s ease-out 0.2s both'
        }}>
          Create engaging, platform-optimized social media content with AI-powered enhancement
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          animation: 'fadeIn 0.8s ease-out 0.3s both'
        }}>
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '25px',
            fontSize: '15px',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}>
            ✨ AI Enhanced
          </span>
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '25px',
            fontSize: '15px',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}>
            📊 Quality Analysis
          </span>
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '25px',
            fontSize: '15px',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}>
            🎯 Platform Optimized
          </span>
          <span style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '25px',
            fontSize: '15px',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}>
            💡 Smart Suggestions
          </span>
        </div>
      </div>

      {/* Model Info at the top */}
      <div style={{ marginBottom: 24 }}>
        <ModelInfo useCase="social_media" platform={platform} />
      </div>
      {/* Option/Selector UI */}
      <SocialMediaPostOptions
        platforms={platforms}
        platform={platform}
        setPlatform={setPlatform}
        postTypes={postTypes}
        postType={postType}
        setPostType={setPostType}
        tones={tones}
        tone={tone}
        setTone={setTone}
        audiences={audiences}
        targetAudience={targetAudience}
        setTargetAudience={setTargetAudience}
        contentStructures={contentStructures}
        contentStructure={contentStructure}
        setContentStructure={setContentStructure}
        engagementGoals={engagementGoals}
        engagementGoal={engagementGoal}
        setEngagementGoal={setEngagementGoal}
        contentLengths={contentLengths}
        contentLength={contentLength}
        setContentLength={setContentLength}
        customLength={customLength}
        setCustomLength={setCustomLength}
        brandVoiceIntensities={brandVoiceIntensities}
        brandVoiceIntensity={brandVoiceIntensity}
        setBrandVoiceIntensity={setBrandVoiceIntensity}
        engagementUrgencies={engagementUrgencies}
        engagementUrgency={engagementUrgency}
        setEngagementUrgency={setEngagementUrgency}
        situations={situations}
        situation={situation}
        setSituation={setSituation}
        showAdvancedOptions={showAdvancedOptions}
        setShowAdvancedOptions={setShowAdvancedOptions}
      />

      {/* Content Input Section */}
      <div className="section content-input-section">
        <label htmlFor="content-input" className="content-label">
          ✍️ Enter your post idea or draft below:
        </label>
        <textarea
          id="content-input"
          className="content-input"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Type your post idea, story, or draft here..."
          rows={5}
          style={{ width: '100%', marginBottom: 12, fontSize: 16, padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', resize: 'vertical' }}
        />
        {/* Suggestions Section */}
        {showSuggestions && (
          <div className="suggestions-section" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>💡 Need inspiration? Try one of these:</div>
            <div className="suggestions-list" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {getFollowUpSuggestions().map((suggestion, idx) => (
                <button
                  key={idx}
                  className="suggestion-btn"
                  style={{ background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 6, padding: '6px 12px', fontSize: 14, cursor: 'pointer' }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <button
              className="toggle-suggestions-btn"
              style={{ marginTop: 8, fontSize: 13, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={toggleSuggestions}
            >
              {showSuggestions ? 'Hide suggestions' : 'Show suggestions'}
            </button>
          </div>
        )}
        {/* Error Message */}
        {error && (
          <div className="error-message" style={{ color: '#ef4444', marginBottom: 8, fontWeight: 500 }}>{error}</div>
        )}
        {/* Action Buttons */}
        <div className="content-actions" style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            className="generate-btn"
            style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}
            onClick={generateContent}
            disabled={isGenerating || !content.trim()}
          >
            {isGenerating ? 'Generating...' : '✨ Generate Post'}
          </button>
          <button
            className="clear-btn"
            style={{ background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}
            onClick={clearAll}
            disabled={isGenerating && !content.trim()}
          >
            Clear
          </button>
        </div>
      </div>

      <SocialMediaPostResult
        enhancedContent={enhancedContent}
        reviewedContent={reviewedContent}
        isReviewing={isReviewing}
        showOriginalContent={showOriginalContent}
        setShowOriginalContent={setShowOriginalContent}
        showComparison={showComparison}
        setShowComparison={setShowComparison}
        content={content}
        platform={platform}
        postType={postType}
        tone={tone}
        targetAudience={targetAudience}
        getPlatformIcon={getPlatformIcon}
        getToneIcon={getToneIcon}
        getAudienceIcon={getAudienceIcon}
        tones={tones}
        audiences={audiences}
        platforms={platforms}
        selectedPlatform={platforms.find(p => p.value === platform)}
        isOverLimit={enhancedContent.length > (platforms.find(p => p.value === platform)?.maxLength || 1000)}
        qualityAnalysis={qualityAnalysis}
        copyToClipboard={copyToClipboard}
        openPreviewWindow={openPreviewWindow}
        generationHistory={generationHistory}
        setContent={setContent}
        setEnhancedContent={setEnhancedContent}
        setPlatform={setPlatform}
        setPostType={setPostType}
        setTone={setTone}
        setTargetAudience={setTargetAudience}
        setContentStructure={setContentStructure}
        setEngagementGoal={setEngagementGoal}
        setContentLength={setContentLength}
        setBrandVoiceIntensity={setBrandVoiceIntensity}
        setEngagementUrgency={setEngagementUrgency}
        setSituation={setSituation}
        postTypes={postTypes}
        brandVoiceIntensities={brandVoiceIntensities}
        engagementUrgencies={engagementUrgencies}
        situations={situations}
        modalPost={modalPost}
        setModalPost={setModalPost}
        globalHistory={globalHistory}
        isHistoryLoading={isHistoryLoading}
        historyError={historyError}
        groupHistoryByPlatform={groupHistoryByPlatform}
      />
    </div>
  );
};

export default SocialMediaPost; 