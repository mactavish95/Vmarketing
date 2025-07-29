import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getApiUrl } from '../../config/api';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    platform: '',
    status: '',
    userId: '',
    search: '',
    sortBy: 'publishedAt',
    sortOrder: 'desc'
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchPosts();
    }
  }, [user, filters]);

  const checkAuth = async () => {
    try {
      const res = await fetch(getApiUrl('/admin/session'), { credentials: 'include' });
      const data = await res.json();
      
      if (data.success && data.user && data.user.role === 'admin') {
        setUser(data.user);
      } else {
        navigate('/admin/login');
      }
    } catch (err) {
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(getApiUrl('/admin/stats?period=30d'), { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const res = await fetch(getApiUrl(`/admin/posts?${params}`), { credentials: 'include' });
      const data = await res.json();
      
      if (data.success) {
        setPosts(data.posts);
        setPagination(data.pagination);
      } else {
        setError(data.error || 'Failed to fetch posts');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setPostsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handlePostAction = async (postId, action, data = {}) => {
    try {
      let url, method, body;
      
      switch (action) {
        case 'hide':
          url = getApiUrl(`/admin/posts/${postId}/visibility`);
          method = 'PATCH';
          body = JSON.stringify({ hidden: true });
          break;
        case 'show':
          url = getApiUrl(`/admin/posts/${postId}/visibility`);
          method = 'PATCH';
          body = JSON.stringify({ hidden: false });
          break;
        case 'delete':
          url = getApiUrl(`/admin/posts/${postId}`);
          method = 'DELETE';
          break;
        default:
          return;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body
      });

      const responseData = await res.json();
      
      if (responseData.success) {
        // Refresh posts
        fetchPosts();
        // Show success message
        alert(responseData.message);
      } else {
        alert(responseData.error || 'Action failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(getApiUrl('/auth/logout'), { 
        method: 'POST', 
        credentials: 'include' 
      });
    } catch (err) {
      // Ignore logout errors
    }
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-header-content">
          <h1>Admin Dashboard</h1>
          <div className="admin-user-info">
            <span>Welcome, {user?.name || user?.email}</span>
            <button onClick={handleLogout} className="admin-logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="admin-container">
        <nav className="admin-nav">
          <button 
            className={`admin-nav-btn ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts Management
          </button>
          <button 
            className={`admin-nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </nav>

        <main className="admin-main">
          {activeTab === 'posts' && (
            <div className="admin-posts-section">
              <div className="admin-filters">
                <div className="filter-group">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="filter-input"
                  />
                </div>
                
                <div className="filter-group">
                  <select 
                    value={filters.platform} 
                    onChange={(e) => handleFilterChange('platform', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Platforms</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>

                <div className="filter-group">
                  <select 
                    value={filters.status} 
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div className="filter-group">
                  <select 
                    value={filters.sortBy} 
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="filter-select"
                  >
                    <option value="publishedAt">Date</option>
                    <option value="content">Content</option>
                    <option value="platform">Platform</option>
                  </select>
                </div>
              </div>

              {error && <div className="admin-error">{error}</div>}

              {postsLoading ? (
                <div className="admin-loading">Loading posts...</div>
              ) : (
                <div className="admin-posts-list">
                  {posts.map(post => (
                    <div key={post.postId} className={`admin-post-card ${post.hidden ? 'hidden' : ''}`}>
                      <div className="post-header">
                        <div className="post-meta">
                          <span className="post-platform">{post.platform}</span>
                          <span className="post-status">{post.status}</span>
                          {post.hidden && <span className="post-hidden">HIDDEN</span>}
                        </div>
                        <div className="post-date">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="post-content">
                        <p>{post.content.substring(0, 200)}...</p>
                      </div>
                      
                      <div className="post-footer">
                        <div className="post-user">
                          <strong>User:</strong> {post.user?.email || 'Unknown'}
                        </div>
                        
                        <div className="post-actions">
                          {post.hidden ? (
                            <button 
                              onClick={() => handlePostAction(post.postId, 'show')}
                              className="action-btn show-btn"
                            >
                              Show
                            </button>
                          ) : (
                            <button 
                              onClick={() => handlePostAction(post.postId, 'hide')}
                              className="action-btn hide-btn"
                            >
                              Hide
                            </button>
                          )}
                          
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this post?')) {
                                handlePostAction(post.postId, 'delete');
                              }
                            }}
                            className="action-btn delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {pagination.pages > 1 && (
                <div className="admin-pagination">
                  <button 
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page <= 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  
                  <span className="pagination-info">
                    Page {filters.page} of {pagination.pages}
                  </span>
                  
                  <button 
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page >= pagination.pages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && stats && (
            <div className="admin-stats-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Posts</h3>
                  <div className="stat-value">{stats.totalPosts}</div>
                </div>
                
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <div className="stat-value">{stats.totalUsers}</div>
                </div>
                
                <div className="stat-card">
                  <h3>Total Likes</h3>
                  <div className="stat-value">{stats.totalLikes?.toLocaleString()}</div>
                </div>
                
                <div className="stat-card">
                  <h3>Total Comments</h3>
                  <div className="stat-value">{stats.totalComments?.toLocaleString()}</div>
                </div>
              </div>

              <div className="stats-details">
                <div className="stats-section">
                  <h3>Posts by Platform</h3>
                  <div className="platform-stats">
                    {Object.entries(stats.postsByPlatform || {}).map(([platform, count]) => (
                      <div key={platform} className="platform-stat">
                        <span className="platform-name">{platform}</span>
                        <span className="platform-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="stats-section">
                  <h3>Posts by Status</h3>
                  <div className="status-stats">
                    {Object.entries(stats.postsByStatus || {}).map(([status, count]) => (
                      <div key={status} className="status-stat">
                        <span className="status-name">{status}</span>
                        <span className="status-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
} 