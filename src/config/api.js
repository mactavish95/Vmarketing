// API Configuration
const API_CONFIG = {
  // Development environment
  development: {
    baseURL: 'http://localhost:3001/api',
    timeout: 30000
  },
  // Production environment (Render backend)
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://vmarketing-backend-server.onrender.com/api',
    timeout: 30000
  }
};

// Get current environment - force production if we're on Netlify
const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
const environment = isNetlify ? 'production' : (process.env.NODE_ENV || 'development');

// Export the appropriate config
export const apiConfig = API_CONFIG[environment];

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  console.log('🔧 API Config Debug:', {
    environment: process.env.NODE_ENV,
    isNetlify: window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app'),
    hostname: window.location.hostname,
    baseURL: apiConfig.baseURL,
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    selectedEnvironment: environment
  });
  
  if (!apiConfig.baseURL || apiConfig.baseURL.includes('your-render-app')) {
    console.warn('⚠️ API URL not configured. Please set REACT_APP_API_URL environment variable.');
    return null;
  }
  // Ensure only one slash between baseURL and endpoint
  let base = apiConfig.baseURL;
  let ep = endpoint || '';
  if (base.endsWith('/') && ep.startsWith('/')) {
    ep = ep.substring(1);
  } else if (!base.endsWith('/') && !ep.startsWith('/')) {
    base += '/';
  }
  return base + ep;
};

// Default export
export default apiConfig; 