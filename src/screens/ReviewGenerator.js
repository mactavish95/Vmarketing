import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import VoiceAnalysis from '../components/VoiceAnalysis';
import VoiceRecognition from '../components/VoiceRecognition';
import LocationAttachment from '../components/LocationAttachment';
import llmService from '../services/llmService';
import apiConfig from '../config/api';
import './ReviewGenerator.css';
import { useTranslation } from 'react-i18next';

const ReviewGenerator = ({ history }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [reviewData, setReviewData] = useState({
        reviewType: 'restaurant',
        rating: 5,
        tone: 'professional',
        pros: '',
        cons: '',
        experience: ''
    });
    const [generatedReview, setGeneratedReview] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [locationData, setLocationData] = useState(null);
    const [ratingAutoAdjusted, setRatingAutoAdjusted] = useState(false);
    const [showQuickStart, setShowQuickStart] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [showVoiceInput, setShowVoiceInput] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState('');

    const { t } = useTranslation();
    const containerRef = useRef(null);

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const reviewTypes = [
        { value: 'restaurant', label: 'Restaurant', icon: '🍽️', color: '#ff6b6b', description: 'Food & dining experiences' },
        { value: 'hotel', label: 'Hotel', icon: '🏨', color: '#20c997', description: 'Accommodation & hospitality' },
        { value: 'product', label: 'Product', icon: '📱', color: '#f7b731', description: 'Physical goods & items' },
        { value: 'service', label: 'Service', icon: '🛠️', color: '#4b7bec', description: 'Professional services' },
        { value: 'experience', label: 'Experience', icon: '🎯', color: '#a55eea', description: 'Events & activities' },
        { value: 'app', label: 'App/Software', icon: '💻', color: '#45aaf2', description: 'Digital products' },
        { value: 'place', label: 'Place/Location', icon: '📍', color: '#26de81', description: 'Venues & destinations' },
        { value: 'general', label: 'General', icon: '📝', color: '#778ca3', description: 'Other reviews' }
    ];

    const tones = [
        { value: 'professional', label: 'Professional', icon: '👔', color: '#667eea', description: 'Formal & business-like' },
        { value: 'casual', label: 'Casual', icon: '😊', color: '#ffa726', description: 'Friendly & relaxed' },
        { value: 'enthusiastic', label: 'Enthusiastic', icon: '🎉', color: '#ff7043', description: 'Excited & positive' },
        { value: 'critical', label: 'Critical', icon: '🤔', color: '#ef5350', description: 'Analytical & detailed' },
        { value: 'balanced', label: 'Balanced', icon: '⚖️', color: '#66bb6a', description: 'Fair & objective' }
    ];

    const steps = [
        { id: 0, title: 'Choose Type', icon: '🎯', description: 'Select what you\'re reviewing' },
        { id: 1, title: 'Set Tone', icon: '🎭', description: 'Choose your writing style' },
        { id: 2, title: 'Add Details', icon: '✍️', description: 'Share your experience' },
        { id: 3, title: 'Generate', icon: '✨', description: 'Create your review' }
    ];

    const handleInputChange = (field, value) => {
        setReviewData(prev => {
            const updatedData = {
                ...prev,
                [field]: value
            };
            
            // Auto-adjust rating based on content for text fields
            if (field === 'pros' || field === 'cons' || field === 'experience') {
                const allContent = [
                    updatedData.pros,
                    updatedData.cons, 
                    updatedData.experience
                ].filter(Boolean).join(' ');
                
                const suggestedRating = autoAdjustRating(allContent);
                if (suggestedRating && suggestedRating !== updatedData.rating) {
                    updatedData.rating = suggestedRating;
                    setRatingAutoAdjusted(true);
                }
            }
            
            // Clear auto-adjusted flag when user manually changes rating
            if (field === 'rating') {
                setRatingAutoAdjusted(false);
            }
            
            return updatedData;
        });
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            // Scroll to top on mobile
            if (isMobile && containerRef.current) {
                containerRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            if (isMobile && containerRef.current) {
                containerRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const goToStep = (step) => {
        setCurrentStep(step);
        if (isMobile && containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const generateReview = async () => {
        // Validate input
        const hasContent = reviewData.pros.trim() || reviewData.cons.trim() || reviewData.experience.trim();
        if (!hasContent) {
            alert('Please provide some content in at least one field (pros, cons, or experience) before generating a review.');
            return;
        }

        setIsGenerating(true);
        
        try {
            const review = createReview(reviewData, locationData);
            setGeneratedReview(review);
            
            // Save review to localStorage for history
            const reviewHistory = JSON.parse(localStorage.getItem('reviewHistory') || '[]');
            const newReview = {
                id: Date.now(),
                reviewType: reviewData.reviewType,
                itemName: `${reviewData.reviewType.charAt(0).toUpperCase() + reviewData.reviewType.slice(1)} Review`,
                category: reviewData.reviewType,
                rating: reviewData.rating,
                tone: reviewData.tone,
                pros: reviewData.pros,
                cons: reviewData.cons,
                experience: reviewData.experience,
                location: locationData,
                review: review,
                timestamp: new Date().toISOString()
            };
            reviewHistory.unshift(newReview);
            localStorage.setItem('reviewHistory', JSON.stringify(reviewHistory.slice(0, 50)));
            
            // Auto-analyze the generated review
            setTimeout(() => {
                analyzeReview(review);
            }, 500);
        } catch (error) {
            console.error('Review generation error:', error);
            alert('Failed to generate review. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const analyzeReview = async (reviewText) => {
        if (!reviewText || reviewText.trim().length === 0) {
            return;
        }

        setIsAnalyzing(true);
        try {
            const result = await llmService.analyzeVoiceInput(reviewText, {
                reviewType: reviewData.reviewType,
                rating: reviewData.rating,
                tone: reviewData.tone,
                isGeneratedReview: true,
                timestamp: new Date().toISOString()
            });
            
            if (result.success) {
                setAnalysis(result);
                setShowAnalysis(true);
            } else {
                console.warn('Analysis returned with errors:', result.error);
                setAnalysis({
                    success: false,
                    error: result.error || 'Analysis failed'
                });
            }
        } catch (error) {
            console.error('Review analysis failed:', error);
            setAnalysis({
                success: false,
                error: error.message || 'Analysis failed'
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const createReview = (data, location = null) => {
        const { reviewType, rating, tone, pros, cons, experience } = data;
        
        // Define different sentence structures and formats for different review types
        const reviewFormats = {
            restaurant: {
                openings: {
                    positive: [
                        "Just had dinner at this place and it was absolutely fantastic!",
                        "Visited this restaurant recently and wow, what an experience!",
                        "Tried this spot for the first time and I'm already planning my next visit.",
                        "Went here for a meal and left completely satisfied.",
                        "Stopped by this restaurant and was blown away by the quality."
                    ],
                    negative: [
                        "Unfortunately, this restaurant didn't live up to expectations.",
                        "Had high hopes for this place, but it fell short.",
                        "Visited this restaurant and left disappointed.",
                        "Tried this spot and it wasn't what I was looking for.",
                        "Went here expecting great food, but that wasn't the case."
                    ],
                    neutral: [
                        "This restaurant was okay, nothing special.",
                        "Had a decent meal here, but it wasn't memorable.",
                        "Visited this place and it was just average.",
                        "Tried this restaurant and it was fine, but not great.",
                        "Went here and it was a mixed experience."
                    ]
                },
                prosFormat: "What really stood out was",
                consFormat: "Areas that could use improvement include",
                experienceFormat: "The overall dining experience was"
            },
            hotel: {
                openings: {
                    positive: [
                        "Stayed at this hotel and it exceeded all expectations!",
                        "Booked this accommodation and was thoroughly impressed.",
                        "Checked into this hotel and immediately felt at home.",
                        "Spent time at this property and it was exceptional.",
                        "Chose this hotel and it was the perfect decision."
                    ],
                    negative: [
                        "Unfortunately, this hotel didn't meet our expectations.",
                        "Booked this accommodation but was disappointed.",
                        "Stayed here and it wasn't what we hoped for.",
                        "Checked into this hotel and found several issues.",
                        "Chose this property but wouldn't recommend it."
                    ],
                    neutral: [
                        "This hotel was adequate for our needs.",
                        "Stayed here and it was okay, nothing special.",
                        "Booked this accommodation and it was fine.",
                        "Checked into this hotel and it was average.",
                        "Spent time here and it was acceptable."
                    ]
                },
                prosFormat: "The highlights of our stay included",
                consFormat: "Some areas that need attention are",
                experienceFormat: "Our overall experience was"
            },
            product: {
                openings: {
                    positive: [
                        "Purchased this product and it's been amazing!",
                        "Bought this item and it exceeded expectations.",
                        "Tried this product and I'm thoroughly impressed.",
                        "Invested in this and it was worth every penny.",
                        "Got this product and it's been a game-changer."
                    ],
                    negative: [
                        "Unfortunately, this product didn't live up to the hype.",
                        "Bought this item but was disappointed.",
                        "Tried this product and it fell short.",
                        "Invested in this but it wasn't worth it.",
                        "Got this product and it's been problematic."
                    ],
                    neutral: [
                        "This product is okay, nothing special.",
                        "Bought this item and it's fine.",
                        "Tried this product and it's adequate.",
                        "Invested in this and it's acceptable.",
                        "Got this product and it's decent."
                    ]
                },
                prosFormat: "What I love about this product is",
                consFormat: "Some drawbacks I've noticed are",
                experienceFormat: "My overall experience with this product has been"
            },
            service: {
                openings: {
                    positive: [
                        "Used this service and it was excellent!",
                        "Hired this company and they delivered beyond expectations.",
                        "Tried this service and was thoroughly impressed.",
                        "Engaged with this provider and it was outstanding.",
                        "Worked with this service and it was exceptional."
                    ],
                    negative: [
                        "Unfortunately, this service didn't meet expectations.",
                        "Hired this company but was disappointed.",
                        "Tried this service and it fell short.",
                        "Engaged with this provider but it was poor.",
                        "Worked with this service and it was subpar."
                    ],
                    neutral: [
                        "This service was adequate for our needs.",
                        "Hired this company and they were okay.",
                        "Tried this service and it was fine.",
                        "Engaged with this provider and it was acceptable.",
                        "Worked with this service and it was decent."
                    ]
                },
                prosFormat: "The strengths of this service include",
                consFormat: "Areas for improvement include",
                experienceFormat: "My overall experience with this service was"
            },
            experience: {
                openings: {
                    positive: [
                        "Had this experience and it was incredible!",
                        "Tried this activity and it was unforgettable.",
                        "Participated in this and it exceeded expectations.",
                        "Experienced this and it was amazing.",
                        "Did this and it was absolutely worth it."
                    ],
                    negative: [
                        "Unfortunately, this experience didn't live up to expectations.",
                        "Tried this activity but was disappointed.",
                        "Participated in this and it fell short.",
                        "Experienced this and it wasn't great.",
                        "Did this and it wasn't worth it."
                    ],
                    neutral: [
                        "This experience was okay, nothing special.",
                        "Tried this activity and it was fine.",
                        "Participated in this and it was adequate.",
                        "Experienced this and it was acceptable.",
                        "Did this and it was decent."
                    ]
                },
                prosFormat: "The highlights of this experience were",
                consFormat: "Some areas that could be improved include",
                experienceFormat: "My overall experience was"
            },
            app: {
                openings: {
                    positive: [
                        "Downloaded this app and it's been fantastic!",
                        "Tried this software and it exceeded expectations.",
                        "Used this app and I'm thoroughly impressed.",
                        "Installed this and it's been a game-changer.",
                        "Started using this app and it's amazing."
                    ],
                    negative: [
                        "Unfortunately, this app didn't meet expectations.",
                        "Tried this software but was disappointed.",
                        "Used this app and it fell short.",
                        "Installed this but it wasn't great.",
                        "Started using this app and it's problematic."
                    ],
                    neutral: [
                        "This app is okay, nothing special.",
                        "Tried this software and it's fine.",
                        "Used this app and it's adequate.",
                        "Installed this and it's acceptable.",
                        "Started using this app and it's decent."
                    ]
                },
                prosFormat: "What I love about this app is",
                consFormat: "Some issues I've encountered include",
                experienceFormat: "My overall experience with this app has been"
            },
            place: {
                openings: {
                    positive: [
                        "Visited this place and it was incredible!",
                        "Went to this location and it exceeded expectations.",
                        "Explored this venue and it was amazing.",
                        "Checked out this place and it was outstanding.",
                        "Stopped by this location and it was fantastic."
                    ],
                    negative: [
                        "Unfortunately, this place didn't meet expectations.",
                        "Went to this location but was disappointed.",
                        "Explored this venue and it fell short.",
                        "Checked out this place and it wasn't great.",
                        "Stopped by this location and it was poor."
                    ],
                    neutral: [
                        "This place was okay, nothing special.",
                        "Went to this location and it was fine.",
                        "Explored this venue and it was adequate.",
                        "Checked out this place and it was acceptable.",
                        "Stopped by this location and it was decent."
                    ]
                },
                prosFormat: "What makes this place special is",
                consFormat: "Some areas that could be improved include",
                experienceFormat: "My overall experience at this place was"
            },
            general: {
                openings: {
                    positive: [
                        "Tried this and it was excellent!",
                        "Experienced this and it exceeded expectations.",
                        "Used this and I'm thoroughly impressed.",
                        "Bought this and it was worth every penny.",
                        "Visited this and it was amazing."
                    ],
                    negative: [
                        "Unfortunately, this didn't meet expectations.",
                        "Experienced this but was disappointed.",
                        "Used this and it fell short.",
                        "Bought this but it wasn't worth it.",
                        "Visited this and it wasn't great."
                    ],
                    neutral: [
                        "This was okay, nothing special.",
                        "Experienced this and it was fine.",
                        "Used this and it was adequate.",
                        "Bought this and it was acceptable.",
                        "Visited this and it was decent."
                    ]
                },
                prosFormat: "The positive aspects include",
                consFormat: "Some drawbacks include",
                experienceFormat: "My overall experience was"
            }
        };

        const format = reviewFormats[reviewType] || reviewFormats.general;
        
        // Determine sentiment based on rating and content
        let sentiment = 'neutral';
        if (rating >= 4) sentiment = 'positive';
        else if (rating <= 2) sentiment = 'negative';
        
        // Select opening based on sentiment
        const openings = format.openings[sentiment];
        const opening = openings[Math.floor(Math.random() * openings.length)];
        
        // Build the review content
        let reviewContent = opening + ' ';
        
        // Add pros if available
        if (pros.trim()) {
            reviewContent += format.prosFormat + ' ' + pros.trim() + '. ';
        }
        
        // Add cons if available
        if (cons.trim()) {
            reviewContent += format.consFormat + ' ' + cons.trim() + '. ';
        }
        
        // Add overall experience if available
        if (experience.trim()) {
            reviewContent += format.experienceFormat + ' ' + experience.trim() + '. ';
        }
        
        // Add rating context
        const ratingTexts = {
            1: 'I would not recommend this.',
            2: 'I would not recommend this.',
            3: 'It was okay, but there are better options.',
            4: 'I would recommend this.',
            5: 'I highly recommend this!'
        };
        
        reviewContent += ratingTexts[rating] || '';
        
        // Add location if available
        if (location && location.name) {
            reviewContent += ` Located at ${location.name}.`;
        }
        
        return reviewContent.trim();
    };

    const copyToClipboard = () => {
        if (generatedReview) {
            navigator.clipboard.writeText(generatedReview);
            alert('Review copied to clipboard!');
        }
    };

    const resetReview = () => {
        setReviewData({
            reviewType: 'restaurant',
            rating: 5,
            tone: 'professional',
            pros: '',
            cons: '',
            experience: ''
        });
        setGeneratedReview('');
        setAnalysis(null);
        setShowAnalysis(false);
        setLocationData(null);
        setRatingAutoAdjusted(false);
        setCurrentStep(0);
        setShowQuickStart(true);
    };

    const handleLocationChange = (location) => {
        setLocationData(location);
    };

    const handleGenerateReviewFromAnalysis = async (transcript, analysisData) => {
        // Implementation for generating review from voice analysis
    };

    const handleSaveAnalysis = (analysisData) => {
        // Implementation for saving analysis
    };

    const autoAdjustRating = (content) => {
        if (!content || content.trim().length === 0) return null;
        
        const positiveWords = ['great', 'excellent', 'amazing', 'fantastic', 'wonderful', 'perfect', 'love', 'awesome', 'outstanding', 'superb', 'brilliant', 'incredible', 'phenomenal', 'exceptional', 'marvelous', 'splendid', 'magnificent', 'terrific', 'fabulous', 'stellar'];
        const negativeWords = ['terrible', 'awful', 'horrible', 'bad', 'poor', 'disappointing', 'worst', 'hate', 'disgusting', 'atrocious', 'dreadful', 'abysmal', 'appalling', 'deplorable', 'miserable', 'pathetic', 'shameful', 'unacceptable', 'inadequate', 'subpar'];
        
        const words = content.toLowerCase().split(/\s+/);
        let positiveCount = 0;
        let negativeCount = 0;
        
        words.forEach(word => {
            if (positiveWords.includes(word)) positiveCount++;
            if (negativeWords.includes(word)) negativeCount++;
        });
        
        if (positiveCount > negativeCount && positiveCount >= 2) return 5;
        if (positiveCount > negativeCount) return 4;
        if (negativeCount > positiveCount && negativeCount >= 2) return 1;
        if (negativeCount > positiveCount) return 2;
        return 3;
    };

    const generateAIReview = async () => {
        // Implementation for AI-powered review generation
    };

    const handleVoiceTranscript = (transcript) => {
        setVoiceTranscript(transcript);
        // Auto-fill experience field with voice input
        handleInputChange('experience', transcript);
    };

    const renderQuickStart = () => (
        <div className="quick-start-overlay">
            <div className="quick-start-modal">
                <div className="quick-start-header">
                    <h2>🎯 Quick Start</h2>
                    <p>Choose how you'd like to create your review</p>
                </div>
                <div className="quick-start-options">
                    <button 
                        className="quick-start-option"
                        onClick={() => {
                            setShowQuickStart(false);
                            setCurrentStep(0);
                        }}
                    >
                        <span className="option-icon">✍️</span>
                        <div className="option-content">
                            <h3>Step-by-Step</h3>
                            <p>Guided process with detailed options</p>
                        </div>
                    </button>
                    <button 
                        className="quick-start-option"
                        onClick={() => {
                            setShowQuickStart(false);
                            setShowVoiceInput(true);
                        }}
                    >
                        <span className="option-icon">🎤</span>
                        <div className="option-content">
                            <h3>Voice Input</h3>
                            <p>Speak your review and let AI enhance it</p>
                        </div>
                    </button>
                    <button 
                        className="quick-start-option"
                        onClick={() => {
                            setShowQuickStart(false);
                            setCurrentStep(2); // Skip to details step
                        }}
                    >
                        <span className="option-icon">⚡</span>
                        <div className="option-content">
                            <h3>Quick Generate</h3>
                            <p>Just add details and generate instantly</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );

    const renderStepIndicator = () => (
        <div className="step-indicator">
            {steps.map((step, index) => (
                <div 
                    key={step.id}
                    className={`step-item ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
                    onClick={() => goToStep(index)}
                >
                    <div className="step-number">{index + 1}</div>
                    <div className="step-info">
                        <div className="step-icon">{step.icon}</div>
                        <div className="step-title">{step.title}</div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="step-content">
                        <div className="step-header">
                            <h2>🎯 What are you reviewing?</h2>
                            <p>Select the type of item or experience you want to review</p>
                        </div>
                        <div className="type-grid">
                            {reviewTypes.map(type => (
                                <button
                                    key={type.value}
                                    className={`type-card ${reviewData.reviewType === type.value ? 'active' : ''}`}
                                    onClick={() => handleInputChange('reviewType', type.value)}
                                >
                                    <div className="type-icon" style={{ backgroundColor: type.color }}>
                                        {type.icon}
                                    </div>
                                    <div className="type-info">
                                        <h3>{type.label}</h3>
                                        <p>{type.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div className="step-content">
                        <div className="step-header">
                            <h2>🎭 Choose your tone</h2>
                            <p>How would you like your review to sound?</p>
                        </div>
                        <div className="tone-grid">
                            {tones.map(tone => (
                                <button
                                    key={tone.value}
                                    className={`tone-card ${reviewData.tone === tone.value ? 'active' : ''}`}
                                    onClick={() => handleInputChange('tone', tone.value)}
                                >
                                    <div className="tone-icon" style={{ backgroundColor: tone.color }}>
                                        {tone.icon}
                                    </div>
                                    <div className="tone-info">
                                        <h3>{tone.label}</h3>
                                        <p>{tone.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="rating-section">
                            <h3>⭐ Rating</h3>
                            <div className="rating-container">
                                <div className="rating-stars">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            className={`star-btn ${reviewData.rating >= star ? 'active' : ''}`}
                                            onClick={() => handleInputChange('rating', star)}
                                        >
                                            ⭐
                                        </button>
                                    ))}
                                </div>
                                <div className="rating-text">
                                    {reviewData.rating} out of 5 stars
                                    {ratingAutoAdjusted && (
                                        <span className="auto-adjusted-badge">AI Adjusted</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="step-content">
                        <div className="step-header">
                            <h2>✍️ Share your experience</h2>
                            <p>Tell us about your experience - what you liked, didn't like, and overall thoughts</p>
                        </div>
                        
                        {showVoiceInput && (
                            <div className="voice-input-section">
                                <h3>🎤 Voice Input</h3>
                                <VoiceRecognition onTranscript={handleVoiceTranscript} />
                                {voiceTranscript && (
                                    <div className="voice-preview">
                                        <p><strong>Your voice input:</strong> {voiceTranscript}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="content-grid">
                            <div className="content-field">
                                <label>
                                    <span className="field-icon">✅</span>
                                    What you liked (Pros)
                                </label>
                                <textarea
                                    value={reviewData.pros}
                                    onChange={(e) => handleInputChange('pros', e.target.value)}
                                    placeholder="What stood out positively? What did you enjoy?"
                                    className="content-textarea positive"
                                />
                            </div>
                            
                            <div className="content-field">
                                <label>
                                    <span className="field-icon">❌</span>
                                    What could be better (Cons)
                                </label>
                                <textarea
                                    value={reviewData.cons}
                                    onChange={(e) => handleInputChange('cons', e.target.value)}
                                    placeholder="What didn't meet expectations? What could improve?"
                                    className="content-textarea negative"
                                />
                            </div>
                            
                            <div className="content-field full-width">
                                <label>
                                    <span className="field-icon">💭</span>
                                    Overall experience
                                </label>
                                <textarea
                                    value={reviewData.experience}
                                    onChange={(e) => handleInputChange('experience', e.target.value)}
                                    placeholder="Describe your overall experience, feelings, and recommendations..."
                                    className="content-textarea experience"
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="location-section">
                            <h3>📍 Location (Optional)</h3>
                            <LocationAttachment
                                onLocationChange={handleLocationChange}
                                initialLocation={locationData}
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="step-content">
                        <div className="step-header">
                            <h2>✨ Generate your review</h2>
                            <p>Ready to create your review? Click generate to see the magic happen!</p>
                        </div>
                        
                        <div className="generate-section">
                            <button
                                className="generate-btn"
                                onClick={generateReview}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <span className="btn-icon">✨</span>
                                        Generate Review
                                    </>
                                )}
                            </button>
                        </div>

                        {generatedReview && (
                            <div className="result-section">
                                <div className="result-header">
                                    <h3>🎉 Your Generated Review</h3>
                                    <div className="result-actions">
                                        <button onClick={copyToClipboard} className="action-btn">
                                            📋 Copy
                                        </button>
                                        <button onClick={() => setShowAnalysis(!showAnalysis)} className="action-btn">
                                            📊 Analyze
                                        </button>
                                        <button onClick={resetReview} className="action-btn">
                                            🆕 New Review
                                        </button>
                                    </div>
                                </div>
                                <div className="review-display">
                                    <pre>{generatedReview}</pre>
                                </div>
                                
                                {showAnalysis && analysis && (
                                    <VoiceAnalysis
                                        analysis={analysis}
                                        onGenerateReview={handleGenerateReviewFromAnalysis}
                                        onSaveAnalysis={handleSaveAnalysis}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="review-generator" ref={containerRef}>
            {showQuickStart && renderQuickStart()}
            
            <div className="review-container">
                <div className="review-header">
                    <div className="header-content">
                        <span className="header-icon">✨</span>
                        <h1>Review Generator</h1>
                        <p>Create compelling, authentic reviews with AI assistance</p>
                        <div className="header-features">
                            <span className="feature-badge">🎯 Smart Templates</span>
                            <span className="feature-badge">🎤 Voice Input</span>
                            <span className="feature-badge">📊 Quality Analysis</span>
                        </div>
                    </div>
                </div>

                {!showQuickStart && (
                    <>
                        {renderStepIndicator()}
                        
                        <div className="review-form">
                            {renderStepContent()}
                            
                            <div className="step-navigation">
                                {currentStep > 0 && (
                                    <button onClick={prevStep} className="nav-btn prev-btn">
                                        ← Back
                                    </button>
                                )}
                                {currentStep < steps.length - 1 && currentStep !== 2 && (
                                    <button onClick={nextStep} className="nav-btn next-btn">
                                        Next →
                                    </button>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReviewGenerator; 