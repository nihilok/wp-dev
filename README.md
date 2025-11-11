# WP-Dev: Headless WordPress Template

A modern, production-ready template for building headless WordPress applications with Next.js 15, Python (FastAPI) middleware, and React components.

## 🚀 Features

- **Next.js 15** - Latest React framework with App Router, SSR, SSG, and ISR
- **React 19** - Latest React version with improved performance and features
- **Bun Runtime** - Fast JavaScript runtime for optimal performance
- **Python FastAPI** - Middleware layer for business logic, caching, and API orchestration
- **WordPress CMS** - Powerful content management with REST API
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **TypeScript** - Type-safe development experience
- **Component Library** - Pre-built components mapping to WordPress patterns
- **CLI Tooling** - Command-line tools for scaffolding and deployment
- **Docker Setup** - Complete containerized development environment
- **Comprehensive Documentation** - Detailed guides and best practices

## 📋 Prerequisites

- [Bun](https://bun.sh/) v1.0+ (JavaScript runtime)
- [Docker](https://www.docker.com/) & Docker Compose
- [Python](https://www.python.org/) 3.11+
- [Git](https://git-scm.com/)

## ⚡ Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd wp-dev

# Install frontend dependencies
cd frontend && bun install && cd ..

# Install CLI dependencies (optional)
cd cli && bun install && cd ..

# Set up Python environment
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Start all services with Docker
docker-compose up -d

# Start Python API (in a new terminal)
cd backend
source venv/bin/activate
python -m uvicorn main:app --reload

# Start Next.js (in another terminal)
cd frontend
bun run dev
```

Visit:
- **Frontend**: http://localhost:3000
- **Python API**: http://localhost:8000
- **WordPress Admin**: http://localhost:8080/wp-admin

## 📁 Project Structure

```
wp-dev/
├── frontend/           # Next.js 15 application
│   ├── app/           # App router pages and layouts
│   └── lib/           # Utility functions
├── backend/           # Python FastAPI middleware
│   └── main.py       # API endpoints and business logic
├── components/        # Shared React component library
│   ├── PostCard.tsx
│   ├── Navigation.tsx
│   └── PageHeader.tsx
├── cli/              # CLI tooling for development
│   ├── bin/         # Command-line executables
│   └── lib/         # CLI commands implementation
├── wordpress/        # WordPress customizations
│   ├── themes/      # Custom WordPress themes
│   └── plugins/     # Custom WordPress plugins
├── docs/            # Comprehensive documentation
│   ├── GETTING_STARTED.md
│   ├── ARCHITECTURE.md
│   └── ESCAPE_HATCHES.md
└── docker-compose.yml
```

## 🎯 Architecture

```
Browser → Next.js (SSR/SSG) → Python API → WordPress REST API
                                   ↓
                              Redis Cache
```

**Three-tier architecture:**
1. **Presentation Layer** (Next.js 15 + React 19): UI/UX and rendering
2. **Business Logic Layer** (Python FastAPI): Caching, transformation, orchestration
3. **Content Layer** (WordPress): CMS and data storage

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture documentation.

## 🛠 CLI Commands

```bash
# Generate a new component
bun run cli generate:component --name MyComponent --type post

# Start development environment
bun run cli dev

# Deploy to an environment
bun run cli deploy --env production --build

# Check service status
bun run cli status
```

## 📚 Documentation

- **[Getting Started](./docs/GETTING_STARTED.md)** - Setup and installation guide
- **[Architecture](./docs/ARCHITECTURE.md)** - System design and data flow
- **[Escape Hatches](./docs/ESCAPE_HATCHES.md)** - When to use WordPress vs React vs Python

## 🔌 Component Library

Pre-built components mapping to common WordPress patterns:

- **PostCard** - Display WordPress posts
- **PageHeader** - Page headers with breadcrumbs
- **Navigation** - Site navigation menus

Each component includes documentation about when to use WordPress plugins vs custom React components.

```typescript
import { PostCard, Navigation, PageHeader } from '@/components'

// Use in your Next.js pages
<PostCard 
  title="My Post"
  slug="my-post"
  excerpt="Post excerpt..."
  date="2024-01-01"
/>
```

## 🎨 Styling

This template uses **Tailwind CSS** for styling with a pre-configured setup:

- Utility-first approach
- Responsive design
- Dark mode support ready
- Custom component styles
- Optimized for production

## 🔐 Environment Variables

Create `.env.local` files:

**frontend/.env.local**
```env
PYTHON_API_URL=http://localhost:8000
WP_API_URL=http://localhost:8080/wp-json
```

**backend/.env**
```env
WP_API_URL=http://wordpress:80/wp-json/wp/v2
CACHE_ENABLED=true
```

## 🚢 Deployment

### Recommended Stack

- **Frontend**: Vercel or Netlify
- **Python API**: Railway, Fly.io, or AWS Lambda
- **WordPress**: WP Engine, Kinsta, or managed WordPress hosting

```bash
# Build frontend
cd frontend && bun run build

# Deploy with CLI
bun run cli deploy --env production
```

See deployment guides in documentation for platform-specific instructions.

## 🧪 Testing

```bash
# Frontend tests
cd frontend && bun test

# Backend tests
cd backend && pytest

# E2E tests
bun run test:e2e
```

## 📦 Recommended WordPress Plugins

- **Advanced Custom Fields (ACF)** - Custom fields
- **ACF to REST API** - Expose ACF in API
- **JWT Authentication** - Secure API access
- **Yoast SEO** - SEO management

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- 📖 [Documentation](./docs/)
- 🐛 [Issue Tracker](../../issues)
- 💬 [Discussions](../../discussions)

## 🎓 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [Bun Documentation](https://bun.sh/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Built with ❤️ for the headless WordPress community**
