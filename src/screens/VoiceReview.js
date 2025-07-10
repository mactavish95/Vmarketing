import React, { useState } from 'react';
import VoiceRecognition from '../components/VoiceRecognition';
import VoiceAnalysis from '../components/VoiceAnalysis';
import LocationAttachment from '../components/LocationAttachment';
import VoiceService from '../services/VoiceService';
import './VoiceReview.css';

const VoiceReview = () => {
    const [transcript, setTranscript] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [reviewType, setReviewType] = useState('restaurant');
    const [rating, setRating] = useState(5);
    const [generatedReview, setGeneratedReview] = useState('');
    const [savedReviews, setSavedReviews] = useState([]);
    const [locationData, setLocationData] = useState(null);
    const [error, setError] = useState('');
    const [ratingAutoAdjusted, setRatingAutoAdjusted] = useState(false);

    const handleTranscript = (newTranscript) => {
        setTranscript(newTranscript);
        setAnalysis(null); // Clear previous analysis when new transcript is added
        setError('');
        setRatingAutoAdjusted(false); // Reset auto-adjusted flag for new input
    };

    // Auto-adjust rating based on voice content and sentiment
    const autoAdjustRating = (transcript, analysisData) => {
        if (!transcript || !analysisData) return;
        
        const { sentiment, confidence, keyPoints, summary } = analysisData;
        let suggestedRating = 3; // Default neutral rating
        
        // Base rating on sentiment
        switch (sentiment) {
            case 'positive':
                suggestedRating = 4;
                break;
            case 'negative':
                suggestedRating = 2;
                break;
            case 'neutral':
                suggestedRating = 3;
                break;
        }
        
        // Adjust based on confidence
        if (confidence >= 0.9) {
            // High confidence - keep the sentiment-based rating
        } else if (confidence >= 0.7) {
            // Medium confidence - slightly adjust toward neutral
            if (suggestedRating > 3) suggestedRating--;
            else if (suggestedRating < 3) suggestedRating++;
        } else {
            // Low confidence - default to neutral
            suggestedRating = 3;
        }
        
        // Analyze key points for additional context
        if (keyPoints && keyPoints.length > 0) {
            const positiveKeywords = ['amazing', 'excellent', 'great', 'good', 'love', 'perfect', 'best', 'fantastic', 'wonderful', 'outstanding'];
            const negativeKeywords = ['terrible', 'awful', 'bad', 'horrible', 'worst', 'disappointing', 'poor', 'mediocre', 'overpriced', 'scam'];
            
            const text = transcript.toLowerCase() + ' ' + keyPoints.join(' ').toLowerCase();
            
            const positiveCount = positiveKeywords.filter(word => text.includes(word)).length;
            const negativeCount = negativeKeywords.filter(word => text.includes(word)).length;
            
            if (positiveCount > negativeCount && positiveCount >= 2) {
                suggestedRating = Math.min(5, suggestedRating + 1);
            } else if (negativeCount > positiveCount && negativeCount >= 2) {
                suggestedRating = Math.max(1, suggestedRating - 1);
            }
        }
        
        // Special cases based on content
        const text = transcript.toLowerCase();
        if (text.includes('overpriced') || text.includes('scam') || text.includes('rip off')) {
            suggestedRating = Math.max(1, suggestedRating - 1);
        }
        if (text.includes('worth it') || text.includes('recommend') || text.includes('love it')) {
            suggestedRating = Math.min(5, suggestedRating + 1);
        }
        
        return suggestedRating;
    };

    const analyzeVoiceInput = async (inputTranscript) => {
        if (!inputTranscript || inputTranscript.trim().length === 0) {
            setError('Please record some voice input first');
            return;
        }

        // API key is now handled securely on the server

        setIsAnalyzing(true);
        setError('');

        try {
            console.log('Analyzing voice input:', inputTranscript.substring(0, 100) + '...');
            const analysisResult = await VoiceService.getVoiceAnalysis(inputTranscript);
            
            // Add the original transcript to the analysis result
            const analysisWithTranscript = {
                ...analysisResult,
                transcript: inputTranscript
            };
            
            setAnalysis(analysisWithTranscript);
            
            // Auto-adjust rating based on analysis
            if (analysisResult.success) {
                const suggestedRating = autoAdjustRating(inputTranscript, analysisResult);
                if (suggestedRating && suggestedRating !== rating) {
                    setRating(suggestedRating);
                    console.log(`Auto-adjusted rating from ${rating} to ${suggestedRating} based on voice content`);
                    setRatingAutoAdjusted(true);
                }
            }
            
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

    const handleGenerateReview = async (inputTranscript, analysisData, reviewTypeParam) => {
        // API key is now handled securely on the server

        try {
            // Combine review type from component state and parameter
            const finalReviewType = reviewTypeParam || reviewType;
            
            console.log('Generating review with:', {
                transcript: inputTranscript ? inputTranscript.substring(0, 100) + '...' : 'undefined',
                reviewType: finalReviewType,
                rating,
                hasLocation: !!locationData
            });
            
            // Validate inputs before making the API call
            if (!inputTranscript || inputTranscript.trim().length === 0) {
                throw new Error('No transcript provided for review generation');
            }
            
            if (!analysisData) {
                throw new Error('No analysis data provided for review generation');
            }
            
            const review = await VoiceService.generateReview(inputTranscript, analysisData, finalReviewType);
            
            let reviewText = review;
            
            // Add location information to the review if available
            if (locationData) {
                reviewText += `\n\n📍 Location: `;
                if (locationData.address) {
                    reviewText += locationData.address;
                } else {
                    reviewText += `${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}`;
                }
                if (locationData.accuracy) {
                    reviewText += ` (Accuracy: ±${Math.round(locationData.accuracy)}m)`;
                }
            }

            // Add rating if specified
            if (rating && rating > 0) {
                reviewText += `\n\n⭐ Rating: ${rating}/5`;
            }
            
            setGeneratedReview(reviewText);
            
            // Auto-save the generated review
            const reviewData = {
                id: Date.now(),
                type: finalReviewType,
                rating,
                review: reviewText,
                transcript: inputTranscript,
                analysis: analysisData,
                location: locationData,
                timestamp: new Date().toISOString()
            };
            
            console.log('Saving review data:', reviewData);
            
            setSavedReviews(prev => [reviewData, ...prev]);
            
            // Save to localStorage
            const existingReviews = JSON.parse(localStorage.getItem('voiceReviews') || '[]');
            const updatedReviews = [reviewData, ...existingReviews];
            localStorage.setItem('voiceReviews', JSON.stringify(updatedReviews));
            
            console.log('Saved to localStorage. Total voice reviews:', updatedReviews.length);
            console.log('Current localStorage voiceReviews:', localStorage.getItem('voiceReviews'));
            
            // Show success message
            alert('✅ Review generated and saved successfully! Check the Review History to see your saved reviews.');
            
            return reviewText;
        } catch (error) {
            console.error('Review generation error:', error);
            throw error;
        }
    };

    const handleSaveAnalysis = (analysisData) => {
        const analysisRecord = {
            id: Date.now(),
            analysis: analysisData,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        const existingAnalyses = JSON.parse(localStorage.getItem('voiceAnalyses') || '[]');
        localStorage.setItem('voiceAnalyses', JSON.stringify([analysisRecord, ...existingAnalyses]));
        
        alert('Analysis saved successfully!');
    };

    const clearAll = () => {
        setTranscript('');
        setAnalysis(null);
        setGeneratedReview('');
        setLocationData(null);
        setError('');
        setRatingAutoAdjusted(false);
    };

    const handleLocationChange = (location) => {
        setLocationData(location);
    };

    return (
        <div className="voice-review">
            <div className="voice-review-container">
                <div className="voice-review-header">
                    <h1>🎤 AI Voice Review Generator</h1>
                    <p>Speak your experience and let NVIDIA Llama AI analyze and generate a professional review</p>
                </div>

                <div className="voice-review-content">
                    {/* API Key is now handled securely on the server */}

                    <div className="voice-input-section">
                        <h2>🎤 Voice Input</h2>
                        <div className="voice-input-header">
                            <div className="review-type-selector">
                                <label htmlFor="reviewType">Review Type:</label>
                                <select 
                                    id="reviewType"
                                    value={reviewType} 
                                    onChange={(e) => setReviewType(e.target.value)}
                                    className="review-type-input"
                                >
                                    <option value="restaurant">🍽️ Restaurant</option>
                                    <option value="hotel">🏨 Hotel</option>
                                    <option value="product">📱 Product</option>
                                    <option value="service">🛠️ Service</option>
                                    <option value="experience">🎯 Experience</option>
                                    <option value="app">💻 App/Software</option>
                                    <option value="place">📍 Place/Location</option>
                                    <option value="general">📝 General</option>
                                </select>
                            </div>
                        </div>
                        <VoiceRecognition
                            onTranscript={handleTranscript}
                            placeholder="Click the microphone and speak about your experience..."
                            enableLLMEnhancement={true}
                        />
                        
                        {transcript && (
                            <div className="transcript-display">
                                <h3>Your Voice Input:</h3>
                                <p>{transcript}</p>
                                <div className="transcript-actions">
                                    <button 
                                        onClick={() => analyzeVoiceInput(transcript)} 
                                        disabled={isAnalyzing}
                                        className="analyze-btn"
                                    >
                                        {isAnalyzing ? '🤖 Analyzing...' : '🔍 Analyze Voice'}
                                    </button>
                                    <button onClick={clearAll} className="clear-btn">
                                        🗑️ Clear All
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Rating Section */}
                    <div className="rating-section">
                        <h2>⭐ Rating</h2>
                        <div className="rating-container">
                            <div className="setting-group">
                                <label htmlFor="rating">Rating: {rating}/5</label>
                                <div className="rating-input">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            className={`star-btn ${star <= rating ? 'active' : ''}`}
                                            onClick={() => {
                                                setRating(star);
                                                setRatingAutoAdjusted(false); // Clear auto-adjust flag when manually changed
                                            }}
                                        >
                                            ⭐
                                        </button>
                                    ))}
                                    {ratingAutoAdjusted && (
                                        <span className="auto-adjusted-badge">
                                            🤖 AI Suggested
                                        </span>
                                    )}
                                </div>
                                {ratingAutoAdjusted && (
                                    <small className="auto-adjusted-note">
                                        Rating was automatically adjusted based on your voice content. You can change it manually.
                                    </small>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="location-section">
                        <LocationAttachment 
                            onLocationChange={handleLocationChange}
                            initialLocation={locationData}
                            transcript={transcript}
                        />
                    </div>

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
                            <h2>📊 AI Analysis</h2>
                            <VoiceAnalysis 
                                analysis={analysis}
                                onGenerateReview={handleGenerateReview}
                                onSaveAnalysis={handleSaveAnalysis}
                                parentReviewType={reviewType}
                            />
                        </div>
                    )}

                    {/* Generated Review Display */}
                    {generatedReview && (
                        <div className="generated-review-section">
                            <h2>📝 Generated Review</h2>
                            <div className="review-content">
                                <p>{generatedReview}</p>
                            </div>
                            <div className="review-actions">
                                <button 
                                    onClick={() => navigator.clipboard.writeText(generatedReview)}
                                    className="copy-btn"
                                >
                                    📋 Copy Review
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="instructions">
                        <h3>💡 How to Use:</h3>
                        <ol>
                            <li>Click the microphone to start recording</li>
                            <li>Speak about your experience clearly</li>
                            <li>Select the review type and rating</li>
                            <li>Optionally attach your location</li>
                            <li>Click "Analyze Voice" to get AI insights</li>
                            <li>Generate professional reviews from your voice input</li>
                        </ol>
                        
                        <div className="tips">
                            <h4>🎯 Tips for Better Results:</h4>
                            <ul>
                                <li>Speak clearly and at a normal pace</li>
                                <li>Use a quiet environment for better recognition</li>
                                <li>Be specific about what you're reviewing</li>
                                <li>Include both positive and negative points</li>
                                <li>Mention specific features or experiences</li>
                                <li>Describe the atmosphere, service, or quality</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceReview; 