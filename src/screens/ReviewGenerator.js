import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import VoiceAnalysis from '../components/VoiceAnalysis';
import LocationAttachment from '../components/LocationAttachment';
import llmService from '../services/llmService';
import apiConfig from '../config/api';
import './ReviewGenerator.css';
import { useTranslation } from 'react-i18next';

const ReviewGenerator = () => {
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
    const history = useHistory();
    const [ratingAutoAdjusted, setRatingAutoAdjusted] = useState(false);
    const [modelInfo, setModelInfo] = useState(null);
    const { t } = useTranslation();

    // Load model information on component mount
    useEffect(() => {
        fetchModelInfo();
    }, []);

    const fetchModelInfo = async () => {
        try {
            // Force production URL if we're on Netlify
            const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
            const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;
            
            const res = await fetch(`${baseURL}/models`);
            const data = await res.json();
            if (data.success) {
                const reviewModel = data.models.find(m => m.useCase === 'review_generation');
                setModelInfo(reviewModel);
            }
        } catch (error) {
            console.warn('Failed to fetch model info:', error);
        }
    };

    const reviewTypes = [
        { value: 'restaurant', label: 'Restaurant', icon: '🍽️', color: '#ff6b6b' },
        { value: 'hotel', label: 'Hotel', icon: '🏨', color: '#20c997' },
        { value: 'product', label: 'Product', icon: '📱', color: '#f7b731' },
        { value: 'service', label: 'Service', icon: '🛠️', color: '#4b7bec' },
        { value: 'experience', label: 'Experience', icon: '🎯', color: '#a55eea' },
        { value: 'app', label: 'App/Software', icon: '💻', color: '#45aaf2' },
        { value: 'place', label: 'Place/Location', icon: '📍', color: '#26de81' },
        { value: 'general', label: 'General', icon: '📝', color: '#778ca3' }
    ];

    const tones = [
        { value: 'professional', label: 'Professional', icon: '👔', color: '#667eea' },
        { value: 'casual', label: 'Casual', icon: '😊', color: '#ffa726' },
        { value: 'enthusiastic', label: 'Enthusiastic', icon: '🎉', color: '#ff7043' },
        { value: 'critical', label: 'Critical', icon: '🤔', color: '#ef5350' },
        { value: 'balanced', label: 'Balanced', icon: '⚖️', color: '#66bb6a' }
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
                    console.log(`Auto-adjusted rating to ${suggestedRating} based on content`);
                }
            }
            
            // Clear auto-adjusted flag when user manually changes rating
            if (field === 'rating') {
                setRatingAutoAdjusted(false);
            }
            
            return updatedData;
        });
    };

    const generateReview = () => {
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
            localStorage.setItem('reviewHistory', JSON.stringify(reviewHistory.slice(0, 50))); // Keep last 50
            
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
                console.log('Review analysis result:', result);
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
                        "Booked a room here and was impressed from check-in to check-out.",
                        "Spent the night at this place and it was absolutely perfect.",
                        "Checked into this hotel and immediately felt at home.",
                        "Had an overnight stay here and it was exceptional."
                    ],
                    negative: [
                        "Unfortunately, this hotel didn't meet basic standards.",
                        "Booked a room here and was disappointed with the experience.",
                        "Stayed at this place and it was far from comfortable.",
                        "Checked into this hotel and immediately noticed issues.",
                        "Had an overnight stay here and it was problematic."
                    ],
                    neutral: [
                        "This hotel was adequate for the price.",
                        "Stayed here and it was okay, nothing special.",
                        "Booked a room and it was functional but basic.",
                        "Checked into this hotel and it was average.",
                        "Had an overnight stay here and it was fine."
                    ]
                },
                prosFormat: "The best aspects were",
                consFormat: "Issues that need attention include",
                experienceFormat: "My overall stay was"
            },
            product: {
                openings: {
                    positive: [
                        "Bought this product and it's been a game-changer!",
                        "Tried out this item and I'm thoroughly impressed.",
                        "Purchased this recently and it's exceeded expectations.",
                        "Got my hands on this and it's absolutely worth it.",
                        "Tested this product and it's fantastic."
                    ],
                    negative: [
                        "Unfortunately, this product didn't work as advertised.",
                        "Bought this item and it was a waste of money.",
                        "Tried this product and it failed to deliver.",
                        "Purchased this and it's been problematic.",
                        "Got this item and it's not worth the price."
                    ],
                    neutral: [
                        "This product is okay, but nothing special.",
                        "Bought this item and it's functional but basic.",
                        "Tried this product and it's average at best.",
                        "Purchased this and it's decent but not great.",
                        "Got this item and it's fine for the price."
                    ]
                },
                prosFormat: "The strengths of this product include",
                consFormat: "Areas where this product falls short are",
                experienceFormat: "My overall experience with this product has been"
            },
            service: {
                openings: {
                    positive: [
                        "Used this service and it was incredibly professional!",
                        "Hired this company and they delivered beyond expectations.",
                        "Tried this service out and it was excellent.",
                        "Went with this provider and couldn't be happier.",
                        "Engaged this service and it was outstanding."
                    ],
                    negative: [
                        "Unfortunately, this service was disappointing.",
                        "Hired this company and they didn't deliver.",
                        "Tried this service and it was a waste of time.",
                        "Went with this provider and regretted it.",
                        "Engaged this service and it was problematic."
                    ],
                    neutral: [
                        "This service was adequate but not exceptional.",
                        "Hired this company and they did an okay job.",
                        "Tried this service and it was functional.",
                        "Went with this provider and it was average.",
                        "Engaged this service and it was fine."
                    ]
                },
                prosFormat: "What they did well was",
                consFormat: "Areas for improvement include",
                experienceFormat: "My overall experience with this service was"
            },
            experience: {
                openings: {
                    positive: [
                        "Had this experience and it was absolutely incredible!",
                        "Went through this and it was life-changing.",
                        "Tried this activity and it was beyond amazing.",
                        "Participated in this and it was unforgettable.",
                        "Experienced this and it was phenomenal."
                    ],
                    negative: [
                        "Unfortunately, this experience was disappointing.",
                        "Went through this and it was a letdown.",
                        "Tried this activity and it wasn't worth it.",
                        "Participated in this and it was underwhelming.",
                        "Experienced this and it was not what I expected."
                    ],
                    neutral: [
                        "This experience was okay, nothing special.",
                        "Went through this and it was average.",
                        "Tried this activity and it was fine.",
                        "Participated in this and it was decent.",
                        "Experienced this and it was alright."
                    ]
                },
                prosFormat: "The highlights were",
                consFormat: "The low points included",
                experienceFormat: "Overall, this experience was"
            },
            app: {
                openings: {
                    positive: [
                        "Downloaded this app and it's been incredibly useful!",
                        "Tried this software and it's exceeded all expectations.",
                        "Used this application and it's become essential.",
                        "Tested this app and it's fantastic.",
                        "Installed this and it's been a great addition."
                    ],
                    negative: [
                        "Unfortunately, this app has been problematic.",
                        "Downloaded this software and it's been frustrating.",
                        "Tried this application and it's not user-friendly.",
                        "Tested this app and it's full of bugs.",
                        "Installed this and it's been disappointing."
                    ],
                    neutral: [
                        "This app is functional but not impressive.",
                        "Downloaded this software and it's okay.",
                        "Tried this application and it's average.",
                        "Tested this app and it's decent.",
                        "Installed this and it's fine."
                    ]
                },
                prosFormat: "The app's strengths include",
                consFormat: "Issues with the app include",
                experienceFormat: "My overall experience with this app has been"
            },
            place: {
                openings: {
                    positive: [
                        "Visited this place and it was absolutely beautiful!",
                        "Went to this location and it was incredible.",
                        "Explored this area and it was amazing.",
                        "Checked out this spot and it was wonderful.",
                        "Stopped by this place and it was fantastic."
                    ],
                    negative: [
                        "Unfortunately, this place was disappointing.",
                        "Went to this location and it wasn't worth the visit.",
                        "Explored this area and it was underwhelming.",
                        "Checked out this spot and it was a letdown.",
                        "Stopped by this place and it was not what I expected."
                    ],
                    neutral: [
                        "This place was okay, nothing special.",
                        "Went to this location and it was average.",
                        "Explored this area and it was fine.",
                        "Checked out this spot and it was decent.",
                        "Stopped by this place and it was alright."
                    ]
                },
                prosFormat: "What made this place special was",
                consFormat: "Areas that could be improved include",
                experienceFormat: "My overall impression of this place was"
            },
            general: {
                openings: {
                    positive: [
                        "Tried this out and it was absolutely fantastic!",
                        "Experienced this and it exceeded expectations.",
                        "Went with this option and it was excellent.",
                        "Chose this and it was a great decision.",
                        "Decided to try this and it was wonderful."
                    ],
                    negative: [
                        "Unfortunately, this didn't meet expectations.",
                        "Tried this out and it was disappointing.",
                        "Experienced this and it fell short.",
                        "Went with this option and regretted it.",
                        "Chose this and it wasn't worth it."
                    ],
                    neutral: [
                        "This was okay, nothing special.",
                        "Tried this out and it was average.",
                        "Experienced this and it was fine.",
                        "Went with this option and it was decent.",
                        "Chose this and it was alright."
                    ]
                },
                prosFormat: "What I liked was",
                consFormat: "Areas for improvement include",
                experienceFormat: "My overall experience was"
            }
        };

        const format = reviewFormats[reviewType] || reviewFormats.general;
        let review = '';
        
        // Select appropriate opening based on rating
        let openingCategory;
        if (rating >= 4) openingCategory = 'positive';
        else if (rating <= 2) openingCategory = 'negative';
        else openingCategory = 'neutral';
        
        const openings = format.openings[openingCategory];
        const selectedOpening = openings[Math.floor(Math.random() * openings.length)];
        review += selectedOpening + ' ';
        
        // Add pros with varied sentence structures
        if (pros && pros.trim()) {
            const prosText = pros.trim();
            const prosFormats = [
                `${format.prosFormat} ${prosText}.`,
                `What really impressed me was ${prosText}.`,
                `I particularly enjoyed ${prosText}.`,
                `The standout feature was ${prosText}.`,
                `What made this great was ${prosText}.`
            ];
            const selectedProsFormat = prosFormats[Math.floor(Math.random() * prosFormats.length)];
            review += `\n\n${selectedProsFormat}`;
        }
        
        // Add cons with varied sentence structures
        if (cons && cons.trim()) {
            const consText = cons.trim();
            const consFormats = [
                `${format.consFormat} ${consText}.`,
                `However, ${consText}.`,
                `On the downside, ${consText}.`,
                `The main issue was ${consText}.`,
                `What could be better is ${consText}.`
            ];
            const selectedConsFormat = consFormats[Math.floor(Math.random() * consFormats.length)];
            review += `\n\n${selectedConsFormat}`;
        }
        
        // Add experience details with varied sentence structures
        if (experience && experience.trim()) {
            const expText = experience.trim();
            const expFormats = [
                `${format.experienceFormat} ${expText}.`,
                `Overall, ${expText}.`,
                `In summary, ${expText}.`,
                `My takeaway was ${expText}.`,
                `The bottom line is ${expText}.`
            ];
            const selectedExpFormat = expFormats[Math.floor(Math.random() * expFormats.length)];
            review += `\n\n${selectedExpFormat}`;
        }
        
        // Add location information if available
        if (location) {
            if (location.address) {
                review += `\n\n📍 ${location.address}`;
            } else {
                review += `\n\n📍 ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
            }
        }
        
        // Add varied closing statements based on rating and tone
        const closings = {
            positive: {
                enthusiastic: [
                    "Definitely recommend checking this out!",
                    "Cannot recommend this enough!",
                    "Absolutely worth your time and money!",
                    "This is a must-try experience!",
                    "You won't regret giving this a shot!"
                ],
                casual: [
                    "Would definitely go back.",
                    "Highly recommend this place.",
                    "This is worth checking out.",
                    "I'll definitely return here.",
                    "This gets my full recommendation."
                ],
                professional: [
                    "This exceeded expectations and comes highly recommended.",
                    "The quality and service make this a worthwhile choice.",
                    "This represents excellent value for the experience provided.",
                    "I would confidently recommend this to others.",
                    "This demonstrates the standards I look for in quality experiences."
                ]
            },
            negative: {
                critical: [
                    "Would not recommend this to anyone.",
                    "This was a complete waste of time and money.",
                    "Avoid this at all costs.",
                    "This falls far short of acceptable standards.",
                    "I cannot recommend this experience."
                ],
                balanced: [
                    "Probably won't return.",
                    "This wasn't worth the effort.",
                    "I'd suggest looking elsewhere.",
                    "This didn't meet my expectations.",
                    "I wouldn't choose this again."
                ]
            },
            neutral: {
                balanced: [
                    "Might give it another try.",
                    "It's okay if you're in the area.",
                    "Decent option for the price.",
                    "Worth a try if you're curious.",
                    "Not bad, but not great either."
                ]
            }
        };
        
        const closingCategory = rating >= 4 ? 'positive' : rating <= 2 ? 'negative' : 'neutral';
        const toneCategory = tone === 'enthusiastic' ? 'enthusiastic' : tone === 'critical' ? 'critical' : 'balanced';
        const availableClosings = closings[closingCategory][toneCategory] || closings[closingCategory].balanced || closings.neutral.balanced;
        const selectedClosing = availableClosings[Math.floor(Math.random() * availableClosings.length)];
        
        review += `\n\n${selectedClosing}`;
        
        return review;
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedReview);
        alert('Review copied to clipboard!');
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
    };

    const handleLocationChange = (location) => {
        setLocationData(location);
    };

    const handleGenerateReviewFromAnalysis = async (transcript, analysisData) => {
        try {
            const result = await llmService.generateReviewFromVoice(
                transcript, 
                reviewData.reviewType, 
                reviewData.rating
            );
            
            if (result.success) {
                setGeneratedReview(result.reviewText);
            }
        } catch (error) {
            console.error('Review generation failed:', error);
        }
    };

    const handleSaveAnalysis = (analysisData) => {
        const analysisRecord = {
            id: Date.now(),
            analysis: analysisData,
            reviewData: reviewData,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        const existingAnalyses = JSON.parse(localStorage.getItem('reviewAnalyses') || '[]');
        localStorage.setItem('reviewAnalyses', JSON.stringify([analysisRecord, ...existingAnalyses]));
        
        alert('Analysis saved successfully!');
    };

    // Auto-adjust rating based on content analysis
    const autoAdjustRating = (content) => {
        if (!content || content.trim().length === 0) return;
        
        let suggestedRating = 3; // Default neutral rating
        const text = content.toLowerCase();
        
        // Positive keywords
        const positiveKeywords = ['amazing', 'excellent', 'great', 'good', 'love', 'perfect', 'best', 'fantastic', 'wonderful', 'outstanding', 'awesome', 'brilliant'];
        const negativeKeywords = ['terrible', 'awful', 'bad', 'horrible', 'worst', 'disappointing', 'poor', 'mediocre', 'overpriced', 'scam', 'hate', 'disgusting'];
        
        const positiveCount = positiveKeywords.filter(word => text.includes(word)).length;
        const negativeCount = negativeKeywords.filter(word => text.includes(word)).length;
        
        if (positiveCount > negativeCount && positiveCount >= 2) {
            suggestedRating = 5;
        } else if (positiveCount > negativeCount && positiveCount >= 1) {
            suggestedRating = 4;
        } else if (negativeCount > positiveCount && negativeCount >= 2) {
            suggestedRating = 1;
        } else if (negativeCount > positiveCount && negativeCount >= 1) {
            suggestedRating = 2;
        }
        
        // Special cases
        if (text.includes('overpriced') || text.includes('scam') || text.includes('rip off')) {
            suggestedRating = Math.max(1, suggestedRating - 1);
        }
        if (text.includes('worth it') || text.includes('recommend') || text.includes('love it')) {
            suggestedRating = Math.min(5, suggestedRating + 1);
        }
        
        return suggestedRating;
    };

    const generateAIReview = async () => {
        // Validate input
        const hasContent = reviewData.pros.trim() || reviewData.cons.trim() || reviewData.experience.trim();
        if (!hasContent) {
            alert('Please provide some content in at least one field (pros, cons, or experience) before generating a review.');
            return;
        }

        // API key is now handled securely on the server

        setIsGenerating(true);
        
        try {
            // Combine all content into a single transcript
            const combinedContent = [
                reviewData.pros,
                reviewData.cons,
                reviewData.experience
            ].filter(Boolean).join('. ');
            
            // Use the VoiceService to generate AI review
            const VoiceService = (await import('../services/VoiceService')).default;
            const review = await VoiceService.generateReview(
                combinedContent,
                {
                    sentiment: 'neutral',
                    confidence: 0.8,
                    keyPoints: ['User-provided content'],
                    topics: [reviewData.reviewType],
                    summary: 'Review based on user input'
                },
                reviewData.reviewType
            );
            
            let reviewText = review;
            
            // Add location information to the review if available (more naturally)
            if (locationData) {
                if (locationData.address) {
                    reviewText += `\n\n📍 ${locationData.address}`;
                } else {
                    reviewText += `\n\n📍 ${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}`;
                }
            }

            // Add rating if specified (more subtly)
            if (reviewData.rating && reviewData.rating > 0) {
                reviewText += `\n\nRating: ${reviewData.rating}/5`;
            }
            
            setGeneratedReview(reviewText);
            
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
                review: reviewText,
                isAIGenerated: true,
                timestamp: new Date().toISOString()
            };
            reviewHistory.unshift(newReview);
            localStorage.setItem('reviewHistory', JSON.stringify(reviewHistory.slice(0, 50)));
            
            // Auto-analyze the generated review
            setTimeout(() => {
                analyzeReview(reviewText);
            }, 500);
            
        } catch (error) {
            console.error('AI review generation error:', error);
            alert('Failed to generate AI review. Please check your API key and try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="review-generator">
            <div className="review-container">
                {/* Beautiful Header Section */}
                <div className="review-header">
                    <div className="header-content">
                        <div className="header-icon">✨</div>
                        <h1>{t('reviewGenerator.title')}</h1>
                        <p>{t('reviewGenerator.subtitle')}</p>
                        <div className="header-features">
                            <span className="feature-badge">🤖 {modelInfo?.name || 'Meta Llama 3.1 70B'}</span>
                            <span className="feature-badge">🎯 Smart Analysis</span>
                            <span className="feature-badge">📱 Mobile Optimized</span>
                        </div>
                        {modelInfo && (
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                padding: '16px',
                                marginTop: '16px',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}>
                                <p style={{
                                    margin: '0 0 8px 0',
                                    color: '#fff',
                                    fontSize: '14px',
                                    opacity: '0.9'
                                }}>
                                    {modelInfo.description}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '6px'
                                }}>
                                    {modelInfo.strengths.map((strength, index) => (
                                        <span key={index} style={{
                                            background: 'rgba(255, 255, 255, 0.2)',
                                            color: '#fff',
                                            padding: '3px 8px',
                                            borderRadius: '10px',
                                            fontSize: '11px',
                                            fontWeight: '500'
                                        }}>
                                            {strength}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {!generatedReview ? (
                    <div className="review-form">
                        {/* Review Settings Section */}
                        <div className="form-section settings-section">
                            <div className="section-header">
                                <h2>{t('reviewGenerator.settingsSection.title')}</h2>
                                <p>{t('reviewGenerator.settingsSection.subtitle')}</p>
                            </div>
                            
                            <div className="settings-grid">
                                <div className="setting-group">
                                    <label className="setting-label">
                                        <span className="label-icon">📝</span>
                                        {t('reviewGenerator.settingsSection.reviewType')}
                                    </label>
                                    <div className="type-options">
                                        {reviewTypes.map(type => (
                                            <button
                                                key={type.value}
                                                className={`type-option ${reviewData.reviewType === type.value ? 'active' : ''}`}
                                                onClick={() => handleInputChange('reviewType', type.value)}
                                                style={{
                                                    '--accent-color': type.color
                                                }}
                                            >
                                                <span className="type-icon">{type.icon}</span>
                                                <span className="type-label">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="setting-group">
                                    <label className="setting-label">
                                        <span className="label-icon">🎭</span>
                                        {t('reviewGenerator.settingsSection.writingTone')}
                                    </label>
                                    <div className="tone-options">
                                        {tones.map(tone => (
                                            <button
                                                key={tone.value}
                                                className={`tone-option ${reviewData.tone === tone.value ? 'active' : ''}`}
                                                onClick={() => handleInputChange('tone', tone.value)}
                                                style={{
                                                    '--accent-color': tone.color
                                                }}
                                            >
                                                <span className="tone-icon">{tone.icon}</span>
                                                <span className="tone-label">{tone.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rating Section */}
                        <div className="form-section rating-section">
                            <div className="section-header">
                                <h2>{t('reviewGenerator.ratingSection.title')}</h2>
                                <p>{t('reviewGenerator.ratingSection.subtitle')}</p>
                            </div>
                            
                            <div className="rating-container">
                                <div className="rating-display">
                                    <span className="rating-label">{t('reviewGenerator.ratingSection.ratingLabel')} {reviewData.rating}/5</span>
                                    <div className="rating-stars">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                className={`star-btn ${star <= reviewData.rating ? 'active' : ''}`}
                                                onClick={() => {
                                                    handleInputChange('rating', star);
                                                    setRatingAutoAdjusted(false);
                                                }}
                                            >
                                                ⭐
                                            </button>
                                        ))}
                                    </div>
                                    {ratingAutoAdjusted && (
                                        <div className="auto-adjusted-indicator">
                                            <span className="ai-badge">🤖 AI Suggested</span>
                                            <span className="adjustment-note">{t('reviewGenerator.ratingSection.ratingAdjusted')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="form-section content-section">
                            <div className="section-header">
                                <h2>{t('reviewGenerator.contentSection.title')}</h2>
                                <p>{t('reviewGenerator.contentSection.subtitle')}</p>
                            </div>
                            
                            <div className="content-grid">
                                <div className="content-group positive-group">
                                    <label className="content-label">
                                        <span className="label-icon">✅</span>
                                        {t('reviewGenerator.contentSection.prosLabel')}
                                    </label>
                                    <div className="input-field">
                                        <textarea
                                            value={reviewData.pros}
                                            onChange={(e) => handleInputChange('pros', e.target.value)}
                                            placeholder={t('reviewGenerator.contentSection.prosPlaceholder')}
                                            rows="4"
                                            className="content-textarea positive-textarea"
                                        />
                                    </div>
                                </div>

                                <div className="content-group negative-group">
                                    <label className="content-label">
                                        <span className="label-icon">⚠️</span>
                                        {t('reviewGenerator.contentSection.consLabel')}
                                    </label>
                                    <div className="input-field">
                                        <textarea
                                            value={reviewData.cons}
                                            onChange={(e) => handleInputChange('cons', e.target.value)}
                                            placeholder={t('reviewGenerator.contentSection.consPlaceholder')}
                                            rows="4"
                                            className="content-textarea negative-textarea"
                                        />
                                    </div>
                                </div>

                                <div className="content-group full-width experience-group">
                                    <label className="content-label">
                                        <span className="label-icon">💭</span>
                                        {t('reviewGenerator.contentSection.experienceLabel')}
                                    </label>
                                    <div className="input-field">
                                        <textarea
                                            value={reviewData.experience}
                                            onChange={(e) => handleInputChange('experience', e.target.value)}
                                            placeholder={t('reviewGenerator.contentSection.experiencePlaceholder')}
                                            rows="5"
                                            className="content-textarea experience-textarea"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div className="form-section location-section">
                            <div className="section-header">
                                <h2>{t('reviewGenerator.locationSection.title')}</h2>
                                <p>{t('reviewGenerator.locationSection.subtitle')}</p>
                            </div>
                            <LocationAttachment 
                                onLocationChange={handleLocationChange}
                                initialLocation={locationData}
                                transcript={reviewData.experience || reviewData.pros || reviewData.cons}
                                // API key is now handled securely on the server
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="form-actions">
                            <div className="action-buttons">
                                <button
                                    className="generate-btn ai-generate-btn"
                                    onClick={generateAIReview}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="loading-spinner"></span>
                                            <span>{t('reviewGenerator.actionButtons.aiGenerate')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="btn-icon">🤖</span>
                                            <span>{t('reviewGenerator.actionButtons.aiGenerate')}</span>
                                            <span className="btn-badge">Advanced</span>
                                        </>
                                    )}
                                </button>
                                
                                <button
                                    className="generate-btn regular-generate-btn"
                                    onClick={generateReview}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="loading-spinner"></span>
                                            <span>{t('reviewGenerator.actionButtons.regularGenerate')}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="btn-icon">✨</span>
                                            <span>{t('reviewGenerator.actionButtons.regularGenerate')}</span>
                                            <span className="btn-badge">Quick</span>
                                        </>
                                    )}
                                </button>
                                
                                <button className="reset-btn" onClick={resetReview}>
                                    <span className="btn-icon">🔄</span>
                                    <span>{t('reviewGenerator.actionButtons.reset')}</span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Help Section */}
                        <div className="help-section">
                            <div className="help-card">
                                <h3>{t('reviewGenerator.helpSection.title')}</h3>
                                <div className="help-content">
                                    <div className="help-item">
                                        <span className="help-icon">🤖</span>
                                        <div>
                                            <strong>{t('reviewGenerator.helpSection.aiReview')}</strong> {t('reviewGenerator.helpSection.aiReviewDescription')}
                                        </div>
                                    </div>
                                    <div className="help-item">
                                        <span className="help-icon">✨</span>
                                        <div>
                                            <strong>{t('reviewGenerator.helpSection.regularReview')}</strong> {t('reviewGenerator.helpSection.regularReviewDescription')}
                                        </div>
                                    </div>
                                    <div className="help-item">
                                        <span className="help-icon">🎯</span>
                                        <div>
                                            <strong>{t('reviewGenerator.helpSection.smartRating')}</strong> {t('reviewGenerator.helpSection.smartRatingDescription')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="result-section">
                        <div className="result-header">
                            <div className="result-title">
                                <h2>{t('reviewGenerator.resultSection.title')}</h2>
                                <p>{t('reviewGenerator.resultSection.subtitle')} {analysis?.provider || 'AI'}</p>
                            </div>
                            <div className="result-actions">
                                <button onClick={copyToClipboard} className="action-btn copy-btn">
                                    <span className="btn-icon">📋</span>
                                    <span>{t('reviewGenerator.resultSection.copyReview')}</span>
                                </button>
                                <button 
                                    onClick={() => setShowAnalysis(!showAnalysis)} 
                                    className="action-btn analysis-btn"
                                >
                                    <span className="btn-icon">🧠</span>
                                    <span>{showAnalysis ? t('reviewGenerator.resultSection.hideAnalysis') : t('reviewGenerator.resultSection.showAnalysis')}</span>
                                </button>
                                <button onClick={resetReview} className="action-btn new-btn">
                                    <span className="btn-icon">🎤</span>
                                    <span>{t('reviewGenerator.resultSection.createAnother')}</span>
                                </button>
                            </div>
                        </div>

                        <div className="review-content">
                            <div className="review-display">
                                <pre>{generatedReview}</pre>
                            </div>
                        </div>

                        {isAnalyzing && (
                            <div className="analyzing-indicator">
                                <div className="loading-spinner"></div>
                                <p>{t('reviewGenerator.resultSection.analyzing')}</p>
                            </div>
                        )}

                        {showAnalysis && analysis && (
                            <div className="analysis-section">
                                <h3>{t('reviewGenerator.resultSection.analysisTitle')}</h3>
                                <VoiceAnalysis
                                    analysis={analysis}
                                    onGenerateReview={handleGenerateReviewFromAnalysis}
                                    onSaveAnalysis={handleSaveAnalysis}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewGenerator; 