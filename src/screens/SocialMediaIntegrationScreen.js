import React from 'react';
import SocialMediaIntegration from '../components/SocialMediaIntegration';
import { useTranslation } from 'react-i18next';
import '../screens/SocialMediaPost.css';

const SocialMediaIntegrationScreen = () => {
  const { t } = useTranslation();
  return (
    <div className="social-media-post responsive-mobile" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', padding: 0 }}>
      <div style={{ maxWidth: 700, margin: '40px auto', background: 'rgba(255,255,255,0.98)', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', padding: 0 }}>
        <div style={{
          background: 'linear-gradient(135deg, #4f8cff 0%, #38e8ff 100%)',
          padding: '40px 24px 24px 24px',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          textAlign: 'center',
          color: '#fff',
        }}>
          <h1 style={{ fontWeight: 800, fontSize: 28, margin: 0 }}>{t('socialMedia.integration.title')}</h1>
          <p style={{ fontSize: 16, margin: '12px 0 0 0', color: '#e0e7ff' }}>{t('socialMedia.integration.subtitle')}</p>
        </div>
        <div style={{ padding: 24 }}>
          <div style={{ marginBottom: 24, color: '#64748b', fontSize: 15, textAlign: 'center' }}>
            {t('socialMedia.integration.tips.oauth')}.<br/>
            {t('socialMedia.integration.tips.permissions')}.<br/>
            {t('socialMedia.integration.tips.security')}.<br/>
            {t('socialMedia.integration.tips.refresh')}.
          </div>
          <SocialMediaIntegration />
        </div>
      </div>
    </div>
  );
};

export default SocialMediaIntegrationScreen; 