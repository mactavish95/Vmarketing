import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={HomeScreen} />
          <Route path="/llama" component={Llma} />
          <Route path="/enhanced-llm" component={EnhancedLLM} />
          <Route path="/voice-review" component={VoiceReview} />
          <Route path="/voice" component={VoiceReview} />
          <Route path="/review-generator" component={ReviewGenerator} />
          <Route path="/generate" component={ReviewGenerator} />
          <Route path="/review-history" component={ReviewHistory} />
          <Route path="/history" component={ReviewHistory} />
          <Route path="/blog-creator" component={BlogCreator} />
          <Route path="/blog-index" component={BlogIndex} />
          <Route path="/blog" component={BlogIndex} />
          <Route path="/blog-post/:slug" component={BlogPost} />
          <Route path="/customer-service" component={CustomerServiceResponse} />
          <Route path="/voice-test" component={VoiceTest} />
          <Route path="/social-media" component={SocialMediaPost} />
          <Route path="/social-media-history" component={SocialMediaPostHistory} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;