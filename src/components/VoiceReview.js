import React, { useState } from 'react';
import VoiceRecognition from './VoiceRecognition';
import VoiceAnalysis from './VoiceAnalysis';
import VoiceService from '../services/VoiceService';
import './VoiceReview.css';
import { useTranslation } from 'react-i18next';

const VoiceReview = () => {
    const [transcript, setTranscript] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState('');
    const { t } = useTranslation();

    const handleTranscript = (newTranscript) => {
        setTranscript(newTranscript);
        setAnalysis(null); // Clear previous analysis when new transcript is added
        setError('');
    };

    const handleAnalyzeVoice = async () => {
        if (!transcript.trim()) {
            setError(t('voiceReview.pleaseRecordSomeVoiceInputFirst'));
            return;
        }

        if (!apiKey.trim()) {
            setError(t('voiceReview.pleaseEnterYourNVIDIAAPIKey'));
            return;
        }

        setIsAnalyzing(true);
        setError('');

        try {
            console.log('Analyzing voice input:', transcript.substring(0, 100) + '...');
            const analysisResult = await VoiceService.getVoiceAnalysis(transcript, apiKey);
            setAnalysis(analysisResult);
            
            if (!analysisResult.success) {
                setError(analysisResult.error || t('voiceReview.analysisFailed'));
            }
        } catch (error) {
            console.error('Voice analysis error:', error);
            setError(error.message || t('voiceReview.failedToAnalyzeVoiceInput'));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGenerateReview = async (transcript, analysisData, reviewType) => {
        if (!apiKey.trim()) {
            throw new Error(t('voiceReview.pleaseEnterYourNVIDIAAPIKey'));
        }

        try {
            const review = await VoiceService.generateReview(transcript, analysisData, apiKey, reviewType);
            return review;
        } catch (error) {
            console.error('Review generation error:', error);
            throw error;
        }
    };

    const handleSaveAnalysis = (analysisData) => {
        // Save analysis to localStorage or send to backend
        const savedAnalyses = JSON.parse(localStorage.getItem('voiceAnalyses') || '[]');
        savedAnalyses.push({
            ...analysisData,
            timestamp: new Date().toISOString(),
            transcript
        });
        localStorage.setItem('voiceAnalyses', JSON.stringify(savedAnalyses));
        
        // Show success message
        alert(t('voiceReview.analysisSavedSuccessfully'));
    };

    const clearAll = () => {
        setTranscript('');
        setAnalysis(null);
        setError('');
    };

    return (
        <div className="voice-review-container">
            <div className="voice-review-header">
                <h2>{t('voiceReview.title')}</h2>
                <p>{t('voiceReview.recordAndGetAIPoweredAnalysisAndReviewGeneration')}</p>
            </div>

            <div className="voice-review-content">
                {/* API Key Section */}
                <div className="api-key-section">
                    <label htmlFor="voiceApiKey">{t('voiceReview.nVIDIAApiKey')}:</label>
                    <input
                        type="password"
                        id="voiceApiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={t('voiceReview.enterYourNVIDIAAPIKey')}
                        className="api-key-input"
                    />
                    <small>
                        {t('voiceReview.getYourAPIKeyFrom')}
                        <a 
                            href="https://integrate.api.nvidia.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            {t('voiceReview.nVIDIAPortal')}
                        </a>
                    </small>
                </div>

                {/* Voice Recognition Section */}
                <div className="voice-section">
                    <h3>{t('voiceReview.voiceInput')}</h3>
                    <VoiceRecognition 
                        onTranscript={handleTranscript}
                        placeholder={t('voiceReview.tapToStartSpeakingAndRecordYourReview')}
                    />
                </div>

                {/* Analysis Controls */}
                {transcript && (
                    <div className="analysis-controls">
                        <button 
                            onClick={handleAnalyzeVoice}
                            disabled={isAnalyzing || !apiKey.trim()}
                            className="analyze-btn"
                        >
                            {isAnalyzing ? '🤖 Analyzing...' : '🔍 Analyze Voice'}
                        </button>
                        <button 
                            onClick={clearAll}
                            className="clear-btn"
                        >
                            🗑️ {t('voiceReview.clearAll')}
                        </button>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="error-message">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}

                {/* Voice Analysis Section */}
                {analysis && (
                    <div className="analysis-section">
                        <h3>{t('voiceReview.aiAnalysis')}</h3>
                        <VoiceAnalysis 
                            analysis={analysis}
                            onGenerateReview={handleGenerateReview}
                            onSaveAnalysis={handleSaveAnalysis}
                        />
                    </div>
                )}

                {/* Instructions */}
                <div className="instructions">
                    <h4>{t('voiceReview.howToUse')}:</h4>
                    <ol>
                        <li>{t('voiceReview.enterYourNVIDIAAPIKey')}</li>
                        <li>{t('voiceReview.clickTheMicrophoneButtonToStartRecording')}</li>
                        <li>{t('voiceReview.speakYourReviewFeedbackOrThoughts')}</li>
                        <li>{t('voiceReview.clickAnalyzeVoiceToGetAIPoweredInsights')}</li>
                        <li>{t('voiceReview.generateProfessionalReviewsFromYourVoiceInput')}</li>
                    </ol>
                    
                    <div className="tips">
                        <h5>{t('voiceReview.tipsForBetterResults')}:</h5>
                        <ul>
                            <li>{t('voiceReview.speakClearlyAndAtANormalPace')}</li>
                            <li>{t('voiceReview.useAQuietEnvironmentForBetterRecognition')}</li>
                            <li>{t('voiceReview.beSpecificAboutWhatYoureReviewing')}</li>
                            <li>{t('voiceReview.includeBothPositiveAndNegativePoints')}</li>
                            <li>{t('voiceReview.mentionSpecificFeaturesOrExperiences')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceReview; 