import React from 'react';
import { Link } from 'react-router-dom';
import './HomeScreen.css';
import { useTranslation } from 'react-i18next';

const HomeScreen = () => {
    const { t } = useTranslation();

    return (
        <div className="home-screen">
            <div className="hero-section">
                <h1>🤖 {t('homeScreen.heroTitle')}</h1>
                <p>{t('homeScreen.heroSubtitle')}</p>
                <div className="hero-buttons">
                    <Link to="/voice-review" className="hero-button primary">
                        🎤 {t('homeScreen.startWithVoice')}
                    </Link>
                    <Link to="/review-generator" className="hero-button secondary">
                        ✍️ {t('homeScreen.createReview')}
                    </Link>
                    <Link to="/blog-creator" className="hero-button tertiary">
                        📝 {t('homeScreen.writeBlog')}
                    </Link>
                </div>
            </div>
            
            <div className="features-grid">
                {/* Voice Recognition */}
                <div className="feature-card">
                    <div className="feature-icon">🎤</div>
                    <h3>{t('homeScreen.voiceRecognitionTitle')}</h3>
                    <p>{t('homeScreen.voiceRecognitionDescription')}</p>
                    <Link to="/voice-review" className="feature-link">
                        {t('homeScreen.tryVoiceReview')}
                    </Link>
                </div>
                
                {/* Review Generator */}
                <div className="feature-card">
                    <div className="feature-icon">✍️</div>
                    <h3>{t('homeScreen.reviewGeneratorTitle')}</h3>
                    <p>{t('homeScreen.reviewGeneratorDescription')}</p>
                    <Link to="/review-generator" className="feature-link">
                        {t('homeScreen.generateReview')}
                    </Link>
                </div>
                
                {/* Blog Creator */}
                <div className="feature-card">
                    <div className="feature-icon">📝</div>
                    <h3>{t('homeScreen.blogCreatorTitle')}</h3>
                    <p>{t('homeScreen.blogCreatorDescription')}</p>
                    <Link to="/blog-creator" className="feature-link">
                        {t('homeScreen.createBlog')}
                    </Link>
                </div>
                
                {/* Social Media Posts */}
                <div className="feature-card">
                    <div className="feature-icon">📱</div>
                    <h3>{t('homeScreen.socialMediaPostsTitle')}</h3>
                    <p>{t('homeScreen.socialMediaPostsDescription')}</p>
                    <Link to="/social-media" className="feature-link">
                        {t('homeScreen.createPost')}
                    </Link>
                </div>
                
                {/* Customer Service */}
                <div className="feature-card">
                    <div className="feature-icon">👨‍💼</div>
                    <h3>{t('homeScreen.customerServiceTitle')}</h3>
                    <p>{t('homeScreen.customerServiceDescription')}</p>
                    <Link to="/customer-service" className="feature-link">
                        {t('homeScreen.generateResponse')}
                    </Link>
                </div>
                
                {/* Enhanced LLM */}
                <div className="feature-card">
                    <div className="feature-icon">🚀</div>
                    <h3>{t('homeScreen.enhancedLLMTitle')}</h3>
                    <p>{t('homeScreen.enhancedLLMDescription')}</p>
                    <Link to="/enhanced-llm" className="feature-link">
                        {t('homeScreen.tryEnhancedLLM')}
                    </Link>
                </div>
            </div>
            
            {/* Service Categories */}
            <div className="service-categories">
                <h2>🎯 {t('homeScreen.contentCreationServices')}</h2>
                <div className="categories-grid">
                    <div className="category-card">
                        <h3>📝 {t('homeScreen.writingContentTitle')}</h3>
                        <ul>
                            <li>{t('homeScreen.reviewGeneration')}</li>
                            <li>{t('homeScreen.blogPostCreation')}</li>
                            <li>{t('homeScreen.socialMediaContent')}</li>
                            <li>{t('homeScreen.productDescriptions')}</li>
                        </ul>
                    </div>
                    <div className="category-card">
                        <h3>🎤 {t('homeScreen.voiceAudioTitle')}</h3>
                        <ul>
                            <li>{t('homeScreen.voiceToTextConversion')}</li>
                            <li>{t('homeScreen.audioContentAnalysis')}</li>
                            <li>{t('homeScreen.voiceReviewGeneration')}</li>
                            <li>{t('homeScreen.speechEnhancement')}</li>
                        </ul>
                    </div>
                    <div className="category-card">
                        <h3>🤖 {t('homeScreen.aiEnhancementTitle')}</h3>
                        <ul>
                            <li>{t('homeScreen.contentQualityAnalysis')}</li>
                            <li>{t('homeScreen.engagementOptimization')}</li>
                            <li>{t('homeScreen.styleToneAdjustment')}</li>
                            <li>{t('homeScreen.multiPlatformOptimization')}</li>
                        </ul>
                    </div>
                    <div className="category-card">
                        <h3>💼 {t('homeScreen.businessSolutionsTitle')}</h3>
                        <ul>
                            <li>{t('homeScreen.customerServiceResponses')}</li>
                            <li>{t('homeScreen.marketingContent')}</li>
                            <li>{t('homeScreen.brandVoiceConsistency')}</li>
                            <li>{t('homeScreen.contentStrategy')}</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="cta-section">
                <h2>🚀 {t('homeScreen.readyToCreateTitle')}</h2>
                <p>{t('homeScreen.readyToCreateSubtitle')}</p>
                <div className="cta-buttons">
                    <Link to="/voice-review" className="cta-button primary">
                        🎤 {t('homeScreen.startWithVoice')}
                    </Link>
                    <Link to="/review-generator" className="cta-button secondary">
                        ✍️ {t('homeScreen.writeReview')}
                    </Link>
                    <Link to="/blog-creator" className="cta-button tertiary">
                        📝 {t('homeScreen.writeBlog')}
                    </Link>
                    <Link to="/social-media" className="cta-button quaternary">
                        📱 {t('homeScreen.socialMedia')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;