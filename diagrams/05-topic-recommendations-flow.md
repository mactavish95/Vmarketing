# 5. Topic Recommendations Flow

```mermaid
graph TD
    A[User Clicks 'Use Recommendation'] --> B[generateTopicRecommendations Function]
    B --> C[Prepare Context Data]
    C --> D[Call /api/blog/topic-recommendations]
    D --> E[Backend Receives Request]
    E --> F[Build Recommendation Prompt]
    F --> G[Call Qwen Model API]
    G --> H[Generate 5 Topic Suggestions]
    H --> I[Parse & Clean Recommendations]
    I --> J[Return to Frontend]
    J --> K[Display Topic Dropdown]
    K --> L[User Selects Topic]
    L --> M[Update Topic Field]
    M --> N[Hide Dropdown]
```

**Export Instructions:**
1. Copy the code between ```mermaid and ```
2. Go to https://mermaid.live/
3. Paste and export as PNG/SVG/PDF 