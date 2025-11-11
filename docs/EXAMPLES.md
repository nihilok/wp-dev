# Examples and Use Cases

This document provides practical examples of using the headless WordPress template.

## Basic Examples

### Example 1: Simple Blog Homepage

```typescript
// frontend/app/page.tsx
import { PostCard } from '@/components'

async function getPosts() {
  const apiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000'
  const res = await fetch(`${apiUrl}/posts`, {
    next: { revalidate: 60 }
  })
  return res.json()
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Latest Posts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: any) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            slug={post.slug}
            excerpt={post.excerpt}
            date={post.date}
            author={post.author_name}
            featuredImage={post.featured_image_url}
          />
        ))}
      </div>
    </main>
  )
}
```

### Example 2: Post Detail with Related Posts

```typescript
// frontend/app/posts/[slug]/page.tsx
import { PostCard } from '@/components'

async function getPost(slug: string) {
  const apiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000'
  const res = await fetch(`${apiUrl}/posts/${slug}`)
  if (!res.ok) return null
  return res.json()
}

async function getRelatedPosts(postId: number) {
  const apiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000'
  const res = await fetch(`${apiUrl}/posts?exclude=${postId}&per_page=3`)
  return res.json()
}

export default async function PostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    notFound()
  }
  
  const relatedPosts = await getRelatedPosts(post.id)

  return (
    <article className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      
      <div className="prose max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>
      
      {relatedPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((related: any) => (
              <PostCard key={related.id} {...related} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
```

### Example 3: Custom Navigation with WordPress Menu

```typescript
// frontend/app/layout.tsx
import { Navigation } from '@/components'

async function getMenu() {
  const apiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000'
  const res = await fetch(`${apiUrl}/menu/primary`)
  return res.json()
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const menuItems = await getMenu()

  return (
    <html lang="en">
      <body>
        <Navigation
          items={menuItems}
          siteName="My Headless Site"
          logo="/logo.png"
        />
        {children}
      </body>
    </html>
  )
}
```

---

## Advanced Examples

### Example 4: Search Functionality

```typescript
// frontend/app/search/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { PostCard } from '@/components'
import { useSearchParams } from 'next/navigation'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query) return

    async function search() {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000'
      const res = await fetch(`${apiUrl}/search?q=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResults(data.results)
      setLoading(false)
    }

    search()
  }, [query])

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Search Results for "{query}"
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((post: any) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      )}
    </main>
  )
}
```

### Example 5: Category Archive

```typescript
// frontend/app/category/[slug]/page.tsx
import { PostCard, PageHeader } from '@/components'

async function getCategory(slug: string) {
  const wpUrl = process.env.WP_API_URL || 'http://localhost:8080/wp-json'
  const res = await fetch(`${wpUrl}/wp/v2/categories?slug=${slug}`)
  const categories = await res.json()
  return categories[0]
}

async function getCategoryPosts(categoryId: number) {
  const apiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000'
  const res = await fetch(`${apiUrl}/posts?categories=${categoryId}`)
  return res.json()
}

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const category = await getCategory(slug)
  
  if (!category) {
    notFound()
  }
  
  const posts = await getCategoryPosts(category.id)

  return (
    <main className="container mx-auto px-4 py-8">
      <PageHeader
        title={category.name}
        subtitle={category.description}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Categories', href: '/categories' },
          { label: category.name, href: `/category/${slug}` }
        ]}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post: any) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
    </main>
  )
}
```

### Example 6: Custom Python API Endpoint

```python
# backend/main.py - Add custom endpoint

@app.get("/posts/trending")
async def get_trending_posts():
    """
    Get trending posts based on custom logic
    This demonstrates business logic in the Python layer
    """
    # Fetch recent posts
    posts = await fetch_from_wordpress("posts?per_page=20&orderby=date")
    
    # Custom logic: Score posts based on recency and comment count
    for post in posts:
        days_old = (datetime.now() - datetime.fromisoformat(post['date'])).days
        recency_score = max(0, 7 - days_old)
        comment_score = post.get('comment_count', 0) * 2
        post['trending_score'] = recency_score + comment_score
    
    # Sort by trending score
    trending = sorted(posts, key=lambda x: x.get('trending_score', 0), reverse=True)[:5]
    
    # Transform for frontend
    return [
        {
            "id": post["id"],
            "title": post["title"]["rendered"],
            "slug": post["slug"],
            "excerpt": post["excerpt"]["rendered"],
            "trending_score": post.get('trending_score', 0)
        }
        for post in trending
    ]
