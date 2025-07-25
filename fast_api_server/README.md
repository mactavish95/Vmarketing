# FastAPI Server for ReviewGen

This folder contains a FastAPI-based backend server that mirrors the logic and route management of the original Express.js server in the `server/` directory.

## Structure Overview

```
fast-api-server/
├── main.py                # FastAPI entry point
├── api/                   # Route modules (mirrors server/routes/)
├── services/              # Business logic (mirrors server/services/)
├── models/                # Pydantic and ORM models (mirrors server/models/)
├── utils/                 # Helper functions (mirrors server/utils/)
├── config/                # Database and settings (mirrors server/config/)
├── middleware/            # Custom middleware (mirrors server/middleware/)
└── README.md              # This file
```

## Route Mapping
- Each file in `server/routes/` is mapped to a module in `fast-api-server/api/`.
- Service logic is ported to `fast-api-server/services/`.
- Database models are ported to Pydantic/SQLAlchemy in `fast-api-server/models/`.
- Utilities and middleware are ported as needed.

## How to Run
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the server:
   ```bash
   uvicorn main:app --reload
   ```

## Notes
- This FastAPI server is a work in progress and aims for feature parity with the Express backend.
- See each module for details on endpoint paths and logic. 