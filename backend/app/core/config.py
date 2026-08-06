from pydantic import ConfigDict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    host: str = "127.0.0.1"
    port: int = 8000
    allowed_origins: list[str] = ["http://localhost:5173"]

    model_config = ConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
