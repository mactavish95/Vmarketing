# 7. Data Flow Architecture

```mermaid
graph LR
    A[Frontend React App] --> B[API Gateway]
    B --> C[Express.js Server]
    C --> D[NVIDIA AI API]
    C --> E[Qwen AI API]
    C --> F[MongoDB Database]
    
    A --> G[localStorage]
    A --> H[File System - Image Uploads]
    
    C --> I[Image Processing]
    C --> J[Content Generation]
    C --> K[Data Persistence]
```

**Export Instructions:**
1. Copy the code between ```mermaid and ```
2. Go to https://mermaid.live/
3. Paste and export as PNG/SVG/PDF 