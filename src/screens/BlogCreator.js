import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiConfig from '../config/api';
import './BlogCreator.css';
import BlogCreatorGuidance from './BlogCreatorGuidance';
import BlogCreatorResult from './BlogCreatorResult';

const BlogCreator = () => {
  const { t } = useTranslation();

  // Main state
  const [currentView, setCurrentView] = useState('guidance'); // 'guidance' or 'result'
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  // Blog data state
  const [blogData, setBlogData] = useState(null);
  const [images, setImages] = useState([]);
  const [generatedBlog, setGeneratedBlog] = useState('');
  const [imageAnalysis, setImageAnalysis] = useState(null);

  // Generate blog post function
  const generateBlogPost = async (formData, formImages, strategicPlan = '') => {
    // Validate input
    if (!formData.topic.trim()) {
      setError(t('pleaseEnterBlogTopic'));
      return;
    }

    if (!formData.mainName.trim()) {
      setError(t('pleaseEnterMainName'));
      return;
    }

    if (!formData.keyPoints.trim()) {
      setError('Please provide key points to include. This helps AI focus on what matters most to your audience.');
      return;
    }

    if (!formData.specialFeatures.trim()) {
      setError('Please describe your special features or highlights. These unique details make your story compelling.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedBlog('');

    try {
      // Force production URL if we're on Netlify
      const isNetlify = window.location.hostname.includes('netlify.app') || window.location.hostname.includes('vmarketing.netlify.app');
      const baseURL = isNetlify ? 'https://vmarketing-backend-server.onrender.com/api' : apiConfig.baseURL;
      
      // Prepare image data for the API
      const imageData = formImages.map(img => ({
        name: img.name,
        type: img.type,
        size: img.size,
        dataUrl: img.dataUrl
      }));

      const res = await fetch(`${baseURL}/blog/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images: imageData,
          strategicPlan: strategicPlan
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGeneratedBlog(data.blogPost);
        setImageAnalysis(data.imageAnalysis);
        setBlogData(formData);
        setImages(formImages);
        
        // Save to localStorage for history
        const blogHistory = JSON.parse(localStorage.getItem('blogHistory') || '[]');
        const newBlog = {
          id: Date.now(),
          ...formData,
          blogPost: data.blogPost,
          images: formImages,
          imageAnalysis: data.imageAnalysis,
          model: data.model,
          wordCount: data.wordCount,
          metadata: data.metadata,
          timestamp: new Date().toISOString()
        };
        blogHistory.unshift(newBlog);
        localStorage.setItem('blogHistory', JSON.stringify(blogHistory.slice(0, 20))); // Keep last 20

        // Save to backend database
        try {
          await fetch(`${baseURL}/blog/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...formData,
              blogPost: data.blogPost,
              images: formImages,
              imageAnalysis: data.imageAnalysis,
              model: data.model,
              wordCount: data.wordCount,
              metadata: data.metadata
            })
          });
        } catch (saveErr) {
          // Optionally show a warning, but don't block UI
          console.warn(t('failedToSaveBlogPostToBackend'), saveErr);
        }

        // Switch to result view
        setCurrentView('result');
      } else {
        setError(data.error || t('failedToGenerateBlogPost'));
      }
    } catch (err) {
      setError(t('networkError', { errorMessage: err.message }));
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle back to guidance
  const handleBackToGuidance = () => {
    setCurrentView('guidance');
    setError('');
  };

  // Handle regenerate
  const handleRegenerate = () => {
    if (blogData) {
      generateBlogPost(blogData, images);
    }
  };

  return (
    <div className="blogcreator-root">
      {currentView === 'guidance' ? (
        <BlogCreatorGuidance 
          onGenerateBlog={generateBlogPost}
          isGenerating={isGenerating}
        />
      ) : (
        <BlogCreatorResult 
          blogData={blogData}
          images={images}
          generatedBlog={generatedBlog}
          imageAnalysis={imageAnalysis}
          onBackToGuidance={handleBackToGuidance}
          onRegenerate={handleRegenerate}
        />
      )}

      {/* Error Messages */}
        {error && (
          <div className="blog-creator-error-message">
            <span className="blog-creator-error-icon">⚠️</span> {error}
          </div>
        )}
    </div>
  );
};

export default BlogCreator; 