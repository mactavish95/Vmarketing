import React, { useState, useEffect } from 'react';
import apiConfig from '../config/api';
import './SocialMediaPost.css';
import { useTranslation } from 'react-i18next';

// [EXTRACT] Move all option/selector UI (platform, post type, tone, audience, content structure, engagement goal, length, brand voice, urgency, situation, advanced options) into a new component SocialMediaPostOptions.js
import SocialMediaPostOptions from '../components/SocialMediaPostOptions';
import SocialMediaPostResult from '../components/SocialMediaPostResult';
import formatInstagramContent from '../utils/formatInstagramContent';

const SocialMediaPost = () => {
  const { t } = useTranslation();
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

  // Platform-specific content length options
  const getContentLengths = (platform) => {
    const baseLengths = [
      { value: 'concise', label: t('socialMedia.contentLengths.concise'), description: t('socialMedia.descriptions.concise') },
      { value: 'optimal', label: t('socialMedia.contentLengths.optimal'), description: t('socialMedia.descriptions.optimal') },
      { value: 'detailed', label: t('socialMedia.contentLengths.detailed'), description: t('socialMedia.descriptions.detailed') },
      { value: 'comprehensive', label: t('socialMedia.contentLengths.comprehensive'), description: t('socialMedia.descriptions.comprehensive') },
      { value: 'custom', label: t('socialMedia.contentLengths.custom'), description: t('socialMedia.descriptions.custom') }
    ];

         const platformSpecific = {
       facebook: [
         { value: 'concise', label: t('socialMedia.contentLengths.concise'), targetWords: 40, description: 'Short and engaging (40-60 words) - Perfect for quick updates and announcements', icon: '📝' },
         { value: 'optimal', label: t('socialMedia.contentLengths.optimal'), targetWords: 80, description: 'Story-driven content (80-120 words) - Ideal for personal stories and community engagement', icon: '📖' },
         { value: 'detailed', label: t('socialMedia.contentLengths.detailed'), targetWords: 150, description: 'Comprehensive posts (150-200 words) - Great for detailed updates and educational content', icon: '📊' },
         { value: 'comprehensive', label: t('socialMedia.contentLengths.comprehensive'), targetWords: 250, description: 'In-depth content (250-350 words) - Perfect for thought leadership and detailed stories', icon: '📚' },
         { value: 'custom', label: t('socialMedia.contentLengths.custom'), targetWords: customLength, description: 'Specify exact word count for Facebook', icon: '⚙️' }
       ],
             instagram: [
         { value: 'concise', label: t('socialMedia.contentLengths.concise'), targetWords: 25, description: 'Caption-focused (25-40 words) - Short, punchy captions with emojis and hashtags', icon: '📸' },
         { value: 'optimal', label: t('socialMedia.contentLengths.optimal'), targetWords: 60, description: 'Story captions (60-90 words) - Engaging captions with bullet points and visual appeal', icon: '📱' },
         { value: 'detailed', label: t('socialMedia.contentLengths.detailed'), targetWords: 120, description: 'Carousel captions (120-180 words) - Detailed captions for multi-image posts', icon: '🖼️' },
         { value: 'comprehensive', label: t('socialMedia.contentLengths.comprehensive'), targetWords: 200, description: 'IGTV descriptions (200-300 words) - Longer descriptions for video content', icon: '📺' },
         { value: 'custom', label: t('socialMedia.contentLengths.custom'), targetWords: customLength, description: 'Specify exact word count for Instagram', icon: '⚙️' }
       ],
             linkedin: [
         { value: 'concise', label: t('socialMedia.contentLengths.concise'), targetWords: 50, description: 'Professional updates (50-80 words) - Brief professional announcements and updates', icon: '💼' },
         { value: 'optimal', label: t('socialMedia.contentLengths.optimal'), targetWords: 100, description: 'Industry insights (100-150 words) - Professional insights and thought leadership', icon: '🧠' },
         { value: 'detailed', label: t('socialMedia.contentLengths.detailed'), targetWords: 200, description: 'Professional stories (200-300 words) - Detailed professional experiences and case studies', icon: '📊' },
         { value: 'comprehensive', label: t('socialMedia.contentLengths.comprehensive'), targetWords: 400, description: 'Article previews (400-600 words) - Comprehensive professional content and insights', icon: '📄' },
         { value: 'custom', label: t('socialMedia.contentLengths.custom'), targetWords: customLength, description: 'Specify exact word count for LinkedIn', icon: '⚙️' }
       ]
    };

    return platformSpecific[platform] || baseLengths;
  };

  // Get content lengths for current platform
  const contentLengths = getContentLengths(platform);

  // Brand voice intensity options
  const brandVoiceIntensities = [
    { value: 'subtle', label: t('socialMedia.brandVoiceIntensities.subtle'), description: t('socialMedia.descriptions.subtle') },
    { value: 'moderate', label: t('socialMedia.brandVoiceIntensities.moderate'), description: t('socialMedia.descriptions.moderate') },
    { value: 'strong', label: t('socialMedia.brandVoiceIntensities.strong'), description: t('socialMedia.descriptions.strong') },
    { value: 'dominant', label: t('socialMedia.brandVoiceIntensities.dominant'), description: t('socialMedia.descriptions.dominant') }
  ];

  // Engagement urgency options
  const engagementUrgencies = [
    { value: 'low', label: t('socialMedia.engagementUrgencies.low'), description: t('socialMedia.descriptions.low') },
    { value: 'normal', label: t('socialMedia.engagementUrgencies.normal'), description: t('socialMedia.descriptions.normal') },
    { value: 'high', label: t('socialMedia.engagementUrgencies.high'), description: t('socialMedia.descriptions.high') },
    { value: 'urgent', label: t('socialMedia.engagementUrgencies.urgent'), description: t('socialMedia.descriptions.urgent') }
  ];

  // Situation options
  const situations = [
    { value: 'general', label: t('socialMedia.situations.general'), description: t('socialMedia.descriptions.general') },
    { value: 'promotional', label: t('socialMedia.situations.promotional'), description: t('socialMedia.descriptions.promotional') },
    { value: 'crisis', label: t('socialMedia.situations.crisis'), description: t('socialMedia.descriptions.crisis') },
    { value: 'celebration', label: t('socialMedia.situations.celebration'), description: t('socialMedia.descriptions.celebration') },
    { value: 'educational', label: t('socialMedia.situations.educational'), description: t('socialMedia.descriptions.educational') },
    { value: 'community', label: t('socialMedia.situations.community'), description: t('socialMedia.descriptions.community') },
    { value: 'trending', label: t('socialMedia.situations.trending'), description: t('socialMedia.descriptions.trending') },
    { value: 'seasonal', label: t('socialMedia.situations.seasonal'), description: t('socialMedia.descriptions.seasonal') }
  ];

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
    { value: 'facebook', label: t('socialMedia.platforms.facebook'), icon: '📘', maxLength: 63206, priority: true, 
      features: ['Stories', 'Groups', 'Live Video', 'Events', 'Marketplace'],
      bestPractices: ['Engage with comments', 'Use native video', 'Post at peak times', 'Include call-to-action'],
      audienceTypes: ['Friends & Family', 'Local Community', 'Interest Groups', 'Business Pages']
    },
    { value: 'instagram', label: t('socialMedia.platforms.instagram'), icon: '📸', maxLength: 2200, priority: true,
      features: ['Stories', 'Reels', 'IGTV', 'Shopping', 'Live Streams'],
      bestPractices: ['Use high-quality visuals', 'Include relevant hashtags', 'Post consistently', 'Engage with stories'],
      audienceTypes: ['Visual Creators', 'Lifestyle Enthusiasts', 'Young Professionals', 'Brand Followers']
    },
    { value: 'linkedin', label: t('socialMedia.platforms.linkedin'), icon: '💼', maxLength: 3000, priority: true,
      features: ['Articles', 'Company Pages', 'Professional Groups', 'Networking', 'Job Posts'],
      bestPractices: ['Share professional insights', 'Use industry hashtags', 'Engage with connections', 'Post during business hours'],
      audienceTypes: ['Professionals', 'Industry Leaders', 'Job Seekers', 'Business Decision Makers']
    },
    { value: 'tiktok', label: t('socialMedia.platforms.tiktok'), icon: '🎵', maxLength: 150 },
    { value: 'twitter', label: t('socialMedia.platforms.twitter'), icon: '🐦', maxLength: 280 },
    { value: 'youtube', label: t('socialMedia.platforms.youtube'), icon: '📺', maxLength: 5000 }
  ];

  // Platform-specific post types
  const getPostTypes = (platform) => {
    const baseTypes = [
    { value: 'general', label: t('socialMedia.postTypes.general'), icon: '📝', description: t('socialMedia.descriptions.generalPost') },
    { value: 'story', label: t('socialMedia.postTypes.story'), icon: '📖', description: t('socialMedia.descriptions.storyPersonal') },
    { value: 'educational', label: t('socialMedia.postTypes.educational'), icon: '📚', description: t('socialMedia.descriptions.educational') },
    { value: 'promotional', label: t('socialMedia.postTypes.promotional'), icon: '🎯', description: t('socialMedia.descriptions.promotional') },
    { value: 'community', label: t('socialMedia.postTypes.community'), icon: '🤝', description: t('socialMedia.descriptions.community') },
    { value: 'inspirational', label: t('socialMedia.postTypes.inspirational'), icon: '✨', description: t('socialMedia.descriptions.inspirational') },
    { value: 'question', label: t('socialMedia.postTypes.question'), icon: '❓', description: t('socialMedia.descriptions.questionPoll') },
    { value: 'announcement', label: t('socialMedia.postTypes.announcement'), icon: '📢', description: t('socialMedia.descriptions.announcement') }
  ];

    const platformSpecific = {
      facebook: [
        { value: 'event', label: 'Event Promotion', icon: '📅', description: 'Promote upcoming events, workshops, or meetups' },
        { value: 'live', label: 'Live Video', icon: '📺', description: 'Announce or promote live streaming content' },
        { value: 'group', label: 'Group Discussion', icon: '👥', description: 'Content specifically for Facebook groups' },
        { value: 'marketplace', label: 'Marketplace Listing', icon: '🛍️', description: 'Promote products or services for sale' }
      ],
      instagram: [
        { value: 'reel', label: 'Reel Promotion', icon: '🎬', description: 'Promote or introduce Instagram Reels content' },
        { value: 'story', label: 'Story Content', icon: '📱', description: 'Content designed for Instagram Stories' },
        { value: 'igtv', label: 'IGTV Episode', icon: '📺', description: 'Promote longer video content on IGTV' },
        { value: 'shopping', label: 'Shopping Post', icon: '🛒', description: 'Product-focused content with shopping features' }
      ],
      linkedin: [
        { value: 'article', label: 'Article Preview', icon: '📄', description: 'Introduce or promote LinkedIn articles' },
        { value: 'career', label: 'Career Update', icon: '💼', description: 'Professional achievements and career milestones' },
        { value: 'industry', label: 'Industry Insight', icon: '🏭', description: 'Share industry trends and professional insights' },
        { value: 'networking', label: 'Networking', icon: '🤝', description: 'Connect with other professionals' }
      ]
    };

    return [...baseTypes, ...(platformSpecific[platform] || [])];
  };

  // Platform-specific content structures
  const getContentStructures = (platform) => {
    const baseStructures = [
    { value: 'story', label: t('socialMedia.contentStructures.story'), icon: '📖', description: t('socialMedia.descriptions.storyFormat') },
    { value: 'problem-solution', label: t('socialMedia.contentStructures.problemSolution'), icon: '🔧', description: t('socialMedia.descriptions.problemSolution') },
    { value: 'list', label: t('socialMedia.contentStructures.list'), icon: '📋', description: t('socialMedia.descriptions.listFormat') },
    { value: 'question-answer', label: t('socialMedia.contentStructures.questionAnswer'), icon: '❓', description: t('socialMedia.descriptions.questionAnswer') },
    { value: 'before-after', label: t('socialMedia.contentStructures.beforeAfter'), icon: '🔄', description: t('socialMedia.descriptions.beforeAfter') },
    { value: 'tips', label: t('socialMedia.contentStructures.tips'), icon: '💡', description: t('socialMedia.descriptions.tipsFormat') },
    { value: 'quote', label: t('socialMedia.contentStructures.quote'), icon: '💬', description: t('socialMedia.descriptions.quoteFormat') },
    { value: 'announcement', label: t('socialMedia.contentStructures.announcement'), icon: '📢', description: t('socialMedia.descriptions.clearAnnouncement') }
  ];

    const platformSpecific = {
      facebook: [
        { value: 'poll', label: 'Poll/Question', icon: '📊', description: 'Create engagement with polls and questions' },
        { value: 'milestone', label: 'Milestone Celebration', icon: '🎉', description: 'Celebrate achievements and milestones' },
        { value: 'behind-scenes', label: 'Behind the Scenes', icon: '🎬', description: 'Show the human side of your brand' }
      ],
      instagram: [
        { value: 'carousel', label: 'Carousel Post', icon: '🖼️', description: 'Multi-image post with swipeable content' },
        { value: 'user-generated', label: 'User Generated Content', icon: '👤', description: 'Repost and celebrate customer content' },
        { value: 'product-showcase', label: 'Product Showcase', icon: '📦', description: 'Highlight products with lifestyle context' }
      ],
      linkedin: [
        { value: 'case-study', label: 'Case Study', icon: '📊', description: 'Share success stories and results' },
        { value: 'thought-leadership', label: 'Thought Leadership', icon: '🧠', description: 'Share expert opinions and insights' },
        { value: 'company-culture', label: 'Company Culture', icon: '🏢', description: 'Showcase workplace culture and values' }
      ]
    };

    return [...baseStructures, ...(platformSpecific[platform] || [])];
  };

  // Platform-specific engagement goals
  const getEngagementGoals = (platform) => {
    const baseGoals = [
    { value: 'awareness', label: t('socialMedia.engagementGoals.awareness'), icon: '👁️', description: t('socialMedia.descriptions.brandAwareness') },
    { value: 'engagement', label: t('socialMedia.engagementGoals.engagement'), icon: '💬', description: t('socialMedia.descriptions.engagement') },
    { value: 'conversation', label: t('socialMedia.engagementGoals.conversation'), icon: '🗣️', description: t('socialMedia.descriptions.conversation') },
    { value: 'education', label: t('socialMedia.engagementGoals.education'), icon: '📚', description: t('socialMedia.descriptions.education') },
    { value: 'conversion', label: t('socialMedia.engagementGoals.conversion'), icon: '🎯', description: t('socialMedia.descriptions.conversion') },
    { value: 'community', label: t('socialMedia.engagementGoals.community'), icon: '🤝', description: t('socialMedia.descriptions.communityBuilding') }
  ];

    const platformSpecific = {
      facebook: [
        { value: 'group-engagement', label: 'Group Engagement', icon: '👥', description: 'Encourage participation in Facebook groups' },
        { value: 'event-registration', label: 'Event Registration', icon: '📅', description: 'Drive event attendance and registrations' },
        { value: 'page-likes', label: 'Page Likes', icon: '👍', description: 'Increase page followers and likes' }
      ],
      instagram: [
        { value: 'story-views', label: 'Story Views', icon: '👁️', description: 'Increase story views and engagement' },
        { value: 'reel-engagement', label: 'Reel Engagement', icon: '🎬', description: 'Boost reel views, likes, and shares' },
        { value: 'profile-visits', label: 'Profile Visits', icon: '👤', description: 'Drive traffic to your Instagram profile' }
      ],
      linkedin: [
        { value: 'connection-requests', label: 'Connection Requests', icon: '🔗', description: 'Grow your professional network' },
        { value: 'article-reads', label: 'Article Reads', icon: '📖', description: 'Increase article views and engagement' },
        { value: 'job-applications', label: 'Job Applications', icon: '💼', description: 'Attract talent and job applications' }
      ]
    };

    return [...baseGoals, ...(platformSpecific[platform] || [])];
  };

  // Platform-specific tones
  const getTones = (platform) => {
    const baseTones = [
      { value: 'engaging', label: t('socialMedia.tones.engaging'), icon: '🎯', description: t('socialMedia.descriptions.engaging') },
      { value: 'professional', label: t('socialMedia.tones.professional'), icon: '💼', description: t('socialMedia.descriptions.professional') },
      { value: 'casual', label: t('socialMedia.tones.casual'), icon: '😊', description: t('socialMedia.descriptions.casual') },
      { value: 'humorous', label: t('socialMedia.tones.humorous'), icon: '😂', description: t('socialMedia.descriptions.humorous') },
      { value: 'inspirational', label: t('socialMedia.tones.inspirational'), icon: '✨', description: t('socialMedia.descriptions.inspirationalTone') },
      { value: 'educational', label: t('socialMedia.tones.educational'), icon: '📚', description: t('socialMedia.descriptions.educationalTone') },
      { value: 'empathetic', label: t('socialMedia.tones.empathetic'), icon: '🤗', description: t('socialMedia.descriptions.empathetic') },
      { value: 'authoritative', label: t('socialMedia.tones.authoritative'), icon: '👑', description: t('socialMedia.descriptions.authoritative') }
    ];

    const platformSpecific = {
      facebook: [
        { value: 'friendly', label: 'Friendly & Approachable', icon: '😊', description: 'Warm, welcoming tone for friends and family' },
        { value: 'community-focused', label: 'Community-Focused', icon: '🏘️', description: 'Emphasize local community and connections' }
      ],
      instagram: [
        { value: 'aesthetic', label: 'Aesthetic & Visual', icon: '🎨', description: 'Focus on visual appeal and aesthetics' },
        { value: 'trendy', label: 'Trendy & Current', icon: '🔥', description: 'Stay current with latest trends and styles' }
      ],
      linkedin: [
        { value: 'executive', label: 'Executive & Strategic', icon: '🎯', description: 'High-level strategic thinking and leadership' },
        { value: 'mentoring', label: 'Mentoring & Supportive', icon: '🤝', description: 'Supportive tone for professional development' }
      ]
    };

    return [...baseTones, ...(platformSpecific[platform] || [])];
  };

  // Platform-specific audiences
  const getAudiences = (platform) => {
    const baseAudiences = [
      { value: 'general', label: t('socialMedia.audiences.general'), icon: '👥', description: t('socialMedia.descriptions.generalAudience') },
      { value: 'business', label: t('socialMedia.audiences.business'), icon: '🏢', description: t('socialMedia.descriptions.businessAudience') },
      { value: 'youth', label: t('socialMedia.audiences.youth'), icon: '👨‍🎓', description: t('socialMedia.descriptions.youthAudience') },
      { value: 'parents', label: t('socialMedia.audiences.parents'), icon: '👨‍👩‍👧‍👦', description: t('socialMedia.descriptions.parentsAudience') },
      { value: 'professionals', label: t('socialMedia.audiences.professionals'), icon: '👔', description: t('socialMedia.descriptions.professionalsAudience') },
      { value: 'creatives', label: t('socialMedia.audiences.creatives'), icon: '🎨', description: t('socialMedia.descriptions.creativesAudience') },
      { value: 'seniors', label: t('socialMedia.audiences.seniors'), icon: '👴', description: t('socialMedia.descriptions.seniorsAudience') },
      { value: 'local', label: t('socialMedia.audiences.local'), icon: '🏘️', description: t('socialMedia.descriptions.localCommunity') }
    ];

    const platformSpecific = {
      facebook: [
        { value: 'friends-family', label: 'Friends & Family', icon: '👨‍👩‍👧‍👦', description: 'Close personal connections and family members' },
        { value: 'local-community', label: 'Local Community', icon: '🏘️', description: 'People in your local area and community' },
        { value: 'interest-groups', label: 'Interest Groups', icon: '🎯', description: 'People with shared interests and hobbies' }
      ],
      instagram: [
        { value: 'visual-creators', label: 'Visual Creators', icon: '📸', description: 'Photographers, artists, and visual content creators' },
        { value: 'lifestyle-enthusiasts', label: 'Lifestyle Enthusiasts', icon: '✨', description: 'People interested in lifestyle and aesthetics' },
        { value: 'young-professionals', label: 'Young Professionals', icon: '💼', description: 'Early to mid-career professionals' }
      ],
      linkedin: [
        { value: 'industry-leaders', label: 'Industry Leaders', icon: '👑', description: 'Senior professionals and industry experts' },
        { value: 'job-seekers', label: 'Job Seekers', icon: '🔍', description: 'People looking for career opportunities' },
        { value: 'decision-makers', label: 'Decision Makers', icon: '🎯', description: 'Business leaders and decision makers' }
      ]
    };

    return [...baseAudiences, ...(platformSpecific[platform] || [])];
  };

  // Dynamic options based on selected platform
  const postTypes = getPostTypes(platform);
  const contentStructures = getContentStructures(platform);
  const engagementGoals = getEngagementGoals(platform);
  const tones = getTones(platform);
  const audiences = getAudiences(platform);

  // Calculate target length based on all factors
  const calculateTargetLength = () => {
    const currentContentLengths = getContentLengths(platform);
    const selectedLength = currentContentLengths.find(cl => cl.value === contentLength);
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
      setError(t('socialMedia.pleaseEnterContent'));
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
      let enhancedPrompt;
      if (platform === 'linkedin') {
        enhancedPrompt = `You are an expert LinkedIn content creator. Your goal is to write a post that is:\n\n- Professional, concise, and clear\n- Delivers a strong message or insight relevant to business or career\n- Uses **bold** and *italics* for emphasis (but do not overuse)\n- Includes a few professional and relevant icons/emojis (e.g., 🚀, 🤝, 🛠️, 📈, 💡, 🏆, 📣) to enhance engagement and visual appeal (but do not overuse)\n- May include a relevant analogy or a touch of tasteful humor, but only if it is appropriate and enhances the message\n- Structured for LinkedIn: a strong opening, a clear point, and a call to action or reflection\n- Follows LinkedIn's markdown formatting (bold, italics)\n\nORIGINAL CONTENT TO ENHANCE:\n${content}\n\nINSTRUCTIONS:\n1. Transform this into a LinkedIn-optimized post that is concise, clear, and professional.\n2. Use the professional tone as the base. Only include a witty line, analogy, or light-hearted touch if it is appropriate and enhances the message.\n3. Use **bold** and *italics* for emphasis where appropriate, but do not overuse.\n4. Add a few professional and relevant icons/emojis (e.g., 🚀, 🤝, 🛠️, 📈, 💡, 🏆, 📣) to enhance engagement and visual appeal, but do not overuse.\n5. Avoid filler, repetition, or generic statements.\n6. Do not use informal language or slang.\n7. Output only the post text, nothing else, using LinkedIn markdown formatting.`;
      } else {
        enhancedPrompt = `You are an expert social media content creator specializing in ${platform} posts. Your goal is to create content that is:\n\n**RELEVANCE & PRECISION:**\n- Only include information that is directly relevant to the main message\n- Remove any unnecessary, off-topic, or verbose content\n- Be concise and precise in your wording\n- Avoid filler, repetition, or generic statements\n\n**CLARITY:**\n- Use simple, direct language that anyone can understand\n- Structure content with a clear beginning, middle, and end\n- Make each sentence build naturally on the previous one\n\n**FORMATTING:**\n${platform === 'instagram' ? `\n**INSTAGRAM-SPECIFIC FORMATTING:**\n- Use emojis strategically to make content visually appealing and engaging\n- Include 3-5 relevant hashtags at the end of the post\n- Use bullet points (•) only if the content naturally fits a list (e.g., tips, steps, highlights)\n- For other content, use short paragraphs and line breaks for clarity and visual appeal\n- Use bold formatting (**text**) for emphasis on important points\n- Include call-to-action emojis (👉 🎯 💡 ✨ 🔥) to encourage engagement\n- Use food, lifestyle, and aesthetic emojis relevant to the content\n- Keep paragraphs short (2-3 lines max) for mobile viewing\n- End with a compelling call-to-action and relevant hashtags` : `\n- Do NOT Over use markdown, emojis, or any unnecessary formatting or symbols\n- Do NOT Over use bullet points, numbered lists, or headings\n- Write as a single, well-structured paragraph or two\n- Do NOT include hashtags in the main content (they will be added separately)`}\n\n**CONTENT STRUCTURE:**\n- Platform: ${platform} (${postType} post)\n- Content structure: ${contentStructure}\n- Engagement goal: ${engagementGoal}\n- Brand voice intensity: ${brandVoiceIntensity}\n- Situation context: ${situation}\n\n**ORIGINAL CONTENT TO ENHANCE:**\n${content}\n\n**INSTRUCTIONS:**\n1. Transform this into a ${platform}-optimized post that is concise, relevant, and precise\n2. Remove any irrelevant or unnecessary information\n3. Use the ${tone} tone consistently\n4. Target ${targetAudience} audience specifically\n5. Focus on ${engagementGoal} as the primary goal\n6. Ensure every sentence flows logically to the next\n7. Make the content immediately understandable and relatable\n8. End with a clear call-to-action that fits the ${engagementGoal}\n${platform === 'instagram' ? `\n9. **INSTAGRAM ENHANCEMENTS:**\n   - Use bullet points (•) only if the content naturally fits a list (e.g., tips, steps)\n   - Otherwise, use short paragraphs and line breaks for structure\n   - Include bold formatting (**text**) for emphasis\n   - Add 3-5 relevant hashtags at the end\n   - Use line breaks to create visual appeal\n   - Include engagement emojis (💬 ❤️ 🔥 ✨) in call-to-action\n   - Make it visually appealing for Instagram's aesthetic-focused audience` : ''}\n\n**LENGTH REQUIREMENT:**\n- Write a comprehensive post of at least ${minWords} words, but not more than ${maxWords} words.\n- The post should be in-depth, detailed, and provide substantial value to the reader.\n- Do NOT stop early; ensure the post meets the minimum word count.\n\n**QUALITY REQUIREMENTS:**\n- Relevance: Every detail should matter to the target audience\n- Precision: No filler, no off-topic content\n- Clarity: Use simple, powerful words that convey meaning instantly\n- Engagement: Encourage interaction and sharing\n- Authenticity: Make it feel genuine and personal, not generic\n${platform === 'instagram' ? '- Visual Appeal: Use emojis and formatting to make it Instagram-worthy' : '- NO MARKDOWN, NO EMOJIS, NO SYMBOLS, NO BULLETS, NO HEADINGS'}\n\nGenerate a post that is concise, relevant, and precise${platform === 'instagram' ? ', with strategic emojis, and only use bullet points for real lists. Otherwise, use short paragraphs and line breaks for Instagram engagement' : ', with no markdown, emojis, or unnecessary marks'}. Output only the post text, nothing else.`;
      }

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

          // Remove unnecessary bullet points: if every line starts with a bullet but it's not a real list, convert to paragraphs
          const lines = generatedContent.split('\n');
          const bulletLines = lines.filter(line => line.trim().startsWith('•')).length;
          if (bulletLines > 0 && bulletLines >= lines.length * 0.7) {
            // If most lines are bullets, flatten to paragraphs
            generatedContent = lines.map(line => line.trim().replace(/^•\s*/, '')).join('\n');
          }
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
          setError(t('socialMedia.generatedContentEmpty'));
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
        setError(data.error || t('socialMedia.failedToGenerate'));
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(t('socialMedia.networkError'));
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
    alert(t('socialMedia.contentCopied'));
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
    
    // Platform-specific preview HTML
    let platformPreview = '';
    if (platform === 'facebook') {
      platformPreview = `
        <div style="background:#f0f2f5;border-radius:12px;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;position:relative;box-shadow:0 2px 8px rgba(0,0,0,0.1);border:1px solid #e4e6ea;max-width:420px;margin:0 auto;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:48px;height:48px;background:linear-gradient(135deg,#1877f2 0%,#42a5f5 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:20px;font-weight:600;box-shadow:0 2px 8px rgba(24,119,242,0.3);">👤</div>
            <div style="flex:1;">
              <div style="font-size:16px;font-weight:600;color:#050505;margin-bottom:2px;">Your Page Name</div>
              <div style="font-size:13px;color:#65676b;display:flex;align-items:center;gap:4px;">
                <span>Just now</span><span>•</span><span>${toneInfo?.icon || '🎭'} ${toneInfo?.label || ''}</span><span>•</span><span>🌍</span>
              </div>
            </div>
            <div style="font-size:20px;color:#65676b;cursor:pointer;padding:4px;border-radius:50%;">⋯</div>
          </div>
          <div style="font-size:15px;line-height:1.4;color:#050505;white-space:pre-wrap;word-wrap:break-word;margin-bottom:16px;padding:12px;background:white;border-radius:8px;border:1px solid #e4e6ea;">${content.replace(/\n/g, '<br/>')}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid #e4e6ea;font-size:15px;color:#65676b;">
            <div style="display:flex;align-items:center;gap:16px;">
              <span>👍 Like</span><span>💬 Comment</span><span>🔄 Share</span>
            </div>
            <div style="font-size:13px;color:#65676b;">0 comments • 0 shares</div>
          </div>
        </div>
      `;
    } else if (platform === 'instagram') {
      // Use formatInstagramContent for hashtags/bullets
      const formatted = formatInstagramContent(content);
      platformPreview = `
        <div style="background:#fff;border-radius:12px;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border:1px solid #dbdbdb;box-shadow:0 2px 8px rgba(0,0,0,0.1);max-width:400px;margin:0 auto;">
          <div style="display:flex;align-items:center;gap:12px;padding:16px;border-bottom:1px solid #dbdbdb;">
            <div style="width:32px;height:32px;background:linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;">📸</div>
            <div style="flex:1;"><div style="font-size:14px;font-weight:600;color:#262626;">your_username</div></div>
            <div style="font-size:18px;color:#262626;cursor:pointer;padding:4px;border-radius:50%;">⋯</div>
          </div>
          <div style="width:100%;height:300px;background:linear-gradient(135deg,#fdf2f8 0%,#fce7f3 100%);display:flex;align-items:center;justify-content:center;font-size:48px;color:#ec4899;border-bottom:1px solid #dbdbdb;">📷</div>
          <div style="display:flex;align-items:center;gap:16px;padding:12px 16px;border-bottom:1px solid #dbdbdb;">
            <span style="font-size:24px;">❤️</span><span style="font-size:24px;">💬</span><span style="font-size:24px;">📤</span><span style="font-size:24px;margin-left:auto;">🔖</span>
          </div>
          <div style="padding:12px 16px;font-size:14px;line-height:1.5;color:#262626;white-space:pre-wrap;word-wrap:break-word;">
            <div style="margin-bottom:8px;"><span style="font-weight:600;color:#262626;">your_username</span><span style="margin-left:8px;">${formatted}</span></div>
          </div>
        </div>
      `;
    } else if (platform === 'linkedin') {
      platformPreview = `
        <div style="background:#fff;border-radius:12px;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border:1px solid #e0e0e0;max-width:420px;margin:0 auto;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:48px;height:48px;background:#0077b5;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:20px;">💼</div>
            <div><div style="font-size:16px;font-weight:600;color:#191919;margin-bottom:2px;">Your Name</div><div style="font-size:14px;color:#666;margin-bottom:2px;">Your Title at Company</div><div style="font-size:12px;color:#666;">now • ${toneInfo?.icon || '🎭'} ${toneInfo?.label || ''}</div></div>
          </div>
          <div style="font-size:16px;line-height:1.5;color:#191919;white-space:pre-wrap;word-wrap:break-word;margin-bottom:16px;">${content.replace(/\n/g, '<br/>')}</div>
          <div style="display:flex;align-items:center;gap:24px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:14px;color:#666;">
            <span>👍 Like</span><span>💬 Comment</span><span>🔄 Repost</span><span>📤 Send</span>
          </div>
        </div>
      `;
    } else if (platform === 'twitter') {
      platformPreview = `
        <div style="background:#fff;border-radius:12px;padding:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border:1px solid #e1e8ed;max-width:420px;margin:0 auto;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:48px;height:48px;background:#1da1f2;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:20px;">🐦</div>
            <div><div style="font-size:15px;font-weight:700;color:#14171a;margin-bottom:2px;">Your Name</div><div style="font-size:14px;color:#657786;display:flex;align-items:center;gap:4px;"><span>@yourhandle</span><span>•</span><span>now</span></div></div>
          </div>
          <div style="font-size:15px;line-height:1.4;color:#14171a;white-space:pre-wrap;word-wrap:break-word;margin-bottom:16px;">${content.replace(/\n/g, '<br/>')}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid #e1e8ed;font-size:16px;color:#657786;">
            <span>💬 0</span><span>🔄 0</span><span>❤️ 0</span><span>📤</span>
          </div>
        </div>
      `;
    } else if (platform === 'tiktok') {
      platformPreview = `
        <div style="background:#000;border-radius:12px;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:white;position:relative;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.3);max-width:300px;margin:0 auto;">
          <div style="width:100%;height:400px;background:linear-gradient(45deg,#ff0050,#00f2ea);display:flex;align-items:center;justify-content:center;font-size:64px;position:relative;">
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px;background:rgba(255,255,255,0.9);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;color:#ff0050;">▶️</div>
          </div>
          <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.8));padding:20px 16px 80px 16px;">
            <div style="font-size:16px;line-height:1.4;white-space:pre-wrap;word-wrap:break-word;margin-bottom:12px;max-width:280px;">${content.replace(/\n/g, '<br/>')}</div>
            <div style="font-size:14px;color:#00f2ea;margin-bottom:12px;">#fyp #viral #trending #content #tiktok</div>
          </div>
          <div style="position:absolute;top:16px;left:16px;right:16px;display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:32px;height:32px;background:linear-gradient(45deg,#ff0050,#00f2ea);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;">🎵</div>
              <div><div style="font-size:14px;font-weight:600;margin-bottom:2px;">@yourusername</div><div style="font-size:12px;color:#ccc;">Original Sound</div></div>
            </div>
            <span style="font-size:20px;">⋯</span>
          </div>
          <div style="position:absolute;right:16px;bottom:100px;display:flex;flex-direction:column;align-items:center;gap:16px;">
            <div style="text-align:center;"><span style="font-size:32px;">❤️</span><div style="font-size:12px;margin-top:4px;">0</div></div>
            <div style="text-align:center;"><span style="font-size:32px;">💬</span><div style="font-size:12px;margin-top:4px;">0</div></div>
            <div style="text-align:center;"><span style="font-size:32px;">📤</span><div style="font-size:12px;margin-top:4px;">Share</div></div>
          </div>
        </div>
      `;
    } else if (platform === 'youtube') {
      platformPreview = `
        <div style="background:#fff;border-radius:12px;padding:16px;font-family:Roboto,Arial,sans-serif;border:1px solid #e5e5e5;max-width:420px;margin:0 auto;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:40px;height:40px;background:#ff0000;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;">📺</div>
            <div><div style="font-size:16px;font-weight:500;color:#030303;margin-bottom:2px;">Your Channel Name</div><div style="font-size:14px;color:#606060;">${new Date().toLocaleDateString()} • ${toneInfo?.icon || '🎭'} ${toneInfo?.label || ''}</div></div>
          </div>
          <div style="font-size:14px;line-height:1.4;color:#030303;white-space:pre-wrap;word-wrap:break-word;margin-bottom:16px;">${content.replace(/\n/g, '<br/>')}</div>
          <div style="display:flex;align-items:center;gap:16px;padding-top:12px;border-top:1px solid #e5e5e5;font-size:14px;color:#606060;">
            <span>👍 0</span><span>👎 0</span><span>💬 0 comments</span><span>📤 Share</span>
          </div>
        </div>
      `;
    } else {
      // fallback generic
      platformPreview = `<div style="background:white;border-radius:16px;padding:24px;box-shadow:0 8px 32px rgba(0,0,0,0.1);border:1px solid #e2e8f0;">${content.replace(/\n/g, '<br/>')}</div>`;
    }

    const previewHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${platformInfo?.label || 'Social Media'} Post Preview</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .preview-actions { padding: 24px; background: white; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .action-btn { background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; transition: all 0.2s ease; }
        .action-btn:hover { background: #5a67d8; transform: translateY(-1px); }
        .action-btn.secondary { background: #e2e8f0; color: #4a5568; }
        .action-btn.secondary:hover { background: #cbd5e0; }
        @media (max-width: 600px) { .preview-actions { padding: 20px; flex-direction: column; } }
    </style>
</head>
<body>
    <div>
      ${platformPreview}
      <div class="preview-actions">
        <button id="copy-btn" class="action-btn">📋 Copy Post</button>
        <button id="close-btn" class="action-btn secondary">✖ Close Window</button>
      </div>
    </div>
    <script>
        function copyToClipboard() {
            const content = \`${content.replace(/`/g, '\\`')}\`;
            navigator.clipboard.writeText(content).then(() => {
                alert('Post copied to clipboard!');
            }).catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = content;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Post copied to clipboard!');
            });
        }
        function closeWindow() { window.close(); }
        document.getElementById('copy-btn').addEventListener('click', copyToClipboard);
        document.getElementById('close-btn').addEventListener('click', closeWindow);
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'c') { e.preventDefault(); copyToClipboard(); }
                else if (e.key === 'w') { e.preventDefault(); closeWindow(); }
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
          {t('socialMedia.title')}
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
          {t('socialMedia.subtitle')}
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

      {/* Move history section (SocialMediaPostResult) to the top */}
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
          ✍️ {t('socialMedia.enterContent')}
        </label>
        <textarea
          id="content-input"
          className="content-input"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={t('socialMedia.contentPlaceholder')}
          rows={5}
          style={{ width: '100%', marginBottom: 12, fontSize: 16, padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', resize: 'vertical' }}
        />
        {/* Suggestions Section */}
        {showSuggestions && (
          <div className="suggestions-section" style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>💡 {t('socialMedia.needInspiration')}</div>
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
              {showSuggestions ? t('socialMedia.hideSuggestions') : t('socialMedia.showSuggestions')}
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
            {isGenerating ? t('socialMedia.generating') : `✨ ${t('socialMedia.generatePost')}`}
          </button>
          <button
            className="clear-btn"
            style={{ background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 500, fontSize: 16, cursor: 'pointer' }}
            onClick={clearAll}
            disabled={isGenerating && !content.trim()}
          >
            {t('socialMedia.clear')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPost; 