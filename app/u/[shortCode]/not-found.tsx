import Link from 'next/link'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertCircle className="mx-auto mb-6 text-zinc-600" size={64} />
        <h1 className="text-4xl font-bold mb-4">Link Not Found</h1>
        <p className="text-zinc-400 mb-8">
          This short URL doesn't exist or has been deleted.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium hover:bg-zinc-200 transition"
        >
          <Home size={16} />
          GO HOME
        </Link>
      </div>
    </div>
  )
}