# 1. Frontend Initialization & User Journey

```mermaid
graph TD
    A[User Opens Blog Creator] --> B[BlogCreator Component Loads]
    B --> C[BlogCreatorGuidance Component Renders]
    C --> D[Step 1: Basic Information Form]
    D --> E[User Fills Topic, Business Name, Type, Industry, Location]
    E --> F[Optional: Click 'Use Recommendation' Button]
    F --> G[Call /api/blog/topic-recommendations]
    G --> H[Qwen Model Generates 5 Topic Suggestions]
    H --> I[User Selects Topic or Continues with Input]
    I --> J[Step 2: Content Style]
    J --> K[User Sets Target Audience, Tone, Length]
    K --> L[Step 3: Key Content]
    L --> M[User Provides Key Points & Special Features]
    M --> N[Step 4: Strategic Planning]
    N --> O[User Clicks 'Generate Strategic Plan']
    O --> P[Call /api/blog/plan]
    P --> Q[Qwen Model Creates Strategic Plan]
    Q --> R[Step 5: Images & Review]
    R --> S[User Uploads Images & Reviews Details]
    S --> T[User Clicks 'Generate Blog Post']
    T --> U[handleGenerateBlog Function]
    U --> V[Call generateBlogPost in BlogCreator]
```

**Export Instructions:**
1. Copy the code between ```mermaid and ```
2. Go to https://mermaid.live/
3. Paste and export as PNG/SVG/PDF 