# Component Library Documentation

This document describes the component library that maps to common WordPress patterns.

## Overview

The component library provides React components that correspond to typical WordPress content patterns. Each component is designed to work with data from the WordPress REST API via the Python middleware.

## Available Components

### PostCard

Display a WordPress post in a card format.

**Usage:**
```typescript
import { PostCard } from '@/components'

<PostCard
  id={1}
  title="My Blog Post"
  slug="my-blog-post"
  excerpt="<p>This is the post excerpt...</p>"
  date="2024-01-15T10:30:00"
  author="John Doe"
  featuredImage="https://example.com/image.jpg"
/>
```

**Props:**
- `id` (number) - WordPress post ID
- `title` (string) - Post title
- `slug` (string) - Post slug for URL
- `excerpt` (string) - Post excerpt (HTML)
- `date` (string) - Publication date (ISO format)
- `author` (string, optional) - Author name
- `featuredImage` (string, optional) - Featured image URL

**Escape Hatch:**
Use WordPress blocks/plugins when you need:
- Advanced ACF field types
- WordPress-specific post meta
- Complex WordPress relationships

---

### Navigation

Site navigation menu component.

**Usage:**
```typescript
import { Navigation } from '@/components'

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
]

<Navigation
  items={menuItems}
  siteName="My Site"
  logo="/logo.png"
/>
```

**Props:**
- `items` (MenuItem[]) - Array of menu items
- `siteName` (string) - Site name for branding
- `logo` (string, optional) - Logo image URL

**MenuItem Interface:**
```typescript
interface MenuItem {
  label: string
  href: string
  children?: MenuItem[]
}
```

**Escape Hatch:**
Use WordPress menus when you need:
- Dynamic menu management via WordPress admin
- WordPress menu walker customization
- Mega menus or complex WordPress plugins

---

### PageHeader

Page header with title, subtitle, and breadcrumbs.

**Usage:**
```typescript
import { PageHeader } from '@/components'

<PageHeader
  title="About Us"
  subtitle="Learn more about our company"
  breadcrumbs={[
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' }
  ]}
/>
```

**Props:**
- `title` (string) - Page title
- `subtitle` (string, optional) - Page subtitle
- `breadcrumbs` (Breadcrumb[], optional) - Breadcrumb navigation

**Breadcrumb Interface:**
```typescript
interface Breadcrumb {
  label: string
  href: string
}
```

**Escape Hatch:**
Use WordPress when you need:
- WordPress breadcrumbs plugins (Yoast, RankMath)
- SEO meta tags from WordPress plugins
- WordPress menu systems

---

## Creating Custom Components

### Using the CLI

```bash
bun run cli generate:component --name MyComponent --type post
```

This will:
1. Create a new component file in `components/`
2. Add appropriate TypeScript interfaces
3. Include escape hatch documentation
4. Export from `components/index.ts`

### Manual Creation

1. Create a new `.tsx` file in `components/`
2. Follow the template structure:

```typescript
/**
 * ComponentName Component
 * Description of what this component does
 * 
 * Escape Hatch: Use WordPress when:
 * - Specific WordPress functionality needed
 * - Complex WordPress integrations
 */
import React from 'react'

export interface ComponentNameProps {
  // Define props
}

export const ComponentName: React.FC<ComponentNameProps> = (props) => {
  return (
    <div className="component-name">
      {/* Component JSX */}
    </div>
  )
}
```

3. Export from `components/index.ts`:

```typescript
export { ComponentName } from './ComponentName'
export type { ComponentNameProps } from './ComponentName'
```

## Styling Guidelines

All components use Tailwind CSS utility classes:

```typescript
// Good: Utility classes
<div className="border rounded-lg p-6 hover:shadow-lg">

// Avoid: Custom CSS classes (unless necessary)
<div className="custom-card">
```

### Common Patterns

**Cards:**
```typescript
<div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
```

**Headings:**
```typescript
<h1 className="text-4xl font-bold mb-4">
<h2 className="text-2xl font-semibold mb-2">
```

**Spacing:**
```typescript
<div className="p-6">      // Padding
<div className="mb-4">     // Margin bottom
<div className="space-y-4"> // Vertical spacing between children
```

