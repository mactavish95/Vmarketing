import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import FullPostView from '../components/FullPostView';
import formatInstagramContent from '../utils/formatInstagramContent';
import { useTranslation } from 'react-i18next';
import './Dashboard.css';

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

const platformGradients = {
  facebook: 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)',
  instagram: 'linear-gradient(135deg, #e4405f 0%, #ff6b9d 100%)',
  twitter: 'linear-gradient(135deg, #1da1f2 0%, #64b5f6 100%)',
  linkedin: 'linear-gradient(135deg, #0077b5 0%, #42a5f5 100%)',
  tiktok: 'linear-gradient(135deg, #000 0%, #333 100%)',
  youtube: 'linear-gradient(135deg, #ff0000 0%, #ff6b6b 100%)',
};

const PLATFORM_LABELS = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishedLoading, setPublishedLoading] = useState(true);
  const [error, setError] = useState('');
  const [publishedError, setPublishedError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedPublishedPlatform, setSelectedPublishedPlatform] = useState('');
  const [modalPost, setModalPost] = useState(null);
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [showPublishedPosts] = useState(true);
  const [publishingId, setPublishingId] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetch(getApiUrl('/auth/session'), { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!data || !data.authenticated) {
          navigate('/login');
        } else {
          setUser(data.user || null);
          fetchPosts();
          fetchPublishedPosts();
        }
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  const fetchPosts = () => {
    setLoading(true);
    fetch(getApiUrl('/social-posts'), { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPosts(data.posts);
          const platforms = Object.keys(groupByPlatform(data.posts));
          setSelectedPlatform(platforms[0] || '');
        } else {
          setError(data.error || 'Failed to fetch posts');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Network error');
        setLoading(false);
      });
  };

  const fetchPublishedPosts = () => {
    setPublishedLoading(true);
    fetch(getApiUrl('/social/posts'), { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.posts) {
          setPublishedPosts(data.posts);
          const platforms = Object.keys(groupByPlatform(data.posts));
          setSelectedPublishedPlatform(platforms[0] || '');
        } else {
          setPublishedError('Failed to fetch published posts');
        }
        setPublishedLoading(false);
      })
      .catch(() => {
        setPublishedError('Network error');
        setPublishedLoading(false);
      });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setDeletingId(id);
    fetch(getApiUrl(`/social-posts/${id}`), {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPosts(posts.filter(p => p._id !== id));
        } else {
          setError(data.error || 'Failed to delete post');
        }
        setDeletingId(null);
      })
      .catch(() => {
        setError('Network error');
        setDeletingId(null);
      });
  };

  const handleDeletePublished = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this published post? This will also remove it from the social platform.')) return;
    try {
      const response = await fetch(getApiUrl(`/social/post/${postId}`), {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setPublishedPosts(publishedPosts.filter(p => p._id !== postId));
      } else {
        setPublishedError('Failed to delete published post');
      }
    } catch (error) {
      setPublishedError('Network error');
    }
  };

  const handlePublish = async (post) => {
    if (!window.confirm('Are you sure you want to publish this post?')) return;
    setPublishingId(post._id);
    try {
      const response = await fetch(getApiUrl('/social/publish'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          platform: post.platform,
          content: post.enhanced || post.content,
          accountId: post.accountId || undefined // If available
        })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchPosts();
        fetchPublishedPosts();
      } else {
        alert(data.error || 'Failed to publish post');
      }
    } catch (err) {
      alert('Network error while publishing');
    } finally {
      setPublishingId(null);
    }
  };

  const groupByPlatform = (posts) => {
    const grouped = {};
    posts.forEach(post => {
      if (!grouped[post.platform]) grouped[post.platform] = [];
      grouped[post.platform].push(post);
    });
    return grouped;
  };

  const groupedPosts = groupByPlatform(posts);
  const groupedPublishedPosts = groupByPlatform(publishedPosts);
  const platformKeys = Object.keys(groupedPosts);
  const publishedPlatformKeys = Object.keys(groupedPublishedPosts);

  // Dashboard stats
  const totalPosts = posts.length;
  const totalPublishedPosts = publishedPosts.length;
  const totalPlatforms = platformKeys.length;
  const recentPosts = posts.filter(post => {
    const postDate = new Date(post.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return postDate > weekAgo;
  }).length;
  const recentPublishedPosts = publishedPosts.filter(post => {
    const postDate = new Date(post.publishedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return postDate > weekAgo;
  }).length;

  // Daily motivation tips
  const tips = [
    { icon: '🚀', text: 'Consistency is key! Post regularly to grow your audience.', color: '#3b82f6' },
    { icon: '💡', text: 'Try different tones and formats to see what engages best.', color: '#8b5cf6' },
    { icon: '🎯', text: 'Focus on value: teach, inspire, or entertain your followers.', color: '#10b981' },
    { icon: '📊', text: 'Review your post performance and iterate for success!', color: '#f59e0b' },
    { icon: '✨', text: 'Great content starts with a clear message and a strong call to action.', color: '#ef4444' }
  ];
  const tip = tips[new Date().getDate() % tips.length];

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="dashboard-skeleton">
      <div className="skeleton-header">
        <div className="skeleton-avatar"></div>
        <div className="skeleton-text">
          <div className="skeleton-title"></div>
          <div className="skeleton-subtitle"></div>
        </div>
      </div>
      <div className="skeleton-stats">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-stat"></div>
        ))}
      </div>
      <div className="skeleton-tabs">
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton-tab"></div>
        ))}
      </div>
      <div className="skeleton-posts">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="skeleton-post"></div>
        ))}
      </div>
    </div>
  );

  const formatEngagement = (post) => {
    const likes = post.metadata?.likes || 0;
    const comments = post.metadata?.comments || 0;
    const shares = post.metadata?.shares || 0;
    const views = post.metadata?.views || 0;
    return { likes, comments, shares, views, total: likes + comments + shares };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return '#10b981';
      case 'scheduled': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'draft': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published': return '✅';
      case 'scheduled': return '⏰';
      case 'failed': return '❌';
      case 'draft': return '📝';
      default: return '❓';
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">📊</div>
            <div className="header-text">
              <h1 className="header-title">{t('dashboard.headerTitle')}</h1>
              <p className="header-subtitle">{t('dashboard.headerSubtitle')}</p>
            </div>
          </div>
          <div className={`header-actions${isMobile ? ' mobile-header-actions' : ''}`}>
            <Link to="/social-media" className="new-post-btn">
              <span className="btn-icon">+</span>
              <span className="btn-text">{t('dashboard.newPost')}</span>
            </Link>
            <Link to="/social-media-integration" className="integration-btn">
              <span className="btn-icon">🔗</span>
              <span className="btn-text">{t('dashboard.connectAccounts')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* User Welcome Section */}
            {user && (
        <section className="user-welcome">
          <div className="welcome-content">
            <div className="user-avatar">
                  {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : (user.email ? user.email[0].toUpperCase() : '?')}
                </div>
            <div className="welcome-text">
              <h2 className="welcome-title">{t('dashboard.welcome', { name: user.name || user.email.split('@')[0] })}</h2>
              <p className="welcome-subtitle">{t('dashboard.ready')}</p>
            </div>
          </div>
        </section>
      )}

      {/* Stats Overview */}
      {showStats && (posts.length > 0 || publishedPosts.length > 0) && (
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card total-posts">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <div className="stat-number">{totalPosts}</div>
                <div className="stat-label">{t('dashboard.stats.draftPosts')}</div>
              </div>
            </div>
            <div className="stat-card published-posts">
              <div className="stat-icon">📤</div>
              <div className="stat-content">
                <div className="stat-number">{totalPublishedPosts}</div>
                <div className="stat-label">{t('dashboard.stats.publishedPosts')}</div>
              </div>
            </div>
            <div className="stat-card platforms">
              <div className="stat-icon">🌐</div>
              <div className="stat-content">
                <div className="stat-number">{totalPlatforms}</div>
                <div className="stat-label">{t('dashboard.stats.platforms')}</div>
              </div>
                </div>
            <div className="stat-card recent">
              <div className="stat-icon">🕒</div>
              <div className="stat-content">
                <div className="stat-number">{recentPublishedPosts}</div>
                <div className="stat-label">{t('dashboard.stats.publishedThisWeek')}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Daily Tip */}
      <section className="tip-section">
        <div className="tip-card" style={{ borderLeftColor: tip.color }}>
          <div className="tip-icon" style={{ color: tip.color }}>{tip.icon}</div>
          <div className="tip-content">
            <p className="tip-text">{tip.text}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Published Posts Section */}
        {showPublishedPosts && (
          <section className="published-posts-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">📤</span>
                {t('dashboard.published.title')}
                <span className="section-count">({totalPublishedPosts})</span>
              </h2>
              <p className="section-subtitle">{t('dashboard.published.subtitle')}</p>
            </div>
            {publishedLoading ? (
              <div className="loading-section">
                <div className="loading-spinner"></div>
                <p>{t('dashboard.published.loading')}</p>
              </div>
            ) : publishedError ? (
              <div className="error-section">
                <div className="error-card">
                  <div className="error-icon">⚠️</div>
                  <h3 className="error-title">{t('dashboard.published.failed')}</h3>
                  <p className="error-message">{publishedError}</p>
                  <button onClick={fetchPublishedPosts} className="retry-btn">{t('dashboard.published.tryAgain')}</button>
                </div>
              </div>
            ) : publishedPosts.length === 0 ? (
              <div className="empty-section">
                <div className="empty-card">
                  <div className="empty-icon">📭</div>
                  <h3 className="empty-title">{t('dashboard.published.emptyTitle')}</h3>
                  <p className="empty-message">{t('dashboard.published.emptyMessage')}</p>
                  <Link to="/social-media" className="create-first-btn">
                    <span className="btn-icon">✨</span>
                    <span className="btn-text">{t('dashboard.published.createFirst')}</span>
                  </Link>
        </div>
        </div>
            ) : (
              <>
                {/* Published Platform Tabs */}
                <div className="platform-tabs">
                  <div className="tabs-container">
                    {publishedPlatformKeys.map(platform => (
              <button
                key={platform}
                        onClick={() => setSelectedPublishedPlatform(platform)}
                        className={`platform-tab ${selectedPublishedPlatform === platform ? 'active' : ''}`}
                style={{
                          '--platform-color': platformColors[platform],
                          '--platform-gradient': platformGradients[platform]
                        }}
              >
                        <span className="tab-icon">{platformIcons[platform]}</span>
                        <span className="tab-label">{PLATFORM_LABELS[platform]}</span>
                        <span className="tab-count">{groupedPublishedPosts[platform].length}</span>
              </button>
            ))}
          </div>
                </div>
                {/* Published Posts Grid */}
                <div className="published-posts-grid">
                  {selectedPublishedPlatform && groupedPublishedPosts[selectedPublishedPlatform] &&
                    groupedPublishedPosts[selectedPublishedPlatform].map((post, idx) => {
                      const engagement = formatEngagement(post);
                      return (
                        <div
                          key={post._id}
                          className="published-post-card"
                          style={{
                            '--platform-color': platformColors[post.platform],
                            '--platform-gradient': platformGradients[post.platform],
                            animationDelay: `${idx * 0.1}s`
                          }}
                        >
                          <div className="published-post-header">
                            <div className="published-post-platform">
                              <span className="platform-icon">{platformIcons[post.platform]}</span>
                              <span className="platform-name">{PLATFORM_LABELS[post.platform]}</span>
                            </div>
                            <div className="published-post-status">
                              <span
                                className="status-badge"
                                style={{ backgroundColor: getStatusColor(post.status) }}
                              >
                                {getStatusIcon(post.status)} {post.status}
                              </span>
                            </div>
                          </div>
                          <div className="published-post-content">
                            <div className="content-preview">
                              {post.platform === 'instagram'
                                ? <span dangerouslySetInnerHTML={{ __html: formatInstagramContent(post.content?.substring(0, 120) || '') }} />
                                : (post.content?.substring(0, 120) || '')}
                              {(post.content?.length > 120) ? '...' : ''}
                            </div>
                          </div>
                          <div className="published-post-meta">
                            <div className="published-date">
                              <span className="meta-label">{t('dashboard.published.publishedLabel')}:</span>
                              <span className="meta-value">
                                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : t('dashboard.published.na')}
                              </span>
                            </div>
                            {post.postUrl && (
                              <div className="post-url">
                                <a
                                  href={post.postUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="view-post-link"
                                >
                                  <span className="btn-icon">🔗</span>
                                  <span className="btn-text">{t('dashboard.published.viewPost')}</span>
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="published-post-engagement">
                            <div className="engagement-stats">
                              <div className="engagement-item">
                                <span className="engagement-icon">👍</span>
                                <span className="engagement-count">{engagement.likes}</span>
                              </div>
                              <div className="engagement-item">
                                <span className="engagement-icon">💬</span>
                                <span className="engagement-count">{engagement.comments}</span>
                              </div>
                              <div className="engagement-item">
                                <span className="engagement-icon">🔄</span>
                                <span className="engagement-count">{engagement.shares}</span>
                              </div>
                              {engagement.views > 0 && (
                                <div className="engagement-item">
                                  <span className="engagement-icon">👁️</span>
                                  <span className="engagement-count">{engagement.views}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="published-post-actions">
                            <button
                              className="action-btn view-btn"
                              onClick={() => window.open(post.postUrl, '_blank')}
                              disabled={!post.postUrl}
                            >
                              <span className="btn-icon">👁️</span>
                              <span className="btn-text">{t('dashboard.published.view')}</span>
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDeletePublished(post._id)}
                            >
                              <span className="btn-icon">🗑️</span>
                              <span className="btn-text">{t('dashboard.published.delete')}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </section>
        )}
        {/* Draft Posts Section */}
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="error-section">
            <div className="error-card">
              <div className="error-icon">⚠️</div>
              <h3 className="error-title">{t('dashboard.error.title')}</h3>
              <p className="error-message">{error}</p>
              <button onClick={fetchPosts} className="retry-btn">{t('dashboard.error.tryAgain')}</button>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-section">
            <div className="empty-card">
              <div className="empty-icon">📭</div>
              <h3 className="empty-title">{t('dashboard.draft.emptyTitle')}</h3>
              <p className="empty-message">{t('dashboard.draft.emptyMessage')}</p>
              <Link to="/social-media" className="create-first-btn">
                <span className="btn-icon">✨</span>
                <span className="btn-text">{t('dashboard.draft.createFirst')}</span>
              </Link>
            </div>
          </div>
        ) : (
          <section className="draft-posts-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">📝</span>
                {t('dashboard.draft.title')}
                <span className="section-count">({totalPosts})</span>
              </h2>
              <p className="section-subtitle">{t('dashboard.draft.subtitle')}</p>
            </div>
            {/* Platform Tabs */}
            <div className="platform-tabs">
              <div className="tabs-container">
                {platformKeys.map(platform => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`platform-tab ${selectedPlatform === platform ? 'active' : ''}`}
                    style={{
                      '--platform-color': platformColors[platform],
                      '--platform-gradient': platformGradients[platform]
                    }}
                  >
                    <span className="tab-icon">{platformIcons[platform]}</span>
                    <span className="tab-label">{PLATFORM_LABELS[platform]}</span>
                    <span className="tab-count">{groupedPosts[platform].length}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Posts Grid */}
            <div className="posts-grid">
            {selectedPlatform && groupedPosts[selectedPlatform] && groupedPosts[selectedPlatform].map((post, idx) => (
              <div
                key={post._id}
                  className="post-card"
                style={{
                    '--platform-color': platformColors[post.platform],
                    '--platform-gradient': platformGradients[post.platform],
                    animationDelay: `${idx * 0.1}s`
                  }}
                  onClick={() => setModalPost(post)}
                >
                  <div className="post-header">
                    <div className="post-platform">
                      <span className="platform-icon">{platformIcons[post.platform]}</span>
                      <span className="platform-name">{PLATFORM_LABELS[post.platform]}</span>
                    </div>
                    <div className="post-date">
                      {post.timestamp ? new Date(post.timestamp).toLocaleDateString() : ''}
                    </div>
                </div>
                  <div className="post-content">
                    <div className="content-preview">
                  {post.platform === 'instagram'
                        ? <span dangerouslySetInnerHTML={{ __html: formatInstagramContent(post.enhanced?.substring(0, 120) || post.content?.substring(0, 120) || '') }} />
                        : (post.enhanced?.substring(0, 120) || post.content?.substring(0, 120) || '')}
                      {(post.enhanced?.length > 120 || post.content?.length > 120) ? '...' : ''}
                    </div>
                </div>
                  <div className="post-actions">
                  <button
                      className="action-btn view-btn"
                      onClick={(e) => { e.stopPropagation(); setModalPost(post); }}
                  >
                      <span className="btn-icon">👁️</span>
                      <span className="btn-text">{t('dashboard.draft.view')}</span>
                  </button>
                  <button
                      className="action-btn delete-btn"
                      onClick={(e) => { e.stopPropagation(); handleDelete(post._id); }}
                    disabled={deletingId === post._id}
                  >
                      <span className="btn-icon">🗑️</span>
                      <span className="btn-text">
                    {deletingId === post._id ? t('dashboard.draft.deleting') : t('dashboard.draft.delete')}
                      </span>
                  </button>
                    <button
                      className="action-btn publish-btn"
                      onClick={(e) => { e.stopPropagation(); handlePublish(post); }}
                      disabled={publishingId === post._id}
                      style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}
                    >
                      <span className="btn-icon">📤</span>
                      <span className="btn-text">{publishingId === post._id ? t('dashboard.draft.publishing') : t('dashboard.draft.publish')}</span>
                    </button>
                </div>
              </div>
            ))}
          </div>
          </section>
        )}
      </main>
        {/* Modal for full post view */}
        {modalPost && (
        <div className="modal-overlay" onClick={() => setModalPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalPost(null)}>×</button>
              <FullPostView post={modalPost} onClose={() => setModalPost(null)} />
            </div>
          </div>
        )}
    </div>
  );
} 