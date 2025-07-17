import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HomeScreen.css';
import { useTranslation } from 'react-i18next';

const HomeScreen = () => {
    const { t } = useTranslation();
    const [currentFeature, setCurrentFeature] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % 6);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        { icon: '🎤', title: t('homeScreen.voiceRecognitionTitle'), desc: t('homeScreen.voiceRecognitionDescription'), link: '/voice-review' },
        { icon: '✍️', title: t('homeScreen.reviewGeneratorTitle'), desc: t('homeScreen.reviewGeneratorDescription'), link: '/review-generator' },
        { icon: '📝', title: t('homeScreen.blogCreatorTitle'), desc: t('homeScreen.blogCreatorDescription'), link: '/blog-creator' },
        { icon: '📱', title: t('homeScreen.socialMediaPostsTitle'), desc: t('homeScreen.socialMediaPostsDescription'), link: '/social-media' },
        { icon: '👨‍💼', title: t('homeScreen.customerServiceTitle'), desc: t('homeScreen.customerServiceDescription'), link: '/customer-service' },
        { icon: '🚀', title: t('homeScreen.enhancedLLMTitle'), desc: t('homeScreen.enhancedLLMDescription'), link: '/enhanced-llm' }
    ];

    return (
        <div className={`home-screen ${isVisible ? 'visible' : ''}`}>
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-background">
                    <div className="hero-particles"></div>
                </div>
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-icon">✨</span>
                        <span className="badge-text">AI-Powered Content Creation</span>
                    </div>
                    <h1 className="hero-title">
                        <span className="title-line">Transform Your</span>
                        <span className="title-highlight">Voice & Ideas</span>
                        <span className="title-line">Into Amazing Content</span>
                    </h1>
                    <p className="hero-subtitle">
                        Create engaging reviews, blog posts, and social media content with the power of AI. 
                        From voice recognition to intelligent content generation - everything you need in one place.
                    </p>
                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-number">10K+</span>
                            <span className="stat-label">Content Created</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">98%</span>
                            <span className="stat-label">Accuracy Rate</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">AI Available</span>
                        </div>
                    </div>
                    <div className="hero-actions">
                        <Link to="/voice-review" className="hero-btn primary">
                            <span className="btn-icon">🎤</span>
                            <span className="btn-text">Start with Voice</span>
                            <span className="btn-arrow">→</span>
                        </Link>
                        <Link to="/review-generator" className="hero-btn secondary">
                            <span className="btn-icon">✍️</span>
                            <span className="btn-text">Write Review</span>
                        </Link>
                        <Link to="/blog-creator" className="hero-btn tertiary">
                            <span className="btn-icon">📝</span>
                            <span className="btn-text">Create Blog</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2 className="cta-title">Ready to Transform Your Content Creation?</h2>
                        <p className="cta-subtitle">Join creators network who are already using our AI-powered tools</p>
                        <div className="cta-actions">
                            <Link to="/voice-review" className="cta-btn primary">
                                <span className="btn-icon">🚀</span>
                                <span className="btn-text">Start Creating Now</span>
                                <span className="btn-arrow">→</span>
                            </Link>
                            <Link to="/social-media" className="cta-btn secondary">
                                <span className="btn-icon">📱</span>
                                <span className="btn-text">Start Publishing</span>
                            </Link>
                        </div>
                        <div className="cta-features">
                            <div className="feature-tag">✨ Free to Start</div>
                            <div className="feature-tag">🔒 Secure & Private</div>
                            <div className="feature-tag">📱 Mobile Optimized</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Showcase */}
            <section className="features-showcase">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Everything You Need to Create Amazing Content</h2>
                        <p className="section-subtitle">Powerful tools designed to make content creation effortless and engaging</p>
                    </div>
                    
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className={`feature-card ${index === currentFeature ? 'active' : ''}`}>
                                <div className="feature-icon-wrapper">
                                    <span className="feature-icon">{feature.icon}</span>
                                </div>
                                <div className="feature-content">
                                    <h3 className="feature-title">{feature.title}</h3>
                                    <p className="feature-description">{feature.desc}</p>
                                    <Link to={feature.link} className="feature-link">
                                        <span>Get Started</span>
                                        <span className="link-arrow">→</span>
                                    </Link>
                                </div>
                                <div className="feature-bg"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">Three simple steps to create professional content</p>
                    </div>
                    
                    <div className="steps-container">
                        <div className="step-item">
                            <div className="step-number">1</div>
                            <div className="step-icon">🎤</div>
                            <h3 className="step-title">Speak or Type</h3>
                            <p className="step-description">Use voice recognition or type your ideas. Our AI understands natural language.</p>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-item">
                            <div className="step-number">2</div>
                            <div className="step-icon">🤖</div>
                            <h3 className="step-title">AI Processing</h3>
                            <p className="step-description">Advanced AI analyzes your content and enhances it for maximum engagement.</p>
                        </div>
                        <div className="step-connector"></div>
                        <div className="step-item">
                            <div className="step-number">3</div>
                            <div className="step-icon">✨</div>
                            <h3 className="step-title">Perfect Content</h3>
                            <p className="step-description">Get polished, platform-optimized content ready to publish anywhere.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Service Categories */}
            <section className="service-categories">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Complete Content Creation Suite</h2>
                        <p className="section-subtitle">Everything you need for modern content marketing</p>
                    </div>
                    
                    <div className="categories-grid">
                        <div className="category-card writing">
                            <div className="category-header">
                                <div className="category-icon">📝</div>
                                <h3 className="category-title">Writing & Content</h3>
                            </div>
                            <ul className="category-features">
                                <li>Review Generation</li>
                                <li>Blog Post Creation</li>
                                <li>Social Media Content</li>
                                <li>Product Descriptions</li>
                            </ul>
                            <div className="category-footer">
                                <span className="feature-count">4 Tools</span>
                            </div>
                        </div>
                        
                        <div className="category-card voice">
                            <div className="category-header">
                                <div className="category-icon">🎤</div>
                                <h3 className="category-title">Voice & Audio</h3>
                            </div>
                            <ul className="category-features">
                                <li>Voice-to-Text Conversion</li>
                                <li>Audio Content Analysis</li>
                                <li>Voice Review Generation</li>
                                <li>Speech Enhancement</li>
                            </ul>
                            <div className="category-footer">
                                <span className="feature-count">4 Tools</span>
                            </div>
                        </div>
                        
                        <div className="category-card ai">
                            <div className="category-header">
                                <div className="category-icon">🤖</div>
                                <h3 className="category-title">AI Enhancement</h3>
                            </div>
                            <ul className="category-features">
                                <li>Content Quality Analysis</li>
                                <li>Engagement Optimization</li>
                                <li>Style & Tone Adjustment</li>
                                <li>Multi-Platform Optimization</li>
                            </ul>
                            <div className="category-footer">
                                <span className="feature-count">4 Tools</span>
                            </div>
                        </div>
                        
                        <div className="category-card business">
                            <div className="category-header">
                                <div className="category-icon">💼</div>
                                <h3 className="category-title">Business Solutions</h3>
                            </div>
                            <ul className="category-features">
                                <li>Customer Service Responses</li>
                                <li>Marketing Content</li>
                                <li>Brand Voice Consistency</li>
                                <li>Content Strategy</li>
                            </ul>
                            <div className="category-footer">
                                <span className="feature-count">4 Tools</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Loved by Content Creators</h2>
                        <p className="section-subtitle">See what our users are saying</p>
                    </div>
                    
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <p>"This app has revolutionized how I create content. The voice recognition is incredibly accurate!"</p>
                            </div>
                            <div className="testimonial-author">
                                <div className="author-avatar">👩‍💼</div>
                                <div className="author-info">
                                    <h4>Sarah Johnson</h4>
                                    <span>Content Creator</span>
                                </div>
                                <div className="rating">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>
                        
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <p>"The AI enhancement features are game-changing. My engagement rates have doubled!"</p>
                            </div>
                            <div className="testimonial-author">
                                <div className="author-avatar">👨‍💻</div>
                                <div className="author-info">
                                    <h4>Mike Chen</h4>
                                    <span>Digital Marketer</span>
                                </div>
                                <div className="rating">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>
                        
                        <div className="testimonial-card">
                            <div className="testimonial-content">
                                <p>"Perfect for creating consistent brand voice across all platforms. Highly recommended!"</p>
                            </div>
                            <div className="testimonial-author">
                                <div className="author-avatar">👩‍🎨</div>
                                <div className="author-info">
                                    <h4>Emma Davis</h4>
                                    <span>Brand Manager</span>
                                </div>
                                <div className="rating">⭐⭐⭐⭐⭐</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomeScreen;