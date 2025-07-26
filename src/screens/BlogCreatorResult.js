import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiConfig from '../config/api';
import './BlogCreator.css';

const BlogCreatorResult = ({ 
  blogData, 
  images, 
  generatedBlog, 
  imageAnalysis, 
  onBackToGuidance,
  onRegenerate 
}) => {
  const { t } = useTranslation();

  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editedBlog, setEditedBlog] = useState('');
  const [syncSuccess, setSyncSuccess] = useState(false);

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
    
    // Enhanced paragraph structure and spacing
    cleanedContent = cleanedContent
      // Normalize paragraph breaks for better blog formatting
      .replace(/\n{3,}/g, '\n\n') // Multiple line breaks to double line breaks
      .replace(/\n{2,}/g, '\n\n') // Ensure consistent double line breaks between paragraphs
      .replace(/ {2,}/g, ' ') // Remove multiple spaces
      .replace(/\t/g, ' ') // Replace tabs with spaces
      // Ensure proper spacing around headings
      .replace(/([^\n])\n(#+\s)/g, '$1\n\n$2') // Add space before headings
      .replace(/(#+\s[^\n]+)\n([^\n])/g, '$1\n\n$2') // Add space after headings
      // Clean up paragraph structure for better readability
      .replace(/([.!?])\n([A-Z])/g, '$1\n\n$2') // Add paragraph breaks after sentences that end with punctuation
      .replace(/([.!?])\s*\n\s*([A-Z])/g, '$1\n\n$2'); // Clean up spacing around paragraph breaks
    
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

  // Function to render hierarchical content with proper styling and paragraph structure
  const renderHierarchicalContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n');
    const elements = [];
    let currentParagraph = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // H1 - Main title (usually not used in blog content, but handle it)
      if (trimmedLine.startsWith('# ') && !trimmedLine.startsWith('##')) {
        // Flush current paragraph if exists
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="blog-post-paragraph">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        
        elements.push(
          <div key={index} className="blog-h1">
            {trimmedLine.substring(2)}
          </div>
        );
        return;
      }
      
      // H2 - Major sections
      if (trimmedLine.startsWith('## ')) {
        // Flush current paragraph if exists
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="blog-post-paragraph">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        
        elements.push(
          <div key={index} className="blog-h2">
            {trimmedLine.substring(3)}
          </div>
        );
        return;
      }
      
      // H3 - Subsections
      if (trimmedLine.startsWith('### ')) {
        // Flush current paragraph if exists
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="blog-post-paragraph">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        
        elements.push(
          <div key={index} className="blog-h3">
            {trimmedLine.substring(4)}
          </div>
        );
        return;
      }
      
      // H4 - Detailed points
      if (trimmedLine.startsWith('#### ')) {
        // Flush current paragraph if exists
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="blog-post-paragraph">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        
        elements.push(
          <div key={index} className="blog-h4">
            {trimmedLine.substring(5)}
          </div>
        );
        return;
      }
      
      // Bullet points
      if (trimmedLine.startsWith('• ')) {
        // Flush current paragraph if exists
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="blog-post-paragraph">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        
        elements.push(
          <div key={index} className="blog-post-list-item">
            <span className="list-bullet">•</span>
            <span className="list-text">
              {trimmedLine.substring(2)}
            </span>
          </div>
        );
        return;
      }
      
      // Numbered lists
      if (/^\d+\.\s/.test(trimmedLine)) {
        // Flush current paragraph if exists
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="blog-post-paragraph">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        
        elements.push(
          <div key={index} className="blog-post-list-item">
            <span className="list-number">
              {trimmedLine.match(/^\d+/)[0]}.
            </span>
            <span className="list-text">
              {trimmedLine.replace(/^\d+\.\s/, '')}
            </span>
          </div>
        );
        return;
      }
      
      // Empty line - paragraph break
      if (trimmedLine === '') {
        if (currentParagraph.length > 0) {
          elements.push(
            <p key={`p-${index}`} className="blog-post-paragraph">
              {currentParagraph.join(' ')}
            </p>
          );
          currentParagraph = [];
        }
        return;
      }
      
      // Regular content - add to current paragraph
      if (trimmedLine) {
        // Handle bold text and highlighting within paragraphs
        if (trimmedLine.includes('**')) {
          const parts = trimmedLine.split('**');
          const formattedParts = parts.map((part, partIndex) => (
            partIndex % 2 === 1 ? (
              <strong key={partIndex} className="highlighted-text">
                {part}
              </strong>
            ) : (
              <span key={partIndex}>{part}</span>
            )
          ));
          currentParagraph.push(...formattedParts);
        } else if (trimmedLine.includes('✨') || trimmedLine.includes('💡') || trimmedLine.includes('🎯') || 
                   trimmedLine.includes('⭐') || trimmedLine.includes('🔥') || trimmedLine.includes('💎')) {
          // Highlight important sentences
          currentParagraph.push(
            <span key={index} className="highlighted-text">
              {trimmedLine}
            </span>
          );
        } else {
          currentParagraph.push(trimmedLine);
        }
      }
    });
    
    // Flush any remaining paragraph content
    if (currentParagraph.length > 0) {
      elements.push(
        <p key="final-paragraph" className="blog-post-paragraph">
          {currentParagraph.join(' ')}
        </p>
      );
    }
    
    return elements;
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

  const getWordCount = () => {
    if (!generatedBlog) return 0;
    return generatedBlog.split(/\s+/).length;
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

  const handleSaveEdit = async () => {
    try {
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
      console.error('Failed to save edited blog:', err);
    }
  };

  return (
    <div className="blogcreator-result-root">
      <header className="blogcreator-header">
        <div className="blogcreator-header-content">
          <span className="blogcreator-header-icon">✨</span>
          <div className="blogcreator-header-text">
            <h1 className="blogcreator-header-title">Your Generated Blog Post</h1>
            <p className="blogcreator-header-desc">Review, edit, and save your blog content</p>
          </div>
        </div>
        
        <div className="blogcreator-header-actions">
          <button
            onClick={onBackToGuidance}
            className="blogcreator-back-btn"
          >
            ← Back to Form
          </button>
          <button
            onClick={onRegenerate}
            className="blogcreator-regenerate-btn"
          >
            🔄 Regenerate
          </button>
        </div>
      </header>

      <main className="blogcreator-main">
        <div className="blogcreator-main-grid">
          {/* Left: Blog Content */}
          <section className="blogcreator-content-panel">
            <div className="blogcreator-content-card">
              <header className="blogcreator-content-header">
                <span className="blogcreator-content-icon">📝</span>
                <h2 className="blogcreator-content-title">Blog Content</h2>
                <div className="blogcreator-content-actions">
                  <button
                    onClick={copyToClipboard}
                    className="blogcreator-action-btn"
                    title="Copy to clipboard"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={() => {
                      if (isEditing) {
                        setEditedBlog(generatedBlog);
                      }
                      setIsEditing(!isEditing);
                    }}
                    className="blogcreator-action-btn"
                    title={isEditing ? "Cancel editing" : "Edit content"}
                  >
                    {isEditing ? '❌ Cancel' : '✏️ Edit'}
                  </button>
                  {isEditing && (
                    <button
                      onClick={handleSaveEdit}
                      className="blogcreator-action-btn blogcreator-save-btn"
                      title="Save changes"
                    >
                      💾 Save
                    </button>
                  )}
                </div>
              </header>
              
              <div className="blogcreator-content-scroll">
                <div className="blogcreator-content">
                  {isEditing ? (
                    <>
                      <textarea
                        className="blogcreator-edit-textarea"
                        value={editedBlog}
                        onChange={e => setEditedBlog(e.target.value)}
                        rows={20}
                        placeholder="Edit your blog content here..."
                      />
                    </>
                  ) : (
                    renderBlogWithImages()
                  )}
                </div>
              </div>
              
              <footer className="blogcreator-content-info">
                <span className="blogcreator-content-info-item">
                  <span className="blogcreator-content-info-icon">📊</span> {t('wordCount')}: {getWordCount()} {t('words')}
                </span>
                <span className="blogcreator-content-info-item">
                  <span className="blogcreator-content-info-icon">📸</span> {t('images')}: {images.length}
                </span>
                <span className="blogcreator-content-info-item">
                  <span className="blogcreator-content-info-icon">🤖</span> {t('model')}: NVIDIA Llama 3.3 Nemotron Super 49B
                </span>
                <span className="blogcreator-content-info-item">
                  <span className="blogcreator-content-info-icon">📅</span> {t('generated')}: {new Date().toLocaleString()}
                </span>
              </footer>
            </div>
          </section>

          {/* Right: Blog Details & Analysis */}
          <section className="blogcreator-details-panel">
            {/* Blog Details */}
            <div className="blogcreator-details-card">
              <header className="blogcreator-details-header">
                <span className="blogcreator-details-icon">📋</span>
                <h3 className="blogcreator-details-title">Blog Details</h3>
              </header>
              
              <div className="blogcreator-details-content">
                <div className="blogcreator-details-grid">
                  <div className="blogcreator-details-item">
                    <strong>Topic:</strong> {blogData.topic || 'Not specified'}
                  </div>
                  <div className="blogcreator-details-item">
                    <strong>Business/Project:</strong> {blogData.mainName || 'Not specified'}
                  </div>
                  <div className="blogcreator-details-item">
                    <strong>Type:</strong> {blogData.type || 'Not specified'}
                  </div>
                  <div className="blogcreator-details-item">
                    <strong>Industry:</strong> {blogData.industry || 'Not specified'}
                  </div>
                  <div className="blogcreator-details-item">
                    <strong>Location:</strong> {blogData.location || 'Not specified'}
                  </div>
                  <div className="blogcreator-details-item">
                    <strong>Target Audience:</strong> {blogData.targetAudience || 'Not specified'}
                  </div>
                  <div className="blogcreator-details-item">
                    <strong>Tone:</strong> {blogData.tone || 'Not specified'}
                  </div>
                  <div className="blogcreator-details-item">
                    <strong>Length:</strong> {blogData.length || 'Not specified'}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Analysis */}
            {imageAnalysis && (
              <div className="blogcreator-analysis-card">
                <header className="blogcreator-analysis-header">
                  <span className="blogcreator-analysis-icon">📸</span>
                  <h3 className="blogcreator-analysis-title">{t('imageIntegrationAnalysis')}</h3>
                </header>
                
                <div className="blogcreator-analysis-content">
                  <div className="blogcreator-analysis-grid">
                    {imageAnalysis.imageDetails.map((img, index) => (
                      <div key={index} className="blogcreator-analysis-item">
                        <div className="blogcreator-analysis-name">{img.name}</div>
                        <div className="blogcreator-analysis-placement">📍 {t('placement')}: {img.suggestedPlacement}</div>
                        <div className="blogcreator-analysis-caption">💬 {t('caption')}: {img.suggestedCaption}</div>
                      </div>
                    ))}
                  </div>
                  
                  {imageAnalysis.integrationSuggestions.length > 0 && (
                    <div className="blogcreator-integration-suggestions">
                      <div className="blogcreator-integration-suggestions-title">
                        <span className="blogcreator-analysis-icon">💡</span> {t('integrationSuggestions')}:
                      </div>
                      <ul className="blogcreator-integration-suggestions-list">
                        {imageAnalysis.integrationSuggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Key Points & Features */}
            <div className="blogcreator-features-card">
              <header className="blogcreator-features-header">
                <span className="blogcreator-features-icon">🎯</span>
                <h3 className="blogcreator-features-title">Key Points & Features</h3>
              </header>
              
              <div className="blogcreator-features-content">
                <div className="blogcreator-features-section">
                  <h4>Key Points:</h4>
                  <div className="blogcreator-features-text">
                    {blogData.keyPoints ? blogData.keyPoints.split('\n').map((point, index) => (
                      <div key={index} className="blogcreator-feature-point">
                        {point.trim()}
                      </div>
                    )) : 'No key points specified'}
                  </div>
                </div>
                
                <div className="blogcreator-features-section">
                  <h4>Special Features:</h4>
                  <div className="blogcreator-features-text">
                    {blogData.specialFeatures ? blogData.specialFeatures.split('\n').map((feature, index) => (
                      <div key={index} className="blogcreator-feature-point">
                        {feature.trim()}
                      </div>
                    )) : 'No special features specified'}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Success Messages */}
        {syncSuccess && (
          <div className="blog-creator-success-message">
            <span className="blog-creator-success-icon">✅</span> Blog post updated and synchronized!
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogCreatorResult; 