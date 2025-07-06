class LocationService {
    /**
     * Get current location using browser geolocation API
     * @param {Object} options - Geolocation options
     * @returns {Promise<Object>} Location data
     */
    static async getCurrentLocation(options = {}) {
        const defaultOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        };

        const finalOptions = { ...defaultOptions, ...options };

        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: new Date(position.timestamp).toISOString(),
                        address: null
                    };
                    resolve(locationData);
                },
                (error) => {
                    let errorMessage;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information is unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out.';
                            break;
                        default:
                            errorMessage = 'An unknown error occurred while getting location.';
                    }
                    reject(new Error(errorMessage));
                },
                finalOptions
            );
        });
    }

    /**
     * Get address from coordinates using reverse geocoding
     * @param {number} latitude - Latitude coordinate
     * @param {number} longitude - Longitude coordinate
     * @returns {Promise<string|null>} Address string or null
     */
    static async getAddressFromCoordinates(latitude, longitude) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch address');
            }
            
            const data = await response.json();
            return data.display_name || null;
        } catch (error) {
            console.warn('Could not fetch address:', error);
            return null;
        }
    }

    /**
     * Check if geolocation is supported
     * @returns {boolean} True if supported
     */
    static isSupported() {
        return !!navigator.geolocation;
    }

    /**
     * Check geolocation permission status
     * @returns {Promise<string>} Permission status
     */
    static async getPermissionStatus() {
        if (!navigator.permissions || !navigator.permissions.query) {
            return 'prompt';
        }

        try {
            const result = await navigator.permissions.query({ name: 'geolocation' });
            return result.state;
        } catch (error) {
            console.warn('Could not check permission status:', error);
            return 'prompt';
        }
    }

    /**
     * Format location data for display
     * @param {Object} location - Location data object
     * @returns {string} Formatted location string
     */
    static formatLocation(location) {
        if (!location) return '';
        
        const coords = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
        const accuracy = location.accuracy ? ` (±${Math.round(location.accuracy)}m)` : '';
        const address = location.address ? `\n${location.address}` : '';
        
        return `${coords}${accuracy}${address}`;
    }

    /**
     * Calculate distance between two coordinates in meters
     * @param {number} lat1 - First latitude
     * @param {number} lon1 - First longitude
     * @param {number} lat2 - Second latitude
     * @param {number} lon2 - Second longitude
     * @returns {number} Distance in meters
     */
    static calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    /**
     * Validate coordinates
     * @param {number} latitude - Latitude to validate
     * @param {number} longitude - Longitude to validate
     * @returns {boolean} True if coordinates are valid
     */
    static validateCoordinates(latitude, longitude) {
        return (
            typeof latitude === 'number' &&
            typeof longitude === 'number' &&
            latitude >= -90 && latitude <= 90 &&
            longitude >= -180 && longitude <= 180
        );
    }

    /**
     * Get location suggestions based on voice content
     * @param {string} transcript - Voice transcript to analyze
     * @param {string} apiKey - NVIDIA API key
     * @param {Object} currentLocation - Current location data (optional)
     * @returns {Promise<Object>} Location suggestions and analysis
     */
    static async getLocationSuggestions(transcript, currentLocation = null) {
        try {
            // Force production URL if we're on Netlify
            const isNetlify = typeof window !== 'undefined' && (window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app'));
            const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : 'http://localhost:10000/api';
            
            const response = await fetch(`${baseURL}/voice/suggest-location`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transcript,
                    currentLocation
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to get location suggestions');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Location suggestion error:', error);
            throw error;
        }
    }

    /**
     * Search for locations using OpenStreetMap Nominatim
     * @param {string} query - Search query
     * @param {number} limit - Maximum number of results
     * @returns {Promise<Array>} Array of location results
     */
    static async searchLocations(query, limit = 5) {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=${limit}&addressdetails=1`
            );
            
            if (!response.ok) {
                throw new Error('Failed to search locations');
            }
            
            const data = await response.json();
            return data.map(item => ({
                name: item.display_name,
                type: item.type,
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
                address: item.display_name,
                importance: item.importance
            }));
        } catch (error) {
            console.warn('Could not search locations:', error);
            return [];
        }
    }
}

export default LocationService; 