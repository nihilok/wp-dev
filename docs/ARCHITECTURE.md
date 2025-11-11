# Architecture Overview

This document describes the architecture of the headless WordPress template with Next.js and Python middleware.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js 15 Frontend (Port 3000)                 │
│  • Server-Side Rendering (SSR)                               │
│  • Static Site Generation (SSG)                              │
│  • Incremental Static Regeneration (ISR)                     │
│  • React Components                                          │
│  • Tailwind CSS                                              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│         Python FastAPI Middleware (Port 8000)                │
│  • Business Logic Layer                                      │
│  • API Orchestration                                         │
│  • Caching (Redis/Memory)                                    │
│  • Data Transformation                                       │
│  • Rate Limiting                                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│          WordPress REST API (Port 8080)                      │
│  • Content Management System                                 │
│  • MySQL Database                                            │
│  • Custom Post Types                                         │
│  • ACF Fields                                                │
│  • Plugins & Themes                                          │
└─────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Next.js Frontend Layer

**Purpose:** Presentation and user interface

**Responsibilities:**
- Rendering React components
- Handling client-side routing
- Managing UI state
- Server-side rendering (SSR)
- Static generation (SSG)
- Image optimization
- Code splitting

**Technologies:**
- Next.js 15 (React 19)
- TypeScript
- Tailwind CSS
- Bun runtime

**Key Files:**
- `frontend/app/` - Next.js app router pages
- `frontend/lib/` - Utility functions
- `components/` - Shared React components

### 2. Python Middleware Layer

**Purpose:** Business logic and API orchestration

**Responsibilities:**
- Fetching data from WordPress API
- Caching responses (in-memory or Redis)
- Transforming/enriching data
- Aggregating multiple data sources
- Rate limiting and throttling
- Custom business logic
- API versioning

**Technologies:**
- FastAPI (Python 3.11+)
- Uvicorn (ASGI server)
- Redis (optional, for caching)
- httpx (for HTTP requests)

**Key Files:**
- `backend/main.py` - API endpoints and logic
- `backend/requirements.txt` - Python dependencies

**Why Python?**
- Excellent for data processing
- Easy integration with ML/AI
- Strong caching libraries
- Clean, readable code
- FastAPI provides automatic API docs

### 3. WordPress CMS Layer

**Purpose:** Content management and storage

**Responsibilities:**
- Content creation and editing
- Media management
- User management
- Custom post types
- Taxonomies
- SEO data
- REST API endpoints

**Technologies:**
- WordPress (latest)
- MySQL 8.0
- PHP
- WordPress plugins

**Key Directories:**
- `wordpress/themes/` - Custom themes
- `wordpress/plugins/` - Custom plugins

## Data Flow

### Read Flow (Getting Posts)

```
User Request
    ↓
Next.js page (SSR/SSG)
    ↓
Fetch from Python API (/posts)
    ↓
Python checks cache
    ├─ Cache hit → Return cached data
    └─ Cache miss → Fetch from WordPress API
           ↓
    WordPress REST API (/wp-json/wp/v2/posts)
           ↓
    Transform data in Python
           ↓
    Cache result
           ↓
    Return to Next.js
           ↓
    Render in React component
           ↓
    Send HTML to browser
```

### Write Flow (Creating Content)

```
Content Editor
    ↓
WordPress Admin (wp-admin)
    ↓
Save to MySQL Database
    ↓
Clear cache (webhook/manual)
    ↓
Python cache invalidated
    ↓
Next.js revalidates (ISR)
    ↓
Fresh content displayed
```

## Caching Strategy

### Layer 1: Browser Cache
- Static assets (images, CSS, JS)
- Controlled by HTTP headers

### Layer 2: Next.js Cache
- Static pages (SSG)
- Incremental Static Regeneration (ISR)
- Configurable revalidation time

### Layer 3: Python Cache
- API responses
- In-memory or Redis
- TTL-based invalidation
- Manual cache clearing endpoint

### Layer 4: WordPress Cache
- Object cache (optional)
- Page cache (not needed for headless)

## Deployment Architecture

### Development

```
Docker Compose
├── WordPress + MySQL (containers)
├── Python API (container or local)
└── Redis (container)

Local Machine
├── Next.js dev server (bun run dev)
└── Python API (optional, if not in Docker)
```

### Production (Recommended)

```
┌─────────────────────────────────────┐
│ CDN (Cloudflare, CloudFront)        │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Next.js on Vercel/Netlify           │
│ • Automatic deployments             │
│ • Edge functions                    │
│ • Image optimization                │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Python API on Railway/Fly.io        │
│ • Auto-scaling                      │
│ • Redis instance                    │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Managed WordPress (WP Engine, etc)  │
│ • MySQL database                    │
│ • Automatic backups                 │
│ • High availability                 │
└─────────────────────────────────────┘
```

