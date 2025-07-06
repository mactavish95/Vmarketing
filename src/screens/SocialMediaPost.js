import React, { useState, useEffect } from 'react';
import apiConfig from '../config/api';
import './SocialMediaPost.css';

const SocialMediaPost = () => {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [tone, setTone] = useState('engaging');
  const [targetAudience, setTargetAudience] = useState('general');
  const [hashtags, setHashtags] = useState('');
  const [enhancedContent, setEnhancedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState('');
  const [qualityAnalysis, setQualityAnalysis] = useState(null);
  const [generationHistory, setGenerationHistory] = useState([]);

  const platforms = [
    { value: 'instagram', label: 'Instagram', icon: '📸', maxLength: 2200 },
    { value: 'facebook', label: 'Facebook', icon: '📘', maxLength: 63206 },
    { value: 'twitter', label: 'Twitter/X', icon: '🐦', maxLength: 280 },
    { value: 'linkedin', label: 'LinkedIn', icon: '💼', maxLength: 3000 },
    { value: 'tiktok', label: 'TikTok', icon: '🎵', maxLength: 150 },
    { value: 'youtube', label: 'YouTube', icon: '📺', maxLength: 5000 }
  ];

  const tones = [
    { value: 'engaging', label: 'Engaging', icon: '🎯' },
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'casual', label: 'Casual', icon: '😊' },
    { value: 'humorous', label: 'Humorous', icon: '😂' },
    { value: 'inspirational', label: 'Inspirational', icon: '✨' },
    { value: 'educational', label: 'Educational', icon: '📚' }
  ];

  const audiences = [
    { value: 'general', label: 'General', icon: '👥' },
    { value: 'business', label: 'Business', icon: '🏢' },
    { value: 'youth', label: 'Youth', icon: '👨‍🎓' },
    { value: 'parents', label: 'Parents', icon: '👨‍👩‍👧‍👦' },
    { value: 'professionals', label: 'Professionals', icon: '👔' },
    { value: 'creatives', label: 'Creatives', icon: '🎨' }
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
      const selectedTone = tones.find(t => t.value === tone);
      const selectedAudience = audiences.find(a => a.value === targetAudience);

      const prompt = `Enhance this social media content for ${selectedPlatform.label} with a ${selectedTone.label} tone targeting ${selectedAudience.label} audience.

Original content: "${content}"

Requirements:
- Platform: ${selectedPlatform.label} (max ${selectedPlatform.maxLength} characters)
- Tone: ${selectedTone.label}
- Target Audience: ${selectedAudience.label}
- Include relevant hashtags if appropriate
- Optimize for engagement and readability
- Maintain the core message while improving structure and appeal

Please provide an enhanced version that's more engaging, well-structured, and optimized for the specified platform and audience.`;

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
          tone,
          targetAudience,
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
          contentType: 'social_media',
          context: { platform, tone, targetAudience }
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
          <div className="header-content">
            <div className="header-icon">📱</div>
            <div className="header-text">
              <h1>Social Media Post Creator</h1>
              <p>Create engaging social media content with AI-powered enhancement and quality analysis</p>
            </div>
          </div>
        </div>

        <div className="post-content">
          {/* Platform and Settings Selection */}
          <div className="settings-section">
            <h2>🎯 Platform & Settings</h2>
            
            <div className="settings-grid">
              <div className="setting-group">
                <label>📱 Platform</label>
                <div className="platform-options">
                  {platforms.map(platformOption => (
                    <button
                      key={platformOption.value}
                      className={`platform-option ${platform === platformOption.value ? 'active' : ''}`}
                      onClick={() => setPlatform(platformOption.value)}
                    >
                      <span className="platform-icon">{platformOption.icon}</span>
                      <span className="platform-label">{platformOption.label}</span>
                      <span className="platform-limit">({platformOption.maxLength} chars)</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-group">
                <label>🎭 Tone</label>
                <div className="tone-options">
                  {tones.map(toneOption => (
                    <button
                      key={toneOption.value}
                      className={`tone-option ${tone === toneOption.value ? 'active' : ''}`}
                      onClick={() => setTone(toneOption.value)}
                    >
                      <span className="tone-icon">{toneOption.icon}</span>
                      <span className="tone-label">{toneOption.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="setting-group">
                <label>👥 Target Audience</label>
                <div className="audience-options">
                  {audiences.map(audienceOption => (
                    <button
                      key={audienceOption.value}
                      className={`audience-option ${targetAudience === audienceOption.value ? 'active' : ''}`}
                      onClick={() => setTargetAudience(audienceOption.value)}
                    >
                      <span className="audience-icon">{audienceOption.icon}</span>
                      <span className="audience-label">{audienceOption.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content Input */}
          <div className="content-section">
            <h2>✍️ Your Content</h2>
            <div className="content-input-group">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your social media content here... The AI will enhance it for better engagement and structure."
                rows={6}
                className="content-textarea"
              />
              <div className="content-actions">
                <button
                  onClick={generateContent}
                  disabled={isGenerating || !content.trim()}
                  className="generate-btn"
                >
                  {isGenerating ? '🤖 Enhancing...' : '🚀 Enhance with AI'}
                </button>
                <button onClick={clearAll} className="clear-btn">
                  🗑️ Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Enhanced Content Display */}
          {enhancedContent && (
            <div className="enhanced-section">
              <div className="enhanced-header">
                <h2>✨ Enhanced Content</h2>
                <div className="enhanced-meta">
                  <span className="platform-badge">
                    {getPlatformIcon(platform)} {selectedPlatform.label}
                  </span>
                  <span className="tone-badge">
                    {getToneIcon(tone)} {tones.find(t => t.value === tone)?.label}
                  </span>
                  <span className="audience-badge">
                    {getAudienceIcon(targetAudience)} {audiences.find(a => a.value === targetAudience)?.label}
                  </span>
                  <span className={`character-count ${isOverLimit ? 'over-limit' : ''}`}>
                    {characterCount}/{selectedPlatform.maxLength} chars
                  </span>
                </div>
              </div>

              <div className="enhanced-content">
                <pre className="content-display">{enhancedContent}</pre>
                <div className="content-actions">
                  <button onClick={() => copyToClipboard(enhancedContent)} className="copy-btn">
                    📋 Copy Content
                  </button>
                  <button onClick={() => setContent(enhancedContent)} className="use-btn">
                    ✏️ Use as New Content
                  </button>
                </div>
              </div>

              {/* Quality Analysis */}
              {qualityAnalysis && (
                <div className="quality-section">
                  <h3>📊 Quality Analysis</h3>
                  <div className="quality-overview">
                    <div className="quality-score">
                      <span className="score-label">Overall Quality:</span>
                      <span 
                        className="score-value"
                        style={{ color: getQualityColor(qualityAnalysis.overallScore) }}
                      >
                        {getQualityLabel(qualityAnalysis.overallScore)} ({qualityAnalysis.overallScore.toFixed(2)})
                      </span>
                    </div>
                  </div>

                  <div className="quality-metrics">
                    <div className="metrics-grid">
                      {Object.entries(qualityAnalysis.metrics).map(([metric, score]) => (
                        <div key={metric} className="metric-item">
                          <span className="metric-label">{metric.charAt(0).toUpperCase() + metric.slice(1)}:</span>
                          <span 
                            className="metric-score"
                            style={{ color: getQualityColor(score) }}
                          >
                            {(score * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {qualityAnalysis.strengths.length > 0 && (
                    <div className="strengths-section">
                      <h4>✅ Strengths</h4>
                      <ul>
                        {qualityAnalysis.strengths.map((strength, index) => (
                          <li key={index}>{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {qualityAnalysis.suggestions.length > 0 && (
                    <div className="suggestions-section">
                      <h4>💡 Suggestions</h4>
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
            <div className="history-section">
              <h2>📚 Recent Generations</h2>
              <div className="history-list">
                {generationHistory.map((item) => (
                  <div key={item.id} className="history-item">
                    <div className="history-meta">
                      <span className="history-platform">{getPlatformIcon(item.platform)} {platforms.find(p => p.value === item.platform)?.label}</span>
                      <span className="history-tone">{getToneIcon(item.tone)} {tones.find(t => t.value === item.tone)?.label}</span>
                      <span className="history-time">{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="history-content">
                      <div className="history-original">
                        <strong>Original:</strong> {item.original.substring(0, 100)}...
                      </div>
                      <div className="history-enhanced">
                        <strong>Enhanced:</strong> {item.enhanced.substring(0, 100)}...
                      </div>
                    </div>
                    <div className="history-actions">
                      <button onClick={() => copyToClipboard(item.enhanced)} className="history-copy-btn">
                        📋 Copy
                      </button>
                      <button onClick={() => setContent(item.enhanced)} className="history-use-btn">
                        ✏️ Use
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPost; 