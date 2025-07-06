import React from 'react';
import { Link } from 'react-router-dom';
import './HomeScreen.css';
import { useTranslation } from 'react-i18next';

const HomeScreen = () => {
    const { t } = useTranslation();

    return (
        <div className="home-screen">
            <div className="hero-section">
                <h1>🤖 AI-Powered Content Creation</h1>
                <p>Transform your ideas into engaging content with advanced AI technology</p>
                <div className="hero-buttons">
                    <Link to="/voice-review" className="hero-button primary">
                        🎤 Start with Voice
                    </Link>
                    <Link to="/review-generator" className="hero-button secondary">
                        ✍️ Create Review
                    </Link>
                    <Link to="/blog-creator" className="hero-button tertiary">
                        📝 Write Blog
                    </Link>
                </div>
            </div>
            
            <div className="features-grid">
                {/* Voice Recognition */}
                <div className="feature-card">
                    <div className="feature-icon">🎤</div>
                    <h3>Voice Recognition</h3>
                    <p>Speak your thoughts and let AI convert them into polished content</p>
                    <Link to="/voice-review" className="feature-link">
                        Try Voice Review →
                    </Link>
                </div>
                
                {/* Review Generator */}
                <div className="feature-card">
                    <div className="feature-icon">✍️</div>
                    <h3>Review Generator</h3>
                    <p>Create compelling reviews with AI-powered enhancement</p>
                    <Link to="/review-generator" className="feature-link">
                        Generate Review →
                    </Link>
                </div>
                
                {/* Blog Creator */}
                <div className="feature-card">
                    <div className="feature-icon">📝</div>
                    <h3>Blog Creator</h3>
                    <p>Write engaging blog posts with AI assistance</p>
                    <Link to="/blog-creator" className="feature-link">
                        Create Blog →
                    </Link>
                </div>
                
                {/* Social Media Posts */}
                <div className="feature-card">
                    <div className="feature-icon">📱</div>
                    <h3>Social Media Posts</h3>
                    <p>Create optimized content for various social platforms</p>
                    <Link to="/social-media" className="feature-link">
                        Create Post →
                    </Link>
                </div>
                
                {/* Customer Service */}
                <div className="feature-card">
                    <div className="feature-icon">👨‍💼</div>
                    <h3>Customer Service</h3>
                    <p>Generate empathetic responses to customer feedback</p>
                    <Link to="/customer-service" className="feature-link">
                        Generate Response →
                    </Link>
                </div>
                
                {/* Enhanced LLM */}
                <div className="feature-card">
                    <div className="feature-icon">🚀</div>
                    <h3>Enhanced LLM</h3>
                    <p>Advanced AI models for superior content quality</p>
                    <Link to="/enhanced-llm" className="feature-link">
                        Try Enhanced LLM →
                    </Link>
                </div>
            </div>
            
            {/* Service Categories */}
            <div className="service-categories">
                <h2>🎯 Content Creation Services</h2>
                <div className="categories-grid">
                    <div className="category-card">
                        <h3>📝 Writing & Content</h3>
                        <ul>
                            <li>Review Generation</li>
                            <li>Blog Post Creation</li>
                            <li>Social Media Content</li>
                            <li>Product Descriptions</li>
                        </ul>
                    </div>
                    <div className="category-card">
                        <h3>🎤 Voice & Audio</h3>
                        <ul>
                            <li>Voice-to-Text Conversion</li>
                            <li>Audio Content Analysis</li>
                            <li>Voice Review Generation</li>
                            <li>Speech Enhancement</li>
                        </ul>
                    </div>
                    <div className="category-card">
                        <h3>🤖 AI Enhancement</h3>
                        <ul>
                            <li>Content Quality Analysis</li>
                            <li>Engagement Optimization</li>
                            <li>Style & Tone Adjustment</li>
                            <li>Multi-platform Optimization</li>
                        </ul>
                    </div>
                    <div className="category-card">
                        <h3>💼 Business Solutions</h3>
                        <ul>
                            <li>Customer Service Responses</li>
                            <li>Marketing Content</li>
                            <li>Brand Voice Consistency</li>
                            <li>Content Strategy</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="cta-section">
                <h2>🚀 Ready to Create Amazing Content?</h2>
                <p>Choose your preferred method and start creating engaging content today</p>
                <div className="cta-buttons">
                    <Link to="/voice-review" className="cta-button primary">
                        🎤 Start with Voice
                    </Link>
                    <Link to="/review-generator" className="cta-button secondary">
                        ✍️ Write Review
                    </Link>
                    <Link to="/blog-creator" className="cta-button tertiary">
                        📝 Create Blog
                    </Link>
                    <Link to="/social-media" className="cta-button quaternary">
                        📱 Social Media
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;