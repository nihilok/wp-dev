# Backend API

FastAPI middleware for headless WordPress application. Provides caching, transformation, and API orchestration.

## Setup with uv

This project uses [uv](https://github.com/astral-sh/uv) for fast Python package management.

### Install uv

```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Or with pip
pip install uv
```

### Development Setup

```bash
# Create virtual environment and install dependencies
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
uv pip install -e ".[dev]"

# Copy environment variables
cp .env.example .env

# Run the server
uvicorn main:app --reload
```

### Quick Commands

```bash
# Install dependencies
uv pip install -e .

# Install with dev dependencies
uv pip install -e ".[dev]"

# Add a new dependency
uv pip install <package-name>
# Then update pyproject.toml manually

# Run tests
pytest

# Format code
black .
ruff check --fix .

# Type checking
mypy .
```

## Docker

```bash
# Build the image
docker build -t wp-dev-backend .

# Run the container
docker run -p 8000:8000 wp-dev-backend

# Or use docker-compose from root
docker-compose up backend
```

## API Endpoints

### Health Check
- `GET /health` - Health check endpoint

### Posts
- `GET /api/posts?page=1&per_page=10` - Get paginated posts
- `GET /api/posts/{slug}` - Get single post by slug

### Pages
- `GET /api/pages` - Get all pages

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
WP_API_URL=http://wordpress:80/wp-json/wp/v2
CACHE_ENABLED=true
REDIS_URL=redis://localhost:6379
CORS_ORIGINS=["http://localhost:3000"]
```

## Project Structure

```
backend/
├── main.py              # FastAPI application
├── pyproject.toml       # Project configuration and dependencies
├── .env.example         # Example environment variables
├── Dockerfile           # Docker configuration
└── README.md           # This file
```

## Development

The FastAPI server runs with hot reload enabled during development. Any changes to `main.py` will automatically restart the server.

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_main.py
```

