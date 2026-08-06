"""
Shared test configuration for all backend test modules.
Overrides the FastAPI get_db dependency with an in-memory SQLite database
so all tests are fully isolated and no real patchflow.db is touched.
"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.models import Base
from app.db.session import get_db
from app.main import app

# Single shared in-memory engine using StaticPool so all connections hit the same DB
TEST_DATABASE_URL = "sqlite:///:memory:"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Create all tables once at session start
Base.metadata.create_all(bind=test_engine)


def override_get_db():
    """Yield a test DB session instead of the real one."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Apply the override globally before any test runs
app.dependency_overrides[get_db] = override_get_db
