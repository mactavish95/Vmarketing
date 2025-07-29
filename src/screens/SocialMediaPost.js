import React, { useState, useEffect } from 'react';
import apiConfig from '../config/api';
import './SocialMediaPost.css';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// [EXTRACT] Move all option/selector UI (platform, post type, tone, audience, content structure, engagement goal, length, brand voice, urgency, situation, advanced options) into a new component SocialMediaPostOptions.js
import SocialMediaPostOptions from '../components/SocialMediaPostOptions';
import SocialMediaPostResult from '../components/SocialMediaPostResult';
import SocialMediaIntegration from '../components/SocialMediaIntegration';
import formatInstagramContent from '../utils/formatInstagramContent';
import SocialMediaPostWizard from '../components/SocialMediaPostWizard';
import FacebookIcon from '../components/FacebookIcon';
import QualityAnalyzer from '../components/QualityAnalyzer';

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

  const [useWizard, setUseWizard] = useState(true);

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

  // Engagement urgency options (use correct translation keys)
  const engagementUrgencies = [
    { value: 'low', label: t('socialMedia.engagementUrgencies.low'), description: t('socialMedia.descriptions.low') },
    { value: 'normal', label: t('socialMedia.engagementUrgencies.normal'), description: t('socialMedia.descriptions.normal') },
    { value: 'high', label: t('socialMedia.engagementUrgencies.high'), description: t('socialMedia.descriptions.high') },
    { value: 'urgent', label: t('socialMedia.engagementUrgencies.urgent'), description: t('socialMedia.descriptions.urgent') }
  ];

  // Situation options (use correct translation keys)
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
    { value: 'facebook', label: t('socialMedia.platforms.facebook'), icon: <FacebookIcon size={36} />, maxLength: 63206, priority: true, 
      features: t('socialMedia.platformSpecific.features.facebook', { returnObjects: true }),
      bestPractices: t('socialMedia.platformSpecific.bestPractices.facebook', { returnObjects: true }),
      audienceTypes: t('socialMedia.platformSpecific.audienceTypes.facebook', { returnObjects: true })
    },
    { value: 'instagram', label: t('socialMedia.platforms.instagram'), icon: '📸', maxLength: 2200, priority: true,
      features: t('socialMedia.platformSpecific.features.instagram', { returnObjects: true }),
      bestPractices: t('socialMedia.platformSpecific.bestPractices.instagram', { returnObjects: true }),
      audienceTypes: t('socialMedia.platformSpecific.audienceTypes.instagram', { returnObjects: true })
    },
    { value: 'linkedin', label: t('socialMedia.platforms.linkedin'), icon: '💼', maxLength: 3000, priority: true,
      features: t('socialMedia.platformSpecific.features.linkedin', { returnObjects: true }),
      bestPractices: t('socialMedia.platformSpecific.bestPractices.linkedin', { returnObjects: true }),
      audienceTypes: t('socialMedia.platformSpecific.audienceTypes.linkedin', { returnObjects: true })
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
        { value: 'event', label: t('socialMedia.platformSpecific.postTypes.facebook.event'), icon: '📅', description: t('socialMedia.platformSpecific.descriptions.postTypes.event') },
        { value: 'live', label: t('socialMedia.platformSpecific.postTypes.facebook.live'), icon: '📺', description: t('socialMedia.platformSpecific.descriptions.postTypes.live') },
        { value: 'group', label: t('socialMedia.platformSpecific.postTypes.facebook.group'), icon: '👥', description: t('socialMedia.platformSpecific.descriptions.postTypes.group') },
        { value: 'marketplace', label: t('socialMedia.platformSpecific.postTypes.facebook.marketplace'), icon: '🛍️', description: t('socialMedia.platformSpecific.descriptions.postTypes.marketplace') }
      ],
      instagram: [
        { value: 'reel', label: t('socialMedia.platformSpecific.postTypes.instagram.reel'), icon: '🎬', description: t('socialMedia.platformSpecific.descriptions.postTypes.reel') },
        { value: 'story', label: t('socialMedia.platformSpecific.postTypes.instagram.story'), icon: '📱', description: t('socialMedia.platformSpecific.descriptions.postTypes.story') },
        { value: 'igtv', label: t('socialMedia.platformSpecific.postTypes.instagram.igtv'), icon: '📺', description: t('socialMedia.platformSpecific.descriptions.postTypes.igtv') },
        { value: 'shopping', label: t('socialMedia.platformSpecific.postTypes.instagram.shopping'), icon: '🛒', description: t('socialMedia.platformSpecific.descriptions.postTypes.shopping') }
      ],
      linkedin: [
        { value: 'article', label: t('socialMedia.platformSpecific.postTypes.linkedin.article'), icon: '📄', description: t('socialMedia.platformSpecific.descriptions.postTypes.article') },
        { value: 'career', label: t('socialMedia.platformSpecific.postTypes.linkedin.career'), icon: '💼', description: t('socialMedia.platformSpecific.descriptions.postTypes.career') },
        { value: 'industry', label: t('socialMedia.platformSpecific.postTypes.linkedin.industry'), icon: '🏭', description: t('socialMedia.platformSpecific.descriptions.postTypes.industry') },
        { value: 'networking', label: t('socialMedia.platformSpecific.postTypes.linkedin.networking'), icon: '🤝', description: t('socialMedia.platformSpecific.descriptions.postTypes.networking') }
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
        { value: 'poll', label: t('socialMedia.platformSpecific.contentStructures.facebook.poll'), icon: '📊', description: t('socialMedia.platformSpecific.descriptions.contentStructures.poll') },
        { value: 'milestone', label: t('socialMedia.platformSpecific.contentStructures.facebook.milestone'), icon: '🎉', description: t('socialMedia.platformSpecific.descriptions.contentStructures.milestone') },
        { value: 'behind-scenes', label: t('socialMedia.platformSpecific.contentStructures.facebook.behindScenes'), icon: '🎬', description: t('socialMedia.platformSpecific.descriptions.contentStructures.behindScenes') }
      ],
      instagram: [
        { value: 'carousel', label: t('socialMedia.platformSpecific.contentStructures.instagram.carousel'), icon: '🖼️', description: t('socialMedia.platformSpecific.descriptions.contentStructures.carousel') },
        { value: 'user-generated', label: t('socialMedia.platformSpecific.contentStructures.instagram.userGenerated'), icon: '👤', description: t('socialMedia.platformSpecific.descriptions.contentStructures.userGenerated') },
        { value: 'product-showcase', label: t('socialMedia.platformSpecific.contentStructures.instagram.productShowcase'), icon: '📦', description: t('socialMedia.platformSpecific.descriptions.contentStructures.productShowcase') }
      ],
      linkedin: [
        { value: 'case-study', label: t('socialMedia.platformSpecific.contentStructures.linkedin.caseStudy'), icon: '📊', description: t('socialMedia.platformSpecific.descriptions.contentStructures.caseStudy') },
        { value: 'thought-leadership', label: t('socialMedia.platformSpecific.contentStructures.linkedin.thoughtLeadership'), icon: '🧠', description: t('socialMedia.platformSpecific.descriptions.contentStructures.thoughtLeadership') },
        { value: 'company-culture', label: t('socialMedia.platformSpecific.contentStructures.linkedin.companyCulture'), icon: '🏢', description: t('socialMedia.platformSpecific.descriptions.contentStructures.companyCulture') }
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
        { value: 'group-engagement', label: t('socialMedia.platformSpecific.engagementGoals.facebook.groupEngagement'), icon: '👥', description: t('socialMedia.platformSpecific.descriptions.engagementGoals.groupEngagement') },
        { value: 'event-registration', label: t('socialMedia.platformSpecific.engagementGoals.facebook.eventRegistration'), icon: '📅', description: t('socialMedia.platformSpecific.descriptions.engagementGoals.eventRegistration') },
        { value: 'page-likes', label: t('socialMedia.platformSpecific.engagementGoals.facebook.pageLikes'), icon: '👍', description: t('socialMedia.platformSpecific.descriptions.engagementGoals.pageLikes') }
      ],
      instagram: [
        { value: 'story-views', label: t('socialMedia.platformSpecific.engagementGoals.instagram.storyViews'), icon: '👁️', description: t('socialMedia.platformSpecific.descriptions.engagementGoals.storyViews') },
        { value: 'reel-engagement', label: t('socialMedia.platformSpecific.engagementGoals.instagram.reelEngagement'), icon: '🎬', description: t('socialMedia.platformSpecific.descriptions.engagementGoals.reelEngagement') },
        { value: 'profile-visits', label: t('socialMedia.platformSpecific.engagementGoals.instagram.profileVisits'), icon: '👤', description: t('socialMedia.platformSpecific.descriptions.engagementGoals.profileVisits') }
      ],
      linkedin: [
        { value: 'connection-requests', label: t('socialMedia.platformSpecific.engagementGoals.linkedin.connectionRequests'), icon: '🔗', description: t('socialMedia.platformSpecific.descriptions.engagementGoals.connectionRequests') },
        { value: 'article-reads', label: t('socialMedia.platformSpecific.engagementGoals.linkedin.articleReads'), icon: '📖', description: t('socialMedia.platformSpecific.descriptions.engagementGoals.articleReads') },
        { value: 'job-applications', label: t('socialMedia.platformSpecific.engagementGoals.linkedin.jobApplications'), icon: '💼', description: t('socialMedia.platformSpecific.descriptions.engagementGoals.jobApplications') }
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
        { value: 'friendly', label: t('socialMedia.platformSpecific.tones.facebook.friendly'), icon: '😊', description: t('socialMedia.platformSpecific.descriptions.tones.friendly') },
        { value: 'community-focused', label: t('socialMedia.platformSpecific.tones.facebook.communityFocused'), icon: '🏘️', description: t('socialMedia.platformSpecific.descriptions.tones.communityFocused') }
      ],
      instagram: [
        { value: 'aesthetic', label: t('socialMedia.platformSpecific.tones.instagram.aesthetic'), icon: '🎨', description: t('socialMedia.platformSpecific.descriptions.tones.aesthetic') },
        { value: 'trendy', label: t('socialMedia.platformSpecific.tones.instagram.trendy'), icon: '🔥', description: t('socialMedia.platformSpecific.descriptions.tones.trendy') }
      ],
      linkedin: [
        { value: 'executive', label: t('socialMedia.platformSpecific.tones.linkedin.executive'), icon: '🎯', description: t('socialMedia.platformSpecific.descriptions.tones.executive') },
        { value: 'mentoring', label: t('socialMedia.platformSpecific.tones.linkedin.mentoring'), icon: '🤝', description: t('socialMedia.platformSpecific.descriptions.tones.mentoring') }
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
        { value: 'friends-family', label: t('socialMedia.platformSpecific.audiences.facebook.friendsFamily'), icon: '👨‍👩‍👧‍👦', description: t('socialMedia.platformSpecific.descriptions.audiences.friendsFamily') },
        { value: 'local-community', label: t('socialMedia.platformSpecific.audiences.facebook.localCommunity'), icon: '🏘️', description: t('socialMedia.platformSpecific.descriptions.audiences.localCommunity') },
        { value: 'interest-groups', label: t('socialMedia.platformSpecific.audiences.facebook.interestGroups'), icon: '🎯', description: t('socialMedia.platformSpecific.descriptions.audiences.interestGroups') }
      ],
      instagram: [
        { value: 'visual-creators', label: t('socialMedia.platformSpecific.audiences.instagram.visualCreators'), icon: '📸', description: t('socialMedia.platformSpecific.descriptions.audiences.visualCreators') },
        { value: 'lifestyle-enthusiasts', label: t('socialMedia.platformSpecific.audiences.instagram.lifestyleEnthusiasts'), icon: '✨', description: t('socialMedia.platformSpecific.descriptions.audiences.lifestyleEnthusiasts') },
        { value: 'young-professionals', label: t('socialMedia.platformSpecific.audiences.instagram.youngProfessionals'), icon: '💼', description: t('socialMedia.platformSpecific.descriptions.audiences.youngProfessionals') }
      ],
      linkedin: [
        { value: 'industry-leaders', label: t('socialMedia.platformSpecific.audiences.linkedin.industryLeaders'), icon: '👑', description: t('socialMedia.platformSpecific.descriptions.audiences.industryLeaders') },
        { value: 'job-seekers', label: t('socialMedia.platformSpecific.audiences.linkedin.jobSeekers'), icon: '🔍', description: t('socialMedia.platformSpecific.descriptions.audiences.jobSeekers') },
        { value: 'decision-makers', label: t('socialMedia.platformSpecific.audiences.linkedin.decisionMakers'), icon: '🎯', description: t('socialMedia.platformSpecific.descriptions.audiences.decisionMakers') }
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

  // QualityAnalyzer instance for programmatic use
  const qualityAnalyzerRef = React.useRef();
  
  const analyzeQuality = async (text) => {
    if (qualityAnalyzerRef.current) {
      return await qualityAnalyzerRef.current.analyzeQuality(text);
    }
    return null;
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
              <div style="font-size:16px;font-weight:600;color:#050505;margin-bottom:2px;">${t('socialMedia.yourPageName')}</div>
              <div style="font-size:13px;color:#65676b;display:flex:align-items:center;gap:4px;">
                <span>${t('socialMedia.justNow')}</span><span>•</span><span>${toneInfo?.icon || '🎭'} ${toneInfo?.label || ''}</span><span>•</span><span>🌍</span>
            </div>
                </div>
            <div style="font-size:20px;color:#65676b;cursor:pointer;padding:4px;border-radius:50%;">⋯</div>
                </div>
          <div style="font-size:15px;line-height:1.4;color:#050505;white-space:pre-wrap;word-wrap:break-word;margin-bottom:16px;padding:12px;background:white;border-radius:8px;border:1px solid #e4e6ea;">${content.replace(/\n/g, '<br/>')}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid #e4e6ea;font-size:15px;color:#65676b;">
            <div style="display:flex;align-items:center;gap:16px;">
              <span>👍 ${t('socialMedia.like')}</span><span>💬 ${t('socialMedia.comment')}</span><span>🔄 ${t('socialMedia.share')}</span>
                </div>
            <div style="font-size:13px;color:#65676b;">0 ${t('socialMedia.comments')} • 0 ${t('socialMedia.shares')}</div>
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
            <div style="flex:1;"><div style="font-size:14px;font-weight:600;color:#262626;">${t('socialMedia.yourUsername')}</div></div>
            <div style="font-size:18px;color:#262626;cursor:pointer;padding:4px;border-radius:50%;">⋯</div>
                </div>
          <div style="width:100%;height:300px;background:linear-gradient(135deg,#fdf2f8 0%,#fce7f3 100%);display:flex;align-items:center;justify-content:center;font-size:48px;color:#ec4899;border-bottom:1px solid #dbdbdb;">📷</div>
          <div style="display:flex;align-items:center;gap:16px;padding:12px 16px;border-bottom:1px solid #dbdbdb;">
            <span style="font-size:24px;">❤️</span><span style="font-size:24px;">💬</span><span style="font-size:24px;">📤</span><span style="font-size:24px;margin-left:auto;">🔖</span>
                </div>
          <div style="padding:12px 16px;font-size:14px;line-height:1.5;color:#262626;white-space:pre-wrap;word-wrap:break-word;">
            <div style="margin-bottom:8px;"><span style="font-weight:600;color:#262626;">${t('socialMedia.yourUsername')}</span><span style="margin-left:8px;">${formatted}</span></div>
            </div>
        </div>
      `;
    } else if (platform === 'linkedin') {
      platformPreview = `
        <div style="background:#fff;border-radius:12px;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border:1px solid #e0e0e0;max-width:420px;margin:0 auto;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:48px;height:48px;background:#0077b5;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:20px;">💼</div>
            <div><div style="font-size:16px;font-weight:600;color:#191919;margin-bottom:2px;">${t('socialMedia.yourName')}</div><div style="font-size:14px;color:#666;margin-bottom:2px;">${t('socialMedia.yourTitleAtCompany')}</div><div style="font-size:12px;color:#666;">${t('socialMedia.now')} • ${toneInfo?.icon || '🎭'} ${toneInfo?.label || ''}</div></div>
          </div>
          <div style="font-size:16px;line-height:1.5;color:#191919;white-space:pre-wrap;word-wrap:break-word;margin-bottom:16px;">${content.replace(/\n/g, '<br/>')}</div>
          <div style="display:flex;align-items:center;gap:24px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:14px;color:#666;">
            <span>👍 ${t('socialMedia.like')}</span><span>💬 ${t('socialMedia.comment')}</span><span>🔄 ${t('socialMedia.repost')}</span><span>📤 ${t('socialMedia.send')}</span>
          </div>
        </div>
      `;
    } else if (platform === 'twitter') {
      platformPreview = `
        <div style="background:#fff;border-radius:12px;padding:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border:1px solid #e1e8ed;max-width:420px;margin:0 auto;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:48px;height:48px;background:#1da1f2;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:20px;">🐦</div>
            <div><div style="font-size:15px;font-weight:700;color:#14171a;margin-bottom:2px;">${t('socialMedia.yourName')}</div><div style="font-size:14px;color:#657786;display:flex:align-items:center;gap:4px;"><span>@${t('socialMedia.yourHandle')}</span><span>•</span><span>${t('socialMedia.now')}</span></div></div>
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
            <div style="font-size:14px;color:#00f2ea;margin-bottom:12px;">${t('socialMedia.tiktokHashtags')}</div>
          </div>
          <div style="position:absolute;top:16px;left:16px;right:16px;display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:32px;height:32px;background:linear-gradient(45deg,#ff0050,#00f2ea);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;">🎵</div>
              <div><div style="font-size:14px;font-weight:600;margin-bottom:2px;">@${t('socialMedia.yourUsername')}</div><div style="font-size:12px;color:#ccc;">${t('socialMedia.originalSound')}</div></div>
            </div>
            <span style="font-size:20px;">⋯</span>
          </div>
          <div style="position:absolute;right:16px;bottom:100px;display:flex;flex-direction:column;align-items:center;gap:16px;">
            <div style="text-align:center;"><span style="font-size:32px;">❤️</span><div style="font-size:12px;margin-top:4px;">0</div></div>
            <div style="text-align:center;"><span style="font-size:32px;">💬</span><div style="font-size:12px;margin-top:4px;">0</div></div>
            <div style="text-align:center;"><span style="font-size:32px;">📤</span><div style="font-size:12px;margin-top:4px;">${t('socialMedia.share')}</div></div>
          </div>
        </div>
      `;
    } else if (platform === 'youtube') {
      platformPreview = `
        <div style="background:#fff;border-radius:12px;padding:16px;font-family:Roboto,Arial,sans-serif;border:1px solid #e5e5e5;max-width:420px;margin:0 auto;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:40px;height:40px;background:#ff0000;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;">📺</div>
            <div><div style="font-size:16px;font-weight:500;color:#030303;margin-bottom:2px;">${t('socialMedia.yourChannelName')}</div><div style="font-size:14px;color:#606060;">${new Date().toLocaleDateString()} • ${toneInfo?.icon || '🎭'} ${toneInfo?.label || ''}</div></div>
          </div>
          <div style="font-size:14px;line-height:1.4;color:#030303;white-space:pre-wrap;word-wrap:break-word;margin-bottom:16px;">${content.replace(/\n/g, '<br/>')}</div>
          <div style="display:flex;align-items:center;gap:16px;padding-top:12px;border-top:1px solid #e5e5e5;font-size:14px;color:#606060;">
            <span>👍 0</span><span>👎 0</span><span>💬 0 ${t('socialMedia.comments')}</span><span>📤 ${t('socialMedia.share')}</span>
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
        <button id="copy-btn" class="action-btn">📋 ${t('socialMedia.copyPost')}</button>
        <button id="close-btn" class="action-btn secondary">✖ ${t('socialMedia.closeWindow')}</button>
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
    if (score >= 0.8) return t('socialMedia.quality.excellent');
    if (score >= 0.6) return t('socialMedia.quality.good');
    if (score >= 0.4) return t('socialMedia.quality.fair');
    return t('socialMedia.quality.poor');
  };

  // Calculate derived values for display
  const selectedPlatform = platforms.find(p => p.value === platform);
  const characterCount = enhancedContent.length;
  const isOverLimit = characterCount > (selectedPlatform?.maxLength || 1000);

  // Follow-up question suggestions based on user selections
  const getFollowUpSuggestions = () => {
    const suggestions = {
      general: t('socialMedia.suggestions.postTypes.general', { returnObjects: true }),
      promotional: t('socialMedia.suggestions.postTypes.promotional', { returnObjects: true }),
      educational: t('socialMedia.suggestions.postTypes.educational', { returnObjects: true }),
      community: t('socialMedia.suggestions.postTypes.community', { returnObjects: true }),
      celebration: t('socialMedia.suggestions.postTypes.celebration', { returnObjects: true }),
      trending: t('socialMedia.suggestions.postTypes.trending', { returnObjects: true }),
      seasonal: t('socialMedia.suggestions.postTypes.seasonal', { returnObjects: true }),
      crisis: t('socialMedia.suggestions.postTypes.crisis', { returnObjects: true })
    };

    // Get suggestions based on post type and situation
    const postTypeSuggestions = suggestions[postType] || suggestions.general;
    const situationSuggestions = suggestions[situation] || suggestions.general;
    
    // Add content structure specific suggestions
    const structureSuggestions = {
      story: t('socialMedia.suggestions.contentStructures.story', { returnObjects: true }),
      'problem-solution': t('socialMedia.suggestions.contentStructures.problemSolution', { returnObjects: true }),
      list: t('socialMedia.suggestions.contentStructures.list', { returnObjects: true }),
      'question-answer': t('socialMedia.suggestions.contentStructures.questionAnswer', { returnObjects: true }),
      'before-after': t('socialMedia.suggestions.contentStructures.beforeAfter', { returnObjects: true }),
      tips: t('socialMedia.suggestions.contentStructures.tips', { returnObjects: true }),
      quote: t('socialMedia.suggestions.contentStructures.quote', { returnObjects: true }),
      announcement: t('socialMedia.suggestions.contentStructures.announcement', { returnObjects: true })
    };

    const structureSpecific = structureSuggestions[contentStructure] || [];
    
    // Add tone-specific suggestions
    const toneSuggestions = {
      engaging: t('socialMedia.suggestions.tones.engaging', { returnObjects: true }),
      professional: t('socialMedia.suggestions.tones.professional', { returnObjects: true }),
      casual: t('socialMedia.suggestions.tones.casual', { returnObjects: true }),
      humorous: t('socialMedia.suggestions.tones.humorous', { returnObjects: true }),
      inspirational: t('socialMedia.suggestions.tones.inspirational', { returnObjects: true }),
      educational: t('socialMedia.suggestions.tones.educational', { returnObjects: true }),
      empathetic: t('socialMedia.suggestions.tones.empathetic', { returnObjects: true }),
      authoritative: t('socialMedia.suggestions.tones.authoritative', { returnObjects: true })
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
      facebook: t('socialMedia.suggestions.platforms.facebook', { returnObjects: true }),
      instagram: t('socialMedia.suggestions.platforms.instagram', { returnObjects: true }),
      twitter: t('socialMedia.suggestions.platforms.twitter', { returnObjects: true }),
      linkedin: t('socialMedia.suggestions.platforms.linkedin', { returnObjects: true }),
      tiktok: t('socialMedia.suggestions.platforms.tiktok', { returnObjects: true }),
      youtube: t('socialMedia.suggestions.platforms.youtube', { returnObjects: true })
    };

    const platformSuggestions = platformSpecific[platform] || platformSpecific.facebook;
    
    // Add engagement goal specific suggestions
    const goalSuggestions = {
      awareness: t('socialMedia.goalSuggestions.awareness', { returnObjects: true }),
      engagement: t('socialMedia.goalSuggestions.engagement', { returnObjects: true }),
      conversation: t('socialMedia.goalSuggestions.conversation', { returnObjects: true }),
      education: t('socialMedia.goalSuggestions.education', { returnObjects: true }),
      conversion: t('socialMedia.goalSuggestions.conversion', { returnObjects: true }),
      community: t('socialMedia.goalSuggestions.community', { returnObjects: true })
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
      const response = await fetch(`${baseURL}/social-posts`, { credentials: 'include' });
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
        credentials: 'include',
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

  // Handler for wizard submit (save post or trigger generation)
  const handleWizardSubmit = () => {
    // For now, just show an alert or call generateContent
    generateContent();
  };

  return (
    <div className="social-media-post responsive-mobile" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', padding: 0 }}>
      {/* Toggle Wizard/Advanced Mode */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0 0 0' }}>
        <button
          onClick={() => setUseWizard(true)}
          style={{ background: useWizard ? '#2563eb' : '#e5e7eb', color: useWizard ? 'white' : '#374151', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 700, fontSize: 15, marginRight: 8 }}
        >
          🧑‍🎓 {t('socialMedia.guidedMode')}
        </button>
        <button
          onClick={() => setUseWizard(false)}
          style={{ background: !useWizard ? '#2563eb' : '#e5e7eb', color: !useWizard ? 'white' : '#374151', border: 'none', borderRadius: 8, padding: '10px 18px', fontWeight: 700, fontSize: 15 }}
        >
          ⚡ {t('socialMedia.advancedMode')}
        </button>
      </div>
      {/* Wizard UI */}
      {useWizard && (
        <div style={{ margin: '32px 0' }}>
          <SocialMediaPostWizard
            platform={platform}
            setPlatform={setPlatform}
            postType={postType}
            setPostType={setPostType}
            tone={tone}
            setTone={setTone}
            targetAudience={targetAudience}
            setTargetAudience={setTargetAudience}
            contentStructure={contentStructure}
            setContentStructure={setContentStructure}
            engagementGoal={engagementGoal}
            setEngagementGoal={setEngagementGoal}
            content={content}
            setContent={setContent}
            enhancedContent={enhancedContent}
            setEnhancedContent={setEnhancedContent}
            onSubmit={handleWizardSubmit}
            // Add new props for enhancement functionality
            isGenerating={isGenerating}
            isReviewing={isReviewing}
            reviewedContent={reviewedContent}
            setReviewedContent={setReviewedContent}
            generateContent={generateContent}
            copyToClipboard={copyToClipboard}
            openPreviewWindow={openPreviewWindow}
            brandVoiceIntensity={brandVoiceIntensity}
            setBrandVoiceIntensity={setBrandVoiceIntensity}
            engagementUrgency={engagementUrgency}
            setEngagementUrgency={setEngagementUrgency}
            situation={situation}
            setSituation={setSituation}
          />
        </div>
      )}
      {/* Old UI (Advanced) */}
      {!useWizard && (
      <div style={{ padding: '16px 8px', maxWidth: 900, margin: '0 auto' }}>
      {/* Option/Selector UI */}
        <div className="section platform-section-mobile" style={{ marginBottom: 16 }}>
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
        </div>
      {/* Content Input Section */}
        <div className="section content-input-section" style={{ marginBottom: 16 }}>
          <div className="content-label" style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{t('socialMedia.enterContent')}</div>
        <textarea
            className="mobile-friendly-input"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={t('socialMedia.contentPlaceholder')}
            style={{
              width: '100%',
              minHeight: 220,
              fontSize: 20,
              padding: '28px 20px',
              marginBottom: 18,
              border: '2.5px solid #a5b4fc',
              borderRadius: 18,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
              boxShadow: '0 6px 32px rgba(79,140,255,0.10)',
              fontWeight: 500,
              color: '#1e293b',
              outline: 'none',
              transition: 'border 0.2s, box-shadow 0.2s',
            }}
            onFocus={e => e.target.style.border = '2.5px solid #6366f1'}
            onBlur={e => e.target.style.border = '2.5px solid #a5b4fc'}
        />
        <div className="content-actions" style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
              className="mobile-generate-btn generate-btn"
            onClick={generateContent}
              disabled={!content.trim() || isGenerating}
              style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 16, padding: '14px 0', flex: 1 }}
          >
              {isGenerating ? t('socialMedia.generating') : t('socialMedia.generatePost')}
          </button>
          <button
              className="mobile-clear-btn clear-btn"
            onClick={clearAll}
              style={{ background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)', color: '#4a5568', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 16, padding: '14px 0', flex: 1 }}
          >
            {t('socialMedia.clear')}
          </button>
        </div>
      </div>
        {/* Quality Analyzer Component */}
        <div className="section quality-analyzer-section" style={{ marginBottom: 16 }}>
          <QualityAnalyzer
            ref={qualityAnalyzerRef}
            content={enhancedContent || reviewedContent || content}
            platform={platform}
            postType={postType}
            tone={tone}
            targetAudience={targetAudience}
            contentStructure={contentStructure}
            engagementGoal={engagementGoal}
            brandVoiceIntensity={brandVoiceIntensity}
            engagementUrgency={engagementUrgency}
            situation={situation}
            targetLength={calculateTargetLength()}
            contentType="facebook_post"
            onAnalysisComplete={(analysis) => setQualityAnalysis(analysis)}
            onAnalysisError={(error) => console.error('Quality analysis error:', error)}
            autoAnalyze={!!enhancedContent}
            showUI={true}
          />
        </div>

        {/* Result Section (Enhanced Post, etc.) */}
        {enhancedContent && (
          <div className="section result-section mobile-result-section" style={{ position: 'relative' }}>
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
              isOverLimit={isOverLimit}
        qualityAnalysis={qualityAnalysis}
        copyToClipboard={copyToClipboard}
        openPreviewWindow={openPreviewWindow}
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
            />
              
              {/* Social Media Integration */}
              <SocialMediaIntegration
                content={reviewedContent || enhancedContent}
                platform={platform}
                onPublishSuccess={(platform, result) => {
                  console.log(`Successfully published to ${platform}:`, result);
                  // You can add success notification here
                }}
                onPublishError={(platform, error) => {
                  console.error(`Failed to publish to ${platform}:`, error);
                  // You can add error notification here
                }}
              />
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default SocialMediaPost; 