import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';

const CookieDebug = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testCookie = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(getApiUrl('/auth/test-cookie'), {
        credentials: 'include'
      });
      const data = await response.json();
      setDebugInfo(prev => ({ ...prev, cookieTest: data }));
    } catch (err) {
      setError('Cookie test failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const testSession = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(getApiUrl('/auth/session'), {
        credentials: 'include'
      });
      const data = await response.json();
      setDebugInfo(prev => ({ ...prev, sessionTest: data }));
    } catch (err) {
      setError('Session test failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(getApiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'testpassword'
        })
      });
      const data = await response.json();
      setDebugInfo(prev => ({ ...prev, loginTest: data }));
    } catch (err) {
      setError('Login test failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get browser info
    setDebugInfo({
      browser: {
        userAgent: navigator.userAgent,
        cookieEnabled: navigator.cookieEnabled,
        platform: navigator.platform,
        language: navigator.language
      },
      location: {
        href: window.location.href,
        origin: window.location.origin,
        protocol: window.location.protocol,
        hostname: window.location.hostname
      },
      apiConfig: {
        baseURL: getApiUrl(''),
        environment: process.env.NODE_ENV
      }
    });
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🔍 Cookie & Session Debug</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testCookie}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 15px' }}
        >
          Test Cookie
        </button>
        <button 
          onClick={testSession}
          disabled={loading}
          style={{ marginRight: '10px', padding: '10px 15px' }}
        >
          Test Session
        </button>
        <button 
          onClick={testLogin}
          disabled={loading}
          style={{ padding: '10px 15px' }}
        >
          Test Login
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <h3>Browser Info</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', fontSize: '12px' }}>
            {JSON.stringify(debugInfo.browser, null, 2)}
          </pre>
        </div>

        <div>
          <h3>Location Info</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', fontSize: '12px' }}>
            {JSON.stringify(debugInfo.location, null, 2)}
          </pre>
        </div>

        <div>
          <h3>API Config</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', fontSize: '12px' }}>
            {JSON.stringify(debugInfo.apiConfig, null, 2)}
          </pre>
        </div>

        <div>
          <h3>Cookie Test</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', fontSize: '12px' }}>
            {JSON.stringify(debugInfo.cookieTest, null, 2)}
          </pre>
        </div>

        <div>
          <h3>Session Test</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', fontSize: '12px' }}>
            {JSON.stringify(debugInfo.sessionTest, null, 2)}
          </pre>
        </div>

        <div>
          <h3>Login Test</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', fontSize: '12px' }}>
            {JSON.stringify(debugInfo.loginTest, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CookieDebug; 