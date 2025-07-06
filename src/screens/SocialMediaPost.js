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

    try {
      const targetLength = calculateTargetLength();
      
      // Enhanced prompt focusing on coherence and relevance
      const enhancedPrompt = `You are an expert social media content creator specializing in ${platform} posts. Your goal is to create content that is:

**COHERENCE & CLARITY:**
- Write with a clear, logical flow that's easy to follow
- Use simple, direct language that anyone can understand
- Structure content with a clear beginning, middle, and end
- Avoid jargon and complex sentences
- Make each sentence build naturally on the previous one

**RELEVANCE & ENGAGEMENT:**
- Ensure every word serves a purpose and adds value
- Make content immediately relevant to your target audience: ${targetAudience}
- Create a strong hook that captures attention in the first few words
- Include specific details that make the content relatable and authentic
- Use the ${tone} tone consistently throughout

**CONTENT STRUCTURE:**
- Platform: ${platform} (${postType} post)
- Target length: ${targetLength} words
- Content structure: ${contentStructure}
- Engagement goal: ${engagementGoal}
- Brand voice intensity: ${brandVoiceIntensity}
- Situation context: ${situation}

**ORIGINAL CONTENT TO ENHANCE:**
${content}

**INSTRUCTIONS:**
1. Transform this into a ${platform}-optimized post that's ${targetLength} words
2. Use the ${contentStructure} structure for maximum impact
3. Apply ${tone} tone consistently
4. Target ${targetAudience} audience specifically
5. Focus on ${engagementGoal} as the primary goal
6. Ensure every sentence flows logically to the next
7. Make the content immediately understandable and relatable
8. Include a clear call-to-action that fits the ${engagementGoal}
9. Add relevant hashtags for ${platform} (${hashtags ? 'incorporate these hashtags: ' + hashtags : 'suggest appropriate hashtags'})

**QUALITY REQUIREMENTS:**
- Coherence: Each paragraph should connect seamlessly to the next
- Relevance: Every detail should matter to the target audience
- Clarity: Use simple, powerful words that convey meaning instantly
- Engagement: Create content that encourages interaction and sharing
- Authenticity: Make it feel genuine and personal, not generic

Generate a post that feels like it was written by someone who truly understands and cares about their audience.`;

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
        const generatedContent = data.response;
        setEnhancedContent(generatedContent);
        
        // Add to generation history
        const historyItem = {
          id: Date.now(),
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
        
        setGenerationHistory(prev => [historyItem, ...prev.slice(0, 9)]);
        
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
      
      const analysisPrompt = `Analyze this social media content for quality, with special focus on COHERENCE and RELEVANCE:

**CONTENT TO ANALYZE:**
${text}

**ANALYSIS CONTEXT:**
- Platform: ${platform}
- Target Audience: ${targetAudience}
- Tone: ${tone}
- Engagement Goal: ${engagementGoal}
- Content Structure: ${contentStructure}

**FOCUS ON THESE KEY METRICS:**

1. **COHERENCE (40% weight)** - How well does the content flow logically?
   - Logical progression from start to finish
   - Clear connections between sentences and paragraphs
   - Consistent tone and voice throughout
   - Easy to follow narrative structure

2. **RELEVANCE (30% weight)** - How relevant is the content to the target audience?
   - Addresses audience needs and interests
   - Uses language and examples the audience understands
   - Provides value specific to the target demographic
   - Aligns with audience expectations and preferences

3. **CLARITY (15% weight)** - How easy is the content to understand?
   - Simple, direct language
   - Clear main message
   - No confusing or ambiguous statements
   - Appropriate vocabulary for the audience

4. **ENGAGEMENT (15% weight)** - How likely is it to engage the audience?
   - Compelling opening hook
   - Clear call-to-action
   - Encourages interaction and sharing
   - Maintains interest throughout

**PROVIDE DETAILED ANALYSIS WITH:**
- Overall quality score (0-100)
- Individual scores for each metric
- Specific strengths and weaknesses
- Actionable suggestions for improvement
- Focus especially on coherence and relevance issues

Format as JSON with these fields:
{
  "overallScore": number,
  "metrics": {
    "coherence": { "score": number, "analysis": "detailed explanation" },
    "relevance": { "score": number, "analysis": "detailed explanation" },
    "clarity": { "score": number, "analysis": "detailed explanation" },
    "engagement": { "score": number, "analysis": "detailed explanation" }
  },
  "strengths": ["list of specific strengths"],
  "weaknesses": ["list of specific areas for improvement"],
  "suggestions": ["specific actionable suggestions"]
}`;

      const response = await fetch(`${baseURL}/analyze-response-quality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: analysisPrompt,
          contentType: 'social_media',
          context: {
            platform,
            targetAudience,
            tone,
            engagementGoal,
            contentStructure
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setQualityAnalysis(data.analysis);
      } else {
        console.warn('Quality analysis failed:', data.error);
      }
    } catch (err) {
      console.error('Quality analysis error:', err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Content copied to clipboard!');
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

  return (
    <div className="social-media-post">
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
          <div className="section">
            <h2>📱 Platform Selection</h2>
            <div className="platform-grid">
              {platforms.map(p => (
                <button
                  key={p.value}
                  className={`platform-option ${platform === p.value ? 'active' : ''} ${p.priority ? 'priority' : ''}`}
                  onClick={() => setPlatform(p.value)}
                >
                  <span className="platform-icon">{p.icon}</span>
                  <span className="platform-label">{p.label}</span>
                  {p.priority && <span className="priority-badge">Recommended</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div className="section">
            <h2>✍️ Your Content</h2>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your original content here... What would you like to share on Facebook?"
              rows={6}
              className="content-input"
            />
            <div className="input-stats">
              <span>Characters: {content.length}</span>
              <span>Words: {content.split(/\s+/).filter(word => word.length > 0).length}</span>
            </div>
          </div>

          {/* Follow-up Question Suggestions */}
          <div className="section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2>💡 Need Ideas? Get Inspired!</h2>
              <button
                onClick={toggleSuggestions}
                className={`suggestions-toggle ${showSuggestions ? 'active' : ''}`}
              >
                <span>{showSuggestions ? '🙈' : '💡'}</span>
                {showSuggestions ? 'Hide Suggestions' : 'Show Suggestions'}
              </button>
            </div>
            
            {showSuggestions && (
              <div className="suggestions-container">
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
          <div className="section">
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
          <div className="section">
            <button
              className="generate-btn"
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
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Enhanced Content */}
          {enhancedContent && (
            <div className="section result-section">
              <h2>✨ Enhanced Facebook Post</h2>
              
              <div className="post-preview">
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
                
                <div className={`preview-content ${isOverLimit ? 'over-limit' : ''}`}>
                  <pre>{enhancedContent}</pre>
                </div>
                
                <div className="preview-footer">
                  <div className="character-count">
                    Characters: {characterCount}/{selectedPlatform.maxLength}
                    {isOverLimit && <span className="limit-warning">⚠️ Over character limit</span>}
                  </div>
                  <div className="preview-actions">
                    <button onClick={() => copyToClipboard(enhancedContent)} className="action-btn">
                      📋 Copy Post
                    </button>
                    <button onClick={() => copyToClipboard(enhancedContent + '\n\n' + hashtags)} className="action-btn">
                      📋 Copy with Hashtags
                    </button>
                  </div>
                </div>
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

          {/* Generation History */}
          {generationHistory.length > 0 && (
            <div className="section history-section">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '16px' 
              }}>
                <div>
                  <h2>📚 Previous Posts</h2>
                  <p style={{ 
                    margin: '0', 
                    color: '#666', 
                    fontSize: '14px',
                    fontStyle: 'italic'
                  }}>
                    Your recently generated posts. Click on any post to view the full content and copy it.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all previous posts? This action cannot be undone.')) {
                      setGenerationHistory([]);
                    }
                  }}
                  style={{
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#dc2626';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#ef4444';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  🗑️ Clear History
                </button>
              </div>
              
              <div className="history-list">
                {generationHistory.map((item, index) => (
                  <div key={item.id} className="history-item">
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
                          // Scroll to top
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
                      >
                        📋 Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Full Post Viewer */}
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ 
                  marginBottom: '16px', 
                  color: '#2d3748',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  📖 View Full Previous Posts
                </h3>
                <p style={{ 
                  marginBottom: '16px', 
                  color: '#666', 
                  fontSize: '13px',
                  fontStyle: 'italic'
                }}>
                  Click on any card below to open the full post in a new window for easy reading and copying.
                </p>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '16px' 
                }}>
                  {generationHistory.slice(0, 6).map((item, index) => (
                    <div key={item.id} style={{
                      background: '#f8f9fa',
                      border: '1px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                    onClick={() => {
                      // Show full post in a modal-like view
                      const fullPost = window.open('', '_blank', 'width=600,height=800');
                      fullPost.document.write(`
                        <html>
                          <head>
                            <title>Previous Post - ${new Date(item.timestamp).toLocaleDateString()}</title>
                            <style>
                              body { 
                                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                                margin: 20px; 
                                line-height: 1.6;
                                background: #f8f9fa;
                              }
                              .post-container {
                                background: white;
                                padding: 24px;
                                border-radius: 12px;
                                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                                max-width: 500px;
                                margin: 0 auto;
                              }
                              .post-header {
                                border-bottom: 1px solid #e9ecef;
                                padding-bottom: 12px;
                                margin-bottom: 16px;
                              }
                              .post-meta {
                                font-size: 12px;
                                color: #6c757d;
                                margin-bottom: 8px;
                              }
                              .post-content {
                                white-space: pre-wrap;
                                font-size: 14px;
                                color: #2d3748;
                              }
                              .post-actions {
                                margin-top: 16px;
                                padding-top: 12px;
                                border-top: 1px solid #e9ecef;
                              }
                              .action-btn {
                                background: #667eea;
                                color: white;
                                border: none;
                                padding: 8px 16px;
                                border-radius: 6px;
                                cursor: pointer;
                                margin-right: 8px;
                                font-size: 12px;
                              }
                              .action-btn:hover {
                                background: #5a67d8;
                              }
                            </style>
                          </head>
                          <body>
                            <div class="post-container">
                              <div class="post-header">
                                <div class="post-meta">
                                  ${getPlatformIcon(item.platform)} ${platforms.find(p => p.value === item.platform)?.label} • 
                                  ${postTypes.find(pt => pt.value === item.postType)?.label} • 
                                  ${new Date(item.timestamp).toLocaleString()}
                                </div>
                                <h3>Generated Post</h3>
                              </div>
                              <div class="post-content">${item.enhanced}</div>
                              <div class="post-actions">
                                <button class="action-btn" onclick="navigator.clipboard.writeText('${item.enhanced.replace(/'/g, "\\'")}').then(() => alert('Copied!'))">
                                  📋 Copy Post
                                </button>
                                <button class="action-btn" onclick="window.close()">
                                  ❌ Close
                                </button>
                              </div>
                            </div>
                          </body>
                        </html>
                      `);
                    }}
                    >
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#667eea',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        #{index + 1}
                      </div>
                      
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#6c757d',
                          fontWeight: '500'
                        }}>
                          {getPlatformIcon(item.platform)} {platforms.find(p => p.value === item.platform)?.label}
                        </span>
                        <span style={{ 
                          fontSize: '12px', 
                          color: '#6c757d',
                          marginLeft: '8px'
                        }}>
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div style={{
                        fontSize: '13px',
                        color: '#495057',
                        lineHeight: '1.4',
                        maxHeight: '60px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {item.enhanced}
                      </div>
                      
                      <div style={{
                        marginTop: '8px',
                        fontSize: '11px',
                        color: '#6c757d'
                      }}>
                        📏 {item.length || 'N/A'} words • 
                        🎭 {brandVoiceIntensities.find(bv => bv.value === item.brandVoiceIntensity)?.label || 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Clear Button */}
          <div className="section">
            <button onClick={clearAll} className="clear-btn">
              🗑️ Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPost; 