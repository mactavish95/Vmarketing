import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import SocialMediaDashboard from '../components/SocialMediaDashboard';
import './Dashboard.css';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(getApiUrl('/auth/session'), { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!data || !data.authenticated) {
          navigate('/login');
        } else {
          setUser(data.user || null);
        }
      })
      .catch(() => navigate('/login'));
  }, [navigate]);

  return (
    <div className="dashboard-layout">
      <SocialMediaDashboard />
    </div>
  );
} 