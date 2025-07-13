import React from 'react';
import { useTranslation } from 'react-i18next';

const platformIcons = {
  facebook: '📘',
  instagram: '📸',
  twitter: '🐦',
  linkedin: '💼',
  tiktok: '🎵',
  youtube: '📺',
};

const platformColors = {
  facebook: '#1877f2',
  instagram: '#e4405f',
  twitter: '#1da1f2',
  linkedin: '#0077b5',
  tiktok: '#000',
  youtube: '#ff0000',
};

const FullPostView = ({ post, getToneIcon, tones = [], onClose }) => {
  const { t } = useTranslation();
  if (!post) return null;
  const {
    platform,
    enhanced,
    reviewedContent,
    postType,
    tone,
    targetAudience,
    timestamp,
  } = post;
  const displayContent = reviewedContent || enhanced;
  const toneObj = tones.find(tn => tn.value === tone);

  // Platform-specific rendering
  let platformView = null;
  if (platform === 'facebook') {
    platformView = (
      <div style={{ background: '#f0f2f5', borderRadius: 12, padding: 20, fontFamily: 'inherit', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', border: '1px solid #e4e6ea', marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#1877f2 0%,#42a5f5 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20, fontWeight: 600, boxShadow: '0 2px 8px rgba(24,119,242,0.3)' }}>👤</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#050505', marginBottom: 2 }}>{t('socialMedia.yourPageName')}</div>
            <div style={{ fontSize: 13, color: '#65676b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>{t('socialMedia.justNow')}</span><span>•</span><span>{getToneIcon ? getToneIcon(tone) : ''} {toneObj?.label}</span><span>•</span><span>🌍</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, color: '#64748b', cursor: 'pointer', marginLeft: 8 }} aria-label="Close">✖</button>
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.4, color: '#050505', whiteSpace: 'pre-wrap', wordWrap: 'break-word', marginBottom: 16, padding: 12, background: 'white', borderRadius: 8, border: '1px solid #e4e6ea' }}>{displayContent}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #e4e6ea', fontSize: 15, color: '#65676b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>👍 {t('socialMedia.like')}</span><span>💬 {t('socialMedia.comment')}</span><span>🔄 {t('socialMedia.share')}</span>
          </div>
          <div style={{ fontSize: 13, color: '#65676b' }}>0 {t('socialMedia.comments')} • 0 {t('socialMedia.shares')}</div>
        </div>
      </div>
    );
  } else if (platform === 'instagram') {
    platformView = (
      <div style={{ background: '#fff', borderRadius: 12, padding: 0, fontFamily: 'inherit', border: '1px solid #dbdbdb', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', maxWidth: 400, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderBottom: '1px solid #dbdbdb' }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14 }}>📸</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: '#262626' }}>{t('socialMedia.yourUsername')}</div></div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#64748b', cursor: 'pointer', marginLeft: 8 }} aria-label="Close">✖</button>
        </div>
        <div style={{ width: '100%', height: 300, background: 'linear-gradient(135deg,#fdf2f8 0%,#fce7f3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, color: '#ec4899', borderBottom: '1px solid #dbdbdb' }}>📷</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', borderBottom: '1px solid #dbdbdb' }}>
          <span style={{ fontSize: 24 }}>❤️</span><span style={{ fontSize: 24 }}>💬</span><span style={{ fontSize: 24 }}>📤</span><span style={{ fontSize: 24, marginLeft: 'auto' }}>🔖</span>
        </div>
        <div style={{ padding: '12px 16px', fontSize: 14, lineHeight: 1.5, color: '#262626', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          <div style={{ marginBottom: 8 }}><span style={{ fontWeight: 600, color: '#262626' }}>{t('socialMedia.yourUsername')}</span><span style={{ marginLeft: 8 }}>{displayContent}</span></div>
          <div style={{ color: '#00376b', fontSize: 13, marginTop: 8, lineHeight: 1.4 }}>#socialmedia #content #engagement #marketing #digital</div>
          <div style={{ fontSize: 12, color: '#8e8e8e', marginTop: 8 }}>{t('socialMedia.viewAllComments', { count: 0 })}</div>
        </div>
      </div>
    );
  } else if (platform === 'linkedin') {
    platformView = (
      <div style={{ background: '#fff', borderRadius: 12, padding: 20, fontFamily: 'inherit', border: '1px solid #e0e0e0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, background: '#0077b5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20 }}>💼</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#191919', marginBottom: 2 }}>Your Name</div>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 2 }}>Your Title at Company</div>
            <div style={{ fontSize: 12, color: '#666' }}>now • {getToneIcon ? getToneIcon(tone) : ''} {toneObj?.label}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#64748b', cursor: 'pointer', marginLeft: 8 }} aria-label="Close">✖</button>
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.5, color: '#191919', whiteSpace: 'pre-wrap', wordWrap: 'break-word', marginBottom: 16 }}>{displayContent}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, paddingTop: 16, borderTop: '1px solid #e0e0e0', fontSize: 14, color: '#666' }}>
          <span>👍 Like</span><span>💬 Comment</span><span>🔄 Repost</span><span>📤 Send</span>
        </div>
      </div>
    );
  } else if (platform === 'twitter') {
    platformView = (
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, fontFamily: 'inherit', border: '1px solid #e1e8ed' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, background: '#1da1f2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20 }}>🐦</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#14171a', marginBottom: 2 }}>{t('socialMedia.yourName')}</div>
            <div style={{ fontSize: 14, color: '#657786', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>@{t('socialMedia.yourHandle')}</span><span>•</span><span>{t('socialMedia.now')}</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#64748b', cursor: 'pointer', marginLeft: 8 }} aria-label="Close">✖</button>
        </div>
        <div style={{ fontSize: 15, lineHeight: 1.4, color: '#14171a', whiteSpace: 'pre-wrap', wordWrap: 'break-word', marginBottom: 16 }}>{displayContent}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #e1e8ed', fontSize: 16, color: '#657786' }}>
          <span>💬 0</span><span>🔄 0</span><span>❤️ 0</span><span>📤</span>
        </div>
      </div>
    );
  } else if (platform === 'tiktok') {
    platformView = (
      <div style={{ background: '#000', borderRadius: 12, padding: 0, fontFamily: 'inherit', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', maxWidth: 300, margin: '0 auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.5)', border: 'none', fontSize: 20, color: '#fff', cursor: 'pointer', zIndex: 2 }} aria-label="Close">✖</button>
        <div style={{ width: '100%', height: 400, background: 'linear-gradient(45deg,#ff0050,#00f2ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64, position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 80, height: 80, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#ff0050' }}>▶️</div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.8))', padding: '20px 16px 80px 16px' }}>
          <div style={{ fontSize: 16, lineHeight: 1.4, whiteSpace: 'pre-wrap', wordWrap: 'break-word', marginBottom: 12, maxWidth: 280 }}>{displayContent}</div>
          <div style={{ fontSize: 14, color: '#00f2ea', marginBottom: 12 }}>#fyp #viral #trending #content #tiktok</div>
        </div>
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(45deg,#ff0050,#00f2ea)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🎵</div>
            <div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>@yourusername</div><div style={{ fontSize: 12, color: '#ccc' }}>Original Sound</div></div>
          </div>
          <span style={{ fontSize: 20 }}>⋯</span>
        </div>
        <div style={{ position: 'absolute', right: 16, bottom: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'center' }}><span style={{ fontSize: 32 }}>❤️</span><div style={{ fontSize: 12, marginTop: 4 }}>0</div></div>
          <div style={{ textAlign: 'center' }}><span style={{ fontSize: 32 }}>💬</span><div style={{ fontSize: 12, marginTop: 4 }}>0</div></div>
          <div style={{ textAlign: 'center' }}><span style={{ fontSize: 32 }}>📤</span><div style={{ fontSize: 12, marginTop: 4 }}>Share</div></div>
        </div>
      </div>
    );
  } else if (platform === 'youtube') {
    platformView = (
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, fontFamily: 'Roboto,Arial,sans-serif', border: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, background: '#ff0000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18 }}>📺</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 500, color: '#030303', marginBottom: 2 }}>Your Channel Name</div>
            <div style={{ fontSize: 14, color: '#606060' }}>{timestamp ? new Date(timestamp).toLocaleDateString() : ''} • {getToneIcon ? getToneIcon(tone) : ''} {toneObj?.label}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, color: '#64748b', cursor: 'pointer', marginLeft: 8 }} aria-label="Close">✖</button>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.4, color: '#030303', whiteSpace: 'pre-wrap', wordWrap: 'break-word', marginBottom: 16 }}>{displayContent}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 12, borderTop: '1px solid #e5e5e5', fontSize: 14, color: '#606060' }}>
          <span>👍 0</span><span>👎 0</span><span>💬 0 comments</span><span>📤 Share</span>
        </div>
      </div>
    );
  } else {
    // Fallback for unknown platforms
    platformView = (
      <div style={{ padding: 16, borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0', marginBottom: 0 }}>{displayContent}</div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
      {platformView}
      <div style={{ display: 'flex', gap: 8, marginTop: 18, justifyContent: 'flex-end' }}>
        <button onClick={() => navigator.clipboard.writeText(displayContent)} className="action-btn" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 15, fontWeight: 600, minWidth: 120, cursor: 'pointer', boxShadow: '0 2px 8px rgba(16,185,129,0.10)' }}>📋 {t('socialMedia.copyEnhanced')}</button>
      </div>
    </div>
  );
};

export default FullPostView; 