**Responsive:**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

## Component Organization

### File Structure

```
components/
├── PostCard.tsx        # Post display component
├── Navigation.tsx      # Navigation component
├── PageHeader.tsx      # Page header component
├── index.ts           # Export all components
└── README.md          # Component documentation
```

### Naming Conventions

- **Component files**: PascalCase (e.g., `PostCard.tsx`)
- **Component names**: PascalCase (e.g., `PostCard`)
- **Props interfaces**: ComponentNameProps (e.g., `PostCardProps`)
- **CSS classes**: kebab-case (e.g., `post-card`)

## TypeScript Best Practices

### Props Definition

Always define explicit prop interfaces:

```typescript
export interface MyComponentProps {
  title: string              // Required prop
  subtitle?: string          // Optional prop
  items: string[]           // Array prop
  onAction: () => void      // Function prop
}
```

### Component Definition

Use React.FC for consistent typing:

```typescript
export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  subtitle,
  items,
  onAction,
}) => {
  // Component logic
}
```

## Data Integration

### Fetching WordPress Data

Components receive data from Next.js pages that fetch from the Python API:

```typescript
// In a Next.js page
async function getPosts() {
  const res = await fetch(`${process.env.PYTHON_API_URL}/posts`)
  return res.json()
}

export default async function Page() {
  const posts = await getPosts()
  
  return (
    <>
      {posts.map(post => (
        <PostCard key={post.id} {...post} />
      ))}
    </>
  )
}
```

### Data Transformation

The Python middleware handles data transformation:

```python
# In backend/main.py
@app.get("/posts")
async def get_posts():
    posts = await fetch_from_wordpress("posts")
    
    # Transform for React components
    return [{
        "id": post["id"],
        "title": post["title"]["rendered"],
        "slug": post["slug"],
        "excerpt": post["excerpt"]["rendered"],
        # ...
    } for post in posts]
```

## Component Categories

### WordPress Pattern Components

Components that map directly to WordPress concepts:
- `PostCard` - WordPress posts
- `PageHeader` - WordPress pages
- `Navigation` - WordPress menus
- (Future) `CategoryList`, `TagCloud`, `Archive`

### UI Components

General-purpose UI components:
- Buttons
- Forms
- Modals
- Alerts

### Layout Components

Page layout components:
- Header
- Footer
- Sidebar
- Container

## Testing Components

```typescript
import { render, screen } from '@testing-library/react'
import { PostCard } from './PostCard'

describe('PostCard', () => {
  it('renders post title', () => {
    render(
      <PostCard
        id={1}
        title="Test Post"
        slug="test-post"
        excerpt="Test excerpt"
        date="2024-01-01"
      />
    )
    
    expect(screen.getByText('Test Post')).toBeInTheDocument()
  })
})
```

## Accessibility

All components should follow accessibility best practices:

- Use semantic HTML elements
- Include ARIA labels where appropriate
- Ensure keyboard navigation
- Maintain color contrast
- Support screen readers

Example:
```typescript
<article aria-label="Blog post">
  <h2 id="post-title">{title}</h2>
  <time dateTime={date} aria-label="Publication date">
    {formatDate(date)}
  </time>
</article>
```

## Performance Optimization

### Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image'

<Image
  src={featuredImage}
  alt={title}
  width={800}
  height={600}
  className="w-full h-full object-cover"
/>
```

### Dynamic Imports

For heavy components:

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>
})
```

## Future Components

Planned components for the library:

- **CategoryList** - Display post categories
- **TagCloud** - Tag cloud widget
- **SearchBar** - Search functionality
- **Pagination** - Post pagination
- **CommentList** - Display comments
- **AuthorCard** - Author information
- **RelatedPosts** - Related content
- **Newsletter** - Newsletter signup
- **SocialShare** - Social sharing buttons

## Contributing Components

When contributing new components:

1. Follow the naming conventions
2. Include TypeScript interfaces
3. Add escape hatch documentation
4. Use Tailwind CSS
5. Write tests
6. Update this documentation
7. Export from index.ts

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

---

For questions about specific components, refer to the inline documentation in each component file.
