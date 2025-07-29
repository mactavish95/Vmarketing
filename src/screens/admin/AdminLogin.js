import React from 'react';
import { useTranslation } from 'react-i18next';
import { getApiUrl } from '../../config/api';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

export default function AdminLogin() {
  const { t } = useTranslation();
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({ email: '', password: '' });
  const navigate = useNavigate();

  // Redirect if already authenticated as admin
  React.useEffect(() => {
    fetch(getApiUrl('/admin/session'), { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.user && data.user.role === 'admin') {
          navigate('/admin/dashboard');
        }
      })
      .catch(() => {});
  }, [navigate]);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(getApiUrl('/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (data.success) {
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Admin login failed.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-bg">
      <main className="admin-login-card">
        <div className="admin-login-header">
          <h1 className="admin-login-title">Admin Panel</h1>
          <p className="admin-login-subtitle">Sign in to access admin controls</p>
        </div>
        
        {error && <div className="admin-login-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="email" className="admin-form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleInput}
              placeholder="admin@example.com"
              required
              autoComplete="email"
              className="admin-form-input"
            />
          </div>
          
          <div className="admin-form-group">
            <label htmlFor="password" className="admin-form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleInput}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="admin-form-input"
            />
          </div>
          
          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in to Admin Panel'}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <p className="admin-login-note">
            This is a restricted admin area. Only authorized administrators can access this panel.
          </p>
          <a href="/" className="admin-back-link">← Back to main site</a>
        </div>
      </main>
    </div>
  );
} 