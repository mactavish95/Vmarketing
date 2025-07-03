import React, { useState, useEffect } from 'react';
import LocationService from '../services/locationService';
import LocationSuggestions from './LocationSuggestions';
import './LocationAttachment.css';

const LocationAttachment = ({ 
    onLocationChange, 
    initialLocation = null, 
    transcript = null, 
    apiKey = null 
}) => {
  const [location, setLocation] = useState(initialLocation);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('prompt');
  const [showSuggestions, setShowSuggestions] = useState(false);

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
                Remove Location
              </button>
              <button 
                className="btn btn-primary"
                onClick={getCurrentLocation}
                disabled={isLoading}
              >
                Update Location
              </button>
              {transcript && apiKey && (
                <button 
                  className="btn btn-suggest"
                  onClick={() => setShowSuggestions(true)}
                >
                  🤖 Get AI Suggestions
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="location-empty">
            <div className="location-placeholder">
              <span className="location-icon">📍</span>
              <p>No location attached</p>
              <p className="location-hint">Add your current location or get AI suggestions based on your voice input</p>
            </div>
            <div className="location-buttons">
              <button 
                className="btn btn-primary location-btn"
                onClick={getCurrentLocation}
                disabled={isLoading || permissionStatus === 'denied'}
              >
                {isLoading ? 'Getting Location...' : '📍 Attach Current Location'}
              </button>
              {transcript && apiKey && (
                <button 
                  className="btn btn-suggest location-btn"
                  onClick={() => setShowSuggestions(true)}
                >
                  🤖 AI Location Suggestions
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
                <p>To enable location access:</p>
                <ul>
                  <li>Click the location icon in your browser's address bar</li>
                  <li>Select "Allow" for location access</li>
                  <li>Refresh the page and try again</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div className="location-loading">
            <div className="loading-spinner"></div>
            <p>Getting your location...</p>
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
              apiKey={apiKey}
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