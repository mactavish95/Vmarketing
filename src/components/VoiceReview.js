import React, { useState } from 'react';
import VoiceRecognition from './VoiceRecognition';
import VoiceAnalysis from './VoiceAnalysis';
import VoiceService from '../services/VoiceService';
import './VoiceReview.css';

const VoiceReview = () => {
    const [transcript, setTranscript] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState('');

    const handleTranscript = (newTranscript) => {
        setTranscript(newTranscript);
        setAnalysis(null); // Clear previous analysis when new transcript is added
        setError('');
    };

    const handleAnalyzeVoice = async () => {
        if (!transcript.trim()) {
            setError('Please record some voice input first');
            return;
        }

        if (!apiKey.trim()) {
            setError('Please enter your NVIDIA API key');
            return;
        }

        setIsAnalyzing(true);
        setError('');

        try {
            console.log('Analyzing voice input:', transcript.substring(0, 100) + '...');
            const analysisResult = await VoiceService.getVoiceAnalysis(transcript, apiKey);
            setAnalysis(analysisResult);
            
            if (!analysisResult.success) {
                setError(analysisResult.error || 'Analysis failed');
            }
        } catch (error) {
            console.error('Voice analysis error:', error);
            setError(error.message || 'Failed to analyze voice input');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleGenerateReview = async (transcript, analysisData, reviewType) => {
        if (!apiKey.trim()) {
            throw new Error('Please enter your NVIDIA API key');
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
        alert('Analysis saved successfully!');
    };

    const clearAll = () => {
        setTranscript('');
        setAnalysis(null);
        setError('');
    };

    return (
        <div className="voice-review-container">
            <div className="voice-review-header">
                <h2>🎤 Voice Review Generator</h2>
                <p>Record your voice and get AI-powered analysis and review generation</p>
            </div>

            <div className="voice-review-content">
                {/* API Key Section */}
                <div className="api-key-section">
                    <label htmlFor="voiceApiKey">NVIDIA API Key:</label>
                    <input
                        type="password"
                        id="voiceApiKey"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your NVIDIA API key"
                        className="api-key-input"
                    />
                    <small>
                        Get your API key from{' '}
                        <a 
                            href="https://integrate.api.nvidia.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            NVIDIA API Portal
                        </a>
                    </small>
                </div>

                {/* Voice Recognition Section */}
                <div className="voice-section">
                    <h3>🎤 Voice Input</h3>
                    <VoiceRecognition 
                        onTranscript={handleTranscript}
                        placeholder="Tap to start speaking and record your review..."
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
                            🗑️ Clear All
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
                        <h3>📊 AI Analysis</h3>
                        <VoiceAnalysis 
                            analysis={analysis}
                            onGenerateReview={handleGenerateReview}
                            onSaveAnalysis={handleSaveAnalysis}
                        />
                    </div>
                )}

                {/* Instructions */}
                <div className="instructions">
                    <h4>💡 How to Use:</h4>
                    <ol>
                        <li>Enter your NVIDIA API key above</li>
                        <li>Click the microphone button to start recording</li>
                        <li>Speak your review, feedback, or thoughts</li>
                        <li>Click "Analyze Voice" to get AI-powered insights</li>
                        <li>Generate professional reviews from your voice input</li>
                    </ol>
                    
                    <div className="tips">
                        <h5>🎯 Tips for Better Results:</h5>
                        <ul>
                            <li>Speak clearly and at a normal pace</li>
                            <li>Use a quiet environment for better recognition</li>
                            <li>Be specific about what you're reviewing</li>
                            <li>Include both positive and negative points</li>
                            <li>Mention specific features or experiences</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceReview; 