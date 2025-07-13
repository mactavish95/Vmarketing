import React from 'react';
import { useTranslation } from 'react-i18next';

// SocialMediaPostOptions: Renders all option/selector UIs for SocialMediaPost
const SocialMediaPostOptions = ({
  platforms, platform, setPlatform,
  postTypes, postType, setPostType,
  tones, tone, setTone,
  audiences, targetAudience, setTargetAudience,
  contentStructures, contentStructure, setContentStructure,
  engagementGoals, engagementGoal, setEngagementGoal,
  contentLengths, contentLength, setContentLength,
  customLength, setCustomLength,
  brandVoiceIntensities, brandVoiceIntensity, setBrandVoiceIntensity,
  engagementUrgencies, engagementUrgency, setEngagementUrgency,
  situations, situation, setSituation,
  showAdvancedOptions, setShowAdvancedOptions
}) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Platform Selection */}
      <div className="section platform-section-mobile">
        <h2>📱 {t('socialMedia.platformSelection')}</h2>
        <div className="platform-grid">
          {platforms.map(p => (
            <button
              key={p.value}
              className={`platform-option ${platform === p.value ? 'active' : ''} ${p.priority ? 'priority' : ''}`}
              onClick={() => setPlatform(p.value)}
              tabIndex={0}
            >
              <span className="platform-icon">{p.icon}</span>
              <span className="platform-label">{p.label}</span>
              {p.priority && <span className="priority-badge">{t('socialMedia.recommended')}</span>}
            </button>
          ))}
        </div>
      </div>
      {/* Post Type */}
      <div className="option-group">
        <label>{t('socialMedia.postType')}</label>
        <div className="options-grid">
          {postTypes.map(type => (
            <button
              key={type.value}
              className={`option-btn ${postType === type.value ? 'active' : ''}`}
              onClick={() => setPostType(type.value)}
            >
              <span className="option-icon">{type.icon}</span>
              <span className="option-label">{type.label}</span>
              <span className="option-description">{type.description}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Content Structure */}
      <div className="option-group">
        <label>{t('socialMedia.contentStructure')}</label>
        <div className="options-grid">
          {contentStructures.map(structure => (
            <button
              key={structure.value}
              className={`option-btn ${contentStructure === structure.value ? 'active' : ''}`}
              onClick={() => setContentStructure(structure.value)}
            >
              <span className="option-icon">{structure.icon}</span>
              <span className="option-label">{structure.label}</span>
              <span className="option-description">{structure.description}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Engagement Goal */}
      <div className="option-group">
        <label>{t('socialMedia.engagementGoal')}</label>
        <div className="options-grid">
          {engagementGoals.map(goal => (
            <button
              key={goal.value}
              className={`option-btn ${engagementGoal === goal.value ? 'active' : ''}`}
              onClick={() => setEngagementGoal(goal.value)}
            >
              <span className="option-icon">{goal.icon}</span>
              <span className="option-label">{goal.label}</span>
              <span className="option-description">{goal.description}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Dynamic Length Adjustment */}
      <div className="option-group">
        <label>📏 {t('socialMedia.contentLengthOptimization')}</label>
        <div className="options-grid">
          {contentLengths.map(length => (
            <button
              key={length.value}
              className={`option-btn ${contentLength === length.value ? 'active' : ''}`}
              onClick={() => setContentLength(length.value)}
            >
              <span className="option-icon">{length.icon || '📏'}</span>
              <span className="option-label">{length.label}</span>
              <span className="option-description">{length.description}</span>
            </button>
          ))}
        </div>
        {/* Custom Length Input */}
        {contentLength === 'custom' && (
          <div className="custom-length-input">
            <label>{t('socialMedia.targetWords')}:</label>
            <input
              type="number"
              value={customLength}
              onChange={e => setCustomLength(Math.max(20, parseInt(e.target.value) || 100))}
              min="20"
              max="500"
            />
            <span className="custom-length-target">
              {t('socialMedia.target')}: {customLength} {t('socialMedia.words')}
            </span>
          </div>
        )}
        
        {/* Platform-Specific Optimization Tips */}
        <div className="platform-optimization-tips">
          <h4>💡 {t('socialMedia.platformSpecificTips')}</h4>
          {platform === 'facebook' && (
            <div className="platform-tips facebook-tips">
              <h5>📘 {t('socialMedia.platformTips.facebook.title')}</h5>
              <ul>
                <li><strong>{t('socialMedia.platformTips.facebook.wordCounts.short')}:</strong> {t('socialMedia.platformTips.facebook.descriptions.short')}</li>
                <li><strong>{t('socialMedia.platformTips.facebook.wordCounts.optimal')}:</strong> {t('socialMedia.platformTips.facebook.descriptions.optimal')}</li>
                <li><strong>{t('socialMedia.platformTips.facebook.wordCounts.detailed')}:</strong> {t('socialMedia.platformTips.facebook.descriptions.detailed')}</li>
                <li><strong>{t('socialMedia.platformTips.facebook.wordCounts.comprehensive')}:</strong> {t('socialMedia.platformTips.facebook.descriptions.comprehensive')}</li>
                <li><strong>{t('socialMedia.platformTips.facebook.bestPractices')}:</strong> {t('socialMedia.platformTips.facebook.bestPracticesDescription')}</li>
              </ul>
            </div>
          )}
          {platform === 'instagram' && (
            <div className="platform-tips instagram-tips">
              <h5>📸 {t('socialMedia.platformTips.instagram.title')}</h5>
              <ul>
                <li><strong>{t('socialMedia.platformTips.instagram.wordCounts.short')}:</strong> {t('socialMedia.platformTips.instagram.descriptions.short')}</li>
                <li><strong>{t('socialMedia.platformTips.instagram.wordCounts.optimal')}:</strong> {t('socialMedia.platformTips.instagram.descriptions.optimal')}</li>
                <li><strong>{t('socialMedia.platformTips.instagram.wordCounts.detailed')}:</strong> {t('socialMedia.platformTips.instagram.descriptions.detailed')}</li>
                <li><strong>{t('socialMedia.platformTips.instagram.wordCounts.comprehensive')}:</strong> {t('socialMedia.platformTips.instagram.descriptions.comprehensive')}</li>
                <li><strong>{t('socialMedia.platformTips.instagram.bestPractices')}:</strong> {t('socialMedia.platformTips.instagram.bestPracticesDescription')}</li>
              </ul>
            </div>
          )}
          {platform === 'linkedin' && (
            <div className="platform-tips linkedin-tips">
              <h5>💼 {t('socialMedia.platformTips.linkedin.title')}</h5>
              <ul>
                <li><strong>{t('socialMedia.platformTips.linkedin.wordCounts.short')}:</strong> {t('socialMedia.platformTips.linkedin.descriptions.short')}</li>
                <li><strong>{t('socialMedia.platformTips.linkedin.wordCounts.optimal')}:</strong> {t('socialMedia.platformTips.linkedin.descriptions.optimal')}</li>
                <li><strong>{t('socialMedia.platformTips.linkedin.wordCounts.detailed')}:</strong> {t('socialMedia.platformTips.linkedin.descriptions.detailed')}</li>
                <li><strong>{t('socialMedia.platformTips.linkedin.wordCounts.comprehensive')}:</strong> {t('socialMedia.platformTips.linkedin.descriptions.comprehensive')}</li>
                <li><strong>{t('socialMedia.platformTips.linkedin.bestPractices')}:</strong> {t('socialMedia.platformTips.linkedin.bestPracticesDescription')}</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Brand Voice & Engagement */}
      <div className="option-group">
        <label>🎭 {t('socialMedia.brandVoiceEngagement')}</label>
        <div className="options-grid">
          {brandVoiceIntensities.map(voice => (
            <button
              key={voice.value}
              className={`option-btn ${brandVoiceIntensity === voice.value ? 'active' : ''}`}
              onClick={() => setBrandVoiceIntensity(voice.value)}
            >
              <span className="option-icon">{voice.icon}</span>
              <span className="option-label">{voice.label}</span>
              <span className="option-description">{voice.description}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="option-group">
        <label>🔥 {t('socialMedia.engagementUrgency')}</label>
        <div className="options-grid">
          {engagementUrgencies.map(urgency => (
            <button
              key={urgency.value}
              className={`option-btn ${engagementUrgency === urgency.value ? 'active' : ''}`}
              onClick={() => setEngagementUrgency(urgency.value)}
            >
              <span className="option-icon">{urgency.value === 'immediate' ? '⚡️🚨' : urgency.value === 'high' ? '🔥⏰' : urgency.value === 'medium' ? '⏳📈' : '🕰️🌱'}</span>
              <span className="option-label">{urgency.label}</span>
              <span className="option-description">{urgency.description}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Situation Context */}
      <div className="option-group">
        <label>🎯 {t('socialMedia.situationContext')}</label>
        <div className="options-grid">
          {situations.map(situation => (
            <button
              key={situation.value}
              className={`option-btn ${situation === situation.value ? 'active' : ''}`}
              onClick={() => setSituation(situation.value)}
            >
              <span className="option-icon">{situation.value === 'event' ? '🎉📅' : situation.value === 'announcement' ? '📢📰' : situation.value === 'promotion' ? '🏷️💸' : situation.value === 'holiday' ? '🎄🎆' : situation.value === 'trend' ? '📈🔥' : '💡🌟'}</span>
              <span className="option-label">{situation.label}</span>
              <span className="option-description">{situation.description}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Advanced Options Toggle */}
      <button
        className="advanced-toggle"
        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
      >
        {showAdvancedOptions ? '🔽' : '🔼'} {t('socialMedia.advancedOptions')}
      </button>
      {showAdvancedOptions && (
        <div className="advanced-options">
          {/* Tone */}
          <div className="option-group">
            <label>{t('socialMedia.tone')}</label>
            <div className="options-grid">
              {tones.map(tone => (
                <button
                  key={tone.value}
                  className={`option-btn ${tone === tone.value ? 'active' : ''}`}
                  onClick={() => setTone(tone.value)}
                >
                  <span className="option-icon">{tone.icon}</span>
                  <span className="option-label">{tone.label}</span>
                  <span className="option-description">{tone.description}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Target Audience */}
          <div className="option-group">
            <label>{t('socialMedia.targetAudience')}</label>
            <div className="options-grid">
              {audiences.map(audience => (
                <button
                  key={audience.value}
                  className={`option-btn ${targetAudience === audience.value ? 'active' : ''}`}
                  onClick={() => setTargetAudience(audience.value)}
                >
                  <span className="option-icon">{audience.icon}</span>
                  <span className="option-label">{audience.label}</span>
                  <span className="option-description">{audience.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SocialMediaPostOptions; 