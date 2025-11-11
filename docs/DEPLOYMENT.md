# Deployment Guide

This guide covers deploying your headless WordPress application to production.

## Overview

Your application has three main components that need to be deployed:

1. **Next.js Frontend** - Static site or serverless functions
2. **Python API** - Backend API server
3. **WordPress + MySQL** - Content management system

## Recommended Architecture

```
┌─────────────────────────────────────┐
│ CDN (Cloudflare, CloudFront)        │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Next.js (Vercel, Netlify)           │
│ - Automatic deployments             │
│ - Edge functions                    │
│ - Global CDN                        │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ Python API (Railway, Fly.io)        │
│ - Auto-scaling                      │
│ - Redis cache                       │
│ - Health checks                     │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│ WordPress (WP Engine, Kinsta)       │
│ - Managed hosting                   │
│ - Automatic backups                 │
│ - High availability                 │
│ - Redis object cache                │
└─────────────────────────────────────┘
```

---

## Deploying the Frontend (Next.js)

### Option 1: Vercel (Recommended)

Vercel is built by the creators of Next.js and provides the best integration.

**Steps:**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Configure:
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: bun run build
   Output Directory: .next
   Install Command: bun install
   ```
5. Add environment variables:
   ```
   PYTHON_API_URL=https://your-api.railway.app
   WP_API_URL=https://your-wordpress-site.com/wp-json
   ```
6. Deploy!

**CLI Deployment:**
```bash
cd frontend
vercel --prod
```

### Option 2: Netlify

**Steps:**

1. Connect your GitHub repository
2. Configure build settings:
   ```
   Base directory: frontend
   Build command: bun run build
   Publish directory: frontend/.next
   ```
3. Add environment variables
4. Deploy

### Option 3: AWS Amplify

AWS Amplify also supports Next.js deployments with SSR.

---

## Deploying the Python API

### Option 1: Railway (Recommended)

Railway provides easy deployment with automatic HTTPS.

**Steps:**

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login and create project:
   ```bash
   railway login
   railway init
   ```

3. Create `railway.json` in backend:
   ```json
   {
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

4. Deploy:
   ```bash
   cd backend
   railway up
   ```

5. Add environment variables in Railway dashboard:
   ```
   WP_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
   CACHE_ENABLED=true
   REDIS_URL=redis://...
   ```

### Option 2: Fly.io

**Steps:**

1. Install Fly CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Create `fly.toml` in backend:
   ```toml
   app = "your-app-name"
   primary_region = "iad"
   
   [build]
   
   [env]
   PORT = "8000"
   
   [[services]]
   internal_port = 8000
   protocol = "tcp"
   
   [[services.ports]]
   handlers = ["http"]
   port = 80
   
   [[services.ports]]
   handlers = ["tls", "http"]
   port = 443
   ```

3. Create `Dockerfile` (already exists)

4. Deploy:
   ```bash
   fly launch
   fly deploy
   ```

### Option 3: AWS Lambda (Serverless)

Use Mangum to deploy FastAPI on AWS Lambda.

**Install:**
```bash
pip install mangum
```

**Update main.py:**
```python
from mangum import Mangum

# ... existing code ...

handler = Mangum(app)
```

Deploy using AWS SAM or Serverless Framework.

---

## Deploying WordPress

### Option 1: WP Engine (Recommended)

WP Engine specializes in managed WordPress hosting.

**Features:**
- Automatic backups
- High performance
- Security scanning
- Staging environments
- Redis object cache

**Steps:**
1. Sign up at [wpengine.com](https://wpengine.com)
2. Create a new site
3. Upload your theme and plugins
4. Configure REST API permissions
5. Enable Redis cache

### Option 2: Kinsta

Similar to WP Engine with excellent performance.

### Option 3: DigitalOcean App Platform

More affordable option with good performance.

**Steps:**
1. Create a DigitalOcean account
2. Use App Platform to deploy WordPress
3. Configure managed database
4. Set up automatic backups

### Self-Hosted Option

If you prefer to manage your own server:

**Requirements:**
- VPS (DigitalOcean, Linode, AWS EC2)
- Docker or LEMP stack
- SSL certificate (Let's Encrypt)

**Using Docker:**
```bash
# Use docker-compose.yml from project
docker-compose up -d
```

Configure reverse proxy (nginx) for HTTPS.

---

## Environment Variables

### Frontend (.env.production)

```env
PYTHON_API_URL=https://api.yourdomain.com
WP_API_URL=https://wordpress.yourdomain.com/wp-json
NODE_ENV=production
```

### Backend (.env)

```env
WP_API_URL=https://wordpress.yourdomain.com/wp-json/wp/v2
CACHE_ENABLED=true
REDIS_URL=redis://your-redis-instance
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### WordPress

Configure in WordPress admin or wp-config.php:
```php
define('WP_HOME', 'https://wordpress.yourdomain.com');
define('WP_SITEURL', 'https://wordpress.yourdomain.com');
```

---

## Database Setup

### Production Database

1. **Managed MySQL/PostgreSQL:**
   - AWS RDS
   - DigitalOcean Managed Databases
   - PlanetScale

2. **Backup Strategy:**
   - Daily automated backups
   - Store backups off-site
   - Test restore procedures

3. **Security:**
   - Use strong passwords
   - Restrict IP access
   - Enable SSL connections

---

## Caching Layer

### Redis Setup

**For Railway:**
```bash
railway add redis
```

**For Fly.io:**
```bash
fly redis create
```

**Standalone:**
- Redis Cloud
- AWS ElastiCache
- DigitalOcean Managed Redis

### CDN Configuration

Use a CDN for static assets:

1. **Cloudflare:**
   - Free SSL
   - DDoS protection
   - Global CDN

2. **AWS CloudFront:**
   - Integrated with AWS
   - Edge locations worldwide

3. **Vercel's Edge Network:**
   - Automatic for Vercel deployments

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - name: Install dependencies
        run: cd frontend && bun install
      - name: Build
        run: cd frontend && bun run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

---

## Security Checklist

### Before Production:

- [ ] Enable HTTPS everywhere
- [ ] Set strong WordPress passwords
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up firewall rules
- [ ] Configure security headers
- [ ] Enable WordPress security plugins
- [ ] Set up monitoring and alerts
- [ ] Configure backup automation
- [ ] Review API permissions
- [ ] Enable DDoS protection
- [ ] Set up error logging

### WordPress Security:

```php
// In wp-config.php
define('DISALLOW_FILE_EDIT', true);
define('FORCE_SSL_ADMIN', true);
define('WP_AUTO_UPDATE_CORE', true);
```

### Python API Security:

```python
# Add to main.py
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["yourdomain.com", "*.yourdomain.com"]
)
```

---

## Monitoring

### Application Monitoring

1. **Sentry:**
   ```bash
   # Frontend
   npm install @sentry/nextjs
   
   # Backend
   pip install sentry-sdk[fastapi]
   ```

2. **Uptime Monitoring:**
   - UptimeRobot
   - Pingdom
   - StatusCake

3. **Performance Monitoring:**
   - New Relic
   - Datadog
   - Vercel Analytics

### Log Aggregation

- **Logtail**
- **Papertrail**
- **AWS CloudWatch**

---

## Backup Strategy

### WordPress Backups

1. Database backups (daily)
2. File backups (weekly)
3. Store in S3 or similar
4. Test restore monthly

### Automated Backup Script:

```bash
#!/bin/bash
# backup.sh

# Database backup
docker exec wordpress-db mysqldump -u wordpress -p wordpress > backup_$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup_$(date +%Y%m%d).sql s3://your-bucket/backups/
```

---

## Performance Optimization

### Frontend

1. Enable Next.js caching
2. Optimize images with Next/Image
3. Use CDN for static assets
4. Enable compression
5. Implement service workers

### Backend

1. Redis caching with TTL
2. Database query optimization
3. Connection pooling
4. Response compression
5. Rate limiting

### WordPress

1. Install Redis object cache
2. Enable page caching
3. Optimize database
4. Use image optimization plugins
5. Minimize plugins

---

## Rollback Strategy

### Quick Rollback:

**Vercel:**
```bash
vercel rollback
```

**Railway:**
```bash
railway rollback
```

**Manual:**
Keep previous Docker images tagged:
```bash
docker tag myapp:latest myapp:backup
```

---

## Cost Estimation

### Monthly Costs (approximate):

**Small Site:**
- Frontend (Vercel): Free - $20
- API (Railway): $5 - $20
- WordPress (DigitalOcean): $12 - $24
- Redis: $10 - $15
- **Total: $27 - $79/month**

**Medium Site:**
- Frontend (Vercel Pro): $20
- API (Railway): $20 - $50
- WordPress (WP Engine): $30 - $115
- Redis: $15 - $30
- **Total: $85 - $215/month**

**Large Site:**
- Frontend (Vercel Enterprise): $100+
- API (Dedicated): $50 - $200
- WordPress (WP Engine): $115 - $290
- Redis: $30 - $100
- CDN: $20 - $100
- **Total: $315 - $790/month**

---

## Deployment Checklist

- [ ] Test locally with production environment variables
- [ ] Run security audit
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Test disaster recovery
- [ ] Document deployment process
- [ ] Set up CI/CD pipeline
- [ ] Configure DNS and SSL
- [ ] Test all critical paths
- [ ] Enable error tracking
- [ ] Set up performance monitoring
- [ ] Configure alerts
- [ ] Create runbook for common issues

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [WordPress.org](https://wordpress.org/support/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

---

**Ready to deploy? Start with a staging environment first!**
