/**
 * PageHeader Component
 * Maps to WordPress page/post header patterns
 * 
 * Escape Hatch: Use WordPress when:
 * - Need WordPress breadcrumbs plugins (Yoast, RankMath)
 * - Require SEO meta tags from WordPress plugins
 * - Using WordPress menu systems
 */
import React from 'react'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ label: string; href: string }>
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
}) => {
  return (
    <header className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="text-sm text-gray-600 mb-4">
          {breadcrumbs.map((crumb, index) => (
            <span key={index}>
              {index > 0 && <span className="mx-2">/</span>}
              <a href={crumb.href} className="hover:text-blue-600">
                {crumb.label}
              </a>
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      {subtitle && <p className="text-xl text-gray-600">{subtitle}</p>}
    </header>
  )
}
