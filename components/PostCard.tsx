/**
 * PostCard Component
 * Maps to WordPress post display patterns
 * 
 * Escape Hatch: Use WordPress blocks/plugins when:
 * - Need advanced ACF field types
 * - Require WordPress-specific post meta
 * - Using complex WordPress relationships
 */
import React from 'react'
import Link from 'next/link'

export interface PostCardProps {
  id: number
  title: string
  slug: string
  excerpt: string
  date: string
  author?: string
  featuredImage?: string
}

export const PostCard: React.FC<PostCardProps> = ({
  title,
  slug,
  excerpt,
  date,
  author,
  featuredImage,
}) => {
  return (
    <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {featuredImage && (
        <div className="aspect-video bg-gray-200">
          <img src={featuredImage} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6">
        <Link href={`/posts/${slug}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">{title}</h3>
        </Link>
        <div 
          className="text-gray-600 mb-4" 
          dangerouslySetInnerHTML={{ __html: excerpt }}
        />
        <div className="text-sm text-gray-500">
          <time dateTime={date}>
            {new Date(date).toLocaleDateString()}
          </time>
          {author && <span className="ml-2">• By {author}</span>}
        </div>
      </div>
    </article>
  )
}
