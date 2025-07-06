import React, { useState, useEffect } from 'react';
import apiConfig from '../config/api';
import { useTranslation } from 'react-i18next';

const EnhancedModelInfo = ({ style = {} }) => {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Force production URL if we're on Netlify
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;

      const apiUrl = `${baseURL}/blog/model`;
      console.log('🌐 Fetching enhanced model info from:', apiUrl);
      
      const res = await fetch(apiUrl);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        setModelInfo(data.model);
      } else {
        throw new Error(data.error || 'Failed to fetch model info');
      }
    } catch (error) {
      console.error('❌ Failed to fetch enhanced model info:', error);
      setError(error.message);
      // Set fallback model info
      setModelInfo({
        name: 'NVIDIA Llama 3.3 Nemotron Super 49B',
        description: 'Optimized for creating engaging, SEO-friendly blog content with detailed thinking',
        strengths: ['Content Creation', 'SEO Optimization', 'Brand Voice', 'Engagement', 'Detailed Thinking'],
        modelInfo: {
          provider: 'NVIDIA',
          modelType: 'nvidia/llama-3.3-nemotron-super-49b-v1',
          parameters: '49B',
          maxContextLength: '4096 tokens',
          capabilities: [
            'Long-form content generation',
            'Detailed reasoning and analysis',
            'SEO-optimized writing',
            'Image integration and captioning',
            'Multi-section blog structuring',
            'Brand voice adaptation'
          ],
          performance: {
            responseTime: 'Fast',
            contentQuality: 'High',
            consistency: 'Excellent',
            creativity: 'Balanced'
          }
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
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #bae6fd',
        textAlign: 'center',
        ...style
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '3px solid #0ea5e9',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ color: '#0c4a6e', fontSize: '16px', fontWeight: '600' }}>
            {t('enhancedModelInfo.loading')}
          </span>
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
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #bae6fd',
      ...style
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          borderRadius: '12px',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: '#fff',
          boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
        }}>
          🤖
        </div>
        <div>
          <h3 style={{ 
            margin: '0 0 4px 0', 
            color: '#0c4a6e', 
            fontSize: '20px',
            fontWeight: '700'
          }}>
            {modelInfo.name}
          </h3>
          <p style={{ 
            margin: '0', 
            color: '#0369a1', 
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {modelInfo.modelInfo?.provider} • {modelInfo.modelInfo?.parameters} • {modelInfo.modelInfo?.maxContextLength}
          </p>
        </div>
      </div>

      {/* Description */}
      <p style={{ 
        margin: '0 0 16px 0', 
        color: '#0369a1', 
        lineHeight: '1.6',
        fontSize: '14px'
      }}>
        {modelInfo.description}
      </p>

      {/* Capabilities */}
      {modelInfo.modelInfo?.capabilities && (
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{
            margin: '0 0 12px 0',
            color: '#0c4a6e',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            🚀 {t('enhancedModelInfo.keyCapabilities')}
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '8px'
          }}>
            {modelInfo.modelInfo.capabilities.map((capability, index) => (
              <div key={index} style={{
                background: 'rgba(14, 165, 233, 0.1)',
                border: '1px solid rgba(14, 165, 233, 0.2)',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                color: '#0c4a6e',
                fontWeight: '500'
              }}>
                ✓ {capability}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {modelInfo.modelInfo?.performance && (
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{
            margin: '0 0 12px 0',
            color: '#0c4a6e',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            📊 {t('enhancedModelInfo.performanceMetrics')}
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px'
          }}>
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>⚡</div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#166534' }}>
                {modelInfo.modelInfo.performance.responseTime}
              </div>
              <div style={{ fontSize: '10px', color: '#16a34a' }}>{t('enhancedModelInfo.responseTime')}</div>
            </div>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎯</div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af' }}>
                {modelInfo.modelInfo.performance.contentQuality}
              </div>
              <div style={{ fontSize: '10px', color: '#3b82f6' }}>{t('enhancedModelInfo.contentQuality')}</div>
            </div>
            <div style={{
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🔄</div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#7c3aed' }}>
                {modelInfo.modelInfo.performance.consistency}
              </div>
              <div style={{ fontSize: '10px', color: '#a855f7' }}>{t('enhancedModelInfo.consistency')}</div>
            </div>
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>✨</div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#d97706' }}>
                {modelInfo.modelInfo.performance.creativity}
              </div>
              <div style={{ fontSize: '10px', color: '#f59e0b' }}>{t('enhancedModelInfo.creativity')}</div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Specifications */}
      {modelInfo.parameters && (
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{
            margin: '0 0 12px 0',
            color: '#0c4a6e',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            ⚙️ {t('enhancedModelInfo.technicalSpecs')}
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '8px'
          }}>
            <div style={{
              background: 'rgba(107, 114, 128, 0.1)',
              border: '1px solid rgba(107, 114, 128, 0.2)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '12px'
            }}>
              <div style={{ color: '#374151', fontWeight: '600' }}>{t('enhancedModelInfo.temperature')}</div>
              <div style={{ color: '#6b7280' }}>{modelInfo.parameters.temperature}</div>
            </div>
            <div style={{
              background: 'rgba(107, 114, 128, 0.1)',
              border: '1px solid rgba(107, 114, 128, 0.2)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '12px'
            }}>
              <div style={{ color: '#374151', fontWeight: '600' }}>{t('enhancedModelInfo.maxTokens')}</div>
              <div style={{ color: '#6b7280' }}>{modelInfo.parameters.maxTokens.toLocaleString()}</div>
            </div>
            <div style={{
              background: 'rgba(107, 114, 128, 0.1)',
              border: '1px solid rgba(107, 114, 128, 0.2)',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '12px'
            }}>
              <div style={{ color: '#374151', fontWeight: '600' }}>{t('enhancedModelInfo.topP')}</div>
              <div style={{ color: '#6b7280' }}>{modelInfo.parameters.topP}</div>
            </div>
          </div>
        </div>
      )}

      {/* Strengths */}
      <div>
        <h4 style={{
          margin: '0 0 12px 0',
          color: '#0c4a6e',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          💪 {t('enhancedModelInfo.modelStrengths')}
        </h4>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px'
        }}>
          {modelInfo.strengths.map((strength, index) => (
            <span key={index} style={{
              background: '#0ea5e9',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              {strength}
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#dc2626'
        }}>
          <strong>{t('enhancedModelInfo.error')}:</strong> {error}
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

export default EnhancedModelInfo; 