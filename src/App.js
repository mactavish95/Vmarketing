import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ModelsInfo from './screens/ModelsInfo';
import SocialMediaPost from './screens/SocialMediaPost';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/llama" element={<Llma />} />
          <Route path="/enhanced-llm" element={<EnhancedLLM />} />
          <Route path="/voice-review" element={<VoiceReview />} />
          <Route path="/review-generator" element={<ReviewGenerator />} />
          <Route path="/review-history" element={<ReviewHistory />} />
          <Route path="/blog-creator" element={<BlogCreator />} />
          <Route path="/blog-index" element={<BlogIndex />} />
          <Route path="/blog-post" element={<BlogPost />} />
          <Route path="/customer-service" element={<CustomerServiceResponse />} />
          <Route path="/voice-test" element={<VoiceTest />} />
          <Route path="/models-info" element={<ModelsInfo />} />
          <Route path="/social-media" element={<SocialMediaPost />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;