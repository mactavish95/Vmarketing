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
      setError('Please enter some content to enhance');
      return;
    }

    setIsGenerating(true);
    setError('');
    setEnhancedContent('');
    setQualityAnalysis(null);

    try {
      const selectedPlatform = platforms.find(p => p.value === platform);
      const selectedPostType = postTypes.find(pt => pt.value === postType);
      const selectedTone = tones.find(t => t.value === tone);
      const selectedAudience = audiences.find(a => a.value === targetAudience);
      const selectedStructure = contentStructures.find(cs => cs.value === contentStructure);
      const selectedGoal = engagementGoals.find(eg => eg.value === engagementGoal);
      const selectedLength = contentLengths.find(cl => cl.value === contentLength);
      const selectedVoice = brandVoiceIntensities.find(bv => bv.value === brandVoiceIntensity);
      const selectedUrgency = engagementUrgencies.find(eu => eu.value === engagementUrgency);
      const selectedSituation = situations.find(s => s.value === situation);

      const targetLength = calculateTargetLength();

      const prompt = `Create a well-structured, precise, and thoughtful Facebook post based on the following requirements:

ORIGINAL CONTENT: "${content}"

POST SPECIFICATIONS:
- Platform: Facebook (max ${selectedPlatform.maxLength} characters)
- Post Type: ${selectedPostType.label} - ${selectedPostType.description}
- Tone: ${selectedTone.label} - ${selectedTone.description}
- Target Audience: ${selectedAudience.label} - ${selectedAudience.description}
- Content Structure: ${selectedStructure.label} - ${selectedStructure.description}
- Engagement Goal: ${selectedGoal.label} - ${selectedGoal.description}

DYNAMIC LENGTH ADJUSTMENT:
- Content Length Preference: ${selectedLength.label} - ${selectedLength.description}
- Target Word Count: ${targetLength} words
- Brand Voice Intensity: ${selectedVoice.label} - ${selectedVoice.description}
- Engagement Urgency: ${selectedUrgency.label} - ${selectedUrgency.description}
- Situation: ${selectedSituation.label} - ${selectedSituation.description}

LENGTH OPTIMIZATION RULES:
1. TARGET LENGTH: Aim for exactly ${targetLength} words (±5 words)
2. BRAND VOICE: Apply ${selectedVoice.label} brand voice intensity throughout
3. ENGAGEMENT: Use ${selectedUrgency.label} urgency level for call-to-action
4. SITUATION: Adapt content style for ${selectedSituation.label} context
5. PLATFORM: Optimize for Facebook's algorithm and user behavior

FACEBOOK OPTIMIZATION REQUIREMENTS:
1. STRUCTURE: Use the ${selectedStructure.label} format with clear sections
2. OPENING: Start with a compelling hook that grabs attention in the first 2-3 lines
3. BODY: Develop the main content with logical flow and easy-to-read paragraphs
4. ENGAGEMENT: Include a call-to-action that encourages ${selectedGoal.label.toLowerCase()}
5. HASHTAGS: Add 3-5 relevant hashtags at the end (if appropriate for the post type)
6. READABILITY: Use short paragraphs, bullet points, or numbered lists when appropriate
7. PERSONALITY: Match the ${selectedTone.label} tone throughout
8. AUDIENCE: Tailor language and examples for ${selectedAudience.label} audience

LENGTH ADJUSTMENT GUIDELINES:
- If ${selectedLength.label}: Focus on ${selectedLength.description}
- Brand voice ${selectedVoice.label}: ${selectedVoice.description}
- Engagement ${selectedUrgency.label}: ${selectedUrgency.description}
- Situation ${selectedSituation.label}: ${selectedSituation.description}

Please create a Facebook post that is:
- Exactly ${targetLength} words (±5 words)
- Well-structured with clear beginning, middle, and end
- Precise in its messaging and purpose
- Thoughtful in its approach to the audience
- Optimized for Facebook engagement
- Professional yet authentic in tone
- Adapted for ${selectedSituation.label} situation

Provide only the enhanced Facebook post content, no explanations.`;

      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;

      const response = await fetch(`${baseURL}/llama`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: prompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate enhanced content');
      }

      const data = await response.json();
      
      if (data.success) {
        setEnhancedContent(data.response);
        
        // Add to generation history
        const historyItem = {
          id: Date.now(),
          original: content,
          enhanced: data.response,
          platform,
          postType,
          tone,
          targetAudience,
          contentStructure,
          engagementGoal,
          contentLength,
          brandVoiceIntensity,
          engagementUrgency,
          situation,
          targetLength,
          actualLength: data.response.split(' ').length,
          timestamp: new Date().toISOString()
        };
        setGenerationHistory(prev => [historyItem, ...prev.slice(0, 9)]); // Keep last 10
        
        // Analyze quality
        await analyzeQuality(data.response);
      } else {
        setError(data.error || 'Failed to generate enhanced content');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeQuality = async (text) => {
    if (!text.trim()) return;

    setIsEnhancing(true);
    try {
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;

      const response = await fetch(`${baseURL}/analyze-response-quality`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response: text,
          contentType: 'facebook_post',
          context: { 
            platform, 
            postType, 
            tone, 
            targetAudience, 
            contentStructure, 
            engagementGoal,
            targetLength: calculateTargetLength(),
            brandVoiceIntensity,
            engagementUrgency,
            situation
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setQualityAnalysis(data.qualityAnalysis);
        }
      }
    } catch (error) {
      console.warn('Quality analysis failed:', error);
    } finally {
      setIsEnhancing(false);
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

  const selectedPlatform = platforms.find(p => p.value === platform);
  const characterCount = enhancedContent.length;
  const isOverLimit = characterCount > selectedPlatform.maxLength;

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
                  <div className="quality-overview">
                    <div className="quality-score">
                      <span className="score-number" style={{ color: getQualityColor(qualityAnalysis.overallScore) }}>
                        {Math.round(qualityAnalysis.overallScore * 100)}
                      </span>
                      <span className="score-label">{getQualityLabel(qualityAnalysis.overallScore)}</span>
                    </div>
                    <div className="quality-metrics">
                      {Object.entries(qualityAnalysis.metrics).map(([metric, score]) => (
                        <div key={metric} className="metric-item">
                          <span className="metric-label">{metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                          <span className="metric-score" style={{ color: getQualityColor(score) }}>
                            {Math.round(score * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {qualityAnalysis.suggestions && qualityAnalysis.suggestions.length > 0 && (
                    <div className="suggestions">
                      <h4>💡 Improvement Suggestions</h4>
                      <ul>
                        {qualityAnalysis.suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
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
              <h2>📚 Generation History</h2>
              <div className="history-list">
                {generationHistory.map(item => (
                  <div key={item.id} className="history-item">
                    <div className="history-meta">
                      <span className="history-platform">{getPlatformIcon(item.platform)} {platforms.find(p => p.value === item.platform)?.label}</span>
                      <span className="history-type">{postTypes.find(pt => pt.value === item.postType)?.label}</span>
                      <span className="history-time">{new Date(item.timestamp).toLocaleString()}</span>
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
                          <span>📏 Target:</span> {item.targetLength || 'N/A'} words
                        </div>
                        <div className="history-length-item">
                          <span>📊 Actual:</span> {item.actualLength || 'N/A'} words
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
                      <button onClick={() => copyToClipboard(item.enhanced)} className="history-btn">
                        📋 Copy
                      </button>
                      <button onClick={() => {
                        setContent(item.original);
                        setPlatform(item.platform);
                        setPostType(item.postType);
                        setTone(item.tone);
                        setTargetAudience(item.targetAudience);
                        setContentStructure(item.contentStructure);
                        setEngagementGoal(item.engagementGoal);
                        setContentLength(item.contentLength || 'optimal');
                        setBrandVoiceIntensity(item.brandVoiceIntensity || 'moderate');
                        setEngagementUrgency(item.engagementUrgency || 'normal');
                        setSituation(item.situation || 'general');
                        setCustomLength(item.customLength || 100);
                      }} className="history-btn">
                        🔄 Reuse
                      </button>
                    </div>
                  </div>
                ))}
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