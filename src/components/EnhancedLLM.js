import React, { useState, useEffect } from 'react';
import './EnhancedLLM.css';

const EnhancedLLM = () => {
  const [input, setInput] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qualityAnalysis, setQualityAnalysis] = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('auto');
  const [conversationHistory, setConversationHistory] = useState([]);

  // Load API key from environment or localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('nvidia_api_key') || process.env.REACT_APP_NVIDIA_API_KEY || '';
    setApiKey(savedApiKey);
    
    // Load available models
    loadAvailableModels();
  }, []);

  const loadAvailableModels = async () => {
    try {
      const response = await fetch('/api/available-models');
      const data = await response.json();
      if (data.success) {
        setAvailableModels(data.models);
        setModelInfo(data);
      }
    } catch (error) {
      console.warn('Failed to load available models:', error);
    }
  };

  const handleApiKeyChange = (newApiKey) => {
    setApiKey(newApiKey);
    localStorage.setItem('nvidia_api_key', newApiKey);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !apiKey.trim()) {
      setError('Please provide both input text and API key');
      return;
    }

    setLoading(true);
    setError('');
    setResponse('');
    setQualityAnalysis(null);

    try {
      const requestBody = {
        text: input,
        apiKey: apiKey,
        conversationHistory: conversationHistory,
        context: {
          userIntent: 'general',
          domain: 'general',
          urgency: 'normal'
        }
      };

      // Force specific model if selected
      if (selectedModel !== 'auto') {
        requestBody.context.forceModel = selectedModel;
      }

      const res = await fetch('/api/enhanced-llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.response);
        setQualityAnalysis(data.qualityAnalysis);
        
        // Update conversation history
        const newHistory = [
          ...conversationHistory,
          { role: 'user', content: input },
          { role: 'assistant', content: data.response }
        ];
        setConversationHistory(newHistory.slice(-10)); // Keep last 10 messages
      } else {
        setError(data.error || 'Failed to generate response');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const analyzeResponseQuality = async () => {
    if (!response.trim()) {
      setError('No response to analyze');
      return;
    }

    try {
      const res = await fetch('/api/analyze-response-quality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: response,
          contentType: 'general',
          context: { input: input }
        }),
      });

      const data = await res.json();
      if (data.success) {
        setQualityAnalysis(data.qualityAnalysis);
      } else {
        setError(data.error || 'Failed to analyze response quality');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  const compareModels = async () => {
    if (!input.trim() || !apiKey.trim()) {
      setError('Please provide both input text and API key');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/compare-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: input,
          apiKey: apiKey,
          context: { userIntent: 'general' }
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Display comparison results
        console.log('Model comparison:', data.comparison);
        alert(`Model comparison completed!\nRecommended: ${data.comparison.recommendedModel}\nConfidence: ${(data.comparison.confidence * 100).toFixed(1)}%`);
      } else {
        setError(data.error || 'Failed to compare models');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setConversationHistory([]);
    setResponse('');
    setQualityAnalysis(null);
    setError('');
  };

  const copyToClipboard = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      alert('Response copied to clipboard!');
    }
  };

  const getQualityColor = (score) => {
    if (score >= 0.8) return '#10b981'; // Green
    if (score >= 0.6) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getQualityLabel = (score) => {
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    if (score >= 0.4) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="enhanced-llm-container">
      <div className="enhanced-llm-header">
        <h1>🚀 Enhanced LLM Service</h1>
        <p>Multi-model AI with intelligent response quality analysis and pattern recognition</p>
      </div>

      <div className="enhanced-llm-content">
        {/* API Key Input */}
        <div className="api-key-section">
          <label>🔑 NVIDIA API Key:</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            placeholder="Enter your NVIDIA API key"
            className="api-key-input"
          />
        </div>

        {/* Model Selection */}
        <div className="model-selection">
          <label>🤖 Model Selection:</label>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            className="model-select"
          >
            <option value="auto">🔄 Auto-select (Recommended)</option>
            {availableModels.map(model => (
              <option key={model.key} value={model.key}>
                {model.name} - {model.strengths.join(', ')}
              </option>
            ))}
          </select>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-section">
            <label>💬 Your Message:</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your message here... The AI will analyze the content type and select the best model automatically."
              rows={4}
              className="input-textarea"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? '🔄 Generating...' : '🚀 Generate Enhanced Response'}
            </button>
            
            <button 
              type="button" 
              onClick={analyzeResponseQuality} 
              disabled={!response || loading}
              className="analyze-btn"
            >
              📊 Analyze Quality
            </button>
            
            <button 
              type="button" 
              onClick={compareModels} 
              disabled={!input || loading}
              className="compare-btn"
            >
              🔄 Compare Models
            </button>
            
            <button 
              type="button" 
              onClick={clearConversation}
              className="clear-btn"
            >
              🗑️ Clear
            </button>
          </div>
        </form>

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="response-section">
            <div className="response-header">
              <h3>🤖 AI Response</h3>
              <button onClick={copyToClipboard} className="copy-btn">
                📋 Copy
              </button>
            </div>
            <div className="response-content">
              <pre>{response}</pre>
            </div>
          </div>
        )}

        {/* Quality Analysis */}
        {qualityAnalysis && (
          <div className="quality-analysis">
            <h3>📊 Response Quality Analysis</h3>
            
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
              <h4>📈 Detailed Metrics</h4>
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

            {qualityAnalysis.weaknesses.length > 0 && (
              <div className="weaknesses-section">
                <h4>⚠️ Areas for Improvement</h4>
                <ul>
                  {qualityAnalysis.weaknesses.map((weakness, index) => (
                    <li key={index}>{weakness}</li>
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

            <div className="response-details">
              <h4>📋 Response Details</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <span>Sentiment:</span>
                  <span className="detail-value">{qualityAnalysis.sentiment}</span>
                </div>
                <div className="detail-item">
                  <span>Complexity:</span>
                  <span className="detail-value">{qualityAnalysis.complexity}</span>
                </div>
                <div className="detail-item">
                  <span>Key Points:</span>
                  <span className="detail-value">{qualityAnalysis.keyPoints.length}</span>
                </div>
                <div className="detail-item">
                  <span>Words:</span>
                  <span className="detail-value">{qualityAnalysis.structureAnalysis.words}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <div className="conversation-history">
            <h3>💬 Conversation History</h3>
            <div className="history-list">
              {conversationHistory.map((msg, index) => (
                <div key={index} className={`history-item ${msg.role}`}>
                  <span className="role-label">{msg.role === 'user' ? '👤 You:' : '🤖 AI:'}</span>
                  <span className="message-content">{msg.content.substring(0, 100)}...</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedLLM; 