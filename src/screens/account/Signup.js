import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getApiUrl } from '../../config/api';
import './Login.css'; // path is correct since Login.css is in the same folder after move
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validate = () => {
    if (!form.email || !form.password || !form.confirmPassword) {
      setError(t('signup.errorRequired') || 'Email and password are required.');
      return false;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError(t('signup.errorEmail') || 'Invalid email format.');
      return false;
    }
    if (form.password.length < 6) {
      setError(t('signup.errorPassword') || 'Password must be at least 6 characters.');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError(t('signup.errorPasswordMatch') || 'Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(getApiUrl('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(t('signup.success') || 'Account created successfully! You can now log in.');
        setForm({ name: '', email: '', password: '', confirmPassword: '' });
        setTimeout(() => {
          navigate('/login');
        }, 1200); // 1.2s delay to show success message
      } else {
        setError(data.error || t('signup.errorGeneric') || 'Failed to create account.');
      }
    } catch (err) {
      setError(t('signup.errorNetwork') || 'Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="login-bg">
      <main className="login-card">
        <h1 className="login-title">{t('signup.title') || 'Create your account'}</h1>
        <p className="login-subtitle">{t('signup.subtitle') || 'Sign up to get started:'}</p>
        {error && <div className="login-error">{error}</div>}
        {success && <div className="login-success">{success}</div>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }} autoComplete="off">
          <div style={{ marginBottom: 16 }}>
            <input
              type="text"
              name="name"
              className="login-input"
              placeholder={t('signup.name') || 'Name (optional)'}
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <input
              type="email"
              name="email"
              className="login-input"
              placeholder={t('signup.email') || 'Email'}
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
          <div style={{ marginBottom: 16, position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="login-input"
              placeholder={t('signup.password') || 'Password'}
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="login-btn"
              style={{
                position: 'absolute',
                right: 8,
                top: 8,
                background: 'none',
                color: '#2563eb',
                fontSize: 14,
                padding: '2px 8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'none',
                width: 'auto',
                minWidth: 0
              }}
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <div style={{ marginBottom: 24, position: 'relative' }}>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              className="login-input"
              placeholder={t('signup.confirmPassword') || 'Confirm Password'}
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              className="login-btn"
              style={{
                position: 'absolute',
                right: 8,
                top: 8,
                background: 'none',
                color: '#2563eb',
                fontSize: 14,
                padding: '2px 8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: 'none',
                width: 'auto',
                minWidth: 0
              }}
              tabIndex={-1}
              onClick={() => setShowConfirmPassword((v) => !v)}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button
            type="submit"
            className="login-btn"
            style={{ width: '100%', background: '#2563eb' }}
            disabled={loading}
          >
            {loading ? t('signup.loading') || 'Signing up...' : t('signup.submit') || 'Sign Up'}
          </button>
        </form>
        <div className="login-footer" style={{ marginTop: 20 }}>
          <span>
            {t('signup.haveAccount') || 'Already have an account?'}{' '}
            <a href="/login" className="login-support-link">{t('signup.loginLink') || 'Log in'}</a>
          </span>
        </div>
      </main>
    </div>
  );
} 