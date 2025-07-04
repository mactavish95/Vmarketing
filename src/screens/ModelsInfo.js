import React, { useState, useEffect } from 'react';
import apiConfig from '../config/api';

const ModelsInfo = () => {
  const [models, setModels] = useState([]);
  const [useCases, setUseCases] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchModelsInfo();
  }, []);

  const fetchModelsInfo = async () => {
    try {
      setLoading(true);
      // Force production URL if we're on Netlify
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;
      
      const res = await fetch(`${baseURL}/models`);
      const data = await res.json();
      if (data.success) {
        setModels(data.models);
        setUseCases(data.useCases);
      } else {
        setError('Failed to fetch model information');
      }
    } catch (error) {
      setError('Network error while fetching model information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #667eea',
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ margin: 0, color: '#4a5568' }}>Loading model information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}>
          <span style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>⚠️</span>
          <h2 style={{ margin: '0 0 12px 0', color: '#e53e3e' }}>Error</h2>
          <p style={{ margin: 0, color: '#4a5568' }}>{error}</p>
        </div>
      </div>
    );
  }

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
          }}>🤖</span>
          <h1 style={{ 
            margin: '0 0 12px 0', 
            fontWeight: '800', 
            fontSize: '36px', 
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            AI Models Configuration
          </h1>
          <p style={{ 
            margin: '0', 
            fontSize: '18px', 
            color: '#fff',
            opacity: '0.95'
          }}>
            Specialized LLM models for different use cases
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '40px 32px' }}>
          {/* Use Cases Overview */}
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ 
              margin: '0 0 20px 0', 
              color: '#2d3748', 
              fontSize: '24px',
              fontWeight: '700'
            }}>
              Use Cases
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {Object.entries(useCases).map(([useCase, description]) => (
                <div key={useCase} style={{
                  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{
                    margin: '0 0 12px 0',
                    color: '#2d3748',
                    fontSize: '18px',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {useCase.replace('_', ' ')}
                  </h3>
                  <p style={{
                    margin: 0,
                    color: '#4a5568',
                    lineHeight: '1.6'
                  }}>
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Models Details */}
          <div>
            <h2 style={{ 
              margin: '0 0 20px 0', 
              color: '#2d3748', 
              fontSize: '24px',
              fontWeight: '700'
            }}>
              Model Configurations
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '24px'
            }}>
              {models.map((model) => (
                <div key={model.key} style={{
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #bae6fd',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <span style={{ fontSize: '24px' }}>🤖</span>
                    <div>
                      <h3 style={{
                        margin: '0 0 4px 0',
                        color: '#0c4a6e',
                        fontSize: '18px',
                        fontWeight: '700'
                      }}>
                        {model.name}
                      </h3>
                      <p style={{
                        margin: 0,
                        color: '#0369a1',
                        fontSize: '14px',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {model.useCase.replace('_', ' ')}
                      </p>
                    </div>
                  </div>

                  <p style={{
                    margin: '0 0 16px 0',
                    color: '#0369a1',
                    lineHeight: '1.6',
                    fontSize: '14px'
                  }}>
                    {model.description}
                  </p>

                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{
                      margin: '0 0 8px 0',
                      color: '#0c4a6e',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      Strengths
                    </h4>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px'
                    }}>
                      {model.strengths.map((strength, index) => (
                        <span key={index} style={{
                          background: '#0ea5e9',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                  }}>
                    <div>
                      <span style={{
                        color: '#0c4a6e',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Temperature
                      </span>
                      <p style={{
                        margin: '4px 0 0 0',
                        color: '#0369a1',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>
                        {model.temperature}
                      </p>
                    </div>
                    <div>
                      <span style={{
                        color: '#0c4a6e',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Max Tokens
                      </span>
                      <p style={{
                        margin: '4px 0 0 0',
                        color: '#0369a1',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>
                        {model.maxTokens.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

export default ModelsInfo; 