import React, { useState, useEffect } from 'react';
import apiConfig from '../config/api';

const ModelInfo = ({ useCase, style = {} }) => {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModelInfo();
  }, [useCase]);

  const fetchModelInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Debug logging
      console.log('🔍 ModelInfo Debug:', {
        environment: process.env.NODE_ENV,
        baseURL: apiConfig.baseURL,
        REACT_APP_API_URL: process.env.REACT_APP_API_URL,
        useCase: useCase
      });
      
      // Check if API URL is configured
      if (!apiConfig.baseURL || apiConfig.baseURL.includes('your-render-app')) {
        console.warn('⚠️ API URL not configured, using fallback model info');
        setModelInfo({
          name: 'Meta Llama 3.1 70B',
          description: 'Advanced AI model for various tasks',
          strengths: ['Natural Language', 'Context Understanding']
        });
        return;
      }

      // Force production URL if we're on Netlify
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;

      const apiUrl = `${baseURL}/models`;
      console.log('🌐 Making request to:', apiUrl);
      
      const res = await fetch(apiUrl);
      
      console.log('📡 Response status:', res.status);
      console.log('📡 Response headers:', Object.fromEntries(res.headers.entries()));
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ HTTP Error:', res.status, errorText);
        throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorText}`);
      }
      
      const data = await res.json();
      console.log('📦 Response data:', data);
      
      if (data.success) {
        const model = data.models.find(m => m.useCase === useCase);
        if (model) {
          setModelInfo(model);
        } else {
          console.warn('⚠️ No model found for use case:', useCase);
          setModelInfo({
            name: 'Meta Llama 3.1 70B',
            description: 'Advanced AI model for various tasks',
            strengths: ['Natural Language', 'Context Understanding']
          });
        }
      } else {
        throw new Error(data.error || 'Failed to fetch model info');
      }
    } catch (error) {
      console.error('❌ Failed to fetch model info:', error);
      setError(error.message);
      // Set fallback model info
      setModelInfo({
        name: 'Meta Llama 3.1 70B',
        description: 'Advanced AI model for various tasks',
        strengths: ['Natural Language', 'Context Understanding']
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #bae6fd',
        ...style
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid #0ea5e9',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ color: '#0c4a6e', fontSize: '14px' }}>Loading model info...</span>
        </div>
      </div>
    );
  }

  if (!modelInfo) {
    return null;
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid #bae6fd',
      ...style
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px'
      }}>
        <span style={{ fontSize: '18px' }}>🤖</span>
        <h4 style={{ 
          margin: '0', 
          color: '#0c4a6e', 
          fontSize: '14px',
          fontWeight: '600'
        }}>
          AI Model: {modelInfo.name}
        </h4>
      </div>
      <p style={{ 
        margin: '0 0 8px 0', 
        color: '#0369a1', 
        lineHeight: '1.4',
        fontSize: '12px'
      }}>
        {modelInfo.description}
      </p>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px'
      }}>
        {modelInfo.strengths.map((strength, index) => (
          <span key={index} style={{
            background: '#0ea5e9',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '8px',
            fontSize: '10px',
            fontWeight: '500'
          }}>
            {strength}
          </span>
        ))}
      </div>
      {error && (
        <div style={{
          marginTop: '8px',
          padding: '8px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          fontSize: '11px',
          color: '#dc2626'
        }}>
          <strong>Debug Error:</strong> {error}
        </div>
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ModelInfo; 