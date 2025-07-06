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

      const prompt = `Create a well-structured, precise, and thoughtful Facebook post based on the following requirements:

ORIGINAL CONTENT: "${content}"

POST SPECIFICATIONS:
- Platform: Facebook (max ${selectedPlatform.maxLength} characters)
- Post Type: ${selectedPostType.label} - ${selectedPostType.description}
- Tone: ${selectedTone.label} - ${selectedTone.description}
- Target Audience: ${selectedAudience.label} - ${selectedAudience.description}
- Content Structure: ${selectedStructure.label} - ${selectedStructure.description}
- Engagement Goal: ${selectedGoal.label} - ${selectedGoal.description}

FACEBOOK OPTIMIZATION REQUIREMENTS:
1. STRUCTURE: Use the ${selectedStructure.label} format with clear sections
2. OPENING: Start with a compelling hook that grabs attention in the first 2-3 lines
3. BODY: Develop the main content with logical flow and easy-to-read paragraphs
4. ENGAGEMENT: Include a call-to-action that encourages ${selectedGoal.label.toLowerCase()}
5. HASHTAGS: Add 3-5 relevant hashtags at the end (if appropriate for the post type)
6. LENGTH: Optimize for Facebook's algorithm (aim for 40-80 words for best engagement)
7. READABILITY: Use short paragraphs, bullet points, or numbered lists when appropriate
8. PERSONALITY: Match the ${selectedTone.label} tone throughout
9. AUDIENCE: Tailor language and examples for ${selectedAudience.label} audience

Please create a Facebook post that is:
- Well-structured with clear beginning, middle, and end
- Precise in its messaging and purpose
- Thoughtful in its approach to the audience
- Optimized for Facebook engagement
- Professional yet authentic in tone

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
            engagementGoal 
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
    setHashtags('');
    setError('');
    setQualityAnalysis(null);
  };

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