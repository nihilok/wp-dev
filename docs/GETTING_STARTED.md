# Getting Started

Welcome to the Headless WordPress + Next.js + Python template! This guide will help you get up and running.

## Prerequisites

- [Bun](https://bun.sh/) - JavaScript runtime (v1.0+)
- [Docker](https://www.docker.com/) - For WordPress and database
- [Python](https://www.python.org/) - For middleware (v3.11+)
- [uv](https://github.com/astral-sh/uv) - Python package manager
- [Node.js](https://nodejs.org/) - Optional, for npm packages (v18+)

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd wp-dev

# Install frontend dependencies
cd frontend
bun install
cd ..

# Install CLI dependencies (optional)
cd cli
bun install
cd ..

# Install Python dependencies with uv
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .
cd ..
```

### 2. Start Services

```bash
# Start WordPress and database with Docker
docker-compose up -d

# Wait for WordPress to be ready (about 30 seconds)
# Visit http://localhost:8080 to complete WordPress installation
```

### 3. Configure WordPress

1. Open http://localhost:8080 in your browser
2. Complete the WordPress installation wizard:
   - Choose a language
   - Set up site title, username, password
   - Click "Install WordPress"

3. Log into WordPress admin (http://localhost:8080/wp-admin)

4. Create some sample posts:
   - Go to Posts → Add New
   - Create 2-3 sample posts
   - Publish them

### 4. Start Development

```bash
# Terminal 1: Start Python API
cd backend
source venv/bin/activate  # If not already activated
python -m uvicorn main:app --reload

# Terminal 2: Start Next.js frontend
cd frontend
bun run dev
```

### 5. Access Your Application

- **Frontend:** http://localhost:3000
- **Python API:** http://localhost:8000
- **WordPress:** http://localhost:8080
- **WordPress Admin:** http://localhost:8080/wp-admin

## Project Structure

```
wp-dev/
├── frontend/           # Next.js 15 application
│   ├── app/           # Next.js app directory
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
│
├── backend/           # Python FastAPI middleware
│   ├── main.py       # API endpoints
│   └── pyproject.toml # Python dependencies (uv)
│
├── components/        # Shared React components
│   ├── PostCard.tsx  # WordPress post component
│   ├── Navigation.tsx
│   └── index.ts
│
├── cli/              # CLI tooling
│   ├── bin/         # CLI executables
│   └── lib/         # CLI commands
│
├── wordpress/        # WordPress customizations
│   ├── themes/      # Custom themes
│   └── plugins/     # Custom plugins
│
├── docs/            # Documentation
│   ├── ESCAPE_HATCHES.md
│   └── ARCHITECTURE.md
│
└── docker-compose.yml # Docker services
```

## CLI Usage

The project includes a CLI tool for common tasks:

```bash
# Generate a new component
bun run cli generate:component --name MyComponent --type post

# Check service status
bun run cli status

# Start development environment
bun run cli dev

# Deploy
bun run cli deploy --env dev
```

## Environment Variables

### Frontend (.env.local)

Create `frontend/.env.local`:

```env
PYTHON_API_URL=http://localhost:8000
WP_API_URL=http://localhost:8080/wp-json
```

### Backend (.env)

Create `backend/.env`:

```env
WP_API_URL=http://wordpress:80/wp-json/wp/v2
CACHE_ENABLED=true
```

## Common Tasks

### Adding a New Page

1. Create a new file in `frontend/app/your-page/page.tsx`
2. Use the Next.js 15 app router conventions
3. Fetch data from Python API or WordPress

### Creating a Component

```bash
# Using CLI
bun run cli generate:component --name ProductCard --type post

# Or manually create in components/
```

### Customizing the Python API

Edit `backend/main.py` to add new endpoints:

```python
@app.get("/custom-endpoint")
async def custom_endpoint():
    # Your logic here
    return {"data": "response"}
```

### Installing WordPress Plugins

1. Go to http://localhost:8080/wp-admin
2. Navigate to Plugins → Add New
3. Search and install plugins
4. Or add plugins to `wordpress/plugins/` directory

## Recommended WordPress Plugins

For headless WordPress, install these plugins:

1. **ACF (Advanced Custom Fields)** - Custom fields
2. **ACF to REST API** - Expose ACF in API
3. **JWT Authentication** - Secure API access

## Troubleshooting

### WordPress not accessible

```bash
# Check if containers are running
docker-compose ps

# Restart containers
docker-compose restart

# View logs
docker-compose logs wordpress
```

### Python API errors

```bash
# Check Python API is running
curl http://localhost:8000

# Check logs
# The uvicorn terminal should show any errors
```

### Frontend build errors

```bash
# Clear Next.js cache
cd frontend
rm -rf .next
bun run build
```

### Port conflicts

If ports 3000, 8000, or 8080 are in use:

1. Edit `docker-compose.yml` to change WordPress port
2. Edit frontend scripts to change Next.js port
3. Update environment variables accordingly

## Development Workflow

1. **Start services** - Docker Compose for WordPress/DB
2. **Start Python API** - For middleware/caching
3. **Start Next.js dev server** - For frontend development
4. **Make changes** - Edit files, changes auto-reload
5. **Test** - Verify in browser at http://localhost:3000

## Next Steps

- Read [ESCAPE_HATCHES.md](./ESCAPE_HATCHES.md) - Learn when to use WordPress vs React
- Read [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand the system design
- Explore the component library in `components/`
- Customize the Python API in `backend/main.py`
- Build your first page in `frontend/app/`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [Bun Documentation](https://bun.sh/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## Getting Help

- Check documentation in `/docs`
- Review example components in `/components`
- Look at existing pages in `/frontend/app`
- Check WordPress REST API: http://localhost:8080/wp-json

Happy coding! 🚀
