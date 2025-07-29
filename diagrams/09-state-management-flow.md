# 9. State Management Flow

```mermaid
graph TD
    A[BlogCreator State] --> B[currentView: 'guidance'/'result']
    A --> C[isGenerating: boolean]
    A --> D[error: string]
    A --> E[blogData: object]
    A --> F[images: array]
    A --> G[generatedBlog: string]
    A --> H[imageAnalysis: object]
    
    I[BlogCreatorGuidance State] --> J[blogData: form fields]
    I --> K[currentStep: number]
    I --> L[completedSteps: Set]
    I --> M[strategicPlan: string]
    I --> N[isPlanning: boolean]
    I --> O[topicRecommendations: array]
    
    P[BlogCreatorResult State] --> Q[isEditing: boolean]
    P --> R[editedBlog: string]
    P --> S[syncSuccess: boolean]
```

**Export Instructions:**
1. Copy the code between ```mermaid and ```
2. Go to https://mermaid.live/
3. Paste and export as PNG/SVG/PDF 