## Security Considerations

### API Security

1. **CORS Configuration**
   - Restrict origins in production
   - Configure allowed methods

2. **Rate Limiting**
   - Implement in Python middleware
   - Protect WordPress from abuse

3. **Authentication**
   - JWT tokens for authenticated requests
   - Validate tokens in Python layer

### WordPress Security

1. **Disable XML-RPC** (not needed for REST API)
2. **Use strong passwords**
3. **Keep WordPress updated**
4. **Install security plugins** (Wordfence, iThemes Security)

### Environment Variables

- Never commit `.env` files
- Use secrets management in production
- Rotate credentials regularly

## Performance Optimization

### Next.js Optimizations

1. **Image Optimization**
   ```jsx
   import Image from 'next/image'
   <Image src={url} width={800} height={600} alt="..." />
   ```

2. **Code Splitting**
   - Automatic with Next.js
   - Dynamic imports for heavy components

3. **Static Generation**
   ```typescript
   export const dynamic = 'force-static'
   // or
   export const revalidate = 60 // ISR every 60 seconds
   ```

### Python Optimizations

1. **Async/Await**
   - Use async functions for I/O operations
   - Concurrent requests with `asyncio`

2. **Connection Pooling**
   - Reuse HTTP connections
   - Configure timeouts

3. **Caching**
   - Cache aggressively
   - Set appropriate TTLs

### WordPress Optimizations

1. **Query Optimization**
   - Use `per_page` parameter
   - Limit fields returned

2. **Database Indexing**
   - Index custom fields
   - Optimize custom queries

## Monitoring and Logging

### Application Monitoring

- **Frontend:** Vercel Analytics, Sentry
- **Backend:** FastAPI logging, Sentry
- **WordPress:** Error logs, Query Monitor plugin

### Performance Monitoring

- **Core Web Vitals** - Lighthouse, PageSpeed Insights
- **API Response Times** - FastAPI built-in timing
- **Database Queries** - WordPress Query Monitor

## Scalability

### Horizontal Scaling

- **Frontend:** Edge deployment (Vercel, Cloudflare)
- **Python API:** Multiple instances behind load balancer
- **WordPress:** Read replicas for database

### Vertical Scaling

- **Increase server resources** as needed
- **Optimize before scaling** - caching, queries

### Database Considerations

- **Read replicas** for high-traffic sites
- **Database sharding** for massive scale
- **Regular backups** and disaster recovery

## Testing Strategy

### Frontend Testing

```bash
# Unit tests
bun test

# E2E tests
bun run test:e2e
```

### Backend Testing

```python
# pytest
pytest tests/

# With coverage
pytest --cov=backend tests/
```

### Integration Testing

- Test WordPress → Python → Next.js flow
- Verify cache invalidation
- Test error handling

## Development Best Practices

1. **Use TypeScript** - Type safety in frontend
2. **API versioning** - Version Python endpoints
3. **Error handling** - Graceful degradation
4. **Documentation** - Keep docs updated
5. **Code review** - Review all changes
6. **Testing** - Write tests for critical paths

## File Organization

```
wp-dev/
├── frontend/          # Next.js application
│   ├── app/          # App router pages
│   ├── components/   # Page-specific components
│   └── lib/          # Utilities
│
├── components/       # Shared components library
│   └── *.tsx        # Reusable components
│
├── backend/          # Python API
│   ├── main.py      # Main application
│   ├── routes/      # API routes (future)
│   └── utils/       # Utilities (future)
│
├── wordpress/        # WordPress customizations
│   ├── themes/      # Custom themes
│   └── plugins/     # Custom plugins
│
├── cli/             # CLI tooling
│   ├── bin/         # Executables
│   └── lib/         # Commands
│
└── docs/            # Documentation
```

## Extension Points

### Adding New API Endpoints

1. Edit `backend/main.py`
2. Add new route
3. Implement caching
4. Document endpoint

### Adding Custom Components

1. Use CLI: `bun run cli g:c --name MyComponent`
2. Implement component
3. Export from `components/index.ts`
4. Use in Next.js pages

### Custom WordPress Endpoints

1. Create plugin in `wordpress/plugins/`
2. Register custom REST routes
3. Use from Python API

## Glossary

- **SSR** - Server-Side Rendering
- **SSG** - Static Site Generation
- **ISR** - Incremental Static Regeneration
- **ACF** - Advanced Custom Fields
- **REST API** - REpresentational State Transfer API
- **JWT** - JSON Web Token

## Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [React Best Practices](https://react.dev/learn)

---

For questions about specific implementation details, see other documentation files in `/docs`.
