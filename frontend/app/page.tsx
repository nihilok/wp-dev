import Link from 'next/link'

async function getPosts() {
  const apiUrl = process.env.PYTHON_API_URL || 'http://localhost:8000'
  
  try {
    const res = await fetch(`${apiUrl}/posts`, {
      next: { revalidate: 60 } // Cache for 60 seconds
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch posts')
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Headless WordPress + Next.js</h1>
        
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Welcome to your headless WordPress template!</h2>
          <p className="text-gray-700">
            This template combines WordPress as a headless CMS with Next.js 15 for the frontend,
            and FastAPI/Python as a middle layer for business logic, caching, and API orchestration.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
          
          {posts.length === 0 ? (
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p>No posts found. Make sure WordPress and the Python API are running.</p>
              <p className="text-sm mt-2">Run: <code className="bg-gray-200 px-2 py-1 rounded">docker-compose up</code></p>
            </div>
          ) : (
            <div className="grid gap-6">
              {posts.map((post: any) => (
                <article key={post.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <Link href={`/posts/${post.slug}`}>
                    <h3 className="text-xl font-semibold mb-2 hover:text-blue-600">{post.title}</h3>
                  </Link>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="text-sm text-gray-500">
                    Published: {new Date(post.date).toLocaleDateString()}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
