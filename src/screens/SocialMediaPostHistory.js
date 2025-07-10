import React, { useEffect, useState } from 'react';
import SocialMediaPostResult from '../components/SocialMediaPostResult';
import { useTranslation } from 'react-i18next';
import apiConfig from '../config/api';
import '../screens/SocialMediaPost.css';
import { Link } from 'react-router-dom';

const SocialMediaPostHistory = () => {
  const { t } = useTranslation();
  const [globalHistory, setGlobalHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');

  // Dummy setters for props not used in history-only view
  const noop = () => {};

  useEffect(() => {
    fetchGlobalHistory();
  }, []);

  const fetchGlobalHistory = async () => {
    setIsHistoryLoading(true);
    setHistoryError('');
    try {
      const res = await fetch(apiConfig.baseURL + '/social-posts');
      const data = await res.json();
      if (data.success) {
        setGlobalHistory(data.posts || []);
      } else {
        setHistoryError(t('menu.failedToFetchHistory'));
      }
    } catch (err) {
      setHistoryError(t('menu.failedToFetchHistory'));
    } finally {
      setIsHistoryLoading(false);
    }
  };

  // Group posts by platform
  const groupHistoryByPlatform = (history) => {
    const grouped = {};
    (history || []).forEach((item) => {
      if (!grouped[item.platform]) grouped[item.platform] = [];
      grouped[item.platform].push(item);
    });
    return grouped;
  };

  // Platform icon map
  const platformIcons = {
    facebook: '📘',
    instagram: '📸',
    twitter: '🐦',
    linkedin: '💼',
    tiktok: '🎵',
    youtube: '📺',
  };

  // Platform color map
  const platformColors = {
    facebook: '#1877f2',
    instagram: '#e4405f',
    twitter: '#1da1f2',
    linkedin: '#0077b5',
    tiktok: '#000',
    youtube: '#ff0000',
  };

  // Responsive card grid for posts
  return (
    <div className="social-media-post responsive-mobile" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', padding: 0 }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'linear-gradient(135deg, #4f8cff 0%, #38e8ff 100%)',
        padding: '24px 16px 16px 16px',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        boxShadow: '0 4px 24px rgba(79,140,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to="/social-media" style={{ color: '#fff', fontSize: 24, textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          ←
        </Link>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 24, margin: 0 }}>{t('menu.historyPageTitle')}</h2>
          <div style={{ color: '#e0e7ff', fontSize: 14, marginTop: 4 }}>{t('menu.historyPageSubtitle')}</div>
        </div>
        <div style={{ width: 40 }}></div>
      </div>

      {/* Main content */}
      <div style={{ padding: '16px 8px', maxWidth: 900, margin: '0 auto' }}>
        {isHistoryLoading ? (
          <div style={{ color: '#64748b', fontSize: 18, padding: '48px 0', textAlign: 'center' }}>Loading...</div>
        ) : historyError ? (
          <div style={{ color: '#ef4444', fontSize: 18, padding: '48px 0', textAlign: 'center' }}>{historyError}</div>
        ) : globalHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📭</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>{t('socialMedia.noPostsYet')}</div>
            <div style={{ color: '#94a3b8', fontSize: 15, marginBottom: 24 }}>{t('socialMedia.recentlyGeneratedPosts')}</div>
            <Link to="/social-media" className="action-btn" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 16, fontWeight: 600, textDecoration: 'none', boxShadow: '0 2px 8px rgba(139, 92, 246, 0.2)' }}>
              + {t('menu.socialMedia')}
            </Link>
          </div>
        ) : (
          Object.entries(groupHistoryByPlatform(globalHistory)).map(([platform, posts]) => (
            <div key={platform} style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 28, color: platformColors[platform] }}>{platformIcons[platform]}</span>
                <span style={{ fontWeight: 700, fontSize: 20, color: '#2d3748' }}>{t(`socialMedia.platforms.${platform}`) || platform}</span>
                <span style={{ color: '#64748b', fontSize: 14, fontWeight: 400, marginLeft: 8 }}>({posts.length} post{posts.length > 1 ? 's' : ''})</span>
              </div>
              <div className="post-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 16 }}>
                {posts.map((item) => (
                  <div key={item._id || item.id} className="post-card" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: `2px solid ${platformColors[platform] || '#e2e8f0'}`, padding: 18, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 180, position: 'relative', transition: 'box-shadow 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{platformIcons[platform]}</span>
                      <span style={{ fontWeight: 600, color: platformColors[platform], fontSize: 15 }}>{t(`socialMedia.platforms.${platform}`) || platform}</span>
                      <span style={{ color: '#64748b', fontSize: 12, marginLeft: 'auto' }}>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: 14, color: '#374151', margin: '6px 0', maxHeight: 60, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{item.enhanced.substring(0, 120)}...</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                      <button onClick={() => {
                        const win = window.open('', '_blank', 'width=700,height=900');
                        if (!win) return;
                        win.document.write('<!DOCTYPE html><html><head><title>Full Post</title></head><body>' + `<pre style="font-size:16px;white-space:pre-wrap;">${item.enhanced.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>` + '</body></html>');
                        win.document.close();
                      }} className="action-btn" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600, flex: 1 }}>👁️ {t('socialMedia.viewFull')}</button>
                      <button onClick={() => navigator.clipboard.writeText(item.enhanced)} className="action-btn" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600, flex: 1 }}>📋 {t('socialMedia.copyEnhanced')}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SocialMediaPostHistory; 