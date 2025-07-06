import React, { useState, useEffect } from 'react';
import apiConfig from '../config/api';

export default function CustomerServiceResponse() {
  const [review, setReview] = useState('');
  const [sentiment, setSentiment] = useState('negative');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modelInfo, setModelInfo] = useState(null);
  const [staffName, setStaffName] = useState('');

  // Load model information on component mount
  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    try {
      // Force production URL if we're on Netlify
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;
      
      const res = await fetch(`${baseURL}/models`);
      const data = await res.json();
      if (data.success) {
        const customerServiceModel = data.models.find(m => m.useCase === 'customer_service');
        setModelInfo(customerServiceModel);
      }
    } catch (error) {
      console.warn('Failed to fetch model info:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse('');
    setError('');
    setStaffName('');
    try {
      // API key is now handled securely on the server
      // Force production URL if we're on Netlify
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;
      
      const res = await fetch(`${baseURL}/voice/customer-service-response`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ review, sentiment }),
      });
      const data = await res.json();
      if (data.success) {
        setStaffName(data.staffName || 'Customer Care Team');
        setResponse(data.response || data.message || 'No response');
      } else {
        setError(data.error || 'Error generating response');
      }
    } catch (err) {
      setError('Network error');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ 
        maxWidth: 800, 
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Header Section */}
        <div style={{
          background: 'linear-gradient(135deg, #4f8cff 0%, #38e8ff 100%)',
          padding: '40px 32px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
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
          
          <span style={{ 
            fontSize: '64px', 
            marginBottom: '16px', 
            display: 'block',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}>👨‍💼</span>
          <h1 style={{ 
            margin: '0 0 12px 0', 
            fontWeight: '800', 
            fontSize: '36px', 
            letterSpacing: '-0.5px',
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            Customer Relationship Agent
          </h1>
          <p style={{ 
            margin: '0', 
            fontSize: '18px', 
            opacity: '0.95',
            color: '#fff',
            fontWeight: '500'
          }}>
            Transform customer feedback into warm, personal conversations
          </p>
        </div>

        {/* Main Content */}
        <div style={{
          padding: '40px 32px',
          background: '#fff'
        }}>
          {/* Model Information */}
          {modelInfo && (
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid #bae6fd'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <span style={{ fontSize: '24px' }}>🤖</span>
                <h3 style={{ 
                  margin: '0', 
                  color: '#0c4a6e', 
                  fontSize: '18px',
                  fontWeight: '700'
                }}>
                  AI Model: {modelInfo.name}
                </h3>
              </div>
              <p style={{ 
                margin: '0 0 12px 0', 
                color: '#0369a1', 
                lineHeight: '1.5',
                fontSize: '14px'
              }}>
                {modelInfo.description}
              </p>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {modelInfo.strengths.map((strength, index) => (
                  <span key={index} style={{
                    background: '#0ea5e9',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div style={{
            background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            border: '1px solid #e1e8ff'
          }}>
            <h3 style={{ 
              margin: '0 0 12px 0', 
              color: '#2d3748', 
              fontSize: '20px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💡 How it works
            </h3>
            <p style={{ 
              margin: '0', 
              color: '#4a5568', 
              lineHeight: '1.6',
              fontSize: '15px'
            }}>
              Paste customer feedback below, select the sentiment, and our AI will generate a warm, personal response 
              as if a customer relationship agent is having a genuine conversation with them - using friendly, 
              empathetic language that builds trust and shows we care about their experience.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Review Input Section */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '12px', 
                fontWeight: '700', 
                color: '#2d3748',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📝 Customer Feedback
              </label>
              <textarea
                value={review}
                onChange={e => setReview(e.target.value)}
                placeholder="Paste the customer feedback here... For example: 'The food was cold and the service was terrible. I waited 30 minutes for my order and when it finally came, it was completely wrong.'"
                rows={8}
                style={{ 
                  width: '100%', 
                  borderRadius: '12px', 
                  border: '2px solid #e2e8f0', 
                  padding: '20px', 
                  fontSize: '16px', 
                  background: '#fafbfc',
                  minHeight: '200px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: '1.6',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.background = '#fff';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.background = '#fafbfc';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Sentiment Selection */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '12px', 
                fontWeight: '700', 
                color: '#2d3748',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🎭 Feedback Sentiment
              </label>
              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                {[
                  { value: 'negative', label: 'Negative', icon: '😞', color: '#e53e3e' },
                  { value: 'neutral', label: 'Neutral', icon: '😐', color: '#d69e2e' },
                  { value: 'positive', label: 'Positive', icon: '😊', color: '#38a169' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSentiment(option.value)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: `2px solid ${sentiment === option.value ? option.color : '#e2e8f0'}`,
                      background: sentiment === option.value ? `${option.color}15` : '#fff',
                      color: sentiment === option.value ? option.color : '#4a5568',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '15px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      minWidth: '120px',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      if (sentiment !== option.value) {
                        e.target.style.borderColor = option.color;
                        e.target.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (sentiment !== option.value) {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{option.icon}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%',
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
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
                }
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTop: '2px solid #fff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Generating Response...
                </div>
              ) : (
                '💬 Generate Relationship Response'
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div style={{ 
              marginTop: '24px',
              background: 'linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%)',
              border: '1px solid #fc8181',
              borderRadius: '12px', 
              padding: '16px', 
              color: '#c53030',
              fontWeight: '600', 
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              {error}
            </div>
          )}

          {/* Conversational Chat Response Section */}
          {(response) && (
            <div style={{ 
              marginTop: '32px',
              background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f4ff 100%)',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid #c6f6d5',
              animation: 'slideInUp 0.5s ease-out'
            }}>
              {/* Chat Conversation */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Customer Review Bubble */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e42 100%)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: '#fff',
                    border: '3px solid #fff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    🧑
                  </div>
                  <div style={{ maxWidth: '80%' }}>
                    <div style={{
                      background: '#fff',
                      borderRadius: '20px',
                      padding: '16px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '4px',
                      fontSize: '15px',
                      color: '#2d3748',
                      lineHeight: '1.7',
                      fontFamily: 'inherit',
                      whiteSpace: 'pre-line'
                    }}>
                      {review}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'left' }}>
                      Customer • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
                {/* Staff Reply Bubbles (single message) */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexDirection: 'row-reverse' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: '#fff',
                    border: '3px solid #fff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    👨‍💼
                  </div>
                  <div style={{ maxWidth: '80%' }}>
                    <div style={{
                      background: '#e0e7ff',
                      borderRadius: '20px',
                      padding: '16px',
                      border: '1px solid #c7d2fe',
                      marginBottom: '4px',
                      fontSize: '15px',
                      color: '#2d3748',
                      lineHeight: '1.7',
                      fontFamily: 'inherit',
                      whiteSpace: 'pre-line',
                      textAlign: 'left'
                    }}>
                      {response}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'right' }}>
                      {staffName || 'Relationship Agent'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
              {/* Chat Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
                padding: '12px 16px',
                background: 'rgba(79, 140, 255, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(79, 140, 255, 0.2)'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#10b981',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></div>
                <span style={{
                  fontSize: '13px',
                  color: '#4f8cff',
                  fontWeight: '500'
                }}>
                  {staffName ? `${staffName} is online and ready to help` : 'Customer Relationship Agent is online'}
                </span>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center'
              }}>
                <button 
                  onClick={() => navigator.clipboard.writeText(response)}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  📋 Copy Response
                </button>
                <button 
                  onClick={() => {
                    setReview('');
                    setResponse('');
                    setError('');
                  }}
                  style={{
                    background: '#e2e8f0',
                    color: '#4a5568',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#cbd5e0';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#e2e8f0';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  🔄 New Response
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
} 