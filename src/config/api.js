// API Configuration
const API_CONFIG = {
  // Development environment
  development: {
    baseURL: 'http://localhost:3001/api',
    timeout: 30000
  },
  // Production environment (Render backend)
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://your-render-app.onrender.com/api',
    timeout: 30000
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate config
export const apiConfig = API_CONFIG[environment];

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${apiConfig.baseURL}${endpoint}`;
};

// Default export
export default apiConfig; 