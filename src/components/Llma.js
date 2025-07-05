import React, { useState } from 'react';
import './Llma.css';
import apiConfig from '../config/api';

const Llma = () => {
  const [inputText, setInputText] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);

  // Get API key from environment variable
  const apiKey = process.env.REACT_APP_NVIDIA_API_KEY || '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputText.trim()) {
      setError('Please enter some text to process');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      // Add user message to conversation history
      const userMessage = { role: 'user', content: inputText, timestamp: new Date() };
      setConversationHistory(prev => [...prev, userMessage]);

      // Use API key from env
      const result = await callLlamaAPI(inputText, apiKey, conversationHistory);
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

  const callLlamaAPI = async (text, key, history) => {
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
        apiKey: key,
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
    "Hey, what's up? How's your day going?",
    "Can you help me understand something?",
    "What do you think about AI and the future?",
    "Tell me a funny story or joke"
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
        <h2>💬 Chat with AI</h2>
        <p>Have a natural conversation with NVIDIA's advanced AI</p>
      </div>

      <div className="llma-content">
        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <div className="conversation-history">
            <div className="history-header">
              <h4>💬 Conversation</h4>
              <button onClick={clearConversation} className="clear-conversation-btn">
                🗑️ Clear Chat
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
            <label htmlFor="userInput">Your Message:</label>
            <textarea
              id="userInput"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here... Just chat naturally!"
              rows="3"
              className="text-input"
            />
          </div>

          <div className="example-prompts">
            <h4>💡 Conversation Starters:</h4>
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
            {isLoading ? '🤔 Thinking...' : '💬 Send Message'}
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
            <p>AI is thinking...</p>
          </div>
        )}

        {response && conversationHistory.length === 0 && (
          <div className="response-section">
            <h3>💬 AI Response:</h3>
            <div className="response-content">
              <pre>{response}</pre>
            </div>
            <button 
              onClick={() => navigator.clipboard.writeText(response)}
              className="copy-btn"
            >
              📋 Copy Response
            </button>
          </div>
        )}
      </div>

      <div className="llma-info">
        <h4>ℹ️ About This Chat</h4>
        <ul>
          <li><strong>Model:</strong> Meta Llama 3.1 70B Instruct</li>
          <li><strong>Style:</strong> Natural, conversational responses</li>
          <li><strong>Capabilities:</strong> Casual chat, questions, storytelling</li>
          <li><strong>Tone:</strong> Friendly and approachable</li>
        </ul>
        
        <div className="api-info">
          <h5>🔧 Chat Configuration:</h5>
          <pre className="api-config">
{`{
  "model": "meta/llama-3.1-70b-instruct",
  "temperature": 0.7,
  "top_p": 0.9,
  "max_tokens": 3072,
  "style": "conversational"
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Llma;