# app/config.py
from pydantic_settings import BaseSettings
from loguru import logger
import os

# Setup logging
LOG_FILENAME = os.path.join(os.path.dirname(__file__), '../logs/app.log')
os.makedirs(os.path.dirname(LOG_FILENAME), exist_ok=True)
logger.add(LOG_FILENAME, rotation="1 MB", retention="7 days", level="INFO")

# Settings with connection information
class Settings(BaseSettings):
    REDIS_URL: str = os.getenv("REDIS_URL")
    REDIS_PORT: int = os.getenv("REDIS_PORT")
    REDIS_PASSWORD: str = os.getenv("REDIS_PASSWORD")
    OPEN_AI_URL: str = os.getenv("OPEN_AI_URL")

    class Config:
        env_file = ".env"

settings = Settings()