```

### Example 7: Using ACF Fields

**WordPress Setup:**
1. Install Advanced Custom Fields plugin
2. Create a field group "Product Fields"
3. Add fields: price, sku, stock_status

**Python Middleware:**
```python
# backend/main.py

@app.get("/products")
async def get_products():
    """Get products with ACF fields"""
    products = await fetch_from_wordpress("posts?post_type=product")
    
    # ACF fields are in the 'acf' key
    return [
        {
            "id": product["id"],
            "title": product["title"]["rendered"],
            "slug": product["slug"],
            "price": product.get("acf", {}).get("price"),
            "sku": product.get("acf", {}).get("sku"),
            "stock_status": product.get("acf", {}).get("stock_status"),
        }
        for product in products
    ]
```

**React Component:**
```typescript
// components/ProductCard.tsx

interface ProductCardProps {
  id: number
  title: string
  slug: string
  price: number
  sku: string
  stock_status: 'in_stock' | 'out_of_stock'
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  slug,
  price,
  sku,
  stock_status
}) => {
  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-2">SKU: {sku}</p>
      <p className="text-2xl font-bold text-green-600 mb-4">
        ${price.toFixed(2)}
      </p>
      <span className={`px-3 py-1 rounded ${
        stock_status === 'in_stock' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {stock_status === 'in_stock' ? 'In Stock' : 'Out of Stock'}
      </span>
      <Link 
        href={`/products/${slug}`}
        className="block mt-4 text-blue-600 hover:underline"
      >
        View Details →
      </Link>
    </div>
  )
}
```

### Example 8: Pagination

```typescript
// frontend/app/blog/page.tsx

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const currentPage = parseInt(params.page || '1')
  const perPage = 9
  
  const apiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000'
  const res = await fetch(
    `${apiUrl}/posts?per_page=${perPage}&page=${currentPage}`
  )
  const posts = await res.json()
  
  // Get total pages from headers
  const totalPosts = parseInt(res.headers.get('X-WP-Total') || '0')
  const totalPages = Math.ceil(totalPosts / perPage)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {posts.map((post: any) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center gap-2">
        {currentPage > 1 && (
          <Link 
            href={`/blog?page=${currentPage - 1}`}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Previous
          </Link>
        )}
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Link
            key={page}
            href={`/blog?page=${page}`}
            className={`px-4 py-2 border rounded ${
              page === currentPage 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-100'
            }`}
          >
            {page}
          </Link>
        ))}
        
        {currentPage < totalPages && (
          <Link 
            href={`/blog?page=${currentPage + 1}`}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Next
          </Link>
        )}
      </div>
    </main>
  )
}
```

### Example 9: Caching Strategy with Redis

```python
# backend/main.py - Enhanced caching with Redis

import redis
import json
from typing import Optional

# Redis client
redis_client = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))

async def get_cached_data(key: str) -> Optional[dict]:
    """Get data from Redis cache"""
    try:
        data = redis_client.get(key)
        if data:
            return json.loads(data)
    except Exception as e:
        print(f"Redis error: {e}")
    return None

async def set_cached_data(key: str, value: dict, ttl: int = 300):
    """Set data in Redis cache with TTL"""
    try:
        redis_client.setex(key, ttl, json.dumps(value))
    except Exception as e:
        print(f"Redis error: {e}")

@app.get("/posts")
async def get_posts_cached(per_page: int = 10, page: int = 1):
    """Get posts with Redis caching"""
    cache_key = f"posts_{per_page}_{page}"
    
    # Check cache
    cached = await get_cached_data(cache_key)
    if cached:
        return {"source": "cache", "data": cached}
    
    # Fetch from WordPress
    posts = await fetch_from_wordpress(f"posts?per_page={per_page}&page={page}")
    
    # Transform
    transformed = [transform_post(post) for post in posts]
    
    # Cache for 5 minutes
    await set_cached_data(cache_key, transformed, ttl=300)
    
    return {"source": "wordpress", "data": transformed}
```

### Example 10: Authentication with JWT

```python
# backend/main.py - JWT authentication

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token from WordPress"""
    try:
        token = credentials.credentials
        # Verify with WordPress JWT secret
        payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

@app.get("/posts/private")
async def get_private_posts(user = Depends(verify_token)):
    """Protected endpoint requiring authentication"""
    # Only authenticated users can access
    posts = await fetch_from_wordpress("posts?status=private")
    return posts
```

---

## CLI Examples

### Generate Components

```bash
# Generate a custom post component
bun run cli generate:component --name BlogPost --type post

# Generate a page component
bun run cli generate:component --name AboutPage --type page

# Generate a block component
bun run cli generate:component --name HeroBlock --type block

# Generate a custom component
bun run cli generate:component --name CustomWidget --type custom
```

### Deployment

```bash
# Deploy to development
bun run cli deploy --env dev

# Build and deploy to production
bun run cli deploy --env production --build

# Deploy to staging
bun run cli deploy --env staging
```

---

## Testing Examples

### Frontend Testing (Jest)

```typescript
// frontend/__tests__/PostCard.test.tsx

import { render, screen } from '@testing-library/react'
import { PostCard } from '@/components'

describe('PostCard', () => {
  const mockPost = {
    id: 1,
    title: 'Test Post',
    slug: 'test-post',
    excerpt: '<p>Test excerpt</p>',
    date: '2024-01-01T00:00:00',
  }

  it('renders post title', () => {
    render(<PostCard {...mockPost} />)
    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })

  it('renders post link', () => {
    render(<PostCard {...mockPost} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/posts/test-post')
  })
})
```

### Backend Testing (pytest)

```python
# backend/test_main.py

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_posts_endpoint():
    """Test posts endpoint"""
    response = client.get("/posts")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

---

## WordPress Plugin Examples

### Custom Endpoint in WordPress

```php
// wordpress/plugins/custom-api/custom-api.php

<?php
/*
Plugin Name: Custom API Endpoints
*/

add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/featured', array(
        'methods' => 'GET',
        'callback' => 'get_featured_posts',
    ));
});

