import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldTipLLM, useFieldTipLLM } from './FieldTipLLM';
import './BlogCreator.css';

const BlogCreatorGuidance = ({ onGenerateBlog, isGenerating }) => {
  const { t } = useTranslation();

  // Form data state
  const [blogData, setBlogData] = useState({
    topic: '',
    mainName: '',
    type: 'business',
    industry: '',
    location: '',
    targetAudience: 'general',
    tone: 'professional',
    length: 'medium',
    keyPoints: '',
    specialFeatures: ''
  });

  // Strategic planning state
  const [strategicPlan, setStrategicPlan] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);
  const [planError, setPlanError] = useState('');
  const [planGenerated, setPlanGenerated] = useState(false);

  // Topic recommendation state
  const [isGeneratingTopic, setIsGeneratingTopic] = useState(false);
  const [topicRecommendations, setTopicRecommendations] = useState([]);
  const [showTopicRecommendations, setShowTopicRecommendations] = useState(false);

  // Step-by-step wizard states
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showStepValidation, setShowStepValidation] = useState(false);

  // UI states
  const [showTips, setShowTips] = useState(true);
  const [activeTip, setActiveTip] = useState('getting-started');
  const [showExamples, setShowExamples] = useState(false);
  const [templateApplied, setTemplateApplied] = useState(false);

  // Image states
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Check step completion on mount and when blogData changes
  useEffect(() => {
    checkStepCompletion();
  }, [blogData]);

  // Step definitions
  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      icon: '📝',
      description: 'Topic and business details',
      fields: ['topic', 'mainName', 'type', 'industry', 'location']
    },
    {
      id: 2,
      title: 'Content Style',
      icon: '🎨',
      description: 'Audience, tone, and length',
      fields: ['targetAudience', 'tone', 'length']
    },
    {
      id: 3,
      title: 'Key Content',
      icon: '✨',
      description: 'Key points and special features',
      fields: ['keyPoints', 'specialFeatures']
    },
    {
      id: 4,
      title: 'Strategic Planning',
      icon: '🧠',
      description: 'Goal-driven content strategy and structure',
      fields: ['strategicPlan']
    },
    {
      id: 5,
      title: 'Images & Review',
      icon: '📸',
      description: 'Add images and review details',
      fields: ['images']
    }
  ];

  // Quick start templates
  const quickStartTemplates = [
    {
      name: 'Restaurant Menu Launch',
      icon: '🍽️',
      data: {
        topic: 'Our New Seasonal Menu Launch',
        mainName: 'Downtown Bistro',
        type: 'business',
        industry: 'Food & Beverage',
        location: 'Downtown Seattle',
        targetAudience: 'customers',
        tone: 'enthusiastic',
        length: 'medium',
        keyPoints: '• Highlight our commitment to local ingredients and seasonal cooking\n• Mention our award-winning chef and culinary philosophy\n• Include customer testimonials and feedback\n• Emphasize our unique atmosphere and dining experience\n• Explain our signature dishes and their stories\n• Share our mission to support local farmers',
        specialFeatures: '• Recently won "Best New Restaurant 2024" award from Seattle Food Magazine\n• Only restaurant in the area with rooftop dining and city views\n• Family-owned for 3 generations with traditional recipes\n• Sustainable practices and zero-waste kitchen operations\n• Chef trained in Michelin-starred restaurants in France\n• Source 90% of ingredients from local farms within 50 miles'
      }
    },
    {
      name: 'Product Launch',
      icon: '📦',
      data: {
        topic: 'Introducing Our Revolutionary New Product',
        mainName: 'TechStart Inc.',
        type: 'product',
        industry: 'Technology',
        location: 'San Francisco',
        targetAudience: 'customers',
        tone: 'modern',
        length: 'medium',
        keyPoints: '• Explain the problem it solves and why it matters\n• Highlight key features and their practical benefits\n• Include early user feedback and testimonials\n• Mention pricing, availability, and how to get started\n• Share the development story and innovation process\n• Explain how it improves users\' daily lives',
        specialFeatures: '• Patented AI technology with 5 pending patents\n• Award-winning design recognized by IDSA 2024\n• 30-day money-back guarantee with no questions asked\n• 24/7 customer support with live chat and phone\n• Founded by ex-Google engineers with 15+ years experience\n• Backed by $10M in venture capital funding'
      }
    },
    {
      name: 'Event Announcement',
      icon: '🎉',
      data: {
        topic: 'Join Us for Our Annual Community Event',
        mainName: 'Community Center',
        type: 'event',
        industry: 'Community',
        location: 'Local Community',
        targetAudience: 'community',
        tone: 'casual',
        length: 'short',
        keyPoints: '• Event date, time, and location details\n• What to expect and planned activities\n• How to register or attend the event\n• Special highlights, guests, or performances\n• What attendees should bring or prepare\n• How the event benefits the community',
        specialFeatures: '• Free admission for families with children under 12\n• Live entertainment featuring local musicians and artists\n• Charity fundraiser component supporting local schools\n• Rain date scheduled for the following weekend\n• Sponsored by 15 local businesses and organizations\n• 10-year tradition with over 5,000 attendees annually'
      }
    },
    {
      name: 'Company Update',
      icon: '🏢',
      data: {
        topic: 'Exciting Updates About Our Company Growth',
        mainName: 'Your Company Name',
        type: 'business',
        industry: 'Your Industry',
        location: 'Your Location',
        targetAudience: 'customers',
        tone: 'professional',
        length: 'medium',
        keyPoints: '• Recent achievements and milestones we\'ve reached\n• New team members or leadership changes\n• Upcoming plans and strategic goals\n• How these changes benefit our customers\n• Our commitment to continued excellence\n• What customers can expect in the coming months',
        specialFeatures: '• 50% growth in revenue and team size in the last year\n• New office opening in downtown with modern facilities\n• Industry recognition awards from leading publications\n• Enhanced customer service initiatives with 24/7 support\n• Expanded product line with 5 new offerings\n• Strategic partnerships with Fortune 500 companies'
      }
    }
  ];

  // Tips and guidance content
  const tips = {
    'getting-started': {
      title: '🚀 Getting Started',
      content: 'Start by entering your blog topic and business/project name. Be specific about what you want to write about - this helps AI generate more relevant content.',
      examples: [
        'Topic: "Our New Seasonal Menu Launch"',
        'Topic: "Behind the Scenes: How We Source Local Ingredients"',
        'Topic: "5 Tips for First-Time Visitors"'
      ]
    },
    'topic-ideas': {
      title: '💡 Topic Ideas',
      content: 'Great blog topics engage your audience and showcase your expertise. Consider writing about:',
      examples: [
        'Behind-the-scenes stories',
        'Industry insights and tips',
        'Customer success stories',
        'Product/service highlights',
        'Seasonal or trending topics',
        'Company culture and team',
        'How-to guides and tutorials'
      ]
    },
    'target-audience': {
      title: '👥 Target Audience',
      content: 'Choose your target audience to tailor the content style and messaging:',
      examples: [
        'General: Broad appeal, easy to understand',
        'Customers: Focus on benefits and value',
        'Investors: Emphasize growth and potential',
        'Partners: Highlight collaboration opportunities',
        'Employees: Internal communication style',
        'Media: Professional, newsworthy angle',
        'Community: Local focus and engagement'
      ]
    },
    'writing-tone': {
      title: '🎭 Writing Tone',
      content: 'The tone sets the mood and personality of your blog post:',
      examples: [
        'Professional: Formal, authoritative, business-focused',
        'Casual: Friendly, conversational, approachable',
        'Enthusiastic: Energetic, exciting, motivational',
        'Elegant: Sophisticated, refined, premium feel',
        'Rustic: Warm, cozy, authentic, down-to-earth',
        'Modern: Trendy, innovative, cutting-edge'
      ]
    },
    'content-length': {
      title: '📏 Content Length',
      content: 'Choose the length based on your topic complexity and audience preferences:',
      examples: [
        'Short (300-500 words): Quick reads, announcements, simple topics',
        'Medium (600-800 words): Standard blog posts, detailed explanations',
        'Long (900-1200 words): Comprehensive guides, in-depth analysis',
        'Extra Long (1500-3000 words): Ultimate guides, detailed case studies'
      ]
    },
    'key-points': {
      title: '🎯 Key Points',
      content: 'Include specific points you want to highlight in your blog post:',
      examples: [
        'Main benefits or features to emphasize',
        'Specific examples or case studies',
        'Important statistics or data points',
        'Call-to-action messages',
        'Unique selling propositions',
        'Customer testimonials or quotes'
      ]
    },
    'images': {
      title: '📸 Images',
      content: 'Images make your blog more engaging and help tell your story:',
      examples: [
        'Product photos or service demonstrations',
        'Team photos or behind-the-scenes shots',
        'Location photos or venue images',
        'Infographics or charts',
        'Customer photos (with permission)',
        'Process or workflow images'
      ]
    }
  };

  // Image handling functions
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        alert(t('invalidFileType', { fileName: file.name }));
        return false;
      }
      
      if (!isValidSize) {
        alert(t('fileTooLarge', { fileName: file.name }));
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    // Process images
    const processImages = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: e.target.result,
            uploadedAt: new Date().toISOString()
          };
          resolve(imageData);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(processImages).then(newImages => {
      setImages(prev => [...prev, ...newImages]);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    });
  };

  const removeImage = (imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const reorderImages = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Form options
  const typeOptions = [
    { value: 'business', label: t('typeBusiness'), icon: '🏢', color: '#667eea' },
    { value: 'project', label: t('typeProject'), icon: '🛠️', color: '#4caf50' },
    { value: 'event', label: t('typeEvent'), icon: '🎉', color: '#ff9800' },
    { value: 'product', label: t('typeProduct'), icon: '📦', color: '#ff6b6b' },
    { value: 'organization', label: t('typeOrganization'), icon: '🏛️', color: '#a55eea' },
    { value: 'community', label: t('typeCommunity'), icon: '👥', color: '#20c997' },
    { value: 'other', label: t('typeOther'), icon: '✨', color: '#9c27b0' }
  ];

  const targetAudiences = [
    { value: 'general', label: t('targetAudienceGeneral'), icon: '👥', color: '#667eea' },
    { value: 'customers', label: t('targetAudienceCustomers'), icon: '🛒', color: '#ff6b6b' },
    { value: 'investors', label: t('targetAudienceInvestors'), icon: '💼', color: '#4b7bec' },
    { value: 'partners', label: t('targetAudiencePartners'), icon: '🤝', color: '#20c997' },
    { value: 'employees', label: t('targetAudienceEmployees'), icon: '👔', color: '#ffa726' },
    { value: 'media', label: t('targetAudienceMedia'), icon: '📰', color: '#f7b731' },
    { value: 'community', label: t('targetAudienceCommunity'), icon: '🏘️', color: '#a55eea' }
  ];

  const tones = [
    { value: 'professional', label: t('toneProfessional'), icon: '👔', color: '#667eea' },
    { value: 'casual', label: t('toneCasualFriendly'), icon: '😊', color: '#ffa726' },
    { value: 'enthusiastic', label: t('toneEnthusiastic'), icon: '🎉', color: '#ff7043' },
    { value: 'elegant', label: t('toneElegantSophisticated'), icon: '✨', color: '#9c27b0' },
    { value: 'rustic', label: t('toneRusticCozy'), icon: '🏡', color: '#8d6e63' },
    { value: 'modern', label: t('toneModernTrendy'), icon: '🚀', color: '#00bcd4' }
  ];

  const lengths = [
    { value: 'short', label: t('short300500WordsLabel'), icon: '📝', color: '#4caf50' },
    { value: 'medium', label: t('medium600800WordsLabel'), icon: '📄', color: '#ff9800' },
    { value: 'long', label: t('long9001200WordsLabel'), icon: '📖', color: '#f44336' },
    { value: 'extra_long', label: t('extraLong15003000WordsLabel'), icon: '📖', color: '#1976d2' }
  ];

  // Step navigation functions
  const handleInputChange = (field, value) => {
    setBlogData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Check if step is completed when field changes
    checkStepCompletion();
  };

  const isStepCompleted = (stepId) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return false;
    
    return step.fields.every(field => {
      if (field === 'images') return true; // Images are optional
      if (field === 'strategicPlan') return planGenerated && strategicPlan; // Strategic plan step
      return blogData[field] && blogData[field].toString().trim() !== '';
    });
  };

  const checkStepCompletion = () => {
    const newCompletedSteps = new Set(completedSteps);
    steps.forEach(step => {
      if (isStepCompleted(step.id)) {
        newCompletedSteps.add(step.id);
      } else {
        newCompletedSteps.delete(step.id);
      }
    });
    setCompletedSteps(newCompletedSteps);
  };

  const nextStep = () => {
    if (isStepCompleted(currentStep) && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setShowStepValidation(false);
    } else {
      setShowStepValidation(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowStepValidation(false);
    }
  };

  const goToStep = (stepId) => {
    if (stepId <= currentStep || completedSteps.has(stepId - 1)) {
      setCurrentStep(stepId);
      setShowStepValidation(false);
    }
  };

  // Generate strategic plan function
  const generateStrategicPlan = async () => {
    try {
      setIsPlanning(true);
      setPlanError('');
      
      // Validate required fields for planning
      if (!blogData.topic || !blogData.mainName) {
        setPlanError('Please complete the Basic Information step first');
        return;
      }

      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : require('../config/api').default.baseURL;
      
      const response = await fetch(`${baseURL}/blog/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData)
      });

      const data = await response.json();
      
      if (data.success) {
        setStrategicPlan(data.strategicPlan);
        setPlanGenerated(true);
        // Mark the planning step as completed
        setCompletedSteps(prev => new Set([...prev, 4]));
      } else {
        setPlanError(data.error || 'Failed to generate strategic plan');
      }
    } catch (error) {
      console.error('Planning error:', error);
      setPlanError('Network error. Please try again.');
    } finally {
      setIsPlanning(false);
    }
  };

  // Generate topic recommendations
  const generateTopicRecommendations = async () => {
    try {
      setIsGeneratingTopic(true);
      setTopicRecommendations([]);
      setShowTopicRecommendations(false);

      // Always try to generate contextual recommendations based on user input
      // Even if some fields are empty, we can still generate relevant topics
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : require('../config/api').default.baseURL;
      
      const response = await fetch(`${baseURL}/blog/topic-recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mainName: blogData.mainName || 'Your Business',
          type: blogData.type || 'business',
          industry: blogData.industry || 'General',
          location: blogData.location || 'Your Location'
        })
      });

      const data = await response.json();
      
      if (data.success && data.recommendations && data.recommendations.length > 0) {
        setTopicRecommendations(data.recommendations);
        setShowTopicRecommendations(true);
      } else {
        // Generate contextual fallback recommendations based on available input
        const fallbackRecommendations = generateContextualFallbacks();
        setTopicRecommendations(fallbackRecommendations);
        setShowTopicRecommendations(true);
      }
    } catch (error) {
      console.error('Topic recommendation error:', error);
      // Generate contextual fallback recommendations based on available input
      const fallbackRecommendations = generateContextualFallbacks();
      setTopicRecommendations(fallbackRecommendations);
      setShowTopicRecommendations(true);
    } finally {
      setIsGeneratingTopic(false);
    }
  };

  // Generate contextual fallback recommendations based on user input
  const generateContextualFallbacks = () => {
    const { mainName, type, industry, location } = blogData;
    
    // Base recommendations that can be customized
    let baseRecommendations = [
      "Our New Product Launch",
      "Behind the Scenes: How We Work",
      "5 Tips for Success in Our Industry",
      "Meet Our Team",
      "Best Practices and Insights"
    ];

    // Customize based on business type
    if (type === 'business') {
      baseRecommendations = [
        `${mainName ? mainName + "'s " : "Our "}New Product Launch`,
        `Behind the Scenes: A Day at ${mainName || "Our Business"}`,
        `5 Tips for Success in ${industry || "Our Industry"}`,
        `Meet the Team at ${mainName || "Our Company"}`,
        `${mainName ? mainName + "'s " : "Our "}Best Practices and Insights`
      ];
    } else if (type === 'restaurant') {
      baseRecommendations = [
        `${mainName ? mainName + "'s " : "Our "}New Seasonal Menu`,
        `Behind the Scenes: ${mainName || "Our"} Kitchen`,
        `5 Tips for First-Time Visitors to ${mainName || "Our Restaurant"}`,
        `Meet Our Award-Winning Chef at ${mainName || "Our Restaurant"}`,
        `${mainName ? mainName + "'s " : "Our "}Sustainable Practices`
      ];
    } else if (type === 'project') {
      baseRecommendations = [
        `${mainName ? mainName + " " : "Our "}Project Update`,
        `Behind the Scenes: ${mainName || "Our"} Development Process`,
        `5 Key Insights from ${mainName || "Our"} Project`,
        `Meet the Team Behind ${mainName || "Our"} Project`,
        `${mainName ? mainName + "'s " : "Our "}Success Story`
      ];
    } else if (type === 'event') {
      baseRecommendations = [
        `${mainName ? mainName + " " : "Our "}Event Highlights`,
        `Behind the Scenes: Planning ${mainName || "Our Event"}`,
        `5 Things to Expect at ${mainName || "Our Event"}`,
        `Meet the Organizers of ${mainName || "Our Event"}`,
        `${mainName ? mainName + "'s " : "Our "}Event Success Tips`
      ];
    }

    // Add location context if available
    if (location) {
      baseRecommendations = baseRecommendations.map(rec => 
        rec.replace(/Our|our/g, `${location}'s`)
      );
    }

    return baseRecommendations;
  };

  // Select a topic recommendation
  const selectTopicRecommendation = (topic) => {
    handleInputChange('topic', topic);
    setShowTopicRecommendations(false);
  };

  // Regenerate strategic plan
  const regenerateStrategicPlan = () => {
    setStrategicPlan('');
    setPlanGenerated(false);
    setPlanError('');
    generateStrategicPlan();
  };

  // Generate blog function
  const handleGenerateBlog = () => {
    onGenerateBlog(blogData, images, strategicPlan);
  };

  // LLM field tips
  const { tip: topicTip } = useFieldTipLLM('topic', blogData.topic);
  const { tip: mainNameTip } = useFieldTipLLM('mainName', blogData.mainName);
  const { tip: typeTip } = useFieldTipLLM('type', blogData.type);
  const { tip: industryTip } = useFieldTipLLM('industry', blogData.industry);
  const { tip: locationTip } = useFieldTipLLM('location', blogData.location);

  return (
    <div className="blogcreator-guidance-root">
      <header className="blogcreator-header">
        <span className="blogcreator-header-icon">📝</span>
        <h1 className="blogcreator-header-title">{t('restaurantBlogCreator')}</h1>
        <p className="blogcreator-header-desc">{t('generateEngagingBlogContent')}</p>
        
        {/* Step Navigation */}
        <div className="blogcreator-step-navigation">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`blogcreator-step-nav-item ${
                currentStep === step.id ? 'active' : ''
              } ${completedSteps.has(step.id) ? 'completed' : ''} ${
                step.id < currentStep ? 'visited' : ''
              }`}
              onClick={() => goToStep(step.id)}
            >
              <div className="blogcreator-step-nav-icon">
                {completedSteps.has(step.id) ? '✅' : step.icon}
              </div>
              <div className="blogcreator-step-nav-content">
                <div className="blogcreator-step-nav-title">{step.title}</div>
                <div className="blogcreator-step-nav-desc">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className="blogcreator-step-nav-arrow">→</div>
              )}
            </div>
          ))}
        </div>
        
        <div className="blogcreator-header-actions">
          <button
            onClick={() => setShowTips(!showTips)}
            className="blogcreator-tips-toggle"
          >
            {showTips ? '🙈 Hide Tips' : '💡 Show Tips'}
          </button>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="blogcreator-examples-toggle"
          >
            {showExamples ? '📖 Hide Examples' : '📚 Show Examples'}
          </button>
        </div>
      </header>

      <main className="blogcreator-main">
        <div className="blogcreator-main-grid">
          {/* Left: Form Section */}
          <section className="blogcreator-form-panel">
            {/* Step Header */}
            <div className="blogcreator-step-header">
              <div className="blogcreator-step-header-content">
                <h2 className="blogcreator-step-title">
                  {steps[currentStep - 1].icon} {steps[currentStep - 1].title}
                </h2>
                <p className="blogcreator-step-description">
                  {steps[currentStep - 1].description}
                </p>
              </div>
              <div className="blogcreator-step-progress">
                Step {currentStep} of {steps.length}
              </div>
            </div>

            {/* Step Validation Message */}
            {showStepValidation && !isStepCompleted(currentStep) && (
              <div className="blogcreator-step-validation">
                <span className="blogcreator-step-validation-icon">⚠️</span>
                Please complete all required fields in this step before continuing.
              </div>
            )}

            {/* Guidance Panel */}
            {showTips && (
              <div className="blogcreator-guidance-panel">
                <div className="blogcreator-guidance-header">
                  <h3>🎯 Blog Creation Guide</h3>
                  <p>Follow these steps to create engaging blog content</p>
                </div>
                
                {/* Quick Start Templates */}
                <div className="blogcreator-templates-section">
                  <h4>🚀 Quick Start Templates</h4>
                  <p>Choose a template to get started quickly, then customize it for your needs:</p>
                  <div className="blogcreator-templates-grid">
                    {quickStartTemplates.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setBlogData(template.data);
                          setTemplateApplied(true);
                          setTimeout(() => setTemplateApplied(false), 3000);
                        }}
                        className="blogcreator-template-btn"
                        title={`Use ${template.name} template`}
                      >
                        <span className="blogcreator-template-icon">{template.icon}</span>
                        <span className="blogcreator-template-name">{template.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="blogcreator-tips-navigation">
                  {Object.keys(tips).map(tipKey => (
                    <button
                      key={tipKey}
                      onClick={() => setActiveTip(tipKey)}
                      className={`blogcreator-tip-nav-btn ${activeTip === tipKey ? 'active' : ''}`}
                    >
                      {tips[tipKey].title}
                    </button>
                  ))}
                </div>
                
                <div className="blogcreator-tip-content">
                  <h4>{tips[activeTip].title}</h4>
                  <p>{tips[activeTip].content}</p>
                  
                  {showExamples && (
                    <div className="blogcreator-tip-examples">
                      <h5>💡 Examples:</h5>
                      <ul>
                        {tips[activeTip].examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Form Content */}
            <form className="blogcreator-form" autoComplete="off" onSubmit={e => { e.preventDefault(); handleGenerateBlog(); }}>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="blogcreator-step-content">
                  <fieldset className="blogcreator-fieldset">
                    <legend className="blogcreator-legend">
                      {t('basicInformation')}
                      <span className="blogcreator-fieldset-tip">💡 Start with the basics</span>
                    </legend>
                    
                    <div className="blogcreator-field-group">
                      <label className="blogcreator-label" htmlFor="topic">
                        {t('blogTopic')} *
                        <span className="blogcreator-field-hint">What will your blog post be about?</span>
                      </label>
                      <div className="blogcreator-input-with-button">
                        <input
                          id="topic"
                          className="blogcreator-input"
                          type="text"
                          value={blogData.topic}
                          onChange={e => handleInputChange('topic', e.target.value)}
                          placeholder={topicTip || "e.g., Our New Seasonal Menu Launch, Behind the Scenes: Local Ingredients, 5 Tips for First-Time Visitors"}
                          required
                        />
                        <button
                          type="button"
                          className="blogcreator-topic-recommendation-btn"
                          onClick={generateTopicRecommendations}
                          disabled={isGeneratingTopic}
                        >
                          {isGeneratingTopic ? (
                            <>
                              <span className="loading-spinner"></span>
                              Generating...
                            </>
                          ) : (
                            <>
                              💡 Use Recommendation
                            </>
                          )}
                        </button>
                      </div>
                      
                      {/* Topic Recommendations Dropdown */}
                      {showTopicRecommendations && topicRecommendations.length > 0 && (
                        <div className="blogcreator-topic-recommendations">
                          <div className="blogcreator-topic-recommendations-header">
                            <span>🎯 Recommended Topics:</span>
                            <button
                              type="button"
                              className="blogcreator-close-recommendations"
                              onClick={() => setShowTopicRecommendations(false)}
                            >
                              ✕
                            </button>
                          </div>
                          <div className="blogcreator-topic-recommendations-list">
                            {topicRecommendations.map((topic, index) => (
                              <button
                                key={index}
                                type="button"
                                className="blogcreator-topic-recommendation-item"
                                onClick={() => selectTopicRecommendation(topic)}
                              >
                                {topic}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <FieldTipLLM field="topic" value={blogData.topic} />
                      <div className="blogcreator-field-help">
                        <strong>💡 Tip:</strong> Be specific and engaging. Instead of "Menu", try "Our Chef's New Spring Menu Featuring Local Farm Ingredients"
                      </div>
                    </div>
                    
                    <div className="blogcreator-field-group">
                      <label className="blogcreator-label" htmlFor="mainName">
                        Project/Business/Topic Name *
                        <span className="blogcreator-field-hint">The name of your business, project, or main subject</span>
                      </label>
                      <input
                        id="mainName"
                        className="blogcreator-input"
                        type="text"
                        value={blogData.mainName}
                        onChange={e => handleInputChange('mainName', e.target.value)}
                        placeholder={mainNameTip || "e.g., Downtown Bistro, TechStart Inc., Community Garden Project"}
                        required
                      />
                      <FieldTipLLM field="mainName" value={blogData.mainName} />
                    </div>
                    
                    <div className="blogcreator-field-group">
                      <label className="blogcreator-label" htmlFor="type">
                        Type or Category
                        <span className="blogcreator-field-hint">What type of content is this?</span>
                      </label>
                      <select
                        id="type"
                        className="blogcreator-input"
                        value={blogData.type}
                        onChange={e => handleInputChange('type', e.target.value)}
                        placeholder={typeTip || undefined}
                      >
                        <option value="business">Business</option>
                        <option value="project">Project</option>
                        <option value="event">Event</option>
                        <option value="product">Product</option>
                        <option value="organization">Organization</option>
                        <option value="community">Community</option>
                        <option value="other">Other</option>
                      </select>
                      <FieldTipLLM field="type" value={blogData.type} />
                    </div>
                    
                    <div className="blogcreator-field-group">
                      <label className="blogcreator-label" htmlFor="industry">
                        Industry or Field
                        <span className="blogcreator-field-hint">What industry or field does this belong to?</span>
                      </label>
                      <input
                        id="industry"
                        className="blogcreator-input"
                        type="text"
                        value={blogData.industry}
                        onChange={e => handleInputChange('industry', e.target.value)}
                        placeholder={industryTip || "e.g., Food & Beverage, Technology, Education, Healthcare, Art & Culture"}
                      />
                      <FieldTipLLM field="industry" value={blogData.industry} />
                    </div>
                    
                    <div className="blogcreator-field-group">
                      <label className="blogcreator-label" htmlFor="location">
                        {t('location')}
                        <span className="blogcreator-field-hint">Where is this located? (optional)</span>
                      </label>
                      <input
                        id="location"
                        className="blogcreator-input"
                        type="text"
                        value={blogData.location}
                        onChange={e => handleInputChange('location', e.target.value)}
                        placeholder={locationTip || "e.g., Downtown Seattle, West Village, Online, Global"}
                      />
                      <FieldTipLLM field="location" value={blogData.location} />
                    </div>
                  </fieldset>
                  
                  {/* Step Navigation */}
                  <div className="blogcreator-step-actions">
                    <button
                      type="button"
                      className="blogcreator-step-btn blogcreator-step-next"
                      onClick={nextStep}
                    >
                      Next: Content Style →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Content Style */}
              {currentStep === 2 && (
                <div className="blogcreator-step-content">
                  <fieldset className="blogcreator-fieldset">
                    <legend className="blogcreator-legend">
                      {t('contentPreferences')}
                      <span className="blogcreator-fieldset-tip">🎨 Customize your content style</span>
                    </legend>
                    
                    <div className="blogcreator-choice-group">
                      <div className="blogcreator-choice-header">
                        <span className="blogcreator-label">{t('targetAudience')}</span>
                        <span className="blogcreator-choice-hint">Who will read this blog post?</span>
                      </div>
                      <div className="blogcreator-choice-row">
                        {targetAudiences.map(audience => (
                          <button
                            key={audience.value}
                            type="button"
                            className={`blogcreator-choice-btn${blogData.targetAudience === audience.value ? ' selected' : ''}`}
                            onClick={() => handleInputChange('targetAudience', audience.value)}
                            aria-pressed={blogData.targetAudience === audience.value}
                            title={audience.label}
                          >
                            <span className="blogcreator-choice-icon">{audience.icon}</span>
                            <span>{audience.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="blogcreator-choice-group">
                      <div className="blogcreator-choice-header">
                        <span className="blogcreator-label">{t('writingTone')}</span>
                        <span className="blogcreator-choice-hint">What mood should the writing convey?</span>
                      </div>
                      <div className="blogcreator-choice-row">
                        {tones.map(tone => (
                          <button
                            key={tone.value}
                            type="button"
                            className={`blogcreator-choice-btn${blogData.tone === tone.value ? ' selected' : ''}`}
                            onClick={() => handleInputChange('tone', tone.value)}
                            aria-pressed={blogData.tone === tone.value}
                            title={tone.label}
                          >
                            <span className="blogcreator-choice-icon">{tone.icon}</span>
                            <span>{tone.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="blogcreator-choice-group">
                      <div className="blogcreator-choice-header">
                        <span className="blogcreator-label">{t('blogLength')}</span>
                        <span className="blogcreator-choice-hint">How detailed should the content be?</span>
                      </div>
                      <div className="blogcreator-choice-row">
                        {lengths.map(length => (
                          <button
                            key={length.value}
                            type="button"
                            className={`blogcreator-choice-btn${blogData.length === length.value ? ' selected' : ''}`}
                            onClick={() => handleInputChange('length', length.value)}
                            aria-pressed={blogData.length === length.value}
                            title={length.label}
                          >
                            <span className="blogcreator-choice-icon">{length.icon}</span>
                            <span>{length.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </fieldset>
                  
                  {/* Step Navigation */}
                  <div className="blogcreator-step-actions">
                    <button
                      type="button"
                      className="blogcreator-step-btn blogcreator-step-prev"
                      onClick={prevStep}
                    >
                      ← Previous: Basic Information
                    </button>
                    <button
                      type="button"
                      className="blogcreator-step-btn blogcreator-step-next"
                      onClick={nextStep}
                    >
                      Next: Key Content →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Key Content */}
              {currentStep === 3 && (
                <div className="blogcreator-step-content">
                  <fieldset className="blogcreator-fieldset">
                    <legend className="blogcreator-legend">
                      {t('additionalDetails')}
                      <span className="blogcreator-fieldset-tip">✨ Add the finishing touches</span>
                    </legend>
                    
                    <div className="blogcreator-field-group">
                      <label className="blogcreator-label" htmlFor="keyPoints">
                        {t('keyPointsToInclude')} *
                        <span className="blogcreator-field-hint">What are the main points you want to emphasize? This guides the AI to focus on what matters most.</span>
                      </label>
                      <textarea
                        id="keyPoints"
                        className="blogcreator-input"
                        value={blogData.keyPoints}
                        onChange={e => handleInputChange('keyPoints', e.target.value)}
                        placeholder="• Highlight our commitment to local ingredients&#10;• Mention our award-winning chef&#10;• Include customer testimonials&#10;• Emphasize our unique atmosphere&#10;• Explain our signature dishes&#10;• Share our story and mission"
                        rows={4}
                        required
                      />
                      <div className="blogcreator-field-help">
                        <strong>🎯 Key Points Guide:</strong>
                        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                          <li>Start with your main message or value proposition</li>
                          <li>Include specific details about your offerings</li>
                          <li>Mention unique aspects that set you apart</li>
                          <li>Add customer benefits and outcomes</li>
                          <li>Include any calls-to-action you want</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="blogcreator-field-group">
                      <label className="blogcreator-label" htmlFor="specialFeatures">
                        {t('specialFeaturesOrHighlights')} *
                        <span className="blogcreator-field-hint">What makes this special or unique? These details will be woven into your blog story.</span>
                      </label>
                      <textarea
                        id="specialFeatures"
                        className="blogcreator-input"
                        value={blogData.specialFeatures}
                        onChange={e => handleInputChange('specialFeatures', e.target.value)}
                        placeholder="• Recently won 'Best New Restaurant 2024' award&#10;• Only restaurant in the area with rooftop dining&#10;• Family-owned for 3 generations&#10;• Sustainable practices and zero-waste kitchen&#10;• Chef trained in Michelin-starred restaurants&#10;• Source 90% of ingredients from local farms"
                        rows={4}
                        required
                      />
                      <div className="blogcreator-field-help">
                        <strong>✨ Special Features Guide:</strong>
                        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                          <li>Awards, recognitions, or certifications</li>
                          <li>Unique location, atmosphere, or amenities</li>
                          <li>Family history, traditions, or heritage</li>
                          <li>Environmental practices or sustainability</li>
                          <li>Expertise, training, or qualifications</li>
                          <li>Community involvement or partnerships</li>
                        </ul>
                      </div>
                    </div>
                  </fieldset>
                  
                  {/* Step Navigation */}
                  <div className="blogcreator-step-actions">
                    <button
                      type="button"
                      className="blogcreator-step-btn blogcreator-step-prev"
                      onClick={prevStep}
                    >
                      ← Previous: Content Style
                    </button>
                    <button
                      type="button"
                      className="blogcreator-step-btn blogcreator-step-next"
                      onClick={nextStep}
                    >
                      Next: Strategic Planning →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Strategic Planning */}
              {currentStep === 4 && (
                <div className="blogcreator-step-content">
                  <fieldset className="blogcreator-fieldset">
                    <legend className="blogcreator-legend">
                      Strategic Content Planning
                      <span className="blogcreator-fieldset-tip">🧠 AI-powered strategy and outline generation</span>
                    </legend>
                    
                    <div className="blogcreator-field-group">
                      <div className="blogcreator-planning-header">
                        <h3>🎯 Goal-Driven Strategic Planning</h3>
                        <p>Define clear objectives and create a focused content strategy for maximum impact</p>
                      </div>
                      
                      {!planGenerated ? (
                        <div className="blogcreator-planning-section">
                          <div className="blogcreator-planning-info">
                            <h4>What will be generated:</h4>
                            <ul>
                              <li>🎯 Clear primary goal and business objective</li>
                              <li>👥 Specific target audience profile and pain points</li>
                              <li>📝 Structured content outline with key sections</li>
                              <li>🔍 SEO strategy with primary keywords</li>
                              <li>💡 Engagement tactics and call-to-action plan</li>
                              <li>📊 Measurable success metrics and KPIs</li>
                              <li>⚠️ Clarifying questions if goals need definition</li>
                            </ul>
                          </div>
                          
                          <button
                            type="button"
                            className="blogcreator-planning-btn"
                            onClick={generateStrategicPlan}
                            disabled={isPlanning}
                          >
                            {isPlanning ? (
                              <>
                                <span className="loading-spinner"></span>
                                Generating Strategic Plan...
                              </>
                            ) : (
                              <>
                                🧠 Generate Strategic Plan
                              </>
                            )}
                          </button>
                          
                          {planError && (
                            <div className="blogcreator-error">
                              <span>⚠️ {planError}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="blogcreator-planning-result">
                          <div className="blogcreator-planning-actions">
                            <button
                              type="button"
                              className="blogcreator-planning-btn secondary"
                              onClick={regenerateStrategicPlan}
                              disabled={isPlanning}
                            >
                              🔄 Regenerate Plan
                            </button>
                            <div className="blogcreator-planning-status">
                              ✅ Strategic plan generated successfully
                            </div>
                          </div>
                          
                          <div className="blogcreator-planning-content">
                            <h4>📋 Generated Strategic Plan:</h4>
                            <div className="blogcreator-planning-text">
                              <pre style={{
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'inherit',
                                fontSize: '14px',
                                lineHeight: '1.6',
                                background: '#f8f9fa',
                                padding: '16px',
                                borderRadius: '8px',
                                border: '1px solid #e9ecef',
                                maxHeight: '400px',
                                overflow: 'auto'
                              }}>
                                {strategicPlan}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </fieldset>
                  
                  {/* Step Navigation */}
                  <div className="blogcreator-step-actions">
                    <button
                      type="button"
                      className="blogcreator-step-btn blogcreator-step-prev"
                      onClick={prevStep}
                    >
                      ← Previous: Key Content
                    </button>
                    <button
                      type="button"
                      className="blogcreator-step-btn blogcreator-step-next"
                      onClick={nextStep}
                      disabled={!planGenerated}
                    >
                      Next: Images & Review →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Images & Review */}
              {currentStep === 5 && (
                <div className="blogcreator-step-content">
                  <fieldset className="blogcreator-fieldset">
                    <legend className="blogcreator-legend">{t('blogImages')}</legend>
                    <div className="blogcreator-upload-area">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="blogcreator-upload-label">
                        <span className="blogcreator-upload-icon">📤</span> {t('chooseImages')}
                      </label>
                      <span className="blogcreator-upload-support">{t('supportsJpegPngGifWebp')}</span>
                    </div>
                    {isUploading && (
                      <div className="blogcreator-upload-progress">
                        <div className="blogcreator-upload-bar-bg">
                          <div className="blogcreator-upload-bar" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                      </div>
                    )}
                    {images.length > 0 && (
                      <div className="blogcreator-image-grid">
                        {images.map((image, index) => (
                          <div key={image.id} className="blogcreator-image-preview">
                            <img src={image.dataUrl} alt={image.name} />
                            <div className="blogcreator-image-name">{image.name.length > 12 ? image.name.substring(0, 12) + '...' : image.name}</div>
                            <div className="blogcreator-image-size">{formatFileSize(image.size)}</div>
                            <div className="blogcreator-image-actions">
                              <button type="button" className="remove" onClick={() => removeImage(image.id)}>🗑️</button>
                              {index > 0 && <button type="button" onClick={() => reorderImages(index, index - 1)}>⬆️</button>}
                              {index < images.length - 1 && <button type="button" onClick={() => reorderImages(index, index + 1)}>⬇️</button>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </fieldset>

                  {/* Review Section */}
                  <fieldset className="blogcreator-fieldset">
                    <legend className="blogcreator-legend">
                      Review Your Blog Details
                      <span className="blogcreator-fieldset-tip">📋 Double-check everything before generating</span>
                    </legend>
                    
                    <div className="blogcreator-review-grid">
                      <div className="blogcreator-review-item">
                        <strong>Topic:</strong> {blogData.topic || 'Not specified'}
                      </div>
                      <div className="blogcreator-review-item">
                        <strong>Business/Project:</strong> {blogData.mainName || 'Not specified'}
                      </div>
                      <div className="blogcreator-review-item">
                        <strong>Type:</strong> {blogData.type || 'Not specified'}
                      </div>
                      <div className="blogcreator-review-item">
                        <strong>Industry:</strong> {blogData.industry || 'Not specified'}
                      </div>
                      <div className="blogcreator-review-item">
                        <strong>Location:</strong> {blogData.location || 'Not specified'}
                      </div>
                      <div className="blogcreator-review-item">
                        <strong>Target Audience:</strong> {blogData.targetAudience || 'Not specified'}
                      </div>
                      <div className="blogcreator-review-item">
                        <strong>Tone:</strong> {blogData.tone || 'Not specified'}
                      </div>
                      <div className="blogcreator-review-item">
                        <strong>Length:</strong> {blogData.length || 'Not specified'}
                      </div>
                      <div className="blogcreator-review-item">
                        <strong>Images:</strong> {images.length} selected
                      </div>
                    </div>
                  </fieldset>
                  
                  {/* Step Navigation */}
                  <div className="blogcreator-step-actions">
                    <button
                      type="button"
                      className="blogcreator-step-btn blogcreator-step-prev"
                      onClick={prevStep}
                    >
                      ← Previous: Strategic Planning
                    </button>
                    <button
                      type="submit"
                      className="blogcreator-submit-btn"
                      disabled={isGenerating || !blogData.topic.trim() || !blogData.mainName.trim() || !blogData.keyPoints.trim() || !blogData.specialFeatures.trim()}
                    >
                      {isGenerating ? (
                        <span className="blogcreator-spinner"></span>
                      ) : (
                        <span className="blogcreator-submit-label">🚀 Generate Blog Post</span>
                      )}
                    </button>
                  </div>
                  
                  {isGenerating && (
                    <div className="blogcreator-generating-info">
                      <p>🤖 AI is crafting your blog post...</p>
                      <p>This usually takes 30-60 seconds. We're analyzing your inputs and creating engaging content!</p>
                    </div>
                  )}
                </div>
              )}
            </form>
          </section>

          {/* Right: Preview Section - Empty for guidance component */}
          <section className="blogcreator-preview-panel">
            <div className="blogcreator-preview-placeholder">
              <div className="blogcreator-preview-placeholder-content">
                <span className="blogcreator-preview-placeholder-icon">📝</span>
                <h3>Blog Preview</h3>
                <p>Complete the steps to generate your blog post and see it here.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Success/Error Messages */}
        {templateApplied && (
          <div className="blog-creator-success-message">
            <span className="blog-creator-success-icon">✅</span> Template applied! You can now customize the content for your needs.
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogCreatorGuidance; 