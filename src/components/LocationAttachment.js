import React, { useState, useEffect } from 'react';
import LocationService from '../services/locationService';
import LocationSuggestions from './LocationSuggestions';
import './LocationAttachment.css';
import { useTranslation } from 'react-i18next';

const LocationAttachment = ({ 
    onLocationChange, 
    initialLocation = null, 
    transcript = null 
}) => {
  const [location, setLocation] = useState(initialLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if geolocation is supported
    if (!LocationService.isSupported()) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    // Check permission status
    LocationService.getPermissionStatus().then(setPermissionStatus);
  }, []);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const locationData = await LocationService.getCurrentLocation();
      setLocation(locationData);
      onLocationChange(locationData);
      
      // Try to get address from coordinates
      const address = await LocationService.getAddressFromCoordinates(
        locationData.latitude, 
        locationData.longitude
      );
      
      if (address) {
        const updatedLocation = {
          ...locationData,
          address
        };
        setLocation(updatedLocation);
        onLocationChange(updatedLocation);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLocation = () => {
    setLocation(null);
    onLocationChange(null);
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    onLocationChange(selectedLocation);
  };

  const getPermissionStatusText = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'Location access granted';
      case 'denied':
        return 'Location access denied';
      case 'prompt':
        return 'Location permission not set';
      default:
        return 'Checking location permission...';
    }
  };

  const getPermissionStatusColor = () => {
    switch (permissionStatus) {
      case 'granted':
        return '#4CAF50';
      case 'denied':
        return '#f44336';
      case 'prompt':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  return (
    <div className="location-attachment">
      <div className="location-header">
        <h3>📍 Location Attachment</h3>
        <div 
          className="permission-status"
          style={{ color: getPermissionStatusColor() }}
        >
          {getPermissionStatusText()}
        </div>
      </div>

      <div className="location-content">
        {location ? (
          <div className="location-display">
            <div className="location-info">
              <div className="location-coordinates">
                <strong>Coordinates:</strong> {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </div>
              {location.accuracy && (
                <div className="location-accuracy">
                  <strong>Accuracy:</strong> ±{Math.round(location.accuracy)} meters
                </div>
              )}
              {location.timestamp && (
                <div className="location-timestamp">
                  <strong>Time:</strong> {new Date(location.timestamp).toLocaleString()}
                </div>
              )}
              {location.address && (
                <div className="location-address">
                  <strong>Address:</strong> {location.address}
                </div>
              )}
              {location.name && (
                <div className="location-name">
                  <strong>Name:</strong> {location.name}
                </div>
              )}
              {location.type && (
                <div className="location-type">
                  <strong>Type:</strong> {location.type}
                </div>
              )}
              {location.source && (
                <div className="location-source">
                  <strong>Source:</strong> {location.source === 'ai-suggestion' ? '🤖 AI Suggestion' : 
                                          location.source === 'manual-search' ? '🔍 Manual Search' : 
                                          '📍 GPS'}
                </div>
              )}
            </div>
            <div className="location-actions">
              <button 
                className="btn btn-secondary"
                onClick={clearLocation}
              >
                {t('locationAttachment.removeLocation')}
              </button>
              <button 
                className="btn btn-primary"
                onClick={getCurrentLocation}
                disabled={isLoading}
              >
                {t('locationAttachment.updateLocation')}
              </button>
              {transcript && (
                <button 
                  className="btn btn-suggest"
                  onClick={() => setShowSuggestions(true)}
                >
                  🤖 {t('locationAttachment.getAISuggestions')}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="location-empty">
            <div className="location-placeholder">
              <span className="location-icon">📍</span>
              <p>{t('locationAttachment.noLocationAttached')}</p>
              <p className="location-hint">{t('locationAttachment.addCurrentLocationHint')}</p>
            </div>
            <div className="location-buttons">
              <button 
                className="btn btn-primary location-btn"
                onClick={getCurrentLocation}
                disabled={isLoading || permissionStatus === 'denied'}
              >
                {isLoading ? t('locationAttachment.gettingLocation') : t('locationAttachment.attachCurrentLocation')}
              </button>
              {transcript && (
                <button 
                  className="btn btn-suggest location-btn"
                  onClick={() => setShowSuggestions(true)}
                >
                  🤖 {t('locationAttachment.aiLocationSuggestions')}
                </button>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="location-error">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
            {permissionStatus === 'denied' && (
              <div className="permission-help">
                <p>{t('locationAttachment.enableLocationAccess')}</p>
                <ul>
                  <li>{t('locationAttachment.clickLocationIcon')}</li>
                  <li>{t('locationAttachment.selectAllow')}</li>
                  <li>{t('locationAttachment.refreshPage')} {t('locationAttachment.tryAgain')}</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="location-loading">
            <div className="loading-spinner"></div>
            <p>{t('locationAttachment.gettingLocation')}</p>
          </div>
        )}
      </div>

      {location && (
        <div className="location-preview">
          <h4>Location Preview</h4>
          <div className="location-text">
            {LocationService.formatLocation(location)}
          </div>
        </div>
      )}

      {/* Location Suggestions Modal */}
      {showSuggestions && (
        <div className="modal-overlay">
          <div className="modal-content">
            <LocationSuggestions
              transcript={transcript}
              currentLocation={location}
              onLocationSelect={handleLocationSelect}
              onClose={() => setShowSuggestions(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationAttachment; 