import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BlogIndex = () => {
  const [activeTab, setActiveTab] = useState('published');
  const [blogHistory, setBlogHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadBlogHistory();
  }, []);

  const loadBlogHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem('blogHistory') || '[]');
      setBlogHistory(history);
    } catch (error) {
      console.error('Error loading blog history:', error);
      setBlogHistory([]);
    }
  };

  const deleteBlog = (id) => {
    const updatedHistory = blogHistory.filter(blog => blog.id !== id);
    localStorage.setItem('blogHistory', JSON.stringify(updatedHistory));
    setBlogHistory(updatedHistory);
  };

  const copyBlog = (blogPost) => {
    navigator.clipboard.writeText(blogPost);
    alert('Blog post copied to clipboard!');
  };

  const filteredBlogs = blogHistory.filter(blog => {
    const matchesSearch = blog.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.restaurantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || blog.restaurantType === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getWordCount = (content) => {
    return content.split(/\s+/).length;
  };

  const getRestaurantTypeIcon = (type) => {
    const icons = {
      restaurant: '🍽️',
      cafe: '☕',
      pizzeria: '🍕',
      bakery: '🥐',
      bar: '🍺',
      'food-truck': '🚚',
      'fine-dining': '🍷',
      'fast-casual': '🥪'
    };
    return icons[type] || '🍽️';
  };

  const getToneIcon = (tone) => {
    const icons = {
      professional: '👔',
      casual: '😊',
      enthusiastic: '🎉',
      elegant: '✨',
      rustic: '🏡',
      modern: '🚀'
    };
    return icons[tone] || '📝';
  };

  const blogPosts = [
    {
      slug: 'overview',
      title: 'AI-Powered Review Generation: The Complete Guide',
      excerpt: 'Discover how our AI-powered platform revolutionizes review creation with voice analysis, sentiment detection, and professional writing assistance.',
      category: 'Overview',
      readTime: '8 min read',
      date: 'July 2024',
      image: '🤖',
      color: '#667eea'
    },
    {
      slug: 'restaurant-reviews',
      title: 'Transform Your Restaurant Reviews with AI',
      excerpt: 'Learn how AI can help you create compelling, authentic restaurant reviews that capture the essence of dining experiences.',
      category: 'Restaurant',
      readTime: '6 min read',
      date: 'July 2024',
      image: '🍽️',
      color: '#ff6b6b'
    },
    {
      slug: 'hotel-reviews',
      title: 'AI Hotel Review Generation: A Traveler\'s Best Friend',
      excerpt: 'Create detailed hotel reviews that help fellow travelers make informed decisions with AI-powered insights and analysis.',
      category: 'Hotel',
      readTime: '7 min read',
      date: 'July 2024',
      image: '🏨',
      color: '#20c997'
    },
    {
      slug: 'product-reviews',
      title: 'Smart Product Review Creation with AI',
      excerpt: 'Generate comprehensive product reviews that highlight features, benefits, and real-world usage experiences.',
      category: 'Product',
      readTime: '5 min read',
      date: 'July 2024',
      image: '📱',
      color: '#f7b731'
    },
    {
      slug: 'customer-service-ai',
      title: 'AI Customer Service Responses: Building Better Relationships',
      excerpt: 'Explore how AI-powered customer service responses can transform negative reviews into positive customer experiences.',
      category: 'Customer Service',
      readTime: '9 min read',
      date: 'July 2024',
      image: '💬',
      color: '#4b7bec'
    },
    {
      slug: 'your-custom-post',
      title: 'Your Custom Blog Post Title',
      excerpt: 'Your custom blog post excerpt goes here. This should be a brief description of what the post covers.',
      category: 'Custom',
      readTime: '5 min read',
      date: 'July 2024',
      image: '📝',
      color: '#a55eea'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #4f8cff 0%, #38e8ff 100%)',
          padding: '40px 32px',
          textAlign: 'center'
        }}>
          <span style={{ 
            fontSize: '64px', 
            marginBottom: '16px', 
            display: 'block',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}>📝</span>
          <h1 style={{ 
            margin: '0 0 12px 0', 
            fontWeight: '800', 
            fontSize: '36px', 
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            ReviewGen Blog
          </h1>
          <p style={{ 
            margin: '0', 
            fontSize: '18px', 
            color: '#fff',
            opacity: '0.95'
          }}>
            Insights, tips, and guides for AI-powered review generation
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '40px 32px' }}>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '32px',
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid #e9ecef'
          }}>
            <button
              onClick={() => setActiveTab('published')}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'published' ? '#667eea' : 'transparent',
                color: activeTab === 'published' ? '#fff' : '#4a5568',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              📚 Published Articles ({blogPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              style={{
                flex: 1,
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'history' ? '#667eea' : 'transparent',
                color: activeTab === 'history' ? '#fff' : '#4a5568',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ✍️ Your Blog Posts ({blogHistory.length})
            </button>
          </div>

          {activeTab === 'published' ? (
            /* Published Blog Posts */
            <div>
              <h2 style={{ 
                margin: '0 0 20px 0', 
                color: '#2d3748', 
                fontSize: '24px',
                fontWeight: '700'
              }}>
                Latest Articles
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '24px',
                marginBottom: '40px'
              }}>
                {blogPosts.map((post) => (
                  <Link 
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'block'
                    }}
                  >
                    <div style={{
                      background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-4px)';
                      e.target.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '16px'
                      }}>
                        <div style={{
                          background: `linear-gradient(135deg, ${post.color} 0%, ${post.color}dd 100%)`,
                          borderRadius: '12px',
                          width: '48px',
                          height: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px'
                        }}>
                          {post.image}
                        </div>
                        <div>
                          <span style={{
                            background: post.color,
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {post.category}
                          </span>
                        </div>
                      </div>

                      <h3 style={{
                        margin: '0 0 12px 0',
                        color: '#2d3748',
                        fontSize: '18px',
                        fontWeight: '700',
                        lineHeight: '1.4'
                      }}>
                        {post.title}
                      </h3>

                      <p style={{
                        margin: '0 0 16px 0',
                        color: '#4a5568',
                        lineHeight: '1.6',
                        fontSize: '14px',
                        flex: 1
                      }}>
                        {post.excerpt}
                      </p>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 'auto'
                      }}>
                        <span style={{
                          color: '#718096',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {post.date}
                        </span>
                        <span style={{
                          color: '#4a5568',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            /* Blog History */
            <div>
              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                marginBottom: '32px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  color: '#fff'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>{blogHistory.length}</div>
                  <div style={{ fontSize: '14px', opacity: '0.9' }}>Total Posts</div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #20c997 0%, #14a085 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  color: '#fff'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>
                    {blogHistory.reduce((total, blog) => total + getWordCount(blog.blogPost), 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '14px', opacity: '0.9' }}>Total Words</div>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  color: '#fff'
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏪</div>
                  <div style={{ fontSize: '24px', fontWeight: '700' }}>
                    {new Set(blogHistory.map(blog => blog.restaurantName)).size}
                  </div>
                  <div style={{ fontSize: '14px', opacity: '0.9' }}>Restaurants</div>
                </div>
              </div>

              {/* Filters */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
                flexWrap: 'wrap',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <input
                    type="text"
                    placeholder="Search by topic or restaurant name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e1e5e9',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    fontSize: '16px',
                    minWidth: '150px'
                  }}
                >
                  <option value="all">All Types</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Café</option>
                  <option value="pizzeria">Pizzeria</option>
                  <option value="bakery">Bakery</option>
                  <option value="bar">Bar/Pub</option>
                  <option value="food-truck">Food Truck</option>
                  <option value="fine-dining">Fine Dining</option>
                  <option value="fast-casual">Fast Casual</option>
                </select>
                <button
                  onClick={loadBlogHistory}
                  style={{
                    background: '#667eea',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🔄 Refresh
                </button>
              </div>

              {/* Blog Posts */}
              {filteredBlogs.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  color: '#6c757d'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '24px' }}>
                    {blogHistory.length === 0 ? 'No blog posts yet' : 'No posts match your search'}
                  </h3>
                  <p style={{ margin: '0 0 24px 0', fontSize: '16px' }}>
                    {blogHistory.length === 0 
                      ? 'Create your first blog post to get started!' 
                      : 'Try adjusting your search or filter criteria.'
                    }
                  </p>
                  {blogHistory.length === 0 && (
                    <Link
                      to="/blog-creator"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: '#fff',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}
                    >
                      ✍️ Create Your First Blog Post
                    </Link>
                  )}
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '24px'
                }}>
                  {filteredBlogs.map((blog) => (
                    <div key={blog.id} style={{
                      background: '#f8f9fa',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid #e9ecef',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px'
                      }}>
                        <div>
                          <h3 style={{
                            margin: '0 0 8px 0',
                            color: '#2d3748',
                            fontSize: '18px',
                            fontWeight: '700',
                            lineHeight: '1.4'
                          }}>
                            {blog.topic}
                          </h3>
                          <p style={{
                            margin: '0',
                            color: '#4a5568',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>
                            {blog.restaurantName}
                          </p>
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '8px'
                        }}>
                          <button
                            onClick={() => copyBlog(blog.blogPost)}
                            style={{
                              background: '#28a745',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                            title="Copy blog post"
                          >
                            📋
                          </button>
                          <button
                            onClick={() => deleteBlog(blog.id)}
                            style={{
                              background: '#dc3545',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '6px 10px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                            title="Delete blog post"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <div style={{
                        background: '#fff',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '16px',
                        border: '1px solid #e9ecef',
                        maxHeight: '200px',
                        overflow: 'hidden',
                        position: 'relative'
                      }}>
                        <div style={{
                          color: '#2d3748',
                          fontSize: '14px',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap'
                        }}>
                          {blog.blogPost.substring(0, 300)}
                          {blog.blogPost.length > 300 && '...'}
                        </div>
                        {blog.blogPost.length > 300 && (
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '40px',
                            background: 'linear-gradient(transparent, #fff)',
                            pointerEvents: 'none'
                          }}></div>
                        )}
                      </div>

                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                        marginBottom: '12px'
                      }}>
                        <span style={{
                          background: '#e9ecef',
                          color: '#495057',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {getRestaurantTypeIcon(blog.restaurantType)} {blog.restaurantType}
                        </span>
                        <span style={{
                          background: '#e9ecef',
                          color: '#495057',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {getToneIcon(blog.tone)} {blog.tone}
                        </span>
                        <span style={{
                          background: '#e9ecef',
                          color: '#495057',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          📊 {getWordCount(blog.blogPost)} words
                        </span>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px',
                        color: '#6c757d'
                      }}>
                        <span>{formatDate(blog.timestamp)}</span>
                        <Link
                          to="/blog-creator"
                          style={{
                            color: '#667eea',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '12px'
                          }}
                        >
                          ✍️ Create Similar
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Newsletter Signup */}
          <div style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #bae6fd',
            textAlign: 'center',
            marginTop: '40px'
          }}>
            <h3 style={{
              margin: '0 0 12px 0',
              color: '#0c4a6e',
              fontSize: '20px',
              fontWeight: '700'
            }}>
              Stay Updated
            </h3>
            <p style={{
              margin: '0 0 20px 0',
              color: '#0369a1',
              lineHeight: '1.6'
            }}>
              Get the latest tips and insights on AI-powered review generation
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link 
                to="/blog-creator"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Create Your Blog Post
              </Link>
              <Link 
                to="/generate"
                style={{
                  background: '#e2e8f0',
                  color: '#4a5568',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#cbd5e0';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#e2e8f0';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Try ReviewGen Now
              </Link>
              <Link 
                to="/models"
                style={{
                  background: '#e2e8f0',
                  color: '#4a5568',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#cbd5e0';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#e2e8f0';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Explore AI Models
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogIndex; 