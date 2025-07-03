import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ReviewHistory.css';

const ReviewHistory = () => {
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [expandedReviews, setExpandedReviews] = useState(new Set());

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
                    <h1>Review History</h1>
                    <p>Your previously generated reviews</p>
                    <button 
                        onClick={loadReviews} 
                        className="refresh-btn"
                        title="Refresh reviews"
                    >
                        🔄 Refresh
                    </button>
                </div>

                <div className="filters-section">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search reviews..."
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
                            All
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'restaurant' ? 'active' : ''}`}
                            onClick={() => setFilterType('restaurant')}
                        >
                            🍽️ Restaurants
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'hotel' ? 'active' : ''}`}
                            onClick={() => setFilterType('hotel')}
                        >
                            🏨 Hotels
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'product' ? 'active' : ''}`}
                            onClick={() => setFilterType('product')}
                        >
                            📱 Products
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'service' ? 'active' : ''}`}
                            onClick={() => setFilterType('service')}
                        >
                            🛠️ Services
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'experience' ? 'active' : ''}`}
                            onClick={() => setFilterType('experience')}
                        >
                            🎯 Experiences
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'app' ? 'active' : ''}`}
                            onClick={() => setFilterType('app')}
                        >
                            💻 Apps
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'place' ? 'active' : ''}`}
                            onClick={() => setFilterType('place')}
                        >
                            📍 Places
                        </button>
                        <button
                            className={`filter-btn ${filterType === 'general' ? 'active' : ''}`}
                            onClick={() => setFilterType('general')}
                        >
                            📝 General
                        </button>
                    </div>
                </div>

                {filteredReviews.length === 0 ? (
                    <div className="empty-state colorful">
                        <div className="empty-icon">📝</div>
                        <h3>No reviews found</h3>
                        <p>
                            {reviews.length === 0 
                                ? "You haven't generated any reviews yet. Start by creating your first review!"
                                : "No reviews match your current search or filter criteria."
                            }
                        </p>
                        {reviews.length === 0 && (
                            <Link to="/generate" className="cta-button">✨ Generate Your First Review</Link>
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
                                                    <button onClick={() => toggleReviewExpansion(review.id)} className="expand-btn" title="Read full review">Read more</button>
                                                </>
                                            )
                                            : (
                                                <>
                                                    {review.review}
                                                    {review.review.length > 180 && expandedReviews.has(review.id) && (
                                                        <button onClick={() => toggleReviewExpansion(review.id)} className="collapse-btn" title="Show less">Show less</button>
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
                                        <button onClick={() => copyReview(review)} className="action-btn copy" title="Copy review">📋</button>
                                        <button onClick={() => deleteReview(review.id)} className="action-btn delete" title="Delete review">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredReviews.length > 0 && (
                    <div className="history-stats">
                        <p>
                            Showing {filteredReviews.length} of {reviews.length} reviews
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewHistory; 