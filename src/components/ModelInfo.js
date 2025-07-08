import React, { useState, useEffect } from 'react';
import apiConfig from '../config/api';
import { useTranslation } from 'react-i18next';

const ModelInfo = ({ useCase, style = {} }) => {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchModelInfo = async () => {
      setLoading(true);
      setError('');
      try {
        const baseURL = process.env.REACT_APP_API_URL || '/api';
        const response = await fetch(`${baseURL}/llama/model?useCase=${useCase}`);
        const data = await response.json();
        if (data.success) {
          setModelInfo(data.model);
        } else {
          setError(data.error || 'Failed to fetch model info');
        }
      } catch (err) {
        setError('Network error fetching model info');
      } finally {
        setLoading(false);
      }
    };
    if (useCase) fetchModelInfo();
  }, [useCase]);

  if (loading) return <div style={style}>Loading model info...</div>;
  if (error) return <div style={style}>Error: {error}</div>;
  if (!modelInfo) return <div style={style}>No model info available.</div>;

  return (
    <div style={style}>
      <h4>Model: <span style={{ color: '#4f8cff' }}>{modelInfo.name}</span></h4>
      <div style={{ margin: '8px 0', color: '#666' }}>{modelInfo.description}</div>
      <div>
        <strong>Strengths:</strong>
        <ul style={{ margin: '4px 0 0 16px', color: '#10b981' }}>
          {modelInfo.strengths && modelInfo.strengths.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </div>
      <div style={{ fontSize: '12px', color: '#aaa', marginTop: 8 }}>API: {modelInfo.baseURL}</div>
    </div>
  );
};

export default ModelInfo; 