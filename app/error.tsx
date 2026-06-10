'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="mx-auto mb-6 text-red-500" size={64} />
        <h2 className="text-3xl font-bold mb-4">Something Went Wrong</h2>
        <p className="text-zinc-400 mb-8">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium hover:bg-zinc-200 transition"
        >
          <RefreshCw size={16} />
          TRY AGAIN
        </button>
      </div>
    </div>
  )
}