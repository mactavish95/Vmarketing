import React, { useState } from 'react';
import QualityAnalyzer from './QualityAnalyzer';

const QualityAnalyzerTest = () => {
  const [testContent, setTestContent] = useState('This is a test social media post for Facebook. It should be engaging and informative for our target audience.');

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>QualityAnalyzer Component Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Test Content:
        </label>
        <textarea
          value={testContent}
          onChange={(e) => setTestContent(e.target.value)}
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
          }}
          placeholder="Enter test content here..."
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>QualityAnalyzer Component:</h3>
        <QualityAnalyzer
          content={testContent}
          platform="facebook"
          postType="general"
          tone="engaging"
          targetAudience="general"
          contentStructure="story"
          engagementGoal="awareness"
          brandVoiceIntensity="moderate"
          engagementUrgency="normal"
          situation="general"
          contentType="facebook_post"
          autoAnalyze={true}
          showUI={true}
          onAnalysisComplete={(analysis) => {
            console.log('✅ Quality analysis completed:', analysis);
          }}
          onAnalysisError={(error) => {
            console.error('❌ Quality analysis error:', error);
          }}
        />
      </div>

      <div style={{ 
        padding: '12px', 
        backgroundColor: '#f0f8ff', 
        border: '1px solid #b0d4f1', 
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <strong>Test Instructions:</strong>
        <ul style={{ margin: '8px 0 0 20px' }}>
          <li>Enter different content in the textarea above</li>
          <li>Watch the QualityAnalyzer component update automatically</li>
          <li>Check the browser console for any errors</li>
          <li>Verify that the quality analysis displays correctly</li>
        </ul>
      </div>
    </div>
  );
};

export default QualityAnalyzerTest; 