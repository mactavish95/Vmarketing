import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import HomeScreen from './screens/HomeScreen';
import Llma from './components/Llma';
import EnhancedLLM from './components/EnhancedLLM';
import VoiceReview from './screens/VoiceReview';
import ReviewGenerator from './screens/ReviewGenerator';
import ReviewHistory from './screens/ReviewHistory';
import BlogCreator from './screens/BlogCreator';
import BlogIndex from './screens/BlogIndex';
import BlogPost from './screens/BlogPost';
import CustomerServiceResponse from './screens/CustomerServiceResponse';
import VoiceTest from './screens/VoiceTest';
import SocialMediaPost from './screens/SocialMediaPost';
import SocialMediaPostHistory from './screens/SocialMediaPostHistory';
import SocialMediaIntegrationScreen from './screens/SocialMediaIntegrationScreen';
import Login from './screens/account/Login';
import Signup from './screens/account/Signup';
import Dashboard from './screens/Dashboard';
import CookieDebug from './components/CookieDebug';

// Dummy useAuth hook (replace with real auth logic)
function useAuth() {
  // Replace with real authentication logic
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  React.useEffect(() => {
    // Example: check session or cookie
    fetch('/api/auth/session', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setIsAuthenticated(!!data.user))
      .catch(() => setIsAuthenticated(false));
  }, []);
  return { isAuthenticated };
}

function App() {
  const { isAuthenticated } = useAuth();
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<HomeScreen />} />
          <Route path="/llama" element={<Llma />} />
          <Route path="/enhanced-llm" element={<EnhancedLLM />} />
          <Route path="/voice-review" element={<VoiceReview />} />
          <Route path="/voice" element={<VoiceReview />} />
          <Route path="/review-generator" element={<ReviewGenerator />} />
          <Route path="/generate" element={<ReviewGenerator />} />
          <Route path="/review-history" element={<ReviewHistory />} />
          <Route path="/history" element={<ReviewHistory />} />
          <Route path="/blog-creator" element={<BlogCreator />} />
          <Route path="/blog-index" element={<BlogIndex />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog-post/:slug" element={<BlogPost />} />
          <Route path="/customer-service" element={<CustomerServiceResponse />} />
          <Route path="/voice-test" element={<VoiceTest />} />
          <Route path="/social-media" element={<SocialMediaPost />} />
          <Route path="/social-media-history" element={<SocialMediaPostHistory />} />
          <Route path="/social-media-integration" element={<SocialMediaIntegrationScreen />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/debug" element={<CookieDebug />} />
          {/* Protected routes example */}
          <Route path="/social" element={isAuthenticated ? <SocialMediaIntegrationScreen /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;