# 10. Component Interaction Flow

```mermaid
graph TD
    A[App.js] --> B[BlogCreator Component]
    B --> C[BlogCreatorGuidance Component]
    B --> D[BlogCreatorResult Component]
    
    C --> E[Step Navigation]
    C --> F[Form Validation]
    C --> G[API Calls]
    C --> H[State Management]
    
    D --> I[Content Display]
    D --> J[User Actions]
    D --> K[Export Functions]
    D --> L[Edit Mode]
    
    G --> M[/api/blog/plan]
    G --> N[/api/blog/topic-recommendations]
    G --> O[/api/blog/generate]
    G --> P[/api/blog/save]
```

**Export Instructions:**
1. Copy the code between ```mermaid and ```
2. Go to https://mermaid.live/
3. Paste and export as PNG/SVG/PDF 