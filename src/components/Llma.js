import React, { useState, useEffect } from 'react';
import './Llma.css';
import apiConfig from '../config/api';
import { useTranslation } from 'react-i18next';
import EnhancedModelInfo from './EnhancedModelInfo';

const Llma = () => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [modelInfo, setModelInfo] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('auto');
  const { t } = useTranslation();

  // Load available models on component mount
  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputText.trim()) {
      setError(t('llma.enterText'));
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      // Add user message to conversation history
      const userMessage = { role: 'user', content: inputText, timestamp: new Date() };
      setConversationHistory(prev => [...prev, userMessage]);

      // Call API without API key (server handles it securely)
      const result = await callLlamaAPI(inputText, conversationHistory);
      setResponse(result);
      
      // Add AI response to conversation history
      const aiMessage = { role: 'assistant', content: result, timestamp: new Date() };
      setConversationHistory(prev => [...prev, aiMessage]);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const callLlamaAPI = async (text, history) => {
    // Check if API URL is configured and force production URL if on Netlify
    const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
    const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;
    
    if (!baseURL || baseURL.includes('your-render-app')) {
      throw new Error('Backend API not configured. Please set up your Render backend and configure REACT_APP_API_URL.');
    }
    
    const response = await fetch(`${baseURL}/llama`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        conversationHistory: history
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to get response from Llama API');
    }

    const data = await response.json();
    return data.response;
  };

  const examplePrompts = [
    t('llma.example1'),
    t('llma.example2'),
    t('llma.example3'),
    t('llma.example4')
  ];

  const handleExampleClick = (example) => {
    setInputText(example);
  };

  const clearConversation = () => {
    setConversationHistory([]);
    setResponse('');
    setError('');
  };

  return (
    <div className="llma-container">
      <div className="llma-header">
        <h2>💬 {t('llma.chatWithAI')}</h2>
        <p>{t('llma.naturalConversation')}</p>
      </div>

      <div className="llma-content">
        {/* Enhanced Model Information */}
        <div className="model-info-section">
          <EnhancedModelInfo style={{ marginBottom: '24px' }} />
        </div>

        {/* Model Selection */}
        <div className="model-selection-section">
          <h3>🤖 {t('llma.modelSelection')}</h3>
          <div className="model-selection-grid">
            <div className="model-option active">
              <div className="model-icon">🔄</div>
              <div className="model-details">
                <h4>{t('llma.autoSelect')}</h4>
                <p>{t('llma.autoSelectDescription')}</p>
              </div>
            </div>
            {availableModels.map(model => (
              <div key={model.key} className="model-option">
                <div className="model-icon">🤖</div>
                <div className="model-details">
                  <h4>{model.name}</h4>
                  <p>{model.description}</p>
                  <div className="model-strengths">
                    {model.strengths.slice(0, 3).map((strength, index) => (
                      <span key={index} className="strength-tag">{strength}</span>
                    ))}
                    {model.strengths.length > 3 && (
                      <span className="strength-count">+{model.strengths.length - 3} more</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <div className="conversation-history">
            <div className="history-header">
              <h4>💬 {t('llma.conversation')}</h4>
              <button onClick={clearConversation} className="clear-conversation-btn">
                🗑️ {t('llma.clearChat')}
              </button>
            </div>
            <div className="messages-container">
              {conversationHistory.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                  <div className="message-content">
                    {message.content}
                  </div>
                  <div className="message-timestamp">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="llma-form">
          <div className="input-section">
            <label htmlFor="userInput">{t('llma.yourMessage')}</label>
            <textarea
              id="userInput"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t('llma.typeMessagePlaceholder')}
              rows="3"
              className="text-input"
            />
          </div>

          <div className="example-prompts">
            <h4>💡 {t('llma.conversationStarters')}</h4>
            <div className="prompt-buttons">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleExampleClick(prompt)}
                  className="example-btn"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading || !inputText.trim()}
            className="submit-btn"
          >
            {isLoading ? t('llma.thinking') : '💬 ' + t('llma.sendMessage')}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        {isLoading && (
          <div className="loading-indicator">
            <div className="loading-spinner"></div>
            <p>{t('llma.aiThinking')}</p>
          </div>
        )}

        {response && conversationHistory.length === 0 && (
          <div className="response-section">
            <h3>💬 {t('llma.aiResponse')}</h3>
            <div className="response-content">
              <pre>{response}</pre>
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(response)}
              className="copy-btn"
            >
              📋 {t('llma.copyResponse')}
            </button>
          </div>
        )}
      </div>

      <div className="llma-info">
        <h4>ℹ️ {t('llma.aboutThisChat')}</h4>
        <ul>
          <li><strong>{t('llma.model')}</strong> NVIDIA Llama 3.3 Nemotron Super 49B</li>
          <li><strong>{t('llma.style')}</strong> {t('llma.naturalStyle')}</li>
          <li><strong>{t('llma.capabilities')}</strong> {t('llma.capabilitiesList')}</li>
          <li><strong>{t('llma.tone')}</strong> {t('llma.friendlyTone')}</li>
        </ul>
        
        <div className="api-info">
          <h5>🔧 {t('llma.chatConfig')}</h5>
          <pre className="api-config">
{`{
  "model": "nvidia/llama-3.3-nemotron-super-49b-v1",
  "temperature": 0.7,
  "top_p": 0.9,
  "max_tokens": 4096,
  "style": "conversational"
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Llma;