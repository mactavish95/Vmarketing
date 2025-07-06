import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ReviewHistory.css';
import { useTranslation } from 'react-i18next';

const ReviewHistory = () => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [expandedReviews, setExpandedReviews] = useState(new Set());
    const { t } = useTranslation();

    useEffect(() => {
        loadReviews();
    }, []);

    useEffect(() => {
        filterReviews();
    }, [reviews, searchTerm, filterType]);

    const loadReviews = () => {
        // Load from old reviewHistory
        const savedReviews = JSON.parse(localStorage.getItem('reviewHistory') || '[]');
        
        // Load from new voiceReviews
        const voiceReviews = JSON.parse(localStorage.getItem('voiceReviews') || '[]');
        
        console.log('Loading reviews from localStorage:');
        console.log('- reviewHistory:', savedReviews.length, 'reviews');
        console.log('- voiceReviews:', voiceReviews.length, 'reviews');
        console.log('- voiceReviews data:', voiceReviews);
        
        // Combine and format voice reviews to match the expected structure
        const formattedVoiceReviews = voiceReviews.map(voiceReview => ({
            id: voiceReview.id,
            reviewType: voiceReview.type,
            itemName: `${voiceReview.type.charAt(0).toUpperCase() + voiceReview.type.slice(1)} Review`,
            category: voiceReview.type,
            rating: voiceReview.rating,
            tone: 'voice-generated',
            pros: '',
            cons: '',
            experience: voiceReview.transcript || '',
            review: voiceReview.review,
            location: voiceReview.location,
            timestamp: voiceReview.timestamp,
            isVoiceReview: true
        }));
        
        console.log('Formatted voice reviews:', formattedVoiceReviews);
        
        // Combine all reviews and sort by timestamp (newest first)
        const allReviews = [...savedReviews, ...formattedVoiceReviews]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        console.log('Total combined reviews:', allReviews.length);
        
        setReviews(allReviews);
    };

    const filterReviews = () => {
        let filtered = reviews;

        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter(review => review.reviewType === filterType);
        }

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(review => 
                review.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.review.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredReviews(filtered);
    };

    const deleteReview = (id) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            const updatedReviews = reviews.filter(review => review.id !== id);
            setReviews(updatedReviews);
            
            // Separate reviews by type
            const regularReviews = updatedReviews.filter(review => !review.isVoiceReview);
            const voiceReviews = updatedReviews.filter(review => review.isVoiceReview);
            
            // Update both storage systems
            localStorage.setItem('reviewHistory', JSON.stringify(regularReviews));
            
            // Convert voice reviews back to original format
            const originalVoiceReviews = voiceReviews.map(review => ({
                id: review.id,
                type: review.reviewType,
                rating: review.rating,
                review: review.review,
                transcript: review.experience,
                analysis: review.analysis,
                timestamp: review.timestamp
            }));
            localStorage.setItem('voiceReviews', JSON.stringify(originalVoiceReviews));
        }
    };

    const copyReview = (review) => {
        navigator.clipboard.writeText(review.review);
        alert('Review copied to clipboard!');
    };

    const toggleReviewExpansion = (reviewId) => {
        setExpandedReviews(prev => {
            const newSet = new Set(prev);
            if (newSet.has(reviewId)) {
                newSet.delete(reviewId);
            } else {
                newSet.add(reviewId);
            }
            return newSet;
        });
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getReviewTypeIcon = (type) => {
        const icons = {
            product: '📱',
            restaurant: '🍽️',
            hotel: '🏨',
            movie: '🎬',
            book: '📚',
            service: '🛠️',
            experience: '🎯',
            app: '💻',
            place: '📍',
            general: '📝'
        };
        return icons[type] || '📝';
    };

    const getRatingStars = (rating) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    const formatLocation = (location) => {
        if (!location) return null;
        
        if (location.address) {
            return location.address;
        } else if (location.latitude && location.longitude) {
            return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
        }
        return null;
    };

    return (
        <div className="review-history">
            <div className="history-container">
                <div className="history-header">
                    <h1>{t('reviewHistory.title')}</h1>
                    <p>{t('reviewHistory.description')}</p>
                    <button 
                        onClick={loadReviews} 
                        className="refresh-btn"
                        title={t('reviewHistory.refreshBtnTitle')}
                    >
                        🔄 {t('reviewHistory.refreshBtn')}
                    </button>
                </div>

                <div className="filters-section">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder={t('reviewHistory.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="search-icon">🔍</span>
                    </div>

                    <div className="filter-buttons">
                        <button
                            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterType('all')}
                        >
                            {t('reviewHistory.allFilter')}
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'restaurant' ? 'active' : ''}`}
                            onClick={() => setFilterType('restaurant')}
                        >
                            🍽️ {t('reviewHistory.restaurantFilter')}
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'hotel' ? 'active' : ''}`}
                            onClick={() => setFilterType('hotel')}
                        >
                            🏨 {t('reviewHistory.hotelFilter')}
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'product' ? 'active' : ''}`}
                            onClick={() => setFilterType('product')}
                        >
                            📱 {t('reviewHistory.productFilter')}
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'service' ? 'active' : ''}`}
                            onClick={() => setFilterType('service')}
                        >
                            🛠️ {t('reviewHistory.serviceFilter')}
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'experience' ? 'active' : ''}`}
                            onClick={() => setFilterType('experience')}
                        >
                            🎯 {t('reviewHistory.experienceFilter')}
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'app' ? 'active' : ''}`}
                            onClick={() => setFilterType('app')}
                        >
                            💻 {t('reviewHistory.appFilter')}
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'place' ? 'active' : ''}`}
                            onClick={() => setFilterType('place')}
                        >
                            📍 {t('reviewHistory.placeFilter')}
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'general' ? 'active' : ''}`}
                            onClick={() => setFilterType('general')}
                        >
                            📝 {t('reviewHistory.generalFilter')}
                        </button>
                    </div>
                </div>

                {filteredReviews.length === 0 ? (
                    <div className="empty-state colorful">
                        <div className="empty-icon">📝</div>
                        <h3>{t('reviewHistory.noReviewsTitle')}</h3>
                        <p>
                            {reviews.length === 0 
                                ? t('reviewHistory.noReviewsFirst')
                                : t('reviewHistory.noReviewsSecond')
                            }
                        </p>
                        {reviews.length === 0 && (
                            <Link to="/generate" className="cta-button">✨ {t('reviewHistory.ctaButton')}</Link>
                        )}
                    </div>
                ) : (
                    <div className="reviews-grid">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className={`review-card review-type-${review.reviewType}`}>
                                <div className="review-card-header">
                                    <span className="type-icon" title={review.reviewType}>{getReviewTypeIcon(review.reviewType)}</span>
                                    <span className="review-title">{review.itemName}</span>
                                    <span className="review-rating" title={`Rating: ${review.rating}/5`}>
                                        {getRatingStars(review.rating)} <span className="rating-num">{review.rating}/5</span>
                                    </span>
                                    {review.isVoiceReview && <span className="voice-badge" title="Voice Review">🎤</span>}
                                </div>
                                <div className="review-card-body">
                                    <div className="review-preview-text">
                                        {review.review.length > 180 && !expandedReviews.has(review.id)
                                            ? (
                                                <>
                                                    {review.review.substring(0, 180)}... 
                                                    <button onClick={() => toggleReviewExpansion(review.id)} className="expand-btn" title={t('reviewHistory.readMore')}>{t('reviewHistory.readMore')}</button>
                                                </>
                                            )
                                            : (
                                                <>
                                                    {review.review}
                                                    {review.review.length > 180 && expandedReviews.has(review.id) && (
                                                        <button onClick={() => toggleReviewExpansion(review.id)} className="collapse-btn" title={t('reviewHistory.showLess')}>{t('reviewHistory.showLess')}</button>
                                                    )}
                                                </>
                                            )
                                        }
                                    </div>
                                    {review.location && (
                                        <div className="review-location">
                                            <span className="location-icon">📍</span>
                                            <span className="location-text">{formatLocation(review.location)}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="review-card-footer">
                                    <span className="review-date">{formatDate(review.timestamp)}</span>
                                    <span className="review-tone">{review.tone}</span>
                                    <div className="review-actions">
                                        <button onClick={() => copyReview(review)} className="action-btn copy" title={t('reviewHistory.copyBtn')}>📋</button>
                                        <button onClick={() => deleteReview(review.id)} className="action-btn delete" title={t('reviewHistory.deleteBtn')}>🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredReviews.length > 0 && (
                    <div className="history-stats">
                        <p>
                            {t('reviewHistory.showing')} {filteredReviews.length} {t('reviewHistory.of')} {reviews.length} {t('reviewHistory.reviews')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewHistory; 