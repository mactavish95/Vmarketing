import React, { useState } from 'react';
import QualityAnalyzer from './QualityAnalyzer';

// Example component showing different ways to use QualityAnalyzer
const QualityAnalyzerExample = () => {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('facebook');
  const [tone, setTone] = useState('engaging');

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>QualityAnalyzer Component Examples</h2>
      
      {/* Example 1: Basic Usage with UI */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Example 1: Basic Usage with UI</h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter content to analyze..."
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '16px'
          }}
        />
        
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={{ marginRight: '12px', padding: '8px' }}
        >
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
          <option value="twitter">Twitter</option>
        </select>
        
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="engaging">Engaging</option>
          <option value="professional">Professional</option>
          <option value="casual">Casual</option>
        </select>
        
        <QualityAnalyzer
          content={content}
          platform={platform}
          tone={tone}
          targetAudience="general"
          postType="general"
          contentStructure="story"
          engagementGoal="engagement"
          brandVoiceIntensity="moderate"
          engagementUrgency="normal"
          situation="general"
          autoAnalyze={true}
          showUI={true}
          onAnalysisComplete={(analysis) => {
            console.log('Analysis completed:', analysis);
          }}
          onAnalysisError={(error) => {
            console.error('Analysis error:', error);
          }}
        />
      </div>

      {/* Example 2: Programmatic Usage (No UI) */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Example 2: Programmatic Usage (No UI)</h3>
        <p>This example shows how to use QualityAnalyzer programmatically without displaying the UI.</p>
        
        <ProgrammaticExample />
      </div>

      {/* Example 3: Custom Configuration */}
      <div style={{ marginBottom: '40px' }}>
        <h3>Example 3: Custom Configuration</h3>
        <p>This example shows QualityAnalyzer with custom settings and manual trigger.</p>
        
        <CustomConfigExample />
      </div>
    </div>
  );
};

// Example component for programmatic usage
const ProgrammaticExample = () => {
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    // Get the QualityAnalyzer instance without UI
    const analyzer = (
      <QualityAnalyzer
        content="This is a sample post for analysis."
        platform="facebook"
        tone="professional"
        targetAudience="business"
        postType="educational"
        contentStructure="tips"
        engagementGoal="education"
        brandVoiceIntensity="strong"
        engagementUrgency="high"
        situation="promotional"
        autoAnalyze={false}
        showUI={false}
        onAnalysisComplete={(analysis) => {
          setResult(analysis);
          setIsAnalyzing(false);
        }}
        onAnalysisError={(error) => {
          console.error('Analysis failed:', error);
          setIsAnalyzing(false);
        }}
      />
    );

    // In a real scenario, you would use a ref to call the analyzeQuality method
    // This is just for demonstration
    console.log('Analyzer component created:', analyzer);
  };

  return (
    <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        style={{
          padding: '8px 16px',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isAnalyzing ? 'not-allowed' : 'pointer',
          marginBottom: '16px'
        }}
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Programmatically'}
      </button>
      
      {result && (
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '4px' }}>
          <h4>Analysis Result:</h4>
          <p><strong>Overall Score:</strong> {Math.round(result.overallScore * 100)}%</p>
          <p><strong>Strengths:</strong> {result.strengths?.join(', ')}</p>
          <p><strong>Suggestions:</strong> {result.suggestions?.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

// Example component for custom configuration
const CustomConfigExample = () => {
  const [customContent, setCustomContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  return (
    <div style={{ padding: '16px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
      <textarea
        value={customContent}
        onChange={(e) => setCustomContent(e.target.value)}
        placeholder="Enter custom content..."
        style={{
          width: '100%',
          minHeight: '80px',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          marginBottom: '16px'
        }}
      />
      
      <QualityAnalyzer
        content={customContent}
        platform="instagram"
        tone="casual"
        targetAudience="youth"
        postType="story"
        contentStructure="list"
        engagementGoal="conversation"
        brandVoiceIntensity="subtle"
        engagementUrgency="low"
        situation="celebration"
        contentType="instagram_post"
        autoAnalyze={false} // Manual trigger only
        showUI={true}
        onAnalysisComplete={(analysis) => {
          setAnalysisResult(analysis);
          console.log('Custom analysis completed:', analysis);
        }}
        onAnalysisError={(error) => {
          console.error('Custom analysis error:', error);
        }}
      />
      
      {analysisResult && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#f0f9ff', borderRadius: '4px' }}>
          <h4>Custom Analysis Summary:</h4>
          <p>Score: {Math.round(analysisResult.overallScore * 100)}%</p>
          <p>Platform: Instagram</p>
          <p>Tone: Casual</p>
          <p>Target: Youth</p>
        </div>
      )}
    </div>
  );
};

export default QualityAnalyzerExample; 