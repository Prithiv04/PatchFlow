from datetime import datetime, timezone

from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import DeclarativeBase, relationship


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class Base(DeclarativeBase):
    pass


class Video(Base):
    __tablename__ = "videos"

    id = Column(String(36), primary_key=True, index=True)
    original_filename = Column(String(255), nullable=False)
    saved_filename = Column(String(255), nullable=False)
    content_type = Column(String(100), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    status = Column(String(50), nullable=False, default="uploaded")  # uploaded | processed | transcribed | patched
    created_at = Column(DateTime, nullable=False, default=utc_now)
    updated_at = Column(DateTime, nullable=False, default=utc_now, onupdate=utc_now)

    # Relationships
    metadata_record = relationship("VideoMetadata", back_populates="video", uselist=False, cascade="all, delete-orphan")
    transcript = relationship("Transcript", back_populates="video", uselist=False, cascade="all, delete-orphan")
    patches = relationship("Patch", back_populates="video", cascade="all, delete-orphan")


class VideoMetadata(Base):
    __tablename__ = "video_metadata"

    id = Column(Integer, primary_key=True, autoincrement=True)
    video_id = Column(String(36), ForeignKey("videos.id", ondelete="CASCADE"), nullable=False, index=True)
    duration = Column(Float, nullable=False, default=0.0)
    width = Column(Integer, nullable=False, default=0)
    height = Column(Integer, nullable=False, default=0)
    fps = Column(Float, nullable=False, default=0.0)
    video_codec = Column(String(50), nullable=False, default="unknown")
    audio_codec = Column(String(50), nullable=True)
    audio_channels = Column(Integer, nullable=True)
    bitrate = Column(BigInteger, nullable=False, default=0)
    container = Column(String(100), nullable=False, default="")
    thumbnail_path = Column(String(255), nullable=True)
    audio_path = Column(String(255), nullable=True)
    created_at = Column(DateTime, nullable=False, default=utc_now)

    video = relationship("Video", back_populates="metadata_record")


class Transcript(Base):
    __tablename__ = "transcripts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    video_id = Column(String(36), ForeignKey("videos.id", ondelete="CASCADE"), nullable=False, index=True)
    language = Column(String(10), nullable=False, default="en")
    full_text = Column(Text, nullable=False, default="")
    segments_json = Column(Text, nullable=False, default="[]")
    transcript_path = Column(String(255), nullable=True)
    caption_path = Column(String(255), nullable=True)
    created_at = Column(DateTime, nullable=False, default=utc_now)

    video = relationship("Video", back_populates="transcript")


class Patch(Base):
    __tablename__ = "patches"

    id = Column(String(36), primary_key=True, index=True)
    video_id = Column(String(36), ForeignKey("videos.id", ondelete="CASCADE"), nullable=False, index=True)
    prompt = Column(Text, nullable=False)
    status = Column(String(50), nullable=False, default="analyzed")  # analyzed | applied | reverted
    occurrences_count = Column(Integer, nullable=False, default=0)
    affected_assets_json = Column(Text, nullable=False, default="[]")
    diffs_json = Column(Text, nullable=False, default="[]")
    confidence_score = Column(Float, nullable=False, default=0.0)
    warnings_json = Column(Text, nullable=False, default="[]")
    version = Column(String(20), nullable=True)
    created_at = Column(DateTime, nullable=False, default=utc_now)
    applied_at = Column(DateTime, nullable=True)

    video = relationship("Video", back_populates="patches")
