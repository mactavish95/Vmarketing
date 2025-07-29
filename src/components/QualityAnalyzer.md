# QualityAnalyzer Component

A comprehensive React component for analyzing the quality of social media content using AI-powered analysis.

## Features

- **AI-Powered Analysis**: Uses NVIDIA's LLM models for detailed content quality assessment
- **Platform-Specific Analysis**: Tailored analysis for different social media platforms
- **Real-time Analysis**: Automatic analysis when content changes
- **Comprehensive Metrics**: Detailed scoring across multiple quality dimensions
- **Visual Feedback**: Color-coded scores and intuitive UI
- **Error Handling**: Robust error handling with fallback mechanisms
- **Customizable**: Configurable analysis parameters and UI display

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `content` | `string` | The content to analyze |
| `platform` | `string` | Social media platform (facebook, instagram, linkedin, twitter, tiktok, youtube) |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `postType` | `string` | `'general'` | Type of post (general, story, educational, promotional, etc.) |
| `tone` | `string` | `'engaging'` | Content tone (engaging, professional, casual, humorous, etc.) |
| `targetAudience` | `string` | `'general'` | Target audience (general, business, youth, parents, etc.) |
| `contentStructure` | `string` | `'story'` | Content structure (story, list, tips, announcement, etc.) |
| `engagementGoal` | `string` | `'awareness'` | Engagement goal (awareness, engagement, conversion, etc.) |
| `brandVoiceIntensity` | `string` | `'moderate'` | Brand voice intensity (subtle, moderate, strong, dominant) |
| `engagementUrgency` | `string` | `'normal'` | Engagement urgency (low, normal, high, urgent) |
| `situation` | `string` | `'general'` | Context situation (general, promotional, crisis, celebration, etc.) |
| `targetLength` | `number` | `auto` | Target word count (auto-calculated if not provided) |
| `contentType` | `string` | `'facebook_post'` | Content type for analysis (facebook_post, general, etc.) |
| `autoAnalyze` | `boolean` | `true` | Whether to automatically analyze when content changes |
| `showUI` | `boolean` | `true` | Whether to display the UI (false for programmatic use) |
| `onAnalysisComplete` | `function` | `null` | Callback when analysis completes |
| `onAnalysisError` | `function` | `null` | Callback when analysis fails |

## Usage Examples

### Basic Usage

```jsx
import QualityAnalyzer from './components/QualityAnalyzer';

function MyComponent() {
  return (
    <QualityAnalyzer
      content="Your social media post content here..."
      platform="facebook"
      tone="engaging"
      targetAudience="general"
    />
  );
}
```

### Advanced Usage with Custom Configuration

```jsx
<QualityAnalyzer
  content={postContent}
  platform="instagram"
  postType="story"
  tone="casual"
  targetAudience="youth"
  contentStructure="list"
  engagementGoal="conversation"
  brandVoiceIntensity="subtle"
  engagementUrgency="low"
  situation="celebration"
  targetLength={60}
  contentType="instagram_post"
  autoAnalyze={true}
  showUI={true}
  onAnalysisComplete={(analysis) => {
    console.log('Analysis completed:', analysis);
    // Handle the analysis result
  }}
  onAnalysisError={(error) => {
    console.error('Analysis failed:', error);
    // Handle the error
  }}
/>
```

### Programmatic Usage (No UI)

```jsx
import React, { useRef } from 'react';
import QualityAnalyzer from './components/QualityAnalyzer';

function ProgrammaticExample() {
  const analyzerRef = useRef();

  const handleAnalyze = async () => {
    if (analyzerRef.current) {
      const result = await analyzerRef.current.analyzeQuality(content);
      console.log('Analysis result:', result);
    }
  };

  return (
    <div>
      <button onClick={handleAnalyze}>Analyze Content</button>
      
      <QualityAnalyzer
        ref={analyzerRef}
        content={content}
        platform="linkedin"
        showUI={false}
        onAnalysisComplete={(analysis) => {
          // Handle result programmatically
        }}
      />
    </div>
  );
}
```

## Analysis Results

The component provides comprehensive analysis results including:

### Overall Score
- **Excellent** (80-100%): 🌟 Green color
- **Good** (60-79%): ✅ Orange color  
- **Fair** (40-59%): ⚠️ Yellow color
- **Poor** (0-39%): ❌ Red color

### Metrics (Platform-Specific)

#### Facebook Posts
- **Hook**: Opening effectiveness
- **Structure**: Content organization
- **Engagement**: Likelihood of engagement
- **Readability**: Mobile readability
- **Call-to-Action**: CTA clarity
- **Tone**: Tone appropriateness
- **Length**: Length optimization
- **Hashtags**: Hashtag relevance
- **Brand Voice**: Brand voice consistency
- **Urgency**: Engagement urgency

#### General Content
- **Coherence**: Logical flow
- **Relevance**: Purpose alignment
- **Completeness**: Content thoroughness
- **Clarity**: Understanding ease
- **Engagement**: Interest level
- **Structure**: Organization
- **Tone**: Tone appropriateness
- **Length**: Length suitability

### Additional Analysis
- **Strengths**: 3-5 main positive aspects
- **Weaknesses**: 3-5 areas for improvement
- **Suggestions**: 3-5 actionable recommendations
- **Platform Tips**: Contextual advice for the specific platform

## Error Handling

The component includes robust error handling:

- **Network Errors**: Automatic retry and fallback URLs
- **API Errors**: Graceful degradation with fallback analysis
- **Parsing Errors**: Multiple JSON cleaning attempts
- **Empty Content**: Validation and user feedback

## Styling

The component uses inline styles for consistency and includes:

- **Responsive Design**: Works on mobile and desktop
- **Color Coding**: Intuitive color scheme for scores
- **Loading States**: Visual feedback during analysis
- **Error States**: Clear error messaging
- **Success States**: Celebration of good scores

## Integration

The component is designed to integrate seamlessly with:

- **Social Media Post Generator**: Main use case
- **Content Management Systems**: Programmatic analysis
- **Quality Assurance Tools**: Automated content review
- **Analytics Dashboards**: Performance tracking

## Performance

- **Caching**: Avoids re-analyzing unchanged content
- **Debouncing**: Prevents excessive API calls
- **Lazy Loading**: Only analyzes when needed
- **Optimized Re-renders**: Efficient state management

## Dependencies

- React 16.8+ (for hooks)
- react-i18next (for internationalization)
- Fetch API (for HTTP requests)

## Browser Support

- Modern browsers with ES6+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

## License

This component is part of the social media content generation application. 