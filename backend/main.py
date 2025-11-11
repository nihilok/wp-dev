"""
FastAPI middleware for headless WordPress
Handles business logic, caching, and API orchestration
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import httpx
import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# Configuration
WP_API_URL = os.getenv("WP_API_URL", "http://wordpress:80/wp-json/wp/v2")
CACHE_ENABLED = os.getenv("CACHE_ENABLED", "false").lower() == "true"

# Cache storage (in-memory for simplicity, use Redis in production)
# Using dict with timestamps for basic TTL support
cache = {}
cache_timestamps = {}
CACHE_MAX_SIZE = 1000  # Prevent unbounded growth


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for the FastAPI app"""
    # Startup
    print(f"Starting FastAPI middleware...")
    print(f"WordPress API URL: {WP_API_URL}")
    print(f"Cache enabled: {CACHE_ENABLED}")
    yield
    # Shutdown
    print("Shutting down FastAPI middleware...")


app = FastAPI(
    title="WordPress Middleware API",
    description="Python middleware for headless WordPress with caching and business logic",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Configure via ALLOWED_ORIGINS env var
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def fetch_from_wordpress(endpoint: str) -> dict:
    """Fetch data from WordPress API"""
    url = f"{WP_API_URL}/{endpoint}"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            print(f"Error fetching from WordPress: {e}")
            raise HTTPException(status_code=502, detail=f"Error fetching from WordPress: {str(e)}")


def get_cached(key: str) -> Optional[dict]:
    """Get data from cache with TTL check"""
    if not CACHE_ENABLED:
        return None
    
    # Check if key exists and hasn't expired
    if key in cache and key in cache_timestamps:
        import time
        if time.time() - cache_timestamps[key] < 300:  # 5 minute TTL
            return cache.get(key)
        else:
            # Remove expired entry
            cache.pop(key, None)
            cache_timestamps.pop(key, None)
    
    return None


def set_cached(key: str, value: dict, ttl: int = 60):
    """Set data in cache with TTL and size limit"""
    if CACHE_ENABLED:
        import time
        
        # Implement simple size limit - remove oldest entries if cache is too large
        if len(cache) >= CACHE_MAX_SIZE:
            # Remove oldest 20% of entries
            sorted_keys = sorted(cache_timestamps.items(), key=lambda x: x[1])
            for k, _ in sorted_keys[:CACHE_MAX_SIZE // 5]:
                cache.pop(k, None)
                cache_timestamps.pop(k, None)
        
        cache[key] = value
        cache_timestamps[key] = time.time()


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "service": "WordPress Middleware API",
        "wordpress_url": WP_API_URL,
        "cache_enabled": CACHE_ENABLED
    }


@app.get("/posts")
async def get_posts(per_page: int = 10, page: int = 1):
    """
    Get posts from WordPress with caching and transformations
    
    This endpoint demonstrates:
    - API orchestration (fetching from WordPress)
    - Caching logic
    - Data transformation/enrichment
    """
    cache_key = f"posts_{per_page}_{page}"
    
    # Check cache
    cached_data = get_cached(cache_key)
    if cached_data:
        return {"source": "cache", "data": cached_data}
    
    # Fetch from WordPress
    try:
        posts = await fetch_from_wordpress(f"posts?per_page={per_page}&page={page}")
        
        # Transform data (example: simplify response)
        transformed_posts = [
            {
                "id": post["id"],
                "title": post["title"]["rendered"],
                "slug": post["slug"],
                "excerpt": post["excerpt"]["rendered"],
                "content": post["content"]["rendered"],
                "date": post["date"],
                "author": post.get("author"),
                "featured_media": post.get("featured_media"),
            }
            for post in posts
        ]
        
        # Cache the result
        set_cached(cache_key, transformed_posts)
        
        return transformed_posts
    except Exception as e:
        # Return empty array if WordPress is not available
        print(f"Error fetching posts: {e}")
        return []


@app.get("/posts/{slug}")
async def get_post(slug: str):
    """
    Get a single post by slug
    
    Demonstrates custom business logic and data enrichment
    """
    cache_key = f"post_{slug}"
    
    # Check cache
    cached_data = get_cached(cache_key)
    if cached_data:
        return {"source": "cache", "data": cached_data}
    
    # Fetch from WordPress
    posts = await fetch_from_wordpress(f"posts?slug={slug}")
    
    if not posts:
        raise HTTPException(status_code=404, detail="Post not found")
    
    post = posts[0]
    
    # Transform and enrich data
    transformed_post = {
        "id": post["id"],
        "title": post["title"]["rendered"],
        "slug": post["slug"],
        "excerpt": post["excerpt"]["rendered"],
        "content": post["content"]["rendered"],
        "date": post["date"],
        "modified": post["modified"],
        "author": post.get("author"),
        "featured_media": post.get("featured_media"),
        "categories": post.get("categories", []),
        "tags": post.get("tags", []),
    }
    
    # Cache the result
    set_cached(cache_key, transformed_post)
    
    return transformed_post


@app.get("/pages")
async def get_pages():
    """Get pages from WordPress"""
    try:
        pages = await fetch_from_wordpress("pages")
        
        # Transform data
        transformed_pages = [
            {
                "id": page["id"],
                "title": page["title"]["rendered"],
                "slug": page["slug"],
                "content": page["content"]["rendered"],
            }
            for page in pages
        ]
        
        return transformed_pages
    except Exception as e:
        print(f"Error fetching pages: {e}")
        return []


@app.post("/cache/clear")
async def clear_cache():
    """Clear the cache"""
    global cache
    cache = {}
    return {"status": "ok", "message": "Cache cleared"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
