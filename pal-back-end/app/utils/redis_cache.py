import redis
import json
import os
from app.config import settings

# Initialize Redis connection
redis_client = redis.Redis(host=f"{settings.REDIS_URL}", port=settings.REDIS_PORT, db=0, password=f"{settings.REDIS_PASSWORD}")

# Cache wrapper function
def cache_query(key, value=None, expiry=(60 * 60 * 24 * 7)):
    # Set cache
    if value is not None:
        redis_client.set(key, json.dumps(value), ex=expiry)
    # Get cache
    else:
        cached = redis_client.get(key)
        return json.loads(cached) if cached else None