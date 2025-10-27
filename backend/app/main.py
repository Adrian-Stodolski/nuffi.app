from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from typing import List, Optional
import os
from datetime import datetime

from .routers import workspaces, templates, team, installations
from .database import engine, Base
from .models import workspace, company, installation

# Optionally create database tables (disabled by default to avoid side effects on import)
AUTO_CREATE_TABLES = os.getenv("AUTO_CREATE_TABLES", "").lower() in ("1", "true", "yes")
if AUTO_CREATE_TABLES:
    Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Nuffi API",
    description="Complete workspace management platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(workspaces.router, prefix="/api/workspaces", tags=["workspaces"])
app.include_router(templates.router, prefix="/api/templates", tags=["templates"])
app.include_router(team.router, prefix="/api/team", tags=["team"])
app.include_router(installations.router, prefix="/api/installations", tags=["installations"])

@app.get("/")
async def root():
    return {
        "message": "Nuffi API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "connected"
    }

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "timestamp": datetime.utcnow().isoformat()
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )