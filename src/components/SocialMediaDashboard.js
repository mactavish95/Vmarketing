import React, { useState } from 'react';
import { 
  FiTrendingUp, FiTrendingDown, FiUsers, FiHeart, FiMessageCircle, 
  FiEye, FiShare2, FiBarChart, FiPieChart, FiCalendar, FiDownload,
  FiFilter, FiMoreVertical, FiBell, FiSettings, FiRefreshCw, FiSearch,
  FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiYoutube, FiMusic,
  FiHome, FiGrid, FiUser, FiBookmark, FiStar, FiFolder, FiShoppingCart,
  FiUserCheck, FiActivity, FiClock, FiMapPin, FiGlobe, FiMonitor,
  FiSmartphone, FiTablet, FiX, FiMenu
} from 'react-icons/fi';
import './SocialMediaDashboard.css';

// Sample data for social media growth chart
const growthData = [
  { month: 'Jan', reach: 1200, likes: 800, comments: 150 },
  { month: 'Feb', reach: 1800, likes: 1200, comments: 220 },
  { month: 'Mar', reach: 2200, likes: 1600, comments: 280 },
  { month: 'Apr', reach: 2800, likes: 2000, comments: 350 },
  { month: 'May', reach: 3200, likes: 2400, comments: 420 },
  { month: 'Jun', reach: 3800, likes: 2800, comments: 500 },
  { month: 'Jul', reach: 4500, likes: 3400, comments: 600 },
];

// Sample data for age demographics
const ageDemographics = [
  { age: '18-24', percentage: 25, color: '#8b5cf6' },
  { age: '25-34', percentage: 35, color: '#3b82f6' },
  { age: '35-44', percentage: 22, color: '#10b981' },
  { age: '45-54', percentage: 12, color: '#f59e0b' },
  { age: '55+', percentage: 6, color: '#ef4444' },
];

// Sample data for platform demographics
const platformDemographics = [
  { platform: 'Facebook', percentage: 35, color: '#1877f2', icon: FiFacebook },
  { platform: 'Instagram', percentage: 28, color: '#e4405f', icon: FiInstagram },
  { platform: 'Twitter', percentage: 18, color: '#1da1f2', icon: FiTwitter },
  { platform: 'LinkedIn', percentage: 12, color: '#0077b5', icon: FiLinkedin },
  { platform: 'YouTube', percentage: 7, color: '#ff0000', icon: FiYoutube },
];

// Sample engagement metrics
const engagementMetrics = [
  { 
    title: 'Total Reach', 
    value: '45.2K', 
    change: '+11.01%', 
    trend: 'up',
    icon: FiEye,
    color: '#8b5cf6'
  },
  { 
    title: 'Total Likes', 
    value: '3,671', 
    change: '+15.03%', 
    trend: 'up',
    icon: FiHeart,
    color: '#f56565'
  },
  { 
    title: 'Total Comments', 
    value: '2,318', 
    change: '+6.08%', 
    trend: 'up',
    icon: FiMessageCircle,
    color: '#48bb78'
  },
  { 
    title: 'Total Shares', 
    value: '1,847', 
    change: '+8.92%', 
    trend: 'up',
    icon: FiShare2,
    color: '#ed8936'
  },
];

// Sample notifications
const notifications = [
  { id: 1, type: 'success', message: 'New post published successfully', time: '2 minutes ago', icon: '✅' },
  { id: 2, type: 'info', message: 'Engagement rate increased by 15%', time: '5 minutes ago', icon: '📈' },
  { id: 3, type: 'warning', message: 'Scheduled post needs review', time: '10 minutes ago', icon: '⚠️' },
  { id: 4, type: 'success', message: 'Campaign performance improved', time: '15 minutes ago', icon: '🎯' },
];

// Sample activities
const activities = [
  { id: 1, action: 'Published Instagram post', time: '2 minutes ago', icon: '📷', type: 'post' },
  { id: 2, action: 'Updated Facebook campaign', time: '1 hour ago', icon: '📢', type: 'campaign' },
  { id: 3, action: 'Analyzed Twitter metrics', time: '2 hours ago', icon: '📊', type: 'analytics' },
  { id: 4, action: 'Scheduled LinkedIn content', time: '3 hours ago', icon: '📅', type: 'schedule' },
];

