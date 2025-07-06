import React, { useState, useEffect } from 'react';
import './VoiceAnalysis.css';
import { useTranslation } from 'react-i18next';

const VoiceAnalysis = ({ analysis, onGenerateReview, onSaveAnalysis, parentReviewType = 'general' }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isGeneratingReview, setIsGeneratingReview] = useState(false);
    const [generatedReview, setGeneratedReview] = useState('');
    const [reviewType, setReviewType] = useState(parentReviewType);
    const { t } = useTranslation();

    // Update reviewType when parentReviewType changes
    useEffect(() => {
        setReviewType(parentReviewType);
    }, [parentReviewType]);

    if (!analysis || !analysis.success) {
        return (
            <div className="voice-analysis-container">
                <div className="analysis-error">
                    <div className="error-icon">⚠️</div>
                    <h3>{t('voiceAnalysis.analysisFailed')}</h3>
                    <p>{analysis?.error || 'Unable to analyze voice input'}</p>
                </div>
            </div>
        );
    }

    const { analysis: data, provider, transcript: originalTranscript } = analysis;
    const {
        sentiment,
        confidence,
        keyPoints,
        topics,
        suggestions,
        tone,
        actionItems,
        summary,
        wordCount,
        speakingPace
    } = data;

    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case 'positive': return '#28a745';
            case 'negative': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.8) return '#28a745';
        if (confidence >= 0.6) return '#ffc107';
        return '#dc3545';
    };

    const handleGenerateReview = async () => {
        if (onGenerateReview) {
            setIsGeneratingReview(true);
            try {
                console.log('VoiceAnalysis: Generating review with type:', reviewType);
                console.log('VoiceAnalysis: Original transcript:', originalTranscript);
                console.log('VoiceAnalysis: Analysis data:', data);
                console.log('VoiceAnalysis: Full analysis object:', analysis);
                
                // Make sure we have a valid transcript
                if (!originalTranscript || originalTranscript.trim().length === 0) {
                    throw new Error('No transcript available for review generation');
                }
                
                const review = await onGenerateReview(originalTranscript, data, reviewType);
                setGeneratedReview(review);
            } catch (error) {
                console.error('VoiceAnalysis: Review generation failed:', error);
                console.error('VoiceAnalysis: Error details:', {
                    message: error.message,
                    stack: error.stack
                });
                // Don't re-throw the error, just log it
            } finally {
                setIsGeneratingReview(false);
            }
        }
    };

    const handleSaveAnalysis = () => {
        if (onSaveAnalysis) {
            onSaveAnalysis(analysis);
        }
    };

    return (
        <div className="voice-analysis-container">
            <div className="analysis-header">
                <div className="provider-badge">
                    <span className="provider-icon">🤖</span>
                    {provider}
                </div>
                <div className="analysis-actions">
                    <button 
                        className="action-btn expand-btn"
                        onClick={() => setIsExpanded(!isExpanded)}
                        title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                        {isExpanded ? '📁' : '📂'}
                    </button>
                    <button 
                        className="action-btn save-btn"
                        onClick={handleSaveAnalysis}
                        title="Save Analysis"
                    >
                        💾
                    </button>
                </div>
            </div>

            <div className="analysis-summary">
                <div className="sentiment-section">
                    <div className="sentiment-indicator" style={{ backgroundColor: getSentimentColor(sentiment) }}>
                        <span className="sentiment-emoji">
                            {sentiment === 'positive' ? '😊' : sentiment === 'negative' ? '😞' : '😐'}
                        </span>
                        <span className="sentiment-text">{sentiment.toUpperCase()}</span>
                    </div>
                    <div className="confidence-meter">
                        <div className="confidence-label">{t('voiceAnalysis.confidence')}</div>
                        <div className="confidence-bar">
                            <div 
                                className="confidence-fill" 
                                style={{ 
                                    width: `${confidence * 100}%`,
                                    backgroundColor: getConfidenceColor(confidence)
                                }}
                            ></div>
                        </div>
                        <div className="confidence-value">{Math.round(confidence * 100)}%</div>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-label">{t('voiceAnalysis.words')}</div>
                        <div className="stat-value">{wordCount}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">{t('voiceAnalysis.pace')}</div>
                        <div className="stat-value">{speakingPace}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">{t('voiceAnalysis.tone')}</div>
                        <div className="stat-value">{tone}</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">{t('voiceAnalysis.topics')}</div>
                        <div className="stat-value">{topics?.length || 0}</div>
                    </div>
                </div>
            </div>

            <div className="analysis-content">
                <div className="content-section">
                    <h3>{t('voiceAnalysis.summary')}</h3>
                    <p className="summary-text">{summary}</p>
                </div>

                {keyPoints && keyPoints.length > 0 && (
                    <div className="content-section">
                        <h3>{t('voiceAnalysis.keyPoints')}</h3>
                        <ul className="key-points-list">
                            {keyPoints.map((point, index) => (
                                <li key={index} className="key-point-item">
                                    <span className="point-bullet">•</span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {topics && topics.length > 0 && (
                    <div className="content-section">
                        <h3>{t('voiceAnalysis.topics')}</h3>
                        <div className="topics-tags">
                            {topics.map((topic, index) => (
                                <span key={index} className="topic-tag">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {isExpanded && (
                    <>
                        {suggestions && suggestions.length > 0 && (
                            <div className="content-section">
                                <h3>{t('voiceAnalysis.suggestions')}</h3>
                                <ul className="suggestions-list">
                                    {suggestions.map((suggestion, index) => (
                                        <li key={index} className="suggestion-item">
                                            <span className="suggestion-icon">💡</span>
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {actionItems && actionItems.length > 0 && (
                            <div className="content-section">
                                <h3>{t('voiceAnalysis.actionItems')}</h3>
                                <ul className="action-items-list">
                                    {actionItems.map((item, index) => (
                                        <li key={index} className="action-item">
                                            <span className="action-icon">✅</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="content-section">
                            <h3>{t('voiceAnalysis.originalTranscript')}</h3>
                            <div className="transcript-display">
                                <p>{originalTranscript}</p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Review Generation Section */}
            <div className="review-generation-section">
                <div className="review-controls">
                    <select 
                        value={reviewType} 
                        onChange={(e) => setReviewType(e.target.value)}
                        className="review-type-select"
                    >
                        <option value="restaurant">Restaurant</option>
                        <option value="hotel">Hotel</option>
                        <option value="product">Product</option>
                        <option value="service">Service</option>
                        <option value="experience">Experience</option>
                        <option value="app">App/Software</option>
                        <option value="place">Place/Location</option>
                        <option value="general">General</option>
                    </select>
                    <button 
                        onClick={handleGenerateReview}
                        disabled={isGeneratingReview}
                        className="generate-review-btn"
                    >
                        {isGeneratingReview ? '🤖 Generating...' : '📝 Generate Review'}
                    </button>
                </div>

                {generatedReview && (
                    <div className="generated-review">
                        <h3>{t('voiceAnalysis.generatedReview')}</h3>
                        <div className="review-content">
                            <p>{generatedReview}</p>
                        </div>
                        <button 
                            onClick={() => navigator.clipboard.writeText(generatedReview)}
                            className="copy-review-btn"
                        >
                            📋 Copy Review
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VoiceAnalysis; 