import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ReviewGenerator from './screens/ReviewGenerator';
import VoiceReview from './screens/VoiceReview';
import VoiceTest from './screens/VoiceTest';
import ReviewHistory from './screens/ReviewHistory';
import Llma from './components/Llma';
import Header from './components/Header';
import CustomerServiceResponse from './screens/CustomerServiceResponse';
import ModelsInfo from './screens/ModelsInfo';
import BlogIndex from './screens/BlogIndex';
import BlogPost from './screens/BlogPost';
import BlogCreator from './screens/BlogCreator';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Switch>
          <Route path="/" exact component={HomeScreen} />
          <Route path="/generate" component={ReviewGenerator} />
          <Route path="/voice" component={VoiceReview} />
          <Route path="/voice-test" component={VoiceTest} />
          <Route path="/history" component={ReviewHistory} />
          <Route path="/llama" component={Llma} />
          <Route path="/customer-service-response" component={CustomerServiceResponse} />
          <Route path="/models" component={ModelsInfo} />
          <Route path="/blog" exact component={BlogIndex} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/blog-creator" component={BlogCreator} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;