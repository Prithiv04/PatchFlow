from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.logger import logger

app = FastAPI(title="PatchFlow API", version="0.1.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", summary="Root endpoint")
async def root():
    logger.info("Root endpoint called")
    return {"message": "PatchFlow API"}

@app.get("/health", summary="Health check endpoint")
async def health():
    logger.info("Health check called")
    return {"status": "healthy"}
