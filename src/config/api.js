// API Configuration
const API_CONFIG = {
  // Development environment
  development: {
    baseURL: 'http://localhost:10000/api',
    timeout: 30000
  },
  // Production environment (Render backend)
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://vmarketing-backend-server.onrender.com/api',
    timeout: 30000
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate config
export const apiConfig = API_CONFIG[environment];

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  console.log('🔧 API Config Debug:', {
    environment: process.env.NODE_ENV,
    baseURL: apiConfig.baseURL,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL
  });
  
  if (!apiConfig.baseURL || apiConfig.baseURL.includes('your-render-app')) {
    console.warn('⚠️ API URL not configured. Please set REACT_APP_API_URL environment variable.');
    return null;
  }
  return `${apiConfig.baseURL}${endpoint}`;
};

// Default export
export default apiConfig; 