import React, { useState, useEffect } from 'react';
import LocationService from '../services/locationService';
import './LocationSuggestions.css';
import { useTranslation } from 'react-i18next';

const LocationSuggestions = ({ 
    transcript, 
    currentLocation, 
    onLocationSelect, 
    onClose 
}) => {
    const [suggestions, setSuggestions] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        if (transcript) {
            getLocationSuggestions();
        }
    }, [transcript]);

    const getLocationSuggestions = async () => {
        if (!transcript) return;

        setIsLoading(true);
        setError('');

        try {
            const result = await LocationService.getLocationSuggestions(
                transcript, 
         
                currentLocation
            );

            if (result.success) {
                setSuggestions(result.suggestions || []);
                setAnalysis(result.analysis || {});
                
                // Auto-search if specific place is mentioned
                if (result.analysis?.specificPlace) {
                    setSearchQuery(result.analysis.specificPlace);
                    searchLocations(result.analysis.specificPlace);
                }
            } else {
                setError(result.error || 'Failed to get location suggestions');
            }
        } catch (error) {
            console.error('Location suggestion error:', error);
            setError(error.message || 'Failed to get location suggestions');
        } finally {
            setIsLoading(false);
        }
    };

    const searchLocations = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const results = await LocationService.searchLocations(query, 5);
            setSearchResults(results);
        } catch (error) {
            console.error('Location search error:', error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        searchLocations(searchQuery);
    };

    const handleLocationSelect = (location) => {
        onLocationSelect(location);
        onClose();
    };

    const getLocationIcon = (type) => {
        switch (type) {
            case 'restaurant': return '🍽️';
            case 'hotel': return '🏨';
            case 'store': return '🛍️';
            case 'attraction': return '🎯';
            case 'service': return '🛠️';
            default: return '📍';
        }
    };

    const getConfidenceColor = (confidence) => {
        if (confidence >= 0.8) return '#4CAF50';
        if (confidence >= 0.6) return '#FF9800';
        return '#F44336';
    };

    const getConfidenceText = (confidence) => {
        if (confidence >= 0.8) return 'High';
        if (confidence >= 0.6) return 'Medium';
        return 'Low';
    };

    return (
        <div className="location-suggestions">
            <div className="suggestions-header">
                <h3>📍 {t('locationSuggestions.suggestions')}</h3>
                <button className="close-btn" onClick={onClose}>
                    ✕
                </button>
            </div>

            {error && (
                <div className="suggestions-error">
                    <span className="error-icon">⚠️</span>
                    {t('locationSuggestions.error')}
                </div>
            )}

            {isLoading && (
                <div className="suggestions-loading">
                    <div className="loading-spinner"></div>
                    <p>🤖 AI is analyzing your voice for location suggestions...</p>
                </div>
            )}

            {analysis && !isLoading && (
                <div className="analysis-summary">
                    <h4>📊 AI Analysis</h4>
                    <div className="analysis-details">
                        <div className="analysis-item">
                            <span className="analysis-label">{t('locationSuggestions.locationMentioned')}:</span>
                            <span className={`analysis-value ${analysis.locationMentioned ? 'positive' : 'negative'}`}>
                                {analysis.locationMentioned ? 'Yes' : 'No'}
                            </span>
                        </div>
                        {analysis.locationType && analysis.locationType !== 'unknown' && (
                            <div className="analysis-item">
                                <span className="analysis-label">{t('locationSuggestions.type')}:</span>
                                <span className="analysis-value">
                                    {getLocationIcon(analysis.locationType)} {analysis.locationType}
                                </span>
                            </div>
                        )}
                        {analysis.specificPlace && (
                            <div className="analysis-item">
                                <span className="analysis-label">{t('locationSuggestions.specificPlace')}:</span>
                                <span className="analysis-value">{analysis.specificPlace}</span>
                            </div>
                        )}
                        {analysis.cityOrArea && (
                            <div className="analysis-item">
                                <span className="analysis-label">{t('locationSuggestions.area')}:</span>
                                <span className="analysis-value">{analysis.cityOrArea}</span>
                            </div>
                        )}
                        <div className="analysis-item">
                            <span className="analysis-label">{t('locationSuggestions.confidence')}:</span>
                            <span 
                                className="analysis-value"
                                style={{ color: getConfidenceColor(analysis.confidence) }}
                            >
                                {getConfidenceText(analysis.confidence)} ({Math.round(analysis.confidence * 100)}%)
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {suggestions.length > 0 && !isLoading && (
                <div className="ai-suggestions">
                    <h4>🤖 AI Suggestions</h4>
                    <div className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <div key={index} className="suggestion-item">
                                <div className="suggestion-header">
                                    <span className="suggestion-icon">
                                        {getLocationIcon(suggestion.type)}
                                    </span>
                                    <div className="suggestion-info">
                                        <h5 className="suggestion-name">{suggestion.name}</h5>
                                        <p className="suggestion-description">{suggestion.description}</p>
                                    </div>
                                    <div className="suggestion-confidence">
                                        <span 
                                            className="confidence-badge"
                                            style={{ backgroundColor: getConfidenceColor(suggestion.confidence) }}
                                        >
                                            {Math.round(suggestion.confidence * 100)}%
                                        </span>
                                    </div>
                                </div>
                                {suggestion.address && (
                                    <div className="suggestion-address">
                                        📍 {suggestion.address}
                                    </div>
                                )}
                                {suggestion.keywords && suggestion.keywords.length > 0 && (
                                    <div className="suggestion-keywords">
                                        {suggestion.keywords.map((keyword, idx) => (
                                            <span key={idx} className="keyword-tag">
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <button 
                                    className="select-location-btn"
                                    onClick={() => handleLocationSelect({
                                        latitude: suggestion.coordinates?.latitude || 0,
                                        longitude: suggestion.coordinates?.longitude || 0,
                                        address: suggestion.address,
                                        name: suggestion.name,
                                        type: suggestion.type,
                                        source: 'ai-suggestion'
                                    })}
                                >
                                    {t('locationSuggestions.selectThisLocation')}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="manual-search">
                <h4>🔍 Manual Search</h4>
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-group">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('locationSuggestions.searchForALocation')}
                            className="search-input"
                        />
                        <button 
                            type="submit" 
                            className="search-btn"
                            disabled={isSearching || !searchQuery.trim()}
                        >
                            {isSearching ? '🔍' : t('locationSuggestions.search')}
                        </button>
                    </div>
                </form>

                {searchResults.length > 0 && (
                    <div className="search-results">
                        <h5>Search Results</h5>
                        <div className="results-list">
                            {searchResults.map((result, index) => (
                                <div key={index} className="result-item">
                                    <div className="result-info">
                                        <h6 className="result-name">{result.name}</h6>
                                        <p className="result-type">Type: {result.type}</p>
                                    </div>
                                    <button 
                                        className="select-result-btn"
                                        onClick={() => handleLocationSelect({
                                            latitude: result.latitude,
                                            longitude: result.longitude,
                                            address: result.address,
                                            name: result.name,
                                            type: result.type,
                                            source: 'manual-search'
                                        })}
                                    >
                                        {t('locationSuggestions.select')}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="suggestions-footer">
                <p className="suggestions-hint">
                    💡 AI analyzes your voice content to suggest relevant locations. You can also search manually.
                </p>
            </div>
        </div>
    );
};

export default LocationSuggestions; 