// Sample contacts
const contacts = [
  { id: 1, name: 'Sarah Johnson', avatar: 'SJ', online: true, role: 'Content Manager', lastSeen: '2 min ago' },
  { id: 2, name: 'Mike Chen', avatar: 'MC', online: false, role: 'Social Media Specialist', lastSeen: '1 hour ago' },
  { id: 3, name: 'Emma Davis', avatar: 'ED', online: true, role: 'Marketing Director', lastSeen: '5 min ago' },
  { id: 4, name: 'Alex Rodriguez', avatar: 'AR', online: false, role: 'Analytics Lead', lastSeen: '3 hours ago' },
];

// Left Sidebar Component
const LeftSidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: FiHome },
    { id: 'social-media', label: 'Social Media', icon: FiShare2 },
    { id: 'posts', label: 'Posts Analytics', icon: FiBarChart },
    { id: 'users', label: 'Users', icon: FiUsers },
  ];

  return (
    <div className={`left-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <FiGrid />
          </div>
          {!isCollapsed && <span className="logo-text">SocialHub</span>}
        </div>
        <button 
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <FiMenu /> : <FiX />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <h3 className="nav-title">Main Menu</h3>
          <ul className="nav-list">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li 
                  key={item.id}
                  className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <IconComponent className="nav-icon" />
                  {!isCollapsed && <span>{item.label}</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="footer-logo">
          <FiStar />
          {!isCollapsed && <span>Pro Version</span>}
        </div>
      </div>
    </div>
  );
};

// Right Sidebar Component
const RightSidebar = () => {
  return (
    <div className="right-sidebar">
      {/* Notifications */}
      <div className="sidebar-section">
        <div className="section-header">
          <h3 className="sidebar-title">Notifications</h3>
          <button className="notification-badge">
            <FiBell />
            <span className="badge-count">{notifications.length}</span>
          </button>
        </div>
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div key={notification.id} className={`notification-item ${notification.type}`}>
              <div className="notification-icon">{notification.icon}</div>
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Recent Activities</h3>
        <div className="activities-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <p className="activity-action">{activity.action}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contacts */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">Team Contacts</h3>
        <div className="contacts-list">
          {contacts.map((contact) => (
            <div key={contact.id} className="contact-item">
              <div className={`contact-avatar ${contact.online ? 'online' : ''}`}>
                {contact.avatar}
              </div>
              <div className="contact-info">
                <span className="contact-name">{contact.name}</span>
                <span className="contact-role">{contact.role}</span>
                <span className={`contact-status ${contact.online ? 'online' : 'offline'}`}>
                  {contact.online ? 'Online' : `Last seen ${contact.lastSeen}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main Content Component
const MainContent = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Simple Line Chart Component for Growth Metrics
  const GrowthLineChart = () => {
    const maxValue = Math.max(...growthData.map(d => Math.max(d.reach, d.likes, d.comments)));
    const chartHeight = 200;
    const chartWidth = 400;
    const padding = 30;
    const chartAreaWidth = chartWidth - 2 * padding;
    const chartAreaHeight = chartHeight - 2 * padding;

    const getY = (value) => {
      return padding + chartAreaHeight - (value / maxValue) * chartAreaHeight;
    };

    const getX = (index) => {
      return padding + (index / (growthData.length - 1)) * chartAreaWidth;
    };

    return (
      <div className="chart-container">
        <svg width={chartWidth} height={chartHeight}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1={padding}
              y1={padding + ratio * chartAreaHeight}
              x2={chartWidth - padding}
              y2={padding + ratio * chartAreaHeight}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          ))}
          
          {/* Reach line */}
          <polyline
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            points={growthData.map((d, i) => `${getX(i)},${getY(d.reach)}`).join(' ')}
          />
          
          {/* Likes line */}
          <polyline
            fill="none"
            stroke="#f56565"
            strokeWidth="2"
            points={growthData.map((d, i) => `${getX(i)},${getY(d.likes)}`).join(' ')}
          />
          
          {/* Comments line */}
          <polyline
            fill="none"
            stroke="#48bb78"
            strokeWidth="2"
            points={growthData.map((d, i) => `${getX(i)},${getY(d.comments)}`).join(' ')}
          />
          
          {/* Data points */}
          {growthData.map((d, i) => (
            <g key={i}>
              <circle cx={getX(i)} cy={getY(d.reach)} r="3" fill="#8b5cf6" />
              <circle cx={getX(i)} cy={getY(d.likes)} r="3" fill="#f56565" />
              <circle cx={getX(i)} cy={getY(d.comments)} r="3" fill="#48bb78" />
            </g>
          ))}
          
          {/* X-axis labels */}
          {growthData.map((d, i) => (
            <text
              key={i}
              x={getX(i)}
              y={chartHeight - 8}
              textAnchor="middle"
              fontSize="10"
              fill="#64748b"
              fontWeight="500"
            >
              {d.month}
            </text>
          ))}
        </svg>
        
        {/* Simple Legend */}
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#8b5cf6' }}></div>
            <span>Reach</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f56565' }}></div>
            <span>Likes</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#48bb78' }}></div>
            <span>Comments</span>
          </div>
        </div>
      </div>
    );
  };

  // Simple Pie Chart Component
  const SimplePieChart = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.percentage, 0);
    let currentAngle = 0;

    return (
      <div className="simple-pie-chart">
        <h4 className="pie-title">{title}</h4>
        <svg width="120" height="120">
          <g transform="translate(60, 60)">
            {data.map((item, index) => {
              const angle = (item.percentage / total) * 360;
              const x1 = Math.cos((currentAngle * Math.PI) / 180) * 40;
              const y1 = Math.sin((currentAngle * Math.PI) / 180) * 40;
              const x2 = Math.cos(((currentAngle + angle) * Math.PI) / 180) * 40;
              const y2 = Math.sin(((currentAngle + angle) * Math.PI) / 180) * 40;
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 0 0`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              currentAngle += angle;
              
              return (
                <path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  stroke="white"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        </svg>
        
        {/* Simple Legend */}
        <div className="pie-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <div className="legend-color" style={{ backgroundColor: item.color }}></div>
              <span>{item.name}: {item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="main-content">
      {/* Simple Header */}
      <div className="content-header">
        <div className="header-left">
          <h1 className="page-title">Social Media Dashboard</h1>
          <p className="page-subtitle">Track your key performance metrics</p>
        </div>
        
        <div className="header-controls">
          <div className="period-selector">
            <FiCalendar className="calendar-icon" />
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="period-select"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          
          <button className="refresh-btn" title="Refresh data">
            <FiRefreshCw />
          </button>
        </div>
      </div>

      {/* Key Stats Row */}
      <div className="stats-row">
        {engagementMetrics.map((metric, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: metric.color }}>
              <metric.icon />
            </div>
            <div className="stat-info">
              <div className="stat-value">{metric.value}</div>
              <div className="stat-label">{metric.title}</div>
              <div className={`stat-change ${metric.trend}`}>
                {metric.trend === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
                <span>{metric.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Growth Chart */}
        <div className="chart-section">
          <div className="chart-card">
            <h3 className="chart-title">Growth Overview</h3>
            <GrowthLineChart />
          </div>
        </div>

        {/* Demographics */}
        <div className="demographics-section">
          <div className="chart-card">
            <h3 className="chart-title">Audience Demographics</h3>
            <div className="demographics-grid">
              <SimplePieChart 
                data={ageDemographics} 
                title="Age Distribution" 
              />
              <SimplePieChart 
                data={platformDemographics} 
                title="Platform Distribution" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="summary-section">
        <div className="summary-card">
          <h3 className="summary-title">Key Insights</h3>
          <div className="insights-list">
            <div className="insight-item">
              <FiTrendingUp className="insight-icon" />
              <span>Reach increased by 11% this month</span>
            </div>
            <div className="insight-item">
              <FiUsers className="insight-icon" />
              <span>25-34 age group is most engaged (35%)</span>
            </div>
            <div className="insight-item">
              <FiShare2 className="insight-icon" />
              <span>Facebook leads with 35% of audience</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const SocialMediaDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="social-media-dashboard">
      <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MainContent />
      <RightSidebar />
    </div>
  );
};

export default SocialMediaDashboard; 