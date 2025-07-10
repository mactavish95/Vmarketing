import React, { useEffect, useState } from 'react';
import SocialMediaPostResult from '../components/SocialMediaPostResult';
import { useTranslation } from 'react-i18next';
import apiConfig from '../config/api';
import '../screens/SocialMediaPost.css';

const SocialMediaPostHistory = () => {
  const { t } = useTranslation();
  const [globalHistory, setGlobalHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');

  // Dummy setters for props not used in history-only view
  const noop = () => {};

  // Fetch global history from backend
  useEffect(() => {
    const fetchGlobalHistory = async () => {
      setIsHistoryLoading(true);
      setHistoryError('');
      try {
        const res = await fetch(`${apiConfig.baseURL}/social-posts`);
        const data = await res.json();
        if (data.success && Array.isArray(data.posts)) {
          setGlobalHistory(data.posts);
        } else {
          setHistoryError(t('socialMedia.failedToFetchHistory'));
        }
      } catch (err) {
        setHistoryError(t('socialMedia.failedToFetchHistory'));
      } finally {
        setIsHistoryLoading(false);
      }
    };
    fetchGlobalHistory();
  }, [t]);

  // Group posts by platform
  const groupHistoryByPlatform = (history) => {
    if (!Array.isArray(history)) return {};
    return history.reduce((acc, post) => {
      if (!acc[post.platform]) acc[post.platform] = [];
      acc[post.platform].push(post);
      return acc;
    }, {});
  };

  // Minimal props for SocialMediaPostResult to render history section only
  return (
    <div className="social-media-post">
      <div className="page-header">
        <h1>📚 {t('socialMedia.historyPageTitle') || 'Social Media Post History'}</h1>
        <p>{t('socialMedia.historyPageSubtitle') || 'Browse all your generated social media posts by platform.'}</p>
      </div>
      <div className="section history-section mobile-history-section">
        <SocialMediaPostResult
          enhancedContent={null}
          reviewedContent={null}
          isReviewing={false}
          showOriginalContent={false}
          setShowOriginalContent={noop}
          showComparison={false}
          setShowComparison={noop}
          content={''}
          platform={''}
          postType={''}
          tone={''}
          targetAudience={''}
          getPlatformIcon={() => ''}
          getToneIcon={() => ''}
          getAudienceIcon={() => ''}
          tones={[]}
          audiences={[]}
          platforms={[]}
          selectedPlatform={null}
          isOverLimit={false}
          qualityAnalysis={null}
          copyToClipboard={noop}
          openPreviewWindow={noop}
          generationHistory={[]}
          setContent={noop}
          setEnhancedContent={noop}
          setPlatform={noop}
          setPostType={noop}
          setTone={noop}
          setTargetAudience={noop}
          setContentStructure={noop}
          setEngagementGoal={noop}
          setContentLength={noop}
          setBrandVoiceIntensity={noop}
          setEngagementUrgency={noop}
          setSituation={noop}
          postTypes={[]}
          brandVoiceIntensities={[]}
          engagementUrgencies={[]}
          situations={[]}
          modalPost={null}
          setModalPost={noop}
          globalHistory={globalHistory}
          isHistoryLoading={isHistoryLoading}
          historyError={historyError}
          groupHistoryByPlatform={groupHistoryByPlatform}
        />
      </div>
    </div>
  );
};

export default SocialMediaPostHistory; 