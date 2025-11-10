# Quick Start Guide

Get your headless WordPress setup running in 5 minutes!

## Prerequisites

Make sure you have installed:
- [Bun](https://bun.sh/) - Fast JavaScript runtime
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) - For WordPress & MySQL
- [Python 3.11+](https://www.python.org/downloads/)

## Step 1: Clone and Setup (2 minutes)

```bash
# Clone the repository
git clone <your-repo-url>
cd wp-dev

# Install frontend dependencies
cd frontend
bun install
cd ..

# Install Python dependencies
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

## Step 2: Start Services (1 minute)

```bash
# Start WordPress + MySQL with Docker
docker-compose up -d

# Wait 30 seconds for WordPress to initialize...
```

## Step 3: Configure WordPress (2 minutes)

1. Open http://localhost:8080 in your browser
2. Follow the WordPress installation wizard:
   - Language: Select your language
   - Site Title: "My Headless Site"
   - Username: Choose a username
   - Password: Choose a strong password
   - Email: Your email
   - Click "Install WordPress"

3. Log in to WordPress admin
4. Create 2-3 sample posts:
   - Go to Posts → Add New
   - Write a title and content
   - Click "Publish"

## Step 4: Start Development Servers

Open 2 terminal windows:

**Terminal 1 - Python API:**
```bash
cd backend
source venv/bin/activate  # If not activated
python -m uvicorn main:app --reload
```

**Terminal 2 - Next.js Frontend:**
```bash
cd frontend
bun run dev
```

## Step 5: Visit Your Site

Open http://localhost:3000 in your browser!

You should see:
- Your site homepage with posts from WordPress
- Click on a post to see the detail page
- All data flows through the Python middleware

## Architecture Flow

```
Browser (localhost:3000)
    ↓
Next.js Frontend (React/Tailwind)
    ↓
Python API (localhost:8000) - Caching & Business Logic
    ↓
WordPress REST API (localhost:8080/wp-json) - Content Management
    ↓
MySQL Database
```

## What's Running?

- **http://localhost:3000** - Next.js frontend (your website)
- **http://localhost:8000** - Python FastAPI middleware
- **http://localhost:8000/docs** - API documentation (Swagger UI)
- **http://localhost:8080** - WordPress frontend (not used for rendering)
- **http://localhost:8080/wp-admin** - WordPress admin panel
- **http://localhost:8080/wp-json** - WordPress REST API

## Next Steps

### Create Your First Custom Component

```bash
# Use the CLI to generate a component
bun run cli generate:component --name ProductCard --type post
```

### Explore the Documentation

- [Getting Started Guide](./docs/GETTING_STARTED.md) - Detailed setup
- [Architecture](./docs/ARCHITECTURE.md) - System design
- [Escape Hatches](./docs/ESCAPE_HATCHES.md) - WordPress vs React decisions
- [Components](./docs/COMPONENTS.md) - Component library guide

### Customize Your Site

1. **Add Pages**: Create new pages in `frontend/app/`
2. **Style with Tailwind**: Use utility classes in your components
3. **Add Business Logic**: Extend the Python API in `backend/main.py`
4. **Install WordPress Plugins**: Add ACF, SEO plugins, etc.

## Common Commands

```bash
# Start development
bun run dev              # Start frontend
bun run backend          # Start Python API

# Docker commands
docker-compose up -d     # Start WordPress & DB
docker-compose down      # Stop all services
docker-compose logs -f   # View logs

# CLI commands
bun run cli dev         # Start dev environment
bun run cli status      # Check service status
bun run cli g:c         # Generate component
```

## Troubleshooting

### Port Already in Use

If you get port conflicts, change ports in:
- Frontend: Edit `frontend/package.json` scripts
- Backend: Use different port in uvicorn command
- WordPress: Edit `docker-compose.yml` ports

### WordPress Not Starting

```bash
# Check Docker logs
docker-compose logs wordpress

# Restart services
docker-compose restart
```

### Python Dependencies Issues

```bash
# Recreate virtual environment
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Production Deployment

When ready to deploy:

1. **Frontend**: Deploy to Vercel or Netlify
2. **Python API**: Deploy to Railway, Fly.io, or AWS Lambda
3. **WordPress**: Use managed hosting (WP Engine, Kinsta)

See deployment guides in documentation.

## Need Help?

- 📖 Read the [full documentation](./docs/)
- 🐛 [Report issues](../../issues)
- 💬 [Start a discussion](../../discussions)

---

**You're all set! Start building your headless WordPress site! 🚀**
