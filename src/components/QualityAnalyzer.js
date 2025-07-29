import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import apiConfig from '../config/api';

const QualityAnalyzer = ({
  content,
  platform,
  postType,
  tone,
  targetAudience,
  contentStructure,
  engagementGoal,
  brandVoiceIntensity,
  engagementUrgency,
  situation,
  targetLength,
  contentType = 'facebook_post',
  onAnalysisComplete,
  onAnalysisError,
  autoAnalyze = true,
  showUI = true
}) => {
  const { t } = useTranslation();
  const [qualityAnalysis, setQualityAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [lastAnalyzedContent, setLastAnalyzedContent] = useState('');

  // Calculate target length if not provided
  const calculateTargetLength = useCallback(() => {
    if (targetLength) return targetLength;
    
    const platformLengths = {
      facebook: 80,
      instagram: 60,
      linkedin: 100,
      twitter: 50,
      tiktok: 40,
      youtube: 150
    };
    
    return platformLengths[platform] || 80;
  }, [targetLength, platform]);

  // Main analysis function
  const analyzeQuality = useCallback(async (text = content) => {
    if (!text || !text.trim()) {
      setAnalysisError(t('qualityAnalyzer.noContentToAnalyze'));
      return null;
    }

    // Skip if content hasn't changed
    if (text === lastAnalyzedContent && qualityAnalysis) {
      return qualityAnalysis;
    }

    setIsAnalyzing(true);
    setAnalysisError('');
    setQualityAnalysis(null);

    try {
      // Force production URL if we're on Netlify
      const isNetlify = window.location.hostname.includes('netlify.app') || 
                       window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;
      
      const response = await fetch(`${baseURL}/analyze-response-quality`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: text,
          contentType,
          context: {
            platform,
            targetAudience,
            tone,
            engagementGoal,
            contentStructure,
            postType,
            brandVoiceIntensity,
            engagementUrgency,
            situation,
            targetLength: calculateTargetLength()
          }
        })
      });

      const data = await response.json();
      
      if (data.success && data.qualityAnalysis) {
        setQualityAnalysis(data.qualityAnalysis);
        setLastAnalyzedContent(text);
        
        // Call callback if provided
        if (onAnalysisComplete) {
          onAnalysisComplete(data.qualityAnalysis);
        }
        
        return data.qualityAnalysis;
      } else {
        const error = data.error || t('qualityAnalyzer.analysisFailed');
        setAnalysisError(error);
        
        if (onAnalysisError) {
          onAnalysisError(error);
        }
        
        return null;
      }
    } catch (err) {
      const error = t('qualityAnalyzer.networkError');
      console.error('Quality analysis error:', err);
      setAnalysisError(error);
      
      if (onAnalysisError) {
        onAnalysisError(error);
      }
      
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [
    content,
    contentType,
    platform,
    targetAudience,
    tone,
    engagementGoal,
    contentStructure,
    postType,
    brandVoiceIntensity,
    engagementUrgency,
    situation,
    calculateTargetLength,
    onAnalysisComplete,
    onAnalysisError,
    lastAnalyzedContent,
    qualityAnalysis,
    t
  ]);

  // Auto-analyze when content changes
  React.useEffect(() => {
    if (autoAnalyze && content && content.trim() && content !== lastAnalyzedContent) {
      analyzeQuality();
    }
  }, [content, autoAnalyze, analyzeQuality, lastAnalyzedContent]);

  // Utility functions for UI display
  const getQualityColor = (score) => {
    if (score >= 0.8) return '#10b981'; // Green for excellent
    if (score >= 0.6) return '#f59e0b'; // Orange for good
    return '#ef4444'; // Red for poor
  };

  const getQualityLabel = (score) => {
    if (score >= 0.8) return t('socialMedia.quality.excellent');
    if (score >= 0.6) return t('socialMedia.quality.good');
    if (score >= 0.4) return t('socialMedia.quality.fair');
    return t('socialMedia.quality.poor');
  };

  const getQualityIcon = (score) => {
    if (score >= 0.8) return '🌟';
    if (score >= 0.6) return '✅';
    if (score >= 0.4) return '⚠️';
    return '❌';
  };

  // Manual trigger function
  const triggerAnalysis = () => {
    analyzeQuality();
  };

  // If UI is disabled, just return the analysis function
  if (!showUI) {
    return {
      analyzeQuality,
      qualityAnalysis,
      isAnalyzing,
      analysisError,
      triggerAnalysis
    };
  }

  return (
    <div className="quality-analyzer">
      {/* Analysis Controls */}
      <div className="analysis-controls" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '16px',
        padding: '12px',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }}>
        <button
          onClick={triggerAnalysis}
          disabled={isAnalyzing || !content?.trim()}
          style={{
            background: isAnalyzing ? '#6b7280' : 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: isAnalyzing || !content?.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {isAnalyzing ? (
            <>
              <div className="loading-spinner" style={{
                width: '14px',
                height: '14px',
                border: '2px solid #ffffff40',
                borderTop: '2px solid #ffffff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              {t('qualityAnalyzer.analyzing')}
            </>
          ) : (
            <>
              🔍 {t('qualityAnalyzer.analyzeQuality')}
            </>
          )}
        </button>
        
        {qualityAnalysis && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            background: 'white',
            borderRadius: '20px',
            border: '1px solid #e2e8f0',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            <span>{getQualityIcon(qualityAnalysis.overallScore)}</span>
            <span style={{ color: getQualityColor(qualityAnalysis.overallScore) }}>
              {getQualityLabel(qualityAnalysis.overallScore)}
            </span>
            <span style={{ color: '#6b7280' }}>
              ({Math.round(qualityAnalysis.overallScore * 100)}%)
            </span>
          </div>
        )}
      </div>

      {/* Error Display */}
      {analysisError && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
          color: '#991b1b',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          ❌ {analysisError}
        </div>
      )}

      {/* Quality Analysis Results */}
      {qualityAnalysis && (
        <div className="quality-results" style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '12px',
          padding: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          {/* Overall Score */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📊 {t('socialMedia.qualityAnalysis')}
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              background: 'white',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: getQualityColor(qualityAnalysis.overallScore)
              }}>
                {getQualityLabel(qualityAnalysis.overallScore)}
              </span>
              <span style={{
                fontSize: '20px',
                fontWeight: '800',
                color: getQualityColor(qualityAnalysis.overallScore)
              }}>
                {Math.round(qualityAnalysis.overallScore * 100)}
              </span>
            </div>
          </div>

          {/* Metrics Grid */}
          {qualityAnalysis.metrics && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px',
              marginBottom: '20px'
            }}>
              {Object.entries(qualityAnalysis.metrics).map(([metric, score]) => (
                <div key={metric} style={{
                  background: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#64748b',
                    marginBottom: '6px',
                    textTransform: 'capitalize'
                  }}>
                    {metric.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: getQualityColor(score)
                  }}>
                    {Math.round(score * 100)}%
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Strengths and Weaknesses */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {qualityAnalysis.strengths && qualityAnalysis.strengths.length > 0 && (
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#059669',
                  margin: '0 0 12px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  ✅ {t('socialMedia.strengths')}
                </h4>
                <ul style={{
                  margin: '0',
                  paddingLeft: '20px',
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: '1.5'
                }}>
                  {qualityAnalysis.strengths.slice(0, 3).map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {qualityAnalysis.weaknesses && qualityAnalysis.weaknesses.length > 0 && (
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#dc2626',
                  margin: '0 0 12px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  ⚠️ {t('socialMedia.areasForImprovement')}
                </h4>
                <ul style={{
                  margin: '0',
                  paddingLeft: '20px',
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: '1.5'
                }}>
                  {qualityAnalysis.weaknesses.slice(0, 3).map((weakness, index) => (
                    <li key={index}>{weakness}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {qualityAnalysis.suggestions && qualityAnalysis.suggestions.length > 0 && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
              borderRadius: '8px',
              border: '1px solid #bfdbfe'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1e40af',
                margin: '0 0 12px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                💡 {t('socialMedia.recommendations')}
              </h4>
              <ul style={{
                margin: '0',
                paddingLeft: '20px',
                fontSize: '14px',
                color: '#1e293b',
                lineHeight: '1.6'
              }}>
                {qualityAnalysis.suggestions.slice(0, 4).map((suggestion, index) => (
                  <li key={index} style={{ marginBottom: '6px' }}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Platform-Specific Tips */}
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '8px',
            border: '1px solid #f59e0b'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#92400e',
              margin: '0 0 8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              🎯 {t('socialMedia.platformTips')}
            </h4>
            <div style={{
              fontSize: '13px',
              color: '#92400e',
              lineHeight: '1.5'
            }}>
              {platform === 'instagram' && 'Use relevant hashtags and emojis for better discoverability. Share personal stories to build authentic connections.'}
              {platform === 'facebook' && 'Focus on community engagement. Ask questions to encourage comments and discussions.'}
              {platform === 'twitter' && 'Keep your message concise and use trending hashtags to join relevant conversations.'}
              {platform === 'linkedin' && 'Share professional insights and use industry-specific hashtags for better visibility.'}
              {platform === 'tiktok' && 'Use trending hashtags and sounds. Keep your caption short and engaging.'}
              {platform === 'youtube' && 'Include timestamps for longer videos and add relevant links in your description.'}
            </div>
          </div>
        </div>
      )}

      {/* CSS for loading spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default QualityAnalyzer; 