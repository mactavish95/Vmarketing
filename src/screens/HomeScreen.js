import React from 'react';
import { Link } from 'react-router-dom';
import './HomeScreen.css';

const HomeScreen = () => {
    return (
        <div className="home-screen">
            <div className="hero-section">
                <h1>ReviewGen AI Platform</h1>
                <p>Your complete AI-powered solution for reviews, customer service, and content creation</p>
                <div className="hero-buttons">
                    <Link to="/generate" className="hero-button primary">
                        ✍️ AI Review Generator
                    </Link>
                    <Link to="/voice" className="hero-button secondary">
                        🎤 Voice Reviews
                    </Link>
                    <Link to="/blog-creator" className="hero-button tertiary">
                        📝 Blog Creator
                    </Link>
                </div>
            </div>
            
            <div className="features-grid">
                {/* AI Review Generation */}
                <div className="feature-card">
                    <div className="feature-icon">🤖</div>
                    <h3>AI Review Generator</h3>
                    <p>Create professional reviews with Meta Llama 3.1 70B AI. Choose from 8 review types with smart rating suggestions.</p>
                    <Link to="/generate" className="feature-link">
                        Generate Reviews →
                    </Link>
                </div>
                
                {/* Voice Reviews */}
                <div className="feature-card">
                    <div className="feature-icon">🎤</div>
                    <h3>Voice Reviews</h3>
                    <p>Speak your thoughts and let AI transcribe, analyze, and generate reviews with sentiment detection.</p>
                    <Link to="/voice" className="feature-link">
                        Try Voice Review →
                    </Link>
                </div>
                
                {/* Customer Service Responses */}
                <div className="feature-card">
                    <div className="feature-icon">💬</div>
                    <h3>Chatty Customer Service</h3>
                    <p>Transform negative reviews into friendly conversations with our empathetic AI relationship agent.</p>
                    <Link to="/customer-service-response" className="feature-link">
                        Chatty Agent →
                    </Link>
                </div>
                
                {/* Blog Creator */}
                <div className="feature-card">
                    <div className="feature-icon">📝</div>
                    <h3>Restaurant Blog Creator</h3>
                    <p>Generate engaging blog content for your restaurant business with AI-powered writing assistance.</p>
                    <Link to="/blog-creator" className="feature-link">
                        Create Blog Posts →
                    </Link>
                </div>
                
                {/* AI Models */}
                <div className="feature-card">
                    <div className="feature-icon">🧠</div>
                    <h3>AI Models Hub</h3>
                    <p>Explore specialized LLM models for different use cases - reviews, customer service, and analysis.</p>
                    <Link to="/models" className="feature-link">
                        View Models →
                    </Link>
                </div>
                
                {/* Review History */}
                <div className="feature-card">
                    <div className="feature-icon">📚</div>
                    <h3>Review History</h3>
                    <p>Access your complete review history with search, filter, and management capabilities.</p>
                    <Link to="/history" className="feature-link">
                        View History →
                    </Link>
                </div>
                
                {/* Restaurant Reviews */}
                <div className="feature-card">
                    <div className="feature-icon">🍽️</div>
                    <h3>Restaurant Reviews</h3>
                    <p>Create compelling restaurant reviews covering food quality, service, ambiance, and location.</p>
                    <Link to="/generate" className="feature-link">
                        Write Restaurant Review →
                    </Link>
                </div>
                
                {/* Hotel Reviews */}
                <div className="feature-card">
                    <div className="feature-icon">🏨</div>
                    <h3>Hotel Reviews</h3>
                    <p>Generate comprehensive hotel reviews including amenities, comfort, and location details.</p>
                    <Link to="/generate" className="feature-link">
                        Write Hotel Review →
                    </Link>
                </div>
                
                {/* Product Reviews */}
                <div className="feature-card">
                    <div className="feature-icon">📱</div>
                    <h3>Product Reviews</h3>
                    <p>Create detailed product reviews with features, benefits, and real-world usage experiences.</p>
                    <Link to="/generate" className="feature-link">
                        Write Product Review →
                    </Link>
                </div>
                
                {/* Service Reviews */}
                <div className="feature-card">
                    <div className="feature-icon">🛠️</div>
                    <h3>Service Reviews</h3>
                    <p>Generate professional service reviews for any business, contractor, or service provider.</p>
                    <Link to="/generate" className="feature-link">
                        Write Service Review →
                    </Link>
                </div>
                
                {/* Blog Index */}
                <div className="feature-card">
                    <div className="feature-icon">📖</div>
                    <h3>Blog & Resources</h3>
                    <p>Access our blog library with guides, tips, and insights on AI-powered review generation.</p>
                    <Link to="/blog" className="feature-link">
                        Read Blog →
                    </Link>
                </div>
                
                {/* Enhanced LLM */}
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Enhanced LLM Chat</h3>
                    <p>Advanced AI conversation with multiple models, quality analysis, and response comparison.</p>
                    <Link to="/llama" className="feature-link">
                        Try Enhanced Chat →
                    </Link>
                </div>
            </div>
            
            {/* Service Categories */}
            <div className="service-categories">
                <h2>Service Categories</h2>
                <div className="categories-grid">
                    <div className="category-card">
                        <h3>🎯 Review Generation</h3>
                        <ul>
                            <li>AI-powered review creation</li>
                            <li>8 different review types</li>
                            <li>Smart rating suggestions</li>
                            <li>Location integration</li>
                        </ul>
                    </div>
                    <div className="category-card">
                        <h3>🎤 Voice Features</h3>
                        <ul>
                            <li>Voice-to-text transcription</li>
                            <li>Sentiment analysis</li>
                            <li>Voice review generation</li>
                            <li>LLM enhancement</li>
                        </ul>
                    </div>
                    <div className="category-card">
                        <h3>💬 Customer Service</h3>
                        <ul>
                            <li>Chatty AI responses</li>
                            <li>Negative review handling</li>
                            <li>Empathetic conversations</li>
                            <li>Relationship building</li>
                        </ul>
                    </div>
                    <div className="category-card">
                        <h3>📝 Content Creation</h3>
                        <ul>
                            <li>Restaurant blog posts</li>
                            <li>AI-powered writing</li>
                            <li>Content customization</li>
                            <li>Blog management</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="cta-section">
                <h2>Ready to Get Started?</h2>
                <p>Choose your preferred way to create amazing content with AI</p>
                <div className="cta-buttons">
                    <Link to="/generate" className="cta-button primary">
                        🤖 AI Review Generator
                    </Link>
                    <Link to="/voice" className="cta-button secondary">
                        🎤 Voice Reviews
                    </Link>
                    <Link to="/blog-creator" className="cta-button tertiary">
                        📝 Blog Creator
                    </Link>
                    <Link to="/customer-service-response" className="cta-button quaternary">
                        💬 Chatty Agent
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;