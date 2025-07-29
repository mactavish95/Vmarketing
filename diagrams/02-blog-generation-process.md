# 2. Blog Generation Process (Frontend → Backend)

```mermaid
graph TD
    A[generateBlogPost Function] --> B[Input Validation]
    B --> C{Validation Pass?}
    C -->|No| D[Show Error Message]
    C -->|Yes| E[Set Loading State]
    E --> F[Prepare Image Data]
    F --> G[Determine API Base URL]
    G --> H[Make POST Request to /api/blog/generate]
    H --> I[Send Complete Blog Data + Strategic Plan]
    I --> J[Backend Receives Request]
    J --> K[Validate Required Fields]
    K --> L[Process Images if Provided]
    L --> M[Select AI Model Based on Length]
    M --> N[Build Comprehensive Prompt]
    N --> O[Call NVIDIA Llama 3.3 API]
    O --> P[AI Generates Blog Content]
    P --> Q[Process & Clean Response]
    Q --> R[Return Success Response]
    R --> S[Frontend Receives Blog Content]
    S --> T[Update State with Generated Blog]
    T --> U[Save to localStorage]
    U --> V[Save to Backend Database]
    V --> W[Switch to Result View]
```

**Export Instructions:**
1. Copy the code between ```mermaid and ```
2. Go to https://mermaid.live/
3. Paste and export as PNG/SVG/PDF 