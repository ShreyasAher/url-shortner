import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-linear-to-br from-red-50 to-orange-100 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-4">🔍</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Link Not Found
        </h1>
        <p className="text-gray-600 mb-6">
          This short URL doesn't exist or has been deleted.
        </p>
        <Link 
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          ← Create a Short URL
        </Link>
      </div>
    </main>
  )
}