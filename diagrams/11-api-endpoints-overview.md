# 11. API Endpoints Overview

```mermaid
graph LR
    A[Frontend] --> B[POST /api/blog/plan]
    A --> C[POST /api/blog/topic-recommendations]
    A --> D[POST /api/blog/generate]
    A --> E[POST /api/blog/save]
    A --> F[GET /api/blog/list]
    A --> G[GET /api/blog/:id]
    A --> H[PUT /api/blog/:id]
    A --> I[DELETE /api/blog/:id]
    
    B --> J[Qwen Model]
    C --> J
    D --> K[NVIDIA Llama 3.3]
    E --> L[MongoDB]
    F --> L
    G --> L
    H --> L
    I --> L
```

**Export Instructions:**
1. Copy the code between ```mermaid and ```
2. Go to https://mermaid.live/
3. Paste and export as PNG/SVG/PDF 