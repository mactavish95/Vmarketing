import React from 'react';
import { useTranslation } from 'react-i18next';
import { getApiUrl } from '../../config/api';
import './Login.css'; // path is correct since Login.css is in the same folder after move
import { useNavigate } from 'react-router-dom';

const providers = [
  { key: 'facebook', name: 'Facebook', icon: '📘', color: '#1877f2' },
  { key: 'google', name: 'Google', icon: '🔎', color: '#ea4335' },
  { key: 'twitter', name: 'Twitter', icon: '🐦', color: '#1da1f2' },
  { key: 'linkedin', name: 'LinkedIn', icon: '💼', color: '#0077b5' }
];

export default function Login() {
  const { t } = useTranslation();
  const [error, setError] = React.useState('');
  const [loadingProvider, setLoadingProvider] = React.useState('');
  const [localLoading, setLocalLoading] = React.useState(false);
  const [localForm, setLocalForm] = React.useState({ email: '', password: '' });
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    fetch(getApiUrl('/auth/session'), { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data && data.authenticated) {
          navigate('/dashboard');
        }
      })
      .catch(() => {});
  }, [navigate]);

  const handleLogin = (provider) => {
    setError('');
    setLoadingProvider(provider);
    // Try to open the OAuth window, fallback to redirect
    try {
      window.location.href = getApiUrl(`/auth/${provider}`);
    } catch (err) {
      setError(t('login.errorProvider', { provider: provider }) || 'Failed to start login.');
      setLoadingProvider('');
    }
  };

  const handleLocalInput = (e) => {
    setLocalForm({ ...localForm, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLocalLogin = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setError('');
    try {
      const res = await fetch(getApiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(localForm)
      });
      const data = await res.json();
      if (data.success) {
        navigate('/dashboard');
      } else {
        setError(data.error || t('login.errorLocal') || 'Login failed.');
      }
    } catch (err) {
      setError(t('login.errorLocal') || 'Login failed.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <main className="login-card">
        <h1 className="login-title">{t('login.title') || 'Sign in to your account'}</h1>
        <p className="login-subtitle">{t('login.subtitle') || 'Choose a provider to continue:'}</p>
        {error && <div className="login-error">{error}</div>}
        <div className="login-providers">
          {providers.map((p) => (
            <button
              key={p.key}
              className="login-btn"
              style={{ background: p.color, opacity: loadingProvider && loadingProvider !== p.key ? 0.6 : 1 }}
              onClick={() => handleLogin(p.key)}
              aria-label={`Login with ${p.name}`}
              disabled={!!loadingProvider}
            >
              <span className="login-btn-icon">{p.icon}</span>
              {loadingProvider === p.key
                ? t('login.loading') || 'Redirecting...'
                : t(`login.with${p.name}`) || `Continue with ${p.name}`}
            </button>
          ))}
        </div>
        <div style={{ margin: '24px 0', borderTop: '1px solid #e5e7eb', textAlign: 'center', color: '#64748b', fontSize: 14, paddingTop: 16 }}>
          {t('login.orLocal') || 'Or log in with email:'}
        </div>
        <form onSubmit={handleLocalLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            name="email"
            value={localForm.email}
            onChange={handleLocalInput}
            placeholder={t('login.email') || 'Email'}
            required
            autoComplete="email"
            className="login-input"
            style={{ padding: 12, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15 }}
          />
          <input
            type="password"
            name="password"
            value={localForm.password}
            onChange={handleLocalInput}
            placeholder={t('login.password') || 'Password'}
            required
            autoComplete="current-password"
            className="login-input"
            style={{ padding: 12, borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 15 }}
          />
          <button
            type="submit"
            className="login-btn"
            style={{ background: '#2563eb', color: 'white', fontWeight: 700, fontSize: 15, borderRadius: 8, padding: '10px 18px' }}
            disabled={localLoading}
          >
            {localLoading ? t('login.loading') || 'Logging in...' : t('login.localLogin') || 'Log in'}
          </button>
        </form>
        <div className="login-footer">
          <span>Need help? <a href="mailto:support@vmarketing.app" className="login-support-link">Contact support</a></span>
        </div>
      </main>
    </div>
  );
}

// Helper to shade color for hover effect
function shadeColor(color, percent) {
  let R = parseInt(color.substring(1,3),16);
  let G = parseInt(color.substring(3,5),16);
  let B = parseInt(color.substring(5,7),16);
  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);
  R = (R<255)?R:255;  
  G = (G<255)?G:255;  
  B = (B<255)?B:255;  
  const RR = ((R.toString(16).length===1)?"0":"") + R.toString(16);
  const GG = ((G.toString(16).length===1)?"0":"") + G.toString(16);
  const BB = ((B.toString(16).length===1)?"0":"") + B.toString(16);
  return "#"+RR+GG+BB;
} 