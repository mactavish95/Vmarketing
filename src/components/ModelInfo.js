import React, { useState, useEffect } from 'react';

const ModelInfo = ({ useCase, style = {} }) => {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelInfo();
  }, [useCase]);

  const fetchModelInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/models');
      const data = await res.json();
      if (data.success) {
        const model = data.models.find(m => m.useCase === useCase);
        setModelInfo(model);
      }
    } catch (error) {
      console.warn('Failed to fetch model info:', error);
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