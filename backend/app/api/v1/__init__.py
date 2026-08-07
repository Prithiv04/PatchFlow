from fastapi import APIRouter
from app.api.v1.upload import router as upload_router
from app.api.v1.processing import router as processing_router
from app.api.v1.transcription import router as transcription_router
from app.api.v1.patches import router as patches_router
from app.api.v1.export import router as export_router

v1_router = APIRouter()
v1_router.include_router(upload_router, prefix="/videos", tags=["Videos"])
v1_router.include_router(processing_router, prefix="/videos", tags=["Videos"])
v1_router.include_router(transcription_router, prefix="/videos", tags=["Videos"])
v1_router.include_router(patches_router, prefix="/videos", tags=["Videos"])
v1_router.include_router(export_router, prefix="/videos", tags=["Export"])

