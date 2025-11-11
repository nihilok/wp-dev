/**
 * Navigation Component
 * Maps to WordPress navigation menu patterns
 * 
 * Escape Hatch: Use WordPress menus when:
 * - Need dynamic menu management via WordPress admin
 * - Require WordPress menu walker customization
 * - Using mega menus or complex WordPress plugins
 */
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export interface MenuItem {
  label: string
  href: string
  children?: MenuItem[]
}

export interface NavigationProps {
  items: MenuItem[]
  logo?: string
  siteName: string
}

export const Navigation: React.FC<NavigationProps> = ({
  items,
  logo,
  siteName,
}) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {logo ? (
              <div className="relative h-8 w-32">
                <Image 
                  src={logo} 
                  alt={`${siteName} logo`}
                  fill
                  className="object-contain"
                  sizes="128px"
                />
              </div>
            ) : (
              <span className="text-xl font-bold">{siteName}</span>
            )}
          </div>
          <ul className="flex space-x-8">
            {items.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}
