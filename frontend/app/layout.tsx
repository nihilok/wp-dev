import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Headless WordPress + Next.js',
  description: 'A modern headless WordPress setup with Next.js, Python middleware, and React components',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  )
}
