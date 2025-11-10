import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getPost(slug: string) {
  const apiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000'
  
  try {
    const res = await fetch(`${apiUrl}/posts/${slug}`, {
      next: { revalidate: 60 }
    })
    
    if (!res.ok) {
      return null
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to home
        </Link>
        
        <article className="mt-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="text-gray-600 mb-8">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            {post.author && <span className="ml-4">By {post.author}</span>}
          </div>
          
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </main>
  )
}
