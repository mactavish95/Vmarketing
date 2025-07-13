import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './SocialMediaIntegration.css';

const SocialMediaIntegration = ({ 
  content, 
  platform, 
  onPublishSuccess, 
  onPublishError,
  isConnected = false,
  onConnectAccount 
}) => {
  const { t } = useTranslation();
  const [connectedAccounts, setConnectedAccounts] = useState({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

  // Platform configurations
  const platforms = {
    facebook: {
      name: 'Facebook',
      icon: '📘',
      color: '#1877f2',
      authUrl: '/api/auth/facebook',
      scope: 'pages_manage_posts,pages_read_engagement'
    },
    instagram: {
      name: 'Instagram',
      icon: '📸',
      color: '#e4405f',
      authUrl: '/api/auth/instagram',
      scope: 'instagram_basic,instagram_content_publish'
    },
    twitter: {
      name: 'Twitter',
      icon: '🐦',
      color: '#1da1f2',
      authUrl: '/api/auth/twitter',
      scope: 'tweet.read,tweet.write'
    },
    linkedin: {
      name: 'LinkedIn',
      icon: '💼',
      color: '#0077b5',
      authUrl: '/api/auth/linkedin',
      scope: 'w_member_social'
    }
  };

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      const response = await fetch('/api/social/accounts');
      if (response.ok) {
        const accounts = await response.json();
        setConnectedAccounts(accounts);
      }
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
    }
  };

  const connectAccount = async (platformKey) => {
    const platform = platforms[platformKey];
    if (!platform) return;

    try {
      // Open OAuth popup
      const popup = window.open(
        `${platform.authUrl}?scope=${platform.scope}`,
        'social-auth',
        'width=600,height=600,scrollbars=yes,resizable=yes'
      );

      // Listen for OAuth completion
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          fetchConnectedAccounts(); // Refresh accounts
        }
      }, 1000);

    } catch (error) {
      console.error('Error connecting account:', error);
    }
  };

  const disconnectAccount = async (platformKey) => {
    try {
      const response = await fetch(`/api/social/disconnect/${platformKey}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setConnectedAccounts(prev => ({
          ...prev,
          [platformKey]: null
        }));
      }
    } catch (error) {
      console.error('Error disconnecting account:', error);
    }
  };

  const publishContent = async (platformKey) => {
    if (!content || !connectedAccounts[platformKey]) {
      setPublishStatus({ type: 'error', message: 'No content or account connected' });
      return;
    }

    setIsPublishing(true);
    setPublishStatus(null);

    try {
      const response = await fetch('/api/social/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform: platformKey,
          content: content,
          accountId: connectedAccounts[platformKey].id
        })
      });

      const result = await response.json();

      if (response.ok) {
        setPublishStatus({ 
          type: 'success', 
          message: `Successfully published to ${platforms[platformKey].name}!`,
          postId: result.postId
        });
        onPublishSuccess && onPublishSuccess(platformKey, result);
      } else {
        setPublishStatus({ 
          type: 'error', 
          message: result.error || 'Failed to publish content' 
        });
        onPublishError && onPublishError(platformKey, result.error);
      }
    } catch (error) {
      setPublishStatus({ 
        type: 'error', 
        message: 'Network error while publishing' 
      });
      onPublishError && onPublishError(platformKey, error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const getAccountStatus = (platformKey) => {
    const account = connectedAccounts[platformKey];
    if (!account) return 'disconnected';
    if (account.expiresAt && new Date(account.expiresAt) < new Date()) {
      return 'expired';
    }
    return 'connected';
  };

  return (
    <div className="social-integration">
      <div className="integration-header">
        <h3 className="integration-title">
          <span className="integration-icon">🔗</span>
          {t('socialMedia.integration.title')}
        </h3>
        <p className="integration-subtitle">
          {t('socialMedia.integration.subtitle')}
        </p>
      </div>

      <div className="accounts-grid">
        {Object.entries(platforms).map(([platformKey, platformConfig]) => {
          const status = getAccountStatus(platformKey);
          const account = connectedAccounts[platformKey];

          return (
            <div key={platformKey} className={`account-card ${status}`}>
              <div className="account-header">
                <div className="platform-info">
                  <span className="platform-icon" style={{ color: platformConfig.color }}>
                    {platformConfig.icon}
                  </span>
                  <div className="platform-details">
                    <h4 className="platform-name">{platformConfig.name}</h4>
                    <span className={`status-badge ${status}`}>
                      {status === 'connected' && '✅ Connected'}
                      {status === 'expired' && '⚠️ Expired'}
                      {status === 'disconnected' && '❌ Not Connected'}
                    </span>
                  </div>
                </div>
              </div>

              {account && (
                <div className="account-details">
                  <div className="account-info">
                    <span className="account-name">{account.name}</span>
                    {account.username && (
                      <span className="account-username">@{account.username}</span>
                    )}
                  </div>
                  {account.profileImage && (
                    <img 
                      src={account.profileImage} 
                      alt="Profile" 
                      className="account-avatar"
                    />
                  )}
                </div>
              )}

              <div className="account-actions">
                {status === 'disconnected' && (
                  <button
                    onClick={() => connectAccount(platformKey)}
                    className="connect-btn"
                    style={{ backgroundColor: platformConfig.color }}
                  >
                    <span className="btn-icon">🔗</span>
                    {t('socialMedia.integration.connect')}
                  </button>
                )}

                {status === 'expired' && (
                  <button
                    onClick={() => connectAccount(platformKey)}
                    className="reconnect-btn"
                    style={{ backgroundColor: platformConfig.color }}
                  >
                    <span className="btn-icon">🔄</span>
                    {t('socialMedia.integration.reconnect')}
                  </button>
                )}

                {status === 'connected' && (
                  <>
                    <button
                      onClick={() => publishContent(platformKey)}
                      disabled={isPublishing || !content}
                      className="publish-btn"
                      style={{ backgroundColor: platformConfig.color }}
                    >
                      <span className="btn-icon">
                        {isPublishing ? '⏳' : '📤'}
                      </span>
                      {isPublishing 
                        ? t('socialMedia.integration.publishing') 
                        : t('socialMedia.integration.publish')
                      }
                    </button>
                    <button
                      onClick={() => disconnectAccount(platformKey)}
                      className="disconnect-btn"
                    >
                      <span className="btn-icon">❌</span>
                      {t('socialMedia.integration.disconnect')}
                    </button>
                  </>
                )}
              </div>

              {/* Publish Status */}
              {publishStatus && publishStatus.type === 'success' && (
                <div className="publish-status success">
                  <span className="status-icon">✅</span>
                  <span className="status-message">{publishStatus.message}</span>
                  {publishStatus.postId && (
                    <a 
                      href={`/api/social/post/${publishStatus.postId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-post-link"
                    >
                      {t('socialMedia.integration.viewPost')}
                    </a>
                  )}
                </div>
              )}

              {publishStatus && publishStatus.type === 'error' && (
                <div className="publish-status error">
                  <span className="status-icon">❌</span>
                  <span className="status-message">{publishStatus.message}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Publish Section */}
      {content && Object.keys(connectedAccounts).some(key => getAccountStatus(key) === 'connected') && (
        <div className="quick-publish-section">
          <h4 className="quick-publish-title">
            <span className="title-icon">🚀</span>
            {t('socialMedia.integration.quickPublish')}
          </h4>
          <div className="quick-publish-grid">
            {Object.entries(platforms).map(([platformKey, platformConfig]) => {
              const status = getAccountStatus(platformKey);
              if (status !== 'connected') return null;

              return (
                <button
                  key={platformKey}
                  onClick={() => publishContent(platformKey)}
                  disabled={isPublishing}
                  className="quick-publish-btn"
                  style={{ 
                    backgroundColor: platformConfig.color,
                    opacity: isPublishing ? 0.6 : 1
                  }}
                >
                  <span className="platform-icon">{platformConfig.icon}</span>
                  <span className="platform-name">{platformConfig.name}</span>
                  {isPublishing && <span className="loading-spinner"></span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Integration Tips */}
      <div className="integration-tips">
        <h4 className="tips-title">
          <span className="tips-icon">💡</span>
          {t('socialMedia.integration.tips.title')}
        </h4>
        <ul className="tips-list">
          <li>{t('socialMedia.integration.tips.oauth')}</li>
          <li>{t('socialMedia.integration.tips.permissions')}</li>
          <li>{t('socialMedia.integration.tips.security')}</li>
          <li>{t('socialMedia.integration.tips.refresh')}</li>
        </ul>
      </div>
    </div>
  );
};

export default SocialMediaIntegration; 