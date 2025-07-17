import React, { useState, useEffect } from 'react';
import apiConfig from '../config/api';
import { useTranslation } from 'react-i18next';
import './BlogCreator.css';

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
  const [generatedBlog, setGeneratedBlog] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  // API key is now handled securely on the server
  
  // Image upload states
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageAnalysis, setImageAnalysis] = useState(null);

  const { t } = useTranslation();

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
          <h1 key={index} className="blog-post-heading">
            {trimmedLine.substring(2)}
          </h1>
        );
      }
      
      // H2 - Major sections
      if (trimmedLine.startsWith('## ')) {
        return (
          <h2 key={index} className="blog-post-heading">
            {trimmedLine.substring(3)}
          </h2>
        );
      }
      
      // H3 - Subsections
      if (trimmedLine.startsWith('### ')) {
        return (
          <h3 key={index} className="blog-post-heading">
            {trimmedLine.substring(4)}
          </h3>
        );
      }
      
      // H4 - Detailed points
      if (trimmedLine.startsWith('#### ')) {
        return (
          <h4 key={index} className="blog-post-heading">
            {trimmedLine.substring(5)}
          </h4>
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

  return (
    <div className="blogcreator-root">
      <header className="blogcreator-header">
        <span className="blogcreator-header-icon">📝</span>
        <h1 className="blogcreator-header-title">{t('restaurantBlogCreator')}</h1>
        <p className="blogcreator-header-desc">{t('generateEngagingBlogContent')}</p>
      </header>
      <main className="blogcreator-main">
        <div className="blogcreator-main-grid">
          {/* Left: Form Section */}
          <section className="blogcreator-form-panel">
            {!generatedBlog && (
              <form className="blogcreator-form" autoComplete="off" onSubmit={e => { e.preventDefault(); generateBlogPost(); }}>
                {/* Image Upload Section */}
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

                {/* Basic Information */}
                <fieldset className="blogcreator-fieldset">
                  <legend className="blogcreator-legend">{t('basicInformation')}</legend>
                  <label className="blogcreator-label" htmlFor="topic">{t('blogTopic')} *</label>
                  <input
                    id="topic"
                    className="blogcreator-input"
                    type="text"
                    value={blogData.topic}
                    onChange={e => handleInputChange('topic', e.target.value)}
                    placeholder={t('e.g.,OurNewSeasonalMenuBehindTheScenesLocalIngredients')}
                    required
                  />
                  <label className="blogcreator-label" htmlFor="mainName">Project/Business/Topic Name *</label>
                  <input
                    id="mainName"
                    className="blogcreator-input"
                    type="text"
                    value={blogData.mainName}
                    onChange={e => handleInputChange('mainName', e.target.value)}
                    placeholder="Project/Business/Topic Name"
                    required
                  />
                  <label className="blogcreator-label" htmlFor="type">Type or Category (e.g., business, event, product)</label>
                  <input
                    id="type"
                    className="blogcreator-input"
                    type="text"
                    value={blogData.type}
                    onChange={e => handleInputChange('type', e.target.value)}
                    placeholder="e.g., Business, Event, Product"
                  />
                  <label className="blogcreator-label" htmlFor="industry">Industry or Field (e.g., technology, education)</label>
                  <input
                    id="industry"
                    className="blogcreator-input"
                    type="text"
                    value={blogData.industry}
                    onChange={e => handleInputChange('industry', e.target.value)}
                    placeholder="e.g., Technology, Education, Food, Art"
                  />
                  <label className="blogcreator-label" htmlFor="location">{t('location')}</label>
                  <input
                    id="location"
                    className="blogcreator-input"
                    type="text"
                    value={blogData.location}
                    onChange={e => handleInputChange('location', e.target.value)}
                    placeholder={t('e.g.,DowntownSeattleWestVillageEtc')}
                  />
                </fieldset>

                {/* Content Preferences */}
                <fieldset className="blogcreator-fieldset">
                  <legend className="blogcreator-legend">{t('contentPreferences')}</legend>
                  <div className="blogcreator-choice-group">
                    <span className="blogcreator-label">{t('targetAudience')}</span>
                    <div className="blogcreator-choice-row">
                      {targetAudiences.map(audience => (
                        <button
                          key={audience.value}
                          type="button"
                          className={`blogcreator-choice-btn${blogData.targetAudience === audience.value ? ' selected' : ''}`}
                          onClick={() => handleInputChange('targetAudience', audience.value)}
                          aria-pressed={blogData.targetAudience === audience.value}
                        >
                          <span className="blogcreator-choice-icon">{audience.icon}</span>
                          <span>{audience.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="blogcreator-choice-group">
                    <span className="blogcreator-label">{t('writingTone')}</span>
                    <div className="blogcreator-choice-row">
                      {tones.map(tone => (
                        <button
                          key={tone.value}
                          type="button"
                          className={`blogcreator-choice-btn${blogData.tone === tone.value ? ' selected' : ''}`}
                          onClick={() => handleInputChange('tone', tone.value)}
                          aria-pressed={blogData.tone === tone.value}
                        >
                          <span className="blogcreator-choice-icon">{tone.icon}</span>
                          <span>{tone.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="blogcreator-choice-group">
                    <span className="blogcreator-label">{t('blogLength')}</span>
                    <div className="blogcreator-choice-row">
                      {lengths.map(length => (
                        <button
                          key={length.value}
                          type="button"
                          className={`blogcreator-choice-btn${blogData.length === length.value ? ' selected' : ''}`}
                          onClick={() => handleInputChange('length', length.value)}
                          aria-pressed={blogData.length === length.value}
                        >
                          <span className="blogcreator-choice-icon">{length.icon}</span>
                          <span>{length.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </fieldset>

                {/* Additional Details */}
                <fieldset className="blogcreator-fieldset">
                  <legend className="blogcreator-legend">{t('additionalDetails')}</legend>
                  <label className="blogcreator-label" htmlFor="keyPoints">{t('keyPointsToInclude')}</label>
                  <textarea
                    id="keyPoints"
                    className="blogcreator-input"
                    value={blogData.keyPoints}
                    onChange={e => handleInputChange('keyPoints', e.target.value)}
                    placeholder={t('listSpecificPointsEventsOrFeaturesYouWantHighlightedInTheBlogPost')}
                    rows={3}
                  />
                  <label className="blogcreator-label" htmlFor="specialFeatures">{t('specialFeaturesOrHighlights')}</label>
                  <textarea
                    id="specialFeatures"
                    className="blogcreator-input"
                    value={blogData.specialFeatures}
                    onChange={e => handleInputChange('specialFeatures', e.target.value)}
                    placeholder={t('mentionAnySpecialFeaturesAwardsUniqueAspectsOrRecentNewsAboutYourRestaurant')}
                    rows={3}
                  />
                </fieldset>

                <div className="blogcreator-form-actions">
                  <button
                    type="submit"
                    className="blogcreator-submit-btn"
                    disabled={isGenerating || !blogData.topic.trim() || !blogData.mainName.trim()}
                  >
                    {isGenerating ? (
                      <span className="blogcreator-spinner"></span>
                    ) : (
                      <span className="blogcreator-submit-label">🚀 {t('generateBlogPost')}</span>
                    )}
                  </button>
                </div>
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
                    {renderHierarchicalContent(generatedBlog)}
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
        {/* Error Display (keep outside grid for now) */}
        {error && (
          <div className="blog-creator-error-message">
            <span className="blog-creator-error-icon">⚠️</span> {error}
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogCreator; 