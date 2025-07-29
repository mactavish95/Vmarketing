import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import FacebookIcon from './FacebookIcon';
import SocialMediaIntegration from './SocialMediaIntegration';
import QualityAnalyzer from './QualityAnalyzer';
import './SocialMediaPostWizard.css';

const SocialMediaPostWizard = ({
  platform, setPlatform,
  postType, setPostType,
  tone, setTone,
  targetAudience, setTargetAudience,
  contentStructure, setContentStructure,
  engagementGoal, setEngagementGoal,
  content, setContent,
  enhancedContent, setEnhancedContent,
  onSubmit,
  isGenerating,
  isReviewing,
  reviewedContent,
  setReviewedContent,
  generateContent,
  copyToClipboard,
  openPreviewWindow,
  brandVoiceIntensity, setBrandVoiceIntensity,
  engagementUrgency, setEngagementUrgency,
  situation, setSituation
}) => {
  const { t, i18n } = useTranslation();
  
  // Define getSteps function inside component so it can access the current translation function
  const getSteps = (t) => [
    {
      title: t('socialMedia.wizard.steps.step1.title'),
      emoji: '📱',
      guidance: t('socialMedia.wizard.steps.step1.guidance'),
      tips: t('socialMedia.wizard.steps.step1.tips', { returnObjects: true })
    },
    {
      title: t('socialMedia.wizard.steps.step2.title'),
      emoji: '🎭',
      guidance: t('socialMedia.wizard.steps.step2.guidance'),
      tips: t('socialMedia.wizard.steps.step2.tips', { returnObjects: true })
    },
    {
      title: t('socialMedia.wizard.steps.step3.title'),
      emoji: '✍️',
      guidance: t('socialMedia.wizard.steps.step3.guidance'),
      tips: t('socialMedia.wizard.steps.step3.tips', { returnObjects: true })
    },
    {
      title: t('socialMedia.wizard.steps.step4.title'),
      emoji: '🔍',
      guidance: t('socialMedia.wizard.steps.step4.guidance'),
      tips: t('socialMedia.wizard.steps.step4.tips', { returnObjects: true })
    },
    {
      title: t('socialMedia.wizard.steps.step5.title'),
      emoji: '👁️',
      guidance: t('socialMedia.wizard.steps.step5.guidance'),
      tips: t('socialMedia.wizard.steps.step5.tips', { returnObjects: true })
    },
  ];
  
  // Recreate steps when language changes
  const steps = useMemo(() => getSteps(t), [t, i18n.language]);
  const [step, setStep] = useState(0);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementError, setEnhancementError] = useState('');
  const [showGuidance, setShowGuidance] = useState(true);
  const [showTipsPanel, setShowTipsPanel] = useState(true);

  // Collapse guidance by default on mobile
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 768) {
        setShowGuidance(false);
      } else {
        setShowGuidance(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextStep = async () => {
    // Special handling for step 3 (Review & Enhance)
    if (step === 2 && content.trim()) {
      // Move to step 3 and trigger enhancement
      setStep(3);
      await enhanceContent();
    } else if (step === 3 && enhancedContent.trim()) {
      // Move to step 4 (Preview & Save)
      setStep(4);
    } else {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  // Function to enhance content using the existing generateContent function
  const enhanceContent = async () => {
    if (!content.trim()) {
      setEnhancementError(t('socialMedia.wizard.messages.pleaseEnterContent'));
      return;
    }

    setIsEnhancing(true);
    setEnhancementError('');

    try {
      // Call the generateContent function from parent
      await generateContent();
    } catch (error) {
      setEnhancementError(t('socialMedia.wizard.messages.enhancementError'));
      console.error(t('socialMedia.wizard.messages.enhancementError'), error);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Auto-enhance when reaching step 3
  useEffect(() => {
    if (step === 3 && content.trim() && !enhancedContent.trim()) {
      enhanceContent();
    }
  }, [step]);

  const getPlatformTips = () => {
    const platformTips = {
      facebook: [
        <span key="fb-tip-1"><FacebookIcon size={24} style={{verticalAlign:'middle', marginRight: '8px'}} /> {t('socialMedia.platformTips.facebook.bestPostingTimes')}</span>,
        <span key="fb-tip-2">💬 {t('socialMedia.platformTips.facebook.askQuestions')}</span>,
        <span key="fb-tip-3">📸 {t('socialMedia.platformTips.facebook.includeImages')}</span>,
        <span key="fb-tip-4">🎉 {t('socialMedia.platformTips.facebook.useFacebookLive')}</span>,
        <span key="fb-tip-5">📅 {t('socialMedia.platformTips.facebook.postConsistently')}</span>
      ],
      instagram: [
        <span key="ig-tip-1">📸 {t('socialMedia.platformTips.instagram.useHighQuality')}</span>,
        <span key="ig-tip-2">🏷️ {t('socialMedia.platformTips.instagram.addHashtags')}</span>,
        <span key="ig-tip-3">💬 {t('socialMedia.platformTips.instagram.useEmojis')}</span>,
        <span key="ig-tip-4">📱 {t('socialMedia.platformTips.instagram.peakHours')}</span>,
        <span key="ig-tip-5">🎬 {t('socialMedia.platformTips.instagram.tryReels')}</span>
      ],
      linkedin: [
        <span key="li-tip-1">💼 {t('socialMedia.platformTips.linkedin.keepProfessional')}</span>,
        <span key="li-tip-2">📊 {t('socialMedia.platformTips.linkedin.shareInsights')}</span>,
        <span key="li-tip-3">🤝 {t('socialMedia.platformTips.linkedin.network')}</span>,
        <span key="li-tip-4">📅 {t('socialMedia.platformTips.linkedin.businessHours')}</span>,
        <span key="li-tip-5">📈 {t('socialMedia.platformTips.linkedin.thoughtLeadership')}</span>
      ],
      twitter: [
        <span key="tw-tip-1">🐦 {t('socialMedia.platformTips.twitter.keepConcise')}</span>,
        <span key="tw-tip-2">🔥 {t('socialMedia.platformTips.twitter.jumpOnTrends')}</span>,
        <span key="tw-tip-3">💬 {t('socialMedia.platformTips.twitter.useHashtags')}</span>,
        <span key="tw-tip-4">📱 {t('socialMedia.platformTips.twitter.postFrequently')}</span>,
        <span key="tw-tip-5">🎯 {t('socialMedia.platformTips.twitter.engageWithAudience')}</span>
      ],
      tiktok: [
        <span key="tt-tip-1">🎵 {t('socialMedia.platformTips.tiktok.useTrendingSounds')}</span>,
        <span key="tt-tip-2">🎬 {t('socialMedia.platformTips.tiktok.keepVideosShort')}</span>,
        <span key="tt-tip-3">🔥 {t('socialMedia.platformTips.tiktok.jumpOnTrends')}</span>,
        <span key="tt-tip-4">📱 {t('socialMedia.platformTips.tiktok.postConsistently')}</span>,
        <span key="tt-tip-5">💬 {t('socialMedia.platformTips.tiktok.engageWithComments')}</span>
      ],
      youtube: [
        <span key="yt-tip-1">📺 {t('socialMedia.platformTips.youtube.createDetailed')}</span>,
        <span key="yt-tip-2">🎬 {t('socialMedia.platformTips.youtube.useEngagingThumbnails')}</span>,
        <span key="yt-tip-3">📝 {t('socialMedia.platformTips.youtube.writeDescriptions')}</span>,
        <span key="yt-tip-4">⏰ {t('socialMedia.platformTips.youtube.postConsistently')}</span>,
        <span key="yt-tip-5">💬 {t('socialMedia.platformTips.youtube.respondToComments')}</span>
      ]
    };
    return platformTips[platform] || [];
  };

  // Handle final submit (step 5)
  const handleFinalSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="wizard-container">
      {/* Header */}
      <div className="wizard-header">
        <h1 className="wizard-title">
          <span className="wizard-icon">✨</span>
          {t('socialMedia.wizards.title')}
        </h1>
        <p className="wizard-subtitle">
          {t('socialMedia.wizards.subtitle')}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        {/* Only show current step on mobile, all steps on desktop */}
        <div className="progress-steps">
          {steps.map((s, i) => (
            <div 
              key={i} 
              className={`progress-step ${i <= step ? 'active' : ''} ${i === step ? 'current' : ''}`}
              style={window.innerWidth <= 768 && i !== step ? { display: 'none' } : {}}
            >
              <div className="step-number">{i + 1}</div>
              <div className="step-info">
                <div className="step-emoji">{s.emoji}</div>
                <div className="step-title">{s.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="wizard-layout">
        {window.innerWidth <= 768 && (
          <button
            className="tips-toggle-btn"
            onClick={() => setShowTipsPanel(v => !v)}
            aria-label={showTipsPanel ? t('Hide tips panel') : t('Show tips panel')}
            style={{
              width: '100%',
              padding: '10px 0',
              background: '#f0f9ff',
              border: 'none',
              borderRadius: '8px',
              marginBottom: '8px',
              fontWeight: 600,
              color: '#0ea5e9',
              fontSize: '15px',
              cursor: 'pointer',
              display: 'block',
            }}
          >
            {showTipsPanel ? 'Hide Tips 💡' : 'Show Tips 💡'}
          </button>
        )}
        {/* Sidebar for tips/help */}
        {showTipsPanel && (
          <aside className="wizard-sidebar">
            {step === 0 && platform && (
              <div className="tips-card platform-tips">
                <div className="tips-header">
                  <span className="tips-icon">💡</span>
                  <h3 className="tips-title">{t(`socialMedia.platformTips.${platform}.title`)}</h3>
                </div>
                <ul className="tips-list">
                  {getPlatformTips().map((tip, index) => (
                    <li key={`platform-${index}`} className="tip-item">{tip}</li>
                  ))}
                </ul>

              </div>
            )}
            {step !== 0 && (
              <div className="tips-card general-tips">
                <div className="tips-header">
                  <span className="tips-icon">💡</span>
                  <h3 className="tips-title">{t('socialMedia.helpfulTips')}</h3>
                </div>
                <ul className="tips-list">
                  {steps[step].tips.map((tip, index) => (
                    <li key={index} className="tip-item">{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        )}
        {/* Main form content */}
        <main className="wizard-main-content">
          <div className="step-content">
            {/* Guidance Card */}
            <div className={`guidance-card${showGuidance ? '' : ' collapsed'}`}> 
              <button 
                className="guidance-toggle-btn" 
                onClick={() => setShowGuidance(v => !v)}
                aria-expanded={showGuidance}
                aria-label={showGuidance ? t('Hide guidance') : t('Show guidance')}
              >
                {showGuidance ? '−' : '+'}
              </button>
              <div className="guidance-content" style={{ display: showGuidance ? 'block' : 'none' }}>
                <span className="guidance-icon" aria-hidden="true">ℹ️</span>
                <span className="guidance-text">{steps[step].guidance}</span>
              </div>
            </div>
            {step === 0 && (
              <div className="form-section">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📱</span>
                    {t('socialMedia.wizard.labels.choosePlatform')}
                  </label>
                  <div className="select-wrapper">
                    <select 
                      value={platform} 
                      onChange={e => setPlatform(e.target.value)}
                      className="form-select"
                    >
                      <option value="facebook">{t('socialMedia.wizard.platformOptions.facebook')}</option>
                      <option value="instagram">{t('socialMedia.wizard.platformOptions.instagram')}</option>
                      <option value="linkedin">{t('socialMedia.wizard.platformOptions.linkedin')}</option>
                      <option value="twitter">{t('socialMedia.wizard.platformOptions.twitter')}</option>
                      <option value="tiktok">{t('socialMedia.wizard.platformOptions.tiktok')}</option>
                      <option value="youtube">{t('socialMedia.wizard.platformOptions.youtube')}</option>
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📝</span>
                    {t('socialMedia.wizard.labels.choosePostType')}
                  </label>
                  <div className="select-wrapper">
                    <select 
                      value={postType} 
                      onChange={e => setPostType(e.target.value)}
                      className="form-select"
                    >
                      <option value="general">{t('socialMedia.wizard.postTypeOptions.general')}</option>
                      <option value="story">{t('socialMedia.wizard.postTypeOptions.story')}</option>
                      <option value="promotional">{t('socialMedia.wizard.postTypeOptions.promotional')}</option>
                      <option value="educational">{t('socialMedia.wizard.postTypeOptions.educational')}</option>
                      <option value="community">{t('socialMedia.wizard.postTypeOptions.community')}</option>
                      <option value="inspirational">{t('socialMedia.wizard.postTypeOptions.inspirational')}</option>
                      <option value="question">{t('socialMedia.wizard.postTypeOptions.question')}</option>
                      <option value="announcement">{t('socialMedia.wizard.postTypeOptions.announcement')}</option>
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
              </div>
            )}
            
            {step === 1 && (
              <div className="form-section">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">🎭</span>
                    {t('socialMedia.wizard.labels.chooseTone')}
                  </label>
                  <div className="select-wrapper">
                    <select 
                      value={tone} 
                      onChange={e => setTone(e.target.value)}
                      className="form-select"
                    >
                      <option value="engaging">{t('socialMedia.wizard.toneOptions.engaging')}</option>
                      <option value="professional">{t('socialMedia.wizard.toneOptions.professional')}</option>
                      <option value="casual">{t('socialMedia.wizard.toneOptions.casual')}</option>
                      <option value="humorous">{t('socialMedia.wizard.toneOptions.humorous')}</option>
                      <option value="inspirational">{t('socialMedia.wizard.toneOptions.inspirational')}</option>
                      <option value="educational">{t('socialMedia.wizard.toneOptions.educational')}</option>
                      <option value="empathetic">{t('socialMedia.wizard.toneOptions.empathetic')}</option>
                      <option value="authoritative">{t('socialMedia.wizard.toneOptions.authoritative')}</option>
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">👥</span>
                    {t('socialMedia.wizard.labels.targetAudience')}
                  </label>
                  <div className="select-wrapper">
                    <select 
                      value={targetAudience} 
                      onChange={e => setTargetAudience(e.target.value)}
                      className="form-select"
                    >
                      <option value="general">{t('socialMedia.wizard.audienceOptions.general')}</option>
                      <option value="business">{t('socialMedia.wizard.audienceOptions.business')}</option>
                      <option value="youth">{t('socialMedia.wizard.audienceOptions.youth')}</option>
                      <option value="parents">{t('socialMedia.wizard.audienceOptions.parents')}</option>
                      <option value="professionals">{t('socialMedia.wizard.audienceOptions.professionals')}</option>
                      <option value="creatives">{t('socialMedia.wizard.audienceOptions.creatives')}</option>
                      <option value="seniors">{t('socialMedia.wizard.audienceOptions.seniors')}</option>
                      <option value="local">{t('socialMedia.wizard.audienceOptions.local')}</option>
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📋</span>
                    {t('socialMedia.wizard.labels.contentStructure')}
                  </label>
                  <div className="select-wrapper">
                    <select 
                      value={contentStructure} 
                      onChange={e => setContentStructure(e.target.value)}
                      className="form-select"
                    >
                      <option value="story">{t('socialMedia.wizard.structureOptions.story')}</option>
                      <option value="list">{t('socialMedia.wizard.structureOptions.list')}</option>
                      <option value="tips">{t('socialMedia.wizard.structureOptions.tips')}</option>
                      <option value="announcement">{t('socialMedia.wizard.structureOptions.announcement')}</option>
                      <option value="question">{t('socialMedia.wizard.structureOptions.question')}</option>
                      <option value="before-after">{t('socialMedia.wizard.structureOptions.beforeAfter')}</option>
                      <option value="quote">{t('socialMedia.wizard.structureOptions.quote')}</option>
                      <option value="problem-solution">{t('socialMedia.wizard.structureOptions.problemSolution')}</option>
                    </select>
                    <span className="select-arrow">▼</span>
                  </div>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="form-section">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">✍️</span>
                    {t('socialMedia.wizard.labels.writePost')}
                  </label>
                  <div className="textarea-wrapper">
                    <textarea 
                      value={content} 
                      onChange={e => setContent(e.target.value)} 
                      placeholder={t('socialMedia.wizard.placeholders.writePost')}
                      className="form-textarea"
                      rows={8}
                    />
                    <div className="character-count">
                      <span className="count-item">
                        <span className="count-icon">📊</span>
                        {content.length} {t('socialMedia.characters')}
                      </span>
                      <span className="count-item">
                        <span className="count-icon">📝</span>
                        {content.split(' ').filter(word => word.length > 0).length} {t('socialMedia.words')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="form-section">
                {/* Loading State */}
                {(isEnhancing || isGenerating || isReviewing) && (
                  <div className="loading-card">
                    <div className="loading-spinner"></div>
                    <div className="loading-content">
                      <h3 className="loading-title">{t('socialMedia.wizard.messages.enhancing')}</h3>
                      <p className="loading-subtitle">
                        {t('socialMedia.wizard.messages.enhancingForPlatform', { platform: t(`socialMedia.platforms.${platform}`) })}
                      </p>
                    </div>
                  </div>
                )}

                {/* Error State */}
                {enhancementError && (
                  <div className="error-card">
                    <span className="error-icon">❌</span>
                    <span className="error-message">{enhancementError}</span>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">🔍</span>
                    {t('socialMedia.wizard.labels.reviewEnhance')}
                  </label>
                  <div className="textarea-wrapper">
                    <textarea 
                      value={enhancedContent || reviewedContent || ''} 
                      onChange={e => setEnhancedContent(e.target.value)} 
                      placeholder={isEnhancing || isGenerating || isReviewing ? t('socialMedia.wizard.placeholders.enhancing') : t('socialMedia.wizard.placeholders.enhancedPost')}
                      disabled={isEnhancing || isGenerating || isReviewing}
                      className="form-textarea"
                      rows={8}
                    />
                    <div className="character-count">
                      <span className="count-item">
                        <span className="count-icon">📊</span>
                        {(enhancedContent || reviewedContent || '').length} {t('socialMedia.characters')}
                      </span>
                      <span className="count-item">
                        <span className="count-icon">📝</span>
                        {(enhancedContent || reviewedContent || '').split(' ').filter(word => word.length > 0).length} {t('socialMedia.words')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Enhancement Status */}
                {!isEnhancing && !isGenerating && !isReviewing && enhancedContent && (
                  <div className="success-card">
                    <span className="success-icon">✅</span>
                    <span className="success-message">{t('socialMedia.wizard.messages.postEnhanced')}</span>
                  </div>
                )}
              </div>
            )}
            
            {step === 4 && (
              <div className="form-section">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">👁️</span>
                    {t('socialMedia.wizard.labels.previewPost')}
                  </label>
                  <div className="preview-card">
                    <div className="preview-content">
                      {enhancedContent || reviewedContent || content || t('socialMedia.wizard.placeholders.postPreview')}
                    </div>
                  </div>
                </div>
                
                {/* Quality Analysis */}
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📊</span>
                    {t('socialMedia.qualityAnalysis')}
                  </label>
                  <QualityAnalyzer
                    content={enhancedContent || reviewedContent || content}
                    platform={platform}
                    postType={postType}
                    tone={tone}
                    targetAudience={targetAudience}
                    contentStructure={contentStructure}
                    engagementGoal={engagementGoal}
                    brandVoiceIntensity={brandVoiceIntensity || "moderate"}
                    engagementUrgency={engagementUrgency || "normal"}
                    situation={situation || "general"}
                    contentType="facebook_post"
                    autoAnalyze={!!(enhancedContent || reviewedContent || content)}
                    showUI={true}
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="action-buttons">
                  <button 
                    onClick={() => copyToClipboard && copyToClipboard(enhancedContent || reviewedContent || content)} 
                    className="action-btn primary"
                  >
                    <span className="btn-icon">📋</span>
                    {t('socialMedia.wizard.buttons.copyPost')}
                  </button>
                  <button 
                    onClick={() => openPreviewWindow && openPreviewWindow(enhancedContent || reviewedContent || content, platform, postType, tone, targetAudience)} 
                    className="action-btn secondary"
                  >
                    <span className="btn-icon">👁️</span>
                    {t('socialMedia.wizard.buttons.preview')}
                  </button>
                </div>
                
                <div className="success-card">
                  <span className="success-icon">🎉</span>
                  <span className="success-message">{t('socialMedia.wizard.messages.greatJob')}</span>
                </div>
                
                {/* Social Media Integration */}
                <SocialMediaIntegration
                  content={reviewedContent || enhancedContent || content}
                  platform={platform}
                  onPublishSuccess={(platform, result) => {
                    console.log(`Successfully published to ${platform}:`, result);
                    // You can add success notification here
                  }}
                  onPublishError={(platform, error) => {
                    console.error(`Failed to publish to ${platform}:`, error);
                    // You can add error notification here
                  }}
                />
                
                <button 
                  onClick={handleFinalSubmit} 
                  className="finish-btn"
                >
                  <span className="btn-icon">✨</span>
                  {t('socialMedia.wizard.buttons.saveFinish')}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Navigation */}
      <div className="wizard-navigation">
        <button 
          onClick={prevStep} 
          disabled={step === 0} 
          className="nav-btn prev-btn"
        >
          <span className="nav-icon">←</span>
          {t('socialMedia.wizard.buttons.back')}
        </button>
        
        {step < steps.length - 1 && (
          <button 
            onClick={nextStep} 
            disabled={step === 2 && !content.trim() || step === 3 && (isEnhancing || isGenerating || isReviewing)}
            className="nav-btn next-btn"
          >
            {step === 3 && (isEnhancing || isGenerating || isReviewing) ? (
              <>
                <span className="nav-icon">⏳</span>
                {t('socialMedia.wizard.buttons.enhancing')}
              </>
            ) : (
              <>
                {t('socialMedia.wizard.buttons.next')}
                <span className="nav-icon">→</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Styles */}
      <style jsx>{`
        .wizard-container {
          max-width: 1100px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .wizard-layout {
          display: flex;
          gap: 40px;
        }
        .wizard-sidebar {
          min-width: 320px;
          max-width: 360px;
          flex: 0 0 340px;
          padding: 0 0 0 8px;
        }
        .wizard-main-content {
          flex: 1;
          min-width: 0;
        }
        .form-row {
          display: flex;
          gap: 24px;
        }
        .form-row .form-group {
          flex: 1;
        }

        .wizard-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px 24px;
          text-align: center;
        }

        .wizard-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 6px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .wizard-icon {
          font-size: 28px;
        }

        .wizard-subtitle {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
          font-weight: 400;
        }

        .progress-container {
          padding: 20px 32px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .progress-bar {
          height: 4px;
          background: #f1f5f9;
          border-radius: 2px;
          margin-bottom: 20px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 2px;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          max-width: 800px;
          margin: 0 auto;
        }

        .progress-step {
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.4;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          position: relative;
        }

        .progress-step:hover {
          opacity: 0.7;
          background: rgba(102, 126, 234, 0.05);
        }

        .progress-step.active {
          opacity: 0.8;
        }

        .progress-step.current {
          opacity: 1;
          background: rgba(102, 126, 234, 0.1);
          transform: scale(1.02);
        }

        .step-number {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid transparent;
        }

        .progress-step.active .step-number {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: rgba(255, 255, 255, 0.2);
        }

        .progress-step.current .step-number {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .step-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 2px;
          min-width: 0;
        }

        .step-emoji {
          font-size: 16px;
          line-height: 1;
        }

        .step-title {
          font-size: 11px;
          font-weight: 600;
          text-align: left;
          line-height: 1.2;
          color: #475569;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 80px;
        }

        .progress-step.active .step-title {
          color: #1e293b;
        }

        .progress-step.current .step-title {
          color: #1e293b;
          font-weight: 700;
        }

        .wizard-content {
          padding: 32px 24px;
        }

        .step-header {
          margin-bottom: 32px;
        }

        .step-indicator {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .step-emoji-large {
          font-size: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .step-details {
          flex: 1;
        }

        .step-title-large {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 8px 0;
        }

        .step-guidance {
          font-size: 16px;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        .tips-card {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 1px solid #0ea5e9;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 32px;
        }

        .tips-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .tips-icon {
          font-size: 24px;
        }

        .tips-title {
          font-size: 18px;
          font-weight: 600;
          color: #0c4a6e;
          margin: 0;
        }

        .tips-list {
          margin: 0;
          padding-left: 20px;
        }

        .tip-item {
          color: #0c4a6e;
          line-height: 1.6;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .tip-item:last-child {
          margin-bottom: 0;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #374151;
          font-size: 16px;
        }

        .label-icon {
          font-size: 20px;
        }

        .select-wrapper {
          position: relative;
        }

        .form-select {
          width: 100%;
          padding: 16px 20px;
          font-size: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          outline: none;
          transition: all 0.3s ease;
          appearance: none;
        }

        .form-select:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .select-arrow {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
          font-size: 12px;
        }

        .textarea-wrapper {
          position: relative;
        }

        .form-textarea {
          width: 100%;
          padding: 20px;
          font-size: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: #f9fafb;
          outline: none;
          resize: vertical;
          font-family: inherit;
          line-height: 1.6;
          transition: all 0.3s ease;
          min-height: 200px;
        }

        .form-textarea:focus {
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-textarea:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .character-count {
          display: flex;
          justify-content: space-between;
          margin-top: 12px;
          font-size: 14px;
          color: #6b7280;
        }

        .count-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .count-icon {
          font-size: 16px;
        }

        .loading-card {
          background: #f0f9ff;
          border: 1px solid #0ea5e9;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          margin-bottom: 24px;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e0f2fe;
          border-top: 3px solid #0ea5e9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px auto;
        }

        .loading-content h3 {
          font-size: 18px;
          font-weight: 600;
          color: #0c4a6e;
          margin: 0 0 8px 0;
        }

        .loading-content p {
          font-size: 14px;
          color: #0369a1;
          margin: 0;
        }

        .error-card {
          background: #fef2f2;
          border: 1px solid #ef4444;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .error-icon {
          font-size: 20px;
        }

        .error-message {
          color: #991b1b;
          font-weight: 500;
        }

        .success-card {
          background: #ecfdf5;
          border: 1px solid #10b981;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .success-icon {
          font-size: 20px;
        }

        .success-message {
          color: #065f46;
          font-weight: 500;
        }

        .preview-card {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          min-height: 120px;
        }

        .preview-content {
          font-size: 16px;
          line-height: 1.6;
          white-space: pre-wrap;
          word-wrap: break-word;
          color: #374151;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .action-btn {
          flex: 1;
          padding: 16px 24px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .action-btn.secondary {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }

        .action-btn.secondary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }

        .btn-icon {
          font-size: 18px;
        }

        .finish-btn {
          width: 100%;
          padding: 20px 32px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
          transition: all 0.3s ease;
        }

        .finish-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(139, 92, 246, 0.5);
        }

        .wizard-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 32px;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
        }

        .nav-btn {
          padding: 14px 20px;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 120px;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none !important;
        }

        .nav-btn:not(:disabled):hover {
          transform: translateY(-1px);
        }

        .nav-btn:not(:disabled):active {
          transform: translateY(0);
        }

        .prev-btn {
          background: #f8fafc;
          color: #64748b;
          border: 1px solid #e2e8f0;
        }

        .prev-btn:hover:not(:disabled) {
          background: #f1f5f9;
          color: #475569;
          border-color: #cbd5e1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .next-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.25);
        }

        .next-btn:hover:not(:disabled) {
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.35);
        }

        .next-btn:not(:disabled)::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .next-btn:not(:disabled):hover::before {
          left: 100%;
        }

        .nav-icon {
          font-size: 16px;
          transition: transform 0.2s ease;
        }

        .prev-btn:hover .nav-icon {
          transform: translateX(-2px);
        }

        .next-btn:hover .nav-icon {
          transform: translateX(2px);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Mobile Responsive */
        @media (max-width: 1200px) {
          .wizard-container { max-width: 98vw; }
          .wizard-layout { gap: 20px; }
          .wizard-sidebar { min-width: 220px; max-width: 260px; flex-basis: 220px; }
        }
        @media (max-width: 900px) {
          .wizard-layout { flex-direction: column; gap: 0; }
          .wizard-sidebar { max-width: 100%; min-width: 0; padding: 0; }
        }
        @media (max-width: 768px) {
          .wizard-container { margin: 0; border-radius: 0; min-height: 100vh; }
          .wizard-header { padding: 28px 16px; }
          .wizard-title { font-size: 26px; }
          .wizard-icon { font-size: 30px; }
          .wizard-subtitle { font-size: 16px; }
          .progress-container { padding: 16px; }
          .progress-steps { flex-direction: column; gap: 12px; }
          .progress-step { justify-content: flex-start; padding: 12px; }
          .step-info { flex-direction: row; align-items: center; gap: 8px; }
          .step-title { font-size: 14px; max-width: none; }
          .wizard-content { padding: 24px 16px; }
          .step-indicator { flex-direction: column; text-align: center; gap: 16px; }
          .step-emoji-large { font-size: 40px; }
          .step-title-large { font-size: 20px; }
          .tips-card { padding: 20px; }
          .action-buttons { flex-direction: column; }
          .wizard-navigation { padding: 16px; flex-direction: column; gap: 12px; }
          .nav-btn { width: 100%; justify-content: center; min-width: auto; }
        }
        @media (max-width: 480px) {
          .wizard-header { padding: 20px 12px; }
          .wizard-title { font-size: 20px; }
          .wizard-content { padding: 20px 12px; }
          .form-select, .form-textarea { padding: 14px 16px; font-size: 16px; }
          .action-btn, .nav-btn { padding: 14px 20px; font-size: 16px; }
        }
        .form-select:hover, .form-select:focus, .form-textarea:hover, .form-textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px #a5b4fc44;
        }
        .action-btn:hover, .nav-btn:hover, .finish-btn:hover {
          filter: brightness(1.08);
          box-shadow: 0 2px 8px rgba(79,140,255,0.10);
        }

        /* New styles for guidance card */
        .guidance-card {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .guidance-card.collapsed {
          padding: 16px 20px;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          background: #f8fafc;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .guidance-toggle-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #64748b;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
          flex-shrink: 0;
        }

        .guidance-toggle-btn:hover {
          background-color: #f1f5f9;
        }

        .guidance-toggle-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .guidance-content {
          flex-grow: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #475569;
          font-size: 14px;
          line-height: 1.6;
        }

        .guidance-icon {
          font-size: 18px;
          color: #64748b;
        }

        .guidance-text {
          flex-wrap: wrap;
          word-break: break-word;
          max-width: calc(100% - 40px); /* Adjust for toggle button */
        }

        /* Mobile Responsive for guidance card */
        @media (max-width: 768px) {
          .guidance-card {
            padding: 12px 16px;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }
          .guidance-toggle-btn {
            width: 28px;
            height: 28px;
            font-size: 20px;
            border-radius: 6px;
          }
          .guidance-content {
            font-size: 13px;
            gap: 6px;
          }
          .guidance-icon {
            font-size: 16px;
          }
          .guidance-text {
            max-width: calc(100% - 36px); /* Adjust for toggle button */
          }
        }
      `}</style>
    </div>
  );
};

export default SocialMediaPostWizard; 