function get_featured_posts() {
    $args = array(
        'post_type' => 'post',
        'meta_key' => 'featured',
        'meta_value' => '1',
        'posts_per_page' => 5,
    );
    
    $query = new WP_Query($args);
    $posts = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $posts[] = array(
                'id' => get_the_ID(),
                'title' => get_the_title(),
                'link' => get_permalink(),
            );
        }
    }
    
    return $posts;
}
```

---

## Production Tips

1. **Use ISR for blog posts**: Set `revalidate: 60` for automatic regeneration
2. **Cache aggressively**: Cache WordPress responses for 5-10 minutes
3. **Monitor API usage**: Track WordPress API calls to avoid overload
4. **Use CDN**: Serve static assets from CDN
5. **Optimize images**: Use Next/Image for automatic optimization
6. **Error boundaries**: Add error handling for graceful degradation
7. **Loading states**: Show loading indicators for better UX

---

## Common Patterns

### Pattern: Load More Posts

```typescript
'use client'

export function LoadMorePosts() {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  async function loadMore() {
    setLoading(true)
    const res = await fetch(`/api/posts?page=${page + 1}`)
    const newPosts = await res.json()
    setPosts([...posts, ...newPosts])
    setPage(page + 1)
    setLoading(false)
  }

  return (
    <>
      {posts.map(post => <PostCard key={post.id} {...post} />)}
      <button onClick={loadMore} disabled={loading}>
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </>
  )
}
```

---

For more examples, check the [GitHub repository](https://github.com/nihilok/wp-dev) and [documentation](./GETTING_STARTED.md).
