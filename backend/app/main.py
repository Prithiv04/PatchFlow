from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logger import logger
from app.api.v1 import v1_router
from app.db.session import init_db

app = FastAPI(
    title="PatchFlow API",
    version="0.1.0",
    description="Video Patching & Asset Pipeline Backend API"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 Router
app.include_router(v1_router, prefix="/api/v1")

@app.on_event("startup")
async def on_startup() -> None:
    """Initialize database tables on application startup."""
    init_db()
    logger.info("Database initialized successfully.")

@app.get("/", summary="Root endpoint")
async def root():
    logger.info("Root endpoint called")
    return {"message": "PatchFlow API"}

@app.get("/health", summary="Health check endpoint")
async def health():
    logger.info("Health check called")
    return {"status": "healthy"}
