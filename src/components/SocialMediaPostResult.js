import React from 'react';
import { useTranslation } from 'react-i18next';
import formatInstagramContent from '../utils/formatInstagramContent';

const SocialMediaPostResult = ({
  enhancedContent,
  reviewedContent,
  isReviewing,
  showOriginalContent,
  setShowOriginalContent,
  showComparison,
  setShowComparison,
  content,
  platform,
  postType,
  tone,
  targetAudience,
  getPlatformIcon,
  getToneIcon,
  getAudienceIcon,
  tones,
  audiences,
  platforms,
  selectedPlatform,
  isOverLimit,
  qualityAnalysis,
  copyToClipboard,
  openPreviewWindow,
  generationHistory,
  setContent,
  setEnhancedContent,
  setPlatform,
  setPostType,
  setTone,
  setTargetAudience,
  setContentStructure,
  setEngagementGoal,
  setContentLength,
  setBrandVoiceIntensity,
  setEngagementUrgency,
  setSituation,
  postTypes,
  brandVoiceIntensities,
  engagementUrgencies,
  situations,
  modalPost,
  setModalPost,
  globalHistory,
  isHistoryLoading,
  historyError,
  groupHistoryByPlatform
}) => {
  const { t } = useTranslation();
  
  const getQualityColor = (score) => {
    if (score >= 0.8) return '#10b981';
    if (score >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  const getQualityLabel = (score) => {
    if (score >= 0.8) return t('socialMedia.quality.excellent');
    if (score >= 0.6) return t('socialMedia.quality.good');
    if (score >= 0.4) return t('socialMedia.quality.fair');
    return t('socialMedia.quality.poor');
  };

  // Helper: Platform-specific post HTML for popouts
  function getPlatformPostHTML(item, t) {
    const { platform, enhanced, postType, tone, targetAudience, timestamp } = item;
    // Facebook
    if (platform === 'facebook') {
      return `
        <div style="background:#f0f2f5;border-radius:12px;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);border:1px solid #e4e6ea;margin-bottom:24px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:48px;height:48px;background:linear-gradient(135deg,#1877f2 0%,#42a5f5 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:20px;font-weight:600;box-shadow:0 2px 8px rgba(24,119,242,0.3);">👤</div>
            <div style="flex:1;">
              <div style="font-size:16px;font-weight:600;color:#050505;margin-bottom:2px;">${t('socialMedia.yourPageName')}</div>
              <div style="font-size:13px;color:#65676b;display:flex;align-items:center;gap:4px;">
                <span>${t('socialMedia.justNow')}</span><span>•</span><span>${tone}</span><span>•</span><span>🌍</span>
              </div>
            </div>
            <div style="font-size:20px;color:#65676b;">⋯</div>
          </div>
          <div style="font-size:15px;line-height:1.4;color:#050505;white-space:pre-wrap;word-wrap:break-word;margin-bottom:16px;padding:12px;background:white;border-radius:8px;border:1px solid #e4e6ea;">${item.enhanced}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid #e4e6ea;font-size:15px;color:#65676b;">
            <div style="display:flex;align-items:center;gap:16px;">
              <span>👍 ${t('socialMedia.like')}</span><span>💬 ${t('socialMedia.comment')}</span><span>🔄 ${t('socialMedia.share')}</span>
            </div>
            <div style="font-size:13px;color:#65676b;">0 ${t('socialMedia.comments')} • 0 ${t('socialMedia.shares')}</div>
          </div>
        </div>
      `;
    }
    // Instagram
    if (platform === 'instagram') {
      return `
        <div style="background:#fff;border-radius:12px;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border:1px solid #dbdbdb;box-shadow:0 2px 8px rgba(0,0,0,0.1);max-width:400px;margin:0 auto 24px auto;">
          <div style="display:flex;align-items:center;gap:12px;padding:16px;border-bottom:1px solid #dbdbdb;">
            <div style="width:32px;height:32px;background:linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;">📸</div>
            <div style="flex:1;"><div style="font-size:14px;font-weight:600;color:#262626;">${t('socialMedia.yourUsername')}</div></div>
            <div style="font-size:18px;color:#262626;">⋯</div>
          </div>
          <div style="width:100%;height:300px;background:linear-gradient(135deg,#fdf2f8 0%,#fce7f3 100%);display:flex;align-items:center;justify-content:center;font-size:48px;color:#ec4899;border-bottom:1px solid #dbdbdb;">📷</div>
          <div style="display:flex;align-items:center;gap:16px;padding:12px 16px;border-bottom:1px solid #dbdbdb;">
            <span style="font-size:24px;">❤️</span><span style="font-size:24px;">💬</span><span style="font-size:24px;">📤</span><span style="font-size:24px;margin-left:auto;">🔖</span>
          </div>
          <div style="padding:12px 16px;font-size:14px;line-height:1.5;color:#262626;white-space:pre-wrap;word-wrap:break-word;">
            <div style="margin-bottom:8px;"><span style="font-weight:600;color:#262626;">${t('socialMedia.yourUsername')}</span><span style="margin-left:8px;">${item.enhanced}</span></div>
            <div style="color:#00376b;font-size:13px;margin-top:8px;line-height:1.4;">#socialmedia #content #engagement #marketing #digital</div>
            <div style="font-size:12px;color:#8e8e8e;margin-top:8px;">${t('socialMedia.viewAllComments', { count: 0 })}</div>
          </div>
        </div>
      `;
    }
    // LinkedIn
    if (platform === 'linkedin') {
      return `
        <div style="background:#fff;border-radius:12px;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border:1px solid #e0e0e0;margin-bottom:24px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:48px;height:48px;background:#0077b5;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:20px;">💼</div>
            <div><div style="font-size:16px;font-weight:600;color:#191919;margin-bottom:2px;">${t('socialMedia.yourName')}</div><div style="font-size:14px;color:#666;margin-bottom:2px;">${t('socialMedia.yourTitleAtCompany')}</div><div style="font-size:12px;color:#666;">${t('socialMedia.now')} • ${tone}</div></div>
          </div>
          <div style="font-size:16px;line-height:1.5;color:#191919;white-space:pre-wrap;word-wrap:break-word;margin-bottom:16px;">${item.enhanced}</div>
          <div style="display:flex;align-items:center;gap:24px;padding-top:16px;border-top:1px solid #e0e0e0;font-size:14px;color:#666;">
            <span>👍 Like</span><span>💬 Comment</span><span>🔄 Repost</span><span>📤 Send</span>
          </div>
        </div>
      `;
    }
    // Twitter
    if (platform === 'twitter') {
      return `
        <div style="background:#fff;border-radius:12px;padding:16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border:1px solid #e1e8ed;margin-bottom:24px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:48px;height:48px;background:#1da1f2;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:20px;">🐦</div>
            <div><div style="font-size:15px;font-weight:700;color:#14171a;margin-bottom:2px;">${t('socialMedia.yourName')}</div><div style="font-size:14px;color:#657786;display:flex;align-items:center;gap:4px;"><span>@${t('socialMedia.yourHandle')}</span><span>•</span><span>${t('socialMedia.now')}</span></div></div>
          </div>
          <div style="font-size:15px;line-height:1.4;color:#14171a;white-space:pre-wrap;word-wrap:break-word;margin-bottom:16px;">${item.enhanced}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid #e1e8ed;font-size:16px;color:#657786;">
            <span>💬 0</span><span>🔄 0</span><span>❤️ 0</span><span>📤</span>
          </div>
        </div>
      `;
    }
    // TikTok
    if (platform === 'tiktok') {
      return `
        <div style="background:#000;border-radius:12px;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:white;position:relative;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.3);max-width:300px;margin:0 auto 24px auto;">
          <div style="width:100%;height:400px;background:linear-gradient(45deg,#ff0050,#00f2ea);display:flex;align-items:center;justify-content:center;font-size:64px;position:relative;">
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px;background:rgba(255,255,255,0.9);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:32px;color:#ff0050;">▶️</div>
          </div>
          <div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,0.8));padding:20px 16px 80px 16px;">
            <div style="font-size:16px;line-height:1.4;white-space:pre-wrap;word-wrap:break-word;margin-bottom:12px;max-width:280px;">${item.enhanced}</div>
            <div style="font-size:14px;color:#00f2ea;margin-bottom:12px;">#fyp #viral #trending #content #tiktok</div>
          </div>
          <div style="position:absolute;top:16px;left:16px;right:16px;display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:32px;height:32px;background:linear-gradient(45deg,#ff0050,#00f2ea);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;">🎵</div>
              <div><div style="font-size:14px;font-weight:600;margin-bottom:2px;">@yourusername</div><div style="font-size:12px;color:#ccc;">Original Sound</div></div>
            </div>
            <span style="font-size:20px;">⋯</span>
          </div>
          <div style="position:absolute;right:16px;bottom:100px;display:flex;flex-direction:column;align-items:center;gap:16px;">
            <div style="text-align:center;"><span style="font-size:32px;">❤️</span><div style="font-size:12px;margin-top:4px;">0</div></div>
            <div style="text-align:center;"><span style="font-size:32px;">💬</span><div style="font-size:12px;margin-top:4px;">0</div></div>
            <div style="text-align:center;"><span style="font-size:32px;">📤</span><div style="font-size:12px;margin-top:4px;">Share</div></div>
          </div>
        </div>
      `;
    }
    // YouTube
    if (platform === 'youtube') {
      return `
        <div style="background:#fff;border-radius:12px;padding:16px;font-family:Roboto,Arial,sans-serif;border:1px solid #e5e5e5;margin-bottom:24px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
            <div style="width:40px;height:40px;background:#ff0000;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:18px;">📺</div>
            <div><div style="font-size:16px;font-weight:500;color:#030303;margin-bottom:2px;">${t('socialMedia.yourChannelName')}</div><div style="font-size:14px;color:#606060;">${new Date(timestamp).toLocaleDateString()} • ${tone}</div></div>
          </div>
          <div style="font-size:14px;line-height:1.4;color:#030303;white-space:pre-wrap;word-wrap:break-word;margin-bottom:16px;">${item.enhanced}</div>
          <div style="display:flex;align-items:center;gap:16px;padding-top:12px;border-top:1px solid #e5e5e5;font-size:14px;color:#606060;">
            <span>👍 0</span><span>👎 0</span><span>💬 0 comments</span><span>📤 Share</span>
          </div>
        </div>
      `;
    }
    // Default fallback
    return `<div style='padding:16px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;margin-bottom:24px;'>${item.enhanced}</div>`;
  }

  function openFullPostWindow(item) {
    const win = window.open('', '_blank', 'width=700,height=900');
    if (!win) return;
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t('socialMedia.fullPostDetails')}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
        .full-post-metadata { background: #fff; border-radius: 12px; padding: 24px; max-width: 600px; margin: 40px auto 0 auto; box-shadow: 0 8px 32px rgba(0,0,0,0.12); border: 1px solid #e2e8f0; }
        h3 { font-size: 22px; font-weight: 700; color: #1e293b; margin-bottom: 16px; }
        .meta { margin-bottom: 10px; color: #374151; font-size: 15px; }
        .section-label { font-weight: 600; color: #64748b; margin-bottom: 4px; }
        .content-box { background: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 8px; font-size: 15px; line-height: 1.5; white-space: pre-wrap; }
        .action-btn { background: #2563eb; color: #fff; border: none; border-radius: 6px; padding: 8px 16px; font-size: 14px; cursor: pointer; font-weight: 500; margin-right: 8px; }
        .action-btn:hover { background: #1d4ed8; }
        .platform-post-area { margin: 32px auto 0 auto; max-width: 600px; }
      </style>
    </head>
    <body>
      <div class="full-post-metadata">
        <h3>📄 ${t('socialMedia.fullPostDetails')}</h3>
        <div class="meta"><span class="section-label">${t('socialMedia.result.platform')}:</span> ${item.platform}</div>
        <div class="meta"><span class="section-label">${t('socialMedia.result.type')}:</span> ${item.postType}</div>
        <div class="meta"><span class="section-label">${t('socialMedia.result.created')}:</span> ${new Date(item.timestamp).toLocaleString()}</div>
        <div class="meta"><span class="section-label">${t('socialMedia.result.tone')}:</span> ${item.tone}</div>
        <div class="meta"><span class="section-label">${t('socialMedia.result.audience')}:</span> ${item.targetAudience}</div>
        <div class="meta"><span class="section-label">${t('socialMedia.result.length')}:</span> ${item.length || t('socialMedia.result.notAvailable')} ${t('socialMedia.words')}</div>
        <div class="meta"><span class="section-label">${t('socialMedia.result.brandVoice')}:</span> ${item.brandVoiceIntensity || t('socialMedia.result.notAvailable')}</div>
        <div class="meta"><span class="section-label">${t('socialMedia.result.engagementUrgency')}:</span> ${item.engagementUrgency || t('socialMedia.result.notAvailable')}</div>
        <div class="meta"><span class="section-label">${t('socialMedia.result.situation')}:</span> ${item.situation || t('socialMedia.result.notAvailable')}</div>
        <div style="margin-bottom: 16px;"><span class="section-label">${t('socialMedia.result.originalContent')}:</span><div class="content-box"><pre style='margin:0;font-family:inherit;font-size:15px;line-height:1.5;white-space:pre-wrap;'>${item.original.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></div></div>
      </div>
      <div class="platform-post-area">
        ${getPlatformPostHTML(item, (x) => x)}
      </div>
      <div class="full-post-metadata" style="margin-top: 0;">
        <div style="margin-bottom: 16px;"><span class="section-label">${t('socialMedia.result.enhancedContent')}:</span><div class="content-box">${item.enhanced}</div></div>
        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
          <button class="action-btn" onclick="navigator.clipboard.writeText(\`${item.enhanced.replace(/`/g, '\`')}\`);alert('${t('socialMedia.result.copied')}')">📋 ${t('socialMedia.result.copyEnhanced')}</button>
        </div>
      </div>
    </body>
    </html>
    `;
    win.document.write(html);
    win.document.close();
  }

  return (
    <div>
      {/* Enhanced Content/Result Section */}
      {enhancedContent && (
        <div
          className="section result-section mobile-result-section"
          style={{
            position: 'relative',
            maxWidth: 600,
            margin: '0 auto',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            padding: '20px 12px',
            marginBottom: 32,
            transition: 'all 0.2s',
            width: '100%',
          }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#2563eb', marginBottom: 12, textAlign: 'center', letterSpacing: 0.5 }}>
            ✨ {t('socialMedia.enhancedPost')}
          </h2>
          
          {/* Platform-Specific Post Preview */}
          <div
            className="platform-preview-container"
            style={{
              background: '#f8fafc',
              borderRadius: 12,
              padding: '16px 8px',
              marginBottom: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
            position: 'relative',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            {/* Platform Badge */}
            <div
              style={{
              position: 'absolute',
                top: 10,
                right: 10,
              background: 'linear-gradient(135deg, #4f8cff 0%, #38e8ff 100%)',
              color: 'white',
                padding: '4px 10px',
                borderRadius: 14,
                fontSize: 11,
                fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
                gap: 4,
                zIndex: 10,
                boxShadow: '0 2px 8px rgba(79,140,255,0.10)',
              }}
            >
              <span>{getPlatformIcon(platform)}</span>
              <span>{selectedPlatform?.label}</span>
            </div>

            {/* Platform-Specific Preview */}
            {platform === 'facebook' && (
              <div className="facebook-preview" style={{
                background: '#f0f2f5',
                borderRadius: '12px',
                padding: '20px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e4e6ea'
              }}>
                {/* Facebook Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(24, 119, 242, 0.3)'
                  }}>
                    👤
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#050505',
                      marginBottom: '2px'
                    }}>
                      {t('socialMedia.yourPageName')}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#65676b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{t('socialMedia.justNow')}</span>
                      <span>•</span>
                      <span>{getToneIcon(tone)} {tones.find(t => t.value === tone)?.label}</span>
                      <span>•</span>
                      <span>🌍</span>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '20px',
                    color: '#65676b',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '50%',
                    transition: 'background-color 0.2s'
                  }} onMouseEnter={(e) => e.target.style.backgroundColor = '#e4e6ea'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                    ⋯
                  </div>
                </div>

                {/* Facebook Content */}
                <div style={{
                  fontSize: '15px',
                  lineHeight: '1.4',
                  color: '#050505',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  marginBottom: '16px',
                  padding: '12px',
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #e4e6ea'
                }}>
                  {reviewedContent || enhancedContent}
                </div>

                {/* Facebook Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #e4e6ea',
                  fontSize: '15px',
                  color: '#65676b'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'none',
                      border: 'none',
                      color: '#65676b',
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      transition: 'background-color 0.2s'
                    }} onMouseEnter={(e) => e.target.style.backgroundColor = '#e4e6ea'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                      👍 {t('socialMedia.like')}
                    </button>
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'none',
                      border: 'none',
                      color: '#65676b',
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      transition: 'background-color 0.2s'
                    }} onMouseEnter={(e) => e.target.style.backgroundColor = '#e4e6ea'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                      💬 {t('socialMedia.comment')}
                    </button>
                    <button style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'none',
                      border: 'none',
                      color: '#65676b',
                      cursor: 'pointer',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      transition: 'background-color 0.2s'
                    }} onMouseEnter={(e) => e.target.style.backgroundColor = '#e4e6ea'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                      🔄 {t('socialMedia.share')}
                    </button>
                  </div>
                  <div style={{ fontSize: '13px', color: '#65676b' }}>
                    0 {t('socialMedia.comments')} • 0 {t('socialMedia.shares')}
                  </div>
                </div>
              </div>
            )}

            {platform === 'instagram' && (
              <div className="instagram-preview" style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '0',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                border: '1px solid #dbdbdb',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                {/* Instagram Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderBottom: '1px solid #dbdbdb'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    📸
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#262626'
                    }}>
                      {t('socialMedia.yourUsername')}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '18px',
                    color: '#262626',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '50%',
                    transition: 'background-color 0.2s'
                  }} onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                    ⋯
                  </div>
                </div>

                {/* Instagram Image Placeholder */}
                <div style={{
                  width: '100%',
                  height: '300px',
                  background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  color: '#ec4899',
                  borderBottom: '1px solid #dbdbdb'
                }}>
                  📷
                </div>

                {/* Instagram Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '12px 16px',
                  borderBottom: '1px solid #dbdbdb'
                }}>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'transform 0.2s'
                  }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                    ❤️
                  </button>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'transform 0.2s'
                  }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                    💬
                  </button>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'transform 0.2s'
                  }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                    📤
                  </button>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    transition: 'transform 0.2s',
                    marginLeft: 'auto'
                  }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                    🔖
                  </button>
                </div>

                {/* Instagram Content */}
                <div style={{
                  padding: '12px 16px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: '#262626',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word'
                }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#262626' }}>{t('socialMedia.yourUsername')}</span>
                    <span style={{ marginLeft: '8px' }}>{reviewedContent || enhancedContent}</span>
                  </div>
                  
                  {/* Instagram Hashtags */}
                  <div style={{
                    color: '#00376b',
                    fontSize: '13px',
                    marginTop: '8px',
                    lineHeight: '1.4'
                  }}>
                    #socialmedia #content #engagement #marketing #digital
                  </div>
                  
                  <div style={{
                    fontSize: '12px',
                    color: '#8e8e8e',
                    marginTop: '8px'
                  }}>
                    {t('socialMedia.viewAllComments', { count: 0 })}
                  </div>
                </div>
              </div>
            )}

            {platform === 'twitter' && (
              <div className="twitter-preview" style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '16px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                border: '1px solid #e1e8ed'
              }}>
                {/* Twitter Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#1da1f2',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px'
                  }}>
                    🐦
                  </div>
                  <div>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: '#14171a',
                      marginBottom: '2px'
                    }}>
                      {t('socialMedia.yourName')}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#657786',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>@{t('socialMedia.yourHandle')}</span>
                      <span>•</span>
                      <span>{t('socialMedia.now')}</span>
                    </div>
                  </div>
                </div>

                {/* Twitter Content */}
                <div style={{
                  fontSize: '15px',
                  lineHeight: '1.4',
                  color: '#14171a',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  marginBottom: '16px'
                }}>
                  {reviewedContent || enhancedContent}
                </div>

                {/* Twitter Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #e1e8ed',
                  fontSize: '16px',
                  color: '#657786'
                }}>
                  <span>💬 0</span>
                  <span>🔄 0</span>
                  <span>❤️ 0</span>
                  <span>📤</span>
                </div>
              </div>
            )}

            {platform === 'linkedin' && (
              <div className="linkedin-preview" style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '20px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                border: '1px solid #e0e0e0'
              }}>
                {/* LinkedIn Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#0077b5',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px'
                  }}>
                    💼
                  </div>
                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#191919',
                      marginBottom: '2px'
                    }}>
                      Your Name
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#666666',
                      marginBottom: '2px'
                    }}>
                      Your Title at Company
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#666666'
                    }}>
                      now • {getToneIcon(tone)} {tones.find(t => t.value === tone)?.label}
                    </div>
                  </div>
                </div>

                {/* LinkedIn Content */}
                <div style={{
                  fontSize: '16px',
                  lineHeight: '1.5',
                  color: '#191919',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  marginBottom: '16px'
                }}>
                  {reviewedContent || enhancedContent}
                </div>

                {/* LinkedIn Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid #e0e0e0',
                  fontSize: '14px',
                  color: '#666666'
                }}>
                  <span>👍 Like</span>
                  <span>💬 Comment</span>
                  <span>🔄 Repost</span>
                  <span>📤 Send</span>
                </div>
              </div>
            )}

            {platform === 'tiktok' && (
              <div className="tiktok-preview" style={{
                background: '#000000',
                borderRadius: '12px',
                padding: '0',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                maxWidth: '300px',
                margin: '0 auto'
              }}>
                {/* TikTok Video Placeholder */}
                <div style={{
                  width: '100%',
                  height: '400px',
                  background: 'linear-gradient(45deg, #ff0050, #00f2ea)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80px',
                    height: '80px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    color: '#ff0050'
                  }}>
                    ▶️
                  </div>
                </div>

                {/* TikTok Content Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
                  padding: '20px 16px',
                  paddingBottom: '80px'
                }}>
                  <div style={{
                    fontSize: '16px',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    marginBottom: '12px',
                    maxWidth: '280px'
                  }}>
                    {reviewedContent || enhancedContent}
                  </div>
                  
                  {/* TikTok Hashtags */}
                  <div style={{
                    fontSize: '14px',
                    color: '#00f2ea',
                    marginBottom: '12px'
                  }}>
                    #fyp #viral #trending #content #tiktok
                  </div>
                </div>

                {/* TikTok Header */}
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  right: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(45deg, #ff0050, #00f2ea)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px'
                    }}>
                      🎵
                    </div>
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '2px'
                      }}>
                        @yourusername
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#cccccc'
                      }}>
                        Original Sound
                      </div>
                    </div>
                  </div>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '20px',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '50%',
                    transition: 'background-color 0.2s'
                  }} onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'} onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                    ⋯
                  </button>
                </div>

                {/* TikTok Side Actions */}
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  bottom: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '32px',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '50%',
                      transition: 'transform 0.2s'
                    }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                      ❤️
                    </button>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>0</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '32px',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '50%',
                      transition: 'transform 0.2s'
                    }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                      💬
                    </button>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>0</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '32px',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '50%',
                      transition: 'transform 0.2s'
                    }} onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'} onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                      📤
                    </button>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>Share</div>
                  </div>
                </div>
              </div>
            )}

            {platform === 'youtube' && (
              <div className="youtube-preview" style={{
                background: '#ffffff',
                borderRadius: '12px',
                padding: '16px',
                fontFamily: 'Roboto, Arial, sans-serif',
                border: '1px solid #e5e5e5'
              }}>
                {/* YouTube Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: '#ff0000',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '18px'
                  }}>
                    📺
                  </div>
                  <div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#030303',
                      marginBottom: '2px'
                    }}>
                      Your Channel Name
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#606060'
                    }}>
                      {new Date(timestamp).toLocaleDateString()} • {getToneIcon(tone)} {tones.find(t => t.value === tone)?.label}
                    </div>
                  </div>
                </div>

                {/* YouTube Content */}
                <div style={{
                  fontSize: '14px',
                  lineHeight: '1.4',
                  color: '#030303',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  marginBottom: '16px'
                }}>
                  {reviewedContent || enhancedContent}
                </div>

                {/* YouTube Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  paddingTop: '12px',
                  borderTop: '1px solid #e5e5e5',
                  fontSize: '14px',
                  color: '#606060'
                }}>
                  <span>👍 0</span>
                  <span>👎 0</span>
                  <span>💬 0 comments</span>
                  <span>📤 Share</span>
                </div>
                  </div>
                )}
              </div>
              
          {/* Post Statistics (mobile-friendly) */}
          <div
                      style={{
                        display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
                        alignItems: 'center',
              margin: '12px 0',
              padding: '10px 0',
              borderTop: '1px solid #e2e8f0',
              borderBottom: '1px solid #e2e8f0',
              fontSize: 13,
              color: '#64748b',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', gap: 12 }}>
              <span>📊 {(reviewedContent || enhancedContent).length} {t('socialMedia.characters')}</span>
              <span>📝 {(reviewedContent || enhancedContent).split(' ').length} {t('socialMedia.words')}</span>
                </div>
            {isOverLimit && (
              <span style={{ color: '#ef4444', fontWeight: 600, fontSize: 12 }}>⚠️ Over limit</span>
            )}
              </div>

          {/* Quick Actions (mobile-friendly) */}
          <div
                  style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              margin: '16px 0',
                    width: '100%',
            }}
          >
                <button
                  onClick={() => copyToClipboard(reviewedContent || enhancedContent)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                borderRadius: 8,
                padding: '12px 0',
                fontSize: 16,
                fontWeight: 600,
                    cursor: 'pointer',
                width: '100%',
                boxShadow: '0 2px 8px rgba(16,185,129,0.10)',
                  }}
                >
                  📋 {t('socialMedia.copy')}
                </button>
                <button
                  onClick={() => openPreviewWindow(
                    reviewedContent || enhancedContent,
                    platform,
                    postType,
                    tone,
                    targetAudience
                  )}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    border: 'none',
                borderRadius: 8,
                padding: '12px 0',
                fontSize: 16,
                fontWeight: 600,
                    cursor: 'pointer',
                width: '100%',
                boxShadow: '0 2px 8px rgba(245,158,11,0.10)',
                  }}
                >
                  👁️ {t('socialMedia.preview')}
                </button>
                <button
                  onClick={() => {
                  const postData = {
                    content: reviewedContent || enhancedContent,
                    platform,
                    postType,
                    tone,
                    targetAudience,
                    timestamp: new Date().toISOString()
                  };
                  const blob = new Blob([JSON.stringify(postData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${platform}-post-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: 'white',
                  border: 'none',
                borderRadius: 8,
                padding: '12px 0',
                fontSize: 16,
                fontWeight: 600,
                  cursor: 'pointer',
                width: '100%',
                boxShadow: '0 2px 8px rgba(139,92,246,0.10)',
                }}
              >
                💾 {t('socialMedia.savePost')}
              </button>
          </div>

          {/* Quick Content Editor (mobile-friendly) */}
          <div style={{ margin: '16px 0' }}>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600, color: '#374151' }}>
              {t('socialMedia.quickEditContent')}:
            </label>
            <textarea
              value={reviewedContent || enhancedContent}
              onChange={(e) => setEnhancedContent(e.target.value)}
                  style={{
                width: '100%',
                minHeight: 80,
                padding: 10,
                borderRadius: 8,
                    border: '1px solid #d1d5db',
                fontSize: 14,
                lineHeight: 1.5,
                resize: 'vertical',
                fontFamily: 'inherit',
                marginBottom: 4,
              }}
              placeholder={t('socialMedia.editContentPlaceholder')}
            />
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2, textAlign: 'right' }}>
              {(reviewedContent || enhancedContent).length} {t('socialMedia.characters')} / {(reviewedContent || enhancedContent).split(' ').length} {t('socialMedia.words')}
            </div>
          </div>

          {/* Comparison Section (mobile-friendly) */}
          <div style={{ margin: '16px 0' }}>
              <button
                onClick={() => setShowOriginalContent(!showOriginalContent)}
                style={{
                  background: showOriginalContent ? '#2563eb' : '#f3f4f6',
                  color: showOriginalContent ? 'white' : '#374151',
                  border: '1px solid #d1d5db',
                borderRadius: 6,
                padding: '8px 0',
                fontSize: 14,
                fontWeight: 500,
                width: '100%',
                marginBottom: 8,
                  cursor: 'pointer',
                }}
              >
                📝 {showOriginalContent ? t('socialMedia.hide') : t('socialMedia.show')} {t('socialMedia.original')}
              </button>
              <button
                onClick={() => setShowComparison(!showComparison)}
                style={{
                  background: showComparison ? '#2563eb' : '#f3f4f6',
                  color: showComparison ? 'white' : '#374151',
                  border: '1px solid #d1d5db',
                borderRadius: 6,
                padding: '8px 0',
                fontSize: 14,
                fontWeight: 500,
                width: '100%',
                  cursor: 'pointer',
                }}
              >
                ⚖️ {showComparison ? t('socialMedia.hide') : t('socialMedia.show')} {t('socialMedia.comparison')}
              </button>
            {showOriginalContent && (
              <div style={{
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: 8,
                padding: 12,
                marginTop: 8,
                fontSize: 14,
                color: '#92400e',
                whiteSpace: 'pre-wrap',
              }}>
                <strong>📝 {t('socialMedia.originalContent')}</strong>
                <div>{content}</div>
              </div>
            )}
            {showComparison && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                background: '#f8fafc',
                borderRadius: 8,
                padding: 12,
                border: '1px solid #e2e8f0',
                marginTop: 8,
              }}>
                <div>
                  <strong>📝 {t('socialMedia.original')}</strong>
                  <div style={{
                    background: 'white',
                    padding: 8,
                    borderRadius: 6,
                    fontSize: 13,
                    color: '#374151',
                    whiteSpace: 'pre-wrap',
                  }}>{content}</div>
                </div>
                <div>
                  <strong>✨ {t('socialMedia.enhanced')}</strong>
                  <div style={{
                    background: 'white',
                    padding: 8,
                    borderRadius: 6,
                    fontSize: 13,
                    color: '#374151',
                    whiteSpace: 'pre-wrap',
                  }}>{reviewedContent || enhancedContent}</div>
                </div>
              </div>
            )}
          </div>

          {/* Loading indicator for review (mobile-friendly) */}
          {isReviewing && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: 12,
              background: '#f0f9ff',
              borderRadius: 8,
              border: '1px solid #0ea5e9',
              marginBottom: 8,
              fontSize: 14,
              color: '#0c4a6e',
              fontWeight: 500,
            }}>
              <div className="loading-spinner" style={{
                width: 18,
                height: 18,
                border: '2px solid #e0e7ff',
                borderTop: '2px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}></div>
                                  🔍 {t('socialMedia.reviewingContent')}
            </div>
          )}
        </div>
      )}

      {/* History Section */}
      {/* The history section is now only rendered on the history page. */}
    </div>
  );
};

export default SocialMediaPostResult; 