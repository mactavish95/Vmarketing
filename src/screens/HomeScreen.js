import React from 'react';
import { Link } from 'react-router-dom';
import './HomeScreen.css';
import { useTranslation } from 'react-i18next';

const HomeScreen = () => {
    const { t } = useTranslation();

    return (
        <div className="home-screen">
            <div className="hero-section">
                <h1>{t('homeScreen.welcome')}</h1>
                <p>{t('homeScreen.description')}</p>
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
                    <h3>{t('homeScreen.feature1Title')}</h3>
                    <p>{t('homeScreen.feature1Description')}</p>
                    <Link to="/generate" className="feature-link">
                        {t('homeScreen.generateReviews')} →
                    </Link>
                </div>
                
                {/* Voice Reviews */}
                <div className="feature-card">
                    <div className="feature-icon">🎤</div>
                    <h3>{t('homeScreen.feature2Title')}</h3>
                    <p>{t('homeScreen.feature2Description')}</p>
                    <Link to="/voice" className="feature-link">
                        {t('homeScreen.tryVoiceReview')} →
                    </Link>
                </div>
                
                {/* Customer Service Responses */}
                <div className="feature-card">
                    <div className="feature-icon">💬</div>
                    <h3>{t('homeScreen.feature3Title')}</h3>
                    <p>{t('homeScreen.feature3Description')}</p>
                    <Link to="/customer-service-response" className="feature-link">
                        {t('homeScreen.chattyAgent')} →
                    </Link>
                </div>
                
                {/* Blog Creator */}
                <div className="feature-card">
                    <div className="feature-icon">📝</div>
                    <h3>{t('homeScreen.feature4Title')}</h3>
                    <p>{t('homeScreen.feature4Description')}</p>
                    <Link to="/blog-creator" className="feature-link">
                        {t('homeScreen.createBlogPosts')} →
                    </Link>
                </div>
                
                {/* AI Models */}
                <div className="feature-card">
                    <div className="feature-icon">🧠</div>
                    <h3>{t('homeScreen.feature5Title')}</h3>
                    <p>{t('homeScreen.feature5Description')}</p>
                    <Link to="/models" className="feature-link">
                        {t('homeScreen.viewModels')} →
                    </Link>
                </div>
                
                {/* Review History */}
                <div className="feature-card">
                    <div className="feature-icon">📚</div>
                    <h3>{t('homeScreen.feature6Title')}</h3>
                    <p>{t('homeScreen.feature6Description')}</p>
                    <Link to="/history" className="feature-link">
                        {t('homeScreen.viewHistory')} →
                    </Link>
                </div>
                
                {/* Restaurant Reviews */}
                <div className="feature-card">
                    <div className="feature-icon">🍽️</div>
                    <h3>{t('homeScreen.feature7Title')}</h3>
                    <p>{t('homeScreen.feature7Description')}</p>
                    <Link to="/generate" className="feature-link">
                        {t('homeScreen.writeRestaurantReview')} →
                    </Link>
                </div>
                
                {/* Hotel Reviews */}
                <div className="feature-card">
                    <div className="feature-icon">🏨</div>
                    <h3>{t('homeScreen.feature8Title')}</h3>
                    <p>{t('homeScreen.feature8Description')}</p>
                    <Link to="/generate" className="feature-link">
                        {t('homeScreen.writeHotelReview')} →
                    </Link>
                </div>
                
                {/* Product Reviews */}
                <div className="feature-card">
                    <div className="feature-icon">📱</div>
                    <h3>{t('homeScreen.feature9Title')}</h3>
                    <p>{t('homeScreen.feature9Description')}</p>
                    <Link to="/generate" className="feature-link">
                        {t('homeScreen.writeProductReview')} →
                    </Link>
                </div>
                
                {/* Service Reviews */}
                <div className="feature-card">
                    <div className="feature-icon">🛠️</div>
                    <h3>{t('homeScreen.feature10Title')}</h3>
                    <p>{t('homeScreen.feature10Description')}</p>
                    <Link to="/generate" className="feature-link">
                        {t('homeScreen.writeServiceReview')} →
                    </Link>
                </div>
                
                {/* Blog Index */}
                <div className="feature-card">
                    <div className="feature-icon">📖</div>
                    <h3>{t('homeScreen.feature11Title')}</h3>
                    <p>{t('homeScreen.feature11Description')}</p>
                    <Link to="/blog" className="feature-link">
                        {t('homeScreen.readBlog')} →
                    </Link>
                </div>
                
                {/* Enhanced LLM */}
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>{t('homeScreen.feature12Title')}</h3>
                    <p>{t('homeScreen.feature12Description')}</p>
                    <Link to="/llama" className="feature-link">
                        {t('homeScreen.tryEnhancedChat')} →
                    </Link>
                </div>
            </div>
            
            {/* Service Categories */}
            <div className="service-categories">
                <h2>{t('homeScreen.serviceCategoriesTitle')}</h2>
                <div className="categories-grid">
                    <div className="category-card">
                        <h3>{t('homeScreen.category1Title')}</h3>
                        <ul>
                            <li>{t('homeScreen.category1Item1')}</li>
                            <li>{t('homeScreen.category1Item2')}</li>
                            <li>{t('homeScreen.category1Item3')}</li>
                            <li>{t('homeScreen.category1Item4')}</li>
                        </ul>
                    </div>
                    <div className="category-card">
                        <h3>{t('homeScreen.category2Title')}</h3>
                        <ul>
                            <li>{t('homeScreen.category2Item1')}</li>
                            <li>{t('homeScreen.category2Item2')}</li>
                            <li>{t('homeScreen.category2Item3')}</li>
                            <li>{t('homeScreen.category2Item4')}</li>
                        </ul>
                    </div>
                    <div className="category-card">
                        <h3>{t('homeScreen.category3Title')}</h3>
                        <ul>
                            <li>{t('homeScreen.category3Item1')}</li>
                            <li>{t('homeScreen.category3Item2')}</li>
                            <li>{t('homeScreen.category3Item3')}</li>
                            <li>{t('homeScreen.category3Item4')}</li>
                        </ul>
                    </div>
                    <div className="category-card">
                        <h3>{t('homeScreen.category4Title')}</h3>
                        <ul>
                            <li>{t('homeScreen.category4Item1')}</li>
                            <li>{t('homeScreen.category4Item2')}</li>
                            <li>{t('homeScreen.category4Item3')}</li>
                            <li>{t('homeScreen.category4Item4')}</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="cta-section">
                <h2>{t('homeScreen.getStartedTitle')}</h2>
                <p>{t('homeScreen.getStartedDescription')}</p>
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