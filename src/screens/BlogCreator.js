import React, { useState, useEffect } from 'react';
import apiConfig from '../config/api';
import { useTranslation } from 'react-i18next';
import './BlogCreator.css';
import { FieldTipLLM, useFieldTipLLM } from './FieldTipLLM';

const BlogCreator = () => {
  const [blogData, setBlogData] = useState({
    topic: '',
    mainName: '', // generalized from restaurantName
    type: 'business', // generalized from restaurantType
    industry: '', // generalized from cuisine
    location: '',
    targetAudience: 'general',
    tone: 'professional',
    length: 'medium',
    keyPoints: '',
    specialFeatures: ''
  });
  const [showTips, setShowTips] = useState(true);
  const [activeTip, setActiveTip] = useState('getting-started');
  const [showExamples, setShowExamples] = useState(false);
  const [templateApplied, setTemplateApplied] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  // API key is now handled securely on the server
  
  // Image upload states
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageAnalysis, setImageAnalysis] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedBlog, setEditedBlog] = useState('');
  const [syncSuccess, setSyncSuccess] = useState(false);
  
  // Step-by-step wizard states
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showStepValidation, setShowStepValidation] = useState(false);

  const { t } = useTranslation();

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

  const handleInputChange = (field, value) => {
    setBlogData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Check if step is completed when field changes
    checkStepCompletion();
  };

  // Check if current step is completed
  const isStepCompleted = (stepId) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return false;
    
    return step.fields.every(field => {
      if (field === 'images') return true; // Images are optional
      return blogData[field] && blogData[field].toString().trim() !== '';
    });
  };

  // Check step completion and update completed steps
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

  // Navigate to next step
  const nextStep = () => {
    if (isStepCompleted(currentStep) && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setShowStepValidation(false);
    } else {
      setShowStepValidation(true);
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowStepValidation(false);
    }
  };

  // Navigate to specific step
  const goToStep = (stepId) => {
    if (stepId <= currentStep || completedSteps.has(stepId - 1)) {
      setCurrentStep(stepId);
      setShowStepValidation(false);
    }
  };

  // API key is now handled securely on the server

  const generateBlogPost = async () => {
    // Validate input
    if (!blogData.topic.trim()) {
      setError(t('pleaseEnterBlogTopic'));
      return;
    }

    if (!blogData.mainName.trim()) {
      setError(t('pleaseEnterMainName'));
      return;
    }

    if (!blogData.keyPoints.trim()) {
      setError('Please provide key points to include. This helps AI focus on what matters most to your audience.');
      return;
    }

    if (!blogData.specialFeatures.trim()) {
      setError('Please describe your special features or highlights. These unique details make your story compelling.');
      return;
    }

    // API key is now handled securely on the server

    setIsGenerating(true);
    setError('');
    setGeneratedBlog('');

    try {
      // Force production URL if we're on Netlify
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;
      
      // Prepare image data for the API
      const imageData = images.map(img => ({
        name: img.name,
        type: img.type,
        size: img.size,
        dataUrl: img.dataUrl
      }));

      const res = await fetch(`${baseURL}/blog/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blogData,
          images: imageData
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedBlog(data.blogPost);
        setImageAnalysis(data.imageAnalysis);
        
        // Save to localStorage for history
        const blogHistory = JSON.parse(localStorage.getItem('blogHistory') || '[]');
        const newBlog = {
          id: Date.now(),
          ...blogData,
          blogPost: data.blogPost,
          images: images,
          imageAnalysis: data.imageAnalysis,
          model: data.model,
          wordCount: data.wordCount,
          metadata: data.metadata,
          timestamp: new Date().toISOString()
        };
        blogHistory.unshift(newBlog);
        localStorage.setItem('blogHistory', JSON.stringify(blogHistory.slice(0, 20))); // Keep last 20

        // Save to backend database
        try {
          await fetch(`${baseURL}/blog/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...blogData,
              blogPost: data.blogPost,
              images: images,
              imageAnalysis: data.imageAnalysis,
              model: data.model,
              wordCount: data.wordCount,
              metadata: data.metadata
            })
          });
        } catch (saveErr) {
          // Optionally show a warning, but don't block UI
          console.warn(t('failedToSaveBlogPostToBackend'), saveErr);
        }
      } else {
        setError(data.error || t('failedToGenerateBlogPost'));
      }
    } catch (err) {
      setError(t('networkError', { errorMessage: err.message }));
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    // Create a rich text version with image references
    let richContent = generatedBlog;
    
    if (images.length > 0) {
      richContent += '\n\n' + t('imagesSectionHeader') + '\n';
      images.forEach((image, index) => {
        richContent += `\n[Image ${index + 1}: ${image.name}]\n`;
      });
      richContent += '\n' + t('imagesEmbeddedNote');
    }
    
    navigator.clipboard.writeText(richContent);
    alert(t('blogPostCopiedToClipboard'));
  };

  const resetForm = () => {
    setBlogData({
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
    setGeneratedBlog('');
    setError('');
    setImages([]);
    setImageAnalysis(null);
  };

  const getWordCount = () => {
    if (!generatedBlog) return 0;
    return generatedBlog.split(/\s+/).length;
  };

  // Function to clean and format blog content
  const cleanAndFormatBlogContent = (content) => {
    if (!content) return '';
    
    let cleanedContent = content;
    
    // Remove image placement suggestions and technical instructions
    cleanedContent = cleanedContent
      // Remove image placement suggestions
      .replace(/\[Image \d+: [^\]]+\]/g, '')
      .replace(/\[Place image here[^\]]*\]/g, '')
      .replace(/\[Insert image[^\]]*\]/g, '')
      .replace(/\[Add image[^\]]*\]/g, '')
      .replace(/\[Image placement[^\]]*\]/g, '')
      .replace(/\[Caption: [^\]]+\]/g, '')
      .replace(/\[Suggested caption[^\]]*\]/g, '')
      // Remove technical image instructions
      .replace(/Note: Images are embedded[^.]*\./g, '')
      .replace(/Images are embedded[^.]*\./g, '')
      .replace(/Image integration[^.]*\./g, '')
      .replace(/Image placement[^.]*\./g, '')
      // Remove markdown code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove inline code blocks
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
      // Remove markdown list markers but keep content
      .replace(/^[-*+]\s+/gm, '• ')
      .replace(/^\d+\.\s+/gm, (match) => {
        const num = match.match(/\d+/)[0];
        return `${num}. `;
      });
    
    // Keep strategic emojis but remove excessive ones
    // Define emojis to keep (food, quality, service, location, action, emotion)
    const keepEmojis = /[🍽️🍕🍔🍜🍣🍰☕🍷🍺🥗🥩🍤⭐🌟💎👑🏆💫✨👨‍🍳👩‍🍳🛎️💁‍♂️💁‍♀️🤝📍🏙️🌆🏘️😋😍🤤😊😌🎉🎊🚀💪🎯🔥💡📸📷]/g;
    
    // Remove excessive emojis while preserving strategic ones
    cleanedContent = cleanedContent
      // Remove excessive decorative emojis
      .replace(/[🔍🎯📝📊📈📉📋✅❌⚠️🚨💡💭💬💪🎈🎁🎂🎄🎃🎅🎆🎇🎈🎉🎊🎋🎌🎍🎎🎏🎐🎑🎒🎓🎔🎕🎖️🎗️🎘️🎙️🎚️🎛️🎜️🎝️🎞️🎟️🎠🎡🎢🎣🎤🎥🎦🎧🎨🎩🎪🎫🎬🎭🎮🎯🎰🎱🎲🎳🎴🎵🎶🎷🎸🎹🎺🎻🎼🎽🎾🎿🏀🏁🏂🏃🏄🏅🏆🏇🏈🏉🏊🏋️🏌️🏍️🏎️🏏🏐🏑🏒🏓🏔️🏕️🏖️🏗️🏘️🏙️🏚️🏛️🏜️🏝️🏞️🏟️🏠🏡🏢🏣🏤🏥🏦🏧🏨🏩🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳️🏴🏵️🏷️🏸🏹🏺🏻🏼🏽🏾🏿]/g, '')
      // Remove excessive decorative symbols
      .replace(/[⚡✨🌟💫⭐]/g, '')
      // Remove excessive food emojis but keep strategic ones
      .replace(/[🍟🍖🍗🍘🍙🍚🍛🍝🍞🍟🍠🍡🍢🍤🍥🍦🍧🍨🍩🍪🍫🍬🍭🍮🍯🍱🍲🍳🍴🍵🍶🍸🍹🍻🍼🍾🍿]/g, '')
      // Remove excessive building emojis
      .replace(/[🏪🏫🏬🏭🏮🏯🏰🏱🏲🏳️🏴🏵️🏶🏷️🏸🏹🏺🏻🏼🏽🏾🏿]/g, '')
      // Remove excessive device emojis
      .replace(/[📱📲📳📴📵📶📷📹📺📻📼📽️📾📿]/g, '')
      // Remove excessive communication emojis
      .replace(/[💬💭💮💯💰💱💲💳💴💵💶💷💸💹💺💻💼💽💾💿📀]/g, '');
    
    // Clean up excessive punctuation
    cleanedContent = cleanedContent
      .replace(/\.{3,}/g, '...')
      .replace(/!{2,}/g, '!')
      .replace(/\?{2,}/g, '?')
      .replace(/_{2,}/g, '_')
      .replace(/\*{3,}/g, '**');
    
    // Clean up excessive spacing
    cleanedContent = cleanedContent
      .replace(/\n{3,}/g, '\n\n')
      .replace(/ {2,}/g, ' ')
      .replace(/\t/g, ' ');
    
    // Enhanced heading hierarchy formatting
    cleanedContent = cleanedContent
      // Fix H1 headings (main title)
      .replace(/^#\s*(.+)$/gm, '# $1')
      // Fix H2 headings (major sections)
      .replace(/^##\s*(.+)$/gm, '## $1')
      // Fix H3 headings (subsections)
      .replace(/^###\s*(.+)$/gm, '### $1')
      // Fix H4 headings (detailed points)
      .replace(/^####\s*(.+)$/gm, '#### $1')
      // Convert ALL CAPS lines to H2 headings (if they look like headings)
      .replace(/^([A-Z][A-Z\s]+)$/gm, (match) => {
        const trimmed = match.trim();
        if (trimmed.length > 3 && trimmed.length < 60 && !trimmed.includes('.')) {
          return `## ${trimmed}`;
        }
        return match;
      })
      // Convert Title Case lines to H3 headings (if they look like headings)
      .replace(/^([A-Z][a-z\s]+)$/gm, (match) => {
        const trimmed = match.trim();
        if (trimmed.length > 3 && trimmed.length < 50 && !trimmed.includes('.') && !trimmed.includes('!') && !trimmed.includes('?')) {
          return `### ${trimmed}`;
        }
        return match;
      });
    
    // Clean up bullet points and lists
    cleanedContent = cleanedContent
      .replace(/^[-*•]\s*/gm, '• ')
      .replace(/^[0-9]+\.\s*/gm, (match) => {
        return match.replace(/^[0-9]+\.\s*/, (num) => `${num.split('.')[0]}. `);
      });
    
    // Ensure proper spacing around headings
    cleanedContent = cleanedContent
      .replace(/([^\n])\n(#+\s)/g, '$1\n\n$2')
      .replace(/(#+\s[^\n]+)\n([^\n])/g, '$1\n\n$2');
    
    // Remove any remaining markdown artifacts
    cleanedContent = cleanedContent
      // Remove any remaining markdown syntax
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      // Remove any remaining markdown list markers
      .replace(/^[-*+]\s+/gm, '• ')
      // Remove any remaining markdown blockquotes
      .replace(/^>\s*/gm, '')
      // Remove any remaining markdown horizontal rules
      .replace(/^[-*_]{3,}$/gm, '')
      // Remove any remaining markdown table syntax
      .replace(/^\|.*\|$/gm, '');
    
    return cleanedContent.trim();
  };

  // Function to render hierarchical content with proper styling
  const renderHierarchicalContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // H1 - Main title (usually not used in blog content, but handle it)
      if (trimmedLine.startsWith('# ') && !trimmedLine.startsWith('##')) {
        return (
          <div key={index} className="blog-h1">
            {trimmedLine.substring(2)}
          </div>
        );
      }
      
      // H2 - Major sections
      if (trimmedLine.startsWith('## ')) {
        return (
          <div key={index} className="blog-h2">
            {trimmedLine.substring(3)}
          </div>
        );
      }
      
      // H3 - Subsections
      if (trimmedLine.startsWith('### ')) {
        return (
          <div key={index} className="blog-h3">
            {trimmedLine.substring(4)}
          </div>
        );
      }
      
      // H4 - Detailed points
      if (trimmedLine.startsWith('#### ')) {
        return (
          <div key={index} className="blog-h4">
            {trimmedLine.substring(5)}
          </div>
        );
      }
      
      // Bullet points
      if (trimmedLine.startsWith('• ')) {
        return (
          <div key={index} className="blog-post-list-item">
            <span className="list-bullet">•</span>
            <span className="list-text">
              {trimmedLine.substring(2)}
            </span>
          </div>
        );
      }
      
      // Numbered lists
      if (/^\d+\.\s/.test(trimmedLine)) {
        return (
          <div key={index} className="blog-post-list-item">
            <span className="list-number">
              {trimmedLine.match(/^\d+/)[0]}.
            </span>
            <span className="list-text">
              {trimmedLine.replace(/^\d+\.\s/, '')}
            </span>
          </div>
        );
      }
      
      // Bold text and key points highlighting
      if (trimmedLine.includes('**')) {
        const parts = trimmedLine.split('**');
        return (
          <p key={index} className="blog-post-paragraph">
            {parts.map((part, partIndex) => (
              partIndex % 2 === 1 ? (
                <strong key={partIndex} className="highlighted-text">
                  {part}
                </strong>
              ) : (
                <span key={partIndex}>{part}</span>
              )
            ))}
          </p>
        );
      }
      
      // Highlight important sentences and key points
      if (trimmedLine.includes('✨') || trimmedLine.includes('💡') || trimmedLine.includes('🎯') || 
          trimmedLine.includes('⭐') || trimmedLine.includes('🔥') || trimmedLine.includes('💎')) {
        return (
          <div key={index} className="blog-post-highlight">
            <p className="highlighted-text">
              {trimmedLine}
            </p>
          </div>
        );
      }
      
      // Regular paragraphs
      if (trimmedLine) {
        return (
          <p key={index} className="blog-post-paragraph">
            {trimmedLine}
          </p>
        );
      }
      
      // Empty lines
      return <div key={index} className="blog-post-empty-line" />;
    });
  };

  // Function to render blog content with embedded images
  const renderBlogWithImages = () => {
    // Clean and format the blog content
    const cleanedContent = cleanAndFormatBlogContent(generatedBlog);
    
    if (!cleanedContent || !images.length) {
      return (
        <div className="blog-post-content">
          {renderHierarchicalContent(cleanedContent)}
        </div>
      );
    }

    // Split the blog content into paragraphs
    const paragraphs = cleanedContent.split('\n\n').filter(p => p.trim());
    
    // Create image placement strategy
    const imagePlacement = [];
    if (images.length === 1) {
      imagePlacement.push(0); // After first paragraph
    } else if (images.length === 2) {
      imagePlacement.push(0, Math.floor(paragraphs.length / 2));
    } else if (images.length === 3) {
      imagePlacement.push(0, Math.floor(paragraphs.length / 3), Math.floor(paragraphs.length * 2 / 3));
    } else {
      // For more images, distribute them evenly
      for (let i = 0; i < images.length; i++) {
        imagePlacement.push(Math.floor((paragraphs.length * i) / images.length));
      }
    }

    return (
      <div className="blog-post-content">
        {paragraphs.map((paragraph, index) => (
          <div key={index}>
            <div className="blog-post-paragraph-container">
              {renderHierarchicalContent(paragraph)}
            </div>
            
            {/* Insert images at strategic points */}
            {imagePlacement.includes(index) && (
              <div className="blog-post-image-section">
                {images.slice(0, imagePlacement.filter(p => p <= index).length).map((image, imgIndex) => {
                  if (imagePlacement.indexOf(index) === imgIndex) {
                    return (
                      <div key={image.id} className="blog-post-image-container">
                        <img
                          src={image.dataUrl}
                          alt={image.name}
                          className="blog-post-image"
                        />
                        <div className="blog-post-image-caption">
                          {image.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        ))}
        
        {/* Display remaining images at the end if any */}
        {imagePlacement.length < images.length && (
          <div className="blog-post-image-section">

            <div className="blog-post-image-grid">
              {images.slice(imagePlacement.length).map((image) => (
                <div key={image.id} className="blog-post-image-container">
                  <img
                    src={image.dataUrl}
                    alt={image.name}
                    className="blog-post-image"
                  />
                  <div className="blog-post-image-caption">
                    {image.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Contextual tips based on blogData
  const getContextualTips = (blogData) => {
    const tips = [];
    const topic = blogData.topic.toLowerCase();
    const industry = blogData.industry.toLowerCase();
    const type = blogData.type.toLowerCase();
    const location = blogData.location.toLowerCase();

    // Topic-based tips
    if (topic.includes('menu') || type === 'restaurant') {
      tips.push('🍽️ Highlight your signature dishes and what makes your menu unique.');
      tips.push('👨‍🍳 Mention your chef\'s background or cooking philosophy.');
    }
    if (topic.includes('launch') || topic.includes('new')) {
      tips.push('🚀 Announce what\'s new and why it matters to your audience.');
      tips.push('🎉 Share any launch events, promotions, or special offers.');
    }
    if (topic.includes('event') || type === 'event') {
      tips.push('📅 Clearly state the event date, time, and location.');
      tips.push('🎟️ Tell readers how to register or participate.');
    }
    if (topic.includes('update') || topic.includes('news')) {
      tips.push('📰 Summarize the most important updates at the top.');
      tips.push('📈 Explain how these updates benefit your audience.');
    }

    // Industry-based tips
    if (industry.includes('technology')) {
      tips.push('💡 Explain how your product solves a real-world problem.');
      tips.push('🔬 Mention any innovative features or technical breakthroughs.');
    }
    if (industry.includes('food') || industry.includes('beverage')) {
      tips.push('🥗 Describe the ingredients and sourcing for your dishes.');
      tips.push('🏆 Mention any awards or recognitions.');
    }
    if (industry.includes('community')) {
      tips.push('🤝 Highlight community involvement or partnerships.');
      tips.push('🏘️ Share stories that connect with local readers.');
    }

    // Type/category-based tips
    if (type === 'product') {
      tips.push('📦 List key features and benefits of your product.');
      tips.push('🛠️ Include testimonials or early user feedback.');
    }
    if (type === 'event') {
      tips.push('🎤 Mention guest speakers, performers, or special guests.');
      tips.push('📸 Suggest sharing photos or highlights after the event.');
    }
    if (type === 'business') {
      tips.push('🏢 Share your business mission and values.');
      tips.push('📊 Include recent achievements or milestones.');
    }

    // Location-based tips
    if (location) {
      tips.push('📍 Mention what makes your location special or unique.');
      tips.push('🌎 Highlight any local partnerships or community events.');
    }

    // General fallback
    if (tips.length === 0) {
      tips.push('💡 Be specific and authentic—share what makes your story unique!');
    }

    return tips;
  };

  const { tip: topicTip } = useFieldTipLLM('topic', blogData.topic);
  const { tip: mainNameTip } = useFieldTipLLM('mainName', blogData.mainName);
  const { tip: typeTip } = useFieldTipLLM('type', blogData.type);
  const { tip: industryTip } = useFieldTipLLM('industry', blogData.industry);
  const { tip: locationTip } = useFieldTipLLM('location', blogData.location);

  return (
    <div className="blogcreator-root">
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
            {showTips && !generatedBlog && (
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
                {/* Contextual Tips Section */}
                <div className="blogcreator-contextual-tips">
                  <h5>🔎 Contextual Tips for Your Blog</h5>
                  <ul>
                    {getContextualTips(blogData).map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="blogcreator-progress-indicator">
                  <div className="blogcreator-progress-steps">
                    <div className={`blogcreator-step ${blogData.topic ? 'completed' : ''}`}>
                      <span className="blogcreator-step-icon">📝</span>
                      <span className="blogcreator-step-text">Topic</span>
                    </div>
                    <div className={`blogcreator-step ${blogData.mainName ? 'completed' : ''}`}>
                      <span className="blogcreator-step-icon">🏢</span>
                      <span className="blogcreator-step-text">Name</span>
                    </div>
                    <div className={`blogcreator-step ${blogData.industry ? 'completed' : ''}`}>
                      <span className="blogcreator-step-icon">🎯</span>
                      <span className="blogcreator-step-text">Industry</span>
                    </div>
                    <div className={`blogcreator-step ${blogData.keyPoints ? 'completed' : ''}`}>
                      <span className="blogcreator-step-icon">✨</span>
                      <span className="blogcreator-step-text">Key Points</span>
                    </div>
                    <div className={`blogcreator-step ${blogData.specialFeatures ? 'completed' : ''}`}>
                      <span className="blogcreator-step-icon">🏆</span>
                      <span className="blogcreator-step-text">Features</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {!generatedBlog && (
              <form className="blogcreator-form" autoComplete="off" onSubmit={e => { e.preventDefault(); generateBlogPost(); }}>
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
                        <input
                          id="topic"
                          className="blogcreator-input"
                          type="text"
                          value={blogData.topic}
                          onChange={e => handleInputChange('topic', e.target.value)}
                          placeholder={topicTip || "e.g., Our New Seasonal Menu Launch, Behind the Scenes: Local Ingredients, 5 Tips for First-Time Visitors"}
                          required
                        />
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
                        Next: Images & Review →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Images & Review */}
                {currentStep === 4 && (
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
                        ← Previous: Key Content
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
            )}
          </section>
          {/* Right: Preview Section */}
          <section className="blogcreator-preview-panel">
            {generatedBlog && (
              <div className="blogcreator-preview-card">
                <header className="blogcreator-preview-header">
                  <span className="blogcreator-preview-icon">✨</span>
                  <h2 className="blogcreator-preview-title">{t('yourGeneratedBlogPost')}</h2>
                </header>
                <div className="blogcreator-preview-content-scroll">
                  <div className="blogcreator-preview-content">
                    {isEditing ? (
                      <>
                        <textarea
                          className="blogcreator-edit-textarea"
                          value={editedBlog}
                          onChange={e => setEditedBlog(e.target.value)}
                          rows={16}
                          style={{ width: '100%', fontSize: '15px', padding: '12px', borderRadius: '8px', border: '1.5px solid #e2e8f0', marginBottom: '12px', fontFamily: 'inherit', background: '#f8fafc' }}
                        />
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                          <button
                            className="blogcreator-submit-btn"
                            style={{ maxWidth: 180 }}
                            onClick={async () => {
                              setGeneratedBlog(editedBlog);
                              setIsEditing(false);

                              // Update localStorage by unique id
                              const blogHistory = JSON.parse(localStorage.getItem('blogHistory') || '[]');
                              let updated = false;
                              if (blogHistory.length > 0) {
                                // Try to match by id (if available)
                                const currentId = blogHistory[0].id || null;
                                const idx = blogHistory.findIndex(post => post.id === currentId);
                                if (idx !== -1) {
                                  blogHistory[idx] = { ...blogHistory[idx], blogPost: editedBlog };
                                  updated = true;
                                }
                              }
                              if (!updated && blogHistory.length > 0) {
                                // fallback: update most recent
                                blogHistory[0].blogPost = editedBlog;
                              }
                              localStorage.setItem('blogHistory', JSON.stringify(blogHistory));

                              // Update backend
                              try {
                                const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
                                const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;
                                await fetch(`${baseURL}/blog/save`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    ...blogData,
                                    blogPost: editedBlog,
                                    images: images,
                                    imageAnalysis: imageAnalysis,
                                  })
                                });
                                setSyncSuccess(true);
                                setTimeout(() => setSyncSuccess(false), 2500);
                              } catch (err) {
                                // Optionally handle error
                              }
                            }}
                          >💾 Save</button>
                          <button
                            className="blogcreator-submit-btn"
                            style={{ background: '#e2e8f0', color: '#374151', maxWidth: 180 }}
                            onClick={() => setIsEditing(false)}
                            type="button"
                          >❌ Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                    {renderHierarchicalContent(generatedBlog)}
                        <div style={{ marginTop: '18px', textAlign: 'right' }}>
                          <button
                            className="blogcreator-submit-btn"
                            style={{ maxWidth: 180 }}
                            onClick={() => { setIsEditing(true); setEditedBlog(generatedBlog); }}
                            type="button"
                          >✏️ Edit Blog</button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <footer className="blogcreator-preview-info">
                  <span className="blogcreator-preview-info-item">
                    <span className="blogcreator-preview-info-icon">📊</span> {t('wordCount')}: {getWordCount()} {t('words')}
                  </span>
                  <span className="blogcreator-preview-info-item">
                    <span className="blogcreator-preview-info-icon">📸</span> {t('images')}: {images.length}
                  </span>
                  <span className="blogcreator-preview-info-item">
                    <span className="blogcreator-preview-info-icon">🤖</span> {t('model')}: NVIDIA Llama 3.3 Nemotron Super 49B
                  </span>
                  <span className="blogcreator-preview-info-item">
                    <span className="blogcreator-preview-info-icon">📅</span> {t('generated')}: {new Date().toLocaleString()}
                  </span>
                </footer>
                {imageAnalysis && (
                  <div className="blogcreator-preview-image-analysis">
                    <h4 className="blogcreator-preview-image-analysis-title">
                      <span className="blogcreator-preview-info-icon">📸</span> {t('imageIntegrationAnalysis')}
                    </h4>
                    <div className="blogcreator-preview-image-analysis-grid">
                      {imageAnalysis.imageDetails.map((img, index) => (
                        <div key={index} className="blogcreator-preview-image-analysis-item">
                          <div className="blogcreator-preview-image-analysis-name">{img.name}</div>
                          <div className="blogcreator-preview-image-analysis-placement">📍 {t('placement')}: {img.suggestedPlacement}</div>
                          <div className="blogcreator-preview-image-analysis-caption">💬 {t('caption')}: {img.suggestedCaption}</div>
                        </div>
                      ))}
                    </div>
                    {imageAnalysis.integrationSuggestions.length > 0 && (
                      <div className="blogcreator-preview-integration-suggestions">
                        <div className="blogcreator-preview-integration-suggestions-title">
                          <span className="blogcreator-preview-info-icon">💡</span> {t('integrationSuggestions')}:
                        </div>
                        <ul className="blogcreator-preview-integration-suggestions-list">
                          {imageAnalysis.integrationSuggestions.map((suggestion, index) => (
                            <li key={index}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
        {/* Success/Error Messages */}
        {templateApplied && (
          <div className="blog-creator-success-message">
            <span className="blog-creator-success-icon">✅</span> Template applied! You can now customize the content for your needs.
          </div>
        )}
        {error && (
          <div className="blog-creator-error-message">
            <span className="blog-creator-error-icon">⚠️</span> {error}
          </div>
        )}
        {syncSuccess && (
          <div className="blog-creator-success-message">
            <span className="blog-creator-success-icon">✅</span> Blog post updated and synchronized!
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogCreator; 