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
          name: 'NVIDIA Llama 3.3 Nemotron Super 49B',
          description: 'Advanced AI model for various tasks with detailed thinking',
          strengths: ['Long-form content generation', 'Detailed reasoning', 'SEO optimization'],
          modelInfo: {
            provider: 'NVIDIA',
            parameters: '49B',
            maxContextLength: '4096 tokens'
          }
        });
        return;
      }

      // Force production URL if we're on Netlify
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;

      // Use the blog model endpoint for blog-related use cases
      let apiUrl;
      if (useCase === 'blog_generation' || useCase === 'review_generation') {
        apiUrl = `${baseURL}/blog/model`;
      } else {
        apiUrl = `${baseURL}/models`;
      }
      
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
        let model;
        if (useCase === 'blog_generation' || useCase === 'review_generation') {
          // Use the blog model data directly
          model = data.model;
        } else {
          // Use the models endpoint for other use cases
          model = data.models.find(m => m.useCase === useCase);
        }
        
        if (model) {
          setModelInfo(model);
        } else {
          console.warn('⚠️ No model found for use case:', useCase);
          setModelInfo({
            name: 'NVIDIA Llama 3.3 Nemotron Super 49B',
            description: 'Advanced AI model for various tasks with detailed thinking',
            strengths: ['Long-form content generation', 'Detailed reasoning', 'SEO optimization'],
            modelInfo: {
              provider: 'NVIDIA',
              parameters: '49B',
              maxContextLength: '4096 tokens'
            }
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
        name: 'NVIDIA Llama 3.3 Nemotron Super 49B',
        description: 'Advanced AI model for various tasks with detailed thinking',
        strengths: ['Long-form content generation', 'Detailed reasoning', 'SEO optimization'],
        modelInfo: {
          provider: 'NVIDIA',
          parameters: '49B',
          maxContextLength: '4096 tokens'
        }
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
      
      {/* Enhanced Model Information */}
      {modelInfo.modelInfo && (
        <div style={{
          marginBottom: '8px',
          padding: '8px',
          background: 'rgba(14, 165, 233, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(14, 165, 233, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <span style={{
              fontSize: '11px',
              color: '#0c4a6e',
              fontWeight: '600'
            }}>
              {modelInfo.modelInfo.provider} • {modelInfo.modelInfo.parameters}
            </span>
            <span style={{
              fontSize: '11px',
              color: '#0369a1',
              fontWeight: '500'
            }}>
              {modelInfo.modelInfo.maxContextLength}
            </span>
          </div>
          
          {modelInfo.modelInfo.capabilities && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2px',
              marginTop: '4px'
            }}>
              {modelInfo.modelInfo.capabilities.slice(0, 3).map((capability, index) => (
                <span key={index} style={{
                  background: '#0ea5e9',
                  color: '#fff',
                  padding: '1px 4px',
                  borderRadius: '4px',
                  fontSize: '9px',
                  fontWeight: '500'
                }}>
                  {capability}
                </span>
              ))}
              {modelInfo.modelInfo.capabilities.length > 3 && (
                <span style={{
                  background: '#6b7280',
                  color: '#fff',
                  padding: '1px 4px',
                  borderRadius: '4px',
                  fontSize: '9px',
                  fontWeight: '500'
                }}>
                  +{modelInfo.modelInfo.capabilities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      )}
      
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
      
      {/* Performance Metrics */}
      {modelInfo.modelInfo?.performance && (
        <div style={{
          marginTop: '8px',
          padding: '6px',
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '6px',
          border: '1px solid rgba(34, 197, 94, 0.2)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: '#166534'
          }}>
            <span>⚡ {modelInfo.modelInfo.performance.responseTime}</span>
            <span>🎯 {modelInfo.modelInfo.performance.contentQuality}</span>
            <span>🔄 {modelInfo.modelInfo.performance.consistency}</span>
          </div>
        </div>
      )}
      
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