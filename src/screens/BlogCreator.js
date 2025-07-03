import React, { useState, useEffect } from 'react';
import ModelInfo from '../components/ModelInfo';

const BlogCreator = () => {
  const [blogData, setBlogData] = useState({
    topic: '',
    restaurantName: '',
    restaurantType: 'restaurant',
    cuisine: '',
    location: '',
    targetAudience: 'customers',
    tone: 'professional',
    length: 'medium',
    keyPoints: '',
    specialFeatures: ''
  });
  const [generatedBlog, setGeneratedBlog] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [modelInfo, setModelInfo] = useState(null);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('nvidiaApiKey') || '';
  });

  // Load model information on component mount
  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    try {
      const res = await fetch('/api/models');
      const data = await res.json();
      if (data.success) {
        const blogModel = data.models.find(m => m.useCase === 'review_generation');
        setModelInfo(blogModel);
      }
    } catch (error) {
      console.warn('Failed to fetch model info:', error);
    }
  };

  const restaurantTypes = [
    { value: 'restaurant', label: 'Restaurant', icon: '🍽️', color: '#ff6b6b' },
    { value: 'cafe', label: 'Café', icon: '☕', color: '#8b4513' },
    { value: 'pizzeria', label: 'Pizzeria', icon: '🍕', color: '#ff8c00' },
    { value: 'bakery', label: 'Bakery', icon: '🥐', color: '#daa520' },
    { value: 'bar', label: 'Bar/Pub', icon: '🍺', color: '#ffd700' },
    { value: 'food-truck', label: 'Food Truck', icon: '🚚', color: '#ff6347' },
    { value: 'fine-dining', label: 'Fine Dining', icon: '🍷', color: '#800020' },
    { value: 'fast-casual', label: 'Fast Casual', icon: '🥪', color: '#32cd32' }
  ];

  const targetAudiences = [
    { value: 'customers', label: 'General Customers', icon: '👥', color: '#667eea' },
    { value: 'foodies', label: 'Food Enthusiasts', icon: '🍴', color: '#ff6b6b' },
    { value: 'families', label: 'Families', icon: '👨‍👩‍👧‍👦', color: '#20c997' },
    { value: 'business', label: 'Business Professionals', icon: '💼', color: '#4b7bec' },
    { value: 'tourists', label: 'Tourists/Visitors', icon: '🗺️', color: '#f7b731' },
    { value: 'locals', label: 'Local Community', icon: '🏘️', color: '#a55eea' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional', icon: '👔', color: '#667eea' },
    { value: 'casual', label: 'Casual & Friendly', icon: '😊', color: '#ffa726' },
    { value: 'enthusiastic', label: 'Enthusiastic', icon: '🎉', color: '#ff7043' },
    { value: 'elegant', label: 'Elegant & Sophisticated', icon: '✨', color: '#9c27b0' },
    { value: 'rustic', label: 'Rustic & Cozy', icon: '🏡', color: '#8d6e63' },
    { value: 'modern', label: 'Modern & Trendy', icon: '🚀', color: '#00bcd4' }
  ];

  const lengths = [
    { value: 'short', label: 'Short (300-500 words)', icon: '📝', color: '#4caf50' },
    { value: 'medium', label: 'Medium (600-800 words)', icon: '📄', color: '#ff9800' },
    { value: 'long', label: 'Long (900-1200 words)', icon: '📚', color: '#f44336' }
  ];

  const handleInputChange = (field, value) => {
    setBlogData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApiKeyChange = (newApiKey) => {
    setApiKey(newApiKey);
    if (newApiKey.trim()) {
      localStorage.setItem('nvidiaApiKey', newApiKey);
    } else {
      localStorage.removeItem('nvidiaApiKey');
    }
  };

  const generateBlogPost = async () => {
    // Validate input
    if (!blogData.topic.trim()) {
      setError('Please enter a blog topic');
      return;
    }

    if (!blogData.restaurantName.trim()) {
      setError('Please enter your restaurant name');
      return;
    }

    if (!apiKey.trim()) {
      setError('Please enter your NVIDIA API key');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedBlog('');

    try {
      const res = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blogData,
          apiKey
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedBlog(data.blogPost);
        
        // Save to localStorage for history
        const blogHistory = JSON.parse(localStorage.getItem('blogHistory') || '[]');
        const newBlog = {
          id: Date.now(),
          ...blogData,
          blogPost: data.blogPost,
          timestamp: new Date().toISOString()
        };
        blogHistory.unshift(newBlog);
        localStorage.setItem('blogHistory', JSON.stringify(blogHistory.slice(0, 20))); // Keep last 20
      } else {
        setError(data.error || 'Failed to generate blog post');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedBlog);
    alert('Blog post copied to clipboard!');
  };

  const resetForm = () => {
    setBlogData({
      topic: '',
      restaurantName: '',
      restaurantType: 'restaurant',
      cuisine: '',
      location: '',
      targetAudience: 'customers',
      tone: 'professional',
      length: 'medium',
      keyPoints: '',
      specialFeatures: ''
    });
    setGeneratedBlog('');
    setError('');
  };

  const getWordCount = () => {
    if (!generatedBlog) return 0;
    return generatedBlog.split(/\s+/).length;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4f8cff 0%, #38e8ff 100%)',
          padding: '40px 32px',
          textAlign: 'center'
        }}>
          <span style={{ 
            fontSize: '64px', 
            marginBottom: '16px', 
            display: 'block',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}>📝</span>
          <h1 style={{ 
            margin: '0 0 12px 0', 
            fontWeight: '800', 
            fontSize: '36px', 
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Restaurant Blog Creator
          </h1>
          <p style={{ 
            margin: '0', 
            fontSize: '18px', 
            color: '#fff',
            opacity: '0.95'
          }}>
            Generate engaging blog content for your restaurant business with AI
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '40px 32px' }}>
          {/* Model Information */}
          <ModelInfo 
            useCase="review_generation" 
            style={{ marginBottom: '24px' }}
          />

          {!generatedBlog ? (
            <div>
              {/* API Key Section */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '24px',
                border: '1px solid #bae6fd'
              }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: '#0c4a6e',
                  fontSize: '16px'
                }}>
                  🔑 NVIDIA API Key:
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="Enter your NVIDIA API key"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    marginBottom: '8px'
                  }}
                />
                <small style={{ color: '#0369a1', fontSize: '14px' }}>
                  Get your API key from{' '}
                  <a 
                    href="https://integrate.api.nvidia.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#0ea5e9', textDecoration: 'none' }}
                  >
                    NVIDIA API Portal
                  </a>
                </small>
              </div>

              {/* Blog Configuration Form */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
              }}>
                {/* Basic Information */}
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e9ecef'
                }}>
                  <h3 style={{
                    margin: '0 0 20px 0',
                    color: '#2d3748',
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    📋 Basic Information
                  </h3>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Blog Topic *
                    </label>
                    <input
                      type="text"
                      value={blogData.topic}
                      onChange={(e) => handleInputChange('topic', e.target.value)}
                      placeholder="e.g., Our New Seasonal Menu, Behind the Scenes, Local Ingredients"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Restaurant Name *
                    </label>
                    <input
                      type="text"
                      value={blogData.restaurantName}
                      onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                      placeholder="Your restaurant name"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Restaurant Type
                    </label>
                    <select
                      value={blogData.restaurantType}
                      onChange={(e) => handleInputChange('restaurantType', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    >
                      {restaurantTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Cuisine Type
                    </label>
                    <input
                      type="text"
                      value={blogData.cuisine}
                      onChange={(e) => handleInputChange('cuisine', e.target.value)}
                      placeholder="e.g., Italian, Mexican, Fusion, American"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Location
                    </label>
                    <input
                      type="text"
                      value={blogData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Downtown Seattle, West Village, etc."
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #e1e5e9',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                    />
                  </div>
                </div>

                {/* Content Preferences */}
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e9ecef'
                }}>
                  <h3 style={{
                    margin: '0 0 20px 0',
                    color: '#2d3748',
                    fontSize: '20px',
                    fontWeight: '700'
                  }}>
                    🎯 Content Preferences
                  </h3>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '12px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Target Audience
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '8px'
                    }}>
                      {targetAudiences.map(audience => (
                        <button
                          key={audience.value}
                          type="button"
                          onClick={() => handleInputChange('targetAudience', audience.value)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: `2px solid ${blogData.targetAudience === audience.value ? audience.color : '#e1e5e9'}`,
                            background: blogData.targetAudience === audience.value ? `${audience.color}15` : '#fff',
                            color: blogData.targetAudience === audience.value ? audience.color : '#495057',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {audience.icon} {audience.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '12px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Writing Tone
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '8px'
                    }}>
                      {tones.map(tone => (
                        <button
                          key={tone.value}
                          type="button"
                          onClick={() => handleInputChange('tone', tone.value)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: `2px solid ${blogData.tone === tone.value ? tone.color : '#e1e5e9'}`,
                            background: blogData.tone === tone.value ? `${tone.color}15` : '#fff',
                            color: blogData.tone === tone.value ? tone.color : '#495057',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {tone.icon} {tone.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '12px',
                      fontWeight: '600',
                      color: '#495057'
                    }}>
                      Blog Length
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      gap: '8px'
                    }}>
                      {lengths.map(length => (
                        <button
                          key={length.value}
                          type="button"
                          onClick={() => handleInputChange('length', length.value)}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: `2px solid ${blogData.length === length.value ? length.color : '#e1e5e9'}`,
                            background: blogData.length === length.value ? `${length.color}15` : '#fff',
                            color: blogData.length === length.value ? length.color : '#495057',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.3s ease',
                            textAlign: 'left'
                          }}
                        >
                          {length.icon} {length.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div style={{
                background: '#f8f9fa',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
                border: '1px solid #e9ecef'
              }}>
                <h3 style={{
                  margin: '0 0 20px 0',
                  color: '#2d3748',
                  fontSize: '20px',
                  fontWeight: '700'
                }}>
                  📝 Additional Details
                </h3>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Key Points to Include
                  </label>
                  <textarea
                    value={blogData.keyPoints}
                    onChange={(e) => handleInputChange('keyPoints', e.target.value)}
                    placeholder="List specific points, events, or features you want highlighted in the blog post..."
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Special Features or Highlights
                  </label>
                  <textarea
                    value={blogData.specialFeatures}
                    onChange={(e) => handleInputChange('specialFeatures', e.target.value)}
                    placeholder="Mention any special features, awards, unique aspects, or recent news about your restaurant..."
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>

              {/* Generate Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={generateBlogPost}
                  disabled={isGenerating || !blogData.topic.trim() || !blogData.restaurantName.trim() || !apiKey.trim()}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 32px',
                    fontWeight: '700',
                    fontSize: '18px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease',
                    opacity: isGenerating || !blogData.topic.trim() || !blogData.restaurantName.trim() || !apiKey.trim() ? 0.6 : 1
                  }}
                >
                  {isGenerating ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTop: '2px solid #fff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Generating Blog Post...
                    </div>
                  ) : (
                    '🚀 Generate Blog Post'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Generated Blog Post */}
              <div style={{
                background: '#f8f9fa',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px'
                }}>
                  <h3 style={{
                    margin: 0,
                    color: '#2d3748',
                    fontSize: '24px',
                    fontWeight: '700'
                  }}>
                    ✨ Your Generated Blog Post
                  </h3>
                  <div style={{
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <button
                      onClick={copyToClipboard}
                      style={{
                        background: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={resetForm}
                      style={{
                        background: '#6c757d',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      🔄 New Post
                    </button>
                  </div>
                </div>

                <div style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e9ecef',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    color: '#2d3748',
                    fontSize: '16px',
                    lineHeight: '1.7',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {generatedBlog}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px',
                  background: '#e9ecef',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#6c757d'
                }}>
                  <span>📊 Word Count: {getWordCount()} words</span>
                  <span>📅 Generated: {new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
              border: '1px solid #fc8181',
              borderRadius: '12px',
              padding: '16px',
              color: '#c53030',
              fontWeight: '600',
              textAlign: 'center',
              marginTop: '24px'
            }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BlogCreator; 