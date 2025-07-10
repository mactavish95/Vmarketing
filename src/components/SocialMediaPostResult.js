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
            <div><div style="font-size:16px;font-weight:600;color:#191919;margin-bottom:2px;">Your Name</div><div style="font-size:14px;color:#666;margin-bottom:2px;">Your Title at Company</div><div style="font-size:12px;color:#666;">now • ${tone}</div></div>
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
            <div><div style="font-size:16px;font-weight:500;color:#030303;margin-bottom:2px;">Your Channel Name</div><div style="font-size:14px;color:#606060;">${new Date(timestamp).toLocaleDateString()} • ${tone}</div></div>
          </div>
          <div style="font-size:14px;line-height:1.4;color:#030303;white-space:pre-wrap;word-wrap:break-word;margin-bottom:16px;">${item.enhanced}</div>
          <div style="display:flex;align-items:center;gap:16px;padding-top:12px;border-top:1px solid #e5e5e5;font-size:14px;color:#606060;">
            <span>👍 0</span><span>👎 0</span><span>�� 0 comments</span><span>📤 Share</span>
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
      <title>Full Post Details</title>
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
        <h3>📄 Full Post Details</h3>
        <div class="meta"><span class="section-label">Platform:</span> ${item.platform}</div>
        <div class="meta"><span class="section-label">Type:</span> ${item.postType}</div>
        <div class="meta"><span class="section-label">Created:</span> ${new Date(item.timestamp).toLocaleString()}</div>
        <div class="meta"><span class="section-label">Tone:</span> ${item.tone}</div>
        <div class="meta"><span class="section-label">Audience:</span> ${item.targetAudience}</div>
        <div class="meta"><span class="section-label">Length:</span> ${item.length || 'N/A'} words</div>
        <div class="meta"><span class="section-label">Brand Voice:</span> ${item.brandVoiceIntensity || 'N/A'}</div>
        <div class="meta"><span class="section-label">Engagement Urgency:</span> ${item.engagementUrgency || 'N/A'}</div>
        <div class="meta"><span class="section-label">Situation:</span> ${item.situation || 'N/A'}</div>
        <div style="margin-bottom: 16px;"><span class="section-label">Original Content:</span><div class="content-box"><pre style='margin:0;font-family:inherit;font-size:15px;line-height:1.5;white-space:pre-wrap;'>${item.original.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></div></div>
      </div>
      <div class="platform-post-area">
        ${getPlatformPostHTML(item, (x) => x)}
      </div>
      <div class="full-post-metadata" style="margin-top: 0;">
        <div style="margin-bottom: 16px;"><span class="section-label">Enhanced Content:</span><div class="content-box">${item.enhanced}</div></div>
        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px;">
          <button class="action-btn" onclick="navigator.clipboard.writeText(\`${item.enhanced.replace(/`/g, '\`')}\`);alert('Copied!')">📋 Copy Enhanced</button>
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
        <div className="section result-section mobile-result-section" style={{ position: 'relative' }}>
          <h2>✨ {t('socialMedia.enhancedPost')}</h2>
          
          {/* Platform-Specific Post Preview */}
          <div className="platform-preview-container" style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Platform Badge */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'linear-gradient(135deg, #4f8cff 0%, #38e8ff 100%)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              zIndex: 10
            }}>
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
                      {new Date().toLocaleDateString()} • {getToneIcon(tone)} {tones.find(t => t.value === tone)?.label}
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

            {/* Post Statistics */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                gap: '24px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  <span>📊</span>
                  <span><strong>{(reviewedContent || enhancedContent).length}</strong> {t('socialMedia.characters')}</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  color: '#64748b'
                }}>
                  <span>📝</span>
                  <span><strong>{(reviewedContent || enhancedContent).split(' ').length}</strong> {t('socialMedia.words')}</span>
                </div>
                {isOverLimit && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    color: '#ef4444',
                    fontWeight: '600'
                  }}>
                    <span>⚠️</span>
                    <span>Over character limit</span>
                  </div>
                )}
              </div>
              
              <div style={{
                fontSize: '12px',
                color: '#64748b',
                background: '#e2e8f0',
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                {selectedPlatform?.maxLength} char limit
              </div>
            </div>

            {/* Quick Platform Switcher & Content Editor */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '12px',
              padding: '20px',
              marginTop: '20px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                🎛️ {t('socialMedia.quickPlatformSwitch')}
              </h3>
              
              {/* Platform Switcher */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Switch Platform:
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['facebook', 'instagram', 'tiktok'].map(p => (
                    <button
                      key={p}
                      onClick={() => setPlatform(p)}
                      style={{
                        background: platform === p ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#ffffff',
                        color: platform === p ? 'white' : '#374151',
                        border: `1px solid ${platform === p ? '#3b82f6' : '#d1d5db'}`,
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      onMouseEnter={(e) => {
                        if (platform !== p) {
                          e.target.style.background = '#f3f4f6';
                          e.target.style.transform = 'translateY(-1px)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (platform !== p) {
                          e.target.style.background = '#ffffff';
                          e.target.style.transform = 'translateY(0)';
                        }
                      }}
                    >
                      <span>{getPlatformIcon(p)}</span>
                      <span>{platforms.find(pl => pl.value === p)?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Content Editor */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  {t('socialMedia.quickEditContent')}:
                </label>
                <textarea
                  value={reviewedContent || enhancedContent}
                  onChange={(e) => setEnhancedContent(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                                      placeholder={t('socialMedia.editContentPlaceholder')}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '8px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                                      <span>{(reviewedContent || enhancedContent).length} {t('socialMedia.characters')}</span>
                    <span>{(reviewedContent || enhancedContent).split(' ').length} {t('socialMedia.words')}</span>
                  {isOverLimit && (
                    <span style={{ color: '#ef4444', fontWeight: '600' }}>
                      ⚠️ Over limit
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => copyToClipboard(reviewedContent || enhancedContent)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
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
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  👁️ {t('socialMedia.preview')}
                </button>
                <button
                  onClick={() => {
                    // Regenerate content for the current platform
                    if (content.trim()) {
                      // This would need to be passed as a prop or we can just show a message
                      alert('Click the main "Generate Post" button to regenerate content for the new platform.');
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  🔄 {t('socialMedia.regenerate')}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginTop: '20px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => copyToClipboard(reviewedContent || enhancedContent)}
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px 28px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
                }}
              >
                📋 {t('socialMedia.copyPost')}
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
                  borderRadius: '10px',
                  padding: '14px 28px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                }}
              >
                👁️ {t('socialMedia.previewPost')}
              </button>
              <button
                onClick={() => {
                  // Save to favorites or download
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
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px 28px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                💾 {t('socialMedia.savePost')}
              </button>
            </div>
          </div>

          {/* Original Compact Preview (Keep for reference) */}
          <div className="post-preview mobile-post-preview" style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease'
          }}>
            <div className="preview-header" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <div className="preview-title" style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>
                {getPlatformIcon(platform)} {selectedPlatform?.label} Post
              </div>
              <div className="preview-meta" style={{ display: 'flex', gap: '8px', fontSize: '14px', color: '#64748b' }}>
                <span>{getToneIcon(tone)} {tones.find(t => t.value === tone)?.label}</span>
                <span>{getAudienceIcon(targetAudience)} {audiences.find(a => a.value === targetAudience)?.label}</span>
              </div>
            </div>
            
            <div className={`preview-content ${isOverLimit ? 'over-limit' : ''}`} style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#374151',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              marginBottom: '16px'
            }}>
              {reviewedContent || enhancedContent}
            </div>
            
            <div className="preview-footer mobile-preview-footer" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9'
            }}>
              <div className="character-count" style={{ fontSize: '14px', color: '#64748b' }}>
                                  📊 {enhancedContent.length} {t('socialMedia.characters')}
                {isOverLimit && (
                  <span className="limit-warning" style={{ color: '#ef4444', marginLeft: '8px' }}>
                    ⚠️ Over limit
                  </span>
                )}
              </div>
              <div className="preview-actions" style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => copyToClipboard(reviewedContent || enhancedContent)}
                  className="action-btn"
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
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
                  className="action-btn secondary"
                  style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  👁️ {t('socialMedia.preview')}
                </button>
              </div>
            </div>
          </div>

          {/* Quality Analysis */}
          {qualityAnalysis && (
            <div className="quality-overview" style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
                📊 {t('socialMedia.qualityAnalysis')}
              </h3>
              
              <div className="quality-score" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '20px',
                padding: '16px',
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: getQualityColor(qualityAnalysis.overallScore) }}>
                  {(qualityAnalysis.overallScore * 100).toFixed(0)}%
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
                    {getQualityLabel(qualityAnalysis.overallScore)}
                  </div>
                  <div style={{ fontSize: '14px', color: '#64748b' }}>
                    {t('socialMedia.overallQualityScore')}
                  </div>
                </div>
              </div>
              
              <div className="quality-metrics" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {Object.entries(qualityAnalysis.metrics || {}).map(([metric, score]) => (
                  <div key={metric} className="quality-metric" style={{
                    background: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.2s ease'
                  }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                      {metric.charAt(0).toUpperCase() + metric.slice(1).replace(/([A-Z])/g, ' $1')}
                    </h4>
                    <div className="score" style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: getQualityColor(score)
                    }}>
                      {(score * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Section */}
          <div className="comparison-section" style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
              🔍 {t('socialMedia.contentComparison')}
            </h3>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <button
                onClick={() => setShowOriginalContent(!showOriginalContent)}
                className="action-btn"
                style={{
                  background: showOriginalContent ? '#2563eb' : '#f3f4f6',
                  color: showOriginalContent ? 'white' : '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                📝 {showOriginalContent ? t('socialMedia.hide') : t('socialMedia.show')} {t('socialMedia.original')}
              </button>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="action-btn"
                style={{
                  background: showComparison ? '#2563eb' : '#f3f4f6',
                  color: showComparison ? 'white' : '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                ⚖️ {showComparison ? t('socialMedia.hide') : t('socialMedia.show')} {t('socialMedia.comparison')}
              </button>
            </div>

            {/* Original Content */}
            {showOriginalContent && (
              <div className="original-content-section" style={{
                background: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#92400e' }}>
                  📝 {t('socialMedia.originalContent')}
                </h4>
                <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#92400e', whiteSpace: 'pre-wrap' }}>
                  {content}
                </div>
              </div>
            )}

            {/* Side-by-Side Comparison */}
            {showComparison && (
              <div className="comparison-section" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                    📝 {t('socialMedia.original')} ({content.length} {t('socialMedia.chars')})
                  </h4>
                  <div style={{
                    background: 'white',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#374151',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {content}
                  </div>
                </div>
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                    ✨ {t('socialMedia.enhanced')} ({(reviewedContent || enhancedContent).length} {t('socialMedia.chars')})
                  </h4>
                  <div style={{
                    background: 'white',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#374151',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {reviewedContent || enhancedContent}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Loading indicator for review */}
          {isReviewing && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #0ea5e9',
              marginBottom: '16px'
            }}>
              <div className="loading-spinner" style={{
                width: '20px',
                height: '20px',
                border: '2px solid #e0e7ff',
                borderTop: '2px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{ color: '#0c4a6e', fontWeight: '500' }}>
                                  🔍 {t('socialMedia.reviewingContent')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* History Section */}
      <div className="section history-section mobile-history-section">
        <h2>📚 Previous Posts by Platform</h2>
        <p style={{ margin: '0', color: '#666', fontSize: '14px', fontStyle: 'italic' }}>
                        {t('socialMedia.recentlyGeneratedPosts')}
        </p>
        {isHistoryLoading ? (
          <div style={{ color: '#64748b', fontSize: '16px', padding: '24px 0' }}>Loading global history...</div>
        ) : historyError ? (
          <div style={{ color: '#ef4444', fontSize: '16px', padding: '24px 0' }}>{historyError}</div>
        ) : (
          <div style={{ marginTop: '24px' }}>
            {Object.entries(groupHistoryByPlatform(globalHistory)).length > 0 ? (
              Object.entries(groupHistoryByPlatform(globalHistory)).map(([platformKey, posts]) => (
                <div key={platformKey} style={{ marginBottom: '32px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2d3748', fontSize: '20px', fontWeight: '700' }}>
                    <span>{getPlatformIcon(platformKey)}</span>
                    <span>{platforms.find(p => p.value === platformKey)?.label || platformKey}</span>
                    <span style={{ color: '#718096', fontSize: '14px', fontWeight: '400', marginLeft: '8px' }}>({posts.length} post{posts.length > 1 ? 's' : ''})</span>
                  </h3>
                  <div className="history-list">
                    {posts.map((item, index) => (
                      <div key={item._id || item.id} className="history-item">
                        <div className="history-meta">
                          <span className="history-platform">
                            {getPlatformIcon(item.platform)} {platforms.find(p => p.value === item.platform)?.label || item.platform}
                          </span>
                          <span className="history-type">
                            {postTypes.find(pt => pt.value === item.postType)?.label}
                          </span>
                          <span className="history-time">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="history-content">
                          {/* Platform-Specific Preview */}
                          <div className="history-platform-preview" style={{
                            marginBottom: '16px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e2e8f0',
                            transition: 'all 0.3s ease'
                          }}>
                            {/* Facebook Preview */}
                            {item.platform === 'facebook' && (
                              <div style={{
                                background: '#f0f2f5',
                                padding: '16px',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                borderRadius: '8px',
                                border: '1px solid #e4e6ea'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  marginBottom: '12px'
                                }}>
                                  <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    boxShadow: '0 2px 4px rgba(24, 119, 242, 0.3)'
                                  }}>
                                    👤
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      color: '#050505',
                                      marginBottom: '2px'
                                    }}>
                                      Your Page Name
                                    </div>
                                    <div style={{
                                      fontSize: '11px',
                                      color: '#65676b',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}>
                                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                                      <span>•</span>
                                      <span>🌍</span>
                                    </div>
                                  </div>
                                </div>
                                <div style={{
                                  fontSize: '13px',
                                  lineHeight: '1.4',
                                  color: '#050505',
                                  whiteSpace: 'pre-wrap',
                                  wordWrap: 'break-word',
                                  maxHeight: '80px',
                                  overflow: 'hidden',
                                  padding: '8px',
                                  background: 'white',
                                  borderRadius: '6px',
                                  border: '1px solid #e4e6ea'
                                }}>
                                  {item.enhanced.substring(0, 120)}...
                                </div>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  paddingTop: '8px',
                                  borderTop: '1px solid #e4e6ea',
                                  fontSize: '11px',
                                  color: '#65676b'
                                }}>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <span>👍 0</span>
                                    <span>💬 0</span>
                                    <span>🔄 0</span>
                                  </div>
                                  <span>0 comments • 0 shares</span>
                                </div>
                              </div>
                            )}

                            {/* Instagram Preview */}
                            {item.platform === 'instagram' && (
                              <div style={{
                                background: '#ffffff',
                                padding: '0',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                border: '1px solid #dbdbdb',
                                borderRadius: '8px',
                                maxWidth: '300px',
                                margin: '0 auto',
                                overflow: 'hidden'
                              }}>
                                {/* Instagram Header */}
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  padding: '12px',
                                  borderBottom: '1px solid #dbdbdb'
                                }}>
                                  <div style={{
                                    width: '24px',
                                    height: '24px',
                                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '10px'
                                  }}>
                                    📸
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      color: '#262626'
                                    }}>
                                      your_username
                                    </div>
                                  </div>
                                </div>

                                {/* Instagram Image Placeholder */}
                                <div style={{
                                  width: '100%',
                                  height: '200px',
                                  background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '32px',
                                  color: '#ec4899',
                                  borderBottom: '1px solid #dbdbdb'
                                }}>
                                  📷
                                </div>

                                {/* Instagram Actions */}
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  padding: '8px 12px',
                                  borderBottom: '1px solid #dbdbdb'
                                }}>
                                  <span style={{ fontSize: '18px' }}>❤️</span>
                                  <span style={{ fontSize: '18px' }}>💬</span>
                                  <span style={{ fontSize: '18px' }}>📤</span>
                                  <span style={{ fontSize: '18px', marginLeft: 'auto' }}>🔖</span>
                                </div>

                                {/* Instagram Content */}
                                <div style={{
                                  padding: '8px 12px',
                                  fontSize: '11px',
                                  lineHeight: '1.4',
                                  color: '#262626',
                                  whiteSpace: 'pre-wrap',
                                  wordWrap: 'break-word'
                                }}>
                                  <div style={{ marginBottom: '4px' }}>
                                    <span style={{ fontWeight: '600', color: '#262626' }}>your_username</span>
                                    <span style={{ marginLeft: '6px' }}>{item.enhanced.substring(0, 80)}...</span>
                                  </div>
                                  
                                  {/* Instagram Hashtags */}
                                  <div style={{
                                    color: '#00376b',
                                    fontSize: '10px',
                                    marginTop: '4px'
                                  }}>
                                    #socialmedia #content #engagement
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Twitter Preview */}
                            {item.platform === 'twitter' && (
                              <div style={{
                                background: '#ffffff',
                                padding: '16px',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                border: '1px solid #e1e8ed'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  marginBottom: '12px'
                                }}>
                                  <div style={{
                                    width: '36px',
                                    height: '36px',
                                    background: '#1da1f2',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '16px'
                                  }}>
                                    🐦
                                  </div>
                                  <div>
                                    <div style={{
                                      fontSize: '13px',
                                      fontWeight: '700',
                                      color: '#14171a',
                                      marginBottom: '2px'
                                    }}>
                                      Your Name
                                    </div>
                                    <div style={{
                                      fontSize: '12px',
                                      color: '#657786'
                                    }}>
                                      @yourhandle • {new Date(item.timestamp).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                <div style={{
                                  fontSize: '13px',
                                  lineHeight: '1.4',
                                  color: '#14171a',
                                  whiteSpace: 'pre-wrap',
                                  wordWrap: 'break-word',
                                  maxHeight: '80px',
                                  overflow: 'hidden'
                                }}>
                                  {item.enhanced.substring(0, 120)}...
                                </div>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  paddingTop: '8px',
                                  borderTop: '1px solid #e1e8ed',
                                  fontSize: '14px',
                                  color: '#657786'
                                }}>
                                  <span>💬 0</span>
                                  <span>🔄 0</span>
                                  <span>❤️ 0</span>
                                  <span>📤</span>
                                </div>
                              </div>
                            )}

                            {/* LinkedIn Preview */}
                            {item.platform === 'linkedin' && (
                              <div style={{
                                background: '#ffffff',
                                padding: '16px',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                border: '1px solid #e0e0e0'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  marginBottom: '12px'
                                }}>
                                  <div style={{
                                    width: '36px',
                                    height: '36px',
                                    background: '#0077b5',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '16px'
                                  }}>
                                    💼
                                  </div>
                                  <div>
                                    <div style={{
                                      fontSize: '13px',
                                      fontWeight: '600',
                                      color: '#191919',
                                      marginBottom: '2px'
                                    }}>
                                      Your Name
                                    </div>
                                    <div style={{
                                      fontSize: '11px',
                                      color: '#666666'
                                    }}>
                                      Your Title • {new Date(item.timestamp).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                <div style={{
                                  fontSize: '13px',
                                  lineHeight: '1.5',
                                  color: '#191919',
                                  whiteSpace: 'pre-wrap',
                                  wordWrap: 'break-word',
                                  maxHeight: '80px',
                                  overflow: 'hidden'
                                }}>
                                  {item.enhanced.substring(0, 120)}...
                                </div>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '16px',
                                  paddingTop: '8px',
                                  borderTop: '1px solid #e0e0e0',
                                  fontSize: '12px',
                                  color: '#666666'
                                }}>
                                  <span>👍 Like</span>
                                  <span>💬 Comment</span>
                                  <span>🔄 Repost</span>
                                </div>
                              </div>
                            )}

                            {/* TikTok Preview */}
                            {item.platform === 'tiktok' && (
                              <div style={{
                                background: '#000000',
                                padding: '0',
                                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                color: 'white',
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: '8px',
                                maxWidth: '250px',
                                margin: '0 auto'
                              }}>
                                {/* TikTok Video Placeholder */}
                                <div style={{
                                  width: '100%',
                                  height: '300px',
                                  background: 'linear-gradient(45deg, #ff0050, #00f2ea)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '48px',
                                  position: 'relative'
                                }}>
                                  <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '60px',
                                    height: '60px',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
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
                                  padding: '16px 12px',
                                  paddingBottom: '60px'
                                }}>
                                  <div style={{
                                    fontSize: '12px',
                                    lineHeight: '1.4',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    marginBottom: '8px',
                                    maxWidth: '220px'
                                  }}>
                                    {item.enhanced.substring(0, 80)}...
                                  </div>
                                  
                                  {/* TikTok Hashtags */}
                                  <div style={{
                                    fontSize: '11px',
                                    color: '#00f2ea',
                                    marginBottom: '8px'
                                  }}>
                                    #fyp #viral #trending
                                  </div>
                                </div>

                                {/* TikTok Header */}
                                <div style={{
                                  position: 'absolute',
                                  top: '12px',
                                  left: '12px',
                                  right: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between'
                                }}>
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                  }}>
                                    <div style={{
                                      width: '24px',
                                      height: '24px',
                                      background: 'linear-gradient(45deg, #ff0050, #00f2ea)',
                                      borderRadius: '50%',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '10px'
                                    }}>
                                      🎵
                                    </div>
                                    <div>
                                      <div style={{
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        marginBottom: '1px'
                                      }}>
                                        @yourusername
                                      </div>
                                      <div style={{
                                        fontSize: '9px',
                                        color: '#cccccc'
                                      }}>
                                        Original Sound
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* TikTok Side Actions */}
                                <div style={{
                                  position: 'absolute',
                                  right: '12px',
                                  bottom: '80px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '12px'
                                }}>
                                  <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '20px' }}>❤️</div>
                                    <div style={{ fontSize: '9px' }}>0</div>
                                  </div>
                                  <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '20px' }}>💬</div>
                                    <div style={{ fontSize: '9px' }}>0</div>
                                  </div>
                                  <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '20px' }}>📤</div>
                                    <div style={{ fontSize: '9px' }}>Share</div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* YouTube Preview */}
                            {item.platform === 'youtube' && (
                              <div style={{
                                background: '#ffffff',
                                padding: '16px',
                                fontFamily: 'Roboto, Arial, sans-serif',
                                border: '1px solid #e5e5e5'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  marginBottom: '12px'
                                }}>
                                  <div style={{
                                    width: '32px',
                                    height: '32px',
                                    background: '#ff0000',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '14px'
                                  }}>
                                    📺
                                  </div>
                                  <div>
                                    <div style={{
                                      fontSize: '13px',
                                      fontWeight: '500',
                                      color: '#030303',
                                      marginBottom: '2px'
                                    }}>
                                      Your Channel Name
                                    </div>
                                    <div style={{
                                      fontSize: '11px',
                                      color: '#606060'
                                    }}>
                                      {new Date(item.timestamp).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                <div style={{
                                  fontSize: '12px',
                                  lineHeight: '1.4',
                                  color: '#030303',
                                  whiteSpace: 'pre-wrap',
                                  wordWrap: 'break-word',
                                  maxHeight: '80px',
                                  overflow: 'hidden'
                                }}>
                                  {item.enhanced.substring(0, 120)}...
                                </div>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  paddingTop: '8px',
                                  borderTop: '1px solid #e5e5e5',
                                  fontSize: '12px',
                                  color: '#606060'
                                }}>
                                  <span>👍 0</span>
                                  <span>👎 0</span>
                                  <span>💬 0</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Original content preview (collapsed) */}
                          <div className="history-original" style={{
                            fontSize: '12px',
                            color: '#64748b',
                            marginBottom: '8px',
                            padding: '8px',
                            background: '#f8fafc',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0'
                          }}>
                            <strong>Original:</strong> {item.original.substring(0, 80)}...
                          </div>

                          {/* Post metadata */}
                          <div className="history-length-info" style={{
                            display: 'flex',
                            gap: '12px',
                            flexWrap: 'wrap',
                            fontSize: '11px',
                            color: '#64748b',
                            marginTop: '8px'
                          }}>
                            <div className="history-length-item">
                              <span>📏</span> {item.length || t('socialMedia.notAvailable')} {t('socialMedia.words')}
                            </div>
                            <div className="history-length-item">
                              <span>🎭</span> {brandVoiceIntensities.find(bv => bv.value === item.brandVoiceIntensity)?.label || t('socialMedia.notAvailable')}
                            </div>
                            <div className="history-length-item">
                              <span>🔥</span> {engagementUrgencies.find(eu => eu.value === item.engagementUrgency)?.label || t('socialMedia.notAvailable')}
                            </div>
                            <div className="history-length-item">
                              <span>📅</span> {new Date(item.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="history-actions" style={{
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap',
                          marginTop: '12px',
                          padding: '12px',
                          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          transition: 'all 0.3s ease'
                        }}>
                          <button 
                            onClick={() => {
                              setContent(item.original);
                              setEnhancedContent(item.enhanced);
                              setPlatform(item.platform);
                              setPostType(item.postType);
                              setTone(item.tone);
                              setTargetAudience(item.targetAudience);
                              setContentStructure(item.contentStructure);
                              setEngagementGoal(item.engagementGoal);
                              setContentLength(item.contentLength || 'optimal');
                              setBrandVoiceIntensity(item.brandVoiceIntensity);
                              setEngagementUrgency(item.engagementUrgency);
                              setSituation(item.situation);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }} 
                            className="history-action-btn load-btn"
                            style={{
                              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '10px',
                              padding: '10px 16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                              transition: 'all 0.3s ease',
                              minWidth: 'fit-content',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                            }}
                          >
                            <span style={{ fontSize: '16px' }}>🔄</span>
                            <span>Load</span>
                          </button>
                          <button 
                            onClick={() => copyToClipboard(item.enhanced)} 
                            className="history-action-btn copy-btn"
                            style={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '10px',
                              padding: '10px 16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                              transition: 'all 0.3s ease',
                              minWidth: 'fit-content',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                            }}
                          >
                            <span style={{ fontSize: '16px' }}>📋</span>
                            <span>Copy</span>
                          </button>
                          <button
                            onClick={() => openPreviewWindow(
                              item.enhanced,
                              item.platform,
                              item.postType,
                              item.tone,
                              item.targetAudience
                            )}
                            className="history-action-btn preview-btn"
                            style={{
                              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '10px',
                              padding: '10px 16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                              transition: 'all 0.3s ease',
                              minWidth: 'fit-content',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.3)';
                            }}
                          >
                            <span style={{ fontSize: '16px' }}>👁️</span>
                            <span>Preview</span>
                          </button>
                          <button
                            onClick={() => openFullPostWindow(item)}
                            className="history-action-btn view-btn"
                            style={{
                              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '10px',
                              padding: '10px 16px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
                              transition: 'all 0.3s ease',
                              minWidth: 'fit-content',
                              whiteSpace: 'nowrap'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.3)';
                            }}
                          >
                            <span style={{ fontSize: '16px' }}>👁️</span>
                            <span>{t('socialMedia.viewFull')}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              // Show all platforms with empty state if no posts
              <div style={{ color: '#a0aec0', fontStyle: 'italic', padding: '18px 0', fontSize: '16px' }}>
                No posts yet. Create a post above and it will appear here!
              </div>
            )}
          </div>
        )}
        
        {/* Modal for full post view */}
        {modalPost && (
          <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }} onClick={() => setModalPost(null)}>
            <div className="modal-content" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative'
            }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setModalPost(null)}
                className="modal-close-btn"
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                ✖
              </button>
              
              <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '700', color: '#1e293b' }}>
                📄 Full Post Details
              </h3>
              
              <div style={{ marginBottom: '16px' }}>
                <strong>Platform:</strong> {getPlatformIcon(modalPost.platform)} {modalPost.platform}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Type:</strong> {postTypes.find(pt => pt.value === modalPost.postType)?.label}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Created:</strong> {new Date(modalPost.timestamp).toLocaleString()}
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <strong>Original Content:</strong>
                <div style={{
                  background: '#f8fafc',
                  padding: '12px',
                  borderRadius: '6px',
                  marginTop: '8px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {modalPost.original}
                </div>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <strong>Enhanced Content:</strong>
                <div style={{
                  background: '#f0f9ff',
                  padding: '12px',
                  borderRadius: '6px',
                  marginTop: '8px',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}>
                  {modalPost.enhanced}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => copyToClipboard(modalPost.enhanced)}
                  className="action-btn"
                  style={{
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  📋 {t('socialMedia.copyEnhanced')}
                </button>
                <button
                  onClick={() => openPreviewWindow(
                    modalPost.enhanced,
                    modalPost.platform,
                    modalPost.postType,
                    modalPost.tone,
                    modalPost.targetAudience
                  )}
                  className="action-btn secondary"
                  style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  👁️ Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMediaPostResult; 