# 6. Result View & User Actions

```mermaid
graph TD
    A[BlogCreatorResult Component] --> B[Display Generated Blog]
    B --> C[Render with Image Integration]
    C --> D[Show Blog Details Panel]
    D --> E[User Actions Available]
    E --> F[Copy Content]
    E --> G[Export Blog]
    E --> H[Edit Content]
    E --> I[Regenerate Blog]
    E --> J[Back to Form]
    
    F --> K[copyToClipboard Function]
    G --> L[exportBlog Function]
    H --> M[Toggle Edit Mode]
    I --> N[Call generateBlogPost Again]
    J --> O[Switch Back to Guidance View]
    
    K --> P[Clean Content & Copy to Clipboard]
    L --> Q[Create JSON Export File]
    M --> R[Show Textarea for Editing]
    N --> S[Repeat Generation Process]
    O --> T[Reset Form State]
```

**Export Instructions:**
1. Copy the code between ```mermaid and ```
2. Go to https://mermaid.live/
3. Paste and export as PNG/SVG/PDF 