# 3. Backend API Processing Flow

```mermaid
graph TD
    A[POST /api/blog/generate] --> B[Extract Request Body]
    B --> C[Validate Required Fields]
    C --> D[Resolve Field Names (New/Old)]
    D --> E[Check API Key Configuration]
    E --> F[Process Images if Provided]
    F --> G[Select Model Configuration]
    G --> H[Build Dynamic Prompt]
    H --> I[Add Strategic Plan Instructions]
    I --> J[Add Image Integration Instructions]
    J --> K[Call NVIDIA API]
    K --> L[Process AI Response]
    L --> M[Return Structured Response]
    M --> N[POST /api/blog/save]
    N --> O[Validate Blog Data]
    O --> P[Save to MongoDB]
    P --> Q[Return Success/Error]
```

**Export Instructions:**
1. Copy the code between ```mermaid and ```
2. Go to https://mermaid.live/
3. Paste and export as PNG/SVG